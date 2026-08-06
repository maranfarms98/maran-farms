"use client";

import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";
import { isValidMobile, toPhoneInput } from "@/lib/phone";

const OTP_LENGTH = 4;

/**
 * Owns the phone → OTP login flow shared by the login page and the login modal.
 * `onSuccess({ isAdmin, name, reset })` runs after the session is set, so each
 * surface decides where to send the user.
 */
export function useOtpLogin({ onSuccess } = {}) {
  const { setSession } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhoneState] = useState("");
  const [otp, setOtpState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otpRef = useRef(null);
  const nameRef = useRef(null);

  const setPhone = useCallback((value) => setPhoneState(toPhoneInput(value)), []);
  const setOtp = useCallback(
    (value) => setOtpState(String(value ?? "").replace(/\D/g, "").slice(0, OTP_LENGTH)),
    [],
  );

  const reset = useCallback(() => {
    setStep("phone");
    setIsNewUser(false);
    setName("");
    setPhoneState("");
    setOtpState("");
    setError("");
  }, []);

  const changeNumber = useCallback(() => {
    setStep("phone");
    setOtpState("");
    setName("");
    setError("");
  }, []);

  const sendOtp = useCallback(async () => {
    setError("");
    if (!isValidMobile(phone)) return setError("Enter a valid 10-digit phone number");

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
    if (otp.length < OTP_LENGTH) return setError("Enter the 4-digit OTP");

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

      onSuccess?.({ isAdmin: Boolean(data.isAdmin), name: data.name, reset });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [otp, phone, name, isNewUser, setSession, toast, onSuccess, reset]);

  return {
    step,
    isNewUser,
    name,
    setName,
    phone,
    setPhone,
    otp,
    setOtp,
    loading,
    error,
    setError,
    otpRef,
    nameRef,
    sendOtp,
    verifyOtp,
    submit: step === "phone" ? sendOtp : verifyOtp,
    changeNumber,
    reset,
  };
}
