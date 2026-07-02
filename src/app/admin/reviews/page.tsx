"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Check, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

/* ──────────────── Types ──────────────── */

interface ReviewItem {
  id: string;
  stars: number;
  comment: string | null;
  allowPublic: boolean;
  isApproved: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  } | null;
  order: {
    orderNumber: string;
    serviceType: string;
    packageName: string | null;
  } | null;
}

interface ReviewStats {
  reviews: ReviewItem[];
  total: number;
  page: number;
  pages: number;
}

/* ──────────────── Helpers ──────────────── */

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatServiceType(type: string) {
  return type
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function StarsDisplay({ stars, size = "sm" }: { stars: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "size-3.5" : "size-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${s <= stars ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
        />
      ))}
    </div>
  );
}

/* ──────────────── Component ──────────────── */

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [data, setData] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Rating distribution (computed from all reviews)
  const [distribution, setDistribution] = useState<Record<number, number>>({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
  });
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalApproved, setTotalApproved] = useState<number>(0);

  const fetchReviews = useCallback(async (status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (status && status !== "all") params.set("status", status);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);

      // Compute distribution from all reviews if we're fetching "all"
      if (!status || status === "all") {
        const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalStars = 0;
        let count = 0;
        json.reviews.forEach((r: ReviewItem) => {
          dist[r.stars] = (dist[r.stars] || 0) + 1;
          totalStars += r.stars;
          count++;
        });
        setDistribution(dist);
        setAverageRating(count > 0 ? Math.round((totalStars / count) * 10) / 10 : 0);
        setTotalApproved(count);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const status = activeTab === "all" ? undefined : activeTab;
    fetchReviews(status);
  }, [activeTab, fetchReviews]);

  const handleAction = async (reviewId: string, action: "approve" | "reject") => {
    setActionLoading(reviewId);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, action }),
      });
      if (!res.ok) throw new Error();
      toast.success(action === "approve" ? "Review approved" : "Review rejected");
      // Reload current tab
      const status = activeTab === "all" ? undefined : activeTab;
      fetchReviews(status);
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const maxDistCount = Math.max(...Object.values(distribution), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Reviews Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500 mb-1">Average Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-100">{averageRating}</span>
              <StarsDisplay stars={Math.round(averageRating)} size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500 mb-1">Total Reviews</p>
            <span className="text-3xl font-bold text-slate-100">{totalApproved}</span>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500 mb-1">5-Star Reviews</p>
            <span className="text-3xl font-bold text-amber-400">{distribution[5]}</span>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500 mb-1">Pending Review</p>
            <span className="text-3xl font-bold text-red-400">
              {data && activeTab === "pending" ? data.total : 0}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="border-white/[0.08] bg-white/[0.03]">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Rating Distribution</h3>
          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star];
              const pct = maxDistCount > 0 ? (count / maxDistCount) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 w-16 shrink-0">
                    <span className="text-sm font-medium text-slate-300">{star}</span>
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs & Reviews List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/[0.04] border border-white/[0.08]">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-red-500/15 data-[state=active]:text-red-400 text-slate-400"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="data-[state=active]:bg-red-500/15 data-[state=active]:text-red-400 text-slate-400"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-red-500/15 data-[state=active]:text-red-400 text-slate-400"
          >
            All
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Reviews Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="size-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : !data || data.reviews.length === 0 ? (
          <Card className="border-white/[0.08] bg-white/[0.03]">
            <CardContent className="p-12 text-center">
              <MessageSquare className="size-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No reviews found</p>
            </CardContent>
          </Card>
        ) : (
          data.reviews.map((review) => (
            <Card key={review.id} className="border-white/[0.08] bg-white/[0.03]">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage src={review.user?.avatarUrl || ""} />
                    <AvatarFallback className="bg-white/10 text-sm">
                      {review.user?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-slate-200">
                        {review.user?.name || "Unknown"}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          review.isApproved
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-400 text-[10px] px-1.5 py-0"
                        }
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                      {!review.allowPublic && (
                        <Badge
                          variant="outline"
                          className="border-slate-500/20 bg-slate-500/10 text-slate-400 text-[10px] px-1.5 py-0"
                        >
                          Private
                        </Badge>
                      )}
                    </div>

                    {/* Stars + date */}
                    <div className="flex items-center gap-3 mb-2">
                      <StarsDisplay stars={review.stars} />
                      <span className="text-xs text-slate-500">{formatDate(review.createdAt)}</span>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-sm text-slate-300 leading-relaxed mb-2">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    )}

                    {/* Order info */}
                    {review.order && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-white/[0.06] text-slate-400 text-[10px] px-1.5 py-0"
                        >
                          #{review.order.orderNumber}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/[0.06] text-slate-400 text-[10px] px-1.5 py-0"
                        >
                          {formatServiceType(review.order.serviceType)}
                        </Badge>
                        {review.order.packageName && (
                          <Badge
                            variant="outline"
                            className="border-white/[0.06] text-slate-400 text-[10px] px-1.5 py-0"
                          >
                            {review.order.packageName}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions (only for pending) */}
                  {!review.isApproved && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                        onClick={() => handleAction(review.id, "approve")}
                        disabled={actionLoading === review.id}
                      >
                        {actionLoading === review.id ? (
                          <div className="size-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => handleAction(review.id, "reject")}
                        disabled={actionLoading === review.id}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
}
