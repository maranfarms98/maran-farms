"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export function OrderStatusSelect({ orderId, status }) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const onChange = async (e) => {
    const next = e.target.value;
    setValue(next);
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    startTransition(() => router.refresh());
  };

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={pending}
      className="focus-ring rounded-full border border-farm-green-dark/15 bg-farm-warm px-3 py-1.5 text-xs font-semibold capitalize text-farm-green-dark disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
