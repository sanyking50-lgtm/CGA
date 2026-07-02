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

// Mock payment verification — simulates a successful payment
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Find the order
    const order = await db.order.findFirst({
      where: { id: orderId, userId },
      include: { payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending_payment") {
      return NextResponse.json(
        { error: `Order is already ${order.status}` },
        { status: 400 }
      );
    }

    // Mock: Simulate 90% success, 10% failure for testing
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
      // Mark payment as failed
      await db.payment.updateMany({
        where: { orderId: order.id, status: "pending" },
        data: { status: "failed" },
      });
      await db.order.update({
        where: { id: order.id },
        data: { status: "cancelled" },
      });
      return NextResponse.json({ success: false, error: "Payment simulation failed" }, { status: 400 });
    }

    // Success: update payment + order status
    await db.$transaction(async (tx) => {
      // Update payment
      await tx.payment.updateMany({
        where: { orderId: order.id, status: "pending" },
        data: {
          status: "paid",
          transactionId: `MOCK-PAID-${Date.now()}`,
          webhookData: {
            mock: true,
            verified_at: new Date().toISOString(),
            gateway: "mock",
          },
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: order.id },
        data: { status: "paid_pending_assign" },
      });
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      message: "Payment successful!",
    });
  } catch (error) {
    console.error("[PAYMENT_VERIFY] Error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}