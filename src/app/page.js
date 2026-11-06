import dynamic from "next/dynamic";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HarvestPaths } from "@/components/home/harvest-paths";
import { Hero } from "@/components/home/hero";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllCategories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";
import { videoObjectJsonLd } from "@/lib/schema";
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "@/lib/seo";

const FarmLocation = dynamic(() =>
  import("@/components/home/farm-location").then((mod) => mod.FarmLocation),
);
const Testimonials = dynamic(() =>
  import("@/components/home/testimonials").then((mod) => mod.Testimonials),
);
const InstagramSection = dynamic(() =>
  import("@/components/home/instagram-section").then((mod) => mod.InstagramSection),
);

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
      <FarmLocation />
      <Testimonials />
      <InstagramSection />
    </>
  );
}
