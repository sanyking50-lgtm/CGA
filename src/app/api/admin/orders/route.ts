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

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  try {
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        select: {
          id: true, orderNumber: true, serviceType: true, packageName: true,
          totalPriceBdt: true, status: true, expressDelivery: true,
          createdAt: true, deliveryDeadline: true, deliveredAt: true,
          internalNotes: true,
          user: { select: { id: true, name: true, email: true } },
          assignedStaff: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    // Get staff list for assignment
    const staff = await db.user.findMany({
      where: { role: { in: ["admin", "staff"] }, isActive: true },
      select: { id: true, name: true, staffRole: true },
    });

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit), staff });
  } catch (error) {
    console.error("[ADMIN_ORDERS] Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}