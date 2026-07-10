"use client";

import { useEffect, useState } from "react";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useCoarsePointer() {
  return useMediaQuery("(pointer: coarse)");
}

export function useIsMobile(breakpoint = 768) {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}

export function useCanAnimate() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  return !reduced && !coarse;
}

/** Keeps --vvh in sync with the live visual viewport (all screens). */
export function useViewportHeightSync() {
  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      const next = Math.round(
        window.visualViewport?.height ?? window.innerHeight,
      );
      root.style.setProperty("--vvh", `${next}px`);
    };

    update();
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
}
