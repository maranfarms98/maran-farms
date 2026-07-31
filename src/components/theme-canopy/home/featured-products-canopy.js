"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { ProductCardCanopy } from "@/components/theme-canopy/shared/product-card-canopy";

export function FeaturedProductsCanopy({ products = [] }) {
  const scrollerRef = useRef(null);
  const motionAllowed = useMotionAllowed();

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section className="section-pad bg-canopy-forest">
      <div className="container-farm">
        <div className="flex items-end justify-between gap-4">
          <MotionReveal className="flex-1 text-left">
            <p className="text-eyebrow text-canopy-gold-light">Top Picks</p>
            <h2 className="font-heading text-section mt-3 font-semibold text-canopy-mist">
              Featured Products
            </h2>
            <TamilCaption tone="light" className="mt-2">
              பண்ணையின் சிறந்த தேர்வுகள்
            </TamilCaption>
          </MotionReveal>
          <div className="hidden gap-2 md:flex">
            <motion.button
              type="button"
              aria-label="Previous"
              onClick={() => scroll(-1)}
              whileTap={motionAllowed ? { scale: 0.92 } : undefined}
              className="focus-ring flex size-11 items-center justify-center rounded-full border border-canopy-leaf-light/20 bg-canopy-deep/60 text-canopy-mist hover:bg-canopy-moss/30"
            >
              <ChevronLeft className="size-5" />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next"
              onClick={() => scroll(1)}
              whileTap={motionAllowed ? { scale: 0.92 } : undefined}
              className="focus-ring flex size-11 items-center justify-center rounded-full border border-canopy-leaf-light/20 bg-canopy-deep/60 text-canopy-mist hover:bg-canopy-moss/30"
            >
              <ChevronRight className="size-5" />
            </motion.button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:hidden">
          {products.map((p) => (
            <ProductCardCanopy key={p.id} product={p} teaser />
          ))}
        </div>

        <div
          ref={scrollerRef}
          className="hide-scrollbar mt-8 hidden snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:flex"
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="w-[min(280px,42vw)] shrink-0 snap-start lg:w-[min(300px,28vw)] xl:w-[min(280px,22vw)]"
            >
              <ProductCardCanopy product={p} teaser />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
