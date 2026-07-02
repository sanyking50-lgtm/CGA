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

// GET chat messages for an order
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  // Verify order belongs to user (or user is admin/staff)
  const order = await db.order.findFirst({
    where: { id, userId: user.sub },
  });
  if (!order && user.role !== "admin" && user.role !== "staff") {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const messages = await db.chatMessage.findMany({
    where: { orderId: id },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true, role: true } },
    },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  // Mark user messages as read
  await db.chatMessage.updateMany({
    where: { orderId: id, senderId: { not: user.sub }, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ messages });
}

// POST send a chat message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const { message } = await req.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Verify order exists and user has access
  const order = await db.order.findFirst({
    where: { id, userId: user.sub },
  });
  if (!order && user.role !== "admin" && user.role !== "staff") {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const msg = await db.chatMessage.create({
    data: {
      orderId: id,
      senderId: user.sub,
      message: message.trim(),
    },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true, role: true } },
    },
  });

  return NextResponse.json({ message: msg }, { status: 201 });
}