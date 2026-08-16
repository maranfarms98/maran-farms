import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { getAllBlogSlugs, getBlogPost } from "@/data/blog";
import { markdownComponents } from "@/components/blog/markdown";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { TamilCaption } from "@/components/ui/tamil-caption";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Farm Diary" };
  return pageMetadata({
    title: `${post.title} | Maran Farms`,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.image,
    type: "article",
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Farm Diary", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <article className="container-farm max-w-3xl pt-24 pb-24 md:pt-28 md:pb-20">
        <Breadcrumbs items={crumbs} />
        {post.date ? (
          <p className="text-eyebrow mt-8 text-farm-sage">
            {new Date(post.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        ) : null}
        <h1 className="font-heading mt-2 text-[1.65rem] leading-tight text-farm-green-dark md:text-4xl">
          {post.title}
        </h1>
        {post.tamil ? (
          <TamilCaption className="mt-2">{post.tamil}</TamilCaption>
        ) : null}
        <div className="relative mt-8 aspect-video overflow-hidden rounded-[1.5rem] bg-farm-warm">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width:768px) 100vw, 48rem"
          />
        </div>
        <div className="mt-8">
          <ReactMarkdown components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}
