const AMGIMS_API_URL =
  process.env.AMGIMS_API_URL?.trim() || "http://127.0.0.1:4000/api/v1";
const AMGIMS_SITE_API_KEY = process.env.AMGIMS_SITE_API_KEY?.trim() || "";
const AMGIMS_COMPANY_CODE =
  process.env.AMGIMS_COMPANY_CODE?.trim() || "AMG";

export const AMGIMS_UNAVAILABLE =
  "AMGIMS is temporarily unavailable. Tracking and import-cost estimates cannot run until the API is back online.";

type AmgimsEnvelope<T> = {
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
  if (AMGIMS_SITE_API_KEY) h["x-site-api-key"] = AMGIMS_SITE_API_KEY;
  return h;
}

function errorMessage(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) {
    if (/<\s*html/i.test(value) || /Bad Gateway/i.test(value)) {
      return AMGIMS_UNAVAILABLE;
    }
    return value;
  }
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => errorMessage(item, ""))
      .filter(Boolean);
    if (parts.length) return parts.join(", ");
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.message === "string" && obj.message.trim()) {
      return errorMessage(obj.message, fallback);
    }
    if (typeof obj.error === "string" && obj.error.trim()) {
      return errorMessage(obj.error, fallback);
    }
  }
  return fallback;
}

async function amgimsFetch<T>(
  path: string,
  init?: RequestInit,
  query?: Record<string, string | undefined>,
): Promise<T> {
  const base = AMGIMS_API_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`);
  url.searchParams.set("company", AMGIMS_COMPANY_CODE);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== "") url.searchParams.set(key, value);
    }
  }
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      ...init,
      headers: { ...headers(), ...(init?.headers || {}) },
      cache: "no-store",
    });
  } catch {
    throw new Error(AMGIMS_UNAVAILABLE);
  }
  const text = await res.text();
  let json = {} as AmgimsEnvelope<T>;
  try {
    json = text
      ? (JSON.parse(text) as AmgimsEnvelope<T>)
      : ({} as AmgimsEnvelope<T>);
  } catch {
    throw new Error(
      res.status >= 500
        ? AMGIMS_UNAVAILABLE
        : `AMGIMS returned non-JSON (${res.status}): ${text.slice(0, 120)}`,
    );
  }
  if (!res.ok) {
    if (res.status >= 500 || /<\s*html/i.test(text)) {
      throw new Error(AMGIMS_UNAVAILABLE);
    }
    throw new Error(
      errorMessage(
        json.message ?? json.error,
        `AMGIMS error ${res.status}`,
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
  operatingCurrency?: string;
  displayCurrency?: string;
  displayExchangeRate?: number | null;
  displayExchangeRateSource?: string | null;
  exchangeRate?: number | null;
  exchangeRateSource?: string | null;
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

export async function amgimsTrack(trackingNumber: string) {
  return amgimsFetch<PublicTracking>(
    `/public/tracking/${encodeURIComponent(trackingNumber)}`,
  );
}

export async function amgimsImportCost(body: Record<string, unknown>) {
  return amgimsFetch<ImportCostResult>("/public/import-cost/calculate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type HsClassifyCandidate = {
  hsCode: string;
  description: string;
  confidence: number;
  importDutyRate: number | null;
  matchedKeywords: string[];
  matchedPhrases: string[];
  matchReasons: string[];
};

export type HsClassifyResult = {
  autoAccepted: boolean;
  suggestedHSCode: string | null;
  confidence: number;
  requiresChoice: boolean;
  candidates: HsClassifyCandidate[];
  matchedKeywords: string[];
  canOverride: boolean;
};

export async function amgimsClassifyHs(description: string, country: string) {
  return amgimsFetch<HsClassifyResult>("/public/hs-codes/classify", {
    method: "POST",
    body: JSON.stringify({ description, country }),
  });
}

export async function amgimsClassifyOverride(body: {
  description: string;
  country: string;
  suggestedHsCode?: string | null;
  selectedHsCode: string;
  confidence?: number;
}) {
  return amgimsFetch<unknown>("/public/hs-codes/classify/override", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function amgimsHsCodes(q: string, country?: string) {
  return amgimsFetch<
    Array<{ hsCode: string; description: string; dutyPercent: number }>
  >("/public/hs-codes", undefined, { q: q || undefined, country });
}

export type FreightModeOption = {
  code: string;
  label: string;
};

export async function amgimsFreightModes(
  originCountry?: string,
  destinationCountry?: string,
) {
  return amgimsFetch<FreightModeOption[]>("/public/freight-modes", undefined, {
    originCountry,
    destinationCountry,
  });
}

export async function amgimsCreateLead(body: {
  type: "QUOTE" | "SOURCING" | "IMPORT_COST" | "CONTACT";
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  country?: string;
  payload: Record<string, unknown>;
}) {
  return amgimsFetch<{ id: string }>("/public/leads", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function amgimsIngestAnalytics(
  events: Array<{
    eventName: string;
    path?: string;
    locale?: string;
    sessionId?: string;
    referrer?: string;
    userAgent?: string;
    props?: Record<string, unknown>;
  }>,
) {
  return amgimsFetch<{ accepted: number }>("/public/analytics/events", {
    method: "POST",
    body: JSON.stringify({ events }),
  });
}
