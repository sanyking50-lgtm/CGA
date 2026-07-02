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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const service = await db.service.findUnique({
      where: { id },
      include: { packages: { orderBy: { sortOrder: "asc" } } },
    });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
    return NextResponse.json(service);
  } catch (error) {
    console.error("[ADMIN_SERVICE_DETAIL] Error:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await req.json();
  const { name, slug, shortDesc, fullDesc, thumbnailUrl, videoUrl, isActive, sortOrder, action, packageData } = body;

  try {
    // Handle package sub-actions
    if (action === "createPackage") {
      const pkg = await db.servicePackage.create({
        data: {
          serviceId: id,
          name: packageData.name,
          price: parseFloat(packageData.price),
          deliveryHrs: parseInt(packageData.deliveryHrs) || 24,
          revisions: parseInt(packageData.revisions) || 1,
          features: packageData.features || [],
          isPopular: packageData.isPopular || false,
          sortOrder: packageData.sortOrder || 0,
        },
      });
      return NextResponse.json(pkg, { status: 201 });
    }

    if (action === "updatePackage" && packageData?.id) {
      const pkg = await db.servicePackage.update({
        where: { id: packageData.id },
        data: {
          ...(packageData.name && { name: packageData.name }),
          ...(packageData.price !== undefined && { price: parseFloat(packageData.price) }),
          ...(packageData.deliveryHrs !== undefined && { deliveryHrs: parseInt(packageData.deliveryHrs) }),
          ...(packageData.revisions !== undefined && { revisions: parseInt(packageData.revisions) }),
          ...(packageData.features !== undefined && { features: packageData.features }),
          ...(packageData.isPopular !== undefined && { isPopular: packageData.isPopular }),
          ...(packageData.sortOrder !== undefined && { sortOrder: packageData.sortOrder }),
        },
      });
      return NextResponse.json(pkg);
    }

    if (action === "deletePackage" && packageData?.id) {
      await db.servicePackage.delete({ where: { id: packageData.id } });
      return NextResponse.json({ success: true });
    }

    // Standard service update
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc;
    if (fullDesc !== undefined) updateData.fullDesc = fullDesc;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const service = await db.service.update({
      where: { id },
      data: updateData,
      include: { packages: { orderBy: { sortOrder: "asc" } } },
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error("[ADMIN_SERVICE_UPDATE] Error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    await db.service.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_SERVICE_DELETE] Error:", error);
    return NextResponse.json({ error: "Failed to deactivate service" }, { status: 500 });
  }
}