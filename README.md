# Fast Link International Logistics — Website

Premium marketing + trade platform for Fast Link, integrated with **FLIMS** for shipment tracking, operator-managed freight/HS/tax rates, import-cost calculation, and CRM lead capture.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- Framer Motion, next-intl (EN/ZH), Resend (optional sales email)
- FLIMS public APIs under `/api/v1/public/*`

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3200](http://localhost:3200) (redirects to `/en`).

### Environment

| Variable | Purpose |
|----------|---------|
| `FLIMS_API_URL` | e.g. `http://127.0.0.1:4000/api/v1` |
| `FLIMS_SITE_API_KEY` | Optional; must match FLIMS `WEBSITE_API_KEY` |
| `FLIMS_COMPANY_CODE` | Default `FLI` |
| `RESEND_API_KEY` / `SALES_INBOX` | Dual lead email (optional) |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp deep link number |

Ensure FLIMS backend is running with seeded freight/HS/tax rates (Finance → Rates & Tariffs).

## Key routes

- `/en` — Homepage
- `/en/track` — Parcel tracking (FLIMS public tracking)
- `/en/calculate` — Import cost (lead-gated, FLIMS rates)
- `/en/quote` · `/en/sourcing` · `/en/contact` — Leads → FLIMS CRM + email
- `/en/services/*` · `/en/industries/*` · `/en/trade-financing` · `/en/knowledge/*`
- Locale switcher: `/zh/...`
