import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function readPostFile(filename) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.md$/, "");
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || "",
    image: data.image || "/images/home-hero.jpg",
    tamil: data.tamil || "",
    content,
  };
}

export function getAllBlogPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map(readPostFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllBlogSlugs() {
  return getAllBlogPosts().map((post) => post.slug);
}

export function getBlogPost(slug) {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return readPostFile(`${slug}.md`);
}
