import { NextRequest, NextResponse } from "next/server";
import { flimsFreightModes } from "@/lib/flims";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const originCountry =
      req.nextUrl.searchParams.get("originCountry") || undefined;
    const destinationCountry =
      req.nextUrl.searchParams.get("destinationCountry") || undefined;
    const data = await flimsFreightModes(originCountry, destinationCountry);
    return NextResponse.json({ data: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Freight modes failed";
    console.error("[api/freight-modes]", message);
    return NextResponse.json({ error: message, data: [] }, { status: 502 });
  }
}
