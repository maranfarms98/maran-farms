"use client";

import dynamic from "next/dynamic";
import { CategoryPageClient } from "@/components/category/category-page-client";
import { useTheme } from "@/context/theme-context";

const CategoryPageCanopy = dynamic(
  () =>
    import("@/components/theme-canopy/category/category-page-canopy").then(
      (m) => m.CategoryPageCanopy,
    ),
  { ssr: false },
);

export function CategoryThemeGate({ category, products, allCategories }) {
  const { theme } = useTheme();

  if (theme === "canopy") {
    return (
      <CategoryPageCanopy category={category} products={products} allCategories={allCategories} />
    );
  }

  return (
    <CategoryPageClient category={category} products={products} allCategories={allCategories} />
  );
}
