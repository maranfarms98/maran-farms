"use client";

import { InstagramIcon } from "@/components/ui/instagram-icon";
import Image from "next/image";
import { INSTAGRAM_URL } from "@/lib/site";
import { MotionReveal, StaggerChildren, StaggerItem } from "@/components/motion/motion-reveal";
import { Pressable } from "@/components/motion/pressable";

const POSTS = [
  { src: "/images/category-napier.png", alt: "Napier fields" },
  { src: "/images/category-chicks.png", alt: "Day old chicks" },
  { src: "/images/product-bird.png", alt: "Farm birds" },
  { src: "/images/category-pets.png", alt: "Small pets" },
];

export function InstagramSection() {
  return (
    <section className="section-pad-sm border-t border-farm-green-dark/8 bg-farm-warm">
      <div className="container-farm">
        <MotionReveal className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-farm-accent">
              <InstagramIcon className="size-5" />
              <p className="text-eyebrow text-farm-accent">@maran_farms</p>
            </div>
            <h2 className="font-heading text-section font-semibold text-farm-green-dark">
              Follow Our Journey
            </h2>
            <p className="mt-2 max-w-md text-farm-sage">
              Field notes, chick batches, and pet moments from the farm.
            </p>
          </div>
          <Pressable
            as="a"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex h-11 items-center rounded-full border border-farm-green-dark/15 bg-farm-cream px-5 text-button font-semibold text-farm-green"
          >
            Join on Instagram
          </Pressable>
        </MotionReveal>

        <StaggerChildren className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {POSTS.map((post) => (
            <StaggerItem key={post.src}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden"
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
              </a>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
