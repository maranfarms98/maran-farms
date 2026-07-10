"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { getProductById } from "@/data/products";

const STORAGE_KEY = "maran-farms-cart";
const CartContext = createContext(null);

const EMPTY_CART = Object.freeze({});
let memoryCart = EMPTY_CART;
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot() {
  return memoryCart;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    memoryCart = raw ? JSON.parse(raw) : EMPTY_CART;
  } catch {
    memoryCart = EMPTY_CART;
  }
  emit();
}

function writeStorage(items) {
  memoryCart = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
  emit();
}

export function CartProvider({ children }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [pulse, setPulse] = useState(0);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load localStorage only after hydration so server/client snapshots match
  useEffect(() => {
    readStorage();
    const ready = window.setTimeout(() => setHydrated(true), 0);
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) readStorage();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearTimeout(ready);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    const next = { ...memoryCart };
    if (quantity <= 0) delete next[productId];
    else next[productId] = quantity;
    writeStorage(next);
  }, []);

  const addItem = useCallback((productId, amount = 1) => {
    const current = memoryCart[productId] || 0;
    const product = getProductById(productId);
    const min = product?.minOrder || 1;
    const nextQty = current === 0 ? Math.max(amount, min) : current + amount;
    writeStorage({ ...memoryCart, [productId]: nextQty });
    setPulse((p) => p + 1);
  }, []);

  const removeItem = useCallback((productId) => {
    const next = { ...memoryCart };
    delete next[productId];
    writeStorage(next);
  }, []);

  const clearCart = useCallback(() => writeStorage(EMPTY_CART), []);

  const lines = useMemo(() => {
    return Object.entries(items)
      .map(([id, quantity]) => {
        const product = getProductById(id);
        if (!product) return null;
        return {
          product,
          quantity,
          lineTotal: product.price * quantity,
          belowMin: quantity < product.minOrder,
        };
      })
      .filter(Boolean);
  }, [items]);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );

  const uniqueCount = lines.length;

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotal, 0),
    [lines],
  );

  const hasMinViolations = lines.some((l) => l.belowMin);

  const value = useMemo(
    () => ({
      items,
      lines,
      itemCount,
      uniqueCount,
      total,
      hasMinViolations,
      hydrated,
      pulse,
      orderDrawerOpen,
      setOrderDrawerOpen,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      getQuantity: (id) => items[id] || 0,
    }),
    [
      items,
      lines,
      itemCount,
      uniqueCount,
      total,
      hasMinViolations,
      hydrated,
      pulse,
      orderDrawerOpen,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
