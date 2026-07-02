import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signAccessToken, signRefreshToken, setAuthCookies, generateReferralCode } from "@/lib/auth";
import { rateLimit } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 registrations per minute per IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-vercel-ip-country") || "unknown";
    const { success: rlSuccess } = await rateLimit(`register:${ip}`, 5, 60);
    if (!rlSuccess) {
      return NextResponse.json(
        { error: "Too many registration attempts. Try again in a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, password, referralCode, countryCode } = body;

    // Validate
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check existing user
    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Check referral code
    let referredBy: string | null = null;
    let referralLevel = 1;
    if (referralCode) {
      const referrer = await db.user.findUnique({
        where: { referralCode },
        select: { id: true, referredBy: true },
      });
      if (referrer) {
        referredBy = referrer.id;
        if (referrer.referredBy) {
          referralLevel = 2;
        }
      }
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        referralCode: generateReferralCode(),
        referredBy,
        referralLevel,
        countryCode: countryCode || "BD",
        currency: countryCode === "BD" ? "BDT" : "USD",
        locale: countryCode === "BD" ? "bn" : "en",
      },
    });

    // Generate tokens
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // Set cookies
    await setAuthCookies(accessToken, refreshToken);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
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

    return NextResponse.json(
      { message: "Registration successful", user: safeUser },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Register error:", error);
    const msg = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}