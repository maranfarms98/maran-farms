"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Leaf, Sparkles, Store } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/theme-context";

const OPTIONS = [
  { value: "classic", label: "Classic", icon: Sparkles },
  { value: "canopy", label: "Canopy", icon: Leaf },
  { value: "bazaar", label: "Bazaar", icon: Store },
];

export function ThemeSwitcher({ variant = "classic" }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isCanopy = variant === "canopy";
  const isBazaar = variant === "bazaar";

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = OPTIONS.find((o) => o.value === theme) || OPTIONS[0];
  const CurrentIcon = current.icon;

  const buttonClass = isCanopy
    ? "border border-canopy-leaf-light/30 bg-canopy-deep/60 text-canopy-mist backdrop-blur-sm hover:bg-canopy-deep/80"
    : isBazaar
      ? "border border-bazaar-ink/15 bg-bazaar-paper text-bazaar-ink hover:bg-bazaar-sand"
      : "bg-farm-green/8 text-farm-green hover:bg-farm-accent-light";

  const menuClass = isCanopy
    ? "border-canopy-leaf-light/20 bg-canopy-deep text-canopy-mist"
    : isBazaar
      ? "border-bazaar-ink/10 bg-bazaar-paper text-bazaar-ink"
      : "border-farm-green-dark/8 bg-farm-cream";

  const eyebrowClass = isCanopy
    ? "text-canopy-leaf-light"
    : isBazaar
      ? "text-bazaar-muted"
      : "text-farm-sage";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Switch UI style"
        className={`focus-ring inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${buttonClass}`}
      >
        <CurrentIcon className="size-4" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-full right-0 z-50 mt-3 w-48 rounded-3xl border p-2 shadow-elevated ${menuClass}`}
        >
          <p className={`px-4 pt-2 pb-1 text-eyebrow ${eyebrowClass}`}>UI Style</p>
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = opt.value === theme;
            let itemClass;
            if (isCanopy) {
              itemClass = active
                ? "bg-canopy-moss/40 text-canopy-mist"
                : "text-canopy-mist/80 hover:bg-canopy-moss/25";
            } else if (isBazaar) {
              itemClass = active
                ? "bg-bazaar-sand text-bazaar-ink"
                : "text-bazaar-ink/80 hover:bg-bazaar-sand/70";
            } else {
              itemClass = active
                ? "bg-farm-accent-light text-farm-green-dark"
                : "text-farm-green-dark hover:bg-farm-accent-light";
            }
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`focus-ring flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${itemClass}`}
              >
                <Icon className="size-4" />
                {opt.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
