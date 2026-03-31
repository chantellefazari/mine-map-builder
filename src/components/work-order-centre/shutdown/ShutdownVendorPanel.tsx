import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Users, Phone, Mail, Trash2, Edit2 } from "lucide-react";
import { ShutdownVendor, useShutdownVendors } from "@/hooks/useShutdowns";

interface Props {
  shutdownId: string;
}

export function ShutdownVendorPanel({ shutdownId }: Props) {
  const { vendors, addVendor, updateVendor, removeVendor } = useShutdownVendors(shutdownId);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    vendor_code: "",
    vendor_name: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    personnel_count: 0,
    daily_hours: 10.5,
    notes: "",
  });

  const resetForm = () => {
    setForm({ vendor_code: "", vendor_name: "", contact_name: "", contact_phone: "", contact_email: "", personnel_count: 0, daily_hours: 10.5, notes: "" });
  };

  const handleSave = () => {
    if (!form.vendor_name.trim()) return;
    if (editingId) {
      updateVendor.mutate({ id: editingId, updates: form });
      setEditingId(null);
    } else {
      addVendor.mutate({ shutdown_id: shutdownId, ...form });
    }
    resetForm();
    setShowAdd(false);
  };

  const handleEdit = (v: ShutdownVendor) => {
    setForm({
      vendor_code: v.vendor_code,
      vendor_name: v.vendor_name,
      contact_name: v.contact_name,
      contact_phone: v.contact_phone,
      contact_email: v.contact_email,
      personnel_count: v.personnel_count,
      daily_hours: v.daily_hours,
      notes: v.notes,
    });
    setEditingId(v.id);
    setShowAdd(true);
  };

  const totalPersonnel = vendors.reduce((s, v) => s + v.personnel_count, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Resource Allocation</h3>
          <Badge variant="secondary" className="text-[10px]">{vendors.length} vendors · {totalPersonnel} personnel</Badge>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={() => { resetForm(); setEditingId(null); setShowAdd(true); }}>
          <Plus className="w-3 h-3" /> Add Vendor
        </Button>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
          No vendors allocated — add vendors to assign resources
        </div>
      ) : (
        <div className="grid gap-2">
          {vendors.map((v) => (
            <div key={v.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  {v.vendor_code || v.vendor_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold truncate">{v.vendor_name}</span>
                    {v.vendor_code && <Badge variant="outline" className="text-[9px] h-4">+ {v.vendor_code}</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    {v.contact_name && <span>{v.contact_name}</span>}
                    {v.contact_phone && <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" />{v.contact_phone}</span>}
                    {v.contact_email && <span className="flex items-center gap-0.5"><Mail className="w-2.5 h-2.5" />{v.contact_email}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold">{v.personnel_count} <span className="text-muted-foreground font-normal">pax</span></div>
                  <div className="text-[10px] text-muted-foreground">{v.daily_hours}h/day</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(v)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeVendor.mutate(v.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Vendor Name *</Label>
                <Input placeholder="e.g., BW Contracting" value={form.vendor_name} onChange={(e) => setForm({ ...form, vendor_name: e.target.value })} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Vendor Code</Label>
                <Input placeholder="e.g., BW" value={form.vendor_code} onChange={(e) => setForm({ ...form, vendor_code: e.target.value })} className="h-9 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Contact Name</Label>
                <Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="h-9 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Personnel Count</Label>
                <Input type="number" min={0} value={form.personnel_count} onChange={(e) => setForm({ ...form, personnel_count: Number(e.target.value) })} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Daily Hours</Label>
                <Input type="number" min={0} step={0.5} value={form.daily_hours} onChange={(e) => setForm({ ...form, daily_hours: Number(e.target.value) })} className="h-9 text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Input placeholder="Scope, speciality, etc." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={!form.vendor_name.trim()}>{editingId ? "Update" : "Add"} Vendor</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
