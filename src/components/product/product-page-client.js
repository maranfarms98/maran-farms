"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CircleHelp,
  MessageCircle,
  Share2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GENERIC_DESCRIPTION } from "@/data/constants";
import { ProductBadge } from "@/components/ui/product-badge";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { ProductCard } from "@/components/product/product-card";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { formatMinOrder, formatPrice } from "@/lib/format";
import { getProductOrderUrl } from "@/lib/whatsapp";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { Pressable } from "@/components/motion/pressable";

const TABS = [
  { id: "specs", label: "Product Specifications" },
  { id: "care", label: "Care Instructions" },
  { id: "origin", label: "Farm Origin & packaging" },
];

const THUMB_FALLBACKS = {
  napier: [
    "/images/product-napier.png",
    "/images/product-red-napier.png",
    "/images/category-napier.png",
  ],
  chicks: [
    "/images/product-chick.png",
    "/images/product-bird.png",
    "/images/category-chicks.png",
  ],
  pets: [
    "/images/product-rabbit.png",
    "/images/category-pets.png",
  ],
};

export function ProductPageClient({ product, category, related, content }) {
  const { getQuantity, setQuantity, addItem, setOrderDrawerOpen } = useCart();
  const { toast } = useToast();
  const motionAllowed = useMotionAllowed();
  const cartQty = getQuantity(product.id);
  const [qty, setQty] = useState(
    cartQty || product.minOrder || 1,
  );
  const [tab, setTab] = useState("specs");
  const [activeImage, setActiveImage] = useState(product.image);

  const thumbs = useMemo(() => {
    const pool = THUMB_FALLBACKS[product.categoryId] || THUMB_FALLBACKS.napier;
    const unique = [product.image, ...pool.filter((p) => p !== product.image)];
    return unique.slice(0, 3);
  }, [product]);

  const inCart = cartQty > 0;
  const lineTotal = product.price * qty;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Product page link copied to clipboard!");
    } catch {
      toast("Unable to copy link");
    }
  };

  const handleAdd = () => {
    if (inCart) {
      setOrderDrawerOpen(true);
      return;
    }
    addItem(product, Math.max(qty, product.minOrder || 1));
    setOrderDrawerOpen(true);
  };

  return (
    <div className="container-farm pt-28 pb-28 md:pb-16">
      <Link
        href={`/category/${category?.slug || ""}`}
        className="focus-ring mb-8 inline-flex items-center gap-2 text-sm font-medium text-farm-green hover:text-farm-accent"
      >
        <ArrowLeft className="size-4" />
        Back to {category?.name || "Catalog"}
      </Link>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden bg-farm-warm md:aspect-[5/6] lg:-ml-4 lg:aspect-auto lg:min-h-[32rem]">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <ProductBadge type={product.badge} />
              {product.minOrder > 1 && (
                <span className="rounded-full bg-farm-green/90 px-3 py-1.5 text-xs font-semibold text-farm-green-light">
                  {formatMinOrder(product)}
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 md:gap-3">
            {thumbs.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(src)}
                className={`focus-ring relative aspect-square overflow-hidden ${
                  activeImage === src
                    ? "ring-2 ring-farm-accent"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="120px" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <MotionReveal
            variant="right"
            className="sticky top-24 rounded-[2rem] border border-farm-green-dark/8 bg-farm-warm p-6 shadow-soft md:p-8"
          >
            <p className="text-eyebrow text-farm-green">{category?.name || "Product"}</p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-heading text-3xl text-farm-green-dark md:text-4xl">
                {product.name}
              </h1>
              <button
                type="button"
                aria-label="Share product"
                onClick={share}
                className="focus-ring flex size-11 shrink-0 items-center justify-center rounded-full bg-farm-cream text-farm-green hover:bg-farm-accent-light"
              >
                <Share2 className="size-5" />
              </button>
            </div>
            <TamilCaption className="mt-1">{product.tamilName}</TamilCaption>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-farm-cream p-4">
              <div>
                <p className="font-heading text-3xl text-farm-green">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-farm-sage">{product.unit}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-farm-green/10 px-3 py-1.5 text-sm font-semibold text-farm-green">
                <Check className="size-4" />
                In Stock
              </span>
            </div>

            <p className="mt-5 text-farm-sage">
              {product.description || GENERIC_DESCRIPTION}
            </p>

            <div className="mt-6">
              <p className="text-sm font-semibold text-farm-green-dark">
                Specify Quantity
              </p>
              <div className="mt-3">
                <QuantityStepper value={qty} onChange={setQty} min={0} />
              </div>
              {product.minOrder > 1 && (
                <p className="mt-2 text-sm italic text-farm-accent">
                  Minimum order: {formatMinOrder(product).replace("Min ", "")}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Pressable
                as="a"
                href={getProductOrderUrl(product, qty)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-farm-green text-button font-semibold text-farm-green-light"
              >
                <MessageCircle className="size-4" />
                Order on WhatsApp
              </Pressable>
              <Pressable
                type="button"
                onClick={handleAdd}
                className={`focus-ring inline-flex h-12 flex-1 items-center justify-center rounded-full border text-button font-semibold ${
                  inCart
                    ? "border-farm-green bg-farm-green/10 text-farm-green"
                    : "border-farm-green-dark/15 bg-farm-cream text-farm-green-dark"
                }`}
              >
                {inCart ? "Review Order list" : "Add to Order list"}
              </Pressable>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-farm-sage">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-farm-green" />
                Direct Farm Billing
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="size-4 text-farm-green" />
                Verified Tamil Nadu Logistics
              </span>
            </div>
          </MotionReveal>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 grid gap-8 lg:grid-cols-12">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto lg:col-span-3 lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`focus-ring shrink-0 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition lg:w-full ${
                tab === t.id
                  ? "bg-farm-green text-farm-green-light"
                  : "bg-farm-warm text-farm-green-dark hover:bg-farm-accent-light"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative min-h-[12rem] rounded-[2rem] border border-farm-green-dark/8 bg-farm-warm p-6 md:p-8 lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={motionAllowed ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
          {tab === "specs" && (
            <dl className="divide-y divide-farm-green-dark/8">
              {content.specs.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between"
                >
                  <dt className="font-medium text-farm-green-dark">
                    {row.label}
                  </dt>
                  <dd className="text-farm-sage">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {tab === "care" && (
            <ol className="space-y-4">
              {content.care.map((tip, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-heading flex size-9 shrink-0 items-center justify-center rounded-full bg-farm-accent text-sm text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-farm-sage">{tip}</p>
                </li>
              ))}
            </ol>
          )}
          {tab === "origin" && (
            <ul className="space-y-3">
              {content.origin.map((item, i) => (
                <li key={i} className="flex gap-3 text-farm-sage">
                  <Check className="mt-1 size-4 shrink-0 text-farm-green" />
                  {item}
                </li>
              ))}
            </ul>
          )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="font-heading text-section text-farm-green-dark">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {content.faqs.map((faq) => (
            <article
              key={faq.q}
              className="rounded-3xl border border-farm-green-dark/8 bg-farm-warm p-5"
            >
              <CircleHelp className="size-6 text-farm-accent" />
              <h3 className="mt-3 font-semibold text-farm-green-dark">
                {faq.q}
              </h3>
              <p className="mt-2 text-sm text-farm-sage">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-section text-farm-green-dark">
            Related Products
          </h2>
          <TamilCaption className="mt-2">
            தொடர்புடைய பொருட்கள்
          </TamilCaption>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile sticky bar */}
      <motion.div
        initial={motionAllowed ? { y: 80, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-farm-green-dark/10 bg-farm-cream/95 px-4 py-3 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-xl text-farm-green">
              {formatPrice(lineTotal)}
            </p>
            <p className="text-xs text-farm-sage">Qty {qty}</p>
          </div>
          <a
            href={getProductOrderUrl(product, qty)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-farm-green px-5 text-sm font-semibold text-farm-green-light"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
}
