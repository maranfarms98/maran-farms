"use client";

import { createContext, useContext, useMemo } from "react";
import { MotionConfig, useReducedMotion as useFmReducedMotion } from "framer-motion";
import { useCoarsePointer, useReducedMotion } from "@/hooks/use-media";

const MotionContext = createContext({
  reducedMotion: false,
  coarsePointer: false,
  motionAllowed: true,
  gsapAllowed: false,
});

export function MotionProvider({ children }) {
  const reducedCss = useReducedMotion();
  const reducedFm = useFmReducedMotion();
  const coarsePointer = useCoarsePointer();
  const reducedMotion = Boolean(reducedCss || reducedFm);
  const motionAllowed = !reducedMotion;
  const gsapAllowed = motionAllowed && !coarsePointer;

  const value = useMemo(
    () => ({
      reducedMotion,
      coarsePointer,
      motionAllowed,
      gsapAllowed,
    }),
    [reducedMotion, coarsePointer, motionAllowed, gsapAllowed],
  );

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}

export function useMotionSettings() {
  return useContext(MotionContext);
}

export function useMotionAllowed() {
  return useMotionSettings().motionAllowed;
}

export function useGsapAllowed() {
  return useMotionSettings().gsapAllowed;
}
