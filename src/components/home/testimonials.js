"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";
import { SectionHeader } from "@/components/ui/section-header";
import { Marquee } from "@/components/ui/marquee";
import { useReducedMotion } from "@/hooks/use-media";
import { useMotionAllowed } from "@/components/motion/motion-provider";

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function TestimonialCard({ t, tone = "warm" }) {
  const motionAllowed = useMotionAllowed();
  const surface =
    tone === "green"
      ? "bg-farm-green text-farm-green-light"
      : "bg-farm-warm text-farm-green-dark";

  return (
    <motion.article
      whileHover={motionAllowed ? { y: -6, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`relative flex w-[min(22rem,88vw)] shrink-0 flex-col overflow-hidden rounded-[1.75rem] p-6 shadow-soft md:w-[26rem] md:p-7 ${surface}`}
    >
      <span
        className={`font-heading pointer-events-none absolute -top-2 right-4 text-[7rem] leading-none select-none ${
          tone === "green" ? "text-white/10" : "text-farm-accent/15"
        }`}
        aria-hidden
      >
        ”
      </span>

      <p
        className={`relative text-[1.05rem] leading-relaxed md:text-lg ${
          tone === "green" ? "text-farm-green-light" : "text-farm-green-dark"
        }`}
      >
        {t.review}
      </p>
      <p
        className={`relative mt-3 text-sm italic ${
          tone === "green" ? "text-farm-ochre/90" : "text-farm-accent"
        }`}
        lang="ta"
      >
        {t.tamilReview}
      </p>

      <div
        className={`relative mt-auto flex items-center gap-3 border-t pt-5 ${
          tone === "green" ? "border-white/15" : "border-farm-green-dark/10"
        }`}
      >
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold ${
            tone === "green"
              ? "bg-farm-accent text-white"
              : "bg-farm-green text-farm-green-light"
          }`}
        >
          {initials(t.name)}
        </span>
        <div className="min-w-0">
          <p
            className={`font-semibold ${
              tone === "green" ? "text-white" : "text-farm-green-dark"
            }`}
          >
            {t.name}
          </p>
          <p
            className={`mt-0.5 flex items-center gap-1 text-sm ${
              tone === "green" ? "text-farm-green-light/70" : "text-farm-sage"
            }`}
          >
            <MapPin className="size-3.5 shrink-0 opacity-70" aria-hidden />
            <span className="truncate">
              {t.role} · {t.location}
            </span>
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function Testimonials() {
  const reduced = useReducedMotion();
  const row1 = testimonials.filter((_, i) => i % 2 === 0);
  const row2 = testimonials.filter((_, i) => i % 2 === 1);

  return (
    <section className="section-pad overflow-hidden bg-farm-cream">
      <div className="container-farm">
        <SectionHeader
          align="left"
          borderLeft
          accentRule={false}
          eyebrow="Customer Voice"
          title="What Farmers Say"
          tamil="விவசாயிகள் சொல்வது"
        />
      </div>

      {reduced ? (
        <div className="container-farm mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard
              key={t.id}
              t={t}
              tone={i === 1 ? "green" : "warm"}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          <Marquee>
            {row1.map((t, i) => (
              <TestimonialCard
                key={t.id}
                t={t}
                tone={i % 2 === 0 ? "warm" : "green"}
              />
            ))}
          </Marquee>
          <Marquee reverse>
            {row2.map((t, i) => (
              <TestimonialCard
                key={t.id}
                t={t}
                tone={i % 2 === 0 ? "green" : "warm"}
              />
            ))}
          </Marquee>
        </div>
      )}
    </section>
  );
}
