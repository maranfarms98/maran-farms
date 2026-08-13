"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useFavorites } from "@/context/favorites-context";
import { ProductCardBazaar } from "@/components/theme-bazaar/shared/product-card-bazaar";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";
import { useTheme } from "@/context/theme-context";

export function FavoritesPageBazaar() {
  const { user, hydrated } = useAuth();
  const { ids } = useFavorites();
  const { t } = useBazaarLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(
      ids.map((id) =>
        fetch(`/api/products/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d?.product || null)
          .catch(() => null),
      ),
    ).then((list) => {
      if (cancelled) return;
      setProducts(list.filter(Boolean));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [ids, user, hydrated]);

  if (!hydrated) {
    return <p className="bazaar-container pt-28 text-bazaar-muted">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="bazaar-container pt-28 pb-16 text-center">
        <h1 className="font-heading text-3xl text-bazaar-ink">{t.favorites}</h1>
        <p className="mt-3 text-bazaar-muted">Sign in to save products.</p>
        <Link
          href="/login?redirect=/account/favorites"
          className="focus-ring mt-6 inline-flex h-11 items-center rounded-full bg-bazaar-wa px-6 text-sm font-semibold text-white"
        >
          {t.login}
        </Link>
      </div>
    );
  }

  return (
    <div className="bazaar-container pt-28 pb-20">
      <h1 className="font-heading text-3xl font-semibold text-bazaar-ink md:text-4xl">
        {t.favorites}
      </h1>
      {loading ? (
        <p className="mt-8 text-bazaar-muted">Loading…</p>
      ) : products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-bazaar-ink/15 bg-white px-6 py-16 text-center">
          <p className="font-heading text-xl text-bazaar-ink">{t.emptyFav}</p>
          <Link
            href="/#bazaar-shop"
            className="focus-ring mt-6 inline-flex h-11 items-center rounded-full bg-bazaar-wa px-6 text-sm font-semibold text-white"
          >
            {t.browse}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
          {products.map((p) => (
            <ProductCardBazaar key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Classic/canopy-friendly shell if user lands here on other themes */
export default function FavoritesPage() {
  const { theme } = useTheme();
  const bazaar = theme === "bazaar";

  return (
    <div className={bazaar ? "theme-bazaar min-h-screen bg-bazaar-paper" : "min-h-screen bg-farm-warm"}>
      {bazaar ? (
        <FavoritesPageBazaar />
      ) : (
        <FavoritesClassicFallback />
      )}
    </div>
  );
}

function FavoritesClassicFallback() {
  const { user, hydrated } = useAuth();
  const { ids } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all(
      ids.map((id) =>
        fetch(`/api/products/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d?.product || null)
          .catch(() => null),
      ),
    ).then((list) => {
      if (!cancelled) {
        setProducts(list.filter(Boolean));
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [ids, user, hydrated]);

  return (
    <div className="container-farm pt-28 pb-16">
      <h1 className="font-heading text-3xl text-farm-green-dark">Saved products</h1>
      {!user ? (
        <p className="mt-4 text-farm-sage">
          <Link href="/login?redirect=/account/favorites" className="underline">
            Login
          </Link>{" "}
          to view favorites.
        </p>
      ) : loading ? (
        <p className="mt-6 text-farm-sage">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-6 text-farm-sage">No saved products yet.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {products.map((p) => (
            <li key={p.id}>
              <Link href={`/product/${p.id}`} className="font-medium text-farm-green">
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
