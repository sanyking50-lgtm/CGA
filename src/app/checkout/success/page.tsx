"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "Unknown";

  return (
    <div className="min-h-screen bg-[#080E1A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <Card className="border-emerald-500/20 bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Success animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-6"
            >
              <div className="relative">
                <div className="h-24 w-24 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="size-14 text-emerald-400" />
                </div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute inset-0 h-24 w-24 mx-auto rounded-full border-2 border-emerald-400/30"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-2xl font-bold text-slate-100 mb-2">Payment Successful!</h1>
              <p className="text-slate-400 mb-6">
                Your order has been placed and is being processed. We&apos;ll start working on it right away.
              </p>
            </motion.div>

            {/* Order Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 mb-8 text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">Order Number</span>
                <span className="font-mono font-bold text-emerald-400">{orderNumber}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">Status</span>
                <span className="text-sm text-blue-400">Awaiting Assignment</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Payment</span>
                <span className="text-sm text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  Paid (Mock)
                </span>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                asChild
                className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all"
              >
                <Link href="/dashboard/orders">
                  <Package className="size-4 mr-2" />
                  View My Orders
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 h-12 border-white/10 text-slate-300 hover:bg-white/5"
              >
                <Link href="/">
                  <Home className="size-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </motion.div>

            <p className="text-xs text-slate-600 mt-6">
              This was a mock payment — no real money was charged.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}