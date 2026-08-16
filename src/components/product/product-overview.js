"use client";

import { Check } from "lucide-react";
import { MotionReveal } from "@/components/motion/motion-reveal";

export function ProductOverview({ product, guide }) {
  const features = Array.isArray(guide?.features) ? guide.features : [];
  const sections = Array.isArray(guide?.sections) ? guide.sections : [];

  if (!guide?.intro && !features.length && !sections.length) return null;

  return (
    <section className="mt-16">
      <h2 className="font-heading text-section text-farm-green-dark">
        About {product.name}
      </h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <MotionReveal className="lg:col-span-7">
          {guide.intro ? (
            <p className="text-lg leading-relaxed text-farm-green-dark/85 md:text-xl">
              {guide.intro}
            </p>
          ) : null}

          {sections.length ? (
            <div className="mt-10 space-y-8">
              {sections.map((section) => (
                <article key={section.heading}>
                  <h3 className="font-heading text-xl text-farm-green-dark md:text-2xl">
                    {section.heading}
                  </h3>
                  <p className="mt-3 leading-relaxed text-farm-sage">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </MotionReveal>

        {features.length ? (
          <MotionReveal
            variant="right"
            delay={80}
            className="lg:col-span-5 lg:self-start"
          >
            <div className="rounded-[2rem] border border-farm-green-dark/8 bg-farm-warm p-6 shadow-soft md:p-8">
              <p className="text-eyebrow text-farm-green">Key Features</p>
              <ul className="mt-5 space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-farm-sage">
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-farm-green/10 text-farm-green">
                      <Check className="size-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        ) : null}
      </div>
    </section>
  );
}
