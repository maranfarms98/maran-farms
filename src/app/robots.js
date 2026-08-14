import { getSiteUrl } from "@/lib/site";

export default function robots() {
  const site = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/api", "/checkout", "/login"],
    },
    sitemap: `${site}/sitemap.xml`,
  };
}
