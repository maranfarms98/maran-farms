"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCardBazaar } from "@/components/theme-bazaar/shared/product-card-bazaar";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";

function filterProducts(list, { search, sort }) {
  let result = [...list];
  const q = search.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.tamilName || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q),
    );
  }
  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (sort === "az") result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

export function CategoryPageBazaar({ category, products, allCategories }) {
  const { t, lang } = useBazaarLang();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const filtered = useMemo(
    () => filterProducts(products, { search, sort }),
    [products, search, sort],
  );

  return (
    <div className="bg-bazaar-paper pb-28 pt-20">
      <div className="relative h-52 overflow-hidden md:h-64">
        <Image
          src={category.heroImage || category.image}
          alt={category.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-bazaar-ink/45" />
        <div className="bazaar-container relative z-10 flex h-full flex-col justify-end pb-8">
          <Link
            href="/"
            className="focus-ring mb-4 inline-flex w-fit items-center gap-2 text-sm text-white/85"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
          <h1 className="font-heading text-4xl font-semibold text-white md:text-5xl">
            {lang === "ta" ? category.tamilName : category.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/75">{category.description}</p>
        </div>
      </div>

      <div className="bazaar-container mt-6 flex gap-2 overflow-x-auto pb-1">
        {allCategories.map((cat) => {
          const active = cat.slug === category.slug;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                active
                  ? "bg-bazaar-wa text-white"
                  : "border border-bazaar-ink/15 text-bazaar-ink"
              }`}
            >
              {lang === "ta" ? cat.tamilName : cat.name}
            </Link>
          );
        })}
      </div>

      <div className="bazaar-container mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-bazaar-ink/15 bg-white px-3">
          <Search className="size-4 text-bazaar-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-sm outline-none"
          />
          {search && (
            <button type="button" aria-label="Clear" onClick={() => setSearch("")}>
              <X className="size-4 text-bazaar-muted" />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-11 rounded-xl border border-bazaar-ink/15 bg-white px-4 text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="az">A–Z</option>
        </select>
      </div>

      <div className="bazaar-container mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
        {filtered.map((p) => (
          <ProductCardBazaar key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="bazaar-container mt-10 text-center text-bazaar-muted">No products found.</p>
      )}
    </div>
  );
}
