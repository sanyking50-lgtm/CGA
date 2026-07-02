"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Users,
  UserCircle,
  Bell,
  Search,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UserResult {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SentNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const typeConfig: Record<string, { label: string; className: string }> = {
  info: { label: "Info", className: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  success: { label: "Success", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  warning: { label: "Warning", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  order_update: { label: "Order", className: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  payment: { label: "Payment", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  promo: { label: "Promo", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminNotificationsPage() {
  /* ---------- form state ---------- */
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [linkUrl, setLinkUrl] = useState("");
  const [targetMode, setTargetMode] = useState<"all" | "specific">("all");
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [sending, setSending] = useState(false);

  /* ---------- user search ---------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  /* ---------- recent notifications ---------- */
  const [recent, setRecent] = useState<SentNotification[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  /* ---------- fetch recent ---------- */
  const loadRecent = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=10");
      if (res.ok) {
        const data = await res.json();
        setRecent(data.notifications || []);
      }
    } catch {
      // silent
    } finally {
      setLoadingRecent(false);
    }
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  /* ---------- search users ---------- */
  useEffect(() => {
    if (targetMode !== "specific" || !searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/admin/users?search=${encodeURIComponent(searchQuery.trim())}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.users || []);
          setShowDropdown(true);
        }
      } catch {
        // silent
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, targetMode]);

  /* ---------- send ---------- */
  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    if (targetMode === "specific" && !selectedUser) {
      toast.error("Please select a user");
      return;
    }

    setSending(true);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        message: message.trim(),
        type,
        linkUrl: linkUrl.trim() || null,
      };

      if (targetMode === "all") {
        body.allUsers = true;
      } else {
        body.userId = selectedUser!.id;
      }

      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send");
        return;
      }

      toast.success(
        targetMode === "all"
          ? `Broadcast sent to ${data.sentCount} users`
          : "Notification sent"
      );

      // Reset form
      setTitle("");
      setMessage("");
      setType("info");
      setLinkUrl("");
      setSelectedUser(null);
      setSearchQuery("");

      loadRecent();
    } catch {
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
            <Bell className="size-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Notifications
            </h1>
            <p className="text-sm text-slate-500">
              Send notifications to users
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ---- Compose Card ---- */}
        <Card className="lg:col-span-3 border-white/[0.08] bg-white/[0.03]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
              <Send className="size-4 text-red-400" />
              Compose Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label className="text-slate-300">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title..."
                className="mt-1.5 border-white/[0.08] bg-white/[0.03] text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
              />
            </div>

            {/* Message */}
            <div>
              <Label className="text-slate-300">Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your notification message..."
                rows={4}
                className="mt-1.5 border-white/[0.08] bg-white/[0.03] text-slate-100 placeholder:text-slate-600 focus:border-red-500/50 resize-none"
              />
            </div>

            {/* Type & Link */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-slate-300">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="mt-1.5 border-white/[0.08] bg-white/[0.03] text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/[0.1] bg-[#0F1629]">
                    {Object.entries(typeConfig).map(([key, cfg]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="text-slate-300 focus:bg-white/5 focus:text-white"
                      >
                        {cfg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">
                  Link URL{" "}
                  <span className="text-slate-600">(optional)</span>
                </Label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1.5 border-white/[0.08] bg-white/[0.03] text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
                />
              </div>
            </div>

            {/* Target */}
            <div>
              <Label className="text-slate-300">Target</Label>
              <div className="mt-1.5 flex gap-2">
                <Button
                  type="button"
                  variant={targetMode === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTargetMode("all");
                    setSelectedUser(null);
                    setSearchQuery("");
                  }}
                  className={
                    targetMode === "all"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                  }
                >
                  <Users className="size-3.5 mr-1.5" />
                  All Users
                </Button>
                <Button
                  type="button"
                  variant={targetMode === "specific" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTargetMode("specific")}
                  className={
                    targetMode === "specific"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                  }
                >
                  <UserCircle className="size-3.5 mr-1.5" />
                  Specific User
                </Button>
              </div>
            </div>

            {/* User search (specific mode) */}
            {targetMode === "specific" && (
              <div className="relative">
                {selectedUser ? (
                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                    <UserCircle className="size-4 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">
                        {selectedUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {selectedUser.email}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-500 hover:text-red-400"
                      onClick={() => {
                        setSelectedUser(null);
                        setSearchQuery("");
                      }}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search user by name or email..."
                      className="pl-9 border-white/[0.08] bg-white/[0.03] text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
                    />
                    {showDropdown && (
                      <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/[0.1] bg-[#0F1629] shadow-xl max-h-48 overflow-y-auto">
                        {searching ? (
                          <div className="px-3 py-2 text-sm text-slate-500">
                            Searching...
                          </div>
                        ) : searchResults.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-slate-500">
                            No users found
                          </div>
                        ) : (
                          searchResults.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setSelectedUser(u);
                                setShowDropdown(false);
                                setSearchQuery("");
                              }}
                              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                              <UserCircle className="size-4 shrink-0 text-slate-500" />
                              <div className="flex-1 min-w-0 text-left">
                                <p className="truncate">{u.name}</p>
                                <p className="truncate text-xs text-slate-500">
                                  {u.email}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-xs text-slate-500 border-white/[0.06]"
                              >
                                {u.role}
                              </Badge>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Send button */}
            <Button
              onClick={handleSend}
              disabled={sending}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/40 transition-all"
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  {targetMode === "all"
                    ? "Broadcast to All Users"
                    : "Send Notification"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ---- Recent Notifications ---- */}
        <Card className="lg:col-span-2 border-white/[0.08] bg-white/[0.03]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-red-400" />
              Recent Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {loadingRecent ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  Loading...
                </div>
              ) : recent.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No notifications sent yet.
                </div>
              ) : (
                recent.map((n) => {
                  const cfg = typeConfig[n.type] || typeConfig.info;
                  return (
                    <div
                      key={n.id}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-200 line-clamp-1">
                          {n.title}
                        </p>
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-[10px] ${cfg.className}`}
                        >
                          {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-600">
                          {timeAgo(n.createdAt)}
                        </span>
                        <span
                          className={`text-[11px] ${n.isRead ? "text-slate-600" : "text-red-400"}`}
                        >
                          {n.isRead ? "Read" : "Unread"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}