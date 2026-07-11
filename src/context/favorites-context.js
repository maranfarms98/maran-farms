"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/context/toast-context";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user, hydrated: authHydrated, openLogin } = useAuth();
  const { toast } = useToast();
  const [ids, setIds] = useState([]);

  useEffect(() => {
    if (!authHydrated) return;
    if (!user) {
      setIds([]);
      return;
    }
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => setIds(data.favorites || []))
      .catch(() => setIds([]));
  }, [user, authHydrated]);

  const isFavorite = useCallback((id) => ids.includes(id), [ids]);

  const toggleFavorite = useCallback(
    (product) => {
      if (!user) {
        openLogin();
        return;
      }
      const exists = ids.includes(product.id);
      setIds((prev) =>
        exists ? prev.filter((id) => id !== product.id) : [...prev, product.id],
      );
      const method = exists ? "DELETE" : "POST";
      fetch("/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      }).catch(() => {});
      toast(
        exists
          ? `Removed ${product.name} from favorites`
          : `Added ${product.name} to favorites`,
      );
    },
    [ids, user, openLogin, toast],
  );

  const value = useMemo(
    () => ({ ids, isFavorite, toggleFavorite }),
    [ids, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
