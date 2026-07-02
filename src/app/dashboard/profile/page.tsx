"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Will be implemented with API
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success("Profile updated!");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Profile Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your personal information and preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar + Name Card */}
        <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
            <Avatar className="h-20 w-20 border-2 border-white/10">
              <AvatarImage src={user?.avatarUrl || undefined} />
              <AvatarFallback className="bg-red-500/20 text-lg font-bold text-red-400">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-semibold text-slate-100">
                {user?.name}
              </h2>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge
                  variant="outline"
                  className="capitalize text-xs"
                >
                  {user?.level || "Bronze"}
                </Badge>
                <Badge variant="outline" className="text-xs text-slate-400">
                  {user?.currency || "BDT"}
                </Badge>
                {user?.isVerified && (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400"
                  >
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-200">
              Personal Information
            </CardTitle>
            <CardDescription className="text-slate-500">
              Update your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm text-slate-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    defaultValue={user?.name || ""}
                    className="h-10 border-white/10 bg-white/5 pl-10 text-slate-100 focus:border-red-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-300">
                  Email (read-only)
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="h-10 border-white/10 bg-white/5 pl-10 text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-300">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    defaultValue={user?.phone || ""}
                    placeholder="+880 1XXX-XXXXXX"
                    className="h-10 border-white/10 bg-white/5 pl-10 text-slate-100 focus:border-red-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-300">
                  YouTube Channel
                </Label>
                <Input
                  defaultValue={""}
                  placeholder="https://youtube.com/@yourchannel"
                  className="h-10 border-white/10 bg-white/5 text-slate-100 focus:border-red-500/50"
                />
              </div>
            </div>

            <Separator className="bg-white/[0.06]" />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:from-red-600 hover:to-red-700"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  );
}