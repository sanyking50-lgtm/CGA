import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServiceBySlug } from "@/lib/service-data";

// Generate order number like CGA-00042
async function generateOrderNumber(): Promise<string> {
  const count = await db.order.count();
  const num = (count + 1).toString().padStart(5, "0");
  return `CGA-${num}`;
}

async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cga_access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, isActive: true, countryCode: true, currency: true, ordersCount: true },
    });
    return user;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { serviceSlug, packageName, expressDelivery, instructions, paymentMethod } = body;

    // Validate required fields
    if (!serviceSlug || !packageName || !paymentMethod) {
      return NextResponse.json(
        { error: "Service, package, and payment method are required" },
        { status: 400 }
      );
    }

    // Get service data
    const service = getServiceBySlug(serviceSlug);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const pkg = service.packages.find(
      (p) => p.name.toLowerCase() === packageName.toLowerCase()
    );
    if (!pkg || pkg.isCustomQuote) {
      return NextResponse.json({ error: "Invalid package selected" }, { status: 400 });
    }

    // Calculate totals
    const expressFee = expressDelivery ? pkg.expressFee : 0;
    const totalPrice = pkg.price + expressFee;

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create order + payment in transaction
    const order = await db.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          serviceType: serviceSlug,
          packageName: pkg.name,
          packagePrice: pkg.price,
          expressDelivery: expressDelivery || false,
          expressFee,
          totalPriceBdt: totalPrice,
          currency: user.currency || "BDT",
          status: "pending_payment",
          instructions: instructions || null,
          countryCode: user.countryCode || "BD",
          paymentGateway: paymentMethod,
          deliveryDeadline: new Date(
            Date.now() + (expressDelivery ? pkg.deliveryHrs / 2 : pkg.deliveryHrs) * 3600 * 1000
          ),
        },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          userId: user.id,
          amountBdt: totalPrice,
          currency: user.currency || "BDT",
          method: paymentMethod,
          transactionId: `MOCK-${Date.now()}`,
          gatewayRef: `mock_txn_${Date.now()}`,
          status: "pending",
        },
      });

      // Update user order count
      await tx.user.update({
        where: { id: user.id },
        data: { ordersCount: { increment: 1 } },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: Number(totalPrice),
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("[CHECKOUT] Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}