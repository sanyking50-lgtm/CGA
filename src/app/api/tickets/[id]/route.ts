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

// GET /api/tickets/[id] — get ticket with replies
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const ticket = await db.supportTicket.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      assignedStaff: { select: { id: true, name: true, avatarUrl: true, staffRole: true } },
      replies: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  // User must own the ticket or be admin/staff
  if (ticket.userId !== user.sub && user.role !== "admin" && user.role !== "staff") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ ticket });
}

// POST /api/tickets/[id] — add a reply
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const ticket = await db.supportTicket.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  if (ticket.userId !== user.sub && user.role !== "admin" && user.role !== "staff") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (ticket.status === "closed") {
    return NextResponse.json({ error: "Ticket is closed" }, { status: 400 });
  }

  const body = await req.json();
  const { message } = body as { message?: string };
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const isStaff = user.role === "admin" || user.role === "staff";

  // If staff replies and ticket is resolved, reopen it
  const updateData: Record<string, unknown> = {
    lastReplyAt: new Date(),
  };
  if (isStaff && ticket.status === "resolved") {
    updateData.status = "in_progress";
  }

  const [reply] = await db.$transaction([
    db.ticketReply.create({
      data: {
        ticketId: id,
        userId: user.sub,
        message: message.trim(),
        isStaff,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
    }),
    db.supportTicket.update({
      where: { id },
      data: updateData,
    }),
  ]);

  return NextResponse.json({ reply }, { status: 201 });
}