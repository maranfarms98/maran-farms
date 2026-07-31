"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { useCoarsePointer } from "@/hooks/use-media";

/** Lightweight CSS-perspective hover tilt — no WebGL, safe for grids of many cards. */
export function TiltCard({ children, className = "", maxTilt = 10 }) {
  const motionAllowed = useMotionAllowed();
  const coarsePointer = useCoarsePointer();
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 220,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 220,
    damping: 20,
  });

  const disabled = !motionAllowed || coarsePointer;

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
