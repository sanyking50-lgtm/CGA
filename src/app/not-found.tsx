"use client";

import Link from "next/link";
import { Home, ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        {/* Decorative 404 number */}
        <p className="text-8xl font-extrabold bg-gradient-to-b from-red-500 to-red-600/60 bg-clip-text text-transparent select-none">
          404
        </p>

        <h1 className="mt-6 text-2xl font-bold text-slate-100 sm:text-3xl">
          Page Not Found
        </h1>

        <p className="mt-3 max-w-md mx-auto text-sm text-slate-400 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:from-red-400 hover:to-red-500"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Homepage
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/[0.15] hover:bg-white/[0.06]"
          >
            <Link href="/#services">
              <Layers className="mr-2 h-4 w-4" />
              View Services
            </Link>
          </Button>
        </div>

        {/* Subtle back link */}
        <button
          onClick={() => history.back()}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Go back
        </button>
      </div>
    </div>
  );
}