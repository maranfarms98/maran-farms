"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/home/hero";
import { HarvestPaths } from "@/components/home/harvest-paths";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustDashboard } from "@/components/home/trust-dashboard";
import { Testimonials } from "@/components/home/testimonials";
import { WhatsAppSection } from "@/components/home/whatsapp-section";
import { InstagramSection } from "@/components/home/instagram-section";
import { useTheme } from "@/context/theme-context";

const HomeCanopy = dynamic(() => import("@/components/theme-canopy/home/home-canopy"), {
  ssr: false,
});

export function HomeThemeGate({ categories, featuredProducts }) {
  const { theme } = useTheme();

  if (theme === "canopy") {
    return <HomeCanopy categories={categories} featuredProducts={featuredProducts} />;
  }

  return (
    <>
      <Hero />
      <HarvestPaths categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <TrustDashboard />
      <Testimonials />
      <WhatsAppSection />
      <InstagramSection />
    </>
  );
}
