"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function CancelledContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "Unknown";
  const reason = searchParams.get("reason") || "Payment was not completed";

  return (
    <div className="min-h-screen bg-[#080E1A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <Card className="border-red-500/20 bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-6"
            >
              <div className="h-24 w-24 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="size-14 text-red-400" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h1 className="text-2xl font-bold text-slate-100 mb-2">Payment Cancelled</h1>
              <p className="text-slate-400 mb-2">{reason}</p>
              <p className="text-sm text-slate-500 mb-6">
                Don&apos;t worry — your order was not charged. You can try again or choose a different payment method.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 mb-8 text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Order Number</span>
                <span className="font-mono font-bold text-red-400">{orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Status</span>
                <span className="text-sm text-red-400">Cancelled</span>
              </div>
            </motion.div>

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
                <Link href="/checkout">
                  <RotateCcw className="size-4 mr-2" />
                  Try Again
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function CheckoutCancelledPage() {
  return (
    <Suspense>
      <CancelledContent />
    </Suspense>
  );
}