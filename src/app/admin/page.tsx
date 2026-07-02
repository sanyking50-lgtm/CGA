"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, ShoppingCart, DollarSign, Star, TrendingUp, Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type StatCard = {
  title: string; value: string; icon: React.ReactNode; color: string; bg: string;
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
  pending_payment: "Pending",
  paid_pending_assign: "Paid",
  assigned: "Assigned",
  in_progress: "In Progress",
  in_review: "In Review",
  revision: "Revision",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" /></div>;
  if (!data) return <p className="text-slate-500">Failed to load analytics.</p>;

  const stats: StatCard[] = [
    { title: "Total Users", value: data.totalUsers?.toLocaleString(), icon: <Users className="size-5" />, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Active Orders", value: data.totalOrders?.toLocaleString(), icon: <ShoppingCart className="size-5" />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Revenue", value: `৳${data.totalRevenue?.toLocaleString()}`, icon: <DollarSign className="size-5" />, color: "text-amber-400", bg: "bg-amber-500/10" },
    { title: "Avg Rating", value: `${data.avgRating} ★`, icon: <Star className="size-5" />, color: "text-red-400", bg: "bg-red-500/10" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-white/[0.08] bg-white/[0.03]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{s.title}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-100">{s.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>{s.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status Breakdown */}
      {data.ordersByStatus?.length > 0 && (
        <Card className="mt-6 border-white/[0.08] bg-white/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-200">Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {data.ordersByStatus.map((s: { status: string; count: number }) => (
                <div key={s.status} className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                  <Badge variant="outline" className={statusColors[s.status] || ""}>{statusLabels[s.status] || s.status}</Badge>
                  <span className="text-sm font-semibold text-slate-200">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card className="mt-6 border-white/[0.08] bg-white/[0.03]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-200">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentOrders?.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06]">
                  <TableHead className="text-slate-400">Order #</TableHead>
                  <TableHead className="text-slate-400">Client</TableHead>
                  <TableHead className="text-slate-400">Service</TableHead>
                  <TableHead className="text-slate-400">Amount</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((o: any) => (
                  <TableRow key={o.id} className="border-white/[0.06]">
                    <TableCell className="font-mono text-sm text-slate-300">{o.orderNumber}</TableCell>
                    <TableCell className="text-sm text-slate-300">{o.user?.name}</TableCell>
                    <TableCell className="text-sm text-slate-400">{o.serviceType}</TableCell>
                    <TableCell className="text-sm text-slate-300">৳{o.totalPriceBdt}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColors[o.status] || ""}>{statusLabels[o.status] || o.status}</Badge></TableCell>
                    <TableCell className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}