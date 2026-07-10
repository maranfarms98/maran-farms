import { Outfit, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/chrome/providers";
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
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${playfair.variable} antialiased`}
    >
      <body className="flex min-h-vvh flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
