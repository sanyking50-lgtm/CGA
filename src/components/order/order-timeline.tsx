"use client";

import { Check, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_FLOW = [
  { key: "pending_payment", label: "Payment Pending", icon: Clock },
  { key: "paid_pending_assign", label: "Awaiting Assignment", icon: Clock },
  { key: "assigned", label: "Assigned to Team", icon: Check },
  { key: "in_progress", label: "Work in Progress", icon: Circle },
  { key: "in_review", label: "Under Review", icon: Circle },
  { key: "delivered", label: "Delivered", icon: Check },
];

export function OrderTimeline({ status }: { status: string }) {
  // Find current step index
  const currentIndex = STATUS_FLOW.findIndex((s) => s.key === status);
  const isCancelled = status === "cancelled";
  const isRevision = status === "revision";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
          <XCircle className="size-4 text-red-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-red-300">Order Cancelled</p>
          <p className="text-xs text-slate-500">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {STATUS_FLOW.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isFuture = idx > currentIndex;

        return (
          <div key={step.key} className="flex gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-emerald-500/50 bg-emerald-500/10",
                  isCurrent && !isRevision && "border-red-500/50 bg-red-500/10",
                  isCurrent && isRevision && "border-orange-500/50 bg-orange-500/10",
                  isFuture && "border-white/10 bg-white/[0.02]"
                )}
              >
                {isCompleted ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <step.icon className={cn("size-3.5", isRevision ? "text-orange-400 animate-pulse" : "text-red-400")} />
                ) : (
                  <Circle className="size-2 text-slate-600" />
                )}
              </div>
              {idx < STATUS_FLOW.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8 my-1",
                    isCompleted ? "bg-emerald-500/30" : "bg-white/[0.06]"
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-6">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCompleted && "text-emerald-400",
                  isCurrent && (isRevision ? "text-orange-400" : "text-red-400"),
                  isFuture && "text-slate-600"
                )}
              >
                {isCurrent && isRevision ? "Revision Requested" : step.label}
              </p>
              {isCurrent && isRevision && (
                <p className="text-xs text-slate-500 mt-0.5">The team is working on your revision</p>
              )}
              {isCompleted && (
                <p className="text-xs text-slate-500 mt-0.5">Completed</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}