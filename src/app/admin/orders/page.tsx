"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Save, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type OrderRow = {
  id: string; orderNumber: string; serviceType: string; packageName: string | null;
  totalPriceBdt: number; status: string; expressDelivery: boolean;
  createdAt: string; internalNotes: string | null;
  user: { id: string; name: string; email: string };
  assignedStaff: { id: string; name: string } | null;
};

const statusColors: Record<string, string> = {
  pending_payment: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  paid_pending_assign: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  assigned: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  in_progress: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  in_review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  revision: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  pending_payment: "Pending", paid_pending_assign: "Paid", assigned: "Assigned",
  in_progress: "In Progress", in_review: "In Review", revision: "Revision",
  delivered: "Delivered", cancelled: "Cancelled",
};

const statusFlow = ["pending_payment", "paid_pending_assign", "assigned", "in_progress", "in_review", "delivered"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [staff, setStaff] = useState<{ id: string; name: string; staffRole: string | null }[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setStaff(data.staff || []);
      const n: Record<string, string> = {};
      (data.orders || []).forEach((o: OrderRow) => { n[o.id] = o.internalNotes || ""; });
      setNotes(n);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateOrder = async (id: string, body: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success("Order updated");
        fetchOrders();
      } else {
        const err = await res.json();
        toast.error(err.error || "Update failed");
      }
    } catch { toast.error("Failed to update order"); }
  };

  const saveNotes = (id: string) => {
    updateOrder(id, { internalNotes: notes[id] });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Order Management</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input placeholder="Search order # or client..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10 border-white/[0.08] bg-white/[0.03] text-slate-100" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-44 border-white/[0.08] bg-white/[0.03] text-slate-300">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-[#0F1629] border-white/[0.1]">
            <SelectItem value="all">All Statuses</SelectItem>
            {statusFlow.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06]">
              <TableHead className="text-slate-400">Order</TableHead>
              <TableHead className="text-slate-400">Client</TableHead>
              <TableHead className="text-slate-400">Service</TableHead>
              <TableHead className="text-slate-400">Amount</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Assigned</TableHead>
              <TableHead className="text-slate-400">Notes</TableHead>
              <TableHead className="text-slate-400">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-slate-500">Loading...</TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-slate-500">No orders found.</TableCell></TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id} className="border-white/[0.06]">
                  <TableCell>
                    <div>
                      <span className="font-mono text-sm text-slate-200">{o.orderNumber}</span>
                      {o.expressDelivery && <Badge className="ml-2 bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">Express</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">{o.user?.name}</TableCell>
                  <TableCell className="text-sm text-slate-400">{o.serviceType}{o.packageName ? ` / ${o.packageName}` : ""}</TableCell>
                  <TableCell className="text-sm text-slate-300 font-medium">৳{o.totalPriceBdt}</TableCell>
                  <TableCell>
                    <Select value={o.status} onValueChange={(v) => updateOrder(o.id, { status: v })}>
                      <SelectTrigger className={`w-36 h-7 text-xs ${statusColors[o.status] || ""}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F1629] border-white/[0.1]">
                        {statusFlow.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                        <SelectItem value="revision">Revision</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={o.assignedStaff?.id || "unassigned"} onValueChange={(v) => updateOrder(o.id, { assignedTo: v === "unassigned" ? null : v })}>
                      <SelectTrigger className="w-32 h-7 text-xs border-white/[0.08] bg-white/[0.03] text-slate-300">
                        <SelectValue placeholder={o.assignedStaff?.name || "Unassigned"} />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F1629] border-white/[0.1]">
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                        value={notes[o.id] || ""}
                        onChange={(e) => setNotes({ ...notes, [o.id]: e.target.value })}
                        className="h-7 w-28 text-xs border-white/[0.08] bg-white/[0.03]"
                        placeholder="Notes..."
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-slate-400 hover:text-emerald-400" onClick={() => saveNotes(o.id)}>
                        <Save className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" className="border-white/[0.08] bg-white/[0.03] text-slate-400" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
          <span className="text-sm text-slate-500">Page {page} of {Math.ceil(total / 20)}</span>
          <Button variant="outline" size="sm" className="border-white/[0.08] bg-white/[0.03] text-slate-400" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </motion.div>
  );
}