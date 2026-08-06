"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { OrderCard } from "@/app/account/orders/order-card";
import { FarmPageIntro } from "@/components/ui/farm-page-intro";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { PageLoader } from "@/components/ui/page-loader";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { FarmPageShell } from "@/components/ui/farm-page-shell";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

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
  const [loadedForPhone, setLoadedForPhone] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!hydrated || !user) return undefined;

    let cancelled = false;
    fetch("/api/orders/mine")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setOrders(data.orders || []);
        setLoadedForPhone(user.phone);
      })
      .catch(() => {
        if (cancelled) return;
        setOrders([]);
        setLoadedForPhone(user.phone);
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, user]);

  if (!hydrated || (user && loadedForPhone !== user.phone)) {
    return <PageLoader label="Loading your orders…" />;
  }

  if (!user) {
    return (
      <FarmPageShell>
        <div className="relative mx-auto max-w-3xl text-center">
          <FarmPageIntro eyebrow="Account" title="My Orders" tamil="என் ஆர்டர்கள்" />
          <p className="mt-6 text-sm text-farm-sage">Sign in to view your order history.</p>
          <Link
            href="/login?redirect=/account/orders"
            className="focus-ring mt-6 inline-flex h-11 items-center rounded-full bg-farm-green px-6 text-sm font-semibold text-farm-green-light"
          >
            Sign in
          </Link>
        </div>
      </FarmPageShell>
    );
  }

  const handleCancelled = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
    );
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const matchesId = o.id.toLowerCase().includes(q);
    const matchesItem = o.items.some((i) => i.name.toLowerCase().includes(q));
    return matchesId || matchesItem;
  });

  return (
    <FarmPageShell variant="orders">
      <div className="relative mx-auto max-w-3xl">
        <FarmPageIntro
          eyebrow="Account"
          title="My Orders"
          tamil="என் ஆர்டர்கள்"
        >
          <p className="mt-3 text-sm text-farm-sage">
            Signed in as {user.name} · {user.phone}
          </p>
        </FarmPageIntro>

        {orders.length > 0 && (
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

        {orders.length === 0 ? (
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
              <WhatsAppButton href={getGenericInquiryUrl()} />
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
    </FarmPageShell>
  );
}
