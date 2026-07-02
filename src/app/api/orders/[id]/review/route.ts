import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cga_access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    return payload;
  } catch { return null; }
}

// GET - check if order has a review + get it
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const review = await db.rating.findFirst({
    where: { orderId: id, userId: user.sub },
    select: { id: true, stars: true, comment: true, allowPublic: true, createdAt: true },
  });

  return NextResponse.json({ review });
}

// POST - submit a review
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const order = await db.order.findFirst({
    where: { id, userId: user.sub },
    select: { status: true, serviceType: true },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Only delivered orders can be reviewed
  if (order.status !== "delivered") {
    return NextResponse.json({ error: "Order must be delivered before reviewing" }, { status: 400 });
  }

  // Check if already reviewed
  const existing = await db.rating.findFirst({ where: { orderId: id, userId: user.sub } });
  if (existing) {
    return NextResponse.json({ error: "You already reviewed this order" }, { status: 409 });
  }

  const body = await req.json();
  const { stars, comment, allowPublic } = body;

  if (!stars || stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Stars must be between 1 and 5" }, { status: 400 });
  }

  const review = await db.rating.create({
    data: {
      orderId: id,
      userId: user.sub,
      stars,
      comment: comment?.trim() || null,
      allowPublic: allowPublic ?? true,
    },
    include: {
      user: { select: { name: true, avatarUrl: true } },
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}