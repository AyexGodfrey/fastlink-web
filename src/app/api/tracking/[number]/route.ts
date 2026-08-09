import { NextRequest, NextResponse } from "next/server";
import { amgimsTrack } from "@/lib/amgims";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ number: string }> },
) {
  try {
    const { number } = await ctx.params;
    const data = await amgimsTrack(number);
    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Tracking failed";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
