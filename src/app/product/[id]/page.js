import { notFound } from "next/navigation";
import { getProductById, products } from "@/data/products";
import { ProductPageClient } from "@/components/product/product-page-client";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}
