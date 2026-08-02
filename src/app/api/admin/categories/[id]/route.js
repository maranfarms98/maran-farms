import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

const FIELD_MAP = {
  slug: "slug",
  name: "name",
  tamilName: "tamil_name",
  description: "description",
  tamilDescription: "tamil_description",
  image: "image",
  heroImage: "hero_image",
  minOrder: "min_order",
  minOrderUnit: "min_order_unit",
  gradient: "gradient",
  accent: "accent",
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

  const supabase = requireSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/categories PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ category: data });
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = requireSupabaseAdminClient();

  // products.category_id references categories(id) on delete restrict —
  // Postgres will reject this if products still exist for the category.
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("[admin/categories DELETE]", error);
    return NextResponse.json(
      { error: "Cannot delete a category that still has products. Reassign or delete its products first." },
      { status: 409 },
    );
  }

  return NextResponse.json({ success: true });
}
