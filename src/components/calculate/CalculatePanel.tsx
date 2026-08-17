"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ImportCostResult } from "@/lib/amgims";
import { FreightModeSelect } from "@/components/forms/FreightModeSelect";
import {
  aggregateGroup,
  groupProductsByHs,
  isSeaMode,
  sumImportResults,
} from "@/lib/import-docs/aggregateProducts";
import {
  emptyProductLine,
  parseTabularFile,
  totalCbmForLine,
  type ProductLine,
} from "@/lib/import-docs/parsePackingList";
import { trackEvent } from "@/lib/analytics";

const LEAD_STORAGE_KEY = "amg-import-cost-lead";

type SavedLead = {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  country?: string;
  unlockedAt: string;
};

function readSavedLead(): SavedLead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedLead>;
    const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
    if (!name) return null;
    return {
      name,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      phone: typeof parsed.phone === "string" ? parsed.phone : undefined,
      companyName:
        typeof parsed.companyName === "string" ? parsed.companyName : undefined,
      country: typeof parsed.country === "string" ? parsed.country : undefined,
      unlockedAt:
        typeof parsed.unlockedAt === "string"
          ? parsed.unlockedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function writeSavedLead(lead: Omit<SavedLead, "unlockedAt">) {
  if (typeof window === "undefined") return;
  try {
    const payload: SavedLead = {
      ...lead,
      name: lead.name.trim(),
      unlockedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
}

/** Accepts +E.164 or local numbers with 8–15 digits (spaces/dashes/parentheses allowed). */
function isValidPhone(phone: string): boolean {
  const cleaned = phone.trim().replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("+")) {
    return /^\+[1-9]\d{7,14}$/.test(cleaned);
  }
  return /^[0-9]{8,15}$/.test(cleaned);
}

export function CalculatePanel() {
  const t = useTranslations("calculate");
  const tf = useTranslations("forms");
  const tc = useTranslations("common");

  const [products, setProducts] = useState<ProductLine[]>([emptyProductLine()]);
  const [mode, setMode] = useState("");
  const [originCountry, setOriginCountry] = useState("CN");
  const [destinationCountry, setDestinationCountry] = useState("UG");
  const [destinationCity, setDestinationCity] = useState("Kampala");
  const [insurance, setInsurance] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState("UGX");
  const [vatExempt, setVatExempt] = useState(false);
  const [fullyTaxExempt, setFullyTaxExempt] = useState(false);
  const [hsSuggestions, setHsSuggestions] = useState<
    Record<
      string,
      Array<{ hsCode: string; description: string; confidence: number }>
    >
  >({});

  async function suggestHsForProduct(
    productId: string,
    descriptionOverride?: string,
  ) {
    const product = products.find((p) => p.id === productId);
    const description = (
      descriptionOverride ??
      product?.description ??
      ""
    ).trim();
    if (!description) {
      setHsSuggestions((prev) => ({ ...prev, [productId]: [] }));
      return;
    }
    try {
      const res = await fetch("/api/hs-classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          country: destinationCountry || "UG",
        }),
      });
      const json = await res.json();
      if (!res.ok) return;
      const data = json.data as {
        autoAccepted?: boolean;
        suggestedHSCode?: string | null;
        confidence?: number;
        requiresChoice?: boolean;
        candidates?: Array<{
          hsCode: string;
          description: string;
          confidence: number;
        }>;
      };
      const candidates = (data.candidates || []).slice(0, 5);
      setHsSuggestions((prev) => ({
        ...prev,
        [productId]: candidates,
      }));
      const currentHs = product?.hsCode?.trim() || "";
      if (data.autoAccepted && data.suggestedHSCode && !currentHs) {
        updateProduct(productId, { hsCode: data.suggestedHSCode });
      }
    } catch {
      /* ignore classify failures on blur */
    }
  }

  async function chooseHs(
    productId: string,
    hsCode: string,
    confidence?: number,
  ) {
    const product = products.find((p) => p.id === productId);
    const previousHs = product?.hsCode?.trim() || undefined;
    const suggestedFromList =
      hsSuggestions[productId]?.[0]?.hsCode || previousHs;
    updateProduct(productId, { hsCode });
    setHsSuggestions((prev) => ({ ...prev, [productId]: [] }));
    if (!product) return;
    try {
      await fetch("/api/hs-classify-override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: product.description,
          country: destinationCountry || "UG",
          suggestedHsCode: suggestedFromList,
          selectedHsCode: hsCode,
          confidence,
        }),
      });
    } catch {
      /* pending learning is best-effort */
    }
  }

  function onDescriptionChange(productId: string, value: string) {
    updateProduct(productId, { description: value, hsCode: "" });
    setHsSuggestions((prev) => ({ ...prev, [productId]: [] }));
  }

  const [cargoPayload, setCargoPayload] = useState<Record<string, unknown> | null>(
    null,
  );
  const [leadUnlocked, setLeadUnlocked] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadCountry, setLeadCountry] = useState("");
  const [result, setResult] = useState<ImportCostResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");
  const [taxesOpen, setTaxesOpen] = useState(false);

  useEffect(() => {
    const saved = readSavedLead();
    if (!saved) return;
    setLeadName(saved.name);
    setLeadEmail(saved.email || "");
    setLeadPhone(saved.phone || "");
    setLeadCompany(saved.companyName || "");
    setLeadCountry(saved.country || "");
  }, []);

  const sea = isSeaMode(mode);
  const totalCbm = useMemo(
    () => products.reduce((s, p) => s + totalCbmForLine(p), 0),
    [products],
  );
  const hasSavedLead = leadName.trim().length > 0;

  function updateProduct(id: string, patch: Partial<ProductLine>) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  }

  function addProduct() {
    setProducts((prev) => [...prev, emptyProductLine()]);
  }

  function removeProduct(id: string) {
    setProducts((prev) =>
      prev.length <= 1 ? prev : prev.filter((p) => p.id !== id),
    );
  }

  async function onUpload(
    file: File | null,
    kind: "packing" | "invoice",
  ) {
    if (!file) return;
    setUploadMsg("");
    const name = file.name.toLowerCase();
    const isTabular =
      name.endsWith(".csv") ||
      name.endsWith(".xlsx") ||
      name.endsWith(".xls");

    if (!isTabular) {
      setUploadMsg(t("uploadPdfNote"));
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const parsed = parseTabularFile(buffer, file.name);
      if (!parsed.products.length) {
        setUploadMsg(t("uploadEmpty"));
        return;
      }
      setProducts((prev) =>
        kind === "packing" ? parsed.products : [...prev, ...parsed.products],
      );
      setUploadMsg(
        t("uploadSuccess", {
          count: parsed.products.length,
          missingHs: parsed.missingHsCount,
        }),
      );
    } catch {
      setUploadMsg(t("uploadError"));
    }
  }

  async function runEstimate(
    payload: Record<string, unknown>,
    lead: {
      name: string;
      email?: string;
      phone?: string;
      companyName?: string;
      country?: string;
    },
  ) {
    setStatus("loading");
    setError("");
    trackEvent("lead_submit", { lead_type: "IMPORT_COST" });
    try {
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "IMPORT_COST",
          ...lead,
          payload,
        }),
      });
      const leadJson = await leadRes.json();
      if (!leadRes.ok) throw new Error(leadJson.error || "Lead failed");

      const groups =
        (payload.groups as ReturnType<typeof aggregateGroup>[]) || [];
      const results: ImportCostResult[] = [];
      for (const group of groups) {
        const calcRes = await fetch("/api/import-cost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(group),
        });
        const calcJson = await calcRes.json();
        if (!calcRes.ok) throw new Error(calcJson.error || "Calculate failed");
        results.push(calcJson.data);
      }

      writeSavedLead(lead);
      setLeadName(lead.name);
      setLeadEmail(lead.email || "");
      setLeadPhone(lead.phone || "");
      setLeadCompany(lead.companyName || "");
      setLeadCountry(lead.country || "");
      setResult(sumImportResults(results));
      setLeadUnlocked(true);
      setStatus("idle");
      trackEvent("lead_success", { lead_type: "IMPORT_COST" });
      trackEvent("calculate_success", { mode: String(payload.mode || "") });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : tc("error"));
      setLeadUnlocked(false);
      trackEvent("lead_error", { lead_type: "IMPORT_COST" });
    }
  }

  function onCargoSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!mode) {
      setError(t("modeRequired"));
      return;
    }
    if (!originCountry.trim() || !destinationCountry.trim()) {
      setError(t("corridorRequired"));
      return;
    }

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const n = i + 1;
      if (!p.description.trim()) {
        setError(t("descriptionRequired", { n }));
        return;
      }
      if (!(p.actualWeightKg > 0)) {
        setError(t("weightRequired", { n }));
        return;
      }
      if (sea) {
        if (!(p.lengthCm > 0 && p.widthCm > 0 && p.heightCm > 0)) {
          setError(t("seaDimsRequired"));
          return;
        }
      }
    }

    const taxExemption = fullyTaxExempt
      ? "FULLY_EXEMPT"
      : vatExempt
        ? "VAT_EXEMPT"
        : "NONE";

    const shared = {
      mode,
      originCountry,
      destinationCountry,
      destinationCity: destinationCity || undefined,
      insurance,
      displayCurrency,
      taxExemption: taxExemption as "NONE" | "VAT_EXEMPT" | "FULLY_EXEMPT",
    };

    const groups = groupProductsByHs(products);
    const payloads = [...groups.values()].map((lines) =>
      aggregateGroup(lines, shared),
    );

    const payload = {
      ...shared,
      operatingCurrency: "USD",
      currency: displayCurrency,
      products,
      groups: payloads,
      totalCbm,
    };
    setCargoPayload(payload);
    setResult(null);

    if (hasSavedLead) {
      const email = leadEmail.trim();
      const phone = leadPhone.trim();
      if (!isValidEmail(email)) {
        setLeadUnlocked(false);
        setError(t("invalidEmail"));
        return;
      }
      if (!isValidPhone(phone)) {
        setLeadUnlocked(false);
        setError(t("invalidPhone"));
        return;
      }
      setLeadUnlocked(true);
      void runEstimate(payload, {
        name: leadName.trim(),
        email,
        phone,
        companyName: leadCompany.trim() || undefined,
        country: leadCountry.trim() || undefined,
      });
      return;
    }

    setLeadUnlocked(false);
  }

  async function onLeadSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cargoPayload) return;
    const name = leadName.trim();
    const email = leadEmail.trim();
    const phone = leadPhone.trim();
    if (!name) {
      setError(t("leadNameRequired"));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t("invalidEmail"));
      return;
    }
    if (!isValidPhone(phone)) {
      setError(t("invalidPhone"));
      return;
    }
    await runEstimate(cargoPayload, {
      name,
      email,
      phone,
      companyName: leadCompany.trim() || undefined,
      country: leadCountry.trim() || undefined,
    });
  }

  const usedFxRate =
    result?.displayExchangeRate ?? result?.exchangeRate ?? null;
  const missingProductValue = products.some((p) => !(p.productValue > 0));
  const taxLines = (result?.lines || []).filter((l) => {
    const type = (l.chargeType || "").toUpperCase();
    return type === "TAX" || type === "DUTY";
  });
  const extraLogistics = (result?.lines || []).filter((l) => {
    const type = (l.chargeType || "").toUpperCase();
    return !["TAX", "DUTY", "FREIGHT", "FUEL"].includes(type);
  });
  const totalWeightKg =
    result?.chargeableWeightKg != null && result.chargeableWeightKg > 0
      ? result.chargeableWeightKg
      : products.reduce(
          (s, p) =>
            s + Number(p.actualWeightKg || 0) * Math.max(1, Number(p.quantity) || 1),
          0,
        );

  /** Logistics + taxes/duty only (excludes product/FOB value). */
  const estimatedImportCost = result
    ? result.lines.reduce((sum, line) => sum + (Number(line.amount) || 0), 0)
    : 0;

  return (
    <div className="calc-compact grid gap-3 lg:grid-cols-2 lg:items-start lg:gap-4">
      <form
        onSubmit={onCargoSubmit}
        className="grid gap-2.5 rounded-xl border border-[color:var(--line)] bg-white p-3 md:p-4"
      >
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-[color:var(--surface)] px-2.5 py-2 text-xs text-[color:var(--muted)]">
          <span className="font-medium text-[color:var(--navy)]">
            {t("uploadTitle")}
          </span>
          <label className="btn-ghost cursor-pointer">
            {t("uploadPacking")}
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.pdf,image/*"
              className="hidden"
              onChange={(e) => {
                void onUpload(e.target.files?.[0] || null, "packing");
                e.target.value = "";
              }}
            />
          </label>
          <label className="btn-ghost cursor-pointer">
            {t("uploadInvoice")}
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.pdf,image/*"
              className="hidden"
              onChange={(e) => {
                void onUpload(e.target.files?.[0] || null, "invoice");
                e.target.value = "";
              }}
            />
          </label>
          <a
            href="/samples/packing-list-sample.csv"
            download
            className="font-semibold text-[color:var(--navy-light)] hover:text-[color:var(--gold)]"
          >
            {t("downloadSample")}
          </a>
          {uploadMsg ? (
            <span className="basis-full text-[color:var(--navy)]">{uploadMsg}</span>
          ) : (
            <span className="basis-full opacity-80 md:basis-auto">
              {t("uploadHeaders")}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div>
            <label className="label" htmlFor="mode">
              {tf("mode")}
            </label>
            <FreightModeSelect
              id="mode"
              name="mode"
              required
              originCountry={originCountry}
              destinationCountry={destinationCountry}
              value={mode}
              onChange={setMode}
            />
          </div>
          <div>
            <label className="label">{tf("originCountry")}</label>
            <input
              className="field"
              required
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label className="label">{tf("destinationCountry")}</label>
            <input
              className="field"
              required
              value={destinationCountry}
              onChange={(e) =>
                setDestinationCountry(e.target.value.toUpperCase())
              }
            />
          </div>
          <div>
            <label className="label">{tf("destinationCity")}</label>
            <input
              className="field"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="displayCurrency">
              {tf("displayCurrency")}
            </label>
            <select
              id="displayCurrency"
              className="field"
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value)}
            >
              <option value="UGX">UGX</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="KES">KES</option>
              <option value="CNY">CNY</option>
            </select>
          </div>
          <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-4">
            <label className="inline-flex items-center gap-2 text-xs text-[color:var(--navy)]">
              <input
                type="checkbox"
                checked={insurance}
                onChange={(e) => setInsurance(e.target.checked)}
              />
              {tf("insurance")}
            </label>
            <label className="inline-flex items-center gap-2 text-xs text-[color:var(--navy)]">
              <input
                type="checkbox"
                checked={vatExempt}
                onChange={(e) => {
                  const on = e.target.checked;
                  setVatExempt(on);
                  if (on) setFullyTaxExempt(false);
                }}
              />
              {tf("vatExempt")}
            </label>
            <label className="inline-flex items-center gap-2 text-xs text-[color:var(--navy)]">
              <input
                type="checkbox"
                checked={fullyTaxExempt}
                onChange={(e) => {
                  const on = e.target.checked;
                  setFullyTaxExempt(on);
                  if (on) setVatExempt(false);
                }}
              />
              {tf("fullyTaxExempt")}
            </label>
            {sea ? (
              <p className="ml-auto text-xs text-[color:var(--navy)]">
                {t("seaCbmHint")}{" "}
                <strong>
                  {totalCbm.toFixed(3)} {t("cbmUnit")}
                </strong>
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
              {t("products")}
            </h3>
            <button
              type="button"
              onClick={addProduct}
              className="text-xs font-semibold text-[color:var(--navy-light)] hover:text-[color:var(--gold)]"
            >
              + {t("addProduct")}
            </button>
          </div>

          {products.map((p, index) => (
            <div
              key={p.id}
              className="grid grid-cols-2 gap-1.5 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-2 md:grid-cols-4"
            >
              <div className="col-span-2 flex items-center justify-between md:col-span-4">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[color:var(--gold)]">
                  {t("productN", { n: index + 1 })}
                  {sea ? (
                    <span className="ml-2 font-normal normal-case tracking-normal text-[color:var(--muted)]">
                      {t("lineCbm")}: {totalCbmForLine(p).toFixed(4)}{" "}
                      {t("cbmUnit")}
                    </span>
                  ) : null}
                </span>
                {products.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeProduct(p.id)}
                    className="text-xs text-red-700 hover:underline"
                  >
                    {t("removeProduct")}
                  </button>
                ) : null}
              </div>
              <div className="col-span-2 md:col-span-2">
                <label className="label">{tf("productDescription")} *</label>
                <input
                  className="field"
                  required
                  value={p.description}
                  onChange={(e) => onDescriptionChange(p.id, e.target.value)}
                  onBlur={(e) => {
                    void suggestHsForProduct(p.id, e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void suggestHsForProduct(p.id, e.currentTarget.value);
                      (
                        e.currentTarget
                          .closest(".grid")
                          ?.querySelector<HTMLInputElement>(
                            'input[data-hs-field="1"]',
                          ) || undefined
                      )?.focus();
                    }
                  }}
                />
              </div>
              <div>
                <label className="label">{tf("hsCode")}</label>
                <input
                  className="field"
                  data-hs-field="1"
                  placeholder={tf("hsCodeHint")}
                  value={p.hsCode}
                  onChange={(e) =>
                    updateProduct(p.id, { hsCode: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">{tf("productValue")}</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="field"
                  value={p.productValue || ""}
                  onChange={(e) =>
                    updateProduct(p.id, {
                      productValue: Number(e.target.value || 0),
                    })
                  }
                />
              </div>
              {!p.hsCode.trim() || (hsSuggestions[p.id]?.length ?? 0) > 0 ? (
                <div className="col-span-2 md:col-span-4">
                  {!p.hsCode.trim() ? (
                    <p className="text-[0.7rem] leading-snug text-red-700">
                      {tf("hsCodeSelectHint")}
                    </p>
                  ) : null}
                  {hsSuggestions[p.id]?.length ? (
                    <div className="mt-1 flex max-h-20 flex-wrap gap-1.5 overflow-y-auto">
                      {hsSuggestions[p.id].map((c) => (
                        <button
                          key={c.hsCode}
                          type="button"
                          title={c.description}
                          className="rounded border border-[color:var(--line)] bg-white px-2 py-1 text-left text-[0.7rem] text-[color:var(--navy)] hover:border-[color:var(--gold)] hover:bg-white"
                          onClick={() => {
                            void chooseHs(p.id, c.hsCode, c.confidence);
                          }}
                        >
                          <span className="font-semibold">{c.hsCode}</span>
                          <span className="opacity-70"> · {c.confidence}%</span>
                          <span className="ml-1 opacity-75">
                            {c.description.length > 42
                              ? `${c.description.slice(0, 42)}…`
                              : c.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div>
                <label className="label">{tf("quantity")}</label>
                <input
                  type="number"
                  min={1}
                  className="field"
                  value={p.quantity}
                  onChange={(e) =>
                    updateProduct(p.id, {
                      quantity: Number(e.target.value || 1),
                    })
                  }
                />
              </div>
              <div>
                <label className="label">{tf("weight")} *</label>
                <input
                  type="number"
                  min={0.001}
                  step="0.001"
                  required
                  className="field"
                  value={p.actualWeightKg || ""}
                  onChange={(e) =>
                    updateProduct(p.id, {
                      actualWeightKg: Number(e.target.value || 0),
                    })
                  }
                />
              </div>
              <div>
                <label className="label">
                  {tf("length")}
                  {sea ? " *" : ""}
                </label>
                <input
                  type="number"
                  min={0}
                  required={sea}
                  className="field"
                  value={p.lengthCm || ""}
                  onChange={(e) =>
                    updateProduct(p.id, {
                      lengthCm: Number(e.target.value || 0),
                    })
                  }
                />
              </div>
              <div>
                <label className="label">
                  {tf("width")}
                  {sea ? " *" : ""}
                </label>
                <input
                  type="number"
                  min={0}
                  required={sea}
                  className="field"
                  value={p.widthCm || ""}
                  onChange={(e) =>
                    updateProduct(p.id, {
                      widthCm: Number(e.target.value || 0),
                    })
                  }
                />
              </div>
              <div>
                <label className="label">
                  {tf("height")}
                  {sea ? " *" : ""}
                </label>
                <input
                  type="number"
                  min={0}
                  required={sea}
                  className="field"
                  value={p.heightCm || ""}
                  onChange={(e) =>
                    updateProduct(p.id, {
                      heightCm: Number(e.target.value || 0),
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : null}

        <button type="submit" className="btn-primary">
          {t("calculate")}
        </button>
      </form>

      <div className="flex flex-col gap-3 lg:sticky lg:top-20">
        {!cargoPayload && (
          <div className="rounded-xl border border-dashed border-[color:var(--line)] bg-white/60 p-4 text-sm text-[color:var(--muted)]">
            {t("subtitle")}
          </div>
        )}

        {cargoPayload && !leadUnlocked && (
          <form
            onSubmit={onLeadSubmit}
            className="grid gap-2 rounded-xl border border-[color:var(--line)] bg-white p-3 md:p-4"
          >
            <h3 className="text-base font-light text-[color:var(--navy)]">
              {t("leadTitle")}
            </h3>
            <p className="text-xs text-[color:var(--muted)]">{t("leadBody")}</p>
            <div>
              <label className="label">{tf("name")} *</label>
              <input
                name="name"
                required
                className="field"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">{tf("email")} *</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="field"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="label">{tf("phone")} *</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="field"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="+2567..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">{tf("company")}</label>
                <input
                  name="company"
                  className="field"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  autoComplete="organization"
                />
              </div>
              <div>
                <label className="label">{tf("country")}</label>
                <input
                  name="country"
                  className="field"
                  value={leadCountry}
                  onChange={(e) => setLeadCountry(e.target.value)}
                  autoComplete="country-name"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              className="btn-primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? tc("loading") : t("submitLead")}
            </button>
          </form>
        )}

        {status === "loading" && !result && (
          <div className="rounded-xl border border-[color:var(--line)] bg-white p-4 text-sm text-[color:var(--muted)]">
            {tc("loading")}
          </div>
        )}

        {result && (
          <div className="rounded-xl border border-[color:var(--line)] bg-white p-3 md:p-4">
            <h3 className="text-sm font-medium uppercase tracking-wide text-[color:var(--muted)]">
              {t("results")}
            </h3>
            <div className="mt-1 text-3xl font-bold tracking-tight text-[color:var(--navy)]">
              {result.currency}{" "}
              {estimatedImportCost.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </div>
            <dl className="mt-2 space-y-1.5 text-sm">
              {result.cbm != null && result.cbm > 0 ? (
                <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-1">
                  <dt>{t("cbmLabel")}</dt>
                  <dd>
                    {result.cbm.toLocaleString()} {t("cbmUnit")}
                  </dd>
                </div>
              ) : null}
              {totalWeightKg > 0 ? (
                <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-1">
                  <dt>{t("weightLabel")}</dt>
                  <dd>
                    {totalWeightKg.toLocaleString()} {t("weightUnit")}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-1">
                <dt>{t("freightLabel")}</dt>
                <dd>
                  {result.currency}{" "}
                  {result.estimatedFreightCost.toLocaleString()}
                </dd>
              </div>
              {extraLogistics.map((l, i) => (
                <div
                  key={`${l.chargeType}-${l.description}-${i}`}
                  className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-1"
                >
                  <dt>{l.description}</dt>
                  <dd>
                    {result.currency} {l.amount.toLocaleString()}
                  </dd>
                </div>
              ))}
              <div className="border-b border-[color:var(--line)] pb-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 text-left"
                  onClick={() => setTaxesOpen((v) => !v)}
                  aria-expanded={taxesOpen}
                >
                  <dt className="flex items-center gap-1.5">
                    <span aria-hidden>{taxesOpen ? "▾" : "▸"}</span>
                    {t("taxesLabel")}
                  </dt>
                  <dd>
                    {result.currency}{" "}
                    {(
                      result.estimatedTaxes + result.estimatedCustomsDuty
                    ).toLocaleString()}
                  </dd>
                </button>
                {taxesOpen && taxLines.length > 0 ? (
                  <ul className="mt-1.5 space-y-1 pl-4 text-xs text-[color:var(--muted)]">
                    {taxLines.map((l, i) => (
                      <li
                        key={`${l.chargeType}-${l.description}-${i}`}
                        className="flex justify-between gap-4"
                      >
                        <span>{l.description}</span>
                        <span>
                          {result.currency} {l.amount.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              {missingProductValue ? (
                <p className="text-sm font-medium text-red-700">
                  {t("productValueTaxNote")}
                </p>
              ) : null}
              {result.estimatedTransitDays && (
                <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-1">
                  <dt>{t("transitLabel")}</dt>
                  <dd>
                    {result.estimatedTransitDays.min ?? "?"}–
                    {result.estimatedTransitDays.max ?? "?"} days
                  </dd>
                </div>
              )}
              {usedFxRate != null && usedFxRate > 0 ? (
                <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-1">
                  <dt>{t("fxRate")}</dt>
                  <dd>
                    {t("fxRateValue", {
                      from: result.operatingCurrency || "USD",
                      rate: usedFxRate.toLocaleString(),
                      to: result.currency,
                    })}
                  </dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-2 text-[0.7rem] leading-snug text-[color:var(--muted)]">
              {t("disclaimer")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
