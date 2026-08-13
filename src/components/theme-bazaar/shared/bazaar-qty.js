"use client";

import { Minus, Plus } from "lucide-react";

export function BazaarQtyStepper({ value, onChange, min = 1, disabled = false }) {
  const floor = Math.max(0, min);
  return (
    <div
      className={`inline-flex h-11 items-center rounded-xl border border-bazaar-ink/15 bg-white ${
        disabled ? "opacity-50" : ""
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        type="button"
        aria-label="Decrease"
        disabled={disabled || value <= floor}
        className="focus-ring flex size-11 items-center justify-center rounded-xl text-bazaar-ink disabled:opacity-40"
        onClick={() => onChange(Math.max(floor, value - 1))}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums text-bazaar-ink">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        disabled={disabled}
        className="focus-ring flex size-11 items-center justify-center rounded-xl text-bazaar-ink disabled:opacity-40"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
