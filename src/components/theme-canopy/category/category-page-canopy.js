"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, MessageCircle, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { CategoryFilters } from "@/components/category/category-filters";
import { MobileFilterDrawer } from "@/components/category/mobile-filter-drawer";
import { useIsMobile } from "@/hooks/use-media";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { ProductCardCanopy } from "@/components/theme-canopy/shared/product-card-canopy";

const AmbientCanopyCanvas = dynamic(
  () =>
    import("@/components/theme-canopy/three/ambient-canopy-canvas").then(
      (m) => m.AmbientCanopyCanvas,
    ),
  { ssr: false },
);

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

export function CategoryPageCanopy({ category, products, allCategories }) {
  const all = products;
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [special, setSpecial] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const motionAllowed = useMotionAllowed();

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
      <section className="relative min-h-[calc(var(--vvh)*0.4)] overflow-hidden bg-canopy-forest md:min-h-[calc(var(--vvh)*0.5)]">
        <div className="absolute inset-0">
          <Image
            src={category.heroImage}
            alt={category.name}
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canopy-forest via-canopy-forest/50 to-canopy-deep/40" />
        <AmbientCanopyCanvas />
        <div className="relative z-10 container-farm flex min-h-[calc(var(--vvh)*0.4)] flex-col justify-end pt-28 pb-10 md:min-h-[calc(var(--vvh)*0.5)] md:pb-14">
          <Link
            href="/"
            className="focus-ring mb-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-canopy-mist/90 hover:text-canopy-mist"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
          <p className="text-eyebrow text-canopy-gold-light">Category</p>
          <h1 className="font-heading text-section mt-2 text-canopy-mist">{category.name}</h1>
          <TamilCaption tone="light" className="mt-2">
            {category.tamilName}
          </TamilCaption>
          <p className="mt-3 max-w-xl text-canopy-mist/85">{category.description}</p>
        </div>
      </section>

      <div className="bg-canopy-deep py-6">
        <div className="container-farm">
          <p className="mb-3 text-eyebrow text-canopy-gold-light">Other categories</p>
          <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
            {allCategories.map((cat) => {
              const active = cat.slug === category.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`focus-ring group relative flex h-16 w-[min(200px,70vw)] shrink-0 items-end overflow-hidden rounded-2xl ${
                    active ? "ring-2 ring-canopy-gold ring-offset-2 ring-offset-canopy-deep" : ""
                  }`}
                >
                  <Image
                    src={cat.image || cat.heroImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canopy-forest/90 via-canopy-forest/30 to-transparent" />
                  <span className="relative z-10 p-3 text-sm font-semibold text-canopy-mist">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-canopy-forest">
        <div className="container-farm grid gap-8 pb-20 pt-8 lg:grid-cols-12">
          <CategoryFilters
            className="hidden rounded-3xl bg-canopy-mist p-5 lg:col-span-3 lg:sticky lg:top-24 lg:block lg:self-start"
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            special={special}
            setSpecial={setSpecial}
          />

          <div className="lg:col-span-9">
            <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
              <p className="text-sm text-canopy-mist/70">
                {filtered.length} of {all.length} products
              </p>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-canopy-leaf px-4 text-sm font-semibold text-canopy-forest"
              >
                <SlidersHorizontal className="size-4" />
                Filters & Sort
              </button>
            </div>

            <div className="mb-6 hidden items-center justify-between lg:flex">
              <p className="text-sm text-canopy-mist/70">
                Showing {filtered.length} of {all.length} products
              </p>
              {category.minOrder > 1 && (
                <span className="rounded-full bg-canopy-gold/20 px-3 py-1.5 text-xs font-semibold text-canopy-gold-light">
                  Min order threshold applies per variety
                </span>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-3xl bg-canopy-deep/60 px-6 py-16 text-center">
                <h3 className="font-heading text-2xl text-canopy-mist">No products found</h3>
                <TamilCaption tone="light" className="mt-2">
                  பொருட்கள் கிடைக்கவில்லை
                </TamilCaption>
                <p className="mx-auto mt-3 max-w-md text-canopy-mist/70">
                  Try adjusting your search or filters, or message us on WhatsApp.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="focus-ring inline-flex h-11 items-center rounded-full bg-canopy-gold px-6 text-sm font-semibold text-canopy-forest"
                  >
                    Reset Filters
                  </button>
                  <a
                    href={getGenericInquiryUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-canopy-leaf px-6 text-sm font-semibold text-canopy-forest"
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
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
                      <ProductCardCanopy product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
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
