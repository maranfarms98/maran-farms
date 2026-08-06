# Maran Farms

Tamil Nadu farm storefront — Napier plants, chicks & birds, and small pets. Orders via WhatsApp / Razorpay checkout with Supabase-backed catalog, auth, and admin.

## Requirements

- Node.js **22+** recommended (Node 20 works with a Supabase deprecation warning)
- npm
- A filled-in `.env.local` (Supabase, Razorpay, `AUTH_SECRET`)

## Setup

```bash
npm install
```

Ensure `.env.local` exists in the project root with:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `AUTH_SECRET`

Order confirmation emails (optional until configured — orders still complete without them):

- `RESEND_API_KEY` — Resend API key (server-only)
- `ORDER_NOTIFY_EMAIL` — inbox that receives every new paid-order notification
- `SITE_URL` — public site origin for admin links in emails (e.g. `https://maranfarms.in`)
- `EMAIL_FROM` — optional From header; defaults to `Maran Farms <hello@maranfarms.in>`. Before the sending domain is verified in Resend, use `Maran Farms <onboarding@resend.dev>`.

If the database was created before order emails, run `supabase/migrations/20260806_order_emails.sql` in the Supabase SQL Editor (adds optional `email` on `profiles` and `orders`).

If paid orders log `Could not find the function public.decrement_stock`, run `supabase/migrations/20260806_decrement_stock.sql` in the SQL Editor (the app falls back to a direct stock update until that function exists).

Optional — seed catalog data:

```bash
npm run seed
```

## Develop

```bash
npm run dev
```

- Local: http://localhost:3000  
- LAN: `http://<your-mac-ip>:3000` (server binds to `0.0.0.0`)

If LAN `/_next` assets return 403, add your current IP to `allowedDevOrigins` in `next.config.mjs` and restart.

## Production build

```bash
npm run build
npm start
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server on all interfaces |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run seed` | Seed Supabase from `scripts/seed-supabase.mjs` |
