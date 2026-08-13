"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { ProductCardBazaar } from "@/components/theme-bazaar/shared/product-card-bazaar";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";
import { BAZAAR_ROADMAP } from "@/components/theme-bazaar/shared/bazaar-data";
import { useMotionAllowed } from "@/components/motion/motion-provider";

function HeroBazaar() {
  const { t } = useBazaarLang();
  const motionAllowed = useMotionAllowed();

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-bazaar-soil md:min-h-[88vh]">
      <div className="pointer-events-none absolute inset-0">
        <video
          className="absolute inset-0 size-full object-cover object-center"
          src="/images/home-story.mp4"
          poster="/images/home-hero.jpg"
          autoPlay={motionAllowed}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Maran Farms field footage"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bazaar-soil via-bazaar-soil/55 to-bazaar-soil/20" />
      <div className="bazaar-container relative z-10 flex min-h-[85vh] flex-col justify-end pb-16 pt-28 md:min-h-[88vh]">
        <p className="animate-bazaar-rise font-heading text-[clamp(3rem,11vw,5.5rem)] leading-[0.92] font-semibold text-white">
          {SITE_NAME}
        </p>
        <p
          className="animate-bazaar-rise mt-4 max-w-lg text-xl text-bazaar-sand md:text-2xl"
          style={{ animationDelay: "80ms" }}
        >
          {t.heroLine}
        </p>
        <p
          className="animate-bazaar-rise mt-3 max-w-md text-sm text-white/75 md:text-base"
          style={{ animationDelay: "140ms" }}
        >
          {t.heroSub}
        </p>
        <div
          className="animate-bazaar-rise mt-8 flex flex-wrap gap-3"
          style={{ animationDelay: "200ms" }}
        >
          <a
            href="#bazaar-shop"
            className="focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-bazaar-wa px-6 text-sm font-semibold text-white hover:bg-bazaar-wa-bright"
          >
            {t.browse}
            <ArrowRight className="size-4" />
          </a>
          <a
            href={getGenericInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white"
          >
            <MessageCircle className="size-4" />
            {t.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}

function CategoriesBazaar({ categories }) {
  const { t, lang } = useBazaarLang();
  const list = categories?.length
    ? categories
    : [
        { slug: "napier", name: "Napier Grass", tamilName: "நேப்பியர்", image: "/images/category-napier.png" },
        { slug: "chicks", name: "Farm Chicks", tamilName: "குஞ்சுகள்", image: "/images/category-chicks.png" },
        { slug: "pets", name: "Small Pets", tamilName: "செல்லப்பிராணிகள்", image: "/images/category-pets.png" },
      ];

  return (
    <section id="bazaar-shop" className="scroll-mt-24 py-14 md:py-20">
      <div className="bazaar-container">
        <h2 className="font-heading text-3xl font-semibold text-bazaar-ink md:text-4xl">
          {t.categories}
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {list.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[5/4] overflow-hidden rounded-2xl bg-bazaar-sand"
            >
              <Image
                src={cat.heroImage || cat.image || "/images/category-napier.png"}
                alt={cat.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bazaar-ink/80 via-bazaar-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-heading text-2xl text-white">
                  {lang === "ta" ? cat.tamilName : cat.name}
                </p>
                <p className="mt-1 text-sm text-white/70">{t.browse} →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedBazaar({ products }) {
  const { t } = useBazaarLang();
  if (!products?.length) return null;
  return (
    <section className="border-t border-bazaar-ink/10 bg-bazaar-highlight py-14 md:py-20">
      <div className="bazaar-container">
        <h2 className="font-heading text-3xl font-semibold text-bazaar-ink md:text-4xl">
          {t.featured}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
          {products.map((p) => (
            <ProductCardBazaar key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksBazaar() {
  const { t } = useBazaarLang();
  const steps = [t.step1, t.step2, t.step3];
  return (
    <section className="py-14 md:py-16">
      <div className="bazaar-container">
        <h2 className="font-heading text-3xl font-semibold text-bazaar-ink">{t.howItWorks}</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((label, i) => (
            <li
              key={label}
              className="rounded-2xl border border-bazaar-ink/10 bg-white p-6"
            >
              <span className="font-heading text-4xl text-bazaar-wa">{i + 1}</span>
              <p className="mt-3 text-lg font-semibold text-bazaar-ink">{label}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function RoadmapBazaar() {
  const { t, lang } = useBazaarLang();
  return (
    <section className="border-t border-bazaar-ink/10 bg-bazaar-paper py-14 md:py-20">
      <div className="bazaar-container">
        <h2 className="font-heading text-3xl font-semibold text-bazaar-ink">{t.roadmap}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {BAZAAR_ROADMAP.map((block) => (
            <article
              key={block.horizon}
              className="rounded-2xl border border-bazaar-ink/10 bg-white p-6"
            >
              <p className="text-xs font-semibold tracking-widest text-bazaar-wa uppercase">
                {block.horizon === "30"
                  ? t.roadmap30
                  : block.horizon === "60"
                    ? t.roadmap60
                    : t.roadmap90}
              </p>
              <h3 className="font-heading mt-2 text-xl text-bazaar-ink">
                {lang === "ta" ? block.titleTa : block.titleEn}
              </h3>
              <ul className="mt-4 space-y-2">
                {(lang === "ta" ? block.itemsTa : block.itemsEn).map((item) => (
                  <li key={item} className="text-sm text-bazaar-muted">
                    · {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeBazaar({ categories = [], featuredProducts = [] }) {
  return (
    <>
      <HeroBazaar />
      <CategoriesBazaar categories={categories} />
      <FeaturedBazaar products={featuredProducts} />
      <HowItWorksBazaar />
      <RoadmapBazaar />
    </>
  );
}
