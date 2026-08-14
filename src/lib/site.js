export const WHATSAPP_NUMBER = "919600267271";
export const WHATSAPP_DISPLAY = "+91 96002 67271";
export const INSTAGRAM_URL = "https://www.instagram.com/maran_farms";
export const CONTACT_EMAIL = "hello@maranfarms.in";
export const SITE_NAME = "Maran Farms";
export const DEFAULT_SITE_URL = "https://maranfarms.in";
export const OPENING_HOURS = "Mo-Su 08:00-18:00";
export const TELEPHONE_E164 = "+919600267271";

/** Public origin for canonicals, sitemap, and JSON-LD. Never the Vercel preview host. */
export function getSiteUrl() {
  const raw =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

export function toAbsoluteUrl(path) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
