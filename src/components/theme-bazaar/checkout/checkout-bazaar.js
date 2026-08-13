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
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";
import {
  BAZAAR_CORE_DISTRICTS,
  BAZAAR_DISTRICTS,
} from "@/components/theme-bazaar/shared/bazaar-data";

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

export function CheckoutBazaar() {
  const { user, hydrated: authHydrated } = useAuth();
  const { lines, total, clearCart, hydrated: cartHydrated } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useBazaarLang();

  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [district, setDistrict] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pinOk = /^\d{6}$/.test(pin.trim());
  const inCore = district && BAZAAR_CORE_DISTRICTS.has(district);
  const formReady = address.trim().length >= 8 && pinOk && district;

  useEffect(() => {
    if (!authHydrated) return;
    if (!user) router.replace("/login?redirect=/checkout");
  }, [authHydrated, user, router]);

  useEffect(() => {
    if (!cartHydrated) return;
    if (lines.length === 0) router.replace("/");
  }, [cartHydrated, lines, router]);

  const fullAddress = [
    address.trim(),
    district && district !== "Other" ? district : null,
    pin.trim() ? `PIN ${pin.trim()}` : null,
    notes.trim() ? `Notes: ${notes.trim()}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const handlePay = useCallback(async () => {
    setError("");
    if (!formReady) {
      setError("Enter address, 6-digit PIN, and district");
      return;
    }

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
          address: fullAddress,
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
        theme: { color: "#0d6b45" },
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
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formReady, fullAddress, lines, user, clearCart, toast, router]);

  if (!authHydrated || !cartHydrated || !user || lines.length === 0) return null;

  return (
    <div className="theme-bazaar min-h-screen bg-bazaar-paper px-4 pt-24 pb-16 md:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="focus-ring mb-6 inline-flex items-center gap-2 text-sm font-medium text-bazaar-muted"
        >
          <ArrowLeft className="size-4" />
          Back to shopping
        </Link>

        <div className="rounded-2xl border border-bazaar-ink/10 bg-white p-6 md:p-8">
          <h1 className="font-heading text-3xl font-semibold text-bazaar-ink">Checkout</h1>
          <p className="mt-2 text-sm text-bazaar-muted">
            {user?.name} · +91 {user?.phone}
          </p>

          <ul className="mt-6 space-y-2 rounded-xl bg-bazaar-highlight p-4">
            {lines.map((l) => (
              <li key={l.product.id} className="flex justify-between text-sm">
                <span>
                  {l.product.name} × {l.quantity}
                </span>
                <span className="tabular-nums font-medium">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
            <li className="flex justify-between border-t border-bazaar-ink/10 pt-3 font-semibold">
              <span>{t.total}</span>
              <span className="font-heading text-xl">{formatPrice(total)}</span>
            </li>
          </ul>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bz-pin" className="text-sm font-medium">
                {t.pinLabel}
              </label>
              <input
                id="bz-pin"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="641001"
                className="h-11 rounded-xl border border-bazaar-ink/15 px-3 text-sm outline-none focus:border-bazaar-wa"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bz-district" className="text-sm font-medium">
                {t.districtLabel}
              </label>
              <select
                id="bz-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="h-11 rounded-xl border border-bazaar-ink/15 bg-white px-3 text-sm outline-none focus:border-bazaar-wa"
              >
                <option value="">Select</option>
                {BAZAAR_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {district && (
            <p
              className={`mt-3 text-sm ${
                inCore ? "text-bazaar-wa" : "text-amber-800"
              }`}
            >
              {inCore ? t.deliveryCheck : t.outsideArea}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-1.5">
            <label htmlFor="bz-address" className="text-sm font-medium">
              {t.addressLabel}
            </label>
            <textarea
              id="bz-address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Door no, street, village"
              className="rounded-xl border border-bazaar-ink/15 p-3 text-sm outline-none focus:border-bazaar-wa"
            />
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <label htmlFor="bz-notes" className="text-sm font-medium">
              {t.notesLabel}
            </label>
            <input
              id="bz-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Landmark, preferred time…"
              className="h-11 rounded-xl border border-bazaar-ink/15 px-3 text-sm outline-none focus:border-bazaar-wa"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              disabled={loading || !formReady}
              onClick={handlePay}
              className="focus-ring flex h-14 items-center justify-center gap-2 rounded-full bg-bazaar-wa text-sm font-semibold text-white hover:bg-bazaar-wa-bright disabled:opacity-50"
            >
              {loading && <Spinner className="size-4" />}
              {loading ? "Opening payment…" : `${t.continueCheckout} · ${formatPrice(total)}`}
            </button>
            <a
              href={getCartOrderUrl(lines, total)}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full border border-bazaar-ink/15 text-sm font-semibold"
            >
              <MessageCircle className="size-4" />
              {t.orderWhatsApp}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
