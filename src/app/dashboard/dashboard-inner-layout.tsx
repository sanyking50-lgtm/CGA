"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthProvider } from "@/hooks/use-auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardInnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="flex min-h-screen bg-[#080E1A]">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6">
              {children}
            </div>
          </main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}