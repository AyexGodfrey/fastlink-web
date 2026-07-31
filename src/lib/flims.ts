const FLIMS_API_URL =
  process.env.FLIMS_API_URL || "http://127.0.0.1:4000/api/v1";
const FLIMS_SITE_API_KEY = process.env.FLIMS_SITE_API_KEY || "";
const FLIMS_COMPANY_CODE = process.env.FLIMS_COMPANY_CODE || "FLI";

type FlimsEnvelope<T> = {
  success?: boolean;
  data: T;
  message?: unknown;
  error?: unknown;
};

function headers(): HeadersInit {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (FLIMS_SITE_API_KEY) h["x-site-api-key"] = FLIMS_SITE_API_KEY;
  return h;
}

function errorMessage(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => errorMessage(item, ""))
      .filter(Boolean);
    if (parts.length) return parts.join(", ");
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.message === "string" && obj.message.trim()) {
      return obj.message;
    }
    if (typeof obj.error === "string" && obj.error.trim()) return obj.error;
  }
  return fallback;
}

async function flimsFetch<T>(
  path: string,
  init?: RequestInit,
  query?: Record<string, string | undefined>,
): Promise<T> {
  const base = FLIMS_API_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`);
  url.searchParams.set("company", FLIMS_COMPANY_CODE);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== "") url.searchParams.set(key, value);
    }
  }
  const res = await fetch(url.toString(), {
    ...init,
    headers: { ...headers(), ...(init?.headers || {}) },
    cache: "no-store",
  });
  const text = await res.text();
  let json = {} as FlimsEnvelope<T>;
  try {
    json = text ? (JSON.parse(text) as FlimsEnvelope<T>) : ({} as FlimsEnvelope<T>);
  } catch {
    throw new Error(
      `FLIMS returned non-JSON (${res.status}): ${text.slice(0, 120)}`,
    );
  }
  if (!res.ok) {
    throw new Error(
      errorMessage(
        json.message ?? json.error,
        `FLIMS error ${res.status}`,
      ),
    );
  }
  return (json.data ?? json) as T;
}

export type PublicTracking = {
  trackingNumber: string;
  status: string;
  destination: string;
  serviceType?: string;
  events?: Array<{
    status: string;
    remarks?: string | null;
    occurredAt: string;
    branchId?: string | null;
  }>;
  currentLocation?: string | null;
  eta?: string | null;
};

export type ImportCostResult = {
  currency: string;
  estimatedFreightCost: number;
  estimatedCustomsDuty: number;
  estimatedTaxes: number;
  estimatedLandedCost: number;
  estimatedTransitDays?: { min: number | null; max: number | null } | null;
  productValue: number;
  cif: number;
  cbm?: number;
  chargeableWeightKg?: number;
  lines: Array<{
    chargeType: string;
    description: string;
    amount: number;
  }>;
  disclaimer: string;
  hsCode?: string | null;
  hsDescription?: string | null;
};

export async function flimsTrack(trackingNumber: string) {
  return flimsFetch<PublicTracking>(
    `/public/tracking/${encodeURIComponent(trackingNumber)}`,
  );
}

export async function flimsImportCost(body: Record<string, unknown>) {
  return flimsFetch<ImportCostResult>("/public/import-cost/calculate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function flimsHsCodes(q: string, country?: string) {
  return flimsFetch<
    Array<{ hsCode: string; description: string; dutyPercent: number }>
  >("/public/hs-codes", undefined, { q: q || undefined, country });
}

export type FreightModeOption = {
  code: string;
  label: string;
};

export async function flimsFreightModes(
  originCountry?: string,
  destinationCountry?: string,
) {
  return flimsFetch<FreightModeOption[]>("/public/freight-modes", undefined, {
    originCountry,
    destinationCountry,
  });
}

export async function flimsCreateLead(body: {
  type: "QUOTE" | "SOURCING" | "IMPORT_COST" | "CONTACT";
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  country?: string;
  payload: Record<string, unknown>;
}) {
  return flimsFetch<{ id: string }>("/public/leads", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
