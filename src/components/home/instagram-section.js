"use client";

import { InstagramIcon } from "@/components/ui/instagram-icon";
import { INSTAGRAM_JOURNEY_POSTS } from "@/data/instagram-posts";
import { INSTAGRAM_URL } from "@/lib/site";
import { LazyVideo } from "@/components/ui/lazy-video";
import { MotionReveal, StaggerChildren, StaggerItem } from "@/components/motion/motion-reveal";
import { Pressable } from "@/components/motion/pressable";

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
              Field notes, chick batches, and pet moments from the Karur farm.
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
          {INSTAGRAM_JOURNEY_POSTS.map((post) => (
            <StaggerItem key={post.src}>
              <figure>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={post.caption}
                  className="group relative block aspect-square overflow-hidden bg-farm-green-dark"
                >
                  <LazyVideo
                    className="absolute inset-0 size-full object-cover"
                    src={post.src}
                    title={post.caption}
                    aria-label={post.alt}
                  />
                </a>
                <figcaption className="mt-2 px-1 text-xs font-medium text-farm-sage">
                  {post.caption}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
