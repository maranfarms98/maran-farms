"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { OrderCard } from "@/app/account/orders/order-card";

const STATUS_FILTERS = ["all", "pending", "paid", "shipped", "delivered", "cancelled"];

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
    <div className="min-h-screen bg-farm-warm px-4 pt-28 pb-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl text-farm-green-dark">My Orders</h1>
        <p className="mt-1 text-sm text-farm-sage">
          {user ? `Signed in as ${user.name} · ${user.phone}` : ""}
        </p>

        {!loading && orders.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex h-11 flex-1 min-w-[200px] items-center gap-2 rounded-full border border-farm-green-dark/15 bg-farm-cream px-4">
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
              className="h-11 rounded-full border border-farm-green-dark/15 bg-farm-cream px-4 text-sm capitalize focus:border-farm-green focus:outline-none"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-sm text-farm-sage">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-farm-green-dark/15 bg-farm-cream px-6 py-16 text-center">
            <p className="font-heading text-xl text-farm-green-dark">No orders yet</p>
            <p className="mt-2 text-sm text-farm-sage">
              Your placed orders will show up here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-farm-green-dark/15 bg-farm-cream px-6 py-16 text-center">
            <p className="font-heading text-xl text-farm-green-dark">No matching orders</p>
            <p className="mt-2 text-sm text-farm-sage">Try a different search or filter.</p>
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
