import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/api/with-admin";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { finalizePaidOrder } from "@/lib/orders/finalize-paid-order";
import { isPhonePaymentMethod } from "@/lib/orders/payment-methods";

export const PATCH = withAdmin(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();
  const { markPaid, paymentMethod, notes } = body;

  if (markPaid == null && paymentMethod === undefined && notes === undefined) {
    return NextResponse.json(
      { error: "Provide markPaid, paymentMethod, and/or notes" },
      { status: 400 },
    );
  }

  if (paymentMethod !== undefined && !isPhonePaymentMethod(paymentMethod)) {
    return NextResponse.json(
      { error: "paymentMethod must be cash, cash_on_delivery, or manual_upi" },
      { status: 400 },
    );
  }

  const supabase = requireSupabaseAdminClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const metaUpdate = {};
  if (paymentMethod !== undefined) metaUpdate.payment_method = paymentMethod;
  if (notes !== undefined) metaUpdate.notes = notes?.trim() || null;

  if (Object.keys(metaUpdate).length > 0) {
    const { error: metaError } = await supabase
      .from("orders")
      .update(metaUpdate)
      .eq("id", id);

    if (metaError) {
      console.error("[admin/orders PATCH] meta update", metaError);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
  }

  if (markPaid) {
    if (order.status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot mark a cancelled order as paid" },
        { status: 400 },
      );
    }
    const result = await finalizePaidOrder(supabase, id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ order: result.order });
  }

  const { data: updated, error: reloadError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (reloadError) {
    console.error("[admin/orders PATCH] reload", reloadError);
    return NextResponse.json({ error: "Failed to load updated order" }, { status: 500 });
  }

  return NextResponse.json({ order: updated });
});
