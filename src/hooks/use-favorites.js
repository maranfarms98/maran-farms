"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useToast } from "@/context/toast-context";

const STORAGE_KEY = "maran-farms-favorites";

const EMPTY_FAVS = Object.freeze([]);
let memoryFavs = EMPTY_FAVS;
const listeners = new Set();
let storageBound = false;

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot() {
  return memoryFavs;
}

function getServerSnapshot() {
  return EMPTY_FAVS;
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    memoryFavs = raw ? JSON.parse(raw) : EMPTY_FAVS;
  } catch {
    memoryFavs = EMPTY_FAVS;
  }
  emit();
}

function writeStorage(ids) {
  memoryFavs = ids.length ? ids : EMPTY_FAVS;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { toast } = useToast();

  useEffect(() => {
    readStorage();
    if (storageBound) return;
    storageBound = true;
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) readStorage();
    };
    window.addEventListener("storage", onStorage);
  }, []);

  const isFavorite = useCallback((id) => ids.includes(id), [ids]);

  const toggleFavorite = useCallback(
    (product) => {
      const exists = ids.includes(product.id);
      const next = exists
        ? ids.filter((id) => id !== product.id)
        : [...ids, product.id];
      writeStorage(next);
      toast(
        exists
          ? `Removed ${product.name} from favorites`
          : `Added ${product.name} to favorites`,
      );
    },
    [ids, toast],
  );

  return { ids, isFavorite, toggleFavorite };
}
