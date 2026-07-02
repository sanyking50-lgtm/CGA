"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, UserCheck, UserX, Eye, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type UserRow = {
  id: string; name: string; email: string; phone: string | null;
  role: string; level: string; ordersCount: number; points: number;
  isActive: boolean; isVerified: boolean; createdAt: string;
};

type UserDetail = UserRow & { totalSpent: number; _count?: { orders: number } };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    try {
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        toast.success(`User ${!current ? "activated" : "deactivated"}`);
        fetchUsers();
        if (selectedUser?.id === id) setSelectedUser(null);
      }
    } catch { toast.error("Failed to update user"); }
  };

  const roleColors: Record<string, string> = {
    admin: "bg-red-500/10 text-red-400 border-red-500/20",
    staff: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    client: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">User Management</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 border-white/[0.08] bg-white/[0.03] text-slate-100"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-40 border-white/[0.08] bg-white/[0.03] text-slate-300">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="bg-[#0F1629] border-white/[0.1]">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06]">
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Email</TableHead>
              <TableHead className="text-slate-400">Role</TableHead>
              <TableHead className="text-slate-400">Level</TableHead>
              <TableHead className="text-slate-400">Orders</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Joined</TableHead>
              <TableHead className="text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-slate-500">Loading...</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-slate-500">No users found.</TableCell></TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} className="border-white/[0.06]">
                  <TableCell className="font-medium text-slate-200">{u.name}</TableCell>
                  <TableCell className="text-sm text-slate-400">{u.email}</TableCell>
                  <TableCell><Badge variant="outline" className={roleColors[u.role] || ""}>{u.role}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-400 capitalize">{u.level}</TableCell>
                  <TableCell className="text-sm text-slate-300">{u.ordersCount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={u.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                      {u.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200" onClick={() => { fetch(`/api/admin/users/${u.id}`).then(r => r.json()).then(setSelectedUser).catch(() => {}); }}>
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className={`h-8 w-8 ${u.isActive ? "text-amber-400 hover:text-amber-300" : "text-emerald-400 hover:text-emerald-300"}`} onClick={() => toggleActive(u.id, u.isActive)}>
                        {u.isActive ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" className="border-white/[0.08] bg-white/[0.03] text-slate-400" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
          <span className="text-sm text-slate-500">Page {page} of {Math.ceil(total / 20)}</span>
          <Button variant="outline" size="sm" className="border-white/[0.08] bg-white/[0.03] text-slate-400" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-[#0F1629] border-white/[0.1] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-slate-100">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500">Name:</span><p className="text-slate-200 font-medium">{selectedUser.name}</p></div>
                <div><span className="text-slate-500">Email:</span><p className="text-slate-200">{selectedUser.email}</p></div>
                <div><span className="text-slate-500">Phone:</span><p className="text-slate-200">{selectedUser.phone || "—"}</p></div>
                <div><span className="text-slate-500">Role:</span><p className="text-slate-200 capitalize">{selectedUser.role}</p></div>
                <div><span className="text-slate-500">Level:</span><p className="text-slate-200 capitalize">{selectedUser.level}</p></div>
                <div><span className="text-slate-500">Points:</span><p className="text-slate-200">{selectedUser.points}</p></div>
                <div><span className="text-slate-500">Orders:</span><p className="text-slate-200">{selectedUser.ordersCount}</p></div>
                <div><span className="text-slate-500">Total Spent:</span><p className="text-slate-200">৳{selectedUser.totalSpent || 0}</p></div>
                <div><span className="text-slate-500">Joined:</span><p className="text-slate-200">{new Date(selectedUser.createdAt).toLocaleDateString()}</p></div>
                <div><span className="text-slate-500">Status:</span><Badge variant="outline" className={selectedUser.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>{selectedUser.isActive ? "Active" : "Inactive"}</Badge></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Select value={selectedUser.role} onValueChange={async (v) => { try { const res = await fetch(`/api/admin/users/${selectedUser.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: v }) }); if (res.ok) { toast.success("Role updated"); setSelectedUser({ ...selectedUser, role: v }); fetchUsers(); } } catch { toast.error("Failed"); } }}>
                  <SelectTrigger className="border-white/[0.08] bg-white/[0.03]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0F1629] border-white/[0.1]"><SelectItem value="client">Client</SelectItem><SelectItem value="staff">Staff</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}