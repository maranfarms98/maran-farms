"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";
import { OrderCard } from "@/app/account/orders/order-card";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { getGenericInquiryUrl } from "@/lib/whatsapp";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrdersPageCanopy({ user, orders, loading, onCancelled }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      const matchesId = o.id.toLowerCase().includes(q);
      const matchesItem = o.items.some((i) => i.name.toLowerCase().includes(q));
      return matchesId || matchesItem;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-canopy-forest px-4 pt-28 pb-16 md:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 15% 10%, #4f9b5c 0%, transparent 55%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl">
        <p className="text-eyebrow text-canopy-gold-light">Account</p>
        <h1 className="font-heading mt-2 text-3xl text-canopy-mist md:text-4xl">My Orders</h1>
        <TamilCaption tone="light" className="mt-2">
          என் ஆர்டர்கள்
        </TamilCaption>
        <div className="mt-4 h-0.5 w-14 bg-canopy-gold" aria-hidden />
        <p className="mt-3 text-sm text-canopy-mist/70">
          {user ? `Signed in as ${user.name} · ${user.phone}` : ""}
        </p>

        {!loading && orders.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex h-11 min-w-[200px] flex-1 items-center gap-2 rounded-full border border-canopy-leaf-light/20 bg-canopy-deep/60 px-4">
              <Search className="size-4 text-canopy-mist/60" />
              <input
                type="text"
                placeholder="Search by product or order ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-canopy-mist placeholder:text-canopy-mist/40 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-full border border-canopy-leaf-light/20 bg-canopy-deep/60 px-4 text-sm text-canopy-mist focus:border-canopy-leaf focus:outline-none"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-sm text-canopy-mist/70">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-canopy-deep/60 px-6 py-16 text-center">
            <p className="font-heading text-xl text-canopy-mist">No orders yet</p>
            <TamilCaption tone="light" className="mt-2">
              இன்னும் ஆர்டர்கள் இல்லை
            </TamilCaption>
            <p className="mx-auto mt-3 max-w-sm text-sm text-canopy-mist/70">
              Your placed orders will show up here.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#harvest-paths"
                className="focus-ring inline-flex h-11 items-center rounded-full bg-canopy-leaf px-6 text-sm font-semibold text-canopy-forest"
              >
                Browse products
              </Link>
              <a
                href={getGenericInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-canopy-leaf px-6 text-sm font-semibold text-canopy-leaf-light"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-canopy-deep/60 px-6 py-16 text-center">
            <p className="font-heading text-xl text-canopy-mist">No matching orders</p>
            <p className="mt-2 text-sm text-canopy-mist/70">Try a different search or filter.</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onCancelled={onCancelled} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
