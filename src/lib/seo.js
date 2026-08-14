import { GENERIC_DESCRIPTION } from "@/data/constants";
import { formatPrice } from "@/lib/format";
import { getSiteUrl, SITE_NAME, toAbsoluteUrl } from "@/lib/site";

export const HOME_TITLE =
  "Maran Farms | Napier Grass, Day-Old Chicks & Small Pets — Tamil Nadu";
export const HOME_DESCRIPTION =
  "Buy Napier grass sticks, farm-fresh day-old chicks, and healthy small pets from Maran Farms. WhatsApp ordering and delivery across Tamil Nadu.";
export const HOME_H1 =
  "Napier Plants, Farm-Fresh Chicks & Small Pets — Delivered Across Tamil Nadu";

export const DEFAULT_OG_IMAGE = "/images/logo.png";

export function canonicalUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${getSiteUrl()}/`;
  return `${getSiteUrl()}${normalized.replace(/\/$/, "")}`;
}

export function productImageAlt(name) {
  return `${name} – Maran Farms Tamil Nadu`;
}

export function categoryImageAlt(name) {
  return `${name} from Maran Farms, Tamil Nadu`;
}

export function productMetaDescription(product, guide) {
  if (product?.description?.trim()) return product.description.trim();
  if (guide?.metaDescription) return guide.metaDescription;
  return GENERIC_DESCRIPTION;
}

export function productPageTitle(product) {
  const price = formatPrice(product.price);
  const unit = product.unit ? ` ${product.unit}` : "";
  return `${product.name} – ${price}${unit} | Maran Farms Tamil Nadu`;
}

export function categoryPageTitle(category) {
  return `${category.name} Online | Maran Farms Tamil Nadu`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
}) {
  const url = canonicalUrl(path);
  const ogImage = toAbsoluteUrl(image || DEFAULT_OG_IMAGE);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function noindexMetadata(title = SITE_NAME) {
  return {
    title,
    robots: { index: false, follow: false },
  };
}
