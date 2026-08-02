import { getSupabaseServerClient } from "@/lib/supabase/server";

const EMPTY_CONTENT = { specs: [], care: [], origin: [], faqs: [] };

export async function getDetailContent(categoryId) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return EMPTY_CONTENT;
  const { data, error } = await supabase
    .from("category_content")
    .select("*")
    .eq("category_id", categoryId)
    .maybeSingle();
  if (error) {
    console.error("[getDetailContent]", error);
    return EMPTY_CONTENT;
  }
  if (!data) return EMPTY_CONTENT;
  return {
    specs: data.specs || [],
    care: data.care_tips || [],
    origin: data.origin_notes || [],
    faqs: data.faqs || [],
  };
}
