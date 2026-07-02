import { createServer } from "http";
import { Server } from "socket.io";
import { jwtVerify } from "jose";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PORT = 3003;
const JWT_SECRET = process.env.JWT_SECRET || "cga-jwt-secret-2024-super-secret-key";

// ---------------------------------------------------------------------------
// HTTP + Socket.io server
// ---------------------------------------------------------------------------
const httpServer = createServer();

const io = new Server(httpServer, {
  path: "/",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ---------------------------------------------------------------------------
// JWT verification helper
// ---------------------------------------------------------------------------
interface JWTPayload {
  sub: string;
  email: string;
  role: string;
}

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication required"));
  }
  const user = await verifyToken(token as string);
  if (!user) {
    return next(new Error("Invalid or expired token"));
  }
  (socket.data as Record<string, unknown>).user = user;
  next();
});

// ---------------------------------------------------------------------------
// Connection handlers
// ---------------------------------------------------------------------------
io.on("connection", (socket) => {
  const user = (socket.data as Record<string, unknown>).user as JWTPayload;
  console.log(`[chat] connected: ${user.email} (${user.role})`);

  // Join an order room
  socket.on("join-order", (orderId: string, callback?: (ok: boolean) => void) => {
    if (!orderId) return;
    const room = `order:${orderId}`;
    socket.join(room);
    console.log(`[chat] ${user.email} joined ${room}`);
    callback?.(true);
  });

  // Leave an order room
  socket.on("leave-order", (orderId: string) => {
    if (!orderId) return;
    const room = `order:${orderId}`;
    socket.leave(room);
    console.log(`[chat] ${user.email} left ${room}`);
  });

  // Send message → broadcast to room, then persist via HTTP callback
  socket.on("send-message", async (data: { orderId: string; message: string }) => {
    const { orderId, message } = data;
    if (!orderId || !message?.trim()) return;

    const room = `order:${orderId}`;

    // Broadcast a "new-message" event to everyone in the room (including sender)
    io.to(room).emit("new-message", {
      tempId: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      orderId,
      message: message.trim(),
      sender: {
        id: user.sub,
        email: user.email,
        role: user.role,
      },
      createdAt: new Date().toISOString(),
    });

    // Persist to DB via HTTP call to the main app
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `cga_access_token=${(socket.handshake.auth as Record<string, unknown>).token}`,
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (res.ok) {
        const saved = (await res.json()) as { message: { id: string } };
        // Confirm to the room that the message was persisted
        io.to(room).emit("message-sent", {
          tempId: `temp-${Date.now()}`,
          persistedId: saved.message.id,
          orderId,
        });
      } else {
        io.to(room).emit("message-error", {
          orderId,
          error: "Failed to save message",
        });
      }
    } catch (err) {
      console.error("[chat] DB persist error:", err);
      io.to(room).emit("message-error", {
        orderId,
        error: "Failed to save message",
      });
    }
  });

  // Typing indicator
  socket.on("typing", (data: { orderId: string; isTyping: boolean }) => {
    const room = `order:${data.orderId}`;
    socket.to(room).emit("typing", {
      orderId: data.orderId,
      userId: user.sub,
      userName: user.email,
      isTyping: data.isTyping,
    });
  });

  // Disconnect
  socket.on("disconnect", (reason) => {
    console.log(`[chat] disconnected: ${user.email} (${reason})`);
  });

  socket.on("error", (err) => {
    console.error(`[chat] socket error for ${user.email}:`, err);
  });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
httpServer.listen(PORT, () => {
  console.log(`[chat-service] Socket.io server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[chat-service] SIGTERM, shutting down…");
  io.close();
  httpServer.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("[chat-service] SIGINT, shutting down…");
  io.close();
  httpServer.close(() => process.exit(0));
});