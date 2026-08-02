import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { signSession, SESSION_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth/session";

const ADMIN_PHONE = "9600267271";

export async function POST(request) {
  const { phone, otp, name } = await request.json();

  if (!phone || !otp) {
    return NextResponse.json(
      { error: "Phone and OTP are required" },
      { status: 400 },
    );
  }

  const supabase = requireSupabaseAdminClient();

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("name")
    .eq("phone", phone)
    .maybeSingle();

  // Only first-time sign-ups need to supply a name — returning users keep
  // their saved name, never overwritten by whatever they type on a later login.
  if (!existingProfile && !name?.trim()) {
    return NextResponse.json(
      { error: "Please enter your name" },
      { status: 400 },
    );
  }

  const { data: record } = await supabase
    .from("otp_codes")
    .select("otp, expires_at")
    .eq("phone", phone)
    .maybeSingle();

  if (!record) {
    return NextResponse.json(
      { error: "OTP not found. Please request a new OTP." },
      { status: 400 },
    );
  }

  if (new Date(record.expires_at).getTime() < Date.now()) {
    await supabase.from("otp_codes").delete().eq("phone", phone);
    return NextResponse.json(
      { error: "OTP has expired. Please request a new one." },
      { status: 400 },
    );
  }

  const isAdmin = phone === ADMIN_PHONE;
  const trimmedOtp = otp.trim();

  // Admin must match the exact hardcoded OTP. For everyone else (testing
  // phase, no real SMS provider wired up), any 4-digit code is accepted.
  if (isAdmin) {
    if (record.otp !== trimmedOtp) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
    }
  } else if (!/^\d{4}$/.test(trimmedOtp)) {
    return NextResponse.json({ error: "Enter a valid 4-digit OTP" }, { status: 400 });
  }

  await supabase.from("otp_codes").delete().eq("phone", phone);

  let profile;
  if (existingProfile) {
    // Returning user — never overwrite their saved name with whatever
    // (possibly different, possibly blank) name was typed this time.
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({ is_admin: isAdmin })
      .eq("phone", phone)
      .select()
      .single();
    if (updateError) {
      console.error("[verify-otp]", updateError);
      return NextResponse.json(
        { error: "Failed to sign in. Please try again." },
        { status: 500 },
      );
    }
    profile = data;
  } else {
    const { data, error: insertError } = await supabase
      .from("profiles")
      .insert({ phone, name: name.trim(), is_admin: isAdmin })
      .select()
      .single();
    if (insertError) {
      console.error("[verify-otp]", insertError);
      return NextResponse.json(
        { error: "Failed to sign in. Please try again." },
        { status: 500 },
      );
    }
    profile = data;
  }

  const token = await signSession({
    id: profile.id,
    phone: profile.phone,
    name: profile.name,
    isAdmin: profile.is_admin,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());

  return NextResponse.json({
    success: true,
    isAdmin: profile.is_admin,
    name: profile.name,
  });
}
