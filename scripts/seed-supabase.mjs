// One-time migration: populates Supabase from the original static data files.
// Run with: node scripts/seed-supabase.mjs
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(__dirname, "..", ".env.local"), "utf-8");
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
    /* no .env.local, rely on real env vars */
  }
}
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

const categories = [
  {
    id: "napier",
    slug: "napier-plants",
    name: "Napier & Plants",
    tamil_name: "நேப்பியர் & செடிகள்",
    description:
      "Premium Napier grass sticks and fodder plants cultivated for high yield, fast regrowth, and superior livestock nutrition across Tamil Nadu.",
    tamil_description:
      "உயர் மகசூல், விரைவான மறுவளர்ச்சி மற்றும் சிறந்த கால்நடை ஊட்டச்சத்துக்காக வளர்க்கப்படும் பிரீமியம் நேப்பியர் புல் குச்சிகள் மற்றும் தீவனச் செடிகள்.",
    image: "/images/category-napier.png",
    hero_image: "/images/category-napier.png",
    min_order: 500,
    min_order_unit: "sticks",
    gradient: "from-[#15321f]/70 via-[#15321f]/40 to-[#8b5e3c]/50",
    accent: "#15321f",
  },
  {
    id: "chicks",
    slug: "chicks-birds",
    name: "Chicks & Birds",
    tamil_name: "குஞ்சுகள் & பறவைகள்",
    description:
      "Farm-fresh day-old chicks and healthy ornamental birds raised with careful hatching practices and ready for backyard or commercial setups.",
    tamil_description:
      "கவனமாக அடைகாக்கும் முறைகளுடன் வளர்க்கப்பட்ட பண்ணை புதிய ஒருநாள் குஞ்சுகள் மற்றும் ஆரோக்கியமான அலங்காரப் பறவைகள்.",
    image: "/images/category-chicks.png",
    hero_image: "/images/category-chicks.png",
    min_order: 1,
    min_order_unit: "each",
    gradient: "from-[#8b5e3c]/70 via-[#15321f]/35 to-[#0d1e13]/55",
    accent: "#8b5e3c",
  },
  {
    id: "pets",
    slug: "small-pets",
    name: "Small Pets",
    tamil_name: "சிறிய செல்லப்பிராணிகள்",
    description:
      "Healthy small pets including rabbits and hamsters, raised in clean farm conditions and ideal for families seeking gentle companions.",
    tamil_description:
      "சுத்தமான பண்ணை சூழலில் வளர்க்கப்பட்ட முயல்கள் மற்றும் ஹாம்ஸ்டர்கள் உள்ளிட்ட ஆரோக்கியமான சிறிய செல்லப்பிராணிகள்.",
    image: "/images/category-pets.png",
    hero_image: "/images/category-pets.png",
    min_order: 1,
    min_order_unit: "each",
    gradient: "from-[#0d1e13]/65 via-[#8b5e3c]/40 to-[#b88e52]/45",
    accent: "#b88e52",
  },
];

const FEATURED_PRODUCT_IDS = [
  "red-napier",
  "super-napier",
  "co4-napier",
  "day-old-chick",
  "lovebird-pair",
  "dwarf-rabbit",
];

const products = [
  { id: "red-napier", name: "Red Napier", tamil_name: "ரெட் நேப்பியர்", price: 1.8, unit: "per stick", tamil_unit: "ஒரு குச்சி", min_order: 500, min_order_unit: "sticks", category_id: "napier", image: "/images/product-red-napier.png", badge: "bestseller", description: "High-protein Red Napier sticks prized for rapid tillering, lush regrowth, and excellent milk-yield support for dairy herds.", stock_qty: 50000 },
  { id: "super-napier", name: "Super Napier", tamil_name: "சூப்பர் நேப்பியர்", price: 1.5, unit: "per stick", tamil_unit: "ஒரு குச்சி", min_order: 500, min_order_unit: "sticks", category_id: "napier", image: "/images/product-napier.png", badge: "bulk", description: "Fast-growing Super Napier ideal for bulk fodder programs with strong stems and consistent harvest cycles.", stock_qty: 50000 },
  { id: "co4-napier", name: "CO-4 Napier", tamil_name: "CO-4 நேப்பியர்", price: 1.6, unit: "per stick", tamil_unit: "ஒரு குச்சி", min_order: 500, min_order_unit: "sticks", category_id: "napier", image: "/images/product-napier.png", badge: "bestseller", stock_qty: 50000 },
  { id: "co5-napier", name: "CO-5 Napier", tamil_name: "CO-5 நேப்பியர்", price: 1.7, unit: "per stick", tamil_unit: "ஒரு குச்சி", min_order: 500, min_order_unit: "sticks", category_id: "napier", image: "/images/product-napier.png", badge: "new", stock_qty: 50000 },
  { id: "hybrid-napier", name: "Hybrid Napier", tamil_name: "ஹைப்ரிட் நேப்பியர்", price: 1.4, unit: "per stick", tamil_unit: "ஒரு குச்சி", min_order: 500, min_order_unit: "sticks", category_id: "napier", image: "/images/product-napier.png", badge: "bulk", stock_qty: 50000 },
  { id: "pakchong-napier", name: "Pakchong Napier", tamil_name: "பக்சாங் நேப்பியர்", price: 2.0, unit: "per stick", tamil_unit: "ஒரு குச்சி", min_order: 500, min_order_unit: "sticks", category_id: "napier", image: "/images/product-napier.png", badge: "limited", stock_qty: 20000 },
  { id: "bnf-napier", name: "BNF Napier", tamil_name: "BNF நேப்பியர்", price: 1.9, unit: "per stick", tamil_unit: "ஒரு குச்சி", min_order: 500, min_order_unit: "sticks", category_id: "napier", image: "/images/product-napier.png", stock_qty: 50000 },
  { id: "guinea-grass", name: "Guinea Grass", tamil_name: "கினியா புல்", price: 1.2, unit: "per stick", tamil_unit: "ஒரு குச்சி", min_order: 500, min_order_unit: "sticks", category_id: "napier", image: "/images/product-napier.png", badge: "bulk", stock_qty: 50000 },
  { id: "desmanthus", name: "Desmanthus", tamil_name: "டெஸ்மாந்தஸ்", price: 2.5, unit: "per plant", tamil_unit: "ஒரு செடி", min_order: 500, min_order_unit: "plants", category_id: "napier", image: "/images/product-napier.png", badge: "new", stock_qty: 20000 },
  { id: "subabul", name: "Subabul Plants", tamil_name: "சுபாபுல் செடிகள்", price: 3.0, unit: "per plant", tamil_unit: "ஒரு செடி", min_order: 500, min_order_unit: "plants", category_id: "napier", image: "/images/product-napier.png", stock_qty: 20000 },
  { id: "agathi", name: "Agathi Plants", tamil_name: "அகத்தி செடிகள்", price: 2.8, unit: "per plant", tamil_unit: "ஒரு செடி", min_order: 500, min_order_unit: "plants", category_id: "napier", image: "/images/product-napier.png", badge: "limited", stock_qty: 20000 },

  { id: "day-old-chick", name: "Day-Old Chicks", tamil_name: "ஒருநாள் குஞ்சுகள்", price: 45, unit: "each", tamil_unit: "ஒன்று", min_order: 1, min_order_unit: "chick", category_id: "chicks", image: "/images/product-chick.png", badge: "bestseller", description: "Healthy day-old chicks hatched on-farm with strong vitality, ideal for backyard flocks and small commercial starts.", stock_qty: 500 },
  { id: "country-chick", name: "Country Chicks", tamil_name: "நாட்டுக் குஞ்சுகள்", price: 55, unit: "each", tamil_unit: "ஒன்று", min_order: 1, min_order_unit: "chick", category_id: "chicks", image: "/images/product-chick.png", badge: "new", stock_qty: 500 },
  { id: "lovebird-pair", name: "Lovebird Pair", tamil_name: "லவ் பேர்ட் ஜோடி", price: 1200, unit: "per pair", tamil_unit: "ஒரு ஜோடி", min_order: 1, min_order_unit: "pair", category_id: "chicks", image: "/images/product-bird.png", badge: "limited", stock_qty: 30 },
  { id: "finch-pair", name: "Finch Pair", tamil_name: "பிஞ்ச் ஜோடி", price: 800, unit: "per pair", tamil_unit: "ஒரு ஜோடி", min_order: 1, min_order_unit: "pair", category_id: "chicks", image: "/images/product-bird.png", badge: "bulk", stock_qty: 30 },

  { id: "dwarf-rabbit", name: "Dwarf Rabbit", tamil_name: "குள்ள முயல்", price: 650, unit: "each", tamil_unit: "ஒன்று", min_order: 1, min_order_unit: "rabbit", category_id: "pets", image: "/images/product-rabbit.png", badge: "bestseller", description: "Gentle dwarf rabbits raised in clean farm conditions — perfect family companions with calm temperament.", stock_qty: 25 },
  { id: "angora-rabbit", name: "Angora Rabbit", tamil_name: "அங்கோரா முயல்", price: 950, unit: "each", tamil_unit: "ஒன்று", min_order: 1, min_order_unit: "rabbit", category_id: "pets", image: "/images/product-rabbit.png", badge: "limited", stock_qty: 15 },
  { id: "syrian-hamster", name: "Syrian Hamster", tamil_name: "சிரியன் ஹாம்ஸ்டர்", price: 350, unit: "each", tamil_unit: "ஒன்று", min_order: 1, min_order_unit: "hamster", category_id: "pets", image: "/images/product-rabbit.png", badge: "new", stock_qty: 40 },
].map((p) => ({
  ...p,
  featured: FEATURED_PRODUCT_IDS.includes(p.id),
  track_inventory: true,
}));

