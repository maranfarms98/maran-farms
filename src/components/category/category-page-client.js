"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Filter, Leaf, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { CategoryFilters } from "@/components/category/category-filters";
import { MobileFilterDrawer } from "@/components/category/mobile-filter-drawer";
import { useIsMobile } from "@/hooks/use-media";
import {
  useGsapAllowed,
  useMotionAllowed,
} from "@/components/motion/motion-provider";
import { useGsapContext } from "@/components/motion/use-gsap-context";

function filterProducts(list, { search, sort, special }) {
  let result = [...list];
  const q = search.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tamilName.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q),
    );
  }
  if (special !== "all") {
    result = result.filter((p) => p.badge === special);
  }
  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (sort === "az") result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

export function CategoryPageClient({ category, products, allCategories }) {
  const all = products;
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [special, setSpecial] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const motionAllowed = useMotionAllowed();
  const gsapAllowed = useGsapAllowed();
  const heroRef = useGsapContext(
    ({ gsap, el }) => {
      const img = el.querySelector("[data-cat-hero]");
      if (!img) return;
      gsap.to(img, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    [gsapAllowed],
  );

  const filtered = useMemo(
    () => filterProducts(all, { search, sort, special }),
    [all, search, sort, special],
  );

  const reset = () => {
    setSearch("");
    setSort("relevance");
    setSpecial("all");
  };

  return (
    <>
      <section
        ref={heroRef}
        className="relative min-h-[calc(var(--vvh)*0.4)] overflow-hidden md:min-h-[calc(var(--vvh)*0.5)]"
      >
        <div data-cat-hero className="absolute inset-0 will-change-transform">
          <Image
            src={category.heroImage}
            alt={category.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div
          className={`absolute inset-0 bg-gradient-to-t ${category.gradient} pointer-events-none`}
        />
        <div className="grain-overlay pointer-events-none absolute inset-0" />
        <div className="relative z-10 container-farm flex min-h-[calc(var(--vvh)*0.4)] flex-col justify-end pb-10 pt-28 md:min-h-[calc(var(--vvh)*0.5)] md:pb-14">
          <Link
            href="/"
            className="focus-ring mb-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur-sm">
            <Leaf className="size-4" />
            <span className="text-eyebrow text-white">Maran Farms Catalog</span>
          </div>
          <h1 className="font-heading text-section text-white">
            {category.name}
          </h1>
          <TamilCaption className="mt-2 text-farm-ochre">
            {category.tamilName}
          </TamilCaption>
          <p className="mt-3 max-w-xl text-farm-green-light/85">
            {category.description}
          </p>
        </div>
      </section>

      <div className="container-farm py-6">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          {allCategories.map((cat) => {
            const active = cat.slug === category.slug;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`focus-ring inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-farm-accent text-white"
                    : "bg-farm-warm text-farm-green-dark hover:bg-farm-accent-light"
                }`}
              >
                <Leaf className="size-4" />
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="container-farm grid gap-8 pb-20 lg:grid-cols-12">
        <CategoryFilters
          className="hidden lg:col-span-3 lg:sticky lg:top-24 lg:block lg:self-start"
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          special={special}
          setSpecial={setSpecial}
        />

        <div className="lg:col-span-9">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <p className="text-sm text-farm-sage">
              {filtered.length} of {all.length} products
            </p>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-farm-green px-4 text-sm font-semibold text-farm-green-light"
            >
              <SlidersHorizontal className="size-4" />
              Filters & Sort
            </button>
          </div>

          <div className="mb-6 hidden items-center justify-between lg:flex">
            <p className="text-sm text-farm-sage">
              Showing {filtered.length} of {all.length} products
            </p>
            {category.minOrder > 1 && (
              <span className="rounded-full bg-farm-accent-light px-3 py-1.5 text-xs font-semibold text-farm-accent">
                Min order threshold applies per variety
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-farm-green-dark/20 bg-farm-warm px-6 py-16 text-center">
              <Filter className="mx-auto size-10 text-farm-sage" />
              <h3 className="font-heading mt-4 text-2xl text-farm-green-dark">
                No Products Found
              </h3>
              <p className="mt-2 text-farm-sage">
                Try adjusting your search or special filters.
              </p>
              <button
                type="button"
                onClick={reset}
                className="focus-ring mt-6 inline-flex h-11 items-center rounded-full bg-farm-accent px-6 text-sm font-semibold text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={motionAllowed ? { opacity: 0, scale: 0.96 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.28 }}
                  >
                    <ProductCard product={p} compact={isMobile} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        special={special}
        setSpecial={setSpecial}
        resultCount={filtered.length}
      />
    </>
  );
}
