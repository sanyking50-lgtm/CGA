import { NextRequest, NextResponse } from "next/server";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const refreshTokenValue = await getRefreshTokenFromCookies();

    if (!refreshTokenValue) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshTokenValue);

    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "User not found or inactive" },
        { status: 401 }
      );
    }

    const newPayload = { sub: user.id, email: user.email, role: user.role };
    const newAccess = await signAccessToken(newPayload);
    const newRefresh = await signRefreshToken(newPayload);

    await setAuthCookies(newAccess, newRefresh);

    return NextResponse.json({ message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { error: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}