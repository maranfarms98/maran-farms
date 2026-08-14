import { DISTRICTS } from "@/data/districts";
import { INSTAGRAM_JOURNEY_POSTS } from "@/data/instagram-posts";
import { getProductGuide } from "@/data/product-guides";
import { testimonials } from "@/data/testimonials";
import { canonicalUrl, HOME_DESCRIPTION, productMetaDescription } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  OPENING_HOURS,
  SITE_NAME,
  TELEPHONE_E164,
  toAbsoluteUrl,
} from "@/lib/site";

function reviewNodes(list = testimonials) {
  return list.map((t) => ({
    "@type": "Review",
    author: { "@type": "Person", name: t.name },
    reviewBody: t.review,
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(t.rating),
      bestRating: "5",
    },
  }));
}

export function aggregateRatingNode(list = testimonials) {
  if (!list.length) return undefined;
  const sum = list.reduce((acc, t) => acc + t.rating, 0);
  return {
    "@type": "AggregateRating",
    ratingValue: (sum / list.length).toFixed(1),
    reviewCount: String(list.length),
    bestRating: "5",
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    image: toAbsoluteUrl("/images/logo.png"),
    url: canonicalUrl("/"),
    telephone: TELEPHONE_E164,
    email: CONTACT_EMAIL,
    description: HOME_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    areaServed: DISTRICTS.map((d) => ({
      "@type": "AdministrativeArea",
      name: `${d.name}, Tamil Nadu`,
    })),
    sameAs: [INSTAGRAM_URL],
    openingHours: OPENING_HOURS,
    aggregateRating: aggregateRatingNode(),
    review: reviewNodes(),
  };
}

export function productJsonLd(product, extraReviews = []) {
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
  if (extraReviews.length) {
    node.review = reviewNodes(extraReviews);
    node.aggregateRating = aggregateRatingNode(extraReviews);
  }
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

export function reviewsForProduct(productId) {
  return testimonials.filter((t) => t.productId === productId);
}
