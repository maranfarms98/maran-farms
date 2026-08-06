"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function MarkPaidButton({ orderId }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const onClick = async () => {
    setError("");
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markPaid: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    startTransition(() => router.refresh());
  };

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="focus-ring rounded-full border border-farm-green/30 bg-farm-green/10 px-3 py-1 text-xs font-semibold text-farm-green-dark hover:bg-farm-green/15 disabled:opacity-60"
      >
        {pending ? "Marking…" : "Mark paid"}
      </button>
      {error && <p className="mt-1 text-[10px] text-farm-accent">{error}</p>}
    </div>
  );
}
