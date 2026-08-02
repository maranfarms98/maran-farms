import { getSupabaseServerClient } from "@/lib/supabase/server";

const PRODUCT_SELECT = "*, category:categories(name, slug)";

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

export async function getProductById(id) {
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
}

export async function getProductsByCategory(categoryId) {
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
}

export async function getFeaturedProducts() {
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
}

export async function getRelatedProducts(product, limit = 3) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_id", product.categoryId)
    .neq("id", product.id)
    .limit(limit);
  if (error) {
    console.error("[getRelatedProducts]", error);
    return [];
  }
  return data.map(mapProduct);
}
