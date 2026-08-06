/**
 * Mark a pending order as paid and decrement stock once.
 * Idempotent: if the order is already paid (or further along), returns success
 * without decrementing again.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} orderId
 * @param {{ razorpayPaymentId?: string }} [extras]
 * @returns {Promise<{ ok: true, order: object, alreadyPaid?: boolean } | { ok: false, error: string, status: number }>}
 */
export async function finalizePaidOrder(supabase, orderId, extras = {}) {
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    return { ok: false, error: "Order not found", status: 404 };
  }

  if (order.status === "cancelled") {
    return { ok: false, error: "Cannot mark a cancelled order as paid", status: 400 };
  }

  // Already paid / shipped / delivered — do not double-decrement stock.
  if (order.status !== "pending") {
    return { ok: true, order, alreadyPaid: true };
  }

  for (const item of order.items || []) {
    const { error: stockError } = await supabase.rpc("decrement_stock", {
      p_product_id: item.productId,
      p_qty: item.quantity,
    });
    if (stockError) console.error("[finalizePaidOrder] stock decrement", stockError);
  }

  const update = { status: "paid" };
  if (extras.razorpayPaymentId) {
    update.razorpay_payment_id = extras.razorpayPaymentId;
  }

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId)
    .eq("status", "pending") // guard against concurrent finalize
    .select()
    .maybeSingle();

  if (updateError) {
    console.error("[finalizePaidOrder] order update", updateError);
    return { ok: false, error: "Failed to finalize order", status: 500 };
  }

  // Another request won the race and already moved it off pending.
  if (!updated) {
    const { data: current } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();
    return { ok: true, order: current || order, alreadyPaid: true };
  }

  return { ok: true, order: updated };
}
