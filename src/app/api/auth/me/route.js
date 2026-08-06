import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth/session";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const session = await getSessionFromCookies();

  if (!session) {
    return NextResponse.json({ user: null });
  }

  const supabase = requireSupabaseAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", session.id)
    .maybeSingle();

  return NextResponse.json({
    user: {
      id: session.id,
      name: session.name,
      phone: session.phone,
      email: profile?.email || null,
      isAdmin: session.isAdmin,
    },
  });
}
