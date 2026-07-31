import { NextRequest, NextResponse } from "next/server";
import { flimsHsCodes } from "@/lib/flims";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const country = req.nextUrl.searchParams.get("country") || undefined;
    const data = await flimsHsCodes(q, country);
    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "HS lookup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
