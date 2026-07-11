"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [onLoginSuccess, setOnLoginSuccess] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setSession = useCallback((sessionUser) => {
    setUser(sessionUser);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const openLogin = useCallback((onSuccess) => {
    setOnLoginSuccess(() => onSuccess || null);
    setLoginModalOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setLoginModalOpen(false);
    setOnLoginSuccess(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      hydrated,
      setSession,
      logout,
      refresh,
      loginModalOpen,
      openLogin,
      closeLogin,
      onLoginSuccess,
    }),
    [user, hydrated, setSession, logout, refresh, loginModalOpen, openLogin, closeLogin, onLoginSuccess],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
