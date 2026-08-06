import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ favorites: [] });

  const supabase = requireSupabaseAdminClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("profile_id", session.id);

  if (error) {
    console.error("[favorites GET]", error);
    return NextResponse.json({ error: "Failed to load favorites" }, { status: 500 });
  }

  return NextResponse.json({ favorites: data.map((f) => f.product_id) });
}

export async function POST(request) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  const { productId } = await request.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const supabase = requireSupabaseAdminClient();
  const { error } = await supabase
    .from("favorites")
    .upsert({ profile_id: session.id, product_id: productId });

  if (error) {
    console.error("[favorites POST]", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  const { productId } = await request.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const supabase = requireSupabaseAdminClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("profile_id", session.id)
    .eq("product_id", productId);

  if (error) {
    console.error("[favorites DELETE]", error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
