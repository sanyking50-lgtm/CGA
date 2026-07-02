"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  Gift,
  Play,
  Film,
  Image,
  PenTool,
  BarChart3,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const services = [
  { label: "YouTube Editing", href: "/services/youtube-editing", icon: Play },
  { label: "Shorts Editing", href: "/services/shorts-editing", icon: Film },
  { label: "Thumbnail Design", href: "/services/thumbnail-design", icon: Image },
  { label: "Script Writing", href: "/services/script-writing", icon: PenTool },
  { label: "Channel Management", href: "/services/channel-management", icon: BarChart3 },
  { label: "Motion Graphics", href: "/services/motion-graphics", icon: Sparkles },
];

const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Reviews", href: "/reviews" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

const countries = [
  { value: "bd", label: "🇧🇩 Bangladesh" },
  { value: "us", label: "🇺🇸 United States" },
  { value: "uk", label: "🇬🇧 United Kingdom" },
  { value: "in", label: "🇮🇳 India" },
  { value: "other", label: "🌍 Other" },
];

/* ------------------------------------------------------------------ */
/*  NavLogo                                                            */
/* ------------------------------------------------------------------ */

function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* CGA badge */}
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20 transition-shadow group-hover:shadow-red-500/40">
        <span className="text-sm font-extrabold tracking-tight text-white">
          CGA
        </span>
      </div>
      {/* Wordmark */}
      <span className="hidden text-lg font-bold tracking-tight text-slate-100 sm:block">
        Create{" "}
        <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          Growth
        </span>
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  ThemeToggle                                                        */
/* ------------------------------------------------------------------ */

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
    if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Sun className="size-3.5 text-slate-400" />
        <div className="h-[1.15rem] w-8 rounded-full bg-slate-700" aria-hidden />
        <Moon className="size-3.5 text-slate-400" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Sun className={cn("size-3.5", isDark ? "text-slate-400" : "text-amber-400")} />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-slate-700"
      />
      <Moon className={cn("size-3.5", isDark ? "text-blue-400" : "text-slate-400")} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DesktopNav                                                         */
/* ------------------------------------------------------------------ */

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {/* Services dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-slate-100">
            Services
            <ChevronDown className="size-3.5 text-slate-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-56 border-white/10 bg-[#0F1629]/95 p-1.5 backdrop-blur-xl"
        >
          <AnimatePresence>
            {services.map((service, i) => (
              <motion.div
                key={service.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href={service.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 text-red-400">
                      <service.icon className="size-4" />
                    </div>
                    {service.label}
                  </Link>
                </DropdownMenuItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Static nav links */}
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-slate-100"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  DesktopRight                                                       */
/* ------------------------------------------------------------------ */

function DesktopRight() {
  const [country, setCountry] = useState("bd");

  return (
    <div className="hidden items-center gap-3 lg:flex">
      {/* Country selector */}
      <Select value={country} onValueChange={setCountry}>
        <SelectTrigger
          size="sm"
          className="h-8 gap-1.5 border-white/10 bg-white/5 text-xs text-slate-300 hover:bg-white/10 focus:ring-red-500/30"
        >
          <Globe className="size-3.5" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#0F1629]/95 backdrop-blur-xl">
          {countries.map((c) => (
            <SelectItem
              key={c.value}
              value={c.value}
              className="text-slate-300 focus:bg-white/5 focus:text-white"
            >
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Theme toggle */}
      <ThemeToggle />

      <Separator orientation="vertical" className="mx-1 h-5 bg-white/10" />

      {/* Login */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
        asChild
      >
        <Link href="/login">Login</Link>
      </Button>

      {/* CTA */}
      <Button
        size="sm"
        className="h-8 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:from-red-600 hover:to-red-700 hover:shadow-red-500/40"
        asChild
      >
        <Link href="/free-thumbnail">
          <Gift className="size-3.5" />
          <span className="font-bengali">ফ্রি Thumbnail নিন</span>
        </Link>
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MobileSheet                                                        */
/* ------------------------------------------------------------------ */

function MobileSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [country, setCountry] = useState("bd");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[300px] border-white/10 bg-[#080E1A]/98 p-0 backdrop-blur-xl sm:w-[360px]"
      >
        <SheetHeader className="border-b border-white/10 px-5 py-4">
          <SheetTitle className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
              <span className="text-xs font-extrabold text-white">CGA</span>
            </div>
            <span className="text-base font-bold text-slate-100">
              Create{" "}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Growth
              </span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col overflow-y-auto px-5 py-4">
          {/* Nav links */}
          <div className="flex flex-col gap-1">
            {/* Services section */}
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Services
            </p>
            {services.map((service) => (
              <SheetClose key={service.href} asChild>
                <Link
                  href={service.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/10 text-red-400">
                    <service.icon className="size-3.5" />
                  </div>
                  {service.label}
                </Link>
              </SheetClose>
            ))}

            <Separator className="my-3 bg-white/10" />

            {/* Pages */}
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Pages
            </p>
            {navLinks.map((link) => (
              <SheetClose key={link.href} asChild>
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </div>

          <Separator className="my-4 bg-white/10" />

          {/* Country selector */}
          <div className="px-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Region
            </p>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full border-white/10 bg-white/5 text-slate-300 hover:bg-white/10">
                <Globe className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0F1629]/95 backdrop-blur-xl">
                {countries.map((c) => (
                  <SelectItem
                    key={c.value}
                    value={c.value}
                    className="text-slate-300 focus:bg-white/5 focus:text-white"
                  >
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4 bg-white/10" />

          {/* Theme toggle */}
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Sun className="size-4 text-slate-400" />
              <span>Dark Mode</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="mt-6 flex flex-col gap-2 px-3">
            <SheetClose asChild>
              <Button
                variant="outline"
                className="h-10 w-full border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
            </SheetClose>

            <SheetClose asChild>
              <Button
                className="h-10 w-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-red-700"
                asChild
              >
                <Link href="/free-thumbnail">
                  <Gift className="size-4" />
                  <span className="font-bengali">ফ্রি Thumbnail নিন</span>
                </Link>
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar (exported)                                                  */
/* ------------------------------------------------------------------ */

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full border-b border-white/[0.08] bg-[#080E1A]/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left */}
          <div className="flex items-center gap-2">
            <NavLogo />
            <DesktopNav />
          </div>

          {/* Right */}
          <DesktopRight />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </motion.header>

      {/* Mobile sheet */}
      <MobileSheet open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
}