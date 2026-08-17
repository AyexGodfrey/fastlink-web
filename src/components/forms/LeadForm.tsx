"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { FreightModeSelect } from "@/components/forms/FreightModeSelect";
import { trackEvent } from "@/lib/analytics";

type LeadType = "QUOTE" | "SOURCING" | "CONTACT";

export function LeadForm({
  type,
  submitLabel,
  successMessage,
  showProduct = false,
  showLogistics = false,
  showMessage = false,
  compact = false,
}: {
  type: LeadType;
  submitLabel: string;
  successMessage: string;
  showProduct?: boolean;
  showLogistics?: boolean;
  showMessage?: boolean;
  compact?: boolean;
}) {
  const t = useTranslations("forms");
  const tc = useTranslations("common");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("UG");

  const splitColumns = showProduct || showLogistics;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setError("");
    trackEvent("lead_submit", { lead_type: type });
    const fd = new FormData(form);
    const payload: Record<string, unknown> = {};
    fd.forEach((v, k) => {
      payload[k] = String(v);
    });

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: payload.name,
          email: payload.email || undefined,
          phone: payload.phone || undefined,
          companyName: payload.company || undefined,
          country: payload.country || undefined,
          payload,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      form.reset();
      trackEvent("lead_success", { lead_type: type });
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      trackEvent("lead_error", { lead_type: type });
      setError(err instanceof Error ? err.message : tc("error"));
    }
  }

  const gap = compact ? "gap-2.5" : "gap-4";
  const pad = compact ? "p-3 md:p-4" : "p-6 md:p-8";
  const textRows = compact ? 2 : 3;
  const notesRows = compact ? 2 : 4;

  if (status === "ok") {
    return (
      <div
        className={`rounded-xl border border-[color:var(--line)] bg-white ${pad}`}
      >
        <p
          className={
            compact
              ? "text-base text-[color:var(--navy)]"
              : "text-lg text-[color:var(--navy)]"
          }
        >
          {successMessage}
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "256795896222"}`}
          className={`btn-primary ${compact ? "mt-3" : "mt-6"}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>
    );
  }

  const customerFields = (
    <div className={`grid ${gap}`}>
      <div>
        <label className="label" htmlFor="name">
          {t("name")}
        </label>
        <input id="name" name="name" required className="field" />
      </div>
      <div>
        <label className="label" htmlFor="company">
          {t("company")}
        </label>
        <input id="company" name="company" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="email">
          {t("email")}
        </label>
        <input id="email" name="email" type="email" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          {t("phone")}
        </label>
        <input id="phone" name="phone" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="country">
          {t("country")}
        </label>
        <input id="country" name="country" className="field" />
      </div>
    </div>
  );

  const detailsFields = (
    <div className={`grid ${gap}`}>
      {showProduct && (
        <>
          <div className={`grid ${gap} sm:grid-cols-2`}>
            <div>
              <label className="label" htmlFor="productName">
                {t("productName")}
              </label>
              <input id="productName" name="productName" className="field" />
            </div>
            <div>
              <label className="label" htmlFor="quantity">
                {t("quantity")}
              </label>
              <input id="quantity" name="quantity" className="field" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="productDescription">
              {t("productDescription")}
            </label>
            <textarea
              id="productDescription"
              name="productDescription"
              rows={textRows}
              className="field"
            />
          </div>
        </>
      )}

      {showLogistics && (
        <div className={`grid ${gap}`}>
          <div>
            <label className="label" htmlFor="destinationCountry">
              {t("destinationCountry")}
            </label>
            <input
              id="destinationCountry"
              name="destinationCountry"
              className="field"
              value={destinationCountry}
              onChange={(e) =>
                setDestinationCountry(e.target.value.toUpperCase())
              }
            />
          </div>
          <div>
            <label className="label" htmlFor="shippingMethod">
              {t("shippingMethod")}
            </label>
            <FreightModeSelect
              id="shippingMethod"
              name="shippingMethod"
              destinationCountry={destinationCountry}
              originCountry="CN"
            />
          </div>
        </div>
      )}

      {(showMessage || showProduct) && (
        <div>
          <label className="label" htmlFor="notes">
            {showMessage ? t("message") : t("notes")}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={notesRows}
            className="field"
          />
        </div>
      )}
    </div>
  );

  return (
    <form
      onSubmit={onSubmit}
      className={`grid rounded-xl border border-[color:var(--line)] bg-white ${gap} ${pad}${
        compact ? " form-compact" : ""
      }`}
    >
      {splitColumns ? (
        <div className={`grid ${gap} md:grid-cols-2 md:items-start`}>
          <div>{customerFields}</div>
          <div
            className={`md:border-l md:border-[color:var(--line)] ${
              compact ? "md:pl-4" : "md:pl-6"
            }`}
          >
            {detailsFields}
          </div>
        </div>
      ) : (
        <>
          {customerFields}
          {showMessage && (
            <div>
              <label className="label" htmlFor="notes">
                {t("message")}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={notesRows}
                className="field"
              />
            </div>
          )}
        </>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className={`btn-primary w-full md:w-auto ${compact ? "mt-0.5" : "mt-2"}`}
      >
        {status === "loading" ? tc("loading") : submitLabel}
      </button>
    </form>
  );
}
