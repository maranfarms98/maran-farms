"use client";

import dynamic from "next/dynamic";
import { ArrowDown, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { SITE_NAME } from "@/lib/site";

const AmbientCanopyCanvas = dynamic(
  () =>
    import("@/components/theme-canopy/three/ambient-canopy-canvas").then(
      (m) => m.AmbientCanopyCanvas,
    ),
  { ssr: false },
);

const WORDS = ["Maran", "Farms"];

export function HeroCanopy() {
  const motionAllowed = useMotionAllowed();

  return (
    <section className="relative flex min-h-vvh items-end justify-center overflow-hidden bg-canopy-forest">
      <div className="pointer-events-none absolute inset-0">
        <video
          className="absolute inset-0 size-full object-cover object-center opacity-70"
          src="/images/home-story.mp4"
          poster="/images/home-hero.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canopy-forest via-canopy-forest/40 to-canopy-deep/50" />
      </div>

      <AmbientCanopyCanvas />

      <div className="relative z-10 flex flex-col items-center px-6 pb-20 text-center sm:pb-28">
        <motion.span
          initial={motionAllowed ? { opacity: 0, y: -8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-canopy-leaf-light/30 bg-canopy-deep/50 px-4 py-1.5 text-xs font-semibold tracking-widest text-canopy-leaf-light uppercase backdrop-blur-sm"
        >
          <Leaf className="size-3.5 animate-canopy-glow" />
          Canopy Edition
        </motion.span>

        <h1 className="font-heading flex flex-wrap justify-center gap-x-4 text-[clamp(3rem,12vw,6rem)] leading-[0.92] font-bold tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.55)]">
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={motionAllowed ? { opacity: 0, y: 40, rotateX: -60 } : false}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 600, display: "inline-block" }}
              className={i === 1 ? "text-canopy-leaf-light" : undefined}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={motionAllowed ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-5 max-w-md text-balance text-white/85"
        >
          Grown deep in the green — {SITE_NAME || "Maran Farms"} reimagined as
          a living, breathing canopy.
        </motion.p>

        <motion.a
          href="#harvest-paths"
          initial={motionAllowed ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileHover={motionAllowed ? { y: -2 } : undefined}
          className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-canopy-leaf px-6 py-3 text-sm font-semibold text-canopy-forest shadow-elevated"
        >
          Explore the Canopy
          <ArrowDown className="size-4" />
        </motion.a>
      </div>
    </section>
  );
}
