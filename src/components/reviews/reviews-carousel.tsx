"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  stars: number;
  comment: string | null;
  createdAt: string;
  user: { name: string; avatarUrl: string | null };
  order?: { serviceType: string; packageName: string | null } | null;
}

export function ReviewsCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/reviews?featured=true&limit=10")
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  if (loading || reviews.length === 0) return null;

  return (
    <div className="relative">
      {/* Gradient overlays */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#080E1A] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#080E1A] to-transparent z-10" />

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-4 snap-x snap-mandatory">
        {reviews.map((review) => (
          <div key={review.id} className="snap-start shrink-0 w-[320px]">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.avatarUrl || ""} />
                  <AvatarFallback className="bg-white/10 text-sm">{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-200">{review.user.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`size-3 ${s <= review.stars ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
                    ))}
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">
                  &ldquo;{review.comment}&rdquo;
                </p>
              )}
              {review.order?.packageName && (
                <p className="text-xs text-slate-600 mt-3">{review.order.packageName}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Nav arrows */}
      {reviews.length > 2 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hidden md:flex"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hidden md:flex"
          >
            <ChevronRight className="size-4" />
          </Button>
        </>
      )}
    </div>
  );
}