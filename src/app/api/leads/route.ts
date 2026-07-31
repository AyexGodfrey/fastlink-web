import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { flimsCreateLead } from "@/lib/flims";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      name,
      email,
      phone,
      companyName,
      country,
      payload = {},
    } = body as {
      type: "QUOTE" | "SOURCING" | "IMPORT_COST" | "CONTACT";
      name: string;
      email?: string;
      phone?: string;
      companyName?: string;
      country?: string;
      payload?: Record<string, unknown>;
    };

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and email or phone are required" },
        { status: 400 },
      );
    }

    const lead = await flimsCreateLead({
      type,
      name,
      email,
      phone,
      companyName,
      country,
      payload,
    });

    const salesInbox = process.env.SALES_INBOX;
    const resendKey = process.env.RESEND_API_KEY;
    if (salesInbox && resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Fast Link Website <onboarding@resend.dev>",
        to: salesInbox,
        subject: `[${type}] Website lead from ${name}`,
        text: [
          `Type: ${type}`,
          `Name: ${name}`,
          `Email: ${email || "-"}`,
          `Phone: ${phone || "-"}`,
          `Company: ${companyName || "-"}`,
          `Country: ${country || "-"}`,
          "",
          "Payload:",
          JSON.stringify(payload, null, 2),
          "",
          `FLIMS lead id: ${lead.id}`,
        ].join("\n"),
      });
    }

    return NextResponse.json({ data: lead });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Lead submission failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
