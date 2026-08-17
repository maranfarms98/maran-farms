-- Phone order entry: origin, payment_method, notes on orders.
-- Run in Supabase SQL Editor against an existing project that already has the base schema.

alter table orders
  add column if not exists origin text not null default 'website';

alter table orders
  drop constraint if exists orders_origin_check;

alter table orders
  add constraint orders_origin_check check (origin in ('website', 'phone'));

alter table orders
  add column if not exists payment_method text;

alter table orders
  add column if not exists notes text;

-- Backfill website Razorpay orders that already completed payment.
update orders
set payment_method = 'razorpay'
where payment_method is null
  and razorpay_payment_id is not null;
