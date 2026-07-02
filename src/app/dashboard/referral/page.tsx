"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check, Users, TrendingUp, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ReferralPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const code = user?.referralCode || "N/A";
  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/register?ref=${code}`
    : "";

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Referral Program</h1>
        <p className="mt-1 text-sm text-slate-400">
          Share your code and earn commission on every referral order
        </p>
      </div>

      {/* Referral Code Card */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
                <Gift className="size-7 text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-100">
                  Your Referral Code
                </p>
                <p className="text-sm text-slate-400">
                  Share this code or link with friends
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-purple-500/30 bg-purple-500/10 px-4 py-2 font-mono text-lg text-purple-300"
              >
                {code}
              </Badge>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                onClick={copyCode}
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Input
              readOnly
              value={referralLink}
              className="h-10 flex-1 border-white/10 bg-white/5 text-sm text-slate-300"
            />
            <Button
              variant="outline"
              className="border-white/10 text-slate-300 hover:bg-white/10"
              onClick={copyLink}
            >
              <Copy className="mr-1.5 size-3.5" />
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base text-slate-200">
            How It Works
          </CardTitle>
          <CardDescription className="text-slate-500">
            2-Level referral system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                level: "Level 1 — Direct",
                percent: "10%",
                desc: "When someone signs up with your code and places an order, you earn 10% commission.",
                icon: Users,
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              },
              {
                level: "Level 2 — Indirect",
                percent: "3%",
                desc: "When your referral refers someone else, you earn 3% on their orders too.",
                icon: TrendingUp,
                color: "text-pink-400",
                bg: "bg-pink-500/10",
              },
            ].map((item) => (
              <div
                key={item.level}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
                  >
                    <item.icon className={`size-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {item.level}
                    </p>
                    <p className={`text-lg font-bold ${item.color}`}>
                      {item.percent} Commission
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earnings Overview (placeholder) */}
      <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-slate-200">
            <Wallet className="size-4 text-slate-400" />
            Earnings Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
              <TrendingUp className="size-7 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">
                No earnings yet
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Start sharing your referral code to earn commissions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}