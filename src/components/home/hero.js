"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { useMotionAllowed, useGsapAllowed } from "@/components/motion/motion-provider";
import { useGsapContext } from "@/components/motion/use-gsap-context";
import { Pressable } from "@/components/motion/pressable";
import { SITE_NAME } from "@/lib/site";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.09, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  const motionAllowed = useMotionAllowed();
  const gsapAllowed = useGsapAllowed();
  const sectionRef = useGsapContext(
    ({ gsap, el }) => {
      const bg = el.querySelector("[data-hero-bg]");
      if (!bg) return;
      gsap.fromTo(
        bg,
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    [gsapAllowed],
  );

  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-vvh items-end overflow-hidden bg-farm-green-dark md:items-center"
    >
      <motion.div
        data-hero-bg
        className="pointer-events-none absolute inset-0 will-change-transform"
        initial={motionAllowed ? { scale: 1.1 } : false}
        animate={{ scale: 1.03 }}
        transition={{ duration: 8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/images/home-hero.jpg"
          alt="Maran Farms Napier grass fields"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Soft lift under type only — no hard box */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-farm-green-dark/90 via-farm-green-dark/35 to-farm-green-dark/20 md:bg-gradient-to-r md:from-farm-green-dark/80 md:via-farm-green-dark/40 md:to-transparent" />

      <div className="relative z-10 container-farm w-full max-w-3xl px-6 pt-28 pb-[max(5.5rem,calc(env(safe-area-inset-bottom,0px)+4.5rem))] md:pb-24">
        <motion.div
          initial={motionAllowed ? "hidden" : false}
          animate="visible"
          className="flex max-w-xl flex-col text-left"
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            className="font-heading text-[clamp(2.6rem,9vw,5.25rem)] leading-[0.95] font-bold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)]"
          >
            {SITE_NAME}
          </motion.p>

          <motion.p
            custom={1}
            variants={fadeUp}
            className="font-heading mt-4 text-[clamp(1.25rem,3vw,1.75rem)] font-medium text-[#f0d2a8] italic drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          >
            Rooted in integrity
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            className="mt-5 h-0.5 w-14 bg-[#f0d2a8]"
            aria-hidden
          />

          <motion.p
            custom={3}
            variants={fadeUp}
            className="mt-5 text-[1.05rem] leading-relaxed text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]"
          >
            Premium Napier, farm-fresh chicks, and gentle small pets — grown in
            Tamil Nadu, ordered on WhatsApp.
          </motion.p>

          <motion.div custom={4} variants={fadeUp}>
            <TamilCaption className="mt-2 text-[#f0d2a8] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              தரமான நேப்பியர் · பண்ணை குஞ்சுகள் · செல்லப்பிராணிகள்
            </TamilCaption>
          </motion.div>

          <motion.div custom={5} variants={fadeUp} className="relative z-10 mt-8">
            <Pressable
              as="a"
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                scrollToCategories();
              }}
              className="focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-[#f0d2a8] px-7 text-button font-semibold text-farm-green-dark"
            >
              Explore the farm
              <ArrowRight className="size-4" />
            </Pressable>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        aria-label="Scroll to catalog"
        onClick={scrollToCategories}
        className="focus-ring absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/80 md:bottom-8"
        animate={motionAllowed ? { y: [0, 6, 0] } : undefined}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      >
        <ArrowDown className="size-5" />
      </motion.button>
    </section>
  );
}
