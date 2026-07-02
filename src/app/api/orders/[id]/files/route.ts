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

// GET order files (stored in order details as JSON)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const order = await db.order.findFirst({
    where: { id, userId: user.sub },
    include: { details: true },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const files = (order.details || [])
    .filter((d) => {
      const data = d.details as Record<string, unknown> | null;
      return data?.type === "file";
    })
    .map((d) => ({
      id: d.id,
      ...(d.details as Record<string, unknown>),
      createdAt: d.createdAt,
    })) || [];

  return NextResponse.json({ files });
}

// POST - save file record to order details
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const order = await db.order.findFirst({ where: { id, userId: user.sub } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const body = await req.json();
  const { url, name, size, type, uploadedBy } = body;

  await db.orderDetail.create({
    data: {
      orderId: id,
      details: { type: "file", url, name, size, fileType: type, uploadedBy },
    },
  });

  // Also update the order's fileUrl if empty
  if (!order.fileUrl) {
    await db.order.update({ where: { id }, data: { fileUrl: url } });
  }

  return NextResponse.json({ success: true });
}