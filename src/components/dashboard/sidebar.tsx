"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  User,
  Gift,
  MessageSquare,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    label: "Referral",
    href: "/dashboard/referral",
    icon: Gift,
  },
  {
    label: "Support",
    href: "/dashboard/tickets",
    icon: MessageSquare,
  },
];

const levelColors: Record<string, string> = {
  bronze: "bg-amber-700/20 text-amber-400 border-amber-700/30",
  silver: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  gold: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  diamond: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
    router.push("/");
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
            <span className="text-xs font-extrabold text-white">CGA</span>
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-slate-100">
              Create <span className="text-red-400">Growth</span>
            </span>
          )}
        </Link>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* User card */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-white/10">
            <AvatarImage src={user?.avatarUrl || undefined} />
            <AvatarFallback className="bg-red-500/20 text-xs font-semibold text-red-400">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">
                {user?.name}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "border px-1.5 py-0 text-[10px] font-semibold capitalize",
                    levelColors[user?.level || "bronze"]
                  )}
                >
                  {user?.level || "Bronze"}
                </Badge>
                <span className="text-[10px] text-slate-500">
                  {user?.points || 0} pts
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Nav items */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-500/10 text-red-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <item.icon className={cn("size-4 shrink-0", isActive && "text-red-400")} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <Separator className="mb-3 bg-white/[0.06]" />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/[0.08] bg-[#0B1120]/95 backdrop-blur-xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 text-slate-400 hover:text-slate-200"
        >
          <ChevronLeft className="size-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-screen shrink-0 border-r border-white/[0.08] bg-[#0B1120] transition-all duration-300 lg:block",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {sidebarContent}
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#0B1120] text-slate-400 hover:text-white"
        >
          <ChevronLeft
            className={cn(
              "size-3 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </aside>
    </>
  );
}
