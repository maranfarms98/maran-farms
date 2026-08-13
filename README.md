# Maran Farms

Tamil Nadu farm storefront — Napier plants, chicks & birds, and small pets. Orders via WhatsApp / Razorpay checkout with Supabase-backed catalog, auth, and admin.

## Requirements

- Node.js **22+** recommended (Node 20 works with a Supabase deprecation warning)
- npm
- Two env files: `.env.staging` (default) and `.env.production` (live DB)

## Environments

The app always reads the same variable names (`NEXT_PUBLIC_SUPABASE_URL`, etc.). The **file** you load decides which database you hit.

| File | Used by | Database |
|------|---------|----------|
| `.env.staging` | `npm run dev`, `npm run seed` | Staging Supabase |
| `.env.production` | `npm run dev:prod`, `npm run seed:prod` | Production Supabase |

Create **two Supabase projects** (staging + production). Copy the same schema (`supabase/schema.sql` + migrations) to both. Use Razorpay **test** keys on staging and **live** keys on production.

Create `.env.staging` and `.env.production` in the project root with the variables listed below. Never commit those files.

On Vercel (or similar), set the **same variable names** twice:

- Production environment → `main` branch → production Supabase
- Preview / Staging environment → `staging` branch → staging Supabase

`NEXT_PUBLIC_*` is baked in at **build** time. After changing DB URLs, redeploy / rebuild.

## Setup

```bash
npm install
```

Required in each env file:

- `APP_ENV` — `staging` or `production`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `AUTH_SECRET` — different per environment (`openssl rand -base64 32`)

Order confirmation emails (optional until configured — orders still complete without them):

- `RESEND_API_KEY` — Resend API key (server-only)
- `ORDER_NOTIFY_EMAIL` — inbox that receives every new paid-order notification
- `SITE_URL` — public site origin for admin links in emails (e.g. `https://maranfarms.in`)
- `EMAIL_FROM` — optional From header; defaults to `Maran Farms <hello@maranfarms.in>`. Before the sending domain is verified in Resend, use `Maran Farms <onboarding@resend.dev>`.

If the database was created before order emails, run `supabase/migrations/20260806_order_emails.sql` in the Supabase SQL Editor (adds optional `email` on `profiles` and `orders`).

If paid orders log `Could not find the function public.decrement_stock`, run `supabase/migrations/20260806_decrement_stock.sql` in the SQL Editor (the app falls back to a direct stock update until that function exists).

Optional — seed **staging** catalog data:

```bash
npm run seed
```

## Develop

```bash
npm run dev          # staging DB (default)
npm run dev:prod     # production DB — use carefully
```

Startup logs the active `APP_ENV` and Supabase hostname so you can confirm which DB is connected. Scripts fail if the matching `.env.staging` / `.env.production` file is missing.

- Local: http://localhost:3000
- LAN: `http://<your-mac-ip>:3000` (server binds to `0.0.0.0`)

If LAN `/_next` assets return 403, add your current IP to `allowedDevOrigins` in `next.config.mjs` and restart.

## Production build

Hosted deploys (Vercel) inject env vars automatically — use `npm run build`.

Local builds against a specific DB:

```bash
npm run build:staging
npm run build:prod
npm start
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server → staging DB |
| `npm run dev:prod` | Dev server → production DB |
| `npm run build` | Production build (host-provided env) |
| `npm run build:staging` / `build:prod` | Local build with that env file |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run seed` | Seed **staging** Supabase |
| `npm run seed:prod` | Seed **production** Supabase |
