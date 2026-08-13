"use client";

import dynamic from "next/dynamic";
import { CategoryPageClient } from "@/components/category/category-page-client";
import { useTheme } from "@/context/theme-context";
import { CategoryPageBazaar } from "@/components/theme-bazaar/category/category-page-bazaar";

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

  if (theme === "bazaar") {
    return (
      <CategoryPageBazaar category={category} products={products} allCategories={allCategories} />
    );
  }

  return (
    <CategoryPageClient category={category} products={products} allCategories={allCategories} />
  );
}
