import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Eye,
  Heart,
  User,
  Calendar,
  Tag,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────── */

type PostComment = {
  id: string;
  content: string;
  createdAt: Date;
  author: { id: string; name: string; avatarUrl: string | null };
};

type BlogPostData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string | null;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  status: string;
  readTimeMins: number;
  viewsCount: number;
  likesCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  authorId: string | null;
  author: { id: string; name: string; avatarUrl: string | null } | null;
  comments: PostComment[];
};

/* ── Metadata ───────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      category: true,
    },
  });

  if (!post) return {};

  return {
    title: `${post.title} | Create Growth Agency`,
    description:
      post.excerpt ||
      `Read "${post.title}" on the Create Growth Agency blog.`,
    openGraph: {
      title: post.title,
      description:
        post.excerpt ||
        `Read "${post.title}" on the Create Growth Agency blog.`,
      type: "article",
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

/* ── Page ───────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post: BlogPostData | null = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
      comments: {
        where: { isApproved: true },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post || !post.isPublished || post.status !== "published") {
    notFound();
  }

  // Increment view count (non-blocking)
  db.blogPost
    .update({
      where: { id: post.id },
      data: { viewsCount: { increment: 1 } },
    })
    .catch(() => {});

  // Fetch related posts (same category, exclude current, limit 3)
  const relatedPosts = post.category
    ? await db.blogPost.findMany({
        where: {
          isPublished: true,
          status: "published",
          category: post.category,
          id: { not: post.id },
        },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          coverImage: true,
          readTimeMins: true,
          viewsCount: true,
          publishedAt: true,
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
      })
    : [];

  return (
    <main className="min-h-screen bg-[#080E1A]">
      {/* Back link */}
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm text-slate-400 transition-all hover:border-white/[0.15] hover:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      {/* Cover Image Hero */}
      <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08]">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-red-500/20 via-purple-500/10 to-blue-500/20" />
          )}
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto mt-10 max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Category Badge */}
        {post.category && (
          <span className="inline-block bg-red-500/10 text-red-400 border border-red-500/20 rounded-md px-2.5 py-0.5 text-xs font-medium">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-100 sm:text-4xl">
          {post.title}
        </h1>

        {/* Author Info Row */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-white/[0.06] pb-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            {post.author?.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full border border-white/[0.1]"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.1]">
                <User className="h-5 w-5 text-slate-500" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-200">
                {post.author?.name || "CGA Team"}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {post.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(post.publishedAt), "MMM d, yyyy")}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTimeMins} min read
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="ml-auto flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.viewsCount + 1} views
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {post.likesCount} likes
            </span>
          </div>
        </div>

        {/* Article Body */}
        <div
          className="prose-blog mt-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-6">
            <Tag className="mr-1 h-4 w-4 text-slate-500" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-xs text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        {post.comments.length > 0 && (
          <section className="mt-12 border-t border-white/[0.06] pt-8">
            <h2 className="text-lg font-semibold text-slate-200">
              Comments ({post.comments.length})
            </h2>
            <div className="mt-6 space-y-4">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4"
                >
                  <div className="flex items-center gap-3">
                    {comment.author.avatarUrl ? (
                      <Image
                        src={comment.author.avatarUrl}
                        alt={comment.author.name}
                        width={32}
                        height={32}
                        className="rounded-full border border-white/[0.1]"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.1]">
                        <User className="h-4 w-4 text-slate-500" />
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-slate-300">
                        {comment.author.name}
                      </span>
                      <span className="ml-2 text-xs text-slate-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-slate-100">
              Related Articles
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group block"
                >
                  <article className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.15] transition-all">
                    <div className="relative aspect-video overflow-hidden">
                      {rp.coverImage ? (
                        <Image
                          src={rp.coverImage}
                          alt={rp.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-red-500/20 via-purple-500/10 to-blue-500/20" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        {rp.author && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {rp.author.name}
                          </span>
                        )}
                        {rp.publishedAt && (
                          <span>
                            {format(new Date(rp.publishedAt), "MMM d, yyyy")}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rp.readTimeMins} min
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-slate-100">
              Related Articles
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group block"
                >
                  <article className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.15] transition-all">
                    <div className="relative aspect-video overflow-hidden">
                      {rp.coverImage ? (
                        <Image
                          src={rp.coverImage}
                          alt={rp.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-red-500/20 via-purple-500/10 to-blue-500/20" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        {rp.author && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {rp.author.name}
                          </span>
                        )}
                        {rp.publishedAt && (
                          <span>
                            {format(new Date(rp.publishedAt), "MMM d, yyyy")}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rp.readTimeMins} min
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}