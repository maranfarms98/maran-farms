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

const FALLBACK_ENV_FILES = [".env.staging"];

function applyEnvFile(filePath, { override = false } = {}) {
  const raw = readFileSync(filePath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (override || !process.env[key]) process.env[key] = value;
  }
}

/**
 * Load local env files into process.env (does not override existing keys).
 * Prefer vars already set (e.g. by `scripts/with-env.mjs production`).
 * Otherwise fill from `.env.staging`.
 */
export function loadEnvLocal(projectRoot = join(__dirname, "../..")) {
  for (const name of FALLBACK_ENV_FILES) {
    const filePath = join(projectRoot, name);
    if (!existsSync(filePath)) continue;
    applyEnvFile(filePath);
  }
}

/**
 * Load `.env.<name>` and override existing keys.
 * Throws if the file is missing so prod scripts cannot silently hit staging.
 */
export function loadNamedEnv(name, projectRoot = join(__dirname, "../..")) {
  if (name !== "staging" && name !== "production") {
    throw new Error(`Unknown env "${name}". Use staging or production.`);
  }
  const fileName = `.env.${name}`;
  const filePath = join(projectRoot, fileName);
  if (!existsSync(filePath)) {
    throw new Error(
      `Missing ${fileName}. Create it in the project root with the ${name} Supabase keys.`,
    );
  }
  applyEnvFile(filePath, { override: true });
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
