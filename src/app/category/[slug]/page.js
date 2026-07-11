import { notFound } from "next/navigation";
import { getAllCategories, getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { CategoryPageClient } from "@/components/category/category-page-client";

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
    <CategoryPageClient
      category={category}
      products={products}
      allCategories={allCategories}
    />
  );
}
