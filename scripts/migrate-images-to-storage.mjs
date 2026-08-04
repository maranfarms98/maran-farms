// Migrate product/category image columns from /images/... static paths
// to public Supabase Storage URLs in the product-images bucket.
//
// Run: npm run migrate:images
// Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
// and a public Storage bucket named product-images.

import { createClient } from "@supabase/supabase-js";
import {
  createCatalogUploader,
  loadEnvLocal,
  resolveCatalogImageFile,
} from "./lib/catalog-storage.mjs";

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);
const upload = createCatalogUploader(supabase);

function needsMigration(url) {
  return Boolean(url && resolveCatalogImageFile(url));
}

async function migrateCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, image, hero_image");
  if (error) throw error;

  let updated = 0;
  for (const row of data || []) {
    const patch = {};
    if (needsMigration(row.image)) {
      patch.image = await upload(row.image, "categories");
    }
    if (needsMigration(row.hero_image)) {
      patch.hero_image = await upload(row.hero_image, "categories");
    }
    if (!Object.keys(patch).length) continue;

    const { error: updateError } = await supabase
      .from("categories")
      .update(patch)
      .eq("id", row.id);
    if (updateError) throw updateError;
    updated += 1;
    console.log(`  category ${row.id} → Storage`);
  }
  return updated;
}

async function migrateProducts() {
  const { data, error } = await supabase.from("products").select("id, image");
  if (error) throw error;

  let updated = 0;
  for (const row of data || []) {
    if (!needsMigration(row.image)) continue;
    const image = await upload(row.image, "products");
    if (!image) continue;

    const { error: updateError } = await supabase
      .from("products")
      .update({ image, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (updateError) throw updateError;
    updated += 1;
    console.log(`  product ${row.id} → Storage`);
  }
  return updated;
}

async function main() {
  console.log("Migrating catalog images to Supabase Storage...");
  const cats = await migrateCategories();
  const prods = await migrateProducts();
  console.log(`Done. Updated ${cats} categories and ${prods} products.`);
}

main().catch((err) => {
  console.error("Migration failed:", err.message || err);
  process.exit(1);
});
