"use client";

import dynamic from "next/dynamic";
import { ProductPageClient } from "@/components/product/product-page-client";
import { useTheme } from "@/context/theme-context";

const ProductPageCanopy = dynamic(
  () =>
    import("@/components/theme-canopy/product/product-page-canopy").then(
      (m) => m.ProductPageCanopy,
    ),
  { ssr: false },
);

export function ProductThemeGate({ product, category, related, content }) {
  const { theme } = useTheme();

  if (theme === "canopy") {
    return (
      <ProductPageCanopy product={product} category={category} related={related} content={content} />
    );
  }

  return (
    <ProductPageClient product={product} category={category} related={related} content={content} />
  );
}
