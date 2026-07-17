"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { Spinner } from "@/components/ui/spinner";

export function LoginModal() {
  const { loginModalOpen, closeLogin, setSession, onLoginSuccess } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otpRef = useRef(null);
  const nameRef = useRef(null);

  const handleClose = useCallback(() => {
    setStep("phone");
    setIsNewUser(false);
    setName("");
    setPhone("");
    setOtp("");
    setError("");
    closeLogin();
  }, [closeLogin]);

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

      const successCallback = onLoginSuccess;
      handleClose();

      if (data.isAdmin) {
        router.push("/admin");
      } else {
        successCallback?.();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [otp, phone, name, isNewUser, setSession, toast, handleClose, router, onLoginSuccess]);

  return (
    <Drawer open={loginModalOpen} onClose={handleClose} placement="bottom">
      <div className="flex items-center justify-between border-b border-farm-green-dark/8 p-5">
        <div>
          <h2 className="font-heading text-2xl text-farm-green-dark">
            {step === "phone" ? "Sign In" : isNewUser ? "Welcome!" : "Welcome Back"}
          </h2>
          <p className="text-sm text-farm-sage">
            {step === "phone"
              ? "Enter your phone number to continue"
              : isNewUser
              ? `New here — tell us your name, then verify the OTP`
              : `OTP sent to +91 ${phone}`}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          className="focus-ring flex size-11 items-center justify-center rounded-full text-farm-green hover:bg-farm-accent-light"
          onClick={handleClose}
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-5">
        {step === "phone" ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-farm-green-dark" htmlFor="login-phone">
              Phone Number
            </label>
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
      </div>
    </Drawer>
  );
}
