import { NextRequest, NextResponse } from "next/server";
import { AMGIMS_UNAVAILABLE, amgimsImportCost } from "@/lib/amgims";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await amgimsImportCost(body);
    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Calculation failed";
    const unavailable = message === AMGIMS_UNAVAILABLE;
    return NextResponse.json(
      { error: message },
      { status: unavailable ? 502 : 400 },
    );
  }
}
