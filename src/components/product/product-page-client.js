"use client";

import Image from "next/image";
import {
  Check,
  CircleAlert,
  CircleHelp,
  MessageCircle,
  Share2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { productImageAlt } from "@/lib/seo";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GENERIC_DESCRIPTION } from "@/data/constants";
import { ProductBadge } from "@/components/ui/product-badge";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { ProductCard } from "@/components/product/product-card";
import { ProductOverview } from "@/components/product/product-overview";
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

export function ProductPageClient({
  product,
  category,
  related,
  content,
  guide,
  crumbs,
}) {
  const { getQuantity, setQuantity, addItem, setOrderDrawerOpen } = useCart();
  const { toast } = useToast();
  const motionAllowed = useMotionAllowed();
  const cartQty = getQuantity(product.id);
  const [qty, setQty] = useState(
    cartQty || product.minOrder || 1,
  );
  const [tab, setTab] = useState("specs");
  const [activeImage, setActiveImage] = useState(product.image);

  // Catalog uses a single Storage/DB image today; thumbs appear only if more are added later.
  const thumbs = useMemo(() => {
    return product.image ? [product.image] : [];
  }, [product.image]);

  const inCart = cartQty > 0;
  const outOfStock = product.inStock === false;
  const lineTotal = product.price * qty;
  const originNotes = Array.isArray(content.origin) ? content.origin : [];

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
    <div className="container-farm pt-24 pb-28 md:pt-28 md:pb-16">
      {crumbs?.length ? (
        <div className="mb-8">
          <Breadcrumbs items={crumbs} />
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="relative aspect-square overflow-hidden bg-farm-warm sm:aspect-[4/5] md:aspect-[5/6] lg:-ml-4 lg:aspect-auto lg:min-h-[32rem]">
            <Image
              src={activeImage}
              alt={productImageAlt(product.name)}
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
          {thumbs.length > 1 && (
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
                  <Image
                    src={src}
                    alt={productImageAlt(product.name)}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6">
          <MotionReveal
            variant="right"
            className="sticky top-24 rounded-[1.5rem] border border-farm-green-dark/8 bg-farm-warm p-5 shadow-soft sm:rounded-[2rem] md:p-8"
          >
            <p className="text-eyebrow text-farm-green">{category?.name || "Product"}</p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-heading text-[1.65rem] leading-tight text-farm-green-dark sm:text-3xl md:text-4xl">
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
              {outOfStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-farm-sage/15 px-3 py-1.5 text-sm font-semibold text-farm-sage">
                  <CircleAlert className="size-4" />
                  Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-farm-green/10 px-3 py-1.5 text-sm font-semibold text-farm-green">
                  <Check className="size-4" />
                  In Stock
                </span>
              )}
            </div>

            <p className="mt-5 text-farm-sage">
              {product.description || GENERIC_DESCRIPTION}
            </p>

            {!outOfStock && (
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
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Pressable
                as="a"
                href={getProductOrderUrl(product, qty)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-farm-green text-button font-semibold text-farm-green-light"
              >
                <MessageCircle className="size-4" />
                {outOfStock ? "Ask availability on WhatsApp" : "Order on WhatsApp"}
              </Pressable>
              {!outOfStock && (
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
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-farm-sage">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-farm-green" />
                Direct Farm Billing
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="size-4 text-farm-green" />
                Verified Karur dispatch
              </span>
            </div>
          </MotionReveal>
        </div>
      </div>

      <ProductOverview product={product} guide={guide} />

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
        <div className="relative min-h-[12rem] rounded-[1.5rem] border border-farm-green-dark/8 bg-farm-warm p-5 md:rounded-[2rem] md:p-8 lg:col-span-9">
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
              {originNotes.map((item, i) => (
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
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} compact />
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
          <div className="min-w-0">
            <p className="font-heading text-xl text-farm-green">
              {formatPrice(outOfStock ? product.price : lineTotal)}
            </p>
            <p className="text-xs text-farm-sage">
              {outOfStock ? "Out of Stock" : `Qty ${qty}`}
            </p>
          </div>
          <a
            href={getProductOrderUrl(product, qty)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-farm-green px-4 text-sm font-semibold text-farm-green-light sm:px-5"
          >
            <MessageCircle className="size-4" />
            {outOfStock ? "Ask availability" : "WhatsApp"}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
