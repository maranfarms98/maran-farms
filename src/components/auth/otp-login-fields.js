"use client";

import { Spinner } from "@/components/ui/spinner";
import { ErrorNote } from "@/components/ui/error-note";
import { TamilCaption } from "@/components/ui/tamil-caption";

const FIELD_CLASS =
  "h-12 rounded-2xl border border-farm-green-dark/15 bg-farm-warm px-4 text-farm-green-dark placeholder:text-farm-sage/60 focus:border-farm-green focus:outline-none";

/**
 * The phone / name / OTP inputs plus submit button shared by the login page
 * and the login modal. Drive it with `useOtpLogin`.
 */
export function OtpLoginFields({ login, showTamil = false }) {
  const {
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
    otpRef,
    nameRef,
    sendOtp,
    verifyOtp,
    submit,
    changeNumber,
  } = login;

  return (
    <>
      {step === "phone" ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-farm-green-dark" htmlFor="login-phone">
            Phone Number
          </label>
          {showTamil && <TamilCaption>தொலைபேசி எண்</TamilCaption>}
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
              onChange={(e) => setPhone(e.target.value)}
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
                className={FIELD_CLASS}
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
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
              className={`${FIELD_CLASS} text-center text-xl tracking-[0.5em]`}
            />
            <button
              type="button"
              className="mt-1 self-start text-xs text-farm-sage underline underline-offset-2"
              onClick={changeNumber}
            >
              Change number
            </button>
          </div>
        </>
      )}

      <ErrorNote>{error}</ErrorNote>

      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className="focus-ring mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-farm-green text-button font-semibold text-farm-green-light transition hover:bg-farm-green-dark disabled:opacity-60"
      >
        {loading && <Spinner className="size-4" />}
        {loading ? "Please wait…" : step === "phone" ? "Send OTP" : "Verify & Continue"}
      </button>
    </>
  );
}
