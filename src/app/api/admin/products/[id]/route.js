import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/api/with-admin";
import { applyFieldMap } from "@/lib/api/field-map";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteStorageObject, replaceStorageObject } from "@/lib/supabase/storage";

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

export const PATCH = withAdmin(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();

  const update = applyFieldMap(body, FIELD_MAP);
  update.updated_at = new Date().toISOString();

  const supabase = requireSupabaseAdminClient();

  let previousImage = null;
  if (body.image !== undefined) {
    const { data: existing } = await supabase
      .from("products")
      .select("image")
      .eq("id", id)
      .maybeSingle();
    previousImage = existing?.image ?? null;
  }

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

  if (body.image !== undefined) {
    await replaceStorageObject(previousImage, body.image);
  }

  return NextResponse.json({ product: data });
});

export const DELETE = withAdmin(async (_request, { params }) => {
  const { id } = await params;
  const supabase = requireSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("products")
    .select("image")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("[admin/products DELETE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await deleteStorageObject(existing?.image);

  return NextResponse.json({ success: true });
});
