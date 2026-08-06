import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export async function GET(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const phone = normalizePhone(searchParams.get("phone"));

  if (!/^\d{10}$/.test(phone)) {
    return NextResponse.json(
      { error: "Phone must be a 10-digit Indian mobile number" },
      { status: 400 },
    );
  }

  const supabase = requireSupabaseAdminClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, phone, created_at")
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
}
