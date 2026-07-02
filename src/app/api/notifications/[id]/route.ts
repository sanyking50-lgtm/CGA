import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cga_access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    return payload;
  } catch {
    return null;
  }
}

// PATCH /api/notifications/[id] — Mark as read (or readAll)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { readAll } = body as { readAll?: boolean };

    if (readAll) {
      // Mark ALL notifications as read for this user
      await db.notification.updateMany({
        where: { userId: user.sub, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });

      return NextResponse.json({ message: "All notifications marked as read" });
    }

    // Mark single notification as read
    const notification = await db.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== user.sub) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await db.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });

    return NextResponse.json({ notification: updated });
  } catch (error) {
    console.error("[NOTIFICATION_PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] — Delete a notification
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const notification = await db.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== user.sub) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.notification.delete({ where: { id } });

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("[NOTIFICATION_DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}