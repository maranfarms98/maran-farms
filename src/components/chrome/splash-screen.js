"use client";

import { useEffect } from "react";

export const SPLASH_DONE_EVENT = "mf-splash-done";

let splashDoneFlag = false;

export function hasSplashCompleted() {
  return splashDoneFlag;
}

function notifySplashDone() {
  if (typeof window === "undefined") return;
  if (splashDoneFlag) return;
  splashDoneFlag = true;
  window.dispatchEvent(new CustomEvent(SPLASH_DONE_EVENT));
}

/**
 * Splash overlay removed — it was painting a full-screen green blocker that
 * could stick on reload and hide the hero. We only emit the "done" signal so
 * classic hero entrance animations still run.
 */
export function SplashScreen() {
  useEffect(() => {
    const t = window.setTimeout(notifySplashDone, 0);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
