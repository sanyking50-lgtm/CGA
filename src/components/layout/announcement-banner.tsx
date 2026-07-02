"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, AlertTriangle, CheckCircle, Wrench } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────── */

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  linkUrl: string | null;
  linkText: string | null;
  bgColor: string;
  countryCode: string | null;
  startsAt: string;
  expiresAt: string | null;
}

/* ── Gradient configs per type ──────────────────────────────────── */

const TYPE_STYLES: Record<
  string,
  { gradient: string; icon: React.ReactNode }
> = {
  info: {
    gradient: "from-indigo-600 via-purple-500 to-fuchsia-500",
    icon: <Info className="size-4 shrink-0" />,
  },
  warning: {
    gradient: "from-amber-600 via-orange-500 to-yellow-500",
    icon: <AlertTriangle className="size-4 shrink-0" />,
  },
  success: {
    gradient: "from-emerald-600 via-teal-500 to-green-500",
    icon: <CheckCircle className="size-4 shrink-0" />,
  },
  maintenance: {
    gradient: "from-red-600 via-rose-500 to-pink-500",
    icon: <Wrench className="size-4 shrink-0" />,
  },
};

/* ── Component ──────────────────────────────────────────────────── */

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        const res = await fetch("/api/announcements");
        if (res.ok) {
          const data: Announcement[] = await res.json();
          if (data.length > 0) {
            setAnnouncement(data[0]);
            setIsVisible(true);
          }
        }
      } catch {
        // Silently fail — banner won't show
      } finally {
        setIsLoaded(true);
      }
    }

    fetchAnnouncement();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't render anything until we've attempted to fetch
  if (!isLoaded) return null;

  // No active announcements
  if (!announcement) return null;

  const style = TYPE_STYLES[announcement.type] || TYPE_STYLES.info;
  const isDismissed = !isVisible;

  const bannerContent = (
    <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6">
      <div className="flex items-center gap-2 text-xs font-medium text-white sm:text-sm">
        {style.icon}
        <span>
          <span className="font-semibold">{announcement.title}</span>
          {announcement.content && (
            <span className="opacity-90"> — {announcement.content}</span>
          )}
        </span>
        {announcement.linkUrl && (
          <a
            href={announcement.linkUrl}
            className="ml-1 rounded bg-white/20 px-1.5 py-0.5 font-bold tracking-wide transition-colors hover:bg-white/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            {announcement.linkText || "Learn More"}
          </a>
        )}
      </div>

      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-4"
        aria-label="Close announcement"
      >
        <X className="size-3.5 sm:size-4" />
      </button>
    </div>
  );

  // If the banner has a linkUrl wrapping the entire banner, render it differently
  const inner = announcement.linkUrl ? (
    <a
      href={announcement.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {bannerContent}
    </a>
  ) : (
    bannerContent
  );

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ y: -56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -56, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full overflow-hidden"
        >
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${style.gradient}`}
          />

          {/* Animated shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {inner}
        </motion.div>
      )}
    </AnimatePresence>
  );
}