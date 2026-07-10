"use client";

import { motion } from "framer-motion";
import { useMotionAllowed } from "./motion-provider";

export function Pressable({
  children,
  className = "",
  as = "button",
  hoverScale = 1.03,
  tapScale = 0.97,
  ...props
}) {
  const motionAllowed = useMotionAllowed();
  const Comp = motion[as] || motion.button;

  if (!motionAllowed) {
    const Static = as === "a" ? "a" : as === "div" ? "div" : "button";
    return (
      <Static className={className} {...props}>
        {children}
      </Static>
    );
  }

  return (
    <Comp
      className={className}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      {...props}
    >
      {children}
    </Comp>
  );
}
