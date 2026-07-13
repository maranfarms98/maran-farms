"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { SITE_NAME } from "@/lib/site";

export const SPLASH_DONE_EVENT = "mf-splash-done";
const SESSION_KEY = "mf-splash-seen";

let splashDoneFlag = false;

export function hasSplashCompleted() {
  return splashDoneFlag;
}

function notifySplashDone() {
  if (typeof window === "undefined") return;
  if (splashDoneFlag) return;
  splashDoneFlag = true;
  window.dispatchEvent(new CustomEvent(SPLASH_DONE_EVENT));
}

export function SplashScreen() {
  const motionAllowed = useMotionAllowed();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) {
      setReady(true);
      const t = window.setTimeout(notifySplashDone, 40);
      return () => window.clearTimeout(t);
    }
    setVisible(true);
    setReady(true);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const hold = motionAllowed ? 2200 : 600;
    const exit = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, hold);

    return () => {
      window.clearTimeout(exit);
      document.body.style.overflow = prev;
    };
  }, [motionAllowed]);

  useEffect(() => {
    if (!visible && ready) {
      document.body.style.overflow = "";
    }
  }, [visible, ready]);

  if (!ready) {
    return (
      <div
        className="fixed inset-0 z-[200] bg-farm-green-dark"
        aria-hidden
      />
    );
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
        notifySplashDone();
      }}
    >
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex min-h-vvh flex-col items-center justify-center overflow-hidden bg-farm-green-dark"
          role="status"
          aria-label="Loading Maran Farms"
          initial={false}
          exit={
            motionAllowed
              ? { y: "-100%", transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }
              : { opacity: 0, transition: { duration: 0.25 } }
          }
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(240,210,168,0.18), transparent 70%)",
            }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial={motionAllowed ? { opacity: 0, y: 18 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="relative mb-6 flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-elevated"
              initial={motionAllowed ? { scale: 0.7, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 18 }}
            >
              <Image
                src="/images/logo.png"
                alt=""
                fill
                className="object-cover"
                sizes="64px"
                priority
              />
            </motion.span>

            <motion.p
              className="font-heading text-[clamp(2.5rem,9vw,4.5rem)] leading-none font-bold tracking-tight text-white"
              initial={motionAllowed ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {SITE_NAME}
            </motion.p>

            <motion.p
              className="font-heading mt-4 text-lg text-[#f0d2a8] italic"
              lang="ta"
              initial={motionAllowed ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.55 }}
            >
              நிலத்தின் அருள்
            </motion.p>

            <motion.div
              className="mt-8 h-px w-0 bg-[#f0d2a8]/80"
              initial={false}
              animate={{ width: 64 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
