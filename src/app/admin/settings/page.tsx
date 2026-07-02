"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Mail, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  // Site settings
  const [siteName, setSiteName] = useState("Create Growth Agency");
  const [tagline, setTagline] = useState("YouTube Growth Partner");
  const [contactEmail, setContactEmail] = useState("");

  // Social
  const [youtube, setYoutube] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");

  // Email
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpFrom, setSmtpFrom] = useState("");

  const saveAll = () => {
    toast.success("Settings saved (stored in memory — connect to DB in production)");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <Button onClick={saveAll} className="bg-red-500 hover:bg-red-600 text-white">
          <Save className="size-4 mr-2" /> Save All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Site Settings */}
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-200"><Globe className="size-4 text-red-400" /> Site Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><Label className="text-slate-300">Site Name</Label><Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
              <div><Label className="text-slate-300">Tagline</Label><Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
              <div><Label className="text-slate-300">Contact Email</Label><Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="superadmin.vishprotadev@gmail.com" /></div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-200"><Palette className="size-4 text-red-400" /> Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><Label className="text-slate-300">YouTube</Label><Input value={youtube} onChange={(e) => setYoutube(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="https://youtube.com/@..." /></div>
              <div><Label className="text-slate-300">Facebook</Label><Input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="https://facebook.com/..." /></div>
              <div><Label className="text-slate-300">Twitter / X</Label><Input value={twitter} onChange={(e) => setTwitter(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="https://x.com/..." /></div>
              <div><Label className="text-slate-300">Instagram</Label><Input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="https://instagram.com/..." /></div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-200"><Mail className="size-4 text-red-400" /> Email (SMTP)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><Label className="text-slate-300">SMTP Host</Label><Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="smtp.gmail.com" /></div>
              <div><Label className="text-slate-300">Port</Label><Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
              <div><Label className="text-slate-300">SMTP User</Label><Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="user@gmail.com" /></div>
              <div><Label className="text-slate-300">From Email</Label><Input value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="noreply@cga.com" /></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}