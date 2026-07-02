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

async function getAdmin() {
  const user = await getUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

// GET /api/notifications — Fetch current user's notifications
export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const unreadOnly = searchParams.get("unreadOnly") === "true";

  const where: Record<string, unknown> = { userId: user.sub };
  if (unreadOnly) where.isRead = false;

  try {
    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.notification.count({ where }),
      db.notification.count({ where: { userId: user.sub, isRead: false } }),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[NOTIFICATIONS_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST /api/notifications — Admin: create notification (single user or broadcast)
export async function POST(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, title, message, type, linkUrl, allUsers } = body as {
      userId?: string;
      title: string;
      message: string;
      type?: string;
      linkUrl?: string | null;
      allUsers?: boolean;
    };

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    if (!allUsers && !userId) {
      return NextResponse.json(
        { error: "userId or allUsers is required" },
        { status: 400 }
      );
    }

    const validTypes = ["info", "success", "warning", "order_update", "payment", "promo"];
    const notificationType = validTypes.includes(type) ? type : "info";

    if (allUsers) {
      // Broadcast to all users
      const users = await db.user.findMany({
        select: { id: true },
      });

      if (users.length === 0) {
        return NextResponse.json({
          message: "No users to notify",
          sentCount: 0,
        });
      }

      const result = await db.notification.createMany({
        data: users.map((u) => ({
          userId: u.id,
          title,
          message,
          type: notificationType,
          linkUrl: linkUrl || null,
        })),
      });

      return NextResponse.json({
        message: "Broadcast sent",
        sentCount: result.count,
      });
    } else {
      // Send to specific user
      const targetUser = await db.user.findUnique({
        where: { id: userId! },
        select: { id: true },
      });

      if (!targetUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const notification = await db.notification.create({
        data: {
          userId: targetUser.id,
          title,
          message,
          type: notificationType,
          linkUrl: linkUrl || null,
        },
      });

      return NextResponse.json({ notification }, { status: 201 });
    }
  } catch (error) {
    console.error("[NOTIFICATIONS_POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}