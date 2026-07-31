"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { useGsapAllowed, useMotionAllowed } from "@/components/motion/motion-provider";

const STATS = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+", label: "Orders Delivered" },
  { value: 1000, suffix: "+", label: "Happy Farmers", display: "1,000+" },
  { value: 38, suffix: "", label: "Districts Covered" },
];

const DISTRICTS = ["Pollachi", "Coimbatore", "Madurai", "Salem", "Erode", "Trichy", "Chennai", "Thanjavur"];

function CountUp({ value, suffix, display, active }) {
  const [n, setN] = useState(0);
  const motionAllowed = useMotionAllowed();

  useEffect(() => {
    if (!active) return;
    if (!motionAllowed) {
      const t = window.setTimeout(() => setN(value), 0);
      return () => window.clearTimeout(t);
    }
    const duration = 1200;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, motionAllowed]);

  if (display && (!motionAllowed || n >= value)) return display;
  return `${n.toLocaleString("en-IN")}${suffix}`;
}

export function TrustDashboardCanopy() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const gsapAllowed = useGsapAllowed();

  return (
    <section ref={ref} className="section-pad-sm bg-canopy-mist">
      <div className="container-farm">
        <MotionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-canopy-moss">Credibility & Trust</p>
          <h2 className="font-heading text-section mt-3 font-semibold text-canopy-forest">
            Rooted Across Tamil Nadu
          </h2>
          <TamilCaption className="mt-2">தமிழ்நாடு முழுவதும் நம்பிக்கை</TamilCaption>
          <div className="mx-auto mt-5 h-0.5 w-14 bg-canopy-gold" aria-hidden />
          <p className="mt-5 text-canopy-bark/80">
            From Pollachi dairy farms to Chennai homesteads — viable stock,
            clear communication, every order confirmed on WhatsApp.
          </p>
        </MotionReveal>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-4xl font-semibold tracking-tight text-canopy-moss md:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} display={s.display} active={inView || !gsapAllowed} />
              </p>
              <p className="mt-2 text-sm font-medium text-canopy-bark/70">{s.label}</p>
            </div>
          ))}
        </div>

        <MotionReveal delay={120} className="mt-12">
          <p className="text-center text-eyebrow text-canopy-bark/60">Districts we serve</p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {DISTRICTS.map((d) => (
              <li key={d} className="font-heading text-sm text-canopy-forest/80 md:text-base">
                {d}
              </li>
            ))}
            <li className="text-sm italic text-canopy-moss">& more</li>
          </ul>
        </MotionReveal>
      </div>
    </section>
  );
}
