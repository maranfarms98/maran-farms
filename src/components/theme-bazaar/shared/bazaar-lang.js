"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const BazaarLangContext = createContext(null);

const COPY = {
  en: {
    shop: "Shop",
    bag: "Bag",
    favorites: "Saved",
    orders: "Orders",
    login: "Login",
    logout: "Logout",
    whatsapp: "WhatsApp",
    continueCheckout: "Continue to pay",
    orderWhatsApp: "Confirm on WhatsApp",
    addToBag: "Add to bag",
    reviewBag: "Review bag",
    inStock: "In stock",
    outOfStock: "Out of stock",
    limitedStock: "Limited stock",
    deliveryCheck: "We deliver here",
    outsideArea: "Outside usual delivery — we'll confirm on WhatsApp",
    pinLabel: "PIN code",
    districtLabel: "District",
    addressLabel: "Full address",
    notesLabel: "Order notes (optional)",
    emptyBag: "Your bag is empty",
    emptyFav: "No saved products yet",
    browse: "Browse products",
    langToggle: "தமிழ்",
    heroLine: "Farm stock. Order in minutes.",
    heroSub: "Napier, chicks & pets — delivered across Tamil Nadu.",
    categories: "Shop by category",
    featured: "Ready to order",
    howItWorks: "How ordering works",
    step1: "Pick products",
    step2: "Add to bag",
    step3: "Pay or WhatsApp",
    roadmap: "Coming next",
    roadmap30: "30 days",
    roadmap60: "60 days",
    roadmap90: "90 days",
    minOrder: "Minimum order",
    searchPlaceholder: "Search products…",
    total: "Total",
    clearBag: "Clear",
  },
  ta: {
    shop: "கடை",
    bag: "பை",
    favorites: "சேமித்தவை",
    orders: "ஆர்டர்கள்",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    whatsapp: "வாட்ஸ்அப்",
    continueCheckout: "பணம் செலுத்த",
    orderWhatsApp: "வாட்ஸ்அப்பில் உறுதி",
    addToBag: "பையில் சேர்",
    reviewBag: "பையை பார்க்க",
    inStock: "இருப்பில் உள்ளது",
    outOfStock: "இருப்பில் இல்லை",
    limitedStock: "குறைந்த இருப்பு",
    deliveryCheck: "இங்கே டெலிவரி உண்டு",
    outsideArea: "வழக்கமான பகுதிக்கு வெளியே — வாட்ஸ்அப்பில் உறுதி",
    pinLabel: "அஞ்சல் குறியீடு",
    districtLabel: "மாவட்டம்",
    addressLabel: "முழு முகவரி",
    notesLabel: "குறிப்பு (விருப்பம்)",
    emptyBag: "பை காலியாக உள்ளது",
    emptyFav: "சேமித்த பொருட்கள் இல்லை",
    browse: "பொருட்களை பார்க்க",
    langToggle: "EN",
    heroLine: "பண்ணை பொருட்கள். நிமிடங்களில் ஆர்டர்.",
    heroSub: "நேப்பியர், குஞ்சுகள், செல்லப்பிராணிகள் — தமிழ்நாடு முழுவதும்.",
    categories: "வகை வாரியாக",
    featured: "ஆர்டருக்கு தயார்",
    howItWorks: "ஆர்டர் செய்வது எப்படி",
    step1: "பொருள் தேர்வு",
    step2: "பையில் சேர்",
    step3: "பே அல்லது வாட்ஸ்அப்",
    roadmap: "அடுத்து வரும்",
    roadmap30: "30 நாட்கள்",
    roadmap60: "60 நாட்கள்",
    roadmap90: "90 நாட்கள்",
    minOrder: "குறைந்தபட்ச ஆர்டர்",
    searchPlaceholder: "பொருட்களை தேடு…",
    total: "மொத்தம்",
    clearBag: "அழி",
  },
};

export function BazaarLangProvider({ children }) {
  const [lang, setLang] = useState("en");
  const toggle = useCallback(() => {
    setLang((l) => (l === "en" ? "ta" : "en"));
  }, []);
  const t = useMemo(() => COPY[lang] || COPY.en, [lang]);
  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang, toggle, t]);
  return <BazaarLangContext.Provider value={value}>{children}</BazaarLangContext.Provider>;
}

export function useBazaarLang() {
  const ctx = useContext(BazaarLangContext);
  if (!ctx) {
    return {
      lang: "en",
      setLang: () => {},
      toggle: () => {},
      t: COPY.en,
    };
  }
  return ctx;
}
