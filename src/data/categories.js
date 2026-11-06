import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const CATALOG_REVALIDATE_SECONDS = 60;

function publicCatalog(fn, key) {
  return cache(
    unstable_cache(fn, [key], {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: ["catalog"],
    }),
  );
}

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

export const getAllCategories = publicCatalog(async () => {
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
}, "categories-all");

export const getCategoryBySlug = publicCatalog(async (slug) => {
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
}, "category-by-slug");

export const getCategoryById = publicCatalog(async (id) => {
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
}, "category-by-id");
