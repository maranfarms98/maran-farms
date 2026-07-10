"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ProductBadge } from "@/components/ui/product-badge";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/hooks/use-favorites";
import { formatMinOrder, formatPrice } from "@/lib/format";
import { getCategoryById } from "@/data/categories";
import { useMotionAllowed } from "@/components/motion/motion-provider";

export function ProductCard({ product, compact = false, teaser = false }) {
  const { getQuantity, setQuantity, addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const motionAllowed = useMotionAllowed();
  const qty = getQuantity(product.id);
  const category = getCategoryById(product.categoryId);
  const inCart = qty > 0;
  const fav = isFavorite(product.id);
  const light = teaser || compact;

  return (
    <motion.article
      layout
      whileHover={
        motionAllowed
          ? { y: -4, boxShadow: "0 24px 60px rgba(45, 90, 61, 0.12)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-farm-warm ${
        inCart && !teaser
          ? "shadow-elevated ring-2 ring-farm-accent"
          : "shadow-soft"
      }`}
    >
      <Link href={`/product/${product.id}`} className="relative block">
        <div
          className={`relative overflow-hidden ${light ? "aspect-square" : "aspect-[4/5]"}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 50vw, 25vw"
          />
          {!teaser && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-farm-green-dark/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              {!compact && (
                <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 rounded-full bg-white px-4 py-2 text-xs font-semibold text-farm-green opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  Explore Details
                </span>
              )}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                <ProductBadge type={product.badge} />
                {product.minOrder > 1 && (
                  <span className="rounded-full bg-farm-green/90 px-2.5 py-1 text-[0.65rem] font-semibold text-farm-green-light">
                    {formatMinOrder(product)}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </Link>

      {!teaser && (
        <motion.button
          type="button"
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          whileTap={motionAllowed ? { scale: 0.88 } : undefined}
          animate={fav ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          className={`focus-ring absolute top-3 right-3 z-20 flex size-11 items-center justify-center rounded-full ${
            fav
              ? "bg-farm-accent text-white"
              : "bg-white/85 text-farm-green backdrop-blur-sm hover:bg-farm-accent hover:text-white"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product);
          }}
        >
          <Heart className={`size-4 ${fav ? "fill-current" : ""}`} />
        </motion.button>
      )}

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={`/product/${product.id}`} className="flex-1">
          {!teaser && (
            <p className="text-eyebrow mb-1 text-[0.6rem]">
              {category?.name || "Catalog"}
            </p>
          )}
          <h3 className="font-heading text-card-title font-semibold text-farm-green-dark">
            {product.name}
          </h3>
          {!light && (
            <TamilCaption className="mt-0.5">{product.tamilName}</TamilCaption>
          )}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-heading text-lg font-semibold text-farm-green">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-farm-sage">{product.unit}</span>
          </div>
          {!light && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-farm-accent-light px-2 py-0.5 text-xs text-farm-green-dark">
              <Star className="size-3 fill-farm-ochre text-farm-ochre" />
              4.9
            </div>
          )}
        </Link>

        {teaser ? (
          <Link
            href={`/product/${product.id}`}
            className="mt-3 inline-flex text-sm font-semibold text-farm-accent transition group-hover:gap-2"
          >
            View details
          </Link>
        ) : (
          <div className="mt-3">
            <QuantityStepper
              compact
              value={qty}
              min={product.minOrder}
              onChange={(n) => {
                if (n === 0) setQuantity(product.id, 0);
                else if (qty === 0) addItem(product.id, n);
                else setQuantity(product.id, n);
              }}
            />
          </div>
        )}
      </div>
    </motion.article>
  );
}
