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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const post = await db.blogPost.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true } }, comments: true },
    });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("[ADMIN_BLOG_DETAIL] Error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await req.json();

  try {
    const updateData: Record<string, unknown> = {};
    const allowed = ["title", "slug", "excerpt", "content", "coverImage", "category", "tags", "readTimeMins", "isFeatured"];
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
      updateData.isPublished = body.status === "published";
      if (body.status === "published" && !updateData.publishedAt) {
        // Only set publishedAt if not already set
        const existing = await db.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
        if (!existing?.publishedAt) updateData.publishedAt = new Date();
      }
    }

    const post = await db.blogPost.update({
      where: { id },
      data: updateData,
      include: { author: { select: { id: true, name: true } } },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("[ADMIN_BLOG_UPDATE] Error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_BLOG_DELETE] Error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}