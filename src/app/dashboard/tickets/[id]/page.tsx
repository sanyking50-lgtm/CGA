"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Send, CheckCircle2, Loader2, MessageSquare, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Reply {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null; role: string };
}

interface TicketData {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  lastReplyAt: string | null;
  resolvedAt: string | null;
  user: { id: string; name: string; email: string; avatarUrl: string | null };
  assignedStaff: { id: string; name: string; avatarUrl: string | null; staffRole: string | null } | null;
  replies: Reply[];
}

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  in_progress: { label: "In Progress", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  resolved: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  closed: { label: "Closed", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  medium: { label: "Medium", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  urgent: { label: "Urgent", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data.ticket);
      } else {
        toast.error("Ticket not found");
        router.push("/dashboard/tickets");
      }
    } catch {
      toast.error("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }, [ticketId, router]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.replies.length]);

  async function handleReply() {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setTicket((prev) => {
          if (!prev) return prev;
          return { ...prev, replies: [...prev.replies, data.reply], lastReplyAt: new Date().toISOString() };
        });
        setReplyText("");
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to send reply");
      }
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  async function handleResolve() {
    setResolving(true);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticketId, status: "resolved" }),
      });
      if (res.ok) {
        toast.success("Ticket marked as resolved");
        fetchTicket();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update ticket");
    } finally {
      setResolving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) return null;

  const sCfg = statusConfig[ticket.status] || statusConfig.open;
  const pCfg = priorityConfig[ticket.priority] || priorityConfig.medium;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/tickets")}
            className="text-slate-400 hover:text-slate-200 hover:bg-white/5"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-100">{ticket.subject}</h1>
              <Badge variant="outline" className={`${sCfg.color} text-[10px]`}>
                {sCfg.label}
              </Badge>
              <Badge variant="outline" className={`${pCfg.color} text-[10px]`}>
                {pCfg.label}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              #{ticket.id.slice(0, 8)} · Created {formatDate(ticket.createdAt)}
            </p>
          </div>
        </div>
        {ticket.status === "open" && ticket.replies.length > 0 && (
          <Button
            onClick={handleResolve}
            disabled={resolving}
            variant="outline"
            className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
          >
            {resolving ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle2 className="size-4 mr-2" />}
            Mark Resolved
          </Button>
        )}
      </div>

      {/* Conversation */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm flex flex-col h-[calc(100vh-320px)] min-h-[400px]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Original message */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={ticket.user.avatarUrl || ""} />
                <AvatarFallback className="bg-white/10 text-xs">
                  {ticket.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-200">{ticket.user.name}</p>
                  <span className="text-[10px] text-slate-600">{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
                  {ticket.message}
                </div>
              </div>
            </div>

            {/* Replies */}
            {ticket.replies.map((reply) => {
              const isMe = reply.user.id === ticket.user.id;
              return (
                <div key={reply.id} className={`flex gap-3 ${!isMe ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={reply.user.avatarUrl || ""} />
                    <AvatarFallback className={`text-xs ${reply.isStaff ? "bg-red-500/20 text-red-400" : "bg-white/10"}`}>
                      {reply.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[75%] ${!isMe ? "text-right" : ""}`}>
                    <div className="flex items-center gap-2 mb-1" style={{ flexDirection: isMe ? "row" : "row-reverse" }}>
                      <p className="text-xs text-slate-400">{reply.user.name}</p>
                      {reply.isStaff && (
                        <Badge variant="outline" className="border-red-500/20 text-red-400 text-[9px] px-1 py-0">
                          Staff
                        </Badge>
                      )}
                      <span className="text-[10px] text-slate-600">{formatDate(reply.createdAt)}</span>
                    </div>
                    <div className={`rounded-xl px-4 py-2.5 text-sm inline-block text-left ${
                      reply.isStaff
                        ? "bg-red-500/10 text-slate-200"
                        : "bg-white/[0.04] text-slate-300"
                    }`}>
                      {reply.message}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Reply input */}
        {ticket.status !== "closed" && (
          <>
            <Separator className="bg-white/[0.06]" />
            <div className="p-3">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={ticket.status === "resolved" ? "Replying will reopen this ticket…" : "Type your reply…"}
                  rows={2}
                  className="flex-1 border-white/[0.08] bg-white/[0.03] text-slate-200 resize-none"
                  disabled={sending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleReply();
                    }
                  }}
                />
                <Button
                  onClick={handleReply}
                  disabled={!replyText.trim() || sending}
                  className="bg-red-500 hover:bg-red-600 text-white self-end"
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}