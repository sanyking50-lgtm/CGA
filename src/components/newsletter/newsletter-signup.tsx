"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewsletterSignupProps {
  variant?: "inline" | "card" | "footer";
  source?: string;
  title?: string;
  description?: string;
}

export function NewsletterSignup({
  variant = "card",
  source = "website",
  title,
  description,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
        body: JSON.stringify({ email: trimmed, name: name.trim() || undefined, source }),
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
      setEmail("");
      setName("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Success state ---------- */
  if (success) {
    return (
      <div className="flex items-center gap-2 text-emerald-400">
        <CheckCircle2 className="size-5 shrink-0 animate-[scaleIn_0.3s_ease-out]" />
        <span className="text-sm font-medium">Subscribed!</span>
      </div>
    );
  }

  /* ---------- Footer variant ---------- */
  if (variant === "footer") {
    return (
      <div className="space-y-2.5">
        {title && (
          <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
        )}
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            disabled={loading}
            className="h-9 flex-1 border-white/[0.08] bg-white/[0.03] text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-9 bg-red-500 px-4 text-xs font-medium text-white hover:bg-red-600 shrink-0"
          >
            {loading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              "Join"
            )}
          </Button>
        </form>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  /* ---------- Inline variant ---------- */
  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
            className="h-10 pl-9 border-white/[0.08] bg-white/[0.03] text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-10 bg-red-500 px-5 text-sm font-medium text-white hover:bg-red-600 shrink-0"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </form>
    );
  }

  /* ---------- Card variant ---------- */
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
      {title && (
        <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      )}
      {description && (
        <p className="mt-1.5 text-sm text-slate-400">{description}</p>
      )}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          disabled={loading}
          className="h-10 border-white/[0.08] bg-white/[0.03] text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
        />
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            disabled={loading}
            className="h-10 flex-1 border-white/[0.08] bg-white/[0.03] text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500/50"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-10 bg-red-500 px-6 text-sm font-medium text-white shadow-lg shadow-red-500/25 hover:bg-red-600 hover:shadow-red-500/40 transition-all shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Subscribing...
              </span>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </form>
    </div>
  );
}