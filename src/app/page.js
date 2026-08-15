import { FarmLocation } from "@/components/home/farm-location";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HarvestPaths } from "@/components/home/harvest-paths";
import { Hero } from "@/components/home/hero";
import { InstagramSection } from "@/components/home/instagram-section";
import { Testimonials } from "@/components/home/testimonials";
// import { TrustDashboard } from "@/components/home/trust-dashboard";
// import { WhatsAppSection } from "@/components/home/whatsapp-section";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllCategories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";
import { videoObjectJsonLd } from "@/lib/schema";
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  image: "/images/home-hero.jpg",
});

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getAllCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      {videoObjectJsonLd().map((video) => (
        <JsonLd key={video.contentUrl} data={video} />
      ))}
      <Hero />
      <HarvestPaths categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      {/* <TrustDashboard /> */}
      <FarmLocation />
      <Testimonials />
      {/* <WhatsAppSection demoImage={featuredProducts[0]?.image} /> */}
      <InstagramSection />
    </>
  );
}
