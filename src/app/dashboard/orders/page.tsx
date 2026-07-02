"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Filter, ExternalLink, Clock, CreditCard } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  pending_payment: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  paid_pending_assign: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  assigned: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  in_progress: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  in_review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  revision: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  pending_payment: "Pending Payment",
  paid_pending_assign: "Paid — Awaiting Assign",
  assigned: "Assigned",
  in_progress: "In Progress",
  in_review: "In Review",
  revision: "Revision",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentStatusColors: Record<string, string> = {
  pending: "text-yellow-400",
  paid: "text-emerald-400",
  failed: "text-red-400",
  refunded: "text-orange-400",
};

interface OrderWithPayment {
  id: string;
  orderNumber: string;
  serviceType: string;
  packageName: string | null;
  packagePrice: string;
  totalPriceBdt: string;
  expressDelivery: boolean;
  status: string;
  paymentGateway: string | null;
  createdAt: string;
  deliveryDeadline: string | null;
  payments: {
    id: string;
    amountBdt: string;
    method: string | null;
    status: string;
    transactionId: string | null;
    createdAt: string;
  }[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  function formatPrice(price: string | number): string {
    return `৳${Number(price).toLocaleString("en-BD")}`;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Orders</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track and manage all your orders
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
        >
          <Link href="/checkout">
            <ShoppingCart className="size-4 mr-2" />
            New Order
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-white/[0.06] bg-white/[0.03] animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/5 rounded w-32" />
                    <div className="h-3 bg-white/5 rounded w-48" />
                  </div>
                  <div className="h-8 bg-white/5 rounded w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5">
              <ShoppingCart className="size-9 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-slate-300">No orders yet</p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                When you place an order, it will appear here. You can track status, download files, and communicate with the team.
              </p>
            </div>
            <Button asChild variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">
              <Link href="/checkout">Browse Services & Order</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Status filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus("all")}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]"
              }`}
            >
              All ({orders.length})
            </button>
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? statusColors[status]
                    : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]"
                }`}
              >
                {statusLabels[status] || status} ({count})
              </button>
            ))}
          </div>

          {/* Orders list */}
          <div className="space-y-3">
            {filteredOrders.map((order, idx) => {
              const payment = order.payments?.[0];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.05] transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Left info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-sm font-bold text-slate-200">
                              {order.orderNumber}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[11px] ${statusColors[order.status] || "border-white/10 text-slate-400"}`}
                            >
                              {statusLabels[order.status] || order.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <span className="text-slate-300 font-medium">
                              {order.packageName || order.serviceType}
                            </span>
                            <span className="text-slate-500">
                              {order.serviceType.replace(/-/g, " ")}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatDate(order.createdAt)}
                            </span>
                            {payment && (
                              <span className="flex items-center gap-1">
                                <CreditCard className="size-3" />
                                <span className={paymentStatusColors[payment.status] || "text-slate-500"}>
                                  {payment.status === "paid" ? "Paid" : payment.status}
                                </span>
                              </span>
                            )}
                            {order.expressDelivery && (
                              <Badge variant="outline" className="text-[10px] border-amber-500/20 text-amber-400">
                                Express
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Right: Price + Actions */}
                        <div className="flex items-center gap-4 sm:text-right">
                          <div>
                            <p className="text-lg font-bold text-slate-100">
                              {formatPrice(order.totalPriceBdt)}
                            </p>
                            {payment?.method && (
                              <p className="text-xs text-slate-500">{payment.method}</p>
                            )}
                          </div>
                          {(order.status === "pending_payment" || order.status === "paid_pending_assign") && (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-white/10 text-slate-300 hover:bg-white/5 shrink-0"
                            >
                              <Link href="/checkout">
                                <ExternalLink className="size-3.5 mr-1" />
                                Pay
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {filteredOrders.length === 0 && filterStatus !== "all" && (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500">
                  No orders with status &quot;{statusLabels[filterStatus]}&quot;
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}