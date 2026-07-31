"use client";

import { HeroCanopy } from "@/components/theme-canopy/home/hero-canopy";
import { HarvestPathsCanopy } from "@/components/theme-canopy/home/harvest-paths-canopy";
import { FeaturedProductsCanopy } from "@/components/theme-canopy/home/featured-products-canopy";
import { TrustDashboardCanopy } from "@/components/theme-canopy/home/trust-dashboard-canopy";
import { TestimonialsCanopy } from "@/components/theme-canopy/home/testimonials-canopy";
import { WhatsAppSectionCanopy } from "@/components/theme-canopy/home/whatsapp-section-canopy";
import { InstagramSectionCanopy } from "@/components/theme-canopy/home/instagram-section-canopy";
import { CanopyDivider } from "@/components/theme-canopy/shared/canopy-divider";

export default function HomeCanopy({ categories, featuredProducts }) {
  return (
    <>
      <HeroCanopy />
      <HarvestPathsCanopy categories={categories} />
      <CanopyDivider className="bg-canopy-forest" />
      <FeaturedProductsCanopy products={featuredProducts} />
      <TrustDashboardCanopy />
      <TestimonialsCanopy />
      <CanopyDivider className="bg-canopy-deep" />
      <WhatsAppSectionCanopy />
      <InstagramSectionCanopy />
    </>
  );
}
