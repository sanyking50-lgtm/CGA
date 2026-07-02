import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

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

function isAdmin(user: { role: string } | null): boolean {
  return user?.role === "admin" || user?.role === "staff";
}

// GET /api/admin/tickets — list all tickets (admin)
export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  const where: Prisma.SupportTicketWhereInput = {};
  if (status && status !== "all") {
    where.status = status;
  }
  if (priority && priority !== "all") {
    where.priority = priority;
  }

  const [tickets, total] = await Promise.all([
    db.supportTicket.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        assignedStaff: { select: { id: true, name: true, avatarUrl: true, staffRole: true } },
        _count: { select: { replies: true } },
      },
      orderBy: [{ lastReplyAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.supportTicket.count({ where }),
  ]);

  return NextResponse.json({ tickets, total, page, limit });
}

// PATCH /api/admin/tickets/[id] — update ticket
export async function PATCH(req: NextRequest) {
  const user = await getUser();
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // This route handles /api/admin/tickets with PATCH body that includes id
  // But per the task spec, PATCH is on /api/admin/tickets (list) with body containing ticket id
  const body = await req.json();
  const { id, status, priority, assignedTo } = body as {
    id?: string;
    status?: string;
    priority?: string;
    assignedTo?: string | null;
  };

  if (!id) return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });

  const ticket = await db.supportTicket.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const updateData: Record<string, unknown> = {};

  const validStatuses = ["open", "in_progress", "resolved", "closed"];
  if (status && validStatuses.includes(status)) {
    updateData.status = status;
    if (status === "resolved") updateData.resolvedAt = new Date();
  }

  const validPriorities = ["low", "medium", "high", "urgent"];
  if (priority && validPriorities.includes(priority)) {
    updateData.priority = priority;
  }

  if (assignedTo !== undefined) {
    updateData.assignedTo = assignedTo || null;
  }

  const updated = await db.supportTicket.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { id: true, name: true, email: true } },
      assignedStaff: { select: { id: true, name: true, avatarUrl: true, staffRole: true } },
      _count: { select: { replies: true } },
    },
  });

  return NextResponse.json({ ticket: updated });
}