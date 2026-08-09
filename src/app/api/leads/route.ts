import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { amgimsCreateLead } from "@/lib/amgims";

type LeadType = "QUOTE" | "SOURCING" | "IMPORT_COST" | "CONTACT";

const PAYLOAD_LABELS: Record<string, string> = {
  productName: "Product name",
  quantity: "Quantity",
  productDescription: "Product description",
  destinationCountry: "Destination country",
  shippingMethod: "Preferred shipping",
  notes: "Additional notes",
  message: "Message",
  mode: "Freight mode",
  originCountry: "Origin country",
  destinationCity: "Destination city",
  hsCode: "HS code",
  description: "Description",
};

const CONTACT_PAYLOAD_KEYS = new Set([
  "name",
  "email",
  "phone",
  "company",
  "companyName",
  "country",
]);

function leadSubject(type: LeadType, name: string): string {
  switch (type) {
    case "QUOTE":
      return `[QUOTE] Request for quotation from ${name}`;
    case "SOURCING":
      return `[SOURCING] Sourcing request from ${name}`;
    case "IMPORT_COST":
      return `[IMPORT_COST] Import cost estimate from ${name}`;
    case "CONTACT":
      return `[CONTACT] Contact request from ${name}`;
    default:
      return `[${type}] Website lead from ${name}`;
  }
}

function formatPayloadLines(payload: Record<string, unknown>): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(payload)) {
    if (CONTACT_PAYLOAD_KEYS.has(key)) continue;
    if (value == null) continue;
    if (typeof value === "object") continue;
    const text = String(value).trim();
    if (!text) continue;
    const label =
      PAYLOAD_LABELS[key] ||
      key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
    lines.push(`${label}: ${text}`);
  }
  return lines;
}

function buildLeadEmailText(input: {
  type: LeadType;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  country?: string;
  payload?: Record<string, unknown>;
  leadId?: string;
}): string {
  const detailLines = formatPayloadLines(input.payload || {});
  return [
    `New website ${input.type.toLowerCase().replaceAll("_", " ")} request`,
    "",
    `Name: ${input.name}`,
    `Email: ${input.email || "-"}`,
    `Phone: ${input.phone || "-"}`,
    `Company: ${input.companyName || "-"}`,
    `Country: ${input.country || "-"}`,
    ...(detailLines.length ? ["", ...detailLines] : []),
    ...(input.leadId ? ["", `Lead ID: ${input.leadId}`] : []),
  ].join("\n");
}

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
      type: LeadType;
      name: string;
      email?: string;
      phone?: string;
      companyName?: string;
      country?: string;
      payload?: Record<string, unknown>;
    };

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 },
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email).trim());
    if (!emailOk) {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 },
      );
    }

    const phoneClean = String(phone).trim().replace(/[\s\-().]/g, "");
    const phoneOk = phoneClean.startsWith("+")
      ? /^\+[1-9]\d{7,14}$/.test(phoneClean)
      : /^[0-9]{8,15}$/.test(phoneClean);
    if (!phoneOk) {
      return NextResponse.json(
        { error: "Enter a valid phone number" },
        { status: 400 },
      );
    }

    const lead = await amgimsCreateLead({
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
        from: "AMG Website <onboarding@resend.dev>",
        to: salesInbox,
        subject: leadSubject(type, name),
        text: buildLeadEmailText({
          type,
          name,
          email,
          phone,
          companyName,
          country,
          payload,
          leadId: lead.id,
        }),
      });
    }

    return NextResponse.json({ data: lead });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Lead submission failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
