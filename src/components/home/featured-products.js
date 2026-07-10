"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getFeaturedProducts } from "@/data/products";
import { useMotionAllowed } from "@/components/motion/motion-provider";

export function FeaturedProducts() {
  const products = getFeaturedProducts();
  const scrollerRef = useRef(null);
  const motionAllowed = useMotionAllowed();

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section className="section-pad container-farm">
      <div className="flex items-end justify-between gap-4">
        <SectionHeader
          align="left"
          borderLeft
          accentRule={false}
          eyebrow="Top Picks"
          title="Featured Products"
          tamil="பண்ணையின் சிறந்த தேர்வுகள்"
          className="flex-1"
        />
        <div className="hidden gap-2 md:flex">
          <motion.button
            type="button"
            aria-label="Previous"
            onClick={() => scroll(-1)}
            whileTap={motionAllowed ? { scale: 0.92 } : undefined}
            className="focus-ring flex size-11 items-center justify-center rounded-full border border-farm-green-dark/15 bg-farm-warm text-farm-green hover:bg-farm-accent-light"
          >
            <ChevronLeft className="size-5" />
          </motion.button>
          <motion.button
            type="button"
            aria-label="Next"
            onClick={() => scroll(1)}
            whileTap={motionAllowed ? { scale: 0.92 } : undefined}
            className="focus-ring flex size-11 items-center justify-center rounded-full border border-farm-green-dark/15 bg-farm-warm text-farm-green hover:bg-farm-accent-light"
          >
            <ChevronRight className="size-5" />
          </motion.button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:hidden">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} teaser />
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
            <ProductCard product={p} teaser />
          </div>
        ))}
      </div>
    </section>
  );
}
