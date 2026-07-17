"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { useMotionAllowed } from "@/components/motion/motion-provider";

const FALLBACK_PATHS = [
  {
    slug: "napier",
    name: "Napier Grass",
    tamilName: "நேப்பியர் புல்",
    image: "/images/category-napier.png",
    line: "Dense, nutrient-rich fodder grown for yield.",
  },
  {
    slug: "chicks",
    name: "Farm Chicks",
    tamilName: "பண்ணை குஞ்சுகள்",
    image: "/images/category-chicks.png",
    line: "Healthy day-olds, ready for your flock.",
  },
  {
    slug: "pets",
    name: "Small Pets",
    tamilName: "செல்லப்பிராணிகள்",
    image: "/images/category-pets.png",
    line: "Gentle companions raised with care.",
  },
];

function shortLine(description, fallback) {
  if (!description) return fallback;
  const first = description.split(".")[0]?.trim() || description.trim();
  if (first.length <= 72) return first.endsWith(".") ? first.slice(0, -1) : first;
  return `${first.slice(0, 69).trim()}…`;
}

function toPaths(categories) {
  if (!categories?.length) return FALLBACK_PATHS;
  return categories.slice(0, 3).map((cat, i) => ({
    slug: cat.slug,
    name: cat.name,
    tamilName: cat.tamilName,
    image: cat.heroImage || cat.image || FALLBACK_PATHS[i]?.image,
    line: shortLine(cat.description, FALLBACK_PATHS[i]?.line || "View products"),
  }));
}

function PathPanel({ path, isActive, showDivider, motionAllowed, onActivate }) {
  return (
    <Link
      href={`/category/${path.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className="group relative min-w-0 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d2a8] focus-visible:ring-inset"
      style={{
        flexGrow: isActive ? 2.35 : 1,
        flexBasis: 0,
        transition: motionAllowed
          ? "flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
          : "none",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={motionAllowed ? { scale: isActive ? 1.06 : 1.02 } : undefined}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={path.image}
          alt={path.name}
          fill
          unoptimized
          className="object-cover"
          sizes="50vw"
        />
      </motion.div>

      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isActive
            ? "bg-gradient-to-t from-farm-green-dark/90 via-farm-green-dark/35 to-transparent"
            : "bg-farm-green-dark/55"
        }`}
      />

      {showDivider && (
        <div className="absolute inset-y-0 left-0 w-px bg-white/15" aria-hidden />
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 md:p-8">
        <span
          className={`font-heading text-[clamp(1.5rem,2.5vw,2.35rem)] font-semibold tracking-tight text-white transition-transform duration-500 ${
            isActive ? "translate-y-0" : "translate-y-1"
          }`}
        >
          {path.name}
        </span>
        <span className="mt-1 text-sm italic text-[#f0d2a8]" lang="ta">
          {path.tamilName}
        </span>
        <p
          className={`mt-3 max-w-xs text-sm leading-relaxed text-white/85 transition-all duration-500 ${
            isActive
              ? "max-h-24 opacity-100"
              : "max-h-0 overflow-hidden opacity-0"
          }`}
        >
          {path.line}
        </p>
        <span
          className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f0d2a8] transition-all duration-500 ${
            isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          }`}
        >
          Explore
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

export function HarvestPaths({ categories = [] }) {
  const paths = toPaths(categories);
  const motionAllowed = useMotionAllowed();
  const [active, setActive] = useState(0);

  return (
    <section
      id="harvest-paths"
      className="relative scroll-mt-24 overflow-hidden bg-farm-green-dark"
      aria-labelledby="harvest-paths-heading"
    >
      <div className="container-farm px-6 pt-14 pb-8 md:pt-16 md:pb-10">
        <MotionReveal>
          <p className="text-eyebrow text-[#f0d2a8]">Our Categories</p>
          <h2
            id="harvest-paths-heading"
            className="font-heading text-section mt-3 max-w-xl font-semibold text-white"
          >
            Browse what we grow
          </h2>
          <TamilCaption tone="light" className="mt-2">
            எங்கள் வகைகள்
          </TamilCaption>
        </MotionReveal>
      </div>

      {/* Desktop: expanding full-bleed panels */}
      <div
        className="hidden h-[min(72vh,620px)] w-full md:flex"
        onMouseLeave={() => setActive(0)}
      >
        {paths.map((path, i) => (
          <PathPanel
            key={path.slug}
            path={path}
            isActive={active === i}
            showDivider={i > 0}
            motionAllowed={motionAllowed}
            onActivate={() => setActive(i)}
          />
        ))}
      </div>

      {/* Mobile: horizontal snap gallery */}
      <div className="flex snap-x snap-mandatory gap-0 overflow-x-auto pb-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {paths.map((path) => (
          <Link
            key={path.slug}
            href={`/category/${path.slug}`}
            className="relative h-[58vh] w-[82vw] shrink-0 snap-center overflow-hidden first:ml-6 last:mr-6"
          >
            <Image
              src={path.image}
              alt={path.name}
              fill
              unoptimized
              className="object-cover"
              sizes="82vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-farm-green-dark/90 via-farm-green-dark/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col p-5">
              <span className="font-heading text-2xl font-semibold text-white">
                {path.name}
              </span>
              <span className="mt-1 text-sm italic text-[#f0d2a8]" lang="ta">
                {path.tamilName}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                {path.line}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f0d2a8]">
                Explore
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="h-10 bg-farm-warm [clip-path:ellipse(60%_100%_at_50%_100%)]" />
    </section>
  );
}
