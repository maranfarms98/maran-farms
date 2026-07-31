"use client";

import { InstagramIcon } from "@/components/ui/instagram-icon";
import { INSTAGRAM_URL } from "@/lib/site";
import { MotionReveal, StaggerChildren, StaggerItem } from "@/components/motion/motion-reveal";
import { Pressable } from "@/components/motion/pressable";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { TiltCard } from "@/components/theme-canopy/shared/tilt-card";

const POSTS = [
  { src: "/images/Journey01.MP4", alt: "Napier harvest from the farm" },
  { src: "/images/Journey02.MP4", alt: "Day-old chicks at Maran Farms" },
  { src: "/images/Journey03.MP4", alt: "Farm birds on the branch" },
  { src: "/images/Journey04.MP4", alt: "Small pets raised with care" },
];

export function InstagramSectionCanopy() {
  const motionAllowed = useMotionAllowed();

  return (
    <section className="section-pad-sm border-t border-canopy-leaf-light/10 bg-canopy-forest">
      <div className="container-farm">
        <MotionReveal className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-canopy-gold-light">
              <InstagramIcon className="size-5" />
              <p className="text-eyebrow text-canopy-gold-light">@maran_farms</p>
            </div>
            <h2 className="font-heading text-section font-semibold text-canopy-mist">Follow Our Journey</h2>
            <p className="mt-2 max-w-md text-canopy-mist/70">
              Field notes, chick batches, and pet moments from the farm.
            </p>
          </div>
          <Pressable
            as="a"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex h-11 items-center rounded-full border border-canopy-leaf-light/20 bg-canopy-deep/60 px-5 text-button font-semibold text-canopy-mist"
          >
            Join on Instagram
          </Pressable>
        </MotionReveal>

        <StaggerChildren className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {POSTS.map((post) => (
            <StaggerItem key={post.src}>
              <TiltCard className="group relative block aspect-square overflow-hidden rounded-2xl border border-canopy-leaf-light/15 bg-canopy-deep">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="absolute inset-0">
                  <video
                    className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
                    src={post.src}
                    autoPlay={motionAllowed}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={post.alt}
                  />
                </a>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
