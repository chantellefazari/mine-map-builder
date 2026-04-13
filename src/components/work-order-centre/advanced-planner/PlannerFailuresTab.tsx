import { useState, useMemo } from "react";
import {
  AlertTriangle, Plus, Search, Trash2, BarChart3, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useFailureRecords, type FailureRecord,
  FAILURE_MODES, FAILURE_CAUSES, FAILURE_REMEDIES,
  SEVERITY_LEVELS, DETECTION_METHODS, ROOT_CAUSE_CATEGORIES,
} from "@/hooks/useFailureRecords";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { format } from "date-fns";
import { toast } from "sonner";

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "bg-red-100 text-red-800",
  Major: "bg-amber-100 text-amber-800",
  Minor: "bg-blue-100 text-blue-800",
  Negligible: "bg-muted text-muted-foreground",
};

const emptyRecord: Partial<FailureRecord> = {
  asset_number: "",
  asset_name: "",
  area: "",
  failure_mode: "",
  failure_cause: "",
  failure_remedy: "",
  failure_class: "Mechanical",
  severity: "Minor",
  downtime_hours: 0,
  component_failed: "",
  detected_by: "",
  detection_method: "Visual Inspection",
  root_cause_category: "",
  corrective_action: "",
  preventive_action: "",
  is_recurring: false,
  notes: "",
  reported_by: "",
};

export function PlannerFailuresTab() {
  const { records, isLoading, create, update, remove } = useFailureRecords();
  const { workOrders } = useWorkOrders();
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterMode, setFilterMode] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<FailureRecord>>(emptyRecord);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = records;
    if (filterSeverity !== "All") items = items.filter(r => r.severity === filterSeverity);
    if (filterMode !== "All") items = items.filter(r => r.failure_mode === filterMode);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(r =>
        r.asset_number.toLowerCase().includes(q) ||
        r.failure_mode.toLowerCase().includes(q) ||
        r.component_failed.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q)
      );
    }
    return items;
  }, [records, filterSeverity, filterMode, search]);

  const stats = useMemo(() => {
    const totalDowntime = records.reduce((s, r) => s + r.downtime_hours, 0);
    const topMode = records.reduce((acc, r) => {
      if (r.failure_mode) acc[r.failure_mode] = (acc[r.failure_mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topModeEntry = Object.entries(topMode).sort((a, b) => b[1] - a[1])[0];
    return {
      total: records.length,
      critical: records.filter(r => r.severity === "Critical").length,
      recurring: records.filter(r => r.is_recurring).length,
      totalDowntime: Math.round(totalDowntime * 10) / 10,
      topMode: topModeEntry ? `${topModeEntry[0]} (${topModeEntry[1]})` : "—",
    };
  }, [records]);

  const openNew = (woId?: string) => {
    const wo = woId ? workOrders.find(w => w.id === woId) : null;
    setEditing({
      ...emptyRecord,
      work_order_id: woId || null,
      asset_number: wo?.asset_id || "",
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (r: FailureRecord) => {
    setEditing({ ...r });
    setEditingId(r.id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editing.failure_mode) { toast.error("Failure mode is required"); return; }
    if (editingId) {
      update.mutate({ id: editingId, updates: editing });
    } else {
      create.mutate(editing);
    }
    setDialogOpen(false);
  };

  const getWoLabel = (woId: string | null) => {
    if (!woId) return "—";
    return workOrders.find(w => w.id === woId)?.wo_number || "—";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stats */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        {[
          { label: "Total Failures", value: stats.total, color: "text-foreground" },
          { label: "Critical", value: stats.critical, color: "text-red-600" },
          { label: "Recurring", value: stats.recurring, color: "text-amber-600" },
          { label: "Total Downtime", value: `${stats.totalDowntime}h`, color: "text-foreground" },
          { label: "Top Failure Mode", value: stats.topMode, color: "text-foreground" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/40">
            <span className="text-[10px] text-muted-foreground">{s.label}</span>
            <span className={cn("text-xs font-bold", s.color)}>{s.value}</span>
          </div>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-7 h-8 w-44 text-xs" />
        </div>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Severity</SelectItem>
            {SEVERITY_LEVELS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => openNew()}>
          <Plus className="w-3.5 h-3.5" /> Record Failure
        </Button>
      </div>

      {/* Table */}
      <ScrollArea className="flex-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-muted/60 z-10">
            <tr>
              {["Date", "Asset", "Area", "Failure Mode", "Cause", "Remedy", "Severity", "Downtime", "Component", "Detection", "WO #", "Recurring", ""].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground border-b border-border whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer" onClick={() => openEdit(r)}>
                <td className="px-3 py-2 whitespace-nowrap">{format(new Date(r.failure_date), "dd MMM yy")}</td>
                <td className="px-3 py-2 font-mono">{r.asset_number || "—"}</td>
                <td className="px-3 py-2">{r.area || "—"}</td>
                <td className="px-3 py-2 font-medium">{r.failure_mode}</td>
                <td className="px-3 py-2">{r.failure_cause || "—"}</td>
                <td className="px-3 py-2">{r.failure_remedy || "—"}</td>
                <td className="px-3 py-2">
                  <Badge variant="outline" className={cn("text-[10px]", SEVERITY_COLORS[r.severity])}>{r.severity}</Badge>
                </td>
                <td className="px-3 py-2 text-right">{r.downtime_hours}h</td>
                <td className="px-3 py-2">{r.component_failed || "—"}</td>
                <td className="px-3 py-2">{r.detection_method}</td>
                <td className="px-3 py-2 font-mono">{getWoLabel(r.work_order_id)}</td>
                <td className="px-3 py-2">{r.is_recurring ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> : "—"}</td>
                <td className="px-3 py-2">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={e => { e.stopPropagation(); remove.mutate(r.id); }}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={13} className="text-center py-12 text-muted-foreground">No failure records found</td></tr>
            )}
          </tbody>
        </table>
      </ScrollArea>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {editingId ? "Edit Failure Record" : "Record Equipment Failure"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Failure Mode *</Label>
              <Select value={editing.failure_mode || ""} onValueChange={v => setEditing(p => ({ ...p, failure_mode: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {FAILURE_MODES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Failure Cause</Label>
              <Select value={editing.failure_cause || ""} onValueChange={v => setEditing(p => ({ ...p, failure_cause: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {FAILURE_CAUSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Remedy Applied</Label>
              <Select value={editing.failure_remedy || ""} onValueChange={v => setEditing(p => ({ ...p, failure_remedy: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {FAILURE_REMEDIES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Severity</Label>
              <Select value={editing.severity || "Minor"} onValueChange={v => setEditing(p => ({ ...p, severity: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEVERITY_LEVELS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Asset Number</Label>
              <Input className="h-8 text-xs" value={editing.asset_number || ""} onChange={e => setEditing(p => ({ ...p, asset_number: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Area</Label>
              <Input className="h-8 text-xs" value={editing.area || ""} onChange={e => setEditing(p => ({ ...p, area: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Component Failed</Label>
              <Input className="h-8 text-xs" value={editing.component_failed || ""} onChange={e => setEditing(p => ({ ...p, component_failed: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Downtime (hours)</Label>
              <Input className="h-8 text-xs" type="number" value={editing.downtime_hours || 0} onChange={e => setEditing(p => ({ ...p, downtime_hours: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label className="text-xs">Detection Method</Label>
              <Select value={editing.detection_method || "Visual Inspection"} onValueChange={v => setEditing(p => ({ ...p, detection_method: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DETECTION_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Root Cause Category</Label>
              <Select value={editing.root_cause_category || ""} onValueChange={v => setEditing(p => ({ ...p, root_cause_category: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {ROOT_CAUSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Linked Work Order</Label>
              <Select value={editing.work_order_id || "none"} onValueChange={v => setEditing(p => ({ ...p, work_order_id: v === "none" ? null : v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {workOrders.slice(0, 50).map(wo => (
                    <SelectItem key={wo.id} value={wo.id}>{wo.wo_number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Reported By</Label>
              <Input className="h-8 text-xs" value={editing.reported_by || ""} onChange={e => setEditing(p => ({ ...p, reported_by: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Corrective Action</Label>
              <Textarea className="text-xs min-h-[50px]" value={editing.corrective_action || ""} onChange={e => setEditing(p => ({ ...p, corrective_action: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Preventive Action (to avoid recurrence)</Label>
              <Textarea className="text-xs min-h-[50px]" value={editing.preventive_action || ""} onChange={e => setEditing(p => ({ ...p, preventive_action: e.target.value }))} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox checked={!!editing.is_recurring} onCheckedChange={v => setEditing(p => ({ ...p, is_recurring: !!v }))} />
              <Label className="text-xs">This is a recurring failure</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Save Changes" : "Record Failure"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
