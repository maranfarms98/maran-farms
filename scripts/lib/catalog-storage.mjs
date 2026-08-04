import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PRODUCT_IMAGES_BUCKET = "product-images";

const MIME_BY_EXT = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
};

/** Load .env.local into process.env (does not override existing keys). */
export function loadEnvLocal(projectRoot = join(__dirname, "../..")) {
  try {
    const raw = readFileSync(join(projectRoot, ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* rely on real env */
  }
}

/**
 * Resolve a legacy `/images/foo.png` (or bare `foo.png`) path to a file under
 * scripts/catalog-images/.
 */
export function resolveCatalogImageFile(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return null;
  }
  const filename = imagePath.replace(/^\/?images\//, "").replace(/^\//, "");
  if (!filename || filename.includes("..")) return null;
  const full = join(__dirname, "../catalog-images", filename);
  return existsSync(full) ? { full, filename } : null;
}

function contentTypeFor(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() || "png";
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

/**
 * Upload a local catalog image once (cached by local path). Uses deterministic
 * Storage object keys so re-runs are idempotent.
 *
 * @returns {Promise<string|null>} public URL, or null if file missing
 */
export function createCatalogUploader(supabase) {
  const cache = new Map();

  return async function uploadCatalogImage(localImagePath, folder) {
    if (!localImagePath) return null;
    if (localImagePath.startsWith("http://") || localImagePath.startsWith("https://")) {
      return localImagePath;
    }

    const cacheKey = `${folder}:${localImagePath}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const resolved = resolveCatalogImageFile(localImagePath);
    if (!resolved) {
      console.warn(`  ⚠ missing catalog file for ${localImagePath}`);
      return null;
    }

    const objectPath = `${folder}/${resolved.filename}`;
    const buffer = readFileSync(resolved.full);
    const contentType = contentTypeFor(resolved.filename);

    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(objectPath, buffer, { contentType, upsert: true });

    if (error) {
      throw new Error(`Upload failed for ${objectPath}: ${error.message}`);
    }

    const { data } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(objectPath);

    cache.set(cacheKey, data.publicUrl);
    return data.publicUrl;
  };
}
