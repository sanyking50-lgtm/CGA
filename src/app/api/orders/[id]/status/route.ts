import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending_payment: ["paid_pending_assign", "cancelled"],
  paid_pending_assign: ["assigned", "cancelled"],
  assigned: ["in_progress", "cancelled"],
  in_progress: ["in_review", "revision"],
  in_review: ["delivered", "revision", "in_progress"],
  revision: ["in_progress", "delivered"],
  delivered: [],
  cancelled: ["pending_payment"],
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cga_access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    return payload;
  } catch { return null; }
}

// Client can only request cancellation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const order = await db.order.findFirst({
    where: { id, userId: user.sub },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const { status, deliveryUrl } = await req.json();
  const newStatus = status || "cancelled";

  // Client can only cancel (except admin handles other transitions via admin API)
  if (user.role !== "admin") {
    if (newStatus !== "cancelled") {
      return NextResponse.json({ error: "Only cancellation is available" }, { status: 403 });
    }
  }

  // Validate transition
  const allowed = VALID_TRANSITIONS[order.status];
  if (!allowed || !allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `Cannot transition from ${order.status} to ${newStatus}` },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = { status: newStatus };
  if (newStatus === "delivered") {
    updateData.deliveredAt = new Date();
    if (deliveryUrl) updateData.deliveryUrl = deliveryUrl;
  }

  const updated = await db.order.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ order: updated });
}