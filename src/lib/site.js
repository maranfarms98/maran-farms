export const WHATSAPP_NUMBER = "919600267271";
export const WHATSAPP_DISPLAY = "+91 96002 67271";
export const INSTAGRAM_URL = "https://www.instagram.com/maran_farms";
export const CONTACT_EMAIL = "hello@maranfarms.in";
export const SITE_NAME = "Maran Farms";
export const DEFAULT_SITE_URL = "https://maranfarms.in";
export const OPENING_HOURS = "Mo-Su 08:00-18:00";
export const TELEPHONE_E164 = "+919600267271";

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
