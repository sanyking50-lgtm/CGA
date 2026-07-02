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
    const a = await db.announcement.findUnique({
      where: { id },
      include: { creator: { select: { id: true, name: true } } },
    });
    if (!a) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    return NextResponse.json(a);
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENT_DETAIL] Error:", error);
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
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
  const updateData: Record<string, unknown> = {};
  const allowed = ["title", "content", "type", "linkUrl", "linkText", "bgColor", "isActive", "startsAt", "expiresAt"];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      updateData[key] = (key === "startsAt" || key === "expiresAt") && body[key] ? new Date(body[key]) : body[key];
    }
  }

  try {
    const a = await db.announcement.update({
      where: { id },
      data: updateData,
      include: { creator: { select: { id: true, name: true } } },
    });
    return NextResponse.json(a);
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENT_UPDATE] Error:", error);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
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
    await db.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENT_DELETE] Error:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}