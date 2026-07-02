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
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, phone: true, whatsapp: true,
        youtubeChannel: true, avatarUrl: true, role: true, staffRole: true,
        level: true, ordersCount: true, streakCount: true, points: true,
        referralCode: true, countryCode: true, currency: true,
        isVerified: true, emailVerified: true, phoneVerified: true,
        isActive: true, createdAt: true, updatedAt: true,
        _count: { select: { orders: true } },
      },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const totalSpent = await db.payment.aggregate({
      where: { userId: id, status: "completed" },
      _sum: { amountBdt: true },
    });

    return NextResponse.json({ ...user, totalSpent: totalSpent._sum.amountBdt?.toNumber() || 0 });
  } catch (error) {
    console.error("[ADMIN_USER_DETAIL] Error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
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
  const { role, isActive, level } = body;

  try {
    const user = await db.user.update({
      where: { id },
      data: {
        ...(role !== undefined && { role }),
        ...(isActive !== undefined && { isActive }),
        ...(level !== undefined && { level }),
      },
      select: { id: true, name: true, email: true, role: true, isActive: true, level: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("[ADMIN_USER_UPDATE] Error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}