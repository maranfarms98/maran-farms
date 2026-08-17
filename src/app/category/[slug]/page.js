import { notFound } from "next/navigation";
import { getAllCategories, getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { CategoryPageClient } from "@/components/category/category-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/schema";
import { categoryPageTitle, pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return pageMetadata({
    title: categoryPageTitle(category),
    description: category.description,
    path: `/category/${category.slug}`,
    image: category.heroImage || category.image,
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, allCategories] = await Promise.all([
    getProductsByCategory(category.id),
    getAllCategories(),
  ]);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: category.name, href: `/category/${category.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <CategoryPageClient
        category={category}
        products={products}
        allCategories={allCategories}
        crumbs={crumbs}
      />
    </>
  );
}
