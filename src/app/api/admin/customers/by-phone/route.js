import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/api/with-admin";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { isValidMobile, normalizePhone, PHONE_ERROR } from "@/lib/phone";

export const GET = withAdmin(async (request) => {
  const { searchParams } = new URL(request.url);
  const phone = normalizePhone(searchParams.get("phone"));

  if (!isValidMobile(phone)) {
    return NextResponse.json({ error: PHONE_ERROR }, { status: 400 });
  }

  const supabase = requireSupabaseAdminClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, phone, created_at, email")
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    console.error("[admin/customers/by-phone]", error);
    return NextResponse.json({ error: "Failed to look up customer" }, { status: 500 });
  }

  return NextResponse.json({
    phone,
    found: Boolean(profile),
    profile: profile || null,
  });
});
