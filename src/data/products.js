import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const CATALOG_REVALIDATE_SECONDS = 60;
const PRODUCT_SELECT = "*, category:categories(name, slug)";

function publicCatalog(fn, key) {
  return cache(
    unstable_cache(fn, [key], {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: ["catalog"],
    }),
  );
}

function mapProduct(row) {
  const inStock = !row.track_inventory || row.stock_qty > 0;
  return {
    id: row.id,
    name: row.name,
    tamilName: row.tamil_name,
    price: Number(row.price),
    unit: row.unit,
    tamilUnit: row.tamil_unit,
    minOrder: row.min_order,
    minOrderUnit: row.min_order_unit,
    categoryId: row.category_id,
    categoryName: row.category?.name,
    categorySlug: row.category?.slug,
    image: row.image,
    badge: row.badge,
    description: row.description,
    featured: row.featured,
    trackInventory: row.track_inventory,
    stockQty: row.stock_qty,
    inStock,
  };
}

export const getProductById = publicCatalog(async (id) => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[getProductById]", error);
    return null;
  }
  return data ? mapProduct(data) : null;
}, "product-by-id");

export const getProductsByCategory = publicCatalog(async (categoryId) => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_id", categoryId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[getProductsByCategory]", error);
    return [];
  }
  return data.map(mapProduct);
}, "products-by-category");

export const getFeaturedProducts = publicCatalog(async () => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("featured", true)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[getFeaturedProducts]", error);
    return [];
  }
  return data.map(mapProduct);
}, "products-featured");

export const getAllProducts = publicCatalog(async () => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[getAllProducts]", error);
    return [];
  }
  return data.map(mapProduct);
}, "products-all");

const getRelatedProductsCached = publicCatalog(
  async (categoryId, productId, limit) => {
    const supabase = getSupabaseServerClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("category_id", categoryId)
      .neq("id", productId)
      .limit(limit);
    if (error) {
      console.error("[getRelatedProducts]", error);
      return [];
    }
    return data.map(mapProduct);
  },
  "products-related",
);

export async function getRelatedProducts(product, limit = 3) {
  if (!product?.categoryId || !product?.id) return [];
  return getRelatedProductsCached(product.categoryId, product.id, limit);
}
