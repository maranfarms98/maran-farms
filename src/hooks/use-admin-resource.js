"use client";

import { useCallback, useEffect, useState } from "react";

/** Fetches a collection from an admin endpoint once on mount, plus on demand. */
export function useAdminList(endpoint, collectionKey) {
  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const reload = useCallback(async () => {
    const res = await fetch(endpoint);
    const data = await res.json();
    setItems(data[collectionKey] || []);
  }, [endpoint, collectionKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListLoading(true);
      try {
        await reload();
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  return { items, listLoading, reload };
}

/**
 * The load / create / update / delete plumbing shared by the admin products and
 * categories pages. Each page keeps its own form and table.
 */
export function useAdminResource({ endpoint, collectionKey, saveErrorMessage }) {
  const { items, listLoading, reload } = useAdminList(endpoint, collectionKey);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /** Creates when `id` is null, otherwise patches. Returns true on success. */
  const save = useCallback(
    async (payload, id = null) => {
      setError("");
      setSaving(true);
      try {
        const res = await fetch(id ? `${endpoint}/${id}` : endpoint, {
          method: id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || saveErrorMessage);
          return false;
        }
        reload();
        return true;
      } finally {
        setSaving(false);
      }
    },
    [endpoint, reload, saveErrorMessage],
  );

  const remove = useCallback(
    async (id) => {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data.error };
      }
      reload();
      return { ok: true };
    },
    [endpoint, reload],
  );

  return { items, listLoading, saving, error, setError, save, remove, reload };
}
