"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export type FreightModeOption = {
  code: string;
  label: string;
};

type Props = {
  name?: string;
  id?: string;
  className?: string;
  originCountry?: string;
  destinationCountry?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (code: string) => void;
  required?: boolean;
};

async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Server returned HTML/non-JSON (${res.status}). Restart the website dev server.`,
    );
  }
}

export function FreightModeSelect({
  name = "mode",
  id,
  className = "field",
  originCountry,
  destinationCountry,
  defaultValue = "",
  value: controlledValue,
  onChange,
  required,
}: Props) {
  const tc = useTranslations("common");
  const [modes, setModes] = useState<FreightModeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const value = controlledValue ?? internalValue;

  function setValue(next: string) {
    setInternalValue(next);
    onChange?.(next);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (originCountry) params.set("originCountry", originCountry);
        if (destinationCountry)
          params.set("destinationCountry", destinationCountry);
        const qs = params.toString();
        const res = await fetch(`/api/freight-modes${qs ? `?${qs}` : ""}`, {
          cache: "no-store",
        });
        const json = await readJson(res);
        if (!res.ok) throw new Error(json.error || "Failed to load modes");
        if (cancelled) return;
        const next: FreightModeOption[] = Array.isArray(json.data)
          ? json.data
          : [];
        setModes(next);
        setValue(
          (() => {
            if (value && next.some((m) => m.code === value)) return value;
            if (defaultValue && next.some((m) => m.code === defaultValue)) {
              return defaultValue;
            }
            return next[0]?.code || "";
          })(),
        );
      } catch (e) {
        if (!cancelled) {
          setModes([]);
          setValue("");
          setError(e instanceof Error ? e.message : tc("error"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when lane changes
  }, [originCountry, destinationCountry, defaultValue, tc]);

  return (
    <>
      <select
        id={id}
        name={name}
        className={className}
        required={required}
        disabled={loading || modes.length === 0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {loading && <option value="">{tc("loading")}</option>}
        {!loading && modes.length === 0 && (
          <option value="">No active freight modes</option>
        )}
        {!loading &&
          modes.map((m) => (
            <option key={m.code} value={m.code}>
              {m.label}
            </option>
          ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </>
  );
}
