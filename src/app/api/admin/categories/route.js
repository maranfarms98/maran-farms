import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[admin/categories GET]", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }

  return NextResponse.json({ categories: data });
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, slug, name } = body;

  if (!id || !slug || !name) {
    return NextResponse.json(
      { error: "id, slug, and name are required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();
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
}
