export const productDetailContent = {
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
      {
        q: "What is the minimum order for Napier sticks?",
        a: "Most Napier and plant varieties require a minimum of 500 sticks or plants per variety to ensure viable bulk dispatch.",
      },
      {
        q: "How soon should I plant after delivery?",
        a: "Plant within 24–48 hours while sticks remain moist. Keep bundles shaded and lightly misted if delayed.",
      },
      {
        q: "Do you deliver across Tamil Nadu?",
        a: "Yes. We arrange farm-direct logistics across districts. Share your location on WhatsApp for dispatch timing.",
      },
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
      {
        q: "Can I order a single chick or pair?",
        a: "Yes. Chicks and birds have a minimum order of 1 unit (or 1 pair where sold as pairs).",
      },
      {
        q: "How are birds transported?",
        a: "In ventilated farm crates with careful handling. We coordinate timing so birds travel during cooler hours when possible.",
      },
      {
        q: "Do you provide care guidance?",
        a: "Yes. After booking on WhatsApp we share brooding and feeding tips tailored to your order.",
      },
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
      {
        q: "Are small pets suitable for children?",
        a: "Many are gentle companions, but always supervise young children and follow species-specific handling guidance.",
      },
      {
        q: "What should I prepare before delivery?",
        a: "A clean enclosure, bedding, water bottle/bowl, and the right feed. We can advise on WhatsApp before dispatch.",
      },
      {
        q: "Can I visit or reserve a specific animal?",
        a: "Message us on WhatsApp with your preference. Availability is confirmed before booking finalization.",
      },
    ],
  },
};

export function getDetailContent(categoryId) {
  return productDetailContent[categoryId] || productDetailContent.napier;
}
