import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const requestedSize = Number(searchParams.get("pageSize")) || 25;
  const pageSize = Math.min(Math.max(1, requestedSize), 500);
  const from = (page - 1) * pageSize;

  const supabase = requireSupabaseAdminClient();
  const { data, count, error } = await supabase
    .from("products")
    .select("*, category:categories(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    console.error("[admin/products GET]", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }

  return NextResponse.json({ products: data, count, page, pageSize });
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, name, categoryId, price } = body;

  if (!id || !name || !categoryId || price == null) {
    return NextResponse.json(
      { error: "id, name, categoryId, and price are required" },
      { status: 400 },
    );
  }

  const supabase = requireSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      id,
      name,
      tamil_name: body.tamilName || null,
      category_id: categoryId,
      price,
      unit: body.unit || null,
      tamil_unit: body.tamilUnit || null,
      min_order: body.minOrder || 1,
      min_order_unit: body.minOrderUnit || null,
      image: body.image || null,
      badge: body.badge || null,
      description: body.description || null,
      featured: Boolean(body.featured),
      track_inventory: body.trackInventory ?? true,
      stock_qty: body.stockQty ?? 0,
    })
    .select()
    .single();

  if (error) {
    console.error("[admin/products POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}
