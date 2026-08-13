"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const THEME_COOKIE = "mf-theme";
const ThemeContext = createContext(null);

export const THEME_OPTIONS = ["classic", "canopy", "bazaar"];

function normalizeTheme(value) {
  if (value === "canopy" || value === "bazaar") return value;
  return "classic";
}

export function ThemeProvider({ initialTheme = "classic", children }) {
  const [theme, setThemeState] = useState(normalizeTheme(initialTheme));

  const setTheme = useCallback((next) => {
    const value = normalizeTheme(next);
    setThemeState(value);
    document.cookie = `${THEME_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
