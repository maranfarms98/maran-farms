"use client";

import { Check, Search, X } from "lucide-react";

const SPECIAL_FILTERS = [
  { id: "all", label: "All Items", tamil: null },
  { id: "bestseller", label: "Bestseller", tamil: "பிரபலம்" },
  { id: "bulk", label: "Bulk Stock", tamil: "மொத்த விற்பனை" },
  { id: "new", label: "New Arrival", tamil: "புதிய வரவு" },
  { id: "limited", label: "Limited Stock", tamil: "குறிப்பிட்ட அளவு" },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Default Relevance" },
  { value: "price-asc", label: "Price Low→High" },
  { value: "price-desc", label: "Price High→Low" },
  { value: "az", label: "A–Z" },
];

export function CategoryFilters({
  search,
  setSearch,
  sort,
  setSort,
  special,
  setSpecial,
  className = "",
}) {
  return (
    <aside className={`space-y-6 ${className}`}>
      <div>
        <label className="text-eyebrow mb-2 block text-farm-green" htmlFor="cat-search">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-farm-sage" />
          <input
            id="cat-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, Tamil, description…"
            className="focus-ring h-12 w-full rounded-2xl border border-farm-green-dark/10 bg-farm-warm pr-10 pl-10 text-sm"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-farm-sage hover:bg-farm-accent-light"
              onClick={() => setSearch("")}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="text-eyebrow mb-2 block text-farm-green" htmlFor="cat-sort">
          Sort
        </label>
        <select
          id="cat-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="focus-ring h-12 w-full rounded-2xl border border-farm-green-dark/10 bg-farm-warm px-4 text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-eyebrow mb-2 text-farm-green">Special Filters</p>
        <ul className="space-y-1">
          {SPECIAL_FILTERS.map((f) => {
            const active = special === f.id;
            return (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => setSpecial(f.id)}
                  className={`focus-ring flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                    active
                      ? "bg-farm-accent text-white"
                      : "bg-farm-warm text-farm-green-dark hover:bg-farm-accent-light"
                  }`}
                >
                  <span>
                    {f.label}
                    {f.tamil && (
                      <span
                        className={`mt-0.5 block text-xs ${active ? "text-white/75" : "text-farm-sage"}`}
                        lang="ta"
                      >
                        {f.tamil}
                      </span>
                    )}
                  </span>
                  {active && <Check className="size-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
