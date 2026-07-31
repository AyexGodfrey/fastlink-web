"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ImportCostResult } from "@/lib/flims";
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

  const [cargoPayload, setCargoPayload] = useState<Record<string, unknown> | null>(
    null,
  );
  const [leadUnlocked, setLeadUnlocked] = useState(false);
  const [result, setResult] = useState<ImportCostResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");

  const sea = isSeaMode(mode);
  const totalCbm = useMemo(
    () => products.reduce((s, p) => s + totalCbmForLine(p), 0),
    [products],
  );

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

  function onCargoSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!mode) {
      setError(t("modeRequired"));
      return;
    }
    if (sea) {
      const bad = products.some(
        (p) => !(p.lengthCm > 0 && p.widthCm > 0 && p.heightCm > 0),
      );
      if (bad) {
        setError(t("seaDimsRequired"));
        return;
      }
    }

    const shared = {
      mode,
      originCountry,
      destinationCountry,
      destinationCity: destinationCity || undefined,
      insurance,
    };

    const groups = groupProductsByHs(products);
    const payloads = [...groups.values()].map((lines) =>
      aggregateGroup(lines, shared),
    );

    setCargoPayload({
      ...shared,
      currency: "USD",
      products,
      groups: payloads,
      totalCbm,
    });
    setLeadUnlocked(false);
    setResult(null);
  }

  async function onLeadSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cargoPayload) return;
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const lead = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || "") || undefined,
      phone: String(fd.get("phone") || "") || undefined,
      companyName: String(fd.get("company") || "") || undefined,
      country: String(fd.get("country") || "") || undefined,
    };

    try {
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "IMPORT_COST",
          ...lead,
          payload: cargoPayload,
        }),
      });
      const leadJson = await leadRes.json();
      if (!leadRes.ok) throw new Error(leadJson.error || "Lead failed");

      const groups = (cargoPayload.groups as ReturnType<typeof aggregateGroup>[]) || [];
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

      setResult(sumImportResults(results));
      setLeadUnlocked(true);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : tc("error"));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={onCargoSubmit}
        className="grid gap-5 border border-[color:var(--line)] bg-white p-6 md:p-8"
      >
        <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-4 text-sm text-[color:var(--muted)]">
          <p className="font-medium text-[color:var(--navy)]">{t("uploadTitle")}</p>
          <p className="mt-2 leading-relaxed">{t("uploadNotice")}</p>
          <p className="mt-2 text-xs">{t("uploadHeaders")}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="btn-ghost cursor-pointer !px-3 !py-2 text-sm">
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
            <label className="btn-ghost cursor-pointer !px-3 !py-2 text-sm">
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
              className="inline-flex items-center text-sm font-semibold text-[color:var(--navy-light)] hover:text-[color:var(--gold)]"
            >
              {t("downloadSample")}
            </a>
          </div>
          {uploadMsg ? (
            <p className="mt-3 text-sm text-[color:var(--navy)]">{uploadMsg}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
          <div className="flex items-end pb-2">
            <label className="inline-flex items-center gap-2 text-sm text-[color:var(--navy)]">
              <input
                type="checkbox"
                checked={insurance}
                onChange={(e) => setInsurance(e.target.checked)}
              />
              {tf("insurance")}
            </label>
          </div>
          <div>
            <label className="label">{tf("originCountry")}</label>
            <input
              className="field"
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label className="label">{tf("destinationCountry")}</label>
            <input
              className="field"
              value={destinationCountry}
              onChange={(e) =>
                setDestinationCountry(e.target.value.toUpperCase())
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">{tf("destinationCity")}</label>
            <input
              className="field"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
            />
          </div>
        </div>

        {sea ? (
          <p className="text-sm text-[color:var(--navy)]">
            {t("seaCbmHint")}{" "}
            <strong>
              {totalCbm.toFixed(3)} {t("cbmUnit")}
            </strong>
          </p>
        ) : null}

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">
              {t("products")}
            </h3>
            <button
              type="button"
              onClick={addProduct}
              className="text-sm font-semibold text-[color:var(--navy-light)] hover:text-[color:var(--gold)]"
            >
              + {t("addProduct")}
            </button>
          </div>

          {products.map((p, index) => (
            <div
              key={p.id}
              className="grid gap-3 border border-[color:var(--line)] p-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--gold)]">
                  {t("productN", { n: index + 1 })}
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
              <div className="sm:col-span-2">
                <label className="label">{tf("productDescription")}</label>
                <input
                  className="field"
                  value={p.description}
                  onChange={(e) =>
                    updateProduct(p.id, { description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">
                  {tf("hsCode")}{" "}
                  <span className="font-normal text-[color:var(--muted)]">
                    ({tf("hsCodeHint")})
                  </span>
                </label>
                <input
                  className="field"
                  placeholder="8517.12"
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
                  required
                  className="field"
                  value={p.productValue}
                  onChange={(e) =>
                    updateProduct(p.id, {
                      productValue: Number(e.target.value || 0),
                    })
                  }
                />
              </div>
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
                <label className="label">{tf("weight")}</label>
                <input
                  type="number"
                  min={0.001}
                  step="0.001"
                  required
                  className="field"
                  value={p.actualWeightKg}
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
                  {sea ? ` *` : ""}
                </label>
                <input
                  type="number"
                  min={0}
                  required={sea}
                  className="field"
                  value={p.lengthCm}
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
                  {sea ? ` *` : ""}
                </label>
                <input
                  type="number"
                  min={0}
                  required={sea}
                  className="field"
                  value={p.widthCm}
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
                  {sea ? ` *` : ""}
                </label>
                <input
                  type="number"
                  min={0}
                  required={sea}
                  className="field"
                  value={p.heightCm}
                  onChange={(e) =>
                    updateProduct(p.id, {
                      heightCm: Number(e.target.value || 0),
                    })
                  }
                />
              </div>
              <div className="sm:col-span-2 text-xs text-[color:var(--muted)]">
                {t("lineCbm")}: {totalCbmForLine(p).toFixed(4)} {t("cbmUnit")}
              </div>
            </div>
          ))}
        </div>

        {error && !leadUnlocked ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : null}

        <button type="submit" className="btn-primary">
          {t("calculate")}
        </button>
      </form>

      <div>
        {!cargoPayload && (
          <div className="border border-dashed border-[color:var(--line)] bg-white/60 p-8 text-[color:var(--muted)]">
            {t("subtitle")}
          </div>
        )}

        {cargoPayload && !leadUnlocked && (
          <form
            onSubmit={onLeadSubmit}
            className="grid gap-4 border border-[color:var(--line)] bg-white p-6 md:p-8"
          >
            <h3 className="text-xl font-light text-[color:var(--navy)]">
              {t("leadTitle")}
            </h3>
            <p className="text-sm text-[color:var(--muted)]">{t("leadBody")}</p>
            <div>
              <label className="label">{tf("name")}</label>
              <input name="name" required className="field" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{tf("email")}</label>
                <input name="email" type="email" className="field" />
              </div>
              <div>
                <label className="label">{tf("phone")}</label>
                <input name="phone" className="field" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{tf("company")}</label>
                <input name="company" className="field" />
              </div>
              <div>
                <label className="label">{tf("country")}</label>
                <input name="country" className="field" />
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

        {result && (
          <div className="border border-[color:var(--line)] bg-white p-6 md:p-8">
            <h3 className="text-xl font-light text-[color:var(--navy)]">
              {t("results")}
            </h3>
            <div className="mt-4 text-4xl font-light text-[color:var(--navy)]">
              {result.currency} {result.estimatedLandedCost.toLocaleString()}
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              {result.cbm != null && result.cbm > 0 ? (
                <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-2">
                  <dt>{t("cbmLabel")}</dt>
                  <dd>
                    {result.cbm.toLocaleString()} {t("cbmUnit")}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-2">
                <dt>Freight</dt>
                <dd>
                  {result.currency}{" "}
                  {result.estimatedFreightCost.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-2">
                <dt>Customs duty</dt>
                <dd>
                  {result.currency}{" "}
                  {result.estimatedCustomsDuty.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-2">
                <dt>Taxes</dt>
                <dd>
                  {result.currency} {result.estimatedTaxes.toLocaleString()}
                </dd>
              </div>
              {result.estimatedTransitDays && (
                <div className="flex justify-between gap-4 border-b border-[color:var(--line)] pb-2">
                  <dt>Transit</dt>
                  <dd>
                    {result.estimatedTransitDays.min ?? "?"}–
                    {result.estimatedTransitDays.max ?? "?"} days
                  </dd>
                </div>
              )}
            </dl>
            <ul className="mt-6 space-y-2 text-sm text-[color:var(--muted)]">
              {result.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>{l.description}</span>
                  <span>
                    {result.currency} {l.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-[color:var(--muted)]">
              {result.disclaimer || t("disclaimer")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
