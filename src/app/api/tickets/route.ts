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

// GET /api/tickets — list current user's tickets
export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
  const status = searchParams.get("status");

  const where: Prisma.SupportTicketWhereInput = { userId: user.sub };
  if (status && status !== "all") {
    where.status = status;
  }

  const [tickets, total] = await Promise.all([
    db.supportTicket.findMany({
      where,
      include: {
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

// POST /api/tickets — create a new ticket
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { subject, message, priority } = body as { subject?: string; message?: string; priority?: string };

  if (!subject?.trim()) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const validPriorities = ["low", "medium", "high", "urgent"];
  const ticketPriority = validPriorities.includes(priority) ? priority : "medium";

  const ticket = await db.supportTicket.create({
    data: {
      userId: user.sub,
      subject: subject.trim(),
      message: message.trim(),
      priority: ticketPriority,
      status: "open",
    },
  });

  return NextResponse.json({ ticket }, { status: 201 });
}