import { Hero } from "@/components/home/hero";
import { HarvestPaths } from "@/components/home/harvest-paths";
import { StorySection } from "@/components/home/story-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustDashboard } from "@/components/home/trust-dashboard";
import { Testimonials } from "@/components/home/testimonials";
import { WhatsAppSection } from "@/components/home/whatsapp-section";
import { InstagramSection } from "@/components/home/instagram-section";
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
      {/* <StorySection /> */}
      <FeaturedProducts products={featuredProducts} />
      <TrustDashboard />
      <Testimonials />
      <WhatsAppSection />
      <InstagramSection />
    </>
  );
}
