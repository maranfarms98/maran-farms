import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const ADMIN_PHONE = "9600267271";
const ADMIN_OTP = "1122";
const MOCK_OTP = "1234";
const RESEND_COOLDOWN_MS = 30 * 1000;

export async function POST(request) {
  const { phone } = await request.json();

  if (!phone || !/^\d{10}$/.test(phone)) {
    return NextResponse.json(
      { error: "Enter a valid 10-digit phone number" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("otp_codes")
    .select("expires_at")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    const issuedAt = new Date(existing.expires_at).getTime() - 5 * 60 * 1000;
    if (Date.now() - issuedAt < RESEND_COOLDOWN_MS) {
      return NextResponse.json(
        { error: "Please wait a few seconds before requesting another OTP" },
        { status: 429 },
      );
    }
  }

  const otp = phone === ADMIN_PHONE ? ADMIN_OTP : MOCK_OTP;
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("otp_codes")
    .upsert({ phone, otp, expires_at: expiresAt });

  if (error) {
    console.error("[send-otp]", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 },
    );
  }

  // In production, send the OTP via SMS here
  console.log(`[OTP] ${phone} → ${otp}`);

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("name")
    .eq("phone", phone)
    .maybeSingle();

  return NextResponse.json({
    success: true,
    isNewUser: !existingProfile,
  });
}
