"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Search,
  UserPlus,
  Download,
  Users,
  UserCheck,
  TrendingUp,
  Loader2,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

interface Stats {
  total: number;
  active: number;
  thisMonth: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getSourceBadgeClass(source: string): string {
  switch (source) {
    case "popup":
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    case "footer":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "admin":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-white/[0.05] text-slate-400 border-white/[0.06]";
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminNewsletterPage() {
  /* ---------- Data state ---------- */
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------- Stats state ---------- */
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, thisMonth: 0 });

  /* ---------- Add subscriber form ---------- */
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");
  const [adding, setAdding] = useState(false);

  const limit = 20;

  /* ---------- Fetch subscribers ---------- */
  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/newsletter?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  /* ---------- Fetch stats ---------- */
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter?limit=1");
      if (res.ok) {
        const data = await res.json();
        const all = data.subscribers || [];

        // Compute from all data for stats
        // For efficiency, use a separate approach: fetch active count
        const statsRes = await fetch("/api/newsletter");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          const activeCount = statsData.totalSubscribers || 0;

          // Compute this month count from fetched data
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const thisMonthCount = all.filter(
            (s: Subscriber) => new Date(s.subscribedAt) >= monthStart && s.isActive
          ).length;

          setStats({
            total: data.total || 0,
            active: activeCount,
            thisMonth: thisMonthCount,
          });
        }
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  /* ---------- Search debounce ---------- */
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ---------- Unsubscribe ---------- */
  const handleUnsubscribe = async (id: string) => {
    if (!confirm("Unsubscribe this email?")) return;
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Subscriber unsubscribed");
        loadSubscribers();
        loadStats();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to unsubscribe");
      }
    } catch {
      toast.error("Failed to unsubscribe");
    }
  };

  /* ---------- Add subscriber ---------- */
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = addEmail.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, name: addName.trim() || undefined }),
      });

      const data = await res.json();

      if (res.status === 409) {
        toast.error("This email is already subscribed");
        return;
      }

      if (!res.ok) {
        toast.error(data.error || "Failed to add subscriber");
        return;
      }

      toast.success("Subscriber added");
      setAddEmail("");
      setAddName("");
      loadSubscribers();
      loadStats();
    } catch {
      toast.error("Failed to add subscriber");
    } finally {
      setAdding(false);
    }
  };

  /* ---------- Export CSV ---------- */
  const handleExport = async () => {
    try {
      // Fetch all active subscribers
      const allSubs: Subscriber[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(`/api/admin/newsletter?page=${currentPage}&limit=100`);
        if (!res.ok) break;
        const data = await res.json();
        const activeSubs = (data.subscribers || []).filter((s: Subscriber) => s.isActive);
        allSubs.push(...activeSubs);
        hasMore = currentPage < (data.totalPages || 1);
        currentPage++;
      }

      if (allSubs.length === 0) {
        toast.error("No active subscribers to export");
        return;
      }

      const csv = [
        ["Email", "Name", "Source", "Subscribed At"].join(","),
        ...allSubs.map((s) =>
          [
            s.email,
            s.name || "",
            s.source,
            new Date(s.subscribedAt).toISOString(),
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Exported ${allSubs.length} subscribers`);
    } catch {
      toast.error("Failed to export");
    }
  };

  /* ---------- Render ---------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
            <Mail className="size-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Newsletter</h1>
            <p className="text-sm text-slate-500">
              Manage email subscribers
            </p>
          </div>
        </div>
        <Button
          onClick={handleExport}
          className="bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:bg-white/[0.06] hover:text-slate-100"
        >
          <Download className="size-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
              <Users className="size-5 text-sky-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Subscribers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <UserCheck className="size-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{stats.active}</p>
              <p className="text-xs text-slate-500">Active Subscribers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <TrendingUp className="size-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{stats.thisMonth}</p>
              <p className="text-xs text-slate-500">New This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* ---- Subscriber Table ---- */}
        <Card className="lg:col-span-3 border-white/[0.08] bg-white/[0.03]">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg text-slate-100">
                Subscribers
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search email or name..."
                  className="pl-9 h-9 border-white/[0.08] bg-white/[0.03] text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-slate-500" />
              </div>
            ) : subscribers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Mail className="size-10 text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">
                  {search ? "No subscribers match your search" : "No subscribers yet"}
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-[480px] overflow-y-auto rounded-lg border border-white/[0.06]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.06] hover:bg-transparent">
                        <TableHead className="text-slate-500 text-xs">Email</TableHead>
                        <TableHead className="text-slate-500 text-xs">Name</TableHead>
                        <TableHead className="text-slate-500 text-xs">Source</TableHead>
                        <TableHead className="text-slate-500 text-xs">Status</TableHead>
                        <TableHead className="text-slate-500 text-xs">Subscribed</TableHead>
                        <TableHead className="text-slate-500 text-xs text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((sub) => (
                        <TableRow
                          key={sub.id}
                          className="border-white/[0.04] hover:bg-white/[0.02]"
                        >
                          <TableCell className="text-sm text-slate-200 font-mono">
                            {sub.email}
                          </TableCell>
                          <TableCell className="text-sm text-slate-400">
                            {sub.name || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${getSourceBadgeClass(sub.source)}`}
                            >
                              {sub.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                sub.isActive
                                  ? "text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "text-[10px] bg-slate-500/10 text-slate-400 border-slate-500/20"
                              }
                            >
                              {sub.isActive ? "Active" : "Unsubscribed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {formatDate(sub.subscribedAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            {sub.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUnsubscribe(sub.id)}
                                className="h-7 text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <Ban className="size-3 mr-1" />
                                Unsub
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-slate-600">
                      {total} total · Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="h-8 text-xs border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="h-8 text-xs border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* ---- Add Subscriber Form ---- */}
        <Card className="border-white/[0.08] bg-white/[0.03] h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
              <UserPlus className="size-4 text-red-400" />
              Add Subscriber
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label className="text-slate-300 text-sm">Email</Label>
                <Input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="subscriber@email.com"
                  disabled={adding}
                  required
                  className="mt-1.5 h-10 border-white/[0.08] bg-white/[0.03] text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-sm">
                  Name{" "}
                  <span className="text-slate-600">(optional)</span>
                </Label>
                <Input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="John Doe"
                  disabled={adding}
                  className="mt-1.5 h-10 border-white/[0.08] bg-white/[0.03] text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
                />
              </div>
              <Button
                type="submit"
                disabled={adding}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/40 transition-all"
              >
                {adding ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="size-4" />
                    Add Subscriber
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}