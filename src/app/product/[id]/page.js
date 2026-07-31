import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/data/products";
import { getCategoryById } from "@/data/categories";
import { getDetailContent } from "@/data/product-detail-content";
import { ProductThemeGate } from "@/components/product/product-theme-gate";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [category, related, content] = await Promise.all([
    getCategoryById(product.categoryId),
    getRelatedProducts(product, 3),
    getDetailContent(product.categoryId),
  ]);

  return (
    <ProductThemeGate
      product={product}
      category={category}
      related={related}
      content={content}
    />
  );
}
