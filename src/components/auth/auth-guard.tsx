"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const shouldRedirect = useMemo(() => {
    if (isLoading) return null; // don't know yet
    if (!isAuthenticated) return "/login";
    if (requiredRole && user?.role !== requiredRole) return "/dashboard";
    return null; // all good
  }, [isLoading, isAuthenticated, user, requiredRole]);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  if (isLoading || shouldRedirect !== null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}