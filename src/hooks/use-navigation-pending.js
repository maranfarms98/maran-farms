"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SAFETY_MS = 8000;

function isInternalNavClick(event) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

  const anchor = event.target?.closest?.("a[href]");
  if (!anchor) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      return false;
    }
    return url.pathname;
  } catch {
    return false;
  }
}

/**
 * True from an internal link click until the pathname updates (or safety timeout).
 * Used to hide the footer during soft navigations so it doesn't flash under the loader.
 */
export function useNavigationPending() {
  const pathname = usePathname();
  const [pendingPath, setPendingPath] = useState(null);

  useEffect(() => {
    if (pendingPath == null) return undefined;
    const id = window.setTimeout(() => setPendingPath(null), SAFETY_MS);
    return () => window.clearTimeout(id);
  }, [pendingPath]);

  useEffect(() => {
    const onClick = (event) => {
      const nextPath = isInternalNavClick(event);
      if (nextPath) setPendingPath(nextPath);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return pendingPath != null && pendingPath !== pathname;
}
