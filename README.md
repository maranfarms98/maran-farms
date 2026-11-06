# Maran Farms

Tamil Nadu farm storefront based in Pallamaruthapatti, Karur — Napier plants, chicks & birds, and small pets. Orders via WhatsApp / Razorpay checkout with Supabase-backed catalog, auth, and admin.

## Requirements

- Node.js **22+** recommended (Node 20 works with a Supabase deprecation warning)
- npm
- One env file: `.env`

## Environment

The app reads production variables (`NEXT_PUBLIC_SUPABASE_URL`, and the rest listed below). Local scripts load `.env`. Hosted deploys (Vercel) use the same names in the Production environment.

Create `.env` in the project root. Never commit it.

`NEXT_PUBLIC_*` is baked in at **build** time. After changing public URLs or keys, redeploy / rebuild.

## Setup

```bash
npm install
```

Required in `.env`:

- `APP_ENV` — `production`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `AUTH_SECRET` — `openssl rand -base64 32`

WhatsApp OTP login (Meta Cloud API — required):

- `WHATSAPP_TOKEN` — System User permanent access token (`whatsapp_business_messaging`)
- `WHATSAPP_PHONE_NUMBER_ID` — sending phone number ID from Meta API Setup
- `WHATSAPP_OTP_TEMPLATE` — approved AUTHENTICATION template name (copy-code)
- `WHATSAPP_OTP_TEMPLATE_LANG` — optional; template language code (default `en`)

If those WhatsApp vars are missing, OTP login returns an error. Codes are not logged.

Order confirmation emails (optional until configured — orders still complete without them):

- `RESEND_API_KEY` — Resend API key (server-only)
- `ORDER_NOTIFY_EMAIL` — inbox that receives every new paid-order notification
- `SITE_URL` — public site origin for admin links in emails (e.g. `https://maranfarms.in`)
- `EMAIL_FROM` — optional From header; defaults to `Maran Farms <hello@maranfarms.in>`. Before the sending domain is verified in Resend, use `Maran Farms <onboarding@resend.dev>`.

New databases: run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor (includes optional `email` on `profiles` and `orders`, and `decrement_stock`).

Existing databases:

- Phone orders: [`supabase/migrations/20260806_phone_orders.sql`](supabase/migrations/20260806_phone_orders.sql)
- Stock decrement (service role only): [`supabase/migrations/20260817_decrement_stock_lockdown.sql`](supabase/migrations/20260817_decrement_stock_lockdown.sql). The app falls back to a direct stock update until `public.decrement_stock` exists.

`npm run seed` writes catalog data to the production database.

## Develop

```bash
npm run dev
```

This loads `.env` and logs `APP_ENV` plus the Supabase hostname. The script fails if `.env` is missing. Login OTP sends real WhatsApp messages.

- Local: http://localhost:3000
- LAN: `http://<your-mac-ip>:3000` (server binds to `0.0.0.0`)

If LAN `/_next` assets return 403, add your current IP to `allowedDevOrigins` in `next.config.mjs` and restart.

## Production build

Hosted deploys (Vercel) inject env vars automatically — use `npm run build`.

Local production build:

```bash
npm run build:prod
npm start
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server using `.env` |
| `npm run build` | Production build (host-provided env) |
| `npm run build:prod` | Local production build using `.env` |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run seed` | Seed the production Supabase catalog |
| `npm run migrate:images` | Rewrite catalog image paths to production Storage URLs |
| `npm run preview:emails` | Write order-email HTML previews to `tmp/` |
