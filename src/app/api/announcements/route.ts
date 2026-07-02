import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();

    const announcements = await db.announcement.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        linkUrl: true,
        linkText: true,
        bgColor: true,
        countryCode: true,
        startsAt: true,
        expiresAt: true,
      },
      orderBy: { startsAt: "desc" },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("[ANNOUNCEMENTS] Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
