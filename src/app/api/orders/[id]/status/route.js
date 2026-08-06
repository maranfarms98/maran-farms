import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { finalizePaidOrder } from "@/lib/orders/finalize-paid-order";

const VALID_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = requireSupabaseAdminClient();

  const { data: current, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !current) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // pending → paid must decrement stock via the shared finalize path.
  if (status === "paid") {
    if (current.status === "pending") {
      const result = await finalizePaidOrder(supabase, id);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      return NextResponse.json({ order: result.order });
    }
    // Already paid or beyond — allow no-op update through normal path.
  }

  // No restock path in v1 — do not move paid/shipped/delivered back to pending.
  if (
    status === "pending" &&
    ["paid", "shipped", "delivered"].includes(current.status)
  ) {
    return NextResponse.json(
      { error: "Cannot move a paid order back to pending" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[orders/[id]/status]", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}
