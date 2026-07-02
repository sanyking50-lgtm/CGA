"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare, Clock, Send, Loader2, User as UserIcon, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/* ──────────────── Types ──────────────── */

interface AdminTicket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  lastReplyAt: string | null;
  user: { id: string; name: string; email: string; avatarUrl: string | null };
  assignedStaff: { id: string; name: string; avatarUrl: string | null; staffRole: string | null } | null;
  _count: { replies: number };
}

interface TicketReply {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null; role: string };
}

/* ──────────────── Config ──────────────── */

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

const filterTabs = ["all", "open", "in_progress", "resolved", "closed"] as const;

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

/* ──────────────── Component ──────────────── */

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  // Quick reply
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const fetchTickets = useCallback(async (status?: string, priority?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== "all") params.set("status", status);
      if (priority && priority !== "all") params.set("priority", priority);
      const res = await fetch(`/api/admin/tickets?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets(activeFilter, priorityFilter);
  }, [activeFilter, priorityFilter, fetchTickets]);

  async function handleStatusChange(ticketId: string, status: string) {
    setUpdating(ticketId);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticketId, status }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchTickets(activeFilter, priorityFilter);
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setUpdating(null);
    }
  }

  async function handlePriorityChange(ticketId: string, priority: string) {
    setUpdating(ticketId);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticketId, priority }),
      });
      if (res.ok) {
        toast.success("Priority updated");
        fetchTickets(activeFilter, priorityFilter);
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setUpdating(null);
    }
  }

  async function openTicketDetail(ticket: AdminTicket) {
    setSelectedTicket(ticket);
    setShowDetail(true);
    setReplyText("");
    setLoadingReplies(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`);
      if (res.ok) {
        const data = await res.json();
        setReplies(data.ticket.replies || []);
      }
    } catch {
      toast.error("Failed to load conversation");
    } finally {
      setLoadingReplies(false);
    }
  }

  async function handleQuickReply() {
    if (!replyText.trim() || !selectedTicket || sendingReply) return;
    setSendingReply(true);
    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setReplies((prev) => [...prev, data.reply]);
        setReplyText("");
        fetchTickets(activeFilter, priorityFilter);
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to send reply");
      }
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Support Tickets</h1>
        <p className="text-sm text-slate-400 mt-1">Manage and respond to customer support requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 rounded-lg bg-white/[0.03] border border-white/[0.06] p-1 flex-1">
          {filterTabs.map((tab) => {
            const cfg = tab !== "all" ? statusConfig[tab] : null;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeFilter === tab ? "bg-white/[0.06] text-slate-100" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab === "all" ? "All" : cfg?.label || tab}
              </button>
            );
          })}
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px] border-white/[0.08] bg-white/[0.03] text-slate-200 text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-[#0F1629] border-white/[0.08]">
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tickets list */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MessageSquare className="size-12 text-slate-700 mb-4" />
              <p className="text-lg font-medium text-slate-300">No tickets found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {tickets.map((ticket) => {
                const sCfg = statusConfig[ticket.status] || statusConfig.open;
                const pCfg = priorityConfig[ticket.priority] || priorityConfig.medium;
                const lastDate = ticket.lastReplyAt || ticket.createdAt;
                const isActive = selectedTicket?.id === ticket.id;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => openTicketDetail(ticket)}
                    className={`w-full text-left rounded-xl border p-4 transition-colors ${
                      isActive
                        ? "border-red-500/30 bg-red-500/[0.04]"
                        : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-sm font-medium text-slate-200 truncate">{ticket.subject}</h3>
                          <Badge variant="outline" className={`${sCfg.color} text-[10px] px-1.5 py-0`}>{sCfg.label}</Badge>
                          <Badge variant="outline" className={`${pCfg.color} text-[10px] px-1.5 py-0`}>{pCfg.label}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="truncate">{ticket.user.name}</span>
                          <span>·</span>
                          <span>{ticket._count.replies} replies</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatDate(lastDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Select
                          value={ticket.status}
                          onValueChange={(v) => handleStatusChange(ticket.id, v)}
                        >
                          <SelectTrigger
                            disabled={updating === ticket.id}
                            className="h-7 w-[110px] border-white/[0.08] bg-white/[0.03] text-[10px]"
                          >
                            {updating === ticket.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent className="bg-[#0F1629] border-white/[0.08]">
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={ticket.priority}
                          onValueChange={(v) => handlePriorityChange(ticket.id, v)}
                        >
                          <SelectTrigger
                            disabled={updating === ticket.id}
                            className="h-7 w-[90px] border-white/[0.08] bg-white/[0.03] text-[10px]"
                          >
                            {updating === ticket.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent className="bg-[#0F1629] border-white/[0.08]">
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail / Quick Reply panel */}
        <div className="hidden lg:block">
          {showDetail && selectedTicket ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm flex flex-col h-[calc(100vh-200px)] sticky top-6">
              {/* Ticket info */}
              <div className="p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-medium text-slate-100 mb-2">{selectedTicket.subject}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={selectedTicket.user.avatarUrl || ""} />
                    <AvatarFallback className="bg-white/10 text-[8px]">{selectedTicket.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-slate-400">{selectedTicket.user.name}</span>
                  <span className="text-xs text-slate-600">·</span>
                  <span className="text-xs text-slate-500">{selectedTicket.user.email}</span>
                </div>
              </div>

              {/* Replies */}
              <ScrollArea className="flex-1 p-4">
                {loadingReplies ? (
                  <div className="flex justify-center py-10">
                    <div className="h-6 w-6 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {replies.map((reply) => (
                      <div key={reply.id} className={`flex gap-2 ${!reply.isStaff ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                          <AvatarImage src={reply.user.avatarUrl || ""} />
                          <AvatarFallback className={`text-[8px] ${reply.isStaff ? "bg-red-500/20 text-red-400" : "bg-white/10"}`}>
                            {reply.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`max-w-[85%] ${!reply.isStaff ? "text-right" : ""}`}>
                          <p className="text-[10px] text-slate-500 mb-0.5">
                            {reply.user.name}
                            {reply.isStaff && " (Staff)"}
                            {" · "}
                            {formatFullDate(reply.createdAt)}
                          </p>
                          <div className={`rounded-lg px-3 py-2 text-xs ${
                            reply.isStaff ? "bg-red-500/10 text-slate-200" : "bg-white/[0.04] text-slate-300"
                          }`}>
                            {reply.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Quick reply input */}
              {selectedTicket.status !== "closed" && (
                <div className="p-3 border-t border-white/[0.06]">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Quick reply…"
                    rows={3}
                    className="border-white/[0.08] bg-white/[0.03] text-slate-200 text-sm resize-none"
                    disabled={sendingReply}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleQuickReply();
                      }
                    }}
                  />
                  <Button
                    onClick={handleQuickReply}
                    disabled={!replyText.trim() || sendingReply}
                    size="sm"
                    className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white"
                  >
                    {sendingReply ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Send className="size-3.5 mr-1.5" />}
                    Reply
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="text-center">
                <MessageSquare className="size-8 text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}