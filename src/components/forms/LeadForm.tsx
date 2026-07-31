"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { FreightModeSelect } from "@/components/forms/FreightModeSelect";

type LeadType = "QUOTE" | "SOURCING" | "CONTACT";

export function LeadForm({
  type,
  submitLabel,
  successMessage,
  showProduct = false,
  showLogistics = false,
  showMessage = false,
}: {
  type: LeadType;
  submitLabel: string;
  successMessage: string;
  showProduct?: boolean;
  showLogistics?: boolean;
  showMessage?: boolean;
}) {
  const t = useTranslations("forms");
  const tc = useTranslations("common");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("UG");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
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
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : tc("error"));
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-[color:var(--line)] bg-white p-8">
        <p className="text-lg text-[color:var(--navy)]">{successMessage}</p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "256707469261"}`}
          className="btn-primary mt-6"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 border border-[color:var(--line)] bg-white p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
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
        <div className="md:col-span-2">
          <label className="label" htmlFor="country">
            {t("country")}
          </label>
          <input id="country" name="country" className="field" />
        </div>
      </div>

      {showProduct && (
        <div className="grid gap-4 border-t border-[color:var(--line)] pt-4 md:grid-cols-2">
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
          <div className="md:col-span-2">
            <label className="label" htmlFor="productDescription">
              {t("productDescription")}
            </label>
            <textarea
              id="productDescription"
              name="productDescription"
              rows={3}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="productLink">
              {t("productLink")}
            </label>
            <input id="productLink" name="productLink" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="budget">
              {t("budget")}
            </label>
            <input id="budget" name="budget" className="field" />
          </div>
        </div>
      )}

      {showLogistics && (
        <div className="grid gap-4 border-t border-[color:var(--line)] pt-4 md:grid-cols-3">
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
          <div>
            <label className="label" htmlFor="deadline">
              {t("deadline")}
            </label>
            <input id="deadline" name="deadline" type="date" className="field" />
          </div>
        </div>
      )}

      {(showMessage || showProduct) && (
        <div>
          <label className="label" htmlFor="notes">
            {showMessage ? t("message") : t("notes")}
          </label>
          <textarea id="notes" name="notes" rows={4} className="field" />
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary mt-2 w-full md:w-auto"
      >
        {status === "loading" ? tc("loading") : submitLabel}
      </button>
    </form>
  );
}
