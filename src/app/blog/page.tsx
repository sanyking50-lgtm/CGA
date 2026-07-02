import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BlogPageClient } from "./blog-page-client";

export const metadata: Metadata = {
  title: "Blog | Create Growth Agency",
  description:
    "Expert YouTube growth tips, editing tutorials, thumbnail design guides, and industry insights from the Create Growth Agency team.",
 openGraph: {
    title: "Blog | Create Growth Agency",
    description:
      "Expert YouTube growth tips, editing tutorials, thumbnail design guides, and industry insights from the Create Growth Agency team.",
    type: "website",
    url: "https://creategrowthagency.com/blog",
  },
};

// Define the categories for the filter tabs
export const BLOG_CATEGORIES = [
  "All",
  "YouTube Editing",
  "Thumbnails",
  "Growth Tips",
  "Industry News",
  "Scripts",
] as const;

export default async function BlogPage() {
  // Fetch initial page of published posts
  const [posts, total] = await Promise.all([
    db.blogPost.findMany({
      where: { isPublished: true, status: "published" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        isFeatured: true,
        readTimeMins: true,
        viewsCount: true,
        likesCount: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      skip: 0,
      take: 9,
    }),
    db.blogPost.count({
      where: { isPublished: true, status: "published" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#080E1A]">
      {/* Header */}
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            CGA Blog
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            YouTube Growth Tips &amp; Insights
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BlogPageClient
          initialPosts={posts}
          initialTotal={total}
          categories={BLOG_CATEGORIES}
        />
      </section>
    </main>
  );
}