"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMsg {
  id: string;
  message: string | null;
  senderId: string;
  sender: { id: string; name: string; avatarUrl: string | null } | null;
  createdAt: string;
  isRead: boolean;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check auth
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUserId(data.user.id);
          setUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {}
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, userId, fetchMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;
    const msg = input.trim();
    setInput("");
    setIsLoading(true);

    // Optimistic add
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        message: msg,
        senderId: userId,
        sender: { id: userId, name: userName || "You", avatarUrl: null },
        createdAt: new Date().toISOString(),
        isRead: false,
      },
    ]);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
    } catch {}
    finally { setIsLoading(false); }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30 transition-shadow hover:shadow-red-500/50"
          >
            <MessageCircle className="size-6 text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0F1629]/98 backdrop-blur-xl shadow-2xl shadow-black/40"
            style={{ width: "min(384px, calc(100vw - 2rem))", height: "500px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 bg-gradient-to-r from-red-500/10 to-orange-500/5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-xs font-bold text-white">
                  CGA
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">CGA Support</h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-200">
                  <Minimize2 className="size-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-200">
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {!userId ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08]">
                    <LogIn className="size-7 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Please login to chat</p>
                    <p className="text-xs text-slate-500 mt-1">You need an account to use support chat.</p>
                  </div>
                  <Link href="/login">
                    <Button className="bg-red-500 hover:bg-red-600 text-white text-sm">
                      Login / Register
                    </Button>
                  </Link>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <MessageCircle className="size-10 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-400">No messages yet</p>
                    <p className="text-xs text-slate-500 mt-1">Start a conversation with our support team.</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isMe ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                        {msg.sender?.name?.charAt(0) || "?"}
                      </div>
                      <div className={`max-w-[75%] ${isMe ? "text-right" : ""}`}>
                        <div className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${isMe ? "bg-red-500/15 text-slate-200 rounded-tr-md" : "bg-white/[0.06] text-slate-300 rounded-tl-md"}`}>
                          {msg.message}
                        </div>
                        <p className="mt-0.5 text-[10px] text-slate-600">{formatTime(msg.createdAt)}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {userId && (
              <div className="border-t border-white/[0.08] p-3">
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                  className="flex items-center gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 border-white/[0.08] bg-white/[0.04] text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-red-500/30"
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-9 w-9 shrink-0 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized bubble */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30"
          >
            <MessageCircle className="size-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}