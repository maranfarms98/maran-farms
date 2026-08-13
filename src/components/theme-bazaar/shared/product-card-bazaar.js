"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { formatMinOrder, formatPrice } from "@/lib/format";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";
import { BazaarQtyStepper } from "@/components/theme-bazaar/shared/bazaar-qty";

function stockLabel(product, t) {
  if (product.inStock === false) return { text: t.outOfStock, tone: "bad" };
  if (product.trackInventory && product.stockQty > 0 && product.stockQty <= 10) {
    return { text: t.limitedStock, tone: "warn" };
  }
  return { text: t.inStock, tone: "ok" };
}

export function ProductCardBazaar({ product }) {
  const { getQuantity, setQuantity, addItem, setOrderDrawerOpen } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useBazaarLang();
  const qty = getQuantity(product.id);
  const inCart = qty > 0;
  const fav = isFavorite(product.id);
  const out = product.inStock === false;
  const stock = stockLabel(product, t);
  const min = product.minOrder || 1;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-bazaar-ink/10 bg-white">
      <div className="relative">
        <Link href={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-bazaar-sand">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        </Link>
        <span
          className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold ${
            stock.tone === "ok"
              ? "bg-bazaar-wa/90 text-white"
              : stock.tone === "warn"
                ? "bg-amber-600 text-white"
                : "bg-bazaar-ink/80 text-white"
          }`}
        >
          {stock.text}
        </span>
        <button
          type="button"
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          className={`focus-ring absolute top-3 right-3 flex size-10 items-center justify-center rounded-full ${
            fav ? "bg-bazaar-wa text-white" : "bg-white/90 text-bazaar-ink"
          }`}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product);
          }}
        >
          <Heart className={`size-4 ${fav ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <Link href={`/product/${product.id}`} className="flex-1">
          <h3 className="font-heading text-lg leading-snug text-bazaar-ink">{product.name}</h3>
          <p className="mt-0.5 text-xs text-bazaar-muted" lang="ta">
            {product.tamilName}
          </p>
          <p className="mt-2 font-semibold text-bazaar-soil">
            {formatPrice(product.price)}
            <span className="ml-1 text-xs font-normal text-bazaar-muted">{product.unit}</span>
          </p>
          {min > 1 && (
            <p className="mt-1 text-xs text-bazaar-muted">
              {t.minOrder}: {formatMinOrder(product).replace("Min ", "")}
            </p>
          )}
        </Link>

        <div className="mt-3">
          {out ? (
            <button
              type="button"
              disabled
              className="h-11 w-full rounded-xl bg-bazaar-sand text-sm font-semibold text-bazaar-muted"
            >
              {t.outOfStock}
            </button>
          ) : inCart ? (
            <div className="flex items-center justify-between gap-2">
              <BazaarQtyStepper
                value={qty}
                min={min}
                onChange={(n) => setQuantity(product.id, n < min ? 0 : n)}
              />
              <button
                type="button"
                onClick={() => setOrderDrawerOpen(true)}
                className="focus-ring h-11 flex-1 rounded-xl bg-bazaar-ink px-3 text-sm font-semibold text-bazaar-paper"
              >
                {t.reviewBag}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                addItem(product, min);
                setOrderDrawerOpen(true);
              }}
              className="focus-ring h-11 w-full rounded-xl bg-bazaar-wa text-sm font-semibold text-white hover:bg-bazaar-wa-bright"
            >
              {t.addToBag}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
