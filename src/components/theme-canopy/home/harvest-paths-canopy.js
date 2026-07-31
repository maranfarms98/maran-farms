"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MotionReveal, StaggerChildren, StaggerItem } from "@/components/motion/motion-reveal";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { TiltCard } from "@/components/theme-canopy/shared/tilt-card";

const FALLBACK_PATHS = [
  { slug: "napier", name: "Napier Grass", tamilName: "நேப்பியர் புல்", image: "/images/category-napier.png" },
  { slug: "chicks", name: "Farm Chicks", tamilName: "பண்ணை குஞ்சுகள்", image: "/images/category-chicks.png" },
  { slug: "pets", name: "Small Pets", tamilName: "செல்லப்பிராணிகள்", image: "/images/category-pets.png" },
];

function toPaths(categories) {
  if (!categories?.length) return FALLBACK_PATHS;
  return categories.slice(0, 3).map((cat, i) => ({
    slug: cat.slug,
    name: cat.name,
    tamilName: cat.tamilName,
    image: cat.heroImage || cat.image || FALLBACK_PATHS[i]?.image,
  }));
}

export function HarvestPathsCanopy({ categories = [] }) {
  const paths = toPaths(categories);

  return (
    <section
      id="harvest-paths"
      className="relative scroll-mt-24 overflow-hidden bg-canopy-deep py-14 md:py-20"
    >
      <div className="container-farm">
        <MotionReveal>
          <p className="text-eyebrow text-canopy-gold-light">Our Categories</p>
          <h2 className="font-heading text-section mt-3 max-w-xl font-semibold text-canopy-mist">
            Wander the Canopy
          </h2>
          <TamilCaption tone="light" className="mt-2">
            எங்கள் வகைகள்
          </TamilCaption>
        </MotionReveal>

        <StaggerChildren className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {paths.map((path) => (
            <StaggerItem key={path.slug}>
              <TiltCard className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-canopy-leaf-light/15 shadow-elevated">
                <Link href={`/category/${path.slug}`} className="absolute inset-0">
                  <Image
                    src={path.image}
                    alt={path.name}
                    fill
                    unoptimized
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canopy-forest/95 via-canopy-forest/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="font-heading text-2xl font-semibold text-white">{path.name}</span>
                    <span className="mt-1 block text-sm italic text-canopy-gold-light" lang="ta">
                      {path.tamilName}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-canopy-leaf-light">
                      Explore
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
