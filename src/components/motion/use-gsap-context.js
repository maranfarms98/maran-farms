"use client";

import { useEffect, useRef } from "react";
import { useGsapAllowed } from "./motion-provider";

/**
 * Runs a GSAP setup fn with automatic cleanup of tweens/ScrollTriggers
 * created in the gsap context. Skips entirely when GSAP is not allowed.
 */
export function useGsapContext(setup, deps = []) {
  const gsapAllowed = useGsapAllowed();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!gsapAllowed || !containerRef.current) return undefined;
    let ctx;
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      const gsap = gsapMod.default || gsapMod.gsap || gsapMod;
      const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        setup({ gsap, ScrollTrigger, el: containerRef.current });
      }, containerRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gsapAllowed, ...deps]);

  return containerRef;
}
