import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

export async function PATCH(_request, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = requireSupabaseAdminClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, status, profile_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !order || order.profile_id !== session.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending orders can be cancelled" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[orders/[id]/cancel]", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}
