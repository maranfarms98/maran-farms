"use client";

import { useReducedMotion } from "@/hooks/use-media";
import { useState } from "react";

export function Marquee({
  children,
  reverse = false,
  className = "",
  pauseOnPointer = true,
}) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (reduced) {
    return (
      <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`edge-fade-x overflow-hidden ${paused ? "marquee-paused" : ""} ${className}`}
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
      onPointerLeave={
        pauseOnPointer
          ? () => {
              window.setTimeout(() => setPaused(false), 3000);
            }
          : undefined
      }
    >
      <div
        className={`flex w-max gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        <div className="flex shrink-0 gap-4">{children}</div>
        <div className="flex shrink-0 gap-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
