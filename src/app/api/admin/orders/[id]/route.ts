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

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending_payment: ["paid_pending_assign", "cancelled"],
  paid_pending_assign: ["assigned", "cancelled"],
  assigned: ["in_progress", "cancelled"],
  in_progress: ["in_review", "revision", "cancelled"],
  in_review: ["delivered", "revision"],
  revision: ["in_progress", "delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, countryCode: true } },
        assignedStaff: { select: { id: true, name: true, staffRole: true } },
        payments: { orderBy: { createdAt: "desc" } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    console.error("[ADMIN_ORDER_DETAIL] Error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
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
  const { status, assignedTo, internalNotes } = body;

  try {
    const current = await db.order.findUnique({ where: { id }, select: { status: true } });
    if (!current) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (status && status !== current.status) {
      const allowed = VALID_TRANSITIONS[current.status] || [];
      if (!allowed.includes(status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${current.status} to ${status}` },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
    if (status === "delivered") updateData.deliveredAt = new Date();

    const order = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedStaff: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ADMIN_ORDER_UPDATE] Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}