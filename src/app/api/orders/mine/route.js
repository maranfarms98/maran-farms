import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }

  const supabase = requireSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("profile_id", session.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[orders/mine]", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}
