"use client";

import { TamilCaption } from "@/components/ui/tamil-caption";
import { MotionReveal } from "@/components/motion/motion-reveal";

export function SectionHeader({
  eyebrow,
  title,
  tamil,
  align = "center",
  accentRule = true,
  borderLeft = false,
  eyebrowClassName = "",
  titleClassName = "text-farm-green-dark",
  tamilClassName = "",
  className = "",
  children,
}) {
  const alignClass =
    align === "left"
      ? "text-left items-start"
      : "mx-auto text-center items-center";

  return (
    <MotionReveal
      className={`flex max-w-2xl flex-col ${alignClass} ${borderLeft ? "max-w-none border-l-4 border-farm-accent pl-4" : ""} ${className}`}
    >
      {eyebrow && (
        <p
          className={`text-eyebrow ${eyebrowClassName || "text-farm-green"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-heading text-section mt-3 font-semibold tracking-tight ${titleClassName}`}
      >
        {title}
      </h2>
      {tamil && (
        <TamilCaption className={`mt-2 ${tamilClassName}`}>{tamil}</TamilCaption>
      )}
      {accentRule && !borderLeft && (
        <div className="mt-5 h-1 w-14 rounded-full bg-farm-accent" />
      )}
      {children}
    </MotionReveal>
  );
}
