import { NextResponse } from "next/server";
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
  } catch {
    return null;
  }
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [
      totalUsers,
      activeUsers,
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      revenueResult,
      avgRatingResult,
      recentOrders,
      ordersByStatus,
      totalReviews,
      ratingDistribution,
      pendingReviews,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.order.count(),
      db.order.count({ where: { status: "pending_payment" } }),
      db.order.count({
        where: { status: { in: ["assigned", "in_progress", "in_review"] } },
      }),
      db.order.count({ where: { status: "delivered" } }),
      db.payment.aggregate({
        where: { status: "completed" },
        _sum: { amountBdt: true },
      }),
      db.rating.aggregate({ _avg: { stars: true } }),
      db.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          serviceType: true,
          packageName: true,
          totalPriceBdt: true,
          status: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      db.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      db.rating.count({ where: { isApproved: true } }),
      db.rating.groupBy({
        by: ["stars"],
        where: { isApproved: true },
        _count: { stars: true },
      }),
      db.rating.findMany({
        where: { isApproved: false },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          stars: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
          order: { select: { orderNumber: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      totalRevenue: revenueResult._sum.amountBdt?.toNumber() || 0,
      avgRating: avgRatingResult._avg.stars?.toFixed(1) || "0.0",
      recentOrders,
      ordersByStatus: ordersByStatus.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
      totalReviews,
      ratingDistribution: ratingDistribution.map((d) => ({
        stars: d.stars,
        count: d._count.stars,
      })),
      pendingReviews,
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS] Error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}