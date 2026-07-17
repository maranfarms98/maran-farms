import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const { dbOrderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    await request.json();

  if (!dbOrderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json(
      { error: "Missing payment details" },
      { status: 400 },
    );
  }

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", dbOrderId)
    .eq("profile_id", session.id)
    .maybeSingle();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Best-effort, floor-clamped stock decrement (accepts rare oversell on
  // concurrent checkout rather than blocking an already-captured payment).
  for (const item of order.items) {
    const { error: stockError } = await supabase.rpc("decrement_stock", {
      p_product_id: item.productId,
      p_qty: item.quantity,
    });
    if (stockError) console.error("[verify-payment] stock decrement", stockError);
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "paid",
      razorpay_payment_id: razorpayPaymentId,
    })
    .eq("id", dbOrderId);

  if (updateError) {
    console.error("[verify-payment] order update", updateError);
    return NextResponse.json({ error: "Failed to finalize order" }, { status: 500 });
  }

  return NextResponse.json({ verified: true, orderId: dbOrderId });
}
