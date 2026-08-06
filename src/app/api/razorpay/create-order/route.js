import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getSessionFromCookies } from "@/lib/auth/session";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildOrderItems } from "@/lib/orders/build-order-items";
import { parseOptionalEmail } from "@/lib/email";

export async function POST(request) {
  const session = await getSessionFromCookies();

  if (!session) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const { items, address, email: rawEmail } = await request.json();

  if (!address?.trim()) {
    return NextResponse.json(
      { error: "Cart items and delivery address are required" },
      { status: 400 },
    );
  }

  const parsedEmail = parseOptionalEmail(rawEmail);
  if (parsedEmail.error) {
    return NextResponse.json({ error: parsedEmail.error }, { status: 400 });
  }
  const email = parsedEmail.email;

  const supabase = requireSupabaseAdminClient();
  const built = await buildOrderItems(supabase, items);
  if (built.error) {
    return NextResponse.json({ error: built.error }, { status: built.status });
  }

  const { orderItems, total } = built;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      profile_id: session.id,
      name: session.name,
      phone: session.phone,
      email,
      address: address.trim(),
      items: orderItems,
      total,
      status: "pending",
      origin: "website",
      payment_method: "razorpay",
    })
    .select()
    .single();

  if (orderError) {
    console.error("[create-order] order insert", orderError);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  if (email) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ email })
      .eq("id", session.id);
    if (profileError) console.error("[create-order] profile email", profileError);
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: order.id,
    });

    await supabase
      .from("orders")
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq("id", order.id);

    return NextResponse.json({
      dbOrderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[create-order] razorpay", err);
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
