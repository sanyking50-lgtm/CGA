"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  TrendingUp,
  Award,
  Gift,
  ArrowRight,
  Star,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const levelConfig: Record<
  string,
  { color: string; bg: string; border: string; minOrders: number; label: string; discount: string }
> = {
  bronze: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    minOrders: 0,
    label: "Bronze",
    discount: "0%",
  },
  silver: {
    color: "text-slate-300",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    minOrders: 3,
    label: "Silver",
    discount: "3%",
  },
  gold: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    minOrders: 10,
    label: "Gold",
    discount: "7%",
  },
  diamond: {
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    minOrders: 25,
    label: "Diamond",
    discount: "12%",
  },
};

const levelOrder = ["bronze", "silver", "gold", "diamond"];

function getNextLevel(current: string) {
  const idx = levelOrder.indexOf(current);
  return idx < levelOrder.length - 1 ? levelOrder[idx + 1] : null;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function DashboardPage() {
  const { user } = useAuth();

  const currentLevel = levelConfig[user?.level || "bronze"];
  const nextLevelName = getNextLevel(user?.level || "bronze");
  const nextLevel = nextLevelName ? levelConfig[nextLevelName] : null;

  // Progress to next level
  const currentMin = currentLevel.minOrders;
  const nextMin = nextLevel ? nextLevel.minOrders : currentLevel.minOrders;
  const orderCount = user?.ordersCount || 0;
  const progress = nextLevel
    ? Math.min(
        100,
        Math.round(
          ((orderCount - currentMin) / (nextMin - currentMin)) * 100
        )
      )
    : 100;

  const quickActions = [
    {
      label: "New Order",
      href: "/pricing",
      icon: ShoppingCart,
      desc: "Place a new order",
      gradient: "from-red-500 to-red-600",
      shadow: "shadow-red-500/20",
    },
    {
      label: "Free Thumbnail",
      href: "/free-thumbnail",
      icon: Gift,
      desc: "Try a free sample",
      gradient: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-500/20",
    },
    {
      label: "View Plans",
      href: "/pricing",
      icon: Zap,
      desc: "Subscribe & save",
      gradient: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/20",
    },
    {
      label: "Refer & Earn",
      href: "/dashboard/referral",
      icon: Award,
      desc: "Share & get 10%",
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
    },
  ];

  const recentOrders = [
    // Placeholder — will be replaced with real data from API
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
          Welcome back, <span className="text-red-400">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Here&apos;s what&apos;s happening with your account
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {[
          {
            label: "Total Orders",
            value: orderCount,
            icon: ShoppingCart,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
          {
            label: "Points",
            value: user?.points || 0,
            icon: Star,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
          },
          {
            label: "Current Level",
            value: currentLevel.label,
            icon: Award,
            color: currentLevel.color,
            bg: currentLevel.bg,
            isText: true,
          },
          {
            label: "Streak",
            value: user?.streakCount || 0,
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    stat.bg
                  )}
                >
                  <stat.icon className={cn("size-4", stat.color)} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-100">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Level Progress + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Level Card */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="h-full border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-slate-200">
                <Award className={cn("size-4", currentLevel.color)} />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl border",
                    currentLevel.bg,
                    currentLevel.border
                  )}
                >
                  <span className={cn("text-lg font-bold", currentLevel.color)}>
                    {user?.level === "diamond"
                      ? "💎"
                      : user?.level === "gold"
                        ? "🥇"
                        : user?.level === "silver"
                          ? "🥈"
                          : "🥉"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">
                    {currentLevel.label} Member
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentLevel.discount} discount on all orders
                  </p>
                </div>
              </div>

              {nextLevel && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {orderCount}/{nextLevel.minOrders} orders to{" "}
                        {nextLevel.label}
                      </span>
                      <span className="text-slate-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-white/5" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Unlock <span className={nextLevel.color}>{nextLevel.discount}</span>{" "}
                    discount at {nextLevel.label} level
                  </p>
                </>
              )}

              {!nextLevel && (
                <p className="text-xs text-cyan-400">
                  You&apos;ve reached the highest level! Enjoy maximum perks.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="lg:col-span-3">
          <Card className="h-full border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-200">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href}>
                    <div className="group flex flex-col items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center transition-all hover:border-white/10 hover:bg-white/[0.05]">
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                          action.gradient,
                          action.shadow
                        )}
                      >
                        <action.icon className="size-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-white">
                          {action.label}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {action.desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders (placeholder) */}
      <motion.div variants={fadeUp}>
        <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-200">
              <Clock className="size-4 text-slate-400" />
              Recent Orders
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-white"
              asChild
            >
              <Link href="/dashboard/orders">
                View all <ArrowRight className="ml-1 size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <ShoppingCart className="size-7 text-slate-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-400">
                    No orders yet
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Place your first order and start growing!
                  </p>
                </div>
                <Button
                  size="sm"
                  className="mt-1 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20"
                  asChild
                >
                  <Link href="/pricing">
                    Place First Order
                    <ArrowRight className="ml-1.5 size-3" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Order rows will go here */}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Referral Quick Info */}
      {user?.referralCode && (
        <motion.div variants={fadeUp}>
          <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center gap-3 p-5 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                  <Gift className="size-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Your Referral Code
                  </p>
                  <p className="text-xs text-slate-500">
                    Share & earn 10% commission on every referral order
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-purple-500/30 bg-purple-500/10 px-3 py-1 font-mono text-sm text-purple-300"
                >
                  {user.referralCode}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  onClick={() => {
                    navigator.clipboard.writeText(user.referralCode!);
                    // Using toast inline
                  }}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}