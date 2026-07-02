"use client";

import { useState, useCallback, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Search,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost, User as PrismaUser } from "@prisma/client";

type PostAuthor = { id: string; name: string; avatarUrl: string | null } | null;

type BlogPostWithAuthor = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string[];
  isFeatured: boolean;
  readTimeMins: number;
  viewsCount: number;
  likesCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  author: PostAuthor;
};

interface BlogPageClientProps {
  initialPosts: BlogPostWithAuthor[];
  initialTotal: number;
  categories: readonly string[];
}

export function BlogPageClient({
  initialPosts,
  initialTotal,
  categories,
}: BlogPageClientProps) {
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const limit = 9;
  const totalPages = Math.ceil(total / limit);

  const fetchPosts = useCallback(
    async (newPage: number, category: string, search: string) => {
      startTransition(async () => {
        try {
          const params = new URLSearchParams({
            page: String(newPage),
            limit: String(limit),
          });
          if (category && category !== "All") params.set("category", category);
          if (search.trim()) params.set("search", search.trim());

          const res = await fetch(`/api/blog?${params}`);
          if (res.ok) {
            const data = await res.json();
            setPosts(data.posts);
            setTotal(data.total);
            setPage(data.page);
          }
        } catch (err) {
          console.error("Failed to fetch posts:", err);
        }
      });
    },
    []
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    fetchPosts(1, category, searchQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(1, activeCategory, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage, activeCategory, searchQuery);
  };

  return (
    <>
      {/* Search & Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-red-500/15 text-red-400 border border-red-500/30"
                  : "bg-white/[0.03] text-slate-400 border border-white/[0.08] hover:border-white/[0.15] hover:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500/40 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-colors"
          />
        </form>
      </div>

      {/* Posts Grid */}
      <AnimatePresence mode="wait">
        {isPending ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-white/[0.05]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-20 rounded bg-white/[0.06]" />
                  <div className="h-5 w-full rounded bg-white/[0.06]" />
                  <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
                  <div className="h-4 w-full rounded bg-white/[0.04]" />
                  <div className="h-4 w-2/3 rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 rounded-full bg-white/[0.03] p-4">
              <Search className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">
              No articles found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or category
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${activeCategory}-${page}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-slate-400 transition-all hover:border-white/[0.15] hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  p === page
                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-slate-400 transition-all hover:border-white/[0.15] hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}

/* ── Blog Card ──────────────────────────────────────────────────── */

function BlogCard({ post }: { post: BlogPostWithAuthor }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.15] transition-all">
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-red-500/20 via-purple-500/10 to-blue-500/20" />
          )}

          {/* Category Badge */}
          {post.category && (
            <span className="absolute left-3 top-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
              {post.category}
            </span>
          )}

          {/* Featured badge */}
          {post.isFeatured && (
            <span className="absolute right-3 top-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-lg font-semibold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>

          <p className="mt-2 text-slate-400 text-sm line-clamp-3 leading-relaxed">
            {post.excerpt
              ? post.excerpt.length > 150
                ? post.excerpt.slice(0, 150) + "..."
                : post.excerpt
              : "Read this article to learn more about YouTube growth strategies and tips."}
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-3 text-slate-500 text-xs">
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author.name}
              </span>
            )}
            {post.publishedAt && (
              <span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTimeMins} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.viewsCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}