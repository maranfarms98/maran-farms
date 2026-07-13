"use client";

import { Leaf, Scale, Truck } from "lucide-react";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { motion } from "framer-motion";
import { useMotionAllowed } from "@/components/motion/motion-provider";

const VALUES = [
  {
    icon: Leaf,
    title: "Naturally Cultivated",
    tamil: "இயற்கை வளர்ப்பு",
  },
  {
    icon: Truck,
    title: "Direct Logistics",
    tamil: "நேரடி விநியோகம்",
  },
  {
    icon: Scale,
    title: "Transparent Pricing",
    tamil: "வெளிப்படையான விலை",
  },
];

export function StorySection() {
  const motionAllowed = useMotionAllowed();

  return (
    <section className="relative overflow-hidden bg-farm-warm">
      <div className="absolute inset-x-0 -top-px h-16 bg-farm-cream [clip-path:ellipse(70%_100%_at_50%_0%)]" />
      <div className="section-pad container-farm relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <MotionReveal>
            <p className="text-eyebrow text-farm-green">Rooted in Heritage</p>
            <h2 className="font-heading text-section mt-3 font-semibold text-farm-green-dark">
              From our fields
              <br />
              <span className="text-farm-accent">to your farm</span>
            </h2>
            <TamilCaption className="mt-2">
              எங்கள் வயல்களில் இருந்து உங்கள் பண்ணைக்கு
            </TamilCaption>
            <div className="mt-5 h-1 w-14 rounded-full bg-farm-accent" />
            <p className="prose-farm mt-6 text-farm-sage">
              Maran Farms is a family-owned agricultural brand built on trust,
              seasonal wisdom, and direct relationships with farmers across
              Tamil Nadu. We grow premium Napier varieties, hatch healthy
              chicks, and raise gentle small pets with the same care we give
              our own land.
            </p>
            <p className="prose-farm mt-4 text-farm-sage">
              Every WhatsApp order is a conversation — availability, delivery,
              and care guidance handled personally so you receive stock that
              performs.
            </p>

            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {VALUES.map((v) => {
                const Icon = v.icon;
                return (
                  <li key={v.title} className="flex flex-col gap-2">
                    <Icon className="size-5 text-farm-accent" aria-hidden />
                    <p className="font-heading text-base font-semibold text-farm-green-dark">
                      {v.title}
                    </p>
                    <p className="text-sm text-farm-sage" lang="ta">
                      {v.tamil}
                    </p>
                  </li>
                );
              })}
            </ul>
          </MotionReveal>

          <MotionReveal variant="right" className="relative">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden bg-farm-green-dark"
              whileHover={motionAllowed ? { scale: 1.01 } : undefined}
              transition={{ duration: 0.5 }}
            >
              <video
                className="absolute inset-0 size-full object-cover"
                src="/images/home-story.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Maran Farms field footage"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-farm-green-dark/40 via-transparent to-transparent" />
            </motion.div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
