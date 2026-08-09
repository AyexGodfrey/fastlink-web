import { NextRequest, NextResponse } from "next/server";
import { amgimsIngestAnalytics } from "@/lib/amgims";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = Array.isArray(body?.events)
      ? body.events
      : body?.eventName
        ? [body]
        : [];
    if (!events.length) {
      return NextResponse.json({ error: "No events" }, { status: 400 });
    }
    const data = await amgimsIngestAnalytics(events);
    return NextResponse.json({ data });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Analytics ingest failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
