"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { Pressable } from "@/components/motion/pressable";
import { SITE_NAME } from "@/lib/site";
import { HOME_H1 } from "@/lib/seo";
import {
  SPLASH_DONE_EVENT,
  hasSplashCompleted,
} from "@/components/chrome/splash-screen";

export function Hero() {
  const motionAllowed = useMotionAllowed();
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const playedRef = useRef(false);
  const [revealed, setRevealed] = useState(!motionAllowed);
  const [splashDone, setSplashDone] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [desktopMotion, setDesktopMotion] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    const onSplash = () => setSplashDone(true);
    window.addEventListener(SPLASH_DONE_EVENT, onSplash);
    if (hasSplashCompleted()) onSplash();
    return () => window.removeEventListener(SPLASH_DONE_EVENT, onSplash);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia(
      "(min-width: 768px) and (pointer: fine) and (hover: hover)",
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setDesktopMotion(desktop.matches && !reduced.matches);
    update();
    desktop.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting && entry.intersectionRatio > 0.15),
      { threshold: [0, 0.15, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const canPlayVideo = desktopMotion && splashDone && heroInView;

  useEffect(() => {
    if (canPlayVideo) setVideoSrc("/images/home-story.mp4");
  }, [canPlayVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return undefined;
    if (canPlayVideo) {
      video.play().catch(() => {});
      return undefined;
    }
    video.pause();
    return undefined;
  }, [canPlayVideo, videoSrc]);

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
      const brand = root.querySelector("[data-hero-brand]");
      const lines = root.querySelectorAll("[data-hero-line]");
      const rule = root.querySelector("[data-hero-rule]");
      const cta = root.querySelector("[data-hero-cta]");
      const scrollHint = section?.querySelector("[data-hero-scroll]");

      utils.set(lines, { opacity: 0, y: 28 });
      if (rule) utils.set(rule, { scaleX: 0, opacity: 0 });
      if (cta) utils.set(cta, { opacity: 0, y: 20 });
      if (scrollHint) utils.set(scrollHint, { opacity: 0 });

      let split;
      if (brand) {
        split = splitText(brand, { chars: true });
        utils.set(split.chars, {
          opacity: 0,
          y: 36,
        });
      }

      setRevealed(true);

      timeline = createTimeline({
        defaults: { ease: "out(3)" },
      });

      if (split?.chars?.length) {
        timeline.add(split.chars, {
          opacity: 1,
          y: 0,
          duration: 800,
          delay: stagger(24, { start: 40 }),
          ease: "out(4)",
        });
      }

      timeline.add(
        lines,
        {
          opacity: 1,
          y: 0,
          duration: 650,
          delay: stagger(80),
          ease: "out(3)",
        },
        "-=400",
      );

      if (rule) {
        timeline.add(
          rule,
          {
            scaleX: 1,
            opacity: 1,
            duration: 600,
            ease: "out(3)",
          },
          "-=500",
        );
      }

      if (cta) {
        timeline.add(
          cta,
          {
            opacity: 1,
            y: 0,
            duration: 600,
            ease: "out(3)",
          },
          "-=350",
        );
      }

      if (scrollHint) {
        timeline.add(
          scrollHint,
          {
            opacity: 1,
            duration: 400,
          },
          "-=200",
        );
      }

      if (cta) {
        timeline.call(() => {
          if (cancelled) return;
          animate(cta, {
            scale: [1, 1.03, 1],
            duration: 800,
            ease: "inOut(2)",
          });
        });
      }
    };

    const onSplashDone = () => {
      runEntrance();
    };

    window.addEventListener(SPLASH_DONE_EVENT, onSplashDone);

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
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/home-hero.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {videoSrc ? (
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover object-center"
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Maran Farms field footage"
          />
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-farm-green-dark via-farm-green-dark/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(40%,14rem)] bg-gradient-to-b from-farm-green-dark/80 via-farm-green-dark/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-farm-green-dark/90 to-transparent" />

      <div className="relative z-10 w-full px-4 pt-28 pb-[max(5.5rem,calc(env(safe-area-inset-bottom,0px)+5rem))] sm:px-6 md:pb-28">
        <div
          ref={contentRef}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <p
            data-hero-brand
            className="font-heading text-[clamp(3rem,12vw,6rem)] leading-[0.92] font-bold tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.55)]"
          >
            {SITE_NAME}
          </p>

          <h1 className="font-heading mt-4 max-w-2xl text-[clamp(1.15rem,2.8vw,1.65rem)] font-medium text-[#f0d2a8] drop-shadow-[0_2px_16px_rgba(0,0,0,0.75)]">
            {HOME_H1}
          </h1>

          <p
            data-hero-line
            className="font-heading mt-4 text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium italic text-white/90 drop-shadow-[0_2px_16px_rgba(0,0,0,0.75)]"
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
            className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-white/95 drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]"
          >
            Harvested in Karur, delivered across Tamil Nadu — order on WhatsApp.
          </p>

          <div data-hero-line>
            <TamilCaption
              tone="light"
              className="mt-2 px-1 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
            >
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
