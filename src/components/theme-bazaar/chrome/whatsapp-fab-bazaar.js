"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";

/** Only show when bag is empty — avoids competing CTAs with order bar */
export function WhatsAppFabBazaar() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();
  const { t } = useBazaarLang();

  if (pathname?.startsWith("/checkout") || pathname?.startsWith("/login")) return null;
  if (pathname?.startsWith("/product/")) return null;
  if (!hydrated || itemCount > 0) return null;

  return (
    <a
      href={getGenericInquiryUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp}
      className="focus-ring fixed right-5 z-40 flex size-14 items-center justify-center rounded-full bg-bazaar-wa text-white shadow-elevated md:right-6"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)" }}
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
