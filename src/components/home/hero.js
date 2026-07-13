"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { useMotionAllowed, useGsapAllowed } from "@/components/motion/motion-provider";
import { useGsapContext } from "@/components/motion/use-gsap-context";
import { Pressable } from "@/components/motion/pressable";
import { SITE_NAME } from "@/lib/site";
import {
  SPLASH_DONE_EVENT,
  hasSplashCompleted,
} from "@/components/chrome/splash-screen";

export function Hero() {
  const motionAllowed = useMotionAllowed();
  const gsapAllowed = useGsapAllowed();
  const contentRef = useRef(null);
  const playedRef = useRef(false);
  const [revealed, setRevealed] = useState(!motionAllowed);
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

  useEffect(() => {
    if (!motionAllowed) {
      setRevealed(true);
      return undefined;
    }

    let cancelled = false;
    let timeline;

    const runEntrance = async () => {
      if (cancelled || playedRef.current || !contentRef.current) return;
      playedRef.current = true;

      const { animate, createTimeline, stagger, splitText, utils } = await import(
        "animejs"
      );
      if (cancelled || !contentRef.current) return;

      const root = contentRef.current;
      const section = root.closest("section");
      const bg = section?.querySelector("[data-hero-bg]");
      const brand = root.querySelector("[data-hero-brand]");
      const lines = root.querySelectorAll("[data-hero-line]");
      const rule = root.querySelector("[data-hero-rule]");
      const cta = root.querySelector("[data-hero-cta]");
      const scrollHint = section?.querySelector("[data-hero-scroll]");

      utils.set(root, { opacity: 1, visibility: "visible" });
      if (bg) utils.set(bg, { scale: 1.18, opacity: 0.35 });
      utils.set(lines, { opacity: 0, y: 36, filter: "blur(8px)" });
      if (rule) utils.set(rule, { scaleX: 0, opacity: 0 });
      if (cta) utils.set(cta, { opacity: 0, y: 28, scale: 0.92 });
      if (scrollHint) utils.set(scrollHint, { opacity: 0 });

      let split;
      if (brand) {
        split = splitText(brand, { chars: true });
        utils.set(split.chars, {
          opacity: 0,
          y: 48,
          rotateX: -70,
          filter: "blur(10px)",
        });
      }

      setRevealed(true);

      timeline = createTimeline({
        defaults: { ease: "out(3)" },
      });

      if (bg) {
        timeline.add(bg, {
          scale: 1.04,
          opacity: 1,
          duration: 1600,
          ease: "out(2)",
        });
      }

      if (split?.chars?.length) {
        timeline.add(
          split.chars,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 900,
            delay: stagger(28, { start: 80 }),
            ease: "out(4)",
          },
          bg ? "-=1100" : 0,
        );
      }

      timeline.add(
        lines,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 750,
          delay: stagger(90),
          ease: "out(3)",
        },
        "-=500",
      );

      if (rule) {
        timeline.add(
          rule,
          {
            scaleX: 1,
            opacity: 1,
            duration: 700,
            ease: "out(3)",
          },
          "-=650",
        );
      }

      if (cta) {
        timeline.add(
          cta,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 700,
            ease: "out(3)",
          },
          "-=400",
        );
      }

      if (scrollHint) {
        timeline.add(
          scrollHint,
          {
            opacity: 1,
            duration: 500,
          },
          "-=200",
        );
      }

      if (cta) {
        timeline.call(() => {
          if (cancelled) return;
          animate(cta, {
            scale: [1, 1.04, 1],
            duration: 900,
            ease: "inOut(2)",
          });
        });
      }
    };

    const onSplashDone = () => {
      runEntrance();
    };

    window.addEventListener(SPLASH_DONE_EVENT, onSplashDone);

    // Late mount after splash already finished this session
    if (hasSplashCompleted()) {
      const t = window.setTimeout(onSplashDone, 50);
      return () => {
        cancelled = true;
        window.clearTimeout(t);
        window.removeEventListener(SPLASH_DONE_EVENT, onSplashDone);
        timeline?.pause?.();
      };
    }

    return () => {
      cancelled = true;
      window.removeEventListener(SPLASH_DONE_EVENT, onSplashDone);
      timeline?.pause?.();
    };
  }, [motionAllowed]);

  const scrollToProducts = () => {
    const target =
      document.getElementById("harvest-paths") ||
      document.getElementById("categories");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-vvh items-end justify-center overflow-hidden bg-farm-green-dark"
    >
      <div
        data-hero-bg
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <video
          className="absolute inset-0 size-full object-cover object-center"
          src="/images/home-story.mp4"
          poster="/images/home-hero.jpg"
          autoPlay={motionAllowed}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Maran Farms field footage"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-farm-green-dark via-farm-green-dark/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(40%,14rem)] bg-gradient-to-b from-farm-green-dark/80 via-farm-green-dark/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-farm-green-dark/90 to-transparent" />

      {motionAllowed && revealed && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="animate-light-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#f0d2a8]/15 to-transparent" />
        </div>
      )}

      <div className="relative z-10 w-full px-6 pt-28 pb-[max(5.5rem,calc(env(safe-area-inset-bottom,0px)+5rem))] md:pb-28">
        <div
          ref={contentRef}
          className={`mx-auto flex max-w-3xl flex-col items-center text-center ${
            motionAllowed && !revealed ? "opacity-0" : ""
          }`}
          style={
            motionAllowed && !revealed
              ? { visibility: "hidden" }
              : undefined
          }
        >
          <p
            data-hero-brand
            className="font-heading text-[clamp(3rem,12vw,6rem)] leading-[0.92] font-bold tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.55)]"
            style={{ perspective: "600px" }}
          >
            {SITE_NAME}
          </p>

          <p
            data-hero-line
            className="font-heading mt-4 text-[clamp(1.15rem,2.8vw,1.65rem)] font-medium text-[#f0d2a8] italic drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          >
            Rooted in integrity
          </p>

          <div
            data-hero-rule
            className="mt-5 h-px w-16 origin-center bg-[#f0d2a8]/80"
            aria-hidden
          />

          <p
            data-hero-line
            className="mt-5 text-[0.95rem] font-medium tracking-[0.12em] text-white/90 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-[1rem]"
          >
            Napier · Chicks · Pets
          </p>

          <p
            data-hero-line
            className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-white/95 drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]"
          >
            Premium farm products from Tamil Nadu — order easily on WhatsApp.
          </p>

          <div data-hero-line>
            <TamilCaption className="mt-2 text-[#f0d2a8] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
              தரமான நேப்பியர் · பண்ணை குஞ்சுகள் · செல்லப்பிராணிகள்
            </TamilCaption>
          </div>

          <div data-hero-cta className="relative z-10 mt-8">
            <Pressable
              as="a"
              href="#harvest-paths"
              onClick={(e) => {
                e.preventDefault();
                scrollToProducts();
              }}
              className="focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-[#f0d2a8] px-7 text-button font-semibold text-farm-green-dark"
            >
              View products
              <ArrowRight className="size-4" />
            </Pressable>
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        data-hero-scroll
        aria-label="Scroll to products"
        onClick={scrollToProducts}
        className="focus-ring absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 text-white/75 md:bottom-8"
        animate={
          motionAllowed && revealed ? { y: [0, 6, 0] } : undefined
        }
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      >
        <ArrowDown className="size-5" />
      </motion.button>
    </section>
  );
}
