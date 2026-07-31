import { NextRequest, NextResponse } from "next/server";
import { flimsImportCost } from "@/lib/flims";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await flimsImportCost(body);
    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Calculation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
