"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { formatPrice } from "@/lib/format";
import { getCartOrderUrl } from "@/lib/whatsapp";
import { Spinner } from "@/components/ui/spinner";
import { FarmPageIntro } from "@/components/ui/farm-page-intro";
import { TamilCaption } from "@/components/ui/tamil-caption";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { user, hydrated: authHydrated } = useAuth();
  const { lines, total, clearCart, hydrated: cartHydrated } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authHydrated) return;
    if (!user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [authHydrated, user, router]);

  useEffect(() => {
    if (!cartHydrated) return;
    if (lines.length === 0) {
      router.replace("/");
    }
  }, [cartHydrated, lines, router]);

  const handlePay = useCallback(async () => {
    setError("");
    if (!address.trim()) return setError("Please enter your delivery address");

    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Check your connection.");
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.product.id,
            quantity: l.quantity,
          })),
          address: address.trim(),
        }),
      });
      const orderData = await res.json();
      if (!res.ok) {
        setError(orderData.error || "Failed to initiate payment");
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Maran Farms",
        description: "Farm fresh order",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: user?.name,
          contact: `+91${user?.phone}`,
        },
        theme: { color: "#15321f" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                dbOrderId: orderData.dbOrderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.verified) {
              toast("Payment verification failed. Contact support.");
              return;
            }

            clearCart();
            toast("Order placed! We'll deliver soon.");
            router.push("/account/orders");
          } catch {
            toast("Something went wrong. Contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [address, lines, user, clearCart, toast, router]);

  if (!authHydrated || !cartHydrated || !user || lines.length === 0) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-farm-warm px-4 pt-28 pb-16 md:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 10% 20%, #15321f 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 80%, #8b5e3c 0%, transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl">
        <Link
          href="/"
          className="focus-ring mb-6 inline-flex items-center gap-2 text-sm font-medium text-farm-green hover:text-farm-accent"
        >
          <ArrowLeft className="size-4" />
          Back to shopping
        </Link>

        <div className="rounded-[2rem] border border-farm-green-dark/8 bg-farm-cream/95 p-6 shadow-soft backdrop-blur-sm md:p-8">
          <FarmPageIntro
            eyebrow="Order"
            title="Checkout"
            tamil="ஆர்டர் உறுதிப்படுத்தல்"
          >
            <p className="mt-3 text-sm text-farm-sage">
              {user?.name} · +91 {user?.phone}
            </p>
          </FarmPageIntro>

          <div className="mt-6 rounded-2xl border border-farm-green-dark/8 bg-farm-warm p-4">
            <p className="mb-1 text-sm font-semibold text-farm-green-dark">
              Order Summary
            </p>
            <TamilCaption className="mb-3">ஆர்டர் விவரம்</TamilCaption>
            <ul className="space-y-2">
              {lines.map((l) => (
                <li
                  key={l.product.id}
                  className="flex justify-between text-sm text-farm-sage"
                >
                  <span>
                    {l.product.name} × {l.quantity}
                  </span>
                  <span className="tabular-nums text-farm-green-dark">
                    {formatPrice(l.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-farm-green-dark/8 pt-3 font-semibold text-farm-green-dark">
              <span>Total</span>
              <span className="font-heading text-xl">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-farm-green-dark"
              htmlFor="checkout-address"
            >
              Delivery address
            </label>
            <TamilCaption className="mb-1">
              கதவு எண், தெரு, கிராமம், மாவட்டம், அஞ்சல் குறியீடு
            </TamilCaption>
            <textarea
              id="checkout-address"
              rows={3}
              placeholder="Door no, street, village, district, PIN code"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-2xl border border-farm-green-dark/15 bg-white p-4 text-sm text-farm-green-dark placeholder:text-farm-sage/60 focus:border-farm-green focus:outline-none"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-farm-accent/10 px-3 py-2 text-sm text-farm-accent-dark">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={loading}
              onClick={handlePay}
              className="focus-ring flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-farm-green text-button font-semibold text-farm-green-light transition hover:bg-farm-green-dark disabled:opacity-60"
            >
              {loading && <Spinner className="size-4" />}
              {loading ? "Opening payment…" : `Pay ${formatPrice(total)}`}
            </button>
            <a
              href={getCartOrderUrl(lines, total)}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full border border-farm-green bg-transparent text-button font-semibold text-farm-green transition hover:bg-farm-green/5"
            >
              <MessageCircle className="size-4" />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
