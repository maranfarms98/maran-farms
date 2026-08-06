import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { buildOrderItems } from "@/lib/orders/build-order-items";
import { finalizePaidOrder } from "@/lib/orders/finalize-paid-order";
import { isPhonePaymentMethod } from "@/lib/orders/payment-methods";
import { getPhoneOrderConfirmUrl } from "@/lib/whatsapp";

function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    phone: rawPhone,
    name,
    address,
    items,
    paymentMethod,
    paidNow,
    notes,
  } = body;

  const phone = normalizePhone(rawPhone);
  if (!/^\d{10}$/.test(phone)) {
    return NextResponse.json(
      { error: "Phone must be a 10-digit Indian mobile number" },
      { status: 400 },
    );
  }

  if (!address?.trim()) {
    return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
  }

  if (!isPhonePaymentMethod(paymentMethod)) {
    return NextResponse.json(
      { error: "paymentMethod must be cash, cash_on_delivery, or manual_upi" },
      { status: 400 },
    );
  }

  const supabase = requireSupabaseAdminClient();

  const { data: existing, error: lookupError } = await supabase
    .from("profiles")
    .select("id, name, phone")
    .eq("phone", phone)
    .maybeSingle();

  if (lookupError) {
    console.error("[admin/orders POST] profile lookup", lookupError);
    return NextResponse.json({ error: "Failed to look up customer" }, { status: 500 });
  }

  let profile = existing;
  if (!profile) {
    const trimmedName = String(name || "").trim();
    if (!trimmedName) {
      return NextResponse.json(
        { error: "Name is required for a new customer" },
        { status: 400 },
      );
    }
    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert({ phone, name: trimmedName, is_admin: false })
      .select("id, name, phone")
      .single();

    if (createError) {
      console.error("[admin/orders POST] profile create", createError);
      return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
    }
    profile = created;
  }

  const built = await buildOrderItems(supabase, items);
  if (built.error) {
    return NextResponse.json({ error: built.error }, { status: built.status });
  }

  const { orderItems, total } = built;
  const shouldMarkPaid = Boolean(paidNow);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      profile_id: profile.id,
      name: profile.name,
      phone: profile.phone,
      address: address.trim(),
      items: orderItems,
      total,
      status: "pending",
      origin: "phone",
      payment_method: paymentMethod,
      notes: notes?.trim() || null,
    })
    .select()
    .single();

  if (orderError) {
    console.error("[admin/orders POST] order insert", orderError);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  let finalOrder = order;
  if (shouldMarkPaid) {
    const result = await finalizePaidOrder(supabase, order.id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    finalOrder = result.order;
  }

  return NextResponse.json({
    orderId: finalOrder.id,
    status: finalOrder.status,
    order: finalOrder,
    whatsappUrl: getPhoneOrderConfirmUrl(finalOrder),
  });
}
