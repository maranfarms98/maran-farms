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
