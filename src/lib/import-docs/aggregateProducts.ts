import type { ImportCostResult } from "@/lib/amgims";
import {
  dimsFromTotalCbm,
  totalCbmForLine,
  type ProductLine,
} from "@/lib/import-docs/parsePackingList";

export type CargoGroupPayload = {
  mode: string;
  productValue: number;
  quantity: number;
  actualWeightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  hsCode?: string;
  originCountry: string;
  destinationCountry: string;
  destinationCity?: string;
  insurance: boolean;
  /** Results display currency */
  currency: string;
  operatingCurrency: string;
  displayCurrency: string;
  taxExemption?: "NONE" | "VAT_EXEMPT" | "FULLY_EXEMPT";
};

function normalizeHs(hs: string) {
  const t = hs.trim().toUpperCase();
  return t || "UNKNOWN";
}

export function groupProductsByHs(products: ProductLine[]): Map<string, ProductLine[]> {
  const map = new Map<string, ProductLine[]>();
  for (const p of products) {
    const key = normalizeHs(p.hsCode);
    const list = map.get(key) || [];
    list.push(p);
    map.set(key, list);
  }
  return map;
}

export function aggregateGroup(
  lines: ProductLine[],
  shared: {
    mode: string;
    originCountry: string;
    destinationCountry: string;
    destinationCity?: string;
    insurance: boolean;
    displayCurrency: string;
    taxExemption?: "NONE" | "VAT_EXEMPT" | "FULLY_EXEMPT";
  },
): CargoGroupPayload {
  const productValue = lines.reduce(
    (s, p) =>
      s +
      Number(p.productValue || 0) * Math.max(1, Number(p.quantity) || 1),
    0,
  );
  const actualWeightKg = lines.reduce(
    (s, p) => s + Number(p.actualWeightKg || 0) * Math.max(1, Number(p.quantity) || 1),
    0,
  );
  const totalCbm = lines.reduce((s, p) => s + totalCbmForLine(p), 0);
  const dims = dimsFromTotalCbm(totalCbm);
  const hs = lines.find((p) => p.hsCode.trim())?.hsCode.trim();

  return {
    mode: shared.mode,
    productValue,
    quantity: 1,
    actualWeightKg: Math.max(actualWeightKg, 0.001),
    lengthCm: dims.lengthCm,
    widthCm: dims.widthCm,
    heightCm: dims.heightCm,
    hsCode: hs || undefined,
    originCountry: shared.originCountry,
    destinationCountry: shared.destinationCountry,
    destinationCity: shared.destinationCity,
    insurance: shared.insurance,
    currency: shared.displayCurrency,
    operatingCurrency: "USD",
    displayCurrency: shared.displayCurrency,
    taxExemption: shared.taxExemption || "NONE",
  };
}

export function sumImportResults(results: ImportCostResult[]): ImportCostResult {
  if (!results.length) {
    throw new Error("No calculation results");
  }
  const currency = results[0].currency;
  const lines = results.flatMap((r) => r.lines);
  const transitMins = results
    .map((r) => r.estimatedTransitDays?.min)
    .filter((n): n is number => n != null);
  const transitMaxs = results
    .map((r) => r.estimatedTransitDays?.max)
    .filter((n): n is number => n != null);

  const first = results[0];
  return {
    currency,
    operatingCurrency: first.operatingCurrency,
    displayCurrency: first.displayCurrency ?? currency,
    displayExchangeRate: first.displayExchangeRate ?? first.exchangeRate ?? null,
    displayExchangeRateSource:
      first.displayExchangeRateSource ?? first.exchangeRateSource ?? null,
    exchangeRate: first.exchangeRate ?? null,
    exchangeRateSource: first.exchangeRateSource ?? null,
    estimatedFreightCost: round2(
      results.reduce((s, r) => s + r.estimatedFreightCost, 0),
    ),
    estimatedCustomsDuty: round2(
      results.reduce((s, r) => s + r.estimatedCustomsDuty, 0),
    ),
    estimatedTaxes: round2(results.reduce((s, r) => s + r.estimatedTaxes, 0)),
    estimatedLandedCost: round2(
      results.reduce((s, r) => s + r.estimatedLandedCost, 0),
    ),
    estimatedTransitDays:
      transitMins.length || transitMaxs.length
        ? {
            min: transitMins.length ? Math.min(...transitMins) : null,
            max: transitMaxs.length ? Math.max(...transitMaxs) : null,
          }
        : null,
    productValue: round2(results.reduce((s, r) => s + r.productValue, 0)),
    cif: round2(results.reduce((s, r) => s + r.cif, 0)),
    lines,
    disclaimer: first.disclaimer,
    hsCode: results.length === 1 ? first.hsCode : null,
    hsDescription: results.length === 1 ? first.hsDescription : null,
    cbm: round3(results.reduce((s, r) => s + (r.cbm || 0), 0)),
    chargeableWeightKg: round3(
      results.reduce((s, r) => s + (r.chargeableWeightKg || 0), 0),
    ),
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}

export function isSeaMode(mode: string) {
  return /SEA/i.test(mode);
}
