import { notFound } from "next/navigation";
import { getAllProducts, getProductById, getRelatedProducts } from "@/data/products";
import { getCategoryById } from "@/data/categories";
import { getDetailContent } from "@/data/product-detail-content";
import { getProductGuide } from "@/data/product-guides";
import { ProductPageClient } from "@/components/product/product-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  productJsonLd,
} from "@/lib/schema";
import { pageMetadata, productMetaDescription, productPageTitle } from "@/lib/seo";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product" };
  const guide = getProductGuide(product.id);
  return pageMetadata({
    title: productPageTitle(product),
    description: productMetaDescription(product, guide),
    path: `/product/${product.id}`,
    image: product.image,
  });
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

  const crumbs = [
    { name: "Home", href: "/" },
    {
      name: category?.name || "Catalog",
      href: `/category/${category?.slug || ""}`,
    },
    { name: product.name, href: `/product/${product.id}` },
  ];
  const guide = getProductGuide(product.id);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={faqPageJsonLd(content.faqs)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <ProductPageClient
        product={product}
        category={category}
        related={related}
        content={content}
        guide={guide}
        crumbs={crumbs}
      />
    </>
  );
}
