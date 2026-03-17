import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Settings2, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ALL_TABS = [
  { key: "po-import", label: "PO Import + Component Cleaner" },
  { key: "maintenance-foundations", label: "Maintenance Process Foundations" },
  { key: "asset-tree", label: "Asset Tree" },
  { key: "pm-design", label: "Preventive Maintenance (PM) Design" },
  { key: "work-order-templates", label: "Work Orders & Work Requests" },
  { key: "components-oem", label: "Components & OEM Data" },
  { key: "suppliers-procurement", label: "Suppliers & Procurement" },
  { key: "stores-warehouse-design", label: "Stores & Warehouse Design" },
  { key: "critical-spares", label: "Critical Spares Catalogue" },
  { key: "site-spares", label: "Site Spares Catalogue" },
  { key: "planning-revision", label: "Planning & Revision Control" },
  { key: "po-tracker", label: "PO Register" },
  { key: "purchase-requests", label: "Purchase Requests" },
  { key: "3d-concepts", label: "3D Concepts" },
  { key: "plant-intelligence", label: "Plant Intelligence" },
];

interface UserRecord {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  granted_tabs: string[];
}

const AdminPanel = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Create user dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newSelectedTabs, setNewSelectedTabs] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  // Edit permissions dialog
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [editTabs, setEditTabs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-list-users");
      if (error) throw error;

      const { profiles, tab_permissions } = data as {
        profiles: { id: string; full_name: string; email: string; created_at: string }[];
        tab_permissions: { user_id: string; tab_key: string; granted: boolean }[];
      };

      const mapped: UserRecord[] = profiles.map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        created_at: p.created_at,
        granted_tabs: tab_permissions
          .filter((tp) => tp.user_id === p.id && tp.granted)
          .map((tp) => tp.tab_key),
      }));

      setUsers(mapped);
    } catch (err) {
      toast({ title: "Error loading users", description: String(err), variant: "destructive" });
    } finally {
      setLoadingUsers(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async () => {
    if (!newEmail || !newPassword) {
      toast({ title: "Email and password are required", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        body: {
          email: newEmail,
          password: newPassword,
          full_name: newFullName,
          tab_permissions: newSelectedTabs,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "User created successfully" });
      setCreateOpen(false);
      setNewEmail("");
      setNewPassword("");
      setNewFullName("");
      setNewSelectedTabs([]);
      fetchUsers();
    } catch (err) {
      toast({ title: "Failed to create user", description: String(err), variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleEditPermissions = (user: UserRecord) => {
    setEditUser(user);
    setEditTabs([...user.granted_tabs]);
  };

  const handleSavePermissions = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-update-user-permissions", {
        body: { target_user_id: editUser.id, tab_permissions: editTabs },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "Permissions updated" });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast({ title: "Failed to update permissions", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleTabInList = (tabKey: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(tabKey)) {
      setList(list.filter((t) => t !== tabKey));
    } else {
      setList([...list, tabKey]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-5 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Manage users and tab access permissions</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create User
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Users</h2>
            <p className="text-sm text-muted-foreground">
              {users.length} user{users.length !== 1 ? "s" : ""} registered
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading users…</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No users yet. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tabs Granted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.full_name || <span className="text-muted-foreground italic">—</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.granted_tabs.length === 0 ? (
                          <span className="text-muted-foreground text-xs italic">No access</span>
                        ) : (
                          u.granted_tabs.map((tk) => {
                            const tab = ALL_TABS.find((t) => t.key === tk);
                            return (
                              <Badge key={tk} variant="secondary" className="text-xs">
                                {tab?.label ?? tk}
                              </Badge>
                            );
                          })
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => handleEditPermissions(u)}
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                        Edit Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Smith"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input
                type="password"
                placeholder="Set a strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label>Tab Access Permissions</Label>
              <div className="border border-border rounded-lg divide-y divide-border">
                {ALL_TABS.map((tab) => (
                  <div key={tab.key} className="flex items-center gap-3 px-4 py-2.5">
                    <Checkbox
                      id={`new-${tab.key}`}
                      checked={newSelectedTabs.includes(tab.key)}
                      onCheckedChange={() =>
                        toggleTabInList(tab.key, newSelectedTabs, setNewSelectedTabs)
                      }
                    />
                    <Label htmlFor={`new-${tab.key}`} className="cursor-pointer font-normal text-sm">
                      {tab.label}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {newSelectedTabs.length} of {ALL_TABS.length} tabs selected
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={creating} className="gap-2">
              {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {creating ? "Creating…" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permissions Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Access — {editUser?.full_name || editUser?.email}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Toggle the tabs this user can access. Changes take effect immediately on their next page load.
            </p>
            <div className="border border-border rounded-lg divide-y divide-border">
              {ALL_TABS.map((tab) => (
                <div key={tab.key} className="flex items-center gap-3 px-4 py-2.5">
                  <Checkbox
                    id={`edit-${tab.key}`}
                    checked={editTabs.includes(tab.key)}
                    onCheckedChange={() =>
                      toggleTabInList(tab.key, editTabs, setEditTabs)
                    }
                  />
                  <Label htmlFor={`edit-${tab.key}`} className="cursor-pointer font-normal text-sm">
                    {tab.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {editTabs.length} of {ALL_TABS.length} tabs granted
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Saving…" : "Save Permissions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
