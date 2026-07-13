"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { Spinner } from "@/components/ui/spinner";
import { FarmPageIntro } from "@/components/ui/farm-page-intro";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { TamilCaption } from "@/components/ui/tamil-caption";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { setSession } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otpRef = useRef(null);
  const nameRef = useRef(null);

  const sendOtp = useCallback(async () => {
    setError("");
    if (!/^\d{10}$/.test(phone)) return setError("Enter a valid 10-digit phone number");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to send OTP");
      setIsNewUser(Boolean(data.isNewUser));
      setStep("otp");
      setTimeout(() => (data.isNewUser ? nameRef : otpRef).current?.focus(), 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [phone]);

  const verifyOtp = useCallback(async () => {
    setError("");
    if (isNewUser && !name.trim()) return setError("Please enter your name");
    if (otp.length < 4) return setError("Enter the 4-digit OTP");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, name: isNewUser ? name : undefined }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Verification failed");

      setSession({ name: data.name, phone, isAdmin: data.isAdmin });
      toast(`Welcome${isNewUser ? "" : " back"}, ${data.name}!`);

      if (data.isAdmin) {
        window.location.href = "/admin";
      } else {
        router.push(redirectTo);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [otp, phone, name, isNewUser, setSession, toast, router, redirectTo]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-farm-warm px-4 py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 45% at 20% 15%, #15321f 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 85% 75%, #b88e52 0%, transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-[2rem] border border-farm-green-dark/8 bg-farm-cream/95 p-8 shadow-soft backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-soft">
            <Image src="/images/logo.png" alt="Maran Farms" fill className="object-cover" sizes="40px" />
          </span>
          <span className="font-heading text-lg text-farm-green-dark">Maran Farms</span>
        </Link>

        <FarmPageIntro
          className="mt-6"
          eyebrow="Welcome"
          title={
            step === "phone"
              ? "Sign In"
              : isNewUser
                ? "Welcome!"
                : "Welcome Back"
          }
          tamil={
            step === "phone"
              ? "உள்நுழைக"
              : isNewUser
                ? "வரவேற்கிறோம்"
                : "மீண்டும் வரவேற்கிறோம்"
          }
        >
          <p className="mt-3 text-sm text-farm-sage">
            {step === "phone"
              ? "Enter your phone number to continue"
              : isNewUser
                ? `New here — tell us your name, then verify the OTP sent to +91 ${phone}`
                : `OTP sent to +91 ${phone}`}
          </p>
        </FarmPageIntro>

        <div className="mt-6 flex flex-col gap-4">
          {step === "phone" ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-farm-green-dark" htmlFor="login-phone">
                Phone Number
              </label>
              <TamilCaption>தொலைபேசி எண்</TamilCaption>
              <div className="flex h-12 items-center rounded-2xl border border-farm-green-dark/15 bg-farm-warm px-4 focus-within:border-farm-green">
                <span className="mr-2 text-farm-sage">+91</span>
                <input
                  id="login-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="9999999999"
                  maxLength={10}
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                  className="flex-1 bg-transparent text-farm-green-dark placeholder:text-farm-sage/60 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <>
              {isNewUser && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-farm-green-dark" htmlFor="login-name">
                    Your Name
                  </label>
                  <input
                    ref={nameRef}
                    id="login-name"
                    type="text"
                    placeholder="e.g. Ravi Kumar"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                    className="h-12 rounded-2xl border border-farm-green-dark/15 bg-farm-warm px-4 text-farm-green-dark placeholder:text-farm-sage/60 focus:border-farm-green focus:outline-none"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-farm-green-dark" htmlFor="login-otp">
                  OTP
                </label>
                <input
                  ref={otpRef}
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="4-digit OTP"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                  className="h-12 rounded-2xl border border-farm-green-dark/15 bg-farm-warm px-4 text-center text-xl tracking-[0.5em] text-farm-green-dark placeholder:text-farm-sage/60 focus:border-farm-green focus:outline-none"
                />
                <button
                  type="button"
                  className="mt-1 self-start text-xs text-farm-sage underline underline-offset-2"
                  onClick={() => { setStep("phone"); setOtp(""); setName(""); setError(""); }}
                >
                  Change number
                </button>
              </div>
            </>
          )}

          {error && (
            <p className="rounded-xl bg-farm-accent/10 px-3 py-2 text-sm text-farm-accent-dark">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={step === "phone" ? sendOtp : verifyOtp}
            className="focus-ring mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-farm-green text-button font-semibold text-farm-green-light transition hover:bg-farm-green-dark disabled:opacity-60"
          >
            {loading && <Spinner className="size-4" />}
            {loading
              ? "Please wait…"
              : step === "phone"
              ? "Send OTP"
              : "Verify & Continue"}
          </button>

          <a
            href={getGenericInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring self-center text-sm font-medium text-farm-accent hover:underline"
          >
            Or contact us on WhatsApp
          </a>

          <Link
            href="/"
            className="focus-ring self-center text-sm text-farm-sage hover:text-farm-green"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
