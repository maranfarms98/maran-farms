import { getAllBlogSlugs } from "@/data/blog";
import { getAllCategories } from "@/data/categories";
import { getAllDistricts } from "@/data/districts";
import { getAllProducts } from "@/data/products";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap() {
  const site = getSiteUrl();
  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);
  const districts = getAllDistricts();
  const posts = getAllBlogSlugs();

  const entry = (path, changeFrequency, priority) => ({
    url: path === "/" ? `${site}/` : `${site}${path}`,
    changeFrequency,
    priority,
  });

  return [
    entry("/", "weekly", 1),
    entry("/privacy-policy", "yearly", 0.3),
    entry("/terms-of-service", "yearly", 0.3),
    entry("/data-deletion", "yearly", 0.3),
    entry("/blog", "weekly", 0.8),
    ...categories.map((c) => entry(`/category/${c.slug}`, "weekly", 0.8)),
    ...products.map((p) => entry(`/product/${p.id}`, "weekly", 0.7)),
    ...posts.map((slug) => entry(`/blog/${slug}`, "monthly", 0.6)),
    ...districts.map((d) => entry(`/delivery/${d.slug}`, "monthly", 0.6)),
  ];
}
