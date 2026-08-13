import { cookies } from "next/headers";
import { DM_Sans, Fraunces, Outfit, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/chrome/providers";
import { getAllCategories } from "@/data/categories";
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

const dmSans = DM_Sans({
  variable: "--font-bazaar-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-bazaar-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Maran Farms — Tamil Nadu's Premium Agricultural Brand",
    template: "%s · Maran Farms",
  },
  description:
    "Cultivating superior Napier grass plants, hatching farm-fresh poultry chicks, and raising healthy small pets. Order via WhatsApp across Tamil Nadu.",
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default async function RootLayout({ children }) {
  const [categories, cookieStore] = await Promise.all([
    getAllCategories(),
    cookies(),
  ]);
  const themeCookie = cookieStore.get("mf-theme")?.value;
  const initialTheme =
    themeCookie === "canopy" || themeCookie === "bazaar" ? themeCookie : "classic";

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${playfair.variable} ${dmSans.variable} ${fraunces.variable} antialiased`}
    >
      <body className="flex min-h-vvh flex-col font-sans">
        <Providers categories={categories} initialTheme={initialTheme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
