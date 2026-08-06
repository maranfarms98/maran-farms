import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { finalizePaidOrder } from "@/lib/orders/finalize-paid-order";

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

  const supabase = requireSupabaseAdminClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, profile_id")
    .eq("id", dbOrderId)
    .eq("profile_id", session.id)
    .maybeSingle();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const result = await finalizePaidOrder(supabase, dbOrderId, {
    razorpayPaymentId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ verified: true, orderId: dbOrderId });
}
