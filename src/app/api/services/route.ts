import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/services — Public: return all active services with packages
export async function GET() {
  try {
    const services = await db.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        packages: {
          where: { /* all packages */ },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Services fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}