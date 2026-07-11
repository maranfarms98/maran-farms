"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, RotateCcw, XCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { formatPrice } from "@/lib/format";
import { StatusTracker } from "@/app/account/orders/status-tracker";
import { Spinner } from "@/components/ui/spinner";

export function OrderCard({ order, onCancelled }) {
  const [expanded, setExpanded] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { addItem, setOrderDrawerOpen } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handleReorder = async (e) => {
    e.stopPropagation();
    setReordering(true);
    try {
      let added = 0;
      for (const item of order.items) {
        const res = await fetch(`/api/products/${item.productId}`);
        if (!res.ok) continue;
        const { product } = await res.json();
        if (!product || product.inStock === false) continue;
        addItem(product, item.quantity);
        added += 1;
      }
      if (added > 0) {
        toast(`Added ${added} item${added === 1 ? "" : "s"} back to your cart`);
        setOrderDrawerOpen(true);
      } else {
        toast("Those items are no longer available");
      }
    } finally {
      setReordering(false);
    }
  };

  const handleCancel = async (e) => {
    e.stopPropagation();
    if (!confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Failed to cancel order");
        return;
      }
      toast("Order cancelled");
      onCancelled?.(order.id);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <li className="rounded-3xl border border-farm-green-dark/8 bg-farm-cream p-5">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full flex-wrap items-start justify-between gap-4 text-left"
      >
        <div>
          <p className="font-mono text-xs text-farm-sage">{order.id}</p>
          <p className="mt-1 text-sm text-farm-sage">
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="mt-2 font-heading text-lg text-farm-green">
            {formatPrice(order.total)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusTracker status={order.status} />
          <ChevronDown
            className={`size-5 shrink-0 text-farm-sage transition ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="mt-4 border-t border-farm-green-dark/8 pt-4">
          <ul className="space-y-1.5">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between text-sm text-farm-sage"
              >
                <span>{item.name} × {item.quantity}</span>
                <span className="tabular-nums text-farm-green-dark">
                  {formatPrice(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-farm-green-dark/8 pt-3">
            <span className="text-sm text-farm-sage">Delivering to</span>
            <span className="max-w-[60%] text-right text-sm text-farm-green-dark">
              {order.address}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReorder}
              disabled={reordering}
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-farm-green px-4 text-sm font-semibold text-farm-green-light disabled:opacity-60"
            >
              {reordering ? <Spinner className="size-4" /> : <RotateCcw className="size-4" />}
              {reordering ? "Adding…" : "Reorder"}
            </button>
            {order.status === "pending" && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-farm-accent/10 px-4 text-sm font-semibold text-farm-accent-dark disabled:opacity-60"
              >
                {cancelling ? <Spinner className="size-4" /> : <XCircle className="size-4" />}
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
