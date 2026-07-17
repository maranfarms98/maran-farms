import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Razorpay from "razorpay";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const { items, address } = await request.json();

  if (!Array.isArray(items) || items.length === 0 || !address?.trim()) {
    return NextResponse.json(
      { error: "Cart items and delivery address are required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();

  // Re-fetch authoritative prices/stock — never trust client-submitted totals.
  const productIds = items.map((i) => i.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, unit, track_inventory, stock_qty")
    .in("id", productIds);

  if (productsError) {
    console.error("[create-order] products fetch", productsError);
    return NextResponse.json({ error: "Failed to verify cart" }, { status: 500 });
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.productId} is no longer available` },
        { status: 400 },
      );
    }
    if (product.track_inventory && product.stock_qty < item.quantity) {
      return NextResponse.json(
        { error: `${product.name} is out of stock` },
        { status: 400 },
      );
    }
    const lineTotal = Number(product.price) * item.quantity;
    total += lineTotal;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      unit: product.unit,
      quantity: item.quantity,
      lineTotal,
    });
  }

  if (total <= 0) {
    return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      profile_id: session.id,
      name: session.name,
      phone: session.phone,
      address: address.trim(),
      items: orderItems,
      total,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    console.error("[create-order] order insert", orderError);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
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
