"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useMotionAllowed } from "@/components/motion/motion-provider";

const panelMotion = {
  bottom: {
    initial: { y: "100%", opacity: 0.6 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0.6 },
  },
  right: {
    initial: { x: "100%", opacity: 0.6 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0.6 },
  },
  dropdown: {
    initial: { y: -12, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -8, opacity: 0 },
  },
  fullscreen: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export function Drawer({
  open,
  onClose,
  children,
  placement = "bottom",
  labelledBy,
  className = "",
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const openedAt = useRef(0);
  const motionAllowed = useMotionAllowed();
  const mounted = typeof document !== "undefined";

  useEffect(() => {
    if (!open) return;
    openedAt.current = Date.now();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const focusable = panelRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();
  }, [open]);

  if (!mounted) return null;

  const handleBackdrop = () => {
    if (Date.now() - openedAt.current < 350) return;
    onClose();
  };

  const placementClasses = {
    bottom: "inset-x-0 bottom-0 max-h-[min(88vh,calc(var(--vvh)*0.88))] rounded-t-3xl",
    dropdown:
      "left-0 right-0 top-[var(--header-offset,4.5rem)] max-h-[min(70vh,32rem,calc(var(--vvh)*0.7))] rounded-b-3xl",
    fullscreen: "inset-0 h-vvh rounded-none",
    right: "inset-y-0 right-0 h-vvh w-[min(100%,20rem)] rounded-l-3xl",
  };

  const motionProps = panelMotion[placement] || panelMotion.bottom;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="absolute inset-0 bg-farm-green-dark/45 backdrop-blur-[2px]"
            onClick={handleBackdrop}
            initial={motionAllowed ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy || titleId}
            className={`absolute flex flex-col bg-farm-cream shadow-elevated ${placementClasses[placement] || placementClasses.bottom} ${className}`}
            initial={motionAllowed ? motionProps.initial : false}
            animate={motionProps.animate}
            exit={motionProps.exit}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
