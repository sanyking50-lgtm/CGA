import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";

async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cga_access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    return payload.sub;
  } catch {
    return null;
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const { id } = await params;

    const order = await db.order.findFirst({
      where: { id, userId },
      include: {
        payments: {
          select: { id: true, amountBdt: true, method: true, status: true, transactionId: true, createdAt: true },
        },
        details: true,
        assignedStaff: {
          select: { id: true, name: true, avatarUrl: true, staffRole: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("[ORDER_DETAIL] Error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}