"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/context/theme-context";
import CheckoutClassic from "@/components/theme-bazaar/checkout/checkout-classic-bridge";

const CheckoutBazaar = dynamic(
  () =>
    import("@/components/theme-bazaar/checkout/checkout-bazaar").then(
      (m) => m.CheckoutBazaar,
    ),
  { ssr: false },
);

export default function CheckoutPage() {
  const { theme } = useTheme();
  if (theme === "bazaar") return <CheckoutBazaar />;
  return <CheckoutClassic />;
}
