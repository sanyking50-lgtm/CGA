import { NextResponse } from "next/server";
import { verifyAccessToken, getAccessTokenFromCookies } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const token = await getAccessTokenFromCookies();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);

    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        whatsapp: true,
        avatarUrl: true,
        role: true,
        level: true,
        points: true,
        ordersCount: true,
        streakCount: true,
        referralCode: true,
        countryCode: true,
        locale: true,
        currency: true,
        isVerified: true,
        isActive: true,
        isFreeTrialUsed: true,
        badges: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}