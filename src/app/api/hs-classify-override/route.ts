import { NextRequest, NextResponse } from "next/server";
import { amgimsClassifyOverride } from "@/lib/amgims";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await amgimsClassifyOverride(body);
    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Override failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
