import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
} from "@/lib/auth";
import { rateLimit } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 attempts per 5 minutes per IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-vercel-ip-country") || "unknown";
    const { success: rlSuccess, remaining } = await rateLimit(`login:${ip}`, 10, 300);
    if (!rlSuccess) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again in 5 minutes.", remaining: 0 },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated. Contact support." },
        { status: 403 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    await setAuthCookies(accessToken, refreshToken);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      level: user.level,
      points: user.points,
      ordersCount: user.ordersCount,
      referralCode: user.referralCode,
      countryCode: user.countryCode,
      currency: user.currency,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ message: "Login successful", user: safeUser, remaining });
  } catch (error: unknown) {
    console.error("Login error:", error);
    const msg = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}