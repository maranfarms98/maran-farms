import { notFound } from "next/navigation";
import { getAllCategories, getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { CategoryThemeGate } from "@/components/category/category-theme-gate";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, allCategories] = await Promise.all([
    getProductsByCategory(category.id),
    getAllCategories(),
  ]);

  return (
    <CategoryThemeGate
      category={category}
      products={products}
      allCategories={allCategories}
    />
  );
}
