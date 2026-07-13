"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { Marquee } from "@/components/ui/marquee";
import { useReducedMotion } from "@/hooks/use-media";
import { useMotionAllowed } from "@/components/motion/motion-provider";

function TestimonialQuote({ t }) {
  const motionAllowed = useMotionAllowed();

  return (
    <motion.blockquote
      whileHover={motionAllowed ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative flex h-full w-[min(17.5rem,78vw)] shrink-0 flex-col gap-4 border-l border-farm-ochre/40 pl-5 md:w-[20rem] md:gap-5 md:pl-6"
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

      <p className="font-heading text-[1.05rem] leading-[1.45] text-farm-green-light md:text-[1.2rem]">
        {t.review}
      </p>

      <p
        className="text-[0.8125rem] leading-relaxed text-[#f0d2a8]/90 italic"
        lang="ta"
      >
        {t.tamilReview}
      </p>

      <footer className="mt-auto space-y-2 pt-2">
        <cite className="not-italic">
          <span className="block text-sm font-semibold text-white">
            {t.name}
          </span>
          <span className="mt-0.5 block text-sm text-farm-green-light/70">
            {t.role} · {t.location}
          </span>
        </cite>
        <span className="block text-[0.625rem] font-semibold tracking-[0.18em] text-farm-ochre/65 uppercase">
          {t.source}
        </span>
      </footer>
    </motion.blockquote>
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

      <div className="section-pad relative">
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
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-farm-green-light/75 md:text-base">
              Feedback from dairy growers, poultry starters, and homestead
              keepers across Tamil Nadu.
            </p>
          </MotionReveal>
        </div>

        {reduced ? (
          <div className="container-farm mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialQuote key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <div className="mt-12 md:mt-14">
            <Marquee gapClassName="gap-8 md:gap-12">
              {testimonials.map((t) => (
                <TestimonialQuote key={t.id} t={t} />
              ))}
            </Marquee>
          </div>
        )}
      </div>
    </section>
  );
}
