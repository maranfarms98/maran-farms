"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { formatMinOrder, formatPrice } from "@/lib/format";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { TiltCard } from "@/components/theme-canopy/shared/tilt-card";

export function ProductCardCanopy({ product, teaser = false }) {
  const { getQuantity, setQuantity, addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const motionAllowed = useMotionAllowed();
  const qty = getQuantity(product.id);
  const inCart = qty > 0;
  const fav = isFavorite(product.id);
  const outOfStock = product.inStock === false;

  return (
    <TiltCard
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-canopy-deep/60 backdrop-blur-sm ${
        inCart && !teaser ? "border-canopy-gold shadow-elevated" : "border-canopy-leaf-light/15 shadow-soft"
      }`}
    >
      <Link href={`/product/${product.id}`} className="relative block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
            sizes="(max-width:768px) 50vw, 25vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canopy-forest/80 via-transparent to-transparent" />
          {outOfStock && (
            <span className="absolute top-3 left-3 rounded-full bg-canopy-forest/90 px-2.5 py-1 text-[0.65rem] font-semibold text-canopy-mist">
              Out of Stock
            </span>
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
              ? "bg-canopy-gold text-canopy-forest"
              : "bg-canopy-forest/70 text-canopy-mist backdrop-blur-sm hover:bg-canopy-gold hover:text-canopy-forest"
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

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.id}`} className="flex-1">
          <h3 className="font-heading text-card-title font-semibold text-canopy-mist">{product.name}</h3>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-heading text-lg font-semibold text-canopy-leaf-light">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-canopy-mist/60">{product.unit}</span>
          </div>
          {!teaser && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-canopy-moss/30 px-2 py-0.5 text-xs text-canopy-mist">
              <Star className="size-3 fill-canopy-gold text-canopy-gold" />
              4.9
            </div>
          )}
          {!teaser && product.minOrder > 1 && (
            <p className="mt-1 text-xs text-canopy-gold-light">{formatMinOrder(product)}</p>
          )}
        </Link>

        {teaser ? (
          <Link
            href={`/product/${product.id}`}
            className="mt-3 inline-flex text-sm font-semibold text-canopy-gold-light"
          >
            View details
          </Link>
        ) : outOfStock ? (
          <div className="mt-3 flex h-11 items-center justify-center rounded-full bg-canopy-forest/60 text-sm font-semibold text-canopy-mist/60">
            Out of Stock
          </div>
        ) : (
          <div className="mt-3">
            <QuantityStepper
              compact
              value={qty}
              min={product.minOrder}
              onChange={(n) => {
                if (n === 0) setQuantity(product.id, 0);
                else if (qty === 0) addItem(product, n);
                else setQuantity(product.id, n);
              }}
            />
          </div>
        )}
      </div>
    </TiltCard>
  );
}
