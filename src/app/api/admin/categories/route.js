import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/api/with-admin";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

export const GET = withAdmin(async () => {
  const supabase = requireSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[admin/categories GET]", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }

  return NextResponse.json({ categories: data });
});

export const POST = withAdmin(async (request) => {
  const body = await request.json();
  const { id, slug, name } = body;

  if (!id || !slug || !name) {
    return NextResponse.json(
      { error: "id, slug, and name are required" },
      { status: 400 },
    );
  }

  const supabase = requireSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      id,
      slug,
      name,
      tamil_name: body.tamilName || null,
      description: body.description || null,
      tamil_description: body.tamilDescription || null,
      image: body.image || null,
      hero_image: body.heroImage || null,
      min_order: body.minOrder || 1,
      min_order_unit: body.minOrderUnit || null,
      gradient: body.gradient || null,
      accent: body.accent || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[admin/categories POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ category: data });
});
