import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const PRODUCT_IMAGES_BUCKET = "product-images";

const PUBLIC_PREFIX = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;

/**
 * Extract the object path inside the product-images bucket from a public URL.
 * Returns null for local paths (/images/...) or foreign URLs.
 */
export function storagePathFromPublicUrl(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    const idx = parsed.pathname.indexOf(PUBLIC_PREFIX);
    if (idx === -1) return null;
    return decodeURIComponent(parsed.pathname.slice(idx + PUBLIC_PREFIX.length));
  } catch {
    return null;
  }
}

/** Best-effort delete; never throws — orphans are preferable to failing a save. */
export async function deleteStorageObject(url) {
  const objectPath = storagePathFromPublicUrl(url);
  if (!objectPath) return;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([objectPath]);

  if (error) {
    console.error("[storage delete]", objectPath, error.message);
  }
}

/** Delete previous Storage object when the public URL changed. */
export async function replaceStorageObject(previousUrl, nextUrl) {
  if (!previousUrl || previousUrl === nextUrl) return;
  await deleteStorageObject(previousUrl);
}
