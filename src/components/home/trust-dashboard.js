"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { useGsapAllowed, useMotionAllowed } from "@/components/motion/motion-provider";
import { useInView } from "framer-motion";
import { DISTRICTS } from "@/data/districts";

const STATS = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+", label: "Orders Delivered" },
  { value: 1000, suffix: "+", label: "Happy Farmers", display: "1,000+" },
  { value: 38, suffix: "", label: "Districts Covered" },
];

function finalLabel({ value, suffix, display }) {
  return display || `${value.toLocaleString("en-IN")}${suffix}`;
}

function CountUp({ value, suffix, display, active }) {
  const final = finalLabel({ value, suffix, display });
  const [n, setN] = useState(value);
  const motionAllowed = useMotionAllowed();
  const animating = motionAllowed && active && n < value;

  useEffect(() => {
    if (!active || !motionAllowed) return undefined;
    setN(0);
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

  return (
    <span className="relative inline-block">
      <span className={animating ? "invisible" : undefined}>{final}</span>
      {animating ? (
        <span className="absolute inset-0" aria-hidden="true">
          {`${n.toLocaleString("en-IN")}${suffix}`}
        </span>
      ) : null}
    </span>
  );
}

export function TrustDashboard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const gsapAllowed = useGsapAllowed();

  return (
    <section
      ref={ref}
      className="section-pad-sm bg-farm-accent-light"
    >
      <div className="container-farm">
        <MotionReveal className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-farm-green">Credibility & Trust</p>
          <h2 className="font-heading text-section mt-3 font-semibold text-farm-green-dark">
            Trusted across Tamil Nadu
          </h2>
          <TamilCaption className="mt-2">
            தமிழ்நாடு முழுவதும் நம்பிக்கை
          </TamilCaption>
          <div className="mx-auto mt-5 h-0.5 w-14 bg-farm-accent" aria-hidden />
          <p className="mt-5 text-farm-sage">
            From Pollachi dairy farms to Chennai homesteads — viable stock,
            clear communication, every order confirmed on WhatsApp.
          </p>
        </MotionReveal>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-4xl font-semibold tracking-tight text-farm-green md:text-5xl">
                <CountUp
                  value={s.value}
                  suffix={s.suffix}
                  display={s.display}
                  active={inView || !gsapAllowed}
                />
              </p>
              <p className="mt-2 text-sm font-medium text-farm-sage">{s.label}</p>
            </div>
          ))}
        </div>

        <MotionReveal delay={120} className="mt-12">
          <p className="text-center text-eyebrow text-farm-sage">
            Districts we serve
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {DISTRICTS.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/delivery/${d.slug}`}
                  className="focus-ring font-heading rounded-sm text-sm text-farm-green-dark/80 hover:text-farm-green md:text-base"
                >
                  {d.name}
                </Link>
              </li>
            ))}
            <li className="text-sm italic text-farm-accent">& more</li>
          </ul>
        </MotionReveal>
      </div>
    </section>
  );
}
