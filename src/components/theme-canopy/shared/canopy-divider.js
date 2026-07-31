"use client";

import { motion } from "framer-motion";
import { useMotionAllowed } from "@/components/motion/motion-provider";

/** Animated SVG vine divider used between Canopy sections. */
export function CanopyDivider({ className = "", flip = false }) {
  const motionAllowed = useMotionAllowed();

  return (
    <div
      className={`pointer-events-none relative h-14 w-full overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        className={`h-full w-full ${flip ? "-scale-y-100" : ""}`}
      >
        <motion.path
          d="M0 30 Q 50 0, 100 30 T 200 30 T 300 30 T 400 30"
          fill="none"
          stroke="var(--canopy-leaf)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={motionAllowed ? { pathLength: 0, opacity: 0 } : { opacity: 0.6 }}
          whileInView={motionAllowed ? { pathLength: 1, opacity: 0.6 } : undefined}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
