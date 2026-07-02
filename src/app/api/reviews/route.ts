import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET public reviews (for service pages + homepage testimonials)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("service");
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {
      isApproved: true,
      allowPublic: true,
    };

    if (serviceType) {
      // Join through order to filter by service type
      const ratings = await db.rating.findMany({
        where: {
          ...where,
          order: { serviceType },
        },
        include: {
          user: { select: { name: true, avatarUrl: true } },
          order: { select: { serviceType: true, packageName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return NextResponse.json({ reviews: ratings });
    }

    if (featured) {
      const ratings = await db.rating.findMany({
        where: { ...where, stars: { gte: 4 }, comment: { not: null } },
        include: {
          user: { select: { name: true, avatarUrl: true } },
          order: { select: { serviceType: true, packageName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return NextResponse.json({ reviews: ratings });
    }

    // All approved public reviews
    const ratings = await db.rating.findMany({
      where,
      include: {
        user: { select: { name: true, avatarUrl: true } },
        order: { select: { serviceType: true, packageName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Average rating
    const avgResult = await db.rating.aggregate({
      where: { isApproved: true },
      _avg: { stars: true },
      _count: { stars: true },
    });

    return NextResponse.json({
      reviews: ratings,
      stats: {
        average: avgResult._avg.stars ? Math.round(avgResult._avg.stars * 10) / 10 : 0,
        total: avgResult._count.stars,
      },
    });
  } catch (error) {
    console.error("[REVIEWS] Error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}