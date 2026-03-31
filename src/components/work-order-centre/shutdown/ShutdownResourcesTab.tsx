import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Users, Phone, Mail, Trash2, Edit2, ChevronDown, ChevronRight, UserPlus, HardHat } from "lucide-react";
import { ShutdownVendor, useShutdownVendors } from "@/hooks/useShutdowns";
import { ShutdownPersonnel, useShutdownPersonnel, TRADES } from "@/hooks/useShutdownPersonnel";
import { cn } from "@/lib/utils";

interface Props {
  shutdownId: string;
}

const TRADE_COLORS: Record<string, string> = {
  "Supervisor": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  "Leading Hand": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Boilermaker": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Electrician": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Fitter": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Crane Operator": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Rigger": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Scaffolder": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "Trades Assistant": "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  "Engineer": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "Instrument Tech": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

const TICKETS = [
  "Confined Space",
  "Working at Heights",
  "EWP (Elevated Work Platform)",
  "Forklift",
  "Dogman / Rigger",
  "Crane Operator",
  "Hot Work Permit",
  "Gas Test Atmosphere",
  "First Aid",
  "Fire Warden",
  "Isolation / LOTO",
  "Scaffolding",
  "Asbestos Awareness",
  "Electrical Licence",
] as const;

export function ShutdownResourcesTab({ shutdownId }: Props) {
  const { vendors, addVendor, updateVendor, removeVendor } = useShutdownVendors(shutdownId);
  const { personnel, addPerson, updatePerson, removePerson } = useShutdownPersonnel(shutdownId);
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set());
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showAddPerson, setShowAddPerson] = useState<string | null>(null);
  const [editingPerson, setEditingPerson] = useState<ShutdownPersonnel | null>(null);
  const [editingVendor, setEditingVendor] = useState<ShutdownVendor | null>(null);

  const [vendorForm, setVendorForm] = useState({
    vendor_code: "", vendor_name: "", contact_name: "", contact_phone: "", contact_email: "", daily_hours: 10.5, notes: "",
  });

  const [personForm, setPersonForm] = useState({
    name: "", trade: "Fitter", phone: "", notes: "",
  });

  const toggleVendor = (id: string) => {
    setExpandedVendors((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalPersonnel = personnel.length;
  const tradeCounts = personnel.reduce((acc, p) => {
    acc[p.trade] = (acc[p.trade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const resetVendorForm = () => setVendorForm({ vendor_code: "", vendor_name: "", contact_name: "", contact_phone: "", contact_email: "", daily_hours: 10.5, notes: "" });
  const resetPersonForm = () => setPersonForm({ name: "", trade: "Fitter", phone: "", notes: "" });

  const handleSaveVendor = () => {
    if (!vendorForm.vendor_name.trim()) return;
    if (editingVendor) {
      updateVendor.mutate({ id: editingVendor.id, updates: { ...vendorForm, personnel_count: personnel.filter(p => p.vendor_id === editingVendor.id).length } });
      setEditingVendor(null);
    } else {
      addVendor.mutate({ shutdown_id: shutdownId, ...vendorForm, personnel_count: 0 });
    }
    resetVendorForm();
    setShowAddVendor(false);
  };

  const handleSavePerson = () => {
    if (!personForm.name.trim()) return;
    const vendorId = editingPerson ? editingPerson.vendor_id : showAddPerson;
    if (!vendorId) return;
    if (editingPerson) {
      updatePerson.mutate({ id: editingPerson.id, updates: personForm });
      setEditingPerson(null);
    } else {
      addPerson.mutate({ shutdown_id: shutdownId, vendor_id: vendorId, ...personForm });
    }
    resetPersonForm();
    setShowAddPerson(null);
  };

  const openEditVendor = (v: ShutdownVendor) => {
    setVendorForm({
      vendor_code: v.vendor_code, vendor_name: v.vendor_name, contact_name: v.contact_name,
      contact_phone: v.contact_phone, contact_email: v.contact_email, daily_hours: v.daily_hours, notes: v.notes,
    });
    setEditingVendor(v);
    setShowAddVendor(true);
  };

  const openEditPerson = (p: ShutdownPersonnel) => {
    setPersonForm({ name: p.name, trade: p.trade, phone: p.phone, notes: p.notes });
    setEditingPerson(p);
    setShowAddPerson(p.vendor_id);
  };

  return (
    <div className="space-y-4">
      {/* Summary Banner */}
      <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold">Resource Allocation</h3>
            <p className="text-[10px] text-muted-foreground">{vendors.length} vendors · {totalPersonnel} personnel assigned</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(tradeCounts).map(([trade, count]) => (
            <Badge key={trade} variant="outline" className={cn("text-[9px] h-5", TRADE_COLORS[trade])}>
              {trade}: {count}
            </Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => { resetVendorForm(); setEditingVendor(null); setShowAddVendor(true); }}>
          <Plus className="w-3 h-3" /> Add Vendor
        </Button>
      </div>

      {/* Vendor → Personnel Tree */}
      {vendors.length === 0 ? (
        <div className="text-center py-10 text-xs text-muted-foreground border border-dashed border-border rounded-lg bg-card">
          <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
          No vendors allocated — add a vendor to start building your crew
        </div>
      ) : (
        <div className="space-y-2">
          {vendors.map((v) => {
            const vendorPersonnel = personnel.filter((p) => p.vendor_id === v.id);
            const isExpanded = expandedVendors.has(v.id);

            return (
              <div key={v.id} className="border border-border rounded-lg bg-card overflow-hidden">
                {/* Vendor Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toggleVendor(v.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground">
                      {v.vendor_code || v.vendor_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{v.vendor_name}</span>
                        {v.vendor_code && <Badge variant="outline" className="text-[9px] h-4">{v.vendor_code}</Badge>}
                        <Badge variant="secondary" className="text-[9px] h-4">{vendorPersonnel.length} pax</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        {v.contact_name && <span>{v.contact_name}</span>}
                        {v.contact_phone && <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" />{v.contact_phone}</span>}
                        {v.contact_email && <span className="flex items-center gap-0.5"><Mail className="w-2.5 h-2.5" />{v.contact_email}</span>}
                        <span>{v.daily_hours}h/day</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { resetPersonForm(); setShowAddPerson(v.id); }}>
                      <UserPlus className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditVendor(v)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => removeVendor.mutate(v.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Personnel List */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {vendorPersonnel.length === 0 ? (
                      <div className="px-4 py-4 text-center text-[11px] text-muted-foreground">
                        No personnel added —{" "}
                        <button className="text-primary hover:underline" onClick={() => { resetPersonForm(); setShowAddPerson(v.id); }}>
                          add crew members
                        </button>
                      </div>
                    ) : (
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border bg-muted/20">
                            <th className="text-left px-4 py-2 font-semibold w-[250px]">Name</th>
                            <th className="text-left px-4 py-2 font-semibold w-[160px]">Trade / Role</th>
                            <th className="text-left px-4 py-2 font-semibold w-[120px]">Phone</th>
                            <th className="text-left px-4 py-2 font-semibold">Notes</th>
                            <th className="w-[70px]"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendorPersonnel.map((p) => (
                            <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-muted/10">
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <HardHat className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="font-medium">{p.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2.5">
                                <Badge variant="outline" className={cn("text-[9px]", TRADE_COLORS[p.trade])}>
                                  {p.trade}
                                </Badge>
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">{p.role || "—"}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{p.phone || "—"}</td>
                              <td className="px-4 py-2.5 text-muted-foreground truncate max-w-[200px]">{p.notes || "—"}</td>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-1 justify-end">
                                  <button onClick={() => openEditPerson(p)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => removePerson.mutate(p.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <div className="px-4 py-2 border-t border-border bg-muted/10">
                      <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-muted-foreground" onClick={() => { resetPersonForm(); setShowAddPerson(v.id); }}>
                        <UserPlus className="w-3 h-3" /> Add Personnel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Vendor Dialog */}
      <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingVendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Vendor Name *</Label><Input placeholder="e.g., BW Contracting" value={vendorForm.vendor_name} onChange={(e) => setVendorForm({ ...vendorForm, vendor_name: e.target.value })} className="h-9 text-sm" /></div>
              <div><Label className="text-xs">Vendor Code</Label><Input placeholder="e.g., BW" value={vendorForm.vendor_code} onChange={(e) => setVendorForm({ ...vendorForm, vendor_code: e.target.value })} className="h-9 text-sm" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">Contact Name</Label><Input value={vendorForm.contact_name} onChange={(e) => setVendorForm({ ...vendorForm, contact_name: e.target.value })} className="h-9 text-sm" /></div>
              <div><Label className="text-xs">Phone</Label><Input value={vendorForm.contact_phone} onChange={(e) => setVendorForm({ ...vendorForm, contact_phone: e.target.value })} className="h-9 text-sm" /></div>
              <div><Label className="text-xs">Email</Label><Input value={vendorForm.contact_email} onChange={(e) => setVendorForm({ ...vendorForm, contact_email: e.target.value })} className="h-9 text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Daily Hours</Label><Input type="number" min={0} step={0.5} value={vendorForm.daily_hours} onChange={(e) => setVendorForm({ ...vendorForm, daily_hours: Number(e.target.value) })} className="h-9 text-sm" /></div>
              <div><Label className="text-xs">Notes</Label><Input placeholder="Scope, speciality, etc." value={vendorForm.notes} onChange={(e) => setVendorForm({ ...vendorForm, notes: e.target.value })} className="h-9 text-sm" /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddVendor(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSaveVendor} disabled={!vendorForm.vendor_name.trim()}>{editingVendor ? "Update" : "Add"} Vendor</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Personnel Dialog */}
      <Dialog open={!!showAddPerson || !!editingPerson} onOpenChange={(open) => { if (!open) { setShowAddPerson(null); setEditingPerson(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPerson ? "Edit Personnel" : "Add Personnel"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Name *</Label>
                <Input placeholder="e.g., John Smith" value={personForm.name} onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Trade *</Label>
                <Select value={personForm.trade} onValueChange={(v) => setPersonForm({ ...personForm, trade: v })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TRADES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Role / Position</Label>
                <Input placeholder="e.g., Leading Hand" value={personForm.role} onChange={(e) => setPersonForm({ ...personForm, role: e.target.value })} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input placeholder="e.g., 0400 000 000" value={personForm.phone} onChange={(e) => setPersonForm({ ...personForm, phone: e.target.value })} className="h-9 text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Tickets / Competencies</Label>
              <div className="border border-input rounded-md bg-background">
                <details className="group">
                  <summary className="flex items-center justify-between px-3 py-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground list-none">
                    <span>{personForm.notes ? personForm.notes.split(", ").length + " selected" : "Select tickets..."}</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-input px-3 py-2 space-y-1.5 max-h-[180px] overflow-y-auto">
                    {TICKETS.map((ticket) => {
                      const selected = personForm.notes ? personForm.notes.split(", ").includes(ticket) : false;
                      return (
                        <label key={ticket} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted/50 rounded px-1 py-1">
                          <Checkbox
                            checked={selected}
                            onCheckedChange={(checked) => {
                              const current = personForm.notes ? personForm.notes.split(", ").filter(Boolean) : [];
                              const next = checked
                                ? [...current, ticket]
                                : current.filter((t) => t !== ticket);
                              setPersonForm({ ...personForm, notes: next.join(", ") });
                            }}
                          />
                          {ticket}
                        </label>
                      );
                    })}
                  </div>
                </details>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setShowAddPerson(null); setEditingPerson(null); }}>Cancel</Button>
              <Button size="sm" onClick={handleSavePerson} disabled={!personForm.name.trim()}>{editingPerson ? "Update" : "Add"} Personnel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
