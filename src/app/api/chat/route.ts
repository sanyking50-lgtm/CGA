import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

// Simple in-memory chat storage for MVP support chat
// Messages are stored per-user in memory
const chatStore = new Map<string, { id: string; senderId: string; senderName: string; message: string; createdAt: string; isRead: boolean }[]>();

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cga_access_token")?.value;
  if (!token) return NextResponse.json({ messages: [] });

  try {
    const { jwtVerify } = await import("jose");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userMessages = chatStore.get(payload.sub as string) || [];

    // Add a welcome message if empty
    const messages = userMessages.length === 0 ? [] : userMessages;

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cga_access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { jwtVerify } = await import("jose");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const body = await req.json();
    const message = body.message?.trim();
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

    const userId = payload.sub as string;
    const userName = (payload as any).email || "User";

    const existing = chatStore.get(userId) || [];

    // Add user message
    const userMsg = {
      id: crypto.randomUUID(),
      senderId: userId,
      senderName: userName,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    existing.push(userMsg);

    // Auto-reply after short delay simulation
    const autoReplies = [
      "Thanks for reaching out! Our team will get back to you shortly.",
      "We received your message. A support agent will respond within a few minutes.",
      "Hello! Thanks for contacting CGA Support. How can we help you today?",
    ];
    const autoReply = {
      id: crypto.randomUUID(),
      senderId: "system-support",
      senderName: "CGA Support",
      message: autoReplies[Math.floor(Math.random() * autoReplies.length)],
      createdAt: new Date().toISOString(),
      isRead: true,
    };
    existing.push(autoReply);

    chatStore.set(userId, existing);

    return NextResponse.json({ success: true, id: userMsg.id });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}