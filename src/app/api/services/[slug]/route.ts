import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/services/[slug] — Public: single service with packages
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const service = await db.service.findUnique({
      where: { slug },
      include: {
        packages: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Service fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}