"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
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

type BlogPost = {
  id: string; title: string; slug: string; excerpt: string | null;
  category: string | null; status: string; isPublished: boolean;
  isFeatured: boolean; readTimeMins: number; viewsCount: number;
  createdAt: string; publishedAt: string | null;
  author: { id: string; name: string } | null;
  _count: { comments: number };
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [fTitle, setFTitle] = useState("");
  const [fSlug, setFSlug] = useState("");
  const [fExcerpt, setFExcerpt] = useState("");
  const [fContent, setFContent] = useState("");
  const [fCategory, setFCategory] = useState("");
  const [fTags, setFTags] = useState("");
  const [fStatus, setFStatus] = useState("draft");
  const [fFeatured, setFFeatured] = useState(false);
  const [fReadTime, setFReadTime] = useState("5");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      setPosts(await res.json());
    } catch { toast.error("Failed to load posts"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const openNew = () => {
    setEditPost(null);
    setFTitle(""); setFSlug(""); setFExcerpt(""); setFContent("");
    setFCategory(""); setFTags(""); setFStatus("draft"); setFFeatured(false); setFReadTime("5");
    setDialogOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditPost(p);
    setFTitle(p.title); setFSlug(p.slug); setFExcerpt(p.excerpt || "");
    setFContent(""); setFCategory(p.category || ""); setFTags((p as any).tags?.join(", ") || "");
    setFStatus(p.status); setFFeatured(p.isFeatured); setFReadTime(String(p.readTimeMins));
    setDialogOpen(true);
  };

  const save = async () => {
    if (!fTitle || !fSlug) { toast.error("Title and slug required"); return; }
    setSaving(true);
    const body = {
      title: fTitle, slug: fSlug, excerpt: fExcerpt, content: fContent || "<p>Content placeholder</p>",
      category: fCategory, tags: fTags.split(",").map(t => t.trim()).filter(Boolean),
      status: fStatus, isFeatured: fFeatured, readTimeMins: parseInt(fReadTime) || 5,
    };
    try {
      if (editPost) {
        await fetch(`/api/admin/blog/${editPost.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        toast.success("Post updated");
      } else {
        await fetch("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        toast.success("Post created");
      }
      setDialogOpen(false);
      fetchPosts();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      toast.success("Post deleted");
      fetchPosts();
    } catch { toast.error("Failed to delete"); }
  };

  const togglePublish = async (p: BlogPost) => {
    const newStatus = p.isPublished ? "draft" : "published";
    try {
      await fetch(`/api/admin/blog/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      toast.success(newStatus === "published" ? "Post published" : "Post unpublished");
      fetchPosts();
    } catch { toast.error("Failed"); }
  };

  const statusColors: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Blog Management</h1>
        <Button onClick={openNew} className="bg-red-500 hover:bg-red-600 text-white">
          <Plus className="size-4 mr-2" /> New Post
        </Button>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06]">
              <TableHead className="text-slate-400">Title</TableHead>
              <TableHead className="text-slate-400">Category</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Views</TableHead>
              <TableHead className="text-slate-400">Featured</TableHead>
              <TableHead className="text-slate-400">Date</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-slate-500">Loading...</TableCell></TableRow>
            ) : posts.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-slate-500">No posts yet.</TableCell></TableRow>
            ) : (
              posts.map((p) => (
                <TableRow key={p.id} className="border-white/[0.06]">
                  <TableCell className="font-medium text-slate-200 max-w-[250px] truncate">{p.title}</TableCell>
                  <TableCell className="text-sm text-slate-400">{p.category || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[p.status] || ""}>{p.status}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-400">{p.viewsCount}</TableCell>
                  <TableCell>{p.isFeatured ? <span className="text-amber-400">★</span> : <span className="text-slate-600">☆</span>}</TableCell>
                  <TableCell className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300" onClick={() => togglePublish(p)} title={p.isPublished ? "Unpublish" : "Publish"}>
                        {p.isPublished ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200" onClick={() => openEdit(p)}><Pencil className="size-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => deletePost(p.id)}><Trash2 className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Post Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F1629] border-white/[0.1] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-slate-100">{editPost ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-slate-300">Title</Label><Input value={fTitle} onChange={(e) => { setFTitle(e.target.value); if (!editPost) setFSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 80)); }} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
            <div><Label className="text-slate-300">Slug</Label><Input value={fSlug} onChange={(e) => setFSlug(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1 font-mono text-sm" /></div>
            <div><Label className="text-slate-300">Excerpt</Label><Textarea value={fExcerpt} onChange={(e) => setFExcerpt(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" rows={2} /></div>
            <div><Label className="text-slate-300">Content (HTML)</Label><Textarea value={fContent} onChange={(e) => setFContent(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1 font-mono text-sm" rows={10} placeholder="<h2>Heading</h2><p>Content here...</p>" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-slate-300">Category</Label><Input value={fCategory} onChange={(e) => setFCategory(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="YouTube Editing" /></div>
              <div><Label className="text-slate-300">Tags (comma sep)</Label><Input value={fTags} onChange={(e) => setFTags(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="editing, youtube, tips" /></div>
            </div>
            <div className="flex items-center gap-6">
              <Select value={fStatus} onValueChange={setFStatus}>
                <SelectTrigger className="w-36 border-white/[0.08] bg-white/[0.03]"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0F1629] border-white/[0.1]"><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
              </Select>
              <div className="flex items-center gap-2"><Switch checked={fFeatured} onCheckedChange={setFFeatured} /><Label className="text-slate-300">Featured</Label></div>
              <div><Label className="text-slate-300 text-xs">Read (min)</Label><Input type="number" value={fReadTime} onChange={(e) => setFReadTime(e.target.value)} className="w-16 border-white/[0.08] bg-white/[0.03] text-slate-100" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-white/[0.08] bg-white/[0.03] text-slate-300" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-red-500 hover:bg-red-600 text-white">{saving ? "Saving..." : "Save Post"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}