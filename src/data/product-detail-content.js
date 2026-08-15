import { getSupabaseServerClient } from "@/lib/supabase/server";

const EMPTY_CONTENT = { specs: [], care: [], origin: [], faqs: [] };

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Stored as plain text instead of a JSON array.
    }
    return trimmed
      .split(/\n+/)
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

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
    specs: asArray(data.specs),
    care: asArray(data.care_tips),
    origin: asArray(data.origin_notes),
    faqs: asArray(data.faqs),
  };
}
