"use client";

import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { MotionReveal, StaggerChildren, StaggerItem } from "@/components/motion/motion-reveal";
import { TiltCard } from "@/components/theme-canopy/shared/tilt-card";

function TestimonialCardCanopy({ t }) {
  return (
    <TiltCard className="relative flex h-full flex-col gap-3 rounded-3xl border border-canopy-leaf-light/15 bg-canopy-deep/60 p-6 backdrop-blur-sm">
      <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="size-3 fill-canopy-gold text-canopy-gold" aria-hidden />
        ))}
      </div>
      <p className="font-heading text-[1.05rem] leading-snug text-canopy-mist sm:text-[1.15rem]">{t.review}</p>
      <p className="text-[0.8125rem] leading-relaxed text-canopy-gold-light italic" lang="ta">
        {t.tamilReview}
      </p>
      <footer className="mt-auto space-y-1.5 pt-1">
        <cite className="not-italic">
          <span className="block text-sm font-semibold text-canopy-mist">{t.name}</span>
          <span className="mt-0.5 block text-sm text-canopy-mist/60">
            {t.role} · {t.location}
          </span>
        </cite>
        <span className="block text-[0.625rem] font-semibold tracking-[0.18em] text-canopy-leaf-light/70 uppercase">
          {t.source}
        </span>
      </footer>
    </TiltCard>
  );
}

export function TestimonialsCanopy() {
  return (
    <section className="relative overflow-hidden bg-canopy-forest">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 20% 0%, #d9a441 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 100%, #4f9b5c 0%, transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative py-12 md:py-[5.5rem] xl:py-[7.5rem]">
        <div className="container-farm">
          <MotionReveal className="flex max-w-xl flex-col items-start text-left">
            <p className="text-[0.6875rem] font-semibold tracking-[0.2em] text-canopy-gold-light uppercase">
              Customer Voice
            </p>
            <h2 className="font-heading text-section mt-3 font-semibold text-canopy-mist">What Farmers Say</h2>
            <TamilCaption tone="light" className="mt-2">
              விவசாயிகள் சொல்வது
            </TamilCaption>
          </MotionReveal>

          <StaggerChildren className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.id} className="h-full">
                <TestimonialCardCanopy t={t} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}
