-- Revoke the accidental anon/authenticated access to decrement_stock() and
-- drop security definer so the function runs with invoker (caller) privileges
-- again. It should only ever be callable by the service-role key from
-- trusted server-side code (src/lib/orders/decrement-stock.js), never
-- directly by public clients via PostgREST.

create or replace function decrement_stock(p_product_id text, p_qty integer)
returns void
language sql
as $$
  update products
  set stock_qty = greatest(stock_qty - p_qty, 0)
  where id = p_product_id and track_inventory = true;
$$;

revoke all on function decrement_stock(text, integer) from public;
revoke all on function decrement_stock(text, integer) from anon;
revoke all on function decrement_stock(text, integer) from authenticated;
grant execute on function decrement_stock(text, integer) to service_role;
