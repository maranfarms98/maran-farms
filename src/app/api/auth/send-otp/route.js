import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { isValidMobile } from "@/lib/phone";
import { OTP_LENGTH } from "@/lib/otp";
import {
  isWhatsAppOtpConfigured,
  sendWhatsAppOtp,
} from "@/lib/whatsapp-otp";

const RESEND_COOLDOWN_MS = 30 * 1000;
const OTP_TTL_MS = 5 * 60 * 1000;

function generateOtp() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH;
  return String(randomInt(min, max));
}

export async function POST(request) {
  const { phone } = await request.json();

  if (!isValidMobile(phone)) {
    return NextResponse.json(
      { error: "Enter a valid 10-digit phone number" },
      { status: 400 },
    );
  }

  const supabase = requireSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("otp_codes")
    .select("expires_at")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    const issuedAt = new Date(existing.expires_at).getTime() - OTP_TTL_MS;
    if (Date.now() - issuedAt < RESEND_COOLDOWN_MS) {
      return NextResponse.json(
        { error: "Please wait a few seconds before requesting another OTP" },
        { status: 429 },
      );
    }
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

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

  if (isWhatsAppOtpConfigured()) {
    try {
      await sendWhatsAppOtp({ phone, otp });
    } catch (err) {
      await supabase.from("otp_codes").delete().eq("phone", phone);
      console.error("[send-otp] WhatsApp delivery failed", err?.message || err);
      return NextResponse.json(
        {
          error:
            "Could not send OTP on WhatsApp. Check the number has WhatsApp, or try again.",
        },
        { status: 502 },
      );
    }
  } else {
    await supabase.from("otp_codes").delete().eq("phone", phone);
    console.error("[send-otp] WhatsApp OTP env vars missing");
    return NextResponse.json(
      { error: "OTP delivery is not configured. Please try again later." },
      { status: 503 },
    );
  }

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
