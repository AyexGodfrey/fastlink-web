import * as XLSX from "xlsx";

export type ProductLine = {
  id: string;
  description: string;
  hsCode: string;
  productValue: number;
  quantity: number;
  actualWeightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

export type ParseResult = {
  products: ProductLine[];
  matchedHeaders: string[];
  missingRecommended: string[];
  missingHsCount: number;
};

const HEADER_MAP: Record<string, keyof ProductLine | "cbm" | "unitPrice" | "totalValue"> = {
  "hs code": "hsCode",
  hscode: "hsCode",
  hs: "hsCode",
  "hs-code": "hsCode",
  harmonized: "hsCode",
  "海关编码": "hsCode",
  "税号": "hsCode",
  description: "description",
  product: "description",
  "product name": "description",
  "product description": "description",
  goods: "description",
  item: "description",
  "item description": "description",
  "品名": "description",
  "货名": "description",
  qty: "quantity",
  quantity: "quantity",
  ctns: "quantity",
  cartons: "quantity",
  pcs: "quantity",
  "件数": "quantity",
  "数量": "quantity",
  "unit price": "unitPrice",
  "unit value": "unitPrice",
  "单价": "unitPrice",
  value: "totalValue",
  amount: "totalValue",
  "total value": "totalValue",
  "total amount": "totalValue",
  "金额": "totalValue",
  "总价": "totalValue",
  weight: "actualWeightKg",
  "weight kg": "actualWeightKg",
  "weight (kg)": "actualWeightKg",
  gw: "actualWeightKg",
  "g.w": "actualWeightKg",
  "g.w.": "actualWeightKg",
  nw: "actualWeightKg",
  kg: "actualWeightKg",
  "毛重": "actualWeightKg",
  "净重": "actualWeightKg",
  length: "lengthCm",
  "length cm": "lengthCm",
  "length (cm)": "lengthCm",
  l: "lengthCm",
  "长": "lengthCm",
  width: "widthCm",
  "width cm": "widthCm",
  "width (cm)": "widthCm",
  w: "widthCm",
  "宽": "widthCm",
  height: "heightCm",
  "height cm": "heightCm",
  "height (cm)": "heightCm",
  h: "heightCm",
  "高": "heightCm",
  cbm: "cbm",
  m3: "cbm",
  "m³": "cbm",
  "立方": "cbm",
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function newId() {
  return `p_${Math.random().toString(36).slice(2, 10)}`;
}

function cbmToDims(cbm: number): { lengthCm: number; widthCm: number; heightCm: number } {
  if (cbm <= 0) return { lengthCm: 0, widthCm: 0, heightCm: 0 };
  // 100 × 100 × H cm  =>  cbm = H/100
  return { lengthCm: 100, widthCm: 100, heightCm: Math.round(cbm * 100 * 1000) / 1000 };
}

export function totalCbmForLine(p: ProductLine): number {
  const unit =
    (Number(p.lengthCm) * Number(p.widthCm) * Number(p.heightCm)) / 1_000_000;
  return unit * Math.max(1, Number(p.quantity) || 1);
}

/** Convert total CBM into dimensions for a single aggregated API call (qty=1). */
export function dimsFromTotalCbm(totalCbm: number) {
  return cbmToDims(totalCbm);
}

export function parseTabularFile(buffer: ArrayBuffer, fileName: string): ParseResult {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return {
      products: [],
      matchedHeaders: [],
      missingRecommended: ["hsCode", "description", "quantity", "productValue", "actualWeightKg"],
      missingHsCount: 0,
    };
  }
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  if (!rows.length) {
    return {
      products: [],
      matchedHeaders: [],
      missingRecommended: ["hsCode", "description", "quantity", "productValue", "actualWeightKg"],
      missingHsCount: 0,
    };
  }

  const sampleKeys = Object.keys(rows[0] || {});
  const colMap = new Map<string, keyof ProductLine | "cbm" | "unitPrice" | "totalValue">();
  const matchedHeaders: string[] = [];

  for (const key of sampleKeys) {
    const norm = normalizeHeader(key);
    const mapped = HEADER_MAP[norm];
    if (mapped) {
      colMap.set(key, mapped);
      matchedHeaders.push(`${key} → ${mapped}`);
    }
  }

  const products: ProductLine[] = [];
  for (const row of rows) {
    const mapped: Partial<Record<string, unknown>> = {};
    for (const [key, field] of colMap.entries()) {
      mapped[field] = row[key];
    }

    const description = String(mapped.description || "").trim();
    const hsCode = String(mapped.hsCode || "").trim();
    const quantity = Math.max(1, toNumber(mapped.quantity) || 1);
    const unitPrice = toNumber(mapped.unitPrice);
    const totalValue = toNumber(mapped.totalValue);
    const productValue =
      totalValue > 0 ? totalValue : unitPrice > 0 ? unitPrice * quantity : 0;
    const actualWeightKg = toNumber(mapped.actualWeightKg);
    let lengthCm = toNumber(mapped.lengthCm);
    let widthCm = toNumber(mapped.widthCm);
    let heightCm = toNumber(mapped.heightCm);
    const cbm = toNumber(mapped.cbm);
    if (cbm > 0 && !(lengthCm && widthCm && heightCm)) {
      const dims = cbmToDims(cbm / quantity);
      lengthCm = dims.lengthCm;
      widthCm = dims.widthCm;
      heightCm = dims.heightCm;
    }

    const empty =
      !description &&
      !hsCode &&
      productValue <= 0 &&
      actualWeightKg <= 0 &&
      !(lengthCm && widthCm && heightCm);
    if (empty) continue;

    products.push({
      id: newId(),
      description: description || `Item from ${fileName}`,
      hsCode,
      productValue,
      quantity,
      actualWeightKg: actualWeightKg || 0.001,
      lengthCm,
      widthCm,
      heightCm,
    });
  }

  const has = (field: string) =>
    [...colMap.values()].some((v) => v === field || (field === "productValue" && (v === "unitPrice" || v === "totalValue")));

  const recommended = [
    "hsCode",
    "description",
    "quantity",
    "productValue",
    "actualWeightKg",
    "lengthCm",
    "widthCm",
    "heightCm",
  ];
  const missingRecommended = recommended.filter((f) => !has(f) && !(f.startsWith("length") && has("cbm")));
  // If cbm present, dims not missing
  const missing = missingRecommended.filter((f) => {
    if (["lengthCm", "widthCm", "heightCm"].includes(f) && has("cbm")) return false;
    return true;
  });

  return {
    products,
    matchedHeaders,
    missingRecommended: missing,
    missingHsCount: products.filter((p) => !p.hsCode.trim()).length,
  };
}

export function emptyProductLine(): ProductLine {
  return {
    id: newId(),
    description: "",
    hsCode: "",
    productValue: 1000,
    quantity: 1,
    actualWeightKg: 50,
    lengthCm: 60,
    widthCm: 40,
    heightCm: 40,
  };
}
