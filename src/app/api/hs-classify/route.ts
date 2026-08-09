import { NextRequest, NextResponse } from "next/server";
import { amgimsClassifyHs } from "@/lib/amgims";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await amgimsClassifyHs(
      String(body.description || ""),
      String(body.country || "UG"),
    );
    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Classify failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
