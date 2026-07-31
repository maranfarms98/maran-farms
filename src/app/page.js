import { HomeThemeGate } from "@/components/home/home-theme-gate";
import { getAllCategories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getAllCategories(),
    getFeaturedProducts(),
  ]);

  return <HomeThemeGate categories={categories} featuredProducts={featuredProducts} />;
}
