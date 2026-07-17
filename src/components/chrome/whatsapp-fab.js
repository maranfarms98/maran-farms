"use client";

import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  if (hydrated && itemCount > 0) return null;

  const bottom = "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)";

  return (
    <div
      className="fixed right-5 z-40 flex flex-col items-end gap-2 md:right-6"
      style={{ bottom }}
    >
      <AnimatePresence>
        {pulse && (
          <motion.span
            initial={motionAllowed ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="rounded-full bg-farm-cream px-3 py-1.5 text-xs font-semibold text-farm-green-dark shadow-soft"
          >
            Chat on WhatsApp
          </motion.span>
        )}
      </AnimatePresence>
      <motion.a
        href={getGenericInquiryUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`focus-ring flex size-14 items-center justify-center rounded-full bg-farm-green text-farm-green-light shadow-elevated ${
          pulse ? "animate-fab-pulse" : ""
        }`}
        whileHover={motionAllowed ? { scale: 1.08 } : undefined}
        whileTap={motionAllowed ? { scale: 0.94 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <MessageCircle className="size-6" />
      </motion.a>
    </div>
  );
}
