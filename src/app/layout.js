import { Outfit, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/chrome/providers";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllCategories } from "@/data/categories";
import { localBusinessJsonLd } from "@/lib/schema";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const homeOg = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  siteName: "Maran Farms",
  locale: "en_IN",
  type: "website",
  images: [{ url: "/images/home-hero.jpg", alt: HOME_TITLE }],
};

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: HOME_TITLE,
    template: "%s · Maran Farms",
  },
  description: HOME_DESCRIPTION,
  openGraph: homeOg,
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/images/home-hero.jpg"],
  },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
};

export default async function RootLayout({ children }) {
  const categories = await getAllCategories();

  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${playfair.variable} antialiased`}
    >
      <body className="flex min-h-vvh flex-col font-sans">
        <JsonLd data={localBusinessJsonLd()} />
        <Providers categories={categories}>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