const categoryContent = {
  napier: {
    specs: [
      { label: "Growth Cycle", value: "45–60 days to first cut" },
      { label: "Planting Season", value: "Year-round (best: Jun–Sep)" },
      { label: "Soil Preference", value: "Well-drained loamy soil" },
      { label: "Water Need", value: "Moderate; drip preferred" },
      { label: "Yield Potential", value: "High biomass per acre" },
      { label: "Packaging", value: "Bundled fresh sticks" },
    ],
    care: [
      "Plant sticks at 45° angle in moist soil within 48 hours of delivery.",
      "Maintain 2–3 ft spacing between rows for airflow and tillering.",
      "Apply organic manure at planting; top-dress after first cut.",
      "Irrigate lightly until rooting, then follow a regular moisture cycle.",
      "Harvest at knee-to-waist height for best protein and regrowth.",
    ],
    origin: [
      "Harvested fresh from Maran Farms fields in Tamil Nadu.",
      "Sorted for healthy nodes and viable planting material.",
      "Bundled the same day to preserve moisture and viability.",
      "Dispatched via verified state-wide farm logistics partners.",
      "Packed to minimize transit stress and drying.",
    ],
    faqs: [
      { q: "What is the minimum order for Napier sticks?", a: "Most Napier and plant varieties require a minimum of 500 sticks or plants per variety to ensure viable bulk dispatch." },
      { q: "How soon should I plant after delivery?", a: "Plant within 24–48 hours while sticks remain moist. Keep bundles shaded and lightly misted if delayed." },
      { q: "Do you deliver across Tamil Nadu?", a: "Yes. We arrange farm-direct logistics across districts. Share your location on WhatsApp for dispatch timing." },
    ],
  },
  chicks: {
    specs: [
      { label: "Age at Dispatch", value: "Day-old / healthy juveniles" },
      { label: "Breeding", value: "On-farm hatching & selection" },
      { label: "Health Check", value: "Viability screened before dispatch" },
      { label: "Feed Start", value: "Starter mash recommended" },
      { label: "Housing", value: "Clean, draft-free brooder" },
      { label: "Transport", value: "Ventilated farm crates" },
    ],
    care: [
      "Prepare a warm brooder (32–35°C) before chicks arrive.",
      "Provide clean water and starter feed immediately on arrival.",
      "Keep bedding dry and change regularly to prevent stress.",
      "Avoid overcrowding; allow space as birds grow.",
      "Monitor for lethargy and contact us on WhatsApp if concerned.",
    ],
    origin: [
      "Hatched and raised under Maran Farms supervision.",
      "Selected for vitality and calm temperament.",
      "Packed in ventilated crates for safe transit.",
      "Dispatched with care instructions for first-week success.",
      "Supported by WhatsApp guidance after delivery.",
    ],
    faqs: [
      { q: "Can I order a single chick or pair?", a: "Yes. Chicks and birds have a minimum order of 1 unit (or 1 pair where sold as pairs)." },
      { q: "How are birds transported?", a: "In ventilated farm crates with careful handling. We coordinate timing so birds travel during cooler hours when possible." },
      { q: "Do you provide care guidance?", a: "Yes. After booking on WhatsApp we share brooding and feeding tips tailored to your order." },
    ],
  },
  pets: {
    specs: [
      { label: "Temperament", value: "Gentle, family-friendly" },
      { label: "Housing", value: "Clean cage / hutch required" },
      { label: "Diet", value: "Species-appropriate feed + greens" },
      { label: "Age", value: "Weaned & ready for home" },
      { label: "Health", value: "Farm-checked before dispatch" },
      { label: "Support", value: "WhatsApp care guidance" },
    ],
    care: [
      "Set up a clean, secure enclosure before your pet arrives.",
      "Provide fresh water and appropriate feed from day one.",
      "Handle gently and allow settling time in a quiet space.",
      "Keep bedding dry and remove waste daily.",
      "Schedule regular health checks and avoid sudden diet changes.",
    ],
    origin: [
      "Raised in clean farm conditions at Maran Farms.",
      "Socialized for calm handling where appropriate.",
      "Health-checked prior to WhatsApp booking confirmation.",
      "Packed securely for short, careful transit.",
      "Accompanied by basic care notes on request.",
    ],
    faqs: [
      { q: "Are small pets suitable for children?", a: "Many are gentle companions, but always supervise young children and follow species-specific handling guidance." },
      { q: "What should I prepare before delivery?", a: "A clean enclosure, bedding, water bottle/bowl, and the right feed. We can advise on WhatsApp before dispatch." },
      { q: "Can I visit or reserve a specific animal?", a: "Message us on WhatsApp with your preference. Availability is confirmed before booking finalization." },
    ],
  },
};

async function main() {
  console.log("Seeding categories...");
  const { error: catError } = await supabase.from("categories").upsert(categories);
  if (catError) throw catError;

  console.log("Seeding products...");
  const { error: prodError } = await supabase.from("products").upsert(products);
  if (prodError) throw prodError;

  console.log("Seeding category content...");
  const contentRows = Object.entries(categoryContent).map(([category_id, c]) => ({
    category_id,
    specs: c.specs,
    care_tips: c.care,
    origin_notes: c.origin,
    faqs: c.faqs,
  }));
  const { error: contentError } = await supabase.from("category_content").upsert(contentRows);
  if (contentError) throw contentError;

  console.log(
    `Done. Seeded ${categories.length} categories, ${products.length} products, ${contentRows.length} content rows.`,
  );
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
