import { FeaturedProducts } from "@/components/home/featured-products";
import { HarvestPaths } from "@/components/home/harvest-paths";
import { Hero } from "@/components/home/hero";
import { InstagramSection } from "@/components/home/instagram-section";
import { Testimonials } from "@/components/home/testimonials";
import { TrustDashboard } from "@/components/home/trust-dashboard";
import { WhatsAppSection } from "@/components/home/whatsapp-section";
import { getAllCategories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getAllCategories(),
    getFeaturedProducts(),
  ]);

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
