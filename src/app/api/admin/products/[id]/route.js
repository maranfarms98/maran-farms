import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

const FIELD_MAP = {
  name: "name",
  tamilName: "tamil_name",
  categoryId: "category_id",
  price: "price",
  unit: "unit",
  tamilUnit: "tamil_unit",
  minOrder: "min_order",
  minOrderUnit: "min_order_unit",
  image: "image",
  badge: "badge",
  description: "description",
  featured: "featured",
  trackInventory: "track_inventory",
  stockQty: "stock_qty",
};

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const update = {};
  for (const [key, column] of Object.entries(FIELD_MAP)) {
    if (body[key] !== undefined) update[column] = body[key];
  }
  update.updated_at = new Date().toISOString();

  const supabase = requireSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/products PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = requireSupabaseAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("[admin/products DELETE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
