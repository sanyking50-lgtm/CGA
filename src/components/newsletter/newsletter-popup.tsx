"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { X, Mail, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const STORAGE_KEY = "cga_newsletter_popup";
const SHOW_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

export function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* Determine if we should show the popup */
  const shouldShow = useCallback(() => {
    if (pathname !== "/") return false;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return true;

      const data = JSON.parse(stored) as { subscribed?: boolean; lastShown?: number };

      // If user previously subscribed, never show again
      if (data.subscribed) return false;

      // If shown within the last week, don't show again
      if (data.lastShown && Date.now() - data.lastShown < SHOW_INTERVAL_MS) {
        return false;
      }

      return true;
    } catch {
      return true;
    }
  }, [pathname]);

  /* Timer to show popup after 10 seconds */
  useEffect(() => {
    if (!shouldShow()) return;

    const timer = setTimeout(() => {
      setOpen(true);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lastShown: Date.now() })
      );
    }, 10_000);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  /* Subscribe handler */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source: "popup" }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError("This email is already subscribed");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ subscribed: true, lastShown: Date.now() })
      );

      // Auto-close after 2 seconds
      setTimeout(() => setOpen(false), 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-white/[0.08] bg-[#0F1629]/98 backdrop-blur-xl p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Newsletter Subscription</DialogTitle>
        </VisuallyHidden>

        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-300"
        >
          <X className="size-4" />
        </button>

        <div className="p-6 pt-5">
          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">
                You&apos;re in!
              </h3>
              <p className="text-center text-sm text-slate-400">
                Check your inbox for a welcome email with exclusive YouTube
                growth tips.
              </p>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20">
                <Mail className="size-6 text-red-400" />
              </div>

              {/* Heading */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-100">
                  Get YouTube Growth Tips
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Subscribe to our weekly newsletter for exclusive tips,
                  strategies, and offers to grow your YouTube channel faster.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={loading}
                    autoFocus
                    className="h-11 pl-10 border-white/[0.08] bg-white/[0.03] text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
                    required
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/40 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Subscribing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="size-4" />
                      Subscribe Free
                    </span>
                  )}
                </Button>

                {/* No thanks */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center text-xs text-slate-600 transition-colors hover:text-slate-400"
                >
                  No thanks, maybe later
                </button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}