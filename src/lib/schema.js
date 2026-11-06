import { DISTRICTS } from "@/data/districts";
import { INSTAGRAM_JOURNEY_POSTS } from "@/data/instagram-posts";
import { getProductGuide } from "@/data/product-guides";
import { canonicalUrl, HOME_DESCRIPTION, productMetaDescription } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  FARM_CITY,
  FARM_COUNTRY,
  FARM_LOCALITY,
  FARM_POSTAL_CODE,
  FARM_REGION,
  GOOGLE_MAPS_URL,
  GOOGLE_PLACE_URL,
  INSTAGRAM_URL,
  OPENING_HOURS,
  SITE_NAME,
  TELEPHONE_E164,
  toAbsoluteUrl,
} from "@/lib/site";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: canonicalUrl("/"),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Farm", "LocalBusiness"],
    name: SITE_NAME,
    image: toAbsoluteUrl("/images/logo.png"),
    url: canonicalUrl("/"),
    telephone: TELEPHONE_E164,
    email: CONTACT_EMAIL,
    description: HOME_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: FARM_LOCALITY,
      addressLocality: FARM_CITY,
      addressRegion: FARM_REGION,
      postalCode: FARM_POSTAL_CODE,
      addressCountry: FARM_COUNTRY,
    },
    hasMap: GOOGLE_MAPS_URL,
    areaServed: DISTRICTS.map((d) => ({
      "@type": "AdministrativeArea",
      name: `${d.name}, Tamil Nadu`,
    })),
    sameAs: [INSTAGRAM_URL, GOOGLE_PLACE_URL],
    openingHours: OPENING_HOURS,
  };
}

export function productJsonLd(product) {
  const url = canonicalUrl(`/product/${product.id}`);
  const node = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productMetaDescription(product, getProductGuide(product.id)),
    image: toAbsoluteUrl(product.image),
    sku: product.id,
    brand: { "@type": "Brand", name: SITE_NAME },
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: String(product.price),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  return node;
}

export function faqPageJsonLd(faqs = []) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.href),
    })),
  };
}

export function videoObjectJsonLd() {
  return INSTAGRAM_JOURNEY_POSTS.map((post) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: post.caption,
    description: post.alt,
    contentUrl: toAbsoluteUrl(post.src),
    thumbnailUrl: toAbsoluteUrl("/images/home-hero.jpg"),
    publisher: { "@type": "Organization", name: SITE_NAME },
  }));
}

