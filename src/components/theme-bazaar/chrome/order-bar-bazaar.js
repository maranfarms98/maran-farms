"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { formatMinOrder, formatPrice } from "@/lib/format";
import { getCartOrderUrl } from "@/lib/whatsapp";
import { Drawer } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-media";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";
import { BazaarQtyStepper } from "@/components/theme-bazaar/shared/bazaar-qty";

export function OrderBarBazaar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { t } = useBazaarLang();
  const hide =
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/product/");

  const {
    lines,
    itemCount,
    uniqueCount,
    total,
    hasMinViolations,
    orderDrawerOpen,
    setOrderDrawerOpen,
    setQuantity,
    removeItem,
    clearCart,
    hydrated,
  } = useCart();
  const { user } = useAuth();

  const handleCheckout = useCallback(() => {
    setOrderDrawerOpen(false);
    if (!user) router.push("/login?redirect=/checkout");
    else router.push("/checkout");
  }, [user, setOrderDrawerOpen, router]);

  if (!hydrated || itemCount === 0 || hide) return null;

  return (
    <>
      <div
        className="animate-bazaar-bar fixed inset-x-0 bottom-0 z-40 border-t border-bazaar-ink/10 bg-bazaar-paper/95 px-4 py-3 backdrop-blur-md md:inset-x-auto md:right-6 md:bottom-6 md:left-auto md:w-auto md:rounded-2xl md:border md:px-4 md:shadow-elevated"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={() => setOrderDrawerOpen(true)}
          className="focus-ring flex h-12 w-full items-center justify-between gap-3 rounded-xl bg-bazaar-ink px-4 text-bazaar-paper md:w-auto md:min-w-[280px]"
        >
          <span className="inline-flex items-center gap-2 font-semibold">
            <ShoppingBag className="size-4" />
            {t.reviewBag}
            <span className="rounded-full bg-bazaar-wa px-2 py-0.5 text-xs">{uniqueCount}</span>
          </span>
          <span className="tabular-nums font-semibold">{formatPrice(total)}</span>
        </button>
      </div>

      <Drawer
        open={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        placement={isMobile ? "bottom" : "right"}
      >
        <div className="flex items-start justify-between gap-3 border-b border-bazaar-ink/10 bg-bazaar-paper p-5">
          <div>
            <h2 className="font-heading text-2xl text-bazaar-ink">{t.bag}</h2>
            <p className="text-sm text-bazaar-muted">
              {uniqueCount} item{uniqueCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label={t.clearBag}
              className="focus-ring flex size-10 items-center justify-center rounded-full text-bazaar-muted hover:bg-bazaar-sand"
              onClick={clearCart}
            >
              <Trash2 className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Close"
              className="focus-ring flex size-10 items-center justify-center rounded-full text-bazaar-ink hover:bg-bazaar-sand"
              onClick={() => setOrderDrawerOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-bazaar-paper p-5">
          {lines.length === 0 ? (
            <p className="py-12 text-center text-bazaar-muted">{t.emptyBag}</p>
          ) : (
            <>
              {hasMinViolations && (
                <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Some items are below minimum order quantity.
                </div>
              )}
              <ul className="space-y-3">
                {lines.map((line) => (
                  <li
                    key={line.product.id}
                    className="rounded-2xl border border-bazaar-ink/10 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-bazaar-ink">{line.product.name}</p>
                        <p className="text-sm text-bazaar-muted">
                          {formatPrice(line.product.price)} × {line.quantity}
                        </p>
                        {line.belowMin && (
                          <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
                            {formatMinOrder(line.product)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${line.product.name}`}
                        className="focus-ring flex size-9 items-center justify-center rounded-full text-bazaar-muted hover:bg-bazaar-sand"
                        onClick={() => removeItem(line.product.id)}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="mt-3">
                      <BazaarQtyStepper
                        value={line.quantity}
                        min={line.product.minOrder || 1}
                        onChange={(n) => {
                          const min = line.product.minOrder || 1;
                          setQuantity(line.product.id, n < min ? 0 : n);
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-bazaar-ink/10 bg-bazaar-paper p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-bazaar-muted">{t.total}</span>
              <span className="font-heading text-2xl text-bazaar-ink">{formatPrice(total)}</span>
            </div>
            {/* Single primary path: checkout; WhatsApp secondary */}
            <button
              type="button"
              disabled={hasMinViolations}
              onClick={handleCheckout}
              className="focus-ring flex h-14 w-full items-center justify-center rounded-full bg-bazaar-wa text-button font-semibold text-white transition hover:bg-bazaar-wa-bright disabled:opacity-50"
            >
              {t.continueCheckout}
            </button>
            <a
              href={getCartOrderUrl(lines, total)}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-bazaar-ink/15 text-sm font-semibold text-bazaar-ink"
            >
              <MessageCircle className="size-4" />
              {t.orderWhatsApp}
            </a>
          </div>
        )}
      </Drawer>
    </>
  );
}
