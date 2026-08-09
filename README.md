# AMG International Logistics — Website

Premium marketing + trade platform for AMG, integrated with **AMGIMS** for shipment tracking, operator-managed freight/HS/tax rates, import-cost calculation, and CRM lead capture.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- Framer Motion, next-intl (EN/ZH), Resend (optional sales email)
- AMGIMS public APIs under `/api/v1/public/*`

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
| `AMGIMS_API_URL` | e.g. `http://127.0.0.1:4000/api/v1` |
| `AMGIMS_SITE_API_KEY` | Optional; must match AMGIMS `WEBSITE_API_KEY` |
| `AMGIMS_COMPANY_CODE` | Default `AMG` |
| `RESEND_API_KEY` / `SALES_INBOX` | Dual lead email (optional) |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp deep link number |

Ensure AMGIMS backend is running with seeded freight/HS/tax rates (Finance → Rates & Tariffs).

## Key routes

- `/en` — Homepage
- `/en/track` — Parcel tracking (AMGIMS public tracking)
- `/en/calculate` — Import cost (lead-gated, AMGIMS rates)
- `/en/quote` · `/en/sourcing` · `/en/contact` — Leads → AMGIMS CRM + email
- `/en/services/*` · `/en/industries/*` · `/en/trade-financing` · `/en/knowledge/*`
- Locale switcher: `/zh/...`
