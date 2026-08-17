import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/api/with-admin";
import { applyFieldMap } from "@/lib/api/field-map";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteStorageObject, replaceStorageObject } from "@/lib/supabase/storage";

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

export const PATCH = withAdmin(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();

  const update = applyFieldMap(body, FIELD_MAP);

  const supabase = requireSupabaseAdminClient();

  let previous = null;
  if (body.image !== undefined || body.heroImage !== undefined) {
    const { data: existing } = await supabase
      .from("categories")
      .select("image, hero_image")
      .eq("id", id)
      .maybeSingle();
    previous = existing;
  }

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

  if (body.image !== undefined) {
    await replaceStorageObject(previous?.image, body.image);
  }
  if (body.heroImage !== undefined) {
    await replaceStorageObject(previous?.hero_image, body.heroImage);
  }

  return NextResponse.json({ category: data });
});

export const DELETE = withAdmin(async (_request, { params }) => {
  const { id } = await params;
  const supabase = requireSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("categories")
    .select("image, hero_image")
    .eq("id", id)
    .maybeSingle();

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

  await deleteStorageObject(existing?.image);
  await deleteStorageObject(existing?.hero_image);

  return NextResponse.json({ success: true });
});
