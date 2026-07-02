"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { NotificationBell } from "@/components/notifications/notification-bell";

const EXCLUDED_PREFIXES = ["/login", "/register", "/dashboard", "/admin"];

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded = EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, [pathname]);

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        <AnnouncementBanner />
        {/* Navbar wrapper: the Navbar takes full width and centers content.
            We position the bell overlay at the same x-offset as the
            max-w-7xl container's right padding so it sits next to
            the desktop action buttons. */}
        <div className="relative">
          <Navbar />
          {isLoggedIn && (
            <div className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block">
              <div className="mx-auto flex h-16 max-w-7xl items-center justify-end px-6 xl:px-8">
                <div className="pointer-events-auto -mr-1">
                  <NotificationBell />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}