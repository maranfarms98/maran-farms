-- Maran Farms — initial schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query → paste → Run)

create table categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  tamil_name text,
  description text,
  tamil_description text,
  image text,
  hero_image text,
  min_order integer,
  min_order_unit text,
  gradient text,
  accent text,
  created_at timestamptz default now()
);

create table products (
  id text primary key,
  category_id text references categories(id) on delete restrict,
  name text not null,
  tamil_name text,
  price numeric not null,
  unit text,
  tamil_unit text,
  min_order integer default 1,
  min_order_unit text,
  image text,
  badge text,
  description text,
  featured boolean not null default false,
  track_inventory boolean not null default true,
  stock_qty integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index products_category_id_idx on products(category_id);

create table category_content (
  category_id text primary key references categories(id) on delete cascade,
  specs jsonb,       -- [{label, value}]
  care_tips jsonb,   -- [string, ...]
  origin_notes jsonb, -- [string, ...]
  faqs jsonb         -- [{q, a}]
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null check (phone ~ '^\d{10}$'),
  name text not null,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

create table otp_codes (
  phone text primary key,
  otp text not null,
  expires_at timestamptz not null
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  name text not null,
  phone text not null,
  address text not null,
  items jsonb not null,          -- snapshot: [{productId, name, price, quantity, unit}]
  total numeric not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  status text not null default 'pending'
    check (status in ('pending','paid','shipped','delivered','cancelled')),
  created_at timestamptz default now()
);
create index orders_profile_id_idx on orders(profile_id);
create index orders_status_idx on orders(status);
create index orders_created_at_idx on orders(created_at desc);

create table favorites (
  profile_id uuid references profiles(id) on delete cascade,
  product_id text references products(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (profile_id, product_id)
);

-- Row Level Security
alter table categories enable row level security;
alter table products enable row level security;
alter table category_content enable row level security;
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read category_content" on category_content for select using (true);

-- Atomic, floor-clamped stock decrement used by the payment-verification route.
-- Never goes negative; no-ops for products that don't track inventory.
create or replace function decrement_stock(p_product_id text, p_qty integer)
returns void
language sql
as $$
  update products
  set stock_qty = greatest(stock_qty - p_qty, 0)
  where id = p_product_id and track_inventory = true;
$$;

alter table profiles enable row level security;       -- no public policies — service role only
alter table otp_codes enable row level security;       -- no public policies — service role only
alter table orders enable row level security;          -- no public policies — service role only
alter table favorites enable row level security;       -- no public policies — service role only

-- Storage: run this after creating a "product-images" bucket (Storage → New bucket → public)
-- via the Supabase dashboard UI (bucket creation isn't reliably scriptable in SQL across
-- versions), then writes are restricted to the service role by default (no INSERT/UPDATE/
-- DELETE storage policies for anon/authenticated roles are created here, so browser uploads
-- are blocked; only our server routes using the service-role key can write).
