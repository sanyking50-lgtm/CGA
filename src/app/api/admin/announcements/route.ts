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

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const announcements = await db.announcement.findMany({
      include: {
        creator: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENTS] Error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, content, type, linkUrl, linkText, bgColor, isActive, startsAt, expiresAt } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const announcement = await db.announcement.create({
      data: {
        title, content: content || "", type: type || "info",
        linkUrl: linkUrl || null, linkText: linkText || null,
        bgColor: bgColor || "#6366F1", isActive: isActive ?? true,
        startsAt: startsAt ? new Date(startsAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdBy: admin.sub,
      },
      include: { creator: { select: { id: true, name: true } } },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENT_CREATE] Error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}