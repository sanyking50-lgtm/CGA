import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Verify token
    let payload: { sub: string; email: string; type: string };
    try {
      const { payload: p } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );
      payload = p as unknown as typeof payload;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    if (payload.type !== "reset") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 400 }
      );
    }

    // Check token is still valid in Redis
    const { redis } = await import("@/lib/redis");
    const storedToken = await redis.get<string>(`reset:${payload.sub}`);
    if (!storedToken || storedToken !== token) {
      return NextResponse.json(
        { error: "This reset link has already been used or expired" },
        { status: 400 }
      );
    }

    // Update password
    const passwordHash = await hashPassword(password);
    await db.user.update({
      where: { id: payload.sub },
      data: { passwordHash },
    });

    // Invalidate token
    await redis.del(`reset:${payload.sub}`);

    return NextResponse.json({
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}