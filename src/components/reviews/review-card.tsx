"use client";

import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface ReviewCardProps {
  name: string;
  avatarUrl?: string | null;
  stars: number;
  comment: string | null;
  serviceType?: string;
  packageName?: string | null;
  createdAt: string;
  compact?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-BD", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatServiceType(type: string) {
  return type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ReviewCard({ name, avatarUrl, stars, comment, serviceType, packageName, createdAt, compact }: ReviewCardProps) {
  if (compact) {
    return (
      <div className="flex gap-3 py-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={avatarUrl || ""} />
          <AvatarFallback className="bg-white/10 text-xs">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">{name}</span>
            <span className="text-xs text-slate-600">{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-0.5 my-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`size-3 ${s <= stars ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
            ))}
          </div>
          {comment && <p className="text-xs text-slate-400 line-clamp-2">{comment}</p>}
        </div>
      </div>
    );
  }

  return (
    <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback className="bg-white/10 text-sm">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-slate-200">{name}</span>
              {(serviceType || packageName) && (
                <span className="text-xs text-slate-500">
                  {packageName || formatServiceType(serviceType || "")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`size-3.5 ${s <= stars ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
                ))}
              </div>
              <span className="text-xs text-slate-600">{formatDate(createdAt)}</span>
            </div>
            {comment && (
              <div className="relative">
                <Quote className="size-4 text-red-500/20 absolute -left-1 -top-1" />
                <p className="text-sm text-slate-300 pl-4 leading-relaxed">{comment}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}