"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { Marquee } from "@/components/ui/marquee";
import { useReducedMotion } from "@/hooks/use-media";
import { useMotionAllowed } from "@/components/motion/motion-provider";

function TestimonialQuote({ t, className = "" }) {
  const motionAllowed = useMotionAllowed();

  return (
    <motion.blockquote
      whileHover={motionAllowed ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative flex w-full flex-col gap-3 border-l border-farm-ochre/45 pl-4 sm:gap-4 sm:pl-5 ${className}`}
    >
      <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star
            key={i}
            className="size-3 fill-farm-ochre text-farm-ochre"
            aria-hidden
          />
        ))}
      </div>

      <p className="font-heading text-[1.05rem] leading-snug text-farm-green-light sm:text-[1.15rem]">
        {t.review}
      </p>

      <p
        className="text-[0.8125rem] leading-relaxed text-[#f0d2a8] italic"
        lang="ta"
      >
        {t.tamilReview}
      </p>

      <footer className="space-y-1.5 pt-1">
        <cite className="not-italic">
          <span className="block text-sm font-semibold text-white">
            {t.name}
          </span>
          <span className="mt-0.5 block text-sm text-farm-green-light/70">
            {t.role} · {t.location}
          </span>
        </cite>
        <span className="block text-[0.625rem] font-semibold tracking-[0.18em] text-farm-ochre/70 uppercase">
          {t.source}
        </span>
      </footer>
    </motion.blockquote>
  );
}

function TestimonialStack({ items, className = "" }) {
  return (
    <div className={`container-farm grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {items.map((t) => (
        <TestimonialQuote key={t.id} t={t} />
      ))}
    </div>
  );
}

export function Testimonials() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-farm-green-dark">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 20% 0%, #b88e52 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 100%, #8b5e3c 0%, transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative py-12 md:py-[5.5rem] xl:py-[7.5rem]">
        <div className="container-farm">
          <MotionReveal className="flex max-w-xl flex-col items-start text-left">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] text-farm-ochre uppercase">
              Customer Voice
            </p>
            <h2 className="font-heading text-section mt-3 font-semibold text-farm-green-light">
              What Farmers Say
            </h2>
            <TamilCaption tone="light" className="mt-2">
              விவசாயிகள் சொல்வது
            </TamilCaption>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-farm-green-light/75 md:mt-5 md:text-base">
              Feedback from dairy growers, poultry starters, and homestead
              keepers across Tamil Nadu.
            </p>
          </MotionReveal>
        </div>

        {/* Mobile: full readable stack — marquee clips badly on small screens */}
        <TestimonialStack
          items={testimonials.slice(0, 4)}
          className="mt-8 md:hidden"
        />

        {/* Desktop */}
        {reduced ? (
          <TestimonialStack
            items={testimonials.slice(0, 3)}
            className="mt-12 hidden md:grid"
          />
        ) : (
          <div className="mt-12 hidden md:block md:mt-14">
            <Marquee gapClassName="gap-10 md:gap-14">
              {testimonials.map((t) => (
                <TestimonialQuote
                  key={t.id}
                  t={t}
                  className="w-[20rem] shrink-0 md:w-[22rem]"
                />
              ))}
            </Marquee>
          </div>
        )}
      </div>
    </section>
  );
}
