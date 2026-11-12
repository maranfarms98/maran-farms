"use client";

import { useCallback } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { formatMinOrder, formatPrice } from "@/lib/format";
import { getCartOrderUrl } from "@/lib/whatsapp";
import { Drawer } from "@/components/ui/drawer";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useIsMobile } from "@/hooks/use-media";
import { useMotionAllowed } from "@/components/motion/motion-provider";

export function OrderBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const motionAllowed = useMotionAllowed();
  const isCheckoutFlow =
    pathname?.startsWith("/checkout") || pathname?.startsWith("/login");

  const {
    lines,
    uniqueCount,
    total,
    hasMinViolations,
    orderDrawerOpen,
    setOrderDrawerOpen,
    setQuantity,
    removeItem,
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

  if (isCheckoutFlow) return null;

  return (
    <>
      <Drawer
        open={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        placement={isMobile ? "bottom" : "right"}
      >
        <div className="flex justify-center pt-3 md:hidden" aria-hidden>
          <span className="h-1.5 w-10 rounded-full bg-farm-green-dark/15" />
        </div>
        <div className="flex items-start justify-between gap-3 border-b border-farm-green-dark/8 px-5 py-4">
          <div>
            <h2 className="font-heading text-2xl text-farm-green-dark">
              Your cart
            </h2>
            <p className="text-sm text-farm-sage">
              {lines.length === 0
                ? "Nothing added yet"
                : `${uniqueCount} item${uniqueCount === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            className="focus-ring flex size-11 items-center justify-center rounded-full text-farm-green hover:bg-farm-accent-light"
            onClick={() => setOrderDrawerOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-farm-green-dark/15 bg-farm-warm px-6 py-12 text-center">
              <ShoppingBag className="mx-auto size-8 text-farm-sage" />
              <h3 className="font-heading mt-3 text-xl text-farm-green-dark">
                Your cart is empty
              </h3>
              <p className="mt-2 text-sm text-farm-sage">
                Add fodder varieties, chicks, or pet breeds to start.
              </p>
            </div>
          ) : (
            <>
              {hasMinViolations && (
                <div className="mb-4 rounded-2xl bg-farm-accent/10 px-4 py-3 text-sm text-farm-accent-dark">
                  Some items are below their minimum order quantity. Adjust
                  quantities before ordering.
                </div>
              )}
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <motion.li
                      key={line.product.id}
                      layout
                      initial={motionAllowed ? { opacity: 0, y: 10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      className="rounded-2xl border border-farm-green-dark/8 bg-farm-warm p-3"
                    >
                      <div className="flex gap-3">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-white">
                          {line.product.image ? (
                            <Image
                              src={line.product.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <ShoppingBag className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-farm-sage" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-farm-green-dark">
                              {line.product.name}
                            </p>
                            <button
                              type="button"
                              aria-label={`Remove ${line.product.name}`}
                              className="focus-ring flex size-8 shrink-0 items-center justify-center rounded-full text-farm-sage hover:bg-white hover:text-farm-accent"
                              onClick={() => removeItem(line.product.id)}
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                          <p className="text-sm text-farm-sage">
                            {formatPrice(line.product.price)} each
                          </p>
                          {line.belowMin && (
                            <span className="mt-1 inline-flex rounded-full bg-farm-accent/15 px-2.5 py-1 text-xs font-semibold text-farm-accent">
                              {formatMinOrder(line.product)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <QuantityStepper
                          value={line.quantity}
                          onChange={(n) => setQuantity(line.product.id, n)}
                        />
                        <p className="font-semibold text-farm-green-dark tabular-nums">
                          {formatPrice(line.product.price * line.quantity)}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-farm-green-dark/8 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-farm-sage">Total</span>
              <span className="font-heading text-2xl text-farm-green">
                {formatPrice(total)}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={getCartOrderUrl(lines, total)}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex h-14 w-full items-center justify-center gap-2 rounded-full bg-farm-green text-button font-semibold text-farm-green-light transition hover:bg-farm-green-dark"
              >
                <MessageCircle className="size-4" />
                Order on WhatsApp
              </a>
              <button
                type="button"
                onClick={handleOrderNow}
                className="focus-ring flex h-14 w-full items-center justify-center rounded-full border border-farm-green-dark/15 bg-farm-cream text-button font-semibold text-farm-green-dark transition hover:bg-farm-warm"
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
