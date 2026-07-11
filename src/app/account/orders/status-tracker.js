"use client";

import { Check, X } from "lucide-react";

const STEPS = ["pending", "paid", "shipped", "delivered"];
const LABELS = {
  pending: "Placed",
  paid: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

export function StatusTracker({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-sm font-semibold text-farm-accent">
        <span className="flex size-6 items-center justify-center rounded-full bg-farm-accent/15">
          <X className="size-3.5" />
        </span>
        Cancelled
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                  done ? "bg-farm-green text-farm-green-light" : "bg-farm-sage/20 text-farm-sage"
                }`}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={`text-[0.65rem] font-medium whitespace-nowrap ${
                  done ? "text-farm-green-dark" : "text-farm-sage"
                }`}
              >
                {LABELS[step]}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-1.5 mb-4 h-0.5 w-6 sm:w-10 ${
                  i < currentIndex ? "bg-farm-green" : "bg-farm-sage/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
