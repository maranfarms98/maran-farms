"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useMotionAllowed } from "./motion-provider";

const variants = {
  up: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
};

export function MotionReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  as = "div",
  once = true,
  amount = 0.2,
}) {
  const motionAllowed = useMotionAllowed();
  const Tag = motion[as] || motion.div;
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount });

  if (!motionAllowed) {
    const Static = as === "li" ? "li" : as === "section" ? "section" : "div";
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Tag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[variant] || variants.up}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
        delay: delay / 1000,
      }}
    >
      {children}
    </Tag>
  );
}

export function StaggerChildren({
  children,
  className = "",
  stagger = 0.08,
  delayChildren = 0.05,
  as = "div",
  once = true,
  amount = 0.15,
}) {
  const motionAllowed = useMotionAllowed();
  const Tag = motion[as] || motion.div;
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount });

  if (!motionAllowed) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Tag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className = "", variant = "up" }) {
  const motionAllowed = useMotionAllowed();
  if (!motionAllowed) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      variants={variants[variant] || variants.up}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
