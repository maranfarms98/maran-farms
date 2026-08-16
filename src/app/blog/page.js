import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts } from "@/data/blog";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { TamilCaption } from "@/components/ui/tamil-caption";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Farm Diary", href: "/blog" },
];

export const metadata = pageMetadata({
  title: "Weekly Farm Diary | Napier, Chicks & Farm Notes — Maran Farms",
  description:
    "Field notes from Maran Farms in Karur: CO-4 vs Red Napier, day-old chicks for backyard flocks, and fodder advice for Tamil Nadu farmers.",
  path: "/blog",
  image: "/images/home-hero.jpg",
});

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="container-farm pt-24 pb-24 md:pt-28 md:pb-20">
        <Breadcrumbs items={crumbs} />
        <p className="text-eyebrow mt-8 text-farm-green">Weekly Farm Diary</p>
        <h1 className="font-heading mt-2 text-[1.65rem] leading-tight text-farm-green-dark md:text-4xl">
          Notes from the farm
        </h1>
        <TamilCaption className="mt-2">பண்ணைக் குறிப்புகள்</TamilCaption>
        <p className="mt-4 max-w-2xl text-farm-sage">
          Fodder comparisons, chick batches, and the questions Tamil Nadu
          farmers actually send on WhatsApp — written from our Karur fields.
        </p>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="focus-ring group block overflow-hidden rounded-[2rem] border border-farm-green-dark/8 bg-farm-warm shadow-soft"
              >
                <div className="relative aspect-video">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  {post.date ? (
                    <p className="text-eyebrow text-farm-sage">
                      {new Date(post.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  ) : null}
                  <h2 className="font-heading mt-2 text-xl text-farm-green-dark group-hover:text-farm-green">
                    {post.title}
                  </h2>
                  {post.tamil ? (
                    <TamilCaption className="mt-1">{post.tamil}</TamilCaption>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-farm-sage">
                    {post.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
