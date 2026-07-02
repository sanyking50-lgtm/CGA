"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )cga_access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinOrder: (orderId: string) => void;
  leaveOrder: (orderId: string) => void;
  sendMessage: (orderId: string, message: string) => void;
  onMessage: (cb: (msg: SocketNewMessage) => void) => () => void;
  onTyping: (cb: (data: SocketTypingData) => void) => () => void;
  emitTyping: (orderId: string, isTyping: boolean) => void;
  onMessageSent: (cb: (data: { tempId: string; persistedId: string; orderId: string }) => void) => () => void;
  onMessageError: (cb: (data: { orderId: string; error: string }) => void) => () => void;
}

export interface SocketNewMessage {
  tempId: string;
  orderId: string;
  message: string;
  sender: { id: string; email: string; role: string };
  createdAt: string;
}

export interface SocketTypingData {
  orderId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export function useSocket(): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect on mount
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io("/?XTransformPort=3003", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.warn("[useSocket] connect_error:", err.message);
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const joinOrder = useCallback((orderId: string) => {
    socketRef.current?.emit("join-order", orderId);
  }, []);

  const leaveOrder = useCallback((orderId: string) => {
    socketRef.current?.emit("leave-order", orderId);
  }, []);

  const sendMessage = useCallback((orderId: string, message: string) => {
    socketRef.current?.emit("send-message", { orderId, message });
  }, []);

  const onMessage = useCallback((cb: (msg: SocketNewMessage) => void) => {
    const handler = (msg: SocketNewMessage) => cb(msg);
    socketRef.current?.on("new-message", handler);
    return () => {
      socketRef.current?.off("new-message", handler);
    };
  }, []);

  const onTyping = useCallback((cb: (data: SocketTypingData) => void) => {
    const handler = (data: SocketTypingData) => cb(data);
    socketRef.current?.on("typing", handler);
    return () => {
      socketRef.current?.off("typing", handler);
    };
  }, []);

  const onMessageSent = useCallback(
    (cb: (data: { tempId: string; persistedId: string; orderId: string }) => void) => {
      const handler = (data: { tempId: string; persistedId: string; orderId: string }) => cb(data);
      socketRef.current?.on("message-sent", handler);
      return () => {
        socketRef.current?.off("message-sent", handler);
      };
    },
    [],
  );

  const onMessageError = useCallback(
    (cb: (data: { orderId: string; error: string }) => void) => {
      const handler = (data: { orderId: string; error: string }) => cb(data);
      socketRef.current?.on("message-error", handler);
      return () => {
        socketRef.current?.off("message-error", handler);
      };
    },
    [],
  );

  const emitTyping = useCallback((orderId: string, isTyping: boolean) => {
    socketRef.current?.emit("typing", { orderId, isTyping });
  }, []);

  return {
    socket: null as unknown as Socket,
    isConnected,
    joinOrder,
    leaveOrder,
    sendMessage,
    onMessage,
    onTyping,
    emitTyping,
    onMessageSent,
    onMessageError,
  };
}