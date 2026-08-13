"use client";

import Link from "next/link";
import { OrderCard } from "@/app/account/orders/order-card";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";

export function OrdersPageBazaar({ user, orders, loading, onCancelled }) {
  const { t } = useBazaarLang();

  return (
    <div className="theme-bazaar min-h-screen bg-bazaar-paper px-4 pt-28 pb-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold text-bazaar-ink md:text-4xl">
          {t.orders}
        </h1>
        <p className="mt-2 text-sm text-bazaar-muted">
          {user ? `${user.name} · ${user.phone}` : ""}
        </p>

        {loading ? (
          <p className="mt-8 text-bazaar-muted">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-bazaar-ink/15 bg-white px-6 py-16 text-center">
            <p className="font-heading text-xl text-bazaar-ink">No orders yet</p>
            <Link
              href="/#bazaar-shop"
              className="focus-ring mt-6 inline-flex h-11 items-center rounded-full bg-bazaar-wa px-6 text-sm font-semibold text-white"
            >
              {t.browse}
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onCancelled={onCancelled} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
