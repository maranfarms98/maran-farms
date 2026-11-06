export const WHATSAPP_NUMBER = "916380261643";
export const WHATSAPP_DISPLAY = "+91 6380261643";
export const INSTAGRAM_URL = "https://www.instagram.com/maran_farms";
export const CONTACT_EMAIL = "maranfarms98@gmail.com";
export const SITE_NAME = "Maran Farms";
export const DEFAULT_SITE_URL = "https://www.maranfarms.com";
export const OPENING_HOURS = "Mo-Su 08:00-18:00";
export const TELEPHONE_E164 = "+916380261643";

export const FARM_LOCALITY = "Pallamaruthapatti";
export const FARM_LOCALITY_TA = "பள்ளமருதப்பட்டி";
export const FARM_CITY = "Karur";
export const FARM_CITY_TA = "கரூர்";
export const FARM_REGION = "Tamil Nadu";
export const FARM_POSTAL_CODE = "639002";
export const FARM_COUNTRY = "IN";
export const FARM_ADDRESS_SHORT = "Pallamaruthapatti, Karur";
export const FARM_ADDRESS_LINE = "Pallamaruthapatti, Karur, Tamil Nadu 639002";

const MAPS_QUERY = "Maran farms,karur Pallamaruthapatti";
export const GOOGLE_PLACE_URL = "https://share.google/rpQFHM7PpUlPER1Rh";
export const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
export const GOOGLE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_QUERY)}`;
export const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent("Maran farms, karur Pallamaruthapatti")}&z=15&output=embed`;

/**
 * Public origin for canonicals, sitemap, and JSON-LD.
 * The old .in host and Vercel preview hosts are never used, so a stale
 * SITE_URL cannot put maranfarms.in URLs in a sitemap served on .com.
 */
function publicOrigin(raw) {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    const host = url.hostname.toLowerCase();
    if (
      host === "maranfarms.in" ||
      host === "www.maranfarms.in" ||
      host.endsWith(".vercel.app")
    ) {
      return null;
    }
    if (host === "maranfarms.com") {
      url.protocol = "https:";
      url.hostname = "www.maranfarms.com";
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return (
    publicOrigin(process.env.SITE_URL) ||
    publicOrigin(process.env.NEXT_PUBLIC_SITE_URL) ||
    DEFAULT_SITE_URL
  );
}

export function toAbsoluteUrl(path) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
