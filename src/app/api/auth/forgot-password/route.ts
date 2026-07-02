import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/redis";
import { SignJWT } from "jose";

const RESET_SECRET = process.env.JWT_SECRET!;
const RESET_EXP = "1h"; // Reset token valid for 1 hour

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 attempts per 30 minutes per IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { success: rlSuccess } = await rateLimit(`forgot:${ip}`, 3, 1800);
    if (!rlSuccess) {
      return NextResponse.json(
        { error: "Too many requests. Try again in 30 minutes." },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    // Generate reset token
    const token = await new SignJWT({ sub: user.id, email: user.email, type: "reset" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(RESET_EXP)
      .sign(new TextEncoder().encode(RESET_SECRET));

    // Store token hash in Redis for verification + invalidation
    const { redis } = await import("@/lib/redis");
    await redis.set(`reset:${user.id}`, token, { ex: 3600 });

    // TODO: Send email via Resend with reset link
    // const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    // await sendEmail(user.email, "Reset Your Password", resetUrl);

    console.log(`[PASSWORD RESET] Token generated for ${user.email}. Token: ${token.substring(0, 20)}...`);

    return NextResponse.json({
      message: "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}