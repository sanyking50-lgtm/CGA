import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cga_access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    if (payload.role !== "admin") return null;
    return payload;
  } catch { return null; }
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const services = await db.service.findMany({
      include: {
        packages: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("[ADMIN_SERVICES] Error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, slug, shortDesc, isActive, sortOrder } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }

  try {
    const service = await db.service.create({
      data: { name, slug, shortDesc: shortDesc || null, isActive: isActive ?? true, sortOrder: sortOrder ?? 0 },
      include: { packages: true },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_SERVICE_CREATE] Error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}