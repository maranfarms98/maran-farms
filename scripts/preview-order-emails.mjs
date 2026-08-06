/**
 * Generate static HTML previews of order emails.
 *
 * Usage:  npm run preview:emails
 * Output: tmp/email-preview-customer.html
 *         tmp/email-preview-admin.html
 *
 * Open the files in a browser to review. Uses SITE_URL from .env.local when set
 * so product images resolve (default: http://localhost:3001).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createJiti } from "jiti";
import { loadEnvLocal } from "./lib/catalog-storage.mjs";

loadEnvLocal();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, {
  alias: {
    "@": join(root, "src"),
  },
});

const { customerOrderEmail, adminOrderEmail } = jiti(
  join(root, "src/lib/emails/templates.js"),
);

const siteUrl =
  process.env.SITE_URL?.trim() ||
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "http://localhost:3001";

const sampleOrder = {
  id: "55ffdcd8-a1b2-c3d4-e5f6-789012345678",
  name: "ARUN R",
  phone: "9600267273",
  email: "arunmurugesan0205@gmail.com",
  address: "Pallamaruthapatti\nSivakasi, Tamil Nadu 626123",
  status: "paid",
  origin: "website",
  payment_method: "razorpay",
  total: 845,
  created_at: new Date().toISOString(),
  items: [
    {
      productId: "p1",
      name: "Day-Old Chicks",
      price: 45,
      unit: "each",
      quantity: 1,
      lineTotal: 45,
      image: "/images/logo.png",
    },
    {
      productId: "p2",
      name: "CO-4 Napier",
      price: 1.6,
      unit: "stick",
      quantity: 500,
      lineTotal: 800,
      image: null,
    },
  ],
};

const outDir = join(root, "tmp");
mkdirSync(outDir, { recursive: true });

const customer = customerOrderEmail(sampleOrder, { siteUrl });
const admin = adminOrderEmail(sampleOrder, { siteUrl });

const customerPath = join(outDir, "email-preview-customer.html");
const adminPath = join(outDir, "email-preview-admin.html");

writeFileSync(customerPath, customer.html, "utf8");
writeFileSync(adminPath, admin.html, "utf8");

console.log("Generated email previews:\n");
console.log(`  Customer  ${pathToFileURL(customerPath).href}`);
console.log(`  Admin     ${pathToFileURL(adminPath).href}`);
console.log("\nSubjects:");
console.log(`  Customer  ${customer.subject}`);
console.log(`  Admin     ${admin.subject}`);
console.log(`\nSITE_URL   ${siteUrl}`);
