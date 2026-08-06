"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FarmPageIntro } from "@/components/ui/farm-page-intro";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { PageLoader } from "@/components/ui/page-loader";
import { FarmPageShell } from "@/components/ui/farm-page-shell";
import { useOtpLogin } from "@/hooks/use-otp-login";
import { OtpLoginFields } from "@/components/auth/otp-login-fields";

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading…" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSuccess = useCallback(
    ({ isAdmin }) => {
      if (isAdmin) {
        // Full reload so the admin layout picks up the new session cookie.
        window.location.href = "/admin";
      } else {
        router.push(redirectTo);
      }
    },
    [router, redirectTo],
  );

  const login = useOtpLogin({ onSuccess: handleSuccess });
  const { step, isNewUser, phone } = login;

  return (
    <FarmPageShell variant="login" centered>
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
          <OtpLoginFields login={login} showTamil />

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
    </FarmPageShell>
  );
}
