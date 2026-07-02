"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthProvider } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminInnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard requiredRole="admin">
        <div className="flex min-h-screen bg-[#080E1A]">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6">
              {children}
            </div>
          </main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}