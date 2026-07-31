"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type TrackingResult = {
  trackingNumber: string;
  status: string;
  statusLabel?: string;
  packageStatus?: string;
  destination: string;
  currentLocation?: {
    location?: string | null;
  } | null;
  events?: Array<{
    status: string;
    label?: string;
    remarks?: string | null;
    delayReason?: string | null;
    occurredAt: string;
  }>;
};

function isOperationalRemark(text: string): boolean {
  return [
    /\bcontainer\s+[A-Z0-9]+/i,
    /assigned to\s+\w+\s+movement/i,
    /movement created/i,
    /\bdeconsolidat/i,
    /\bconsolidat/i,
    /\d+\s*package\(s\)\s*assigned/i,
    /package\(s\)\s*assigned/i,
  ].some((pattern) => pattern.test(text));
}

function publicHistoryDetail(
  remarks?: string | null,
  delayReason?: string | null,
): string | null {
  const delay = delayReason?.trim() || null;
  const note = remarks?.trim() || null;
  const safeRemark = note && !isOperationalRemark(note) ? note : null;
  const parts = [delay, safeRemark].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length ? parts.join(" · ") : null;
}

export function TrackPanel() {
  const t = useTranslations("track");
  const tc = useTranslations("common");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(q.trim())}`);
      const text = await res.text();
      let json: { data?: TrackingResult; error?: unknown } = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(t("notFound"));
      }
      if (!res.ok) {
        const err = json.error;
        const message =
          typeof err === "string"
            ? err
            : err &&
                typeof err === "object" &&
                typeof (err as { message?: unknown }).message === "string"
              ? String((err as { message: string }).message)
              : t("notFound");
        throw new Error(message);
      }
      setResult(json.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("notFound"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          className="field flex-1"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("placeholder")}
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? tc("loading") : t("search")}
        </button>
      </form>

      {error && (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8 border border-[color:var(--line)] bg-white p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-[color:var(--muted)]">
                {t("status")}
              </div>
              <div className="mt-1 text-lg font-semibold text-[color:var(--navy)]">
                {result.statusLabel ||
                  (result.packageStatus || result.status).replaceAll("_", " ")}
              </div>
            </div>
            {result.currentLocation?.location?.trim() ? (
              <div>
                <div className="text-xs uppercase tracking-wider text-[color:var(--muted)]">
                  {t("location")}
                </div>
                <div className="mt-1 text-lg text-[color:var(--navy)]">
                  {result.currentLocation.location.trim()}
                </div>
              </div>
            ) : null}
            <div>
              <div className="text-xs uppercase tracking-wider text-[color:var(--muted)]">
                {t("destination")}
              </div>
              <div className="mt-1 text-lg text-[color:var(--navy)]">
                {result.destination || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[color:var(--muted)]">
                #
              </div>
              <div className="mt-1 text-lg text-[color:var(--navy)]">
                {result.trackingNumber}
              </div>
            </div>
          </div>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            {t("history")}
          </h3>
          <ol className="mt-4 space-y-4 border-l border-[color:var(--line)] pl-5">
            {(result.events || []).map((ev, i) => {
              const detail = publicHistoryDetail(ev.remarks, ev.delayReason);
              return (
                <li key={`${ev.occurredAt}-${i}`} className="relative">
                  <span className="absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[color:var(--gold)]" />
                  <div className="font-semibold text-[color:var(--navy)]">
                    {ev.label || ev.status.replaceAll("_", " ")}
                  </div>
                  <div className="text-sm text-[color:var(--muted)]">
                    {new Date(ev.occurredAt).toLocaleString()}
                    {detail ? ` · ${detail}` : ""}
                  </div>
                </li>
              );
            })}
            {!result.events?.length && (
              <li className="text-sm text-[color:var(--muted)]">—</li>
            )}
          </ol>
        </div>
      )}
    </div>
  );
}
