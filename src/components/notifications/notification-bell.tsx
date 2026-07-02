"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Info,
  CheckCircle2,
  AlertTriangle,
  Package,
  CreditCard,
  Megaphone,
  CheckCheck,
  ExternalLink,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  linkUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const typeIcons: Record<string, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  order_update: Package,
  payment: CreditCard,
  promo: Megaphone,
};

const typeColors: Record<string, string> = {
  info: "text-sky-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  order_update: "text-violet-400",
  payment: "text-emerald-400",
  promo: "text-orange-400",
};

const typeBgColors: Record<string, string> = {
  info: "bg-sky-500/10",
  success: "bg-emerald-500/10",
  warning: "bg-amber-500/10",
  order_update: "bg-violet-500/10",
  payment: "bg-emerald-500/10",
  promo: "bg-orange-500/10",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "Just now";
  const mins = Math.floor(secs / 60);
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

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---------- fetch ---------- */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=10");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds
    pollRef.current = setInterval(fetchNotifications, 30000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchNotifications]);

  // Re-fetch when popover opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  /* ---------- mark single as read ---------- */
  const markAsRead = useCallback(
    async (n: Notification) => {
      try {
        await fetch(`/api/notifications/${n.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === n.id
              ? { ...item, isRead: true, readAt: new Date().toISOString() }
              : item
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Navigate if linkUrl present
        if (n.linkUrl) {
          router.push(n.linkUrl);
          setOpen(false);
        }
      } catch {
        // silent
      }
    },
    [router]
  );

  /* ---------- mark all as read ---------- */
  const markAllAsRead = async () => {
    if (markingAll) return;
    setMarkingAll(true);
    try {
      // Use any notification id to hit the endpoint with readAll=true
      if (notifications.length > 0) {
        await fetch(`/api/notifications/${notifications[0].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ readAll: true }),
        });
      }

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch {
      // silent
    } finally {
      setMarkingAll(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm shadow-red-500/40">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 rounded-xl border-white/[0.1] bg-[#0F1629]/98 backdrop-blur-xl p-0 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingAll}
              className="flex items-center gap-1 text-xs text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
            >
              <CheckCheck className="size-3.5" />
              {markingAll ? "Marking..." : "Mark all read"}
            </button>
          )}
        </div>

        {/* Notifications list */}
        <ScrollArea className="max-h-[360px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-5 border-2 border-white/10 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Bell className="size-8 text-slate-700" />
              <p className="text-sm text-slate-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {notifications.map((n) => {
                const Icon = typeIcons[n.type] || Info;
                const iconColor = typeColors[n.type] || "text-slate-400";
                const iconBg = typeBgColors[n.type] || "bg-slate-500/10";

                return (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]",
                      !n.isRead && "bg-white/[0.02]"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5",
                        iconBg
                      )}
                    >
                      <Icon className={cn("size-4", iconColor)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm leading-snug line-clamp-1",
                            n.isRead ? "text-slate-400" : "text-slate-100 font-medium"
                          )}
                        >
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-xs leading-relaxed line-clamp-2",
                          n.isRead ? "text-slate-600" : "text-slate-400"
                        )}
                      >
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[11px] text-slate-600">
                          {timeAgo(n.createdAt)}
                        </span>
                        {n.linkUrl && (
                          <span className="flex items-center gap-0.5 text-[11px] text-red-400/70">
                            <ExternalLink className="size-2.5" />
                            Link
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-white/[0.06] px-4 py-2.5">
            <button
              onClick={() => {
                router.push("/dashboard?tab=notifications");
                setOpen(false);
              }}
              className="w-full text-center text-xs font-medium text-slate-400 transition-colors hover:text-slate-200"
            >
              View all notifications
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}