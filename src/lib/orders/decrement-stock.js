/**
 * Decrement product stock for a paid line item.
 * Prefers the atomic `decrement_stock` RPC; falls back to a client update
 * if the function has not been applied yet (PGRST202).
 */
export async function decrementStock(supabase, productId, qty) {
  const { error } = await supabase.rpc("decrement_stock", {
    p_product_id: productId,
    p_qty: qty,
  });

  if (!error) return { ok: true };

  // Function missing from the remote schema — apply the migration, but
  // keep inventory moving in the meantime.
  if (error.code === "PGRST202") {
    console.warn(
      "[decrementStock] RPC missing — using fallback update. Run supabase/migrations/20260806_decrement_stock.sql",
    );
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock_qty, track_inventory")
      .eq("id", productId)
      .maybeSingle();

    if (fetchError) {
      console.error("[decrementStock] fallback fetch", fetchError);
      return { ok: false, error: fetchError };
    }
    if (!product?.track_inventory) return { ok: true };

    const nextQty = Math.max(0, Number(product.stock_qty) - Number(qty));
    const { error: updateError } = await supabase
      .from("products")
      .update({ stock_qty: nextQty })
      .eq("id", productId)
      .eq("track_inventory", true);

    if (updateError) {
      console.error("[decrementStock] fallback update", updateError);
      return { ok: false, error: updateError };
    }
    return { ok: true, usedFallback: true };
  }

  console.error("[decrementStock]", error);
  return { ok: false, error };
}
