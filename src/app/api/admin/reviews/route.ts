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

// GET - list all reviews (admin)
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status"); // pending, approved, rejected

  const where: Record<string, unknown> = {};
  if (status === "pending") where.isApproved = false;
  else if (status === "approved") where.isApproved = true;

  const [reviews, total] = await Promise.all([
    db.rating.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, avatarUrl: true } },
        order: { select: { orderNumber: true, serviceType: true, packageName: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.rating.count({ where }),
  ]);

  return NextResponse.json({ reviews, total, page, pages: Math.ceil(total / limit) });
}

// PATCH - approve/reject review
export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviewId, action } = await req.json();
  if (!reviewId || !action) {
    return NextResponse.json({ error: "reviewId and action required" }, { status: 400 });
  }

  const review = await db.rating.findUnique({ where: { id: reviewId } });
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  if (action === "approve") {
    await db.rating.update({ where: { id: reviewId }, data: { isApproved: true } });
  } else if (action === "reject") {
    await db.rating.delete({ where: { id: reviewId } });
  }

  return NextResponse.json({ success: true });
}