"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { formatPrice } from "@/lib/format";
import { Spinner } from "@/components/ui/spinner";

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
    <div className="min-h-screen bg-farm-warm px-4 pt-28 pb-16 md:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="focus-ring mb-6 inline-flex items-center gap-2 text-sm font-medium text-farm-green hover:text-farm-accent"
        >
          <ArrowLeft className="size-4" />
          Back to shopping
        </Link>

        <div className="rounded-[2rem] border border-farm-green-dark/8 bg-farm-cream p-6 shadow-soft md:p-8">
          <h1 className="font-heading text-3xl text-farm-green-dark">Checkout</h1>
          <p className="mt-1 text-sm text-farm-sage">
            {user?.name} · +91 {user?.phone}
          </p>

          <div className="mt-6 rounded-2xl border border-farm-green-dark/8 bg-farm-warm p-4">
            <p className="mb-3 text-sm font-semibold text-farm-green-dark">Order Summary</p>
            <ul className="space-y-2">
              {lines.map((l) => (
                <li key={l.product.id} className="flex justify-between text-sm text-farm-sage">
                  <span>{l.product.name} × {l.quantity}</span>
                  <span className="tabular-nums text-farm-green-dark">{formatPrice(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-farm-green-dark/8 pt-3 font-semibold text-farm-green-dark">
              <span>Total</span>
              <span className="font-heading text-xl">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-farm-green-dark" htmlFor="checkout-address">
              Delivery Address
            </label>
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

          <button
            type="button"
            disabled={loading}
            onClick={handlePay}
            className="focus-ring mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-farm-green text-button font-semibold text-farm-green-light transition hover:bg-farm-green-dark disabled:opacity-60"
          >
            {loading && <Spinner className="size-4" />}
            {loading ? "Opening payment…" : `Pay ${formatPrice(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
