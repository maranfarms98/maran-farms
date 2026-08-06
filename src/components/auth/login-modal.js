"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { useAuth } from "@/context/auth-context";
import { useOtpLogin } from "@/hooks/use-otp-login";
import { OtpLoginFields } from "@/components/auth/otp-login-fields";

export function LoginModal() {
  const { loginModalOpen, closeLogin, onLoginSuccess } = useAuth();
  const router = useRouter();

  const handleSuccess = useCallback(
    ({ isAdmin, reset }) => {
      const successCallback = onLoginSuccess;
      reset();
      closeLogin();

      if (isAdmin) {
        router.push("/admin");
      } else {
        successCallback?.();
      }
    },
    [onLoginSuccess, closeLogin, router],
  );

  const login = useOtpLogin({ onSuccess: handleSuccess });

  const handleClose = useCallback(() => {
    login.reset();
    closeLogin();
  }, [login, closeLogin]);

  return (
    <Drawer open={loginModalOpen} onClose={handleClose} placement="bottom">
      <div className="flex items-center justify-between border-b border-farm-green-dark/8 p-5">
        <div>
          <h2 className="font-heading text-2xl text-farm-green-dark">
            {login.step === "phone" ? "Sign In" : login.isNewUser ? "Welcome!" : "Welcome Back"}
          </h2>
          <p className="text-sm text-farm-sage">
            {login.step === "phone"
              ? "Enter your phone number to continue"
              : login.isNewUser
              ? `New here — tell us your name, then verify the OTP`
              : `OTP sent to +91 ${login.phone}`}
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
        <OtpLoginFields login={login} />
      </div>
    </Drawer>
  );
}
