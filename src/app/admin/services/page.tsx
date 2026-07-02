"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, ToggleLeft, ToggleRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type SvcPkg = {
  id: string; name: string; price: number; deliveryHrs: number;
  revisions: number; features: string[]; isPopular: boolean; sortOrder: number;
};

type Service = {
  id: string; name: string; slug: string; shortDesc: string | null;
  isActive: boolean; sortOrder: number;
  packages: SvcPkg[];
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editService, setEditService] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [editPkg, setEditPkg] = useState<{ serviceId: string; pkg: SvcPkg | null; isNew: boolean } | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formSort, setFormSort] = useState(0);

  // Package form state
  const [pkgName, setPkgName] = useState("");
  const [pkgPrice, setPkgPrice] = useState("");
  const [pkgDelivery, setPkgDelivery] = useState("24");
  const [pkgRevisions, setPkgRevisions] = useState("1");
  const [pkgFeatures, setPkgFeatures] = useState("");
  const [pkgPopular, setPkgPopular] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      setServices(await res.json());
    } catch { toast.error("Failed to load services"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const openNew = () => {
    setIsNew(true);
    setFormName(""); setFormSlug(""); setFormDesc(""); setFormActive(true); setFormSort(0);
    setEditService(null);
  };

  const openEdit = (s: Service) => {
    setIsNew(false);
    setEditService(s);
    setFormName(s.name); setFormSlug(s.slug); setFormDesc(s.shortDesc || "");
    setFormActive(s.isActive); setFormSort(s.sortOrder);
  };

  const saveService = async () => {
    const body = { name: formName, slug: formSlug, shortDesc: formDesc, isActive: formActive, sortOrder: formSort };
    try {
      if (isNew) {
        await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        toast.success("Service created");
      } else if (editService) {
        await fetch(`/api/admin/services/${editService.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        toast.success("Service updated");
      }
      fetchServices();
    } catch { toast.error("Failed to save service"); }
  };

  const toggleActive = async (s: Service) => {
    try {
      await fetch(`/api/admin/services/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !s.isActive }) });
      toast.success(s.isActive ? "Service deactivated" : "Service activated");
      fetchServices();
    } catch { toast.error("Failed"); }
  };

  const openPkgEdit = (serviceId: string, pkg: SvcPkg | null) => {
    setEditPkg({ serviceId, pkg, isNew: !pkg });
    if (pkg) {
      setPkgName(pkg.name); setPkgPrice(String(pkg.price)); setPkgDelivery(String(pkg.deliveryHrs));
      setPkgRevisions(String(pkg.revisions)); setPkgFeatures(pkg.features.join(", ")); setPkgPopular(pkg.isPopular);
    } else {
      setPkgName(""); setPkgPrice(""); setPkgDelivery("24"); setPkgRevisions("1"); setPkgFeatures(""); setPkgPopular(false);
    }
  };

  const savePkg = async () => {
    if (!editPkg) return;
    const action = editPkg.isNew ? "createPackage" : "updatePackage";
    const body = {
      action,
      packageData: {
        id: editPkg.pkg?.id,
        name: pkgName, price: pkgPrice, deliveryHrs: pkgDelivery, revisions: pkgRevisions,
        features: pkgFeatures.split(",").map(f => f.trim()).filter(Boolean), isPopular: pkgPopular,
      },
    };
    try {
      await fetch(`/api/admin/services/${editPkg.serviceId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      toast.success(editPkg.isNew ? "Package added" : "Package updated");
      setEditPkg(null);
      fetchServices();
    } catch { toast.error("Failed"); }
  };

  const deletePkg = async () => {
    if (!editPkg?.pkg?.id) return;
    try {
      await fetch(`/api/admin/services/${editPkg.serviceId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deletePackage", packageData: { id: editPkg.pkg.id } }),
      });
      toast.success("Package deleted");
      setEditPkg(null);
      fetchServices();
    } catch { toast.error("Failed"); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Service Management</h1>
        <Button onClick={openNew} className="bg-red-500 hover:bg-red-600 text-white">
          <Plus className="size-4 mr-2" /> Add Service
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} className={`border ${s.isActive ? "border-white/[0.08]" : "border-red-500/20"} bg-white/[0.03]`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-200">{s.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">/{s.slug}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200" onClick={() => openEdit(s)}><Pencil className="size-3.5" /></Button>
                    <button onClick={() => toggleActive(s)} className="text-slate-400 hover:text-red-400">
                      {s.isActive ? <ToggleRight className="size-5 text-emerald-400" /> : <ToggleLeft className="size-5" />}
                    </button>
                  </div>
                </div>
                {s.shortDesc && <p className="mt-2 text-sm text-slate-400 line-clamp-2">{s.shortDesc}</p>}

                {/* Packages */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 uppercase">Packages ({s.packages.length})</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-red-400 hover:text-red-300" onClick={() => openPkgEdit(s.id, null)}>
                      <Plus className="size-3 mr-1" /> Add
                    </Button>
                  </div>
                  {s.packages.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2" onClick={() => openPkgEdit(s.id, p)}>
                      <div className="cursor-pointer">
                        <span className="text-sm text-slate-300">{p.name}</span>
                        <span className="ml-2 text-xs text-slate-500">৳{p.price} · {p.deliveryHrs}h</span>
                        {p.isPopular && <Badge className="ml-2 bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">Popular</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Service Edit Dialog */}
      <Dialog open={isNew || !!editService} onOpenChange={() => { setEditService(null); setIsNew(false); }}>
        <DialogContent className="bg-[#0F1629] border-white/[0.1]">
          <DialogHeader><DialogTitle className="text-slate-100">{isNew ? "Add Service" : "Edit Service"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-slate-300">Name</Label><Input value={formName} onChange={(e) => { setFormName(e.target.value); if (isNew) setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
            <div><Label className="text-slate-300">Slug</Label><Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
            <div><Label className="text-slate-300">Description</Label><Textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" rows={3} /></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch checked={formActive} onCheckedChange={setFormActive} /><Label className="text-slate-300">Active</Label></div>
              <div><Label className="text-slate-300">Sort Order</Label><Input type="number" value={formSort} onChange={(e) => setFormSort(parseInt(e.target.value) || 0)} className="w-20 border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-white/[0.08] bg-white/[0.03] text-slate-300" onClick={() => { setEditService(null); setIsNew(false); }}>Cancel</Button>
            <Button onClick={saveService} className="bg-red-500 hover:bg-red-600 text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Package Edit Dialog */}
      <Dialog open={!!editPkg} onOpenChange={() => setEditPkg(null)}>
        <DialogContent className="bg-[#0F1629] border-white/[0.1]">
          <DialogHeader><DialogTitle className="text-slate-100">{editPkg?.isNew ? "Add Package" : "Edit Package"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-slate-300">Name</Label><Input value={pkgName} onChange={(e) => setPkgName(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" placeholder="e.g. Basic, Standard, Premium" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-slate-300">Price (BDT)</Label><Input type="number" value={pkgPrice} onChange={(e) => setPkgPrice(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
              <div><Label className="text-slate-300">Delivery (hrs)</Label><Input type="number" value={pkgDelivery} onChange={(e) => setPkgDelivery(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
              <div><Label className="text-slate-300">Revisions</Label><Input type="number" value={pkgRevisions} onChange={(e) => setPkgRevisions(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" /></div>
              <div className="flex items-end gap-2 pb-1"><Switch checked={pkgPopular} onCheckedChange={setPkgPopular} /><Label className="text-slate-300">Popular</Label></div>
            </div>
            <div><Label className="text-slate-300">Features (comma separated)</Label><Textarea value={pkgFeatures} onChange={(e) => setPkgFeatures(e.target.value)} className="border-white/[0.08] bg-white/[0.03] text-slate-100 mt-1" rows={3} placeholder="Cut+Trim, Noise Remove, Color Grade" /></div>
          </div>
          <DialogFooter>
            {!editPkg?.isNew && <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 mr-auto" onClick={deletePkg}>Delete</Button>}
            <Button variant="outline" className="border-white/[0.08] bg-white/[0.03] text-slate-300" onClick={() => setEditPkg(null)}>Cancel</Button>
            <Button onClick={savePkg} className="bg-red-500 hover:bg-red-600 text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}