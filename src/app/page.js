import { Hero } from "@/components/home/hero";
import { StorySection } from "@/components/home/story-section";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustDashboard } from "@/components/home/trust-dashboard";
import { Testimonials } from "@/components/home/testimonials";
import { WhatsAppSection } from "@/components/home/whatsapp-section";
import { InstagramSection } from "@/components/home/instagram-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StorySection />
      <CategoriesGrid />
      <FeaturedProducts />
      <TrustDashboard />
      <Testimonials />
      <WhatsAppSection />
      <InstagramSection />
    </>
  );
}
