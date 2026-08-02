import { getSupabaseServerClient } from "@/lib/supabase/server";

function mapCategory(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tamilName: row.tamil_name,
    description: row.description,
    tamilDescription: row.tamil_description,
    image: row.image,
    heroImage: row.hero_image,
    minOrder: row.min_order,
    minOrderUnit: row.min_order_unit,
    gradient: row.gradient,
    accent: row.accent,
  };
}

export async function getAllCategories() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[getAllCategories]", error);
    return [];
  }
  return data.map(mapCategory);
}

export async function getCategoryBySlug(slug) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("[getCategoryBySlug]", error);
    return null;
  }
  return data ? mapCategory(data) : null;
}

export async function getCategoryById(id) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[getCategoryById]", error);
    return null;
  }
  return data ? mapCategory(data) : null;
}
