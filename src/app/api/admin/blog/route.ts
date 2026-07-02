import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cga_access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    if (payload.role !== "admin") return null;
    return payload;
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const posts = await db.blogPost.findMany({
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[ADMIN_BLOG] Error:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, excerpt, content, coverImage, category, tags, status, isFeatured, readTimeMins } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
  }

  try {
    const post = await db.blogPost.create({
      data: {
        title, slug, excerpt: excerpt || null, content,
        coverImage: coverImage || null, category: category || null,
        tags: tags || [], status: status || "draft",
        isPublished: status === "published",
        isFeatured: isFeatured || false,
        readTimeMins: readTimeMins || 5,
        authorId: admin.sub,
        publishedAt: status === "published" ? new Date() : null,
      },
      include: { author: { select: { id: true, name: true } } },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_BLOG_CREATE] Error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}