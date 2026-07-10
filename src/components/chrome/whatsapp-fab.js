"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { useIsMobile } from "@/hooks/use-media";
import { useMotionAllowed } from "@/components/motion/motion-provider";

export function WhatsAppFAB() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { itemCount, hydrated } = useCart();
  const [pulse, setPulse] = useState(false);
  const motionAllowed = useMotionAllowed();
  const isProductPage = pathname?.startsWith("/product/");

  useEffect(() => {
    try {
      if (sessionStorage.getItem("mf-fab-pulsed")) return;
      const start = window.setTimeout(() => {
        setPulse(true);
        try {
          sessionStorage.setItem("mf-fab-pulsed", "1");
        } catch {
          /* private mode */
        }
      }, 0);
      const end = window.setTimeout(() => setPulse(false), 4000);
      return () => {
        window.clearTimeout(start);
        window.clearTimeout(end);
      };
    } catch {
      /* private mode / unavailable */
    }
  }, []);

  if (isMobile && isProductPage) return null;

  const hasOrderBar = hydrated && itemCount > 0 && !(isMobile && isProductPage);
  const bottom = hasOrderBar
    ? isMobile
      ? "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)"
      : "6.5rem"
    : "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)";

  return (
    <motion.a
      href={getGenericInquiryUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`focus-ring fixed right-5 z-40 flex size-14 items-center justify-center rounded-full bg-farm-green text-farm-green-light shadow-elevated md:right-6 ${
        pulse ? "animate-fab-pulse" : ""
      } ${hasOrderBar ? "max-md:hidden" : ""}`}
      style={{ bottom }}
      whileHover={motionAllowed ? { scale: 1.08 } : undefined}
      whileTap={motionAllowed ? { scale: 0.94 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <MessageCircle className="size-6" />
    </motion.a>
  );
}
