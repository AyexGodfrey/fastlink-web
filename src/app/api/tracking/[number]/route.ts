import { NextRequest, NextResponse } from "next/server";
import { AMGIMS_UNAVAILABLE, amgimsTrack } from "@/lib/amgims";

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
    const unavailable = message === AMGIMS_UNAVAILABLE;
    return NextResponse.json(
      { error: message },
      { status: unavailable ? 502 : 404 },
    );
  }
}
