"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MessageSquare, Clock, ArrowRight, ChevronDown,
  AlertCircle, CheckCircle2, Loader2, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  lastReplyAt: string | null;
  createdAt: string;
  _count: { replies: number };
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

const filterTabs = ["all", "open", "in_progress", "resolved"] as const;

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

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // New ticket dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async (status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== "all") params.set("status", status);
      const res = await fetch(`/api/tickets?${params}`);
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
    fetchTickets(activeFilter);
  }, [activeFilter, fetchTickets]);

  async function handleCreateTicket() {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim(), priority }),
      });
      if (res.ok) {
        toast.success("Ticket created!");
        setDialogOpen(false);
        setSubject("");
        setMessage("");
        setPriority("medium");
        fetchTickets(activeFilter);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create ticket");
      }
    } catch {
      toast.error("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Support Tickets</h1>
          <p className="text-sm text-slate-400 mt-1">Get help from our team</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700">
              <Plus className="size-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F1629] border-white/[0.08] text-slate-100 max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="border-white/[0.08] bg-white/[0.03] text-slate-200"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="border-white/[0.08] bg-white/[0.03] text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F1629] border-white/[0.08]">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1.5 block">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  className="border-white/[0.08] bg-white/[0.03] text-slate-200 resize-none"
                />
              </div>
              <Button
                onClick={handleCreateTicket}
                disabled={submitting || !subject.trim() || !message.trim()}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
              >
                {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Submit Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg bg-white/[0.03] border border-white/[0.06] p-1">
        {filterTabs.map((tab) => {
          const cfg = tab !== "all" ? statusConfig[tab] : null;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeFilter === tab
                  ? "bg-white/[0.06] text-slate-100"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "all" ? "All" : cfg?.label || tab}
            </button>
          );
        })}
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare className="size-12 text-slate-700 mb-4" />
          <p className="text-lg font-medium text-slate-300">No tickets found</p>
          <p className="text-sm text-slate-500 mt-1">
            {activeFilter === "all"
              ? "Create a new ticket to get help from our team."
              : "No tickets with this status."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const sCfg = statusConfig[ticket.status] || statusConfig.open;
            const pCfg = priorityConfig[ticket.priority] || priorityConfig.medium;
            const lastDate = ticket.lastReplyAt || ticket.createdAt;
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                  className="w-full text-left rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4 hover:bg-white/[0.05] transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3 className="text-sm font-medium text-slate-200 truncate">
                          {ticket.subject}
                        </h3>
                        <Badge variant="outline" className={`${sCfg.color} text-[10px] px-1.5 py-0`}>
                          {sCfg.label}
                        </Badge>
                        <Badge variant="outline" className={`${pCfg.color} text-[10px] px-1.5 py-0`}>
                          {pCfg.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="size-3" />
                          {ticket._count.replies} {ticket._count.replies === 1 ? "reply" : "replies"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDate(lastDate)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0 mt-1" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}