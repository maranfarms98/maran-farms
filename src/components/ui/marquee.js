"use client";

import { useReducedMotion } from "@/hooks/use-media";
import { useState } from "react";

export function Marquee({
  children,
  reverse = false,
  className = "",
  gapClassName = "gap-4",
  pauseOnPointer = true,
}) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);

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
      className={`edge-fade-x overflow-hidden ${paused ? "marquee-paused" : ""} ${className}`}
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
