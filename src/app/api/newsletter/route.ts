import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const name = body.name ? (body.name as string).trim() : null;
    const source = (body.source || "website") as string;

    // Validate email
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    // Validate source
    const validSources = ["website", "popup", "footer", "admin"];
    const finalSource = validSources.includes(source) ? source : "website";

    // Check if already subscribed (active)
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      }

      // Previously unsubscribed — reactivate
      await db.newsletterSubscriber.update({
        where: { email },
        data: {
          isActive: true,
          unsubscribedAt: null,
          name: name || existing.name,
          source: finalSource,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Re-subscribed successfully",
      });
    }

    // Create new subscriber
    await db.newsletterSubscriber.create({
      data: {
        email,
        name,
        source: finalSource,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error("[NEWSLETTER] Error subscribing:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const totalSubscribers = await db.newsletterSubscriber.count({
      where: { isActive: true },
    });

    return NextResponse.json({ totalSubscribers });
  } catch (error) {
    console.error("[NEWSLETTER] Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}