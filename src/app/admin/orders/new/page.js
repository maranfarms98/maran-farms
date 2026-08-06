"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Search } from "lucide-react";
import { formatPrice } from "@/lib/format";
import {
  PHONE_PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  defaultPaidNow,
} from "@/lib/orders/payment-methods";
import { Spinner } from "@/components/ui/spinner";

export default function AdminNewPhoneOrderPage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [phone, setPhone] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);
  const [existingCustomer, setExistingCustomer] = useState(null);
  const [name, setName] = useState("");

  const [productQuery, setProductQuery] = useState("");
  const [lines, setLines] = useState([]); // { productId, name, price, unit, quantity, stockQty, trackInventory }

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paidNow, setPaidNow] = useState(true);
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch("/api/admin/products?pageSize=500");
        const data = await res.json();
        if (!cancelled) setProducts(data.products || []);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedPhone = phone.replace(/\D/g, "").slice(0, 10);

  const lookupCustomer = useCallback(async () => {
    if (normalizedPhone.length !== 10) {
      setError("Enter a 10-digit phone number");
      return;
    }
    setLookingUp(true);
    setError("");
    setLookupDone(false);
    setExistingCustomer(null);
    try {
      const res = await fetch(
        `/api/admin/customers/by-phone?phone=${encodeURIComponent(normalizedPhone)}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Lookup failed");
        return;
      }
      setLookupDone(true);
      if (data.found) {
        setExistingCustomer(data.profile);
        setName(data.profile.name);
      } else {
        setExistingCustomer(null);
        setName("");
      }
    } finally {
      setLookingUp(false);
    }
  }, [normalizedPhone]);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    const selected = new Set(lines.map((l) => l.productId));
    return products
      .filter((p) => !selected.has(p.id))
      .filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          (p.tamil_name || "").toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
        );
      })
      .slice(0, 12);
  }, [products, productQuery, lines]);

  const addProduct = (p) => {
    setLines((prev) => [
      ...prev,
      {
        productId: p.id,
        name: p.name,
        price: Number(p.price),
        unit: p.unit || "",
        quantity: Math.max(1, p.min_order || 1),
        stockQty: p.stock_qty,
        trackInventory: p.track_inventory,
      },
    ]);
    setProductQuery("");
  };

  const updateQty = (productId, quantity) => {
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId
          ? { ...l, quantity: Math.max(1, Math.floor(quantity) || 1) }
          : l,
      ),
    );
  };

  const removeLine = (productId) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  };

  const displayTotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (normalizedPhone.length !== 10) {
      setError("Enter a 10-digit phone number");
      return;
    }
    if (!lookupDone) {
      setError("Look up the customer phone before submitting");
      return;
    }
    if (!existingCustomer && !name.trim()) {
      setError("Name is required for a new customer");
      return;
    }
    if (lines.length === 0) {
      setError("Add at least one product");
      return;
    }
    if (!address.trim()) {
      setError("Delivery address is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          name: name.trim(),
          address: address.trim(),
          items: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
          })),
          paymentMethod,
          paidNow,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create order");
        return;
      }
      setSuccess({
        orderId: data.orderId,
        status: data.status,
        whatsappUrl: data.whatsappUrl,
      });
      setLines([]);
      setAddress("");
      setNotes("");
      setPhone("");
      setName("");
      setLookupDone(false);
      setExistingCustomer(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/orders"
        className="focus-ring inline-flex items-center gap-2 text-sm font-medium text-farm-sage hover:text-farm-green-dark"
      >
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      <h1 className="mt-4 font-heading text-3xl text-farm-green-dark">New phone order</h1>
      <p className="mt-1 text-sm text-farm-sage">
        Place an order on behalf of a customer into the same order book as the website.
      </p>

      {success && (
        <div className="mt-6 rounded-3xl border border-farm-green/20 bg-farm-cream p-5">
          <p className="font-semibold text-farm-green-dark">
            Order created · {success.orderId.slice(0, 8)} · {success.status}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {success.whatsappUrl && (
              <a
                href={success.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-10 items-center rounded-full bg-farm-green px-5 text-sm font-semibold text-farm-green-light"
              >
                Send WhatsApp confirmation
              </a>
            )}
            <Link
              href="/admin/orders"
              className="focus-ring inline-flex h-10 items-center rounded-full border border-farm-green-dark/15 px-5 text-sm font-semibold text-farm-green-dark"
            >
              View all orders
            </Link>
            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="focus-ring inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-farm-sage hover:text-farm-green-dark"
            >
              Create another
            </button>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-6">
        <section className="rounded-3xl border border-farm-green-dark/10 bg-farm-cream p-5 md:p-6">
          <h2 className="font-heading text-xl text-farm-green-dark">Customer</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-farm-sage">
                Phone
              </label>
              <div className="mt-1.5 flex gap-2">
                <span className="flex h-11 items-center rounded-xl border border-farm-green-dark/15 bg-farm-warm px-3 text-sm text-farm-sage">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setLookupDone(false);
                    setExistingCustomer(null);
                  }}
                  placeholder="9876543210"
                  className="h-11 flex-1 rounded-xl border border-farm-green-dark/15 bg-white px-4 text-sm focus:border-farm-green focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={lookupCustomer}
                disabled={lookingUp || normalizedPhone.length !== 10}
                className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-farm-green px-5 text-sm font-semibold text-farm-green-light disabled:opacity-60 sm:w-auto"
              >
                {lookingUp ? <Spinner className="size-4" /> : <Search className="size-4" />}
                Look up
              </button>
            </div>
          </div>

          {lookupDone && existingCustomer && (
            <p className="mt-3 text-sm text-farm-green-dark">
              Existing customer: <span className="font-semibold">{existingCustomer.name}</span>
            </p>
          )}
          {lookupDone && !existingCustomer && (
            <p className="mt-3 text-sm text-farm-sage">
              No account for this phone — enter a name to create one.
            </p>
          )}

          {(lookupDone || name) && (
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-farm-sage">
                Name {existingCustomer ? "(from profile)" : "(required)"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={Boolean(existingCustomer)}
                className="mt-1.5 h-11 w-full rounded-xl border border-farm-green-dark/15 bg-white px-4 text-sm focus:border-farm-green focus:outline-none disabled:bg-farm-warm disabled:text-farm-sage"
              />
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-farm-green-dark/10 bg-farm-cream p-5 md:p-6">
          <h2 className="font-heading text-xl text-farm-green-dark">Items</h2>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-farm-sage">
              Add product
            </label>
            <input
              type="search"
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              placeholder={loadingProducts ? "Loading catalog…" : "Search catalog"}
              disabled={loadingProducts}
              className="mt-1.5 h-11 w-full rounded-xl border border-farm-green-dark/15 bg-white px-4 text-sm focus:border-farm-green focus:outline-none"
            />
            {productQuery.trim() && filteredProducts.length > 0 && (
              <ul className="mt-2 max-h-56 overflow-y-auto rounded-2xl border border-farm-green-dark/10 bg-white">
                {filteredProducts.map((p) => {
                  const inStock = !p.track_inventory || p.stock_qty > 0;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => addProduct(p)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-farm-warm/60"
                      >
                        <span>
                          <span className="font-medium text-farm-green-dark">{p.name}</span>
                          <span className="mt-0.5 block text-xs text-farm-sage">
                            {formatPrice(Number(p.price))}
                            {p.unit ? ` · ${p.unit}` : ""}
                            {p.track_inventory ? ` · stock ${p.stock_qty}` : " · unlimited"}
                          </span>
                        </span>
                        {!inStock && (
                          <span className="shrink-0 text-xs font-semibold text-farm-accent">
                            Out of stock
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {lines.length > 0 && (
            <ul className="mt-4 divide-y divide-farm-green-dark/8">
              {lines.map((line) => (
                <li
                  key={line.productId}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium text-farm-green-dark">{line.name}</p>
                    <p className="text-xs text-farm-sage">
                      {formatPrice(line.price)}
                      {line.unit ? ` · ${line.unit}` : ""}
                      {line.trackInventory ? ` · stock ${line.stockQty}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 rounded-full border border-farm-green-dark/15 bg-white">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQty(line.productId, line.quantity - 1)}
                        className="focus-ring flex size-9 items-center justify-center rounded-full"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => updateQty(line.productId, Number(e.target.value))}
                        className="w-12 border-0 bg-transparent text-center text-sm font-semibold tabular-nums focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQty(line.productId, line.quantity + 1)}
                        className="focus-ring flex size-9 items-center justify-center rounded-full"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <p className="w-20 text-right text-sm font-semibold tabular-nums text-farm-green-dark">
                      {formatPrice(line.price * line.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeLine(line.productId)}
                      className="focus-ring text-xs font-medium text-farm-accent hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 text-right text-sm text-farm-sage">
            Display total{" "}
            <span className="font-semibold tabular-nums text-farm-green-dark">
              {formatPrice(displayTotal)}
            </span>{" "}
            <span className="text-xs">(server re-prices on submit)</span>
          </p>
        </section>

        <section className="rounded-3xl border border-farm-green-dark/10 bg-farm-cream p-5 md:p-6">
          <h2 className="font-heading text-xl text-farm-green-dark">Delivery & payment</h2>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-farm-sage">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-farm-green-dark/15 bg-white px-4 py-3 text-sm focus:border-farm-green focus:outline-none"
              placeholder="Full delivery address"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-farm-sage">
                Payment method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  const next = e.target.value;
                  setPaymentMethod(next);
                  setPaidNow(defaultPaidNow(next));
                }}
                className="mt-1.5 h-11 w-full rounded-xl border border-farm-green-dark/15 bg-white px-4 text-sm focus:border-farm-green focus:outline-none"
              >
                {PHONE_PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {PAYMENT_METHOD_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-farm-sage">
                Payment received?
              </label>
              <div className="mt-1.5 flex h-11 overflow-hidden rounded-xl border border-farm-green-dark/15 bg-white">
                <button
                  type="button"
                  onClick={() => setPaidNow(true)}
                  className={`flex-1 text-sm font-semibold ${
                    paidNow
                      ? "bg-farm-green text-farm-green-light"
                      : "text-farm-sage hover:bg-farm-warm"
                  }`}
                >
                  Yes — mark paid
                </button>
                <button
                  type="button"
                  onClick={() => setPaidNow(false)}
                  className={`flex-1 text-sm font-semibold ${
                    !paidNow
                      ? "bg-farm-green text-farm-green-light"
                      : "text-farm-sage hover:bg-farm-warm"
                  }`}
                >
                  Not yet
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-farm-sage">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-farm-green-dark/15 bg-white px-4 py-3 text-sm focus:border-farm-green focus:outline-none"
              placeholder="e.g. deliver after 5pm, customer requested substitution"
            />
          </div>
        </section>

        {error && (
          <p className="rounded-2xl border border-farm-accent/30 bg-farm-accent/10 px-4 py-3 text-sm text-farm-accent">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-farm-green text-sm font-semibold text-farm-green-light disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {saving ? <Spinner className="size-4" /> : null}
          {paidNow ? "Create paid order" : "Create order (payment pending)"}
        </button>
      </form>
    </div>
  );
}
