"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-media";

export function Marquee({
  children,
  reverse = false,
  className = "",
  gapClassName = "gap-4",
  pauseOnPointer = true,
}) {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      <div
        className={`flex flex-wrap justify-center ${gapClassName} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`edge-fade-x overflow-hidden ${paused || offscreen ? "marquee-paused" : ""} ${className}`}
      onMouseEnter={
        pauseOnPointer
          ? () => {
              setPaused(true);
            }
          : undefined
      }
      onMouseLeave={
        pauseOnPointer
          ? () => {
              setPaused(false);
            }
          : undefined
      }
      onPointerDown={
        pauseOnPointer
          ? () => {
              setPaused(true);
            }
          : undefined
      }
      onPointerUp={
        pauseOnPointer
          ? () => {
              window.setTimeout(() => setPaused(false), 3000);
            }
          : undefined
      }
    >
      <div
        className={`flex w-max ${gapClassName} ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        <div className={`flex shrink-0 ${gapClassName}`}>{children}</div>
        <div className={`flex shrink-0 ${gapClassName}`} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
