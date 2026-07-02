"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type Announcement = {
  id: string; title: string; content: string; type: string;
  linkUrl: string | null; linkText: string | null; bgColor: string;
  isActive: boolean; startsAt: string; expiresAt: string | null;
  createdAt: string; creator: { id: string; name: string } | null;
};

const typeColors: Record<string, string> = {
  info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  maintenance: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);

  const [fTitle, setFTitle] = useState("");
  const [fContent, setFContent] = useState("");
  const [fType, setFType] = useState("info");
  const [fLinkUrl, setFLinkUrl] = useState("");
  const [fLinkText, setFLinkText] = useState("");
  const [fBgColor, setFBgColor] = useState("#6366F1");
  const [fActive, setFActive] = useState(true);
  const [fStartsAt, setFStartsAt] = useState("");
  const [fExpiresAt, setFExpiresAt] = useState("");

  const loadAnnouncements = async () => {
    try {
      const res = await fetch("/api/admin/announcements");
      setAnnouncements(await res.json());
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAnnouncements(); }, []);

  const openNew = () => {
    setEditItem(null);
    setFTitle(""); setFContent(""); setFType("info"); setFLinkUrl(""); setFLinkText("");
    setFBgColor("#6366F1"); setFActive(true); setFStartsAt(""); setFExpiresAt("");
    setDialogOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditItem(a);
    setFTitle(a.title); setFContent(a.content); setFType(a.type);
    setFLinkUrl(a.linkUrl || ""); setFLinkText(a.linkText || "");
    setFBgColor(a.bgColor); setFActive(a.isActive);
    setFStartsAt(a.startsAt ? new Date(a.startsAt).toISOString().slice(0, 16) : "");
    setFExpiresAt(a.expiresAt ? new Date(a.expiresAt).toISOString().slice(0, 16) : "");
    setDialogOpen(true);
  };

  const save = async () => {
    if (!fTitle) { toast.error("Title required"); return; }
    setSaving(true);
    const body = {
      title: fTitle, content: fContent, type: fType, linkUrl: fLinkUrl || null,
      linkText: fLinkText || null, bgColor: fBgColor, isActive: fActive,
      startsAt: fStartsAt || new Date().toISOString(),
      expiresAt: fExpiresAt || null,
    };
    try {
      if (editItem) {
        await fetch(`/api/admin/announcements/${editItem.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        toast.success("Updated");
      } else {
        await fetch("/api/admin/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        toast.success("Created");
      }
      setDialogOpen(false);
      loadAnnouncements();
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      loadAnnouncements();
    } catch { toast.error("Failed"); }
  };

  const toggleActive = async (a: Announcement) => {
    try {
      await fetch(`/api/admin/announcements/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !a.isActive }) });
      loadAnnouncements();
    } catch { toast.error("Failed"); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Announcements</h1>
        <Button onClick={openNew} className="bg-red-500 hover:bg-red-600 text-white">
          <Plus className="size-4 mr-2" /> New Announcement
        </Button>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06]">
              <TableHead className="text-slate-400">Title</TableHead>
              <TableHead className="text-slate-400">Type</TableHead>
              <TableHead className="text-slate-400">Active</TableHead>
              <TableHead className="text-slate-400">Starts</TableHead>
              <TableHead className="text-slate-400">Expires</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-500">Loading...</TableCell></TableRow>
            ) : announcements.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-500">No announcements.</TableCell></TableRow>
            ) : (
              announcements.map((a) => (
                <TableRow key={a.id} className="border-white/[0.06]">
                  <TableCell className="font-medium text-slate-200">{a.title}</TableCell>
                  <TableCell><Badge variant="outline" className={typeColors[a.type] || ""}>{a.type}</Badge></TableCell>
                  <TableCell>
                    <button onClick={() => toggleActive(a)}>
                      {a.isActive ? <ToggleRight className="size-5 text-emerald-400" /> : <ToggleLeft className="size-5 text-slate-500" />}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{new Date(a.startsAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-xs text-slate-500">{a.expiresAt ? new Date(a.expiresAt).toLocaleDateString() : "Never"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200" onClick={() => openEdit(a)}><Pencil className="size-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => deleteItem(a.id)}><Trash2 className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F1629] border-white/[0.1]">
          <DialogHeader><DialogTitle className="text-slate-100">{editItem ? "Edit Announcement" : "New Announcement"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-slate-300">Title</Label><Input value={fTitle} onChange={(e) => setFTitle(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
            <div><Label className="text-slate-300">Content</Label><Textarea value={fContent} onChange={(e) => setFContent(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" rows={2} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-slate-300">Type</Label><Select value={fType} onValueChange={setFType}><SelectTrigger className="border-white/[0.08] bg-white/[0.03] mt-1"><SelectValue /></SelectTrigger><SelectContent className="bg-[#0F1629] border-white/[0.1]"><SelectItem value="info">Info</SelectItem><SelectItem value="warning">Warning</SelectItem><SelectItem value="success">Success</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem></SelectContent></Select></div>
              <div><Label className="text-slate-300">BG Color</Label><div className="flex items-center gap-2 mt-1"><input type="color" value={fBgColor} onChange={(e) => setFBgColor(e.target.value)} className="h-9 w-12 rounded border border-white/[0.08] bg-transparent cursor-pointer" /><Input value={fBgColor} onChange={(e) => setFBgColor(e.target.value)} className="flex-1 border-white/[0.08] bg-white/[0.03] text-slate-100 font-mono text-sm" /></div></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-slate-300">Link URL</Label><Input value={fLinkUrl} onChange={(e) => setFLinkUrl(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="https://..." /></div>
              <div><Label className="text-slate-300">Link Text</Label><Input value={fLinkText} onChange={(e) => setFLinkText(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="Learn More" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-slate-300">Starts At</Label><Input type="datetime-local" value={fStartsAt} onChange={(e) => setFStartsAt(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
              <div><Label className="text-slate-300">Expires At</Label><Input type="datetime-local" value={fExpiresAt} onChange={(e) => setFExpiresAt(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={fActive} onCheckedChange={setFActive} /><Label className="text-slate-300">Active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-white/[0.08] bg-white/[0.03] text-slate-300" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-red-500 hover:bg-red-600 text-white">{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}