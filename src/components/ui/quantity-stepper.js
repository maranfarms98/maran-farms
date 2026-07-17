"use client";

import { Check, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  compact = false,
  className = "",
}) {
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 600);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  if (compact && value === 0) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onChange(Math.max(1, min || 1));
          setJustAdded(true);
        }}
        className={`focus-ring inline-flex h-11 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-full bg-farm-accent px-4 text-button font-semibold text-white transition hover:bg-farm-accent-dark ${className}`}
      >
        {justAdded ? (
          <Check className="animate-check-success size-4" />
        ) : (
          <Plus className="size-4" />
        )}
        Add
      </button>
    );
  }

  return (
    <div
      className={`inline-flex h-11 items-center rounded-full border border-farm-green-dark/10 bg-farm-warm ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className="focus-ring flex size-11 items-center justify-center rounded-full text-farm-green transition hover:bg-farm-accent-light"
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        min={0}
        value={value}
        aria-label="Quantity"
        className="h-11 w-12 border-0 bg-transparent text-center text-sm font-semibold text-farm-green-dark outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          onChange(Number.isNaN(n) ? 0 : Math.max(0, n));
        }}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        className="focus-ring flex size-11 items-center justify-center rounded-full text-farm-green transition hover:bg-farm-accent-light"
        onClick={() => {
          if (value === 0) setJustAdded(true);
          onChange(value + 1);
        }}
      >
        {justAdded && value > 0 ? (
          <Check className="animate-check-success size-4 text-farm-green" />
        ) : (
          <Plus className="size-4" />
        )}
      </button>
    </div>
  );
}
