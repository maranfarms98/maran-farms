"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { formatMinOrder, formatPrice } from "@/lib/format";
import { getCartOrderUrl } from "@/lib/whatsapp";
import { Drawer } from "@/components/ui/drawer";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useIsMobile } from "@/hooks/use-media";
import { useMotionAllowed } from "@/components/motion/motion-provider";

export function OrderBarCanopy() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const motionAllowed = useMotionAllowed();
  const isProductPage = pathname?.startsWith("/product/");
  const isCheckoutFlow = pathname?.startsWith("/checkout") || pathname?.startsWith("/login");
  const hideChrome = (isMobile && isProductPage) || isCheckoutFlow;

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

  const handleOrderNow = useCallback(() => {
    setOrderDrawerOpen(false);
    if (!user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  }, [user, setOrderDrawerOpen, router]);

  if (!hydrated || itemCount === 0 || hideChrome) return null;

  return (
    <>
      <motion.div
        initial={motionAllowed ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        className="fixed z-40 flex items-center gap-2 max-md:bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] max-md:left-1/2 max-md:-translate-x-1/2 md:right-6 md:bottom-6"
      >
        <motion.button
          type="button"
          onClick={() => setOrderDrawerOpen(true)}
          whileHover={motionAllowed ? { scale: 1.03 } : undefined}
          whileTap={motionAllowed ? { scale: 0.97 } : undefined}
          className="focus-ring inline-flex h-14 items-center gap-3 rounded-full bg-canopy-forest px-5 text-canopy-mist shadow-elevated ring-1 ring-canopy-leaf-light/20"
        >
          <span className="relative">
            <ShoppingBag className="size-5" />
            <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-canopy-gold text-[0.65rem] font-bold text-canopy-forest">
              {uniqueCount}
            </span>
          </span>
          <span className="font-semibold">Order</span>
          <span className="tabular-nums text-canopy-gold-light">{formatPrice(total)}</span>
          <ChevronRight className="size-4 opacity-70" />
        </motion.button>
        <motion.a
          href={getCartOrderUrl(lines, total)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on WhatsApp"
          whileHover={motionAllowed ? { scale: 1.06 } : undefined}
          whileTap={motionAllowed ? { scale: 0.94 } : undefined}
          className="focus-ring flex size-14 items-center justify-center rounded-full bg-canopy-leaf text-canopy-forest shadow-elevated"
        >
          <MessageCircle className="size-6" />
        </motion.a>
      </motion.div>

      <Drawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} placement={isMobile ? "bottom" : "right"}>
        <div className="flex items-start justify-between gap-3 border-b border-canopy-leaf-light/15 bg-canopy-deep p-5">
          <div>
            <h2 className="font-heading text-2xl text-canopy-mist">Your Order</h2>
            <p className="text-sm text-canopy-mist/70">
              {uniqueCount} unique item{uniqueCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Clear all"
              className="focus-ring flex size-11 items-center justify-center rounded-full text-canopy-mist/70 hover:bg-canopy-moss/30 hover:text-canopy-gold-light"
              onClick={clearCart}
            >
              <Trash2 className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Close"
              className="focus-ring flex size-11 items-center justify-center rounded-full text-canopy-mist hover:bg-canopy-moss/30"
              onClick={() => setOrderDrawerOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-canopy-deep p-5">
          {lines.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-canopy-leaf-light/20 bg-canopy-forest/40 px-6 py-12 text-center">
              <h3 className="font-heading text-xl text-canopy-mist">Your Order is Empty</h3>
              <p className="mt-2 text-sm text-canopy-mist/70">
                Add fodder varieties, chicks, or pet breeds to start.
              </p>
            </div>
          ) : (
            <>
              {hasMinViolations && (
                <div className="mb-4 rounded-2xl bg-canopy-gold/15 px-4 py-3 text-sm text-canopy-gold-light">
                  Some items are below their minimum order quantity. Adjust
                  quantities before ordering.
                </div>
              )}
              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <motion.li
                      key={line.product.id}
                      layout
                      initial={motionAllowed ? { opacity: 0, y: 10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      className="rounded-2xl border border-canopy-leaf-light/15 bg-canopy-forest/40 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-canopy-mist">{line.product.name}</p>
                          <p className="text-sm text-canopy-mist/70">
                            {formatPrice(line.product.price)} × {line.quantity}
                          </p>
                          {line.belowMin && (
                            <span className="mt-2 inline-flex rounded-full bg-canopy-gold/20 px-2.5 py-1 text-xs font-semibold text-canopy-gold-light">
                              {formatMinOrder(line.product)}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${line.product.name}`}
                          className="focus-ring flex size-10 items-center justify-center rounded-full text-canopy-mist/70 hover:bg-canopy-moss/30 hover:text-canopy-gold-light"
                          onClick={() => removeItem(line.product.id)}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="mt-3">
                        <QuantityStepper value={line.quantity} onChange={(n) => setQuantity(line.product.id, n)} />
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-canopy-leaf-light/15 bg-canopy-deep p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-canopy-mist/70">Total</span>
              <span className="font-heading text-2xl text-canopy-leaf-light">{formatPrice(total)}</span>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={getCartOrderUrl(lines, total)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex h-14 w-full items-center justify-center gap-2 rounded-full bg-canopy-leaf text-button font-semibold text-canopy-forest transition hover:bg-canopy-leaf-light"
              >
                <MessageCircle className="size-4" />
                Order on WhatsApp
              </a>
              <button
                type="button"
                onClick={handleOrderNow}
                className="focus-ring flex h-14 w-full items-center justify-center rounded-full border border-canopy-leaf-light/20 bg-canopy-forest/40 text-button font-semibold text-canopy-mist transition hover:bg-canopy-forest/60"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
