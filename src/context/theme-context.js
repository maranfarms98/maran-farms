"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const THEME_COOKIE = "mf-theme";
const ThemeContext = createContext(null);

export function ThemeProvider({ initialTheme = "classic", children }) {
  const [theme, setThemeState] = useState(
    initialTheme === "canopy" ? "canopy" : "classic",
  );

  const setTheme = useCallback((next) => {
    const value = next === "canopy" ? "canopy" : "classic";
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
