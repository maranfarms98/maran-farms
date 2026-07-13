"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { OrderCard } from "@/app/account/orders/order-card";
import { FarmPageIntro } from "@/components/ui/farm-page-intro";
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

export default function MyOrdersPage() {
  const { user, hydrated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!hydrated || !user) return;
    fetch("/api/orders/mine")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [hydrated, user]);

  const handleCancelled = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
    );
  };

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
    <div className="relative min-h-screen overflow-hidden bg-farm-warm px-4 pt-28 pb-16 md:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 15% 10%, #15321f 0%, transparent 55%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl">
        <FarmPageIntro
          eyebrow="Account"
          title="My Orders"
          tamil="என் ஆர்டர்கள்"
        >
          <p className="mt-3 text-sm text-farm-sage">
            {user ? `Signed in as ${user.name} · ${user.phone}` : ""}
          </p>
        </FarmPageIntro>

        {!loading && orders.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex h-11 min-w-[200px] flex-1 items-center gap-2 rounded-full border border-farm-green-dark/15 bg-farm-cream px-4">
              <Search className="size-4 text-farm-sage" />
              <input
                type="text"
                placeholder="Search by product or order ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-farm-green-dark placeholder:text-farm-sage/60 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-full border border-farm-green-dark/15 bg-farm-cream px-4 text-sm focus:border-farm-green focus:outline-none"
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
          <p className="mt-8 text-sm text-farm-sage">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div className="mt-8 bg-farm-cream/80 px-6 py-16 text-center">
            <p className="font-heading text-xl text-farm-green-dark">
              No orders yet
            </p>
            <TamilCaption className="mt-2">
              இன்னும் ஆர்டர்கள் இல்லை
            </TamilCaption>
            <p className="mx-auto mt-3 max-w-sm text-sm text-farm-sage">
              Your placed orders will show up here.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#harvest-paths"
                className="focus-ring inline-flex h-11 items-center rounded-full bg-farm-green px-6 text-sm font-semibold text-farm-green-light"
              >
                Browse products
              </Link>
              <a
                href={getGenericInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-farm-green px-6 text-sm font-semibold text-farm-green"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 bg-farm-cream/80 px-6 py-16 text-center">
            <p className="font-heading text-xl text-farm-green-dark">
              No matching orders
            </p>
            <p className="mt-2 text-sm text-farm-sage">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onCancelled={handleCancelled} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
