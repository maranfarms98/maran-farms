"use client";

import { X } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { CategoryFilters } from "./category-filters";

export function MobileFilterDrawer({
  open,
  onClose,
  search,
  setSearch,
  sort,
  setSort,
  special,
  setSpecial,
  resultCount,
}) {
  return (
    <Drawer open={open} onClose={onClose} placement="bottom">
      <div className="flex items-center justify-between border-b border-farm-green-dark/8 px-5 py-4">
        <h2 className="font-heading text-xl text-farm-green-dark">
          Filters & Sort
        </h2>
        <button
          type="button"
          aria-label="Close"
          className="focus-ring flex size-11 items-center justify-center rounded-full hover:bg-farm-accent-light"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <CategoryFilters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          special={special}
          setSpecial={setSpecial}
        />
      </div>
      <div className="border-t border-farm-green-dark/8 p-5">
        <button
          type="button"
          onClick={onClose}
          className="focus-ring flex h-14 w-full items-center justify-center rounded-full bg-farm-green text-button font-semibold text-farm-green-light"
        >
          Apply Filters ({resultCount} Items)
        </button>
      </div>
    </Drawer>
  );
}
