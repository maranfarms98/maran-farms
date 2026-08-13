"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { useToast } from "@/context/toast-context";
import { GENERIC_DESCRIPTION } from "@/data/constants";
import { formatMinOrder, formatPrice } from "@/lib/format";
import { getProductOrderUrl } from "@/lib/whatsapp";
import { ProductCardBazaar } from "@/components/theme-bazaar/shared/product-card-bazaar";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";
import { BazaarQtyStepper } from "@/components/theme-bazaar/shared/bazaar-qty";

function stockMeta(product, t) {
  if (product.inStock === false) {
    return { text: t.outOfStock, ok: false, className: "bg-bazaar-ink/80 text-white" };
  }
  if (product.trackInventory && product.stockQty > 0 && product.stockQty <= 10) {
    return {
      text: `${t.limitedStock} · ${product.stockQty}`,
      ok: true,
      className: "bg-amber-600 text-white",
    };
  }
  return { text: t.inStock, ok: true, className: "bg-bazaar-wa/15 text-bazaar-wa" };
}

export function ProductPageBazaar({ product, category, related, content }) {
  const { getQuantity, addItem, setOrderDrawerOpen } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const { t } = useBazaarLang();
  const cartQty = getQuantity(product.id);
  const min = product.minOrder || 1;
  const [qty, setQty] = useState(cartQty || min);
  const inCart = cartQty > 0;
  const out = product.inStock === false;
  const stock = stockMeta(product, t);
  const fav = isFavorite(product.id);
  const lineTotal = product.price * qty;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied");
    } catch {
      toast("Unable to copy");
    }
  };

  const handleAdd = () => {
    if (out) return;
    const next = Math.max(qty, min);
    addItem(product, next);
    setOrderDrawerOpen(true);
  };

  return (
    <div className="bg-bazaar-paper pb-28 pt-20">
      <div className="bazaar-container">
        <Link
          href={`/category/${category?.slug || ""}`}
          className="focus-ring mb-6 inline-flex items-center gap-2 text-sm font-medium text-bazaar-muted"
        >
          <ArrowLeft className="size-4" />
          {category?.name || "Catalog"}
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-bazaar-sand lg:aspect-auto lg:min-h-[28rem]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-bazaar-wa uppercase">
              {category?.name}
            </p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-heading text-3xl font-semibold text-bazaar-ink md:text-4xl">
                {product.name}
              </h1>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Favorite"
                  onClick={() => toggleFavorite(product)}
                  className={`focus-ring flex size-11 items-center justify-center rounded-full ${
                    fav ? "bg-bazaar-wa text-white" : "bg-bazaar-sand text-bazaar-ink"
                  }`}
                >
                  <Heart className={`size-4 ${fav ? "fill-current" : ""}`} />
                </button>
                <button
                  type="button"
                  aria-label="Share"
                  onClick={share}
                  className="focus-ring flex size-11 items-center justify-center rounded-full bg-bazaar-sand text-bazaar-ink"
                >
                  <Share2 className="size-4" />
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-bazaar-muted" lang="ta">
              {product.tamilName}
            </p>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-bazaar-ink/10 bg-white p-4">
              <div>
                <p className="font-heading text-3xl text-bazaar-ink">{formatPrice(product.price)}</p>
                <p className="text-sm text-bazaar-muted">{product.unit}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${stock.className}`}
              >
                {stock.ok && <Check className="size-4" />}
                {stock.text}
              </span>
            </div>

            <p className="mt-5 text-bazaar-muted">
              {product.description || GENERIC_DESCRIPTION}
            </p>

            {min > 1 && (
              <p className="mt-3 text-sm text-bazaar-muted">
                {t.minOrder}: {formatMinOrder(product).replace("Min ", "")}
              </p>
            )}

            <div className="mt-6">
              <BazaarQtyStepper
                value={qty}
                min={min}
                disabled={out}
                onChange={(n) => setQty(Math.max(min, n))}
              />
            </div>

            {/* Primary: add to bag → review. WhatsApp secondary */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={out}
                onClick={handleAdd}
                className="focus-ring inline-flex h-12 flex-1 items-center justify-center rounded-full bg-bazaar-wa text-sm font-semibold text-white hover:bg-bazaar-wa-bright disabled:opacity-50"
              >
                {inCart ? t.reviewBag : t.addToBag}
              </button>
              <a
                href={getProductOrderUrl(product, qty)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-bazaar-ink/15 text-sm font-semibold text-bazaar-ink"
              >
                <MessageCircle className="size-4" />
                {t.orderWhatsApp}
              </a>
            </div>

            {content?.specs?.length > 0 && (
              <dl className="mt-10 divide-y divide-bazaar-ink/10 rounded-2xl border border-bazaar-ink/10 bg-white px-4">
                {content.specs.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="font-medium text-bazaar-ink">{row.label}</dt>
                    <dd className="text-bazaar-muted">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-2xl text-bazaar-ink">Related</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {related.map((p) => (
                <ProductCardBazaar key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky: single primary action */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-bazaar-ink/10 bg-bazaar-paper/95 px-4 py-3 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="font-heading text-lg text-bazaar-ink">{formatPrice(lineTotal)}</p>
            <p className="text-xs text-bazaar-muted">Qty {qty}</p>
          </div>
          <button
            type="button"
            disabled={out}
            onClick={handleAdd}
            className="focus-ring ml-auto inline-flex h-12 flex-1 items-center justify-center rounded-full bg-bazaar-wa text-sm font-semibold text-white disabled:opacity-50"
          >
            {inCart ? t.reviewBag : t.addToBag}
          </button>
        </div>
      </div>
    </div>
  );
}
