import { useState, useMemo } from "react";
import {
  Gauge, Plus, Search, Trash2, AlertTriangle, CheckCircle2,
  Activity, Thermometer, Timer, Waves,
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
import { Progress } from "@/components/ui/progress";
import {
  useConditionTriggers, type ConditionTrigger,
  TRIGGER_TYPES, READING_SOURCES, PARAMETER_UNITS,
} from "@/hooks/useConditionTriggers";
import { usePMasterList } from "@/hooks/usePMData";
import { format } from "date-fns";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Warning: "bg-amber-100 text-amber-800",
  Critical: "bg-red-100 text-red-800",
  Inactive: "bg-muted text-muted-foreground",
  Triggered: "bg-blue-100 text-blue-800",
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  "Meter-Based": Timer,
  "Condition-Based": Waves,
  Calendar: Activity,
};

const emptyTrigger: Partial<ConditionTrigger> = {
  trigger_name: "",
  asset_number: "",
  asset_name: "",
  area: "",
  trigger_type: "Meter-Based",
  parameter_name: "",
  threshold_value: 0,
  threshold_unit: "hours",
  warning_threshold: null,
  critical_threshold: null,
  current_value: 0,
  reading_source: "Manual",
  auto_generate_wo: false,
  status: "Active",
  notes: "",
  created_by: "",
};

export function PlannerConditionMonitoringTab() {
  const { triggers, isLoading, create, update, remove } = useConditionTriggers();
  const { pms } = usePMasterList();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<ConditionTrigger>>(emptyTrigger);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = triggers;
    if (filterType !== "All") items = items.filter(t => t.trigger_type === filterType);
    if (filterStatus !== "All") items = items.filter(t => t.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(t =>
        t.trigger_name.toLowerCase().includes(q) ||
        t.asset_number.toLowerCase().includes(q) ||
        t.parameter_name.toLowerCase().includes(q)
      );
    }
    return items;
  }, [triggers, filterType, filterStatus, search]);

  const stats = useMemo(() => ({
    total: triggers.length,
    active: triggers.filter(t => t.status === "Active").length,
    warning: triggers.filter(t => {
      if (!t.warning_threshold) return false;
      return t.current_value >= t.warning_threshold && t.current_value < (t.critical_threshold || t.threshold_value);
    }).length,
    critical: triggers.filter(t => {
      if (!t.critical_threshold && !t.threshold_value) return false;
      return t.current_value >= (t.critical_threshold || t.threshold_value);
    }).length,
    meterBased: triggers.filter(t => t.trigger_type === "Meter-Based").length,
    conditionBased: triggers.filter(t => t.trigger_type === "Condition-Based").length,
  }), [triggers]);

  const getHealthPct = (t: ConditionTrigger) => {
    if (!t.threshold_value || t.threshold_value === 0) return 0;
    return Math.min(100, (t.current_value / t.threshold_value) * 100);
  };

  const getHealthColor = (pct: number) => {
    if (pct >= 90) return "text-red-600";
    if (pct >= 70) return "text-amber-600";
    return "text-emerald-600";
  };

  const openNew = () => {
    setEditing({ ...emptyTrigger });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (t: ConditionTrigger) => {
    setEditing({ ...t });
    setEditingId(t.id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editing.trigger_name) { toast.error("Trigger name is required"); return; }
    if (editingId) {
      update.mutate({ id: editingId, updates: editing });
    } else {
      create.mutate(editing);
    }
    setDialogOpen(false);
  };

  const handleUpdateReading = (t: ConditionTrigger, newValue: number) => {
    const updates: Partial<ConditionTrigger> = {
      current_value: newValue,
      last_reading_date: new Date().toISOString(),
    };
    // Check if threshold exceeded
    if (newValue >= (t.critical_threshold || t.threshold_value)) {
      updates.status = "Critical";
      toast.warning(`⚠️ ${t.trigger_name}: Critical threshold exceeded!`);
    } else if (t.warning_threshold && newValue >= t.warning_threshold) {
      updates.status = "Warning";
    } else {
      updates.status = "Active";
    }
    update.mutate({ id: t.id, updates });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stats */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        {[
          { label: "Total Triggers", value: stats.total, color: "text-foreground" },
          { label: "Active", value: stats.active, color: "text-emerald-600" },
          { label: "Warning", value: stats.warning, color: "text-amber-600" },
          { label: "Critical", value: stats.critical, color: "text-red-600" },
          { label: "Meter-Based", value: stats.meterBased, color: "text-foreground" },
          { label: "Condition-Based", value: stats.conditionBased, color: "text-foreground" },
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
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {TRIGGER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            {["Active", "Warning", "Critical", "Inactive", "Triggered"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={openNew}>
          <Plus className="w-3.5 h-3.5" /> New Trigger
        </Button>
      </div>

      {/* Cards Grid */}
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(t => {
            const pct = getHealthPct(t);
            const Icon = TYPE_ICONS[t.trigger_type] || Activity;
            return (
              <div
                key={t.id}
                className="border border-border rounded-lg bg-card p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openEdit(t)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{t.trigger_name}</div>
                      <div className="text-[10px] text-muted-foreground">{t.asset_number} · {t.area}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px]", STATUS_COLORS[t.status])}>{t.status}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t.parameter_name}</span>
                    <span className={cn("font-bold", getHealthColor(pct))}>
                      {t.current_value} / {t.threshold_value} {t.threshold_unit}
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{t.trigger_type}</span>
                    <span>{t.reading_source}</span>
                    {t.last_reading_date && <span>Last: {format(new Date(t.last_reading_date), "dd MMM")}</span>}
                  </div>
                  {t.auto_generate_wo && (
                    <div className="flex items-center gap-1 text-[10px] text-blue-600">
                      <CheckCircle2 className="w-3 h-3" /> Auto-generates WO
                    </div>
                  )}
                </div>

                {/* Quick reading update */}
                <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <Input
                    className="h-7 text-xs flex-1"
                    type="number"
                    placeholder="New reading..."
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        const val = parseFloat((e.target as HTMLInputElement).value);
                        if (!isNaN(val)) {
                          handleUpdateReading(t, val);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={e => { e.stopPropagation(); remove.mutate(t.id); }}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">No condition triggers found</div>
          )}
        </div>
      </ScrollArea>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              {editingId ? "Edit Condition Trigger" : "New Condition Trigger"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-xs">Trigger Name *</Label>
              <Input className="h-8 text-xs" value={editing.trigger_name || ""} onChange={e => setEditing(p => ({ ...p, trigger_name: e.target.value }))} placeholder="e.g. Ball Mill Motor Vibration" />
            </div>
            <div>
              <Label className="text-xs">Trigger Type</Label>
              <Select value={editing.trigger_type || "Meter-Based"} onValueChange={v => setEditing(p => ({ ...p, trigger_type: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TRIGGER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Reading Source</Label>
              <Select value={editing.reading_source || "Manual"} onValueChange={v => setEditing(p => ({ ...p, reading_source: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {READING_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
              <Label className="text-xs">Parameter Name</Label>
              <Input className="h-8 text-xs" value={editing.parameter_name || ""} onChange={e => setEditing(p => ({ ...p, parameter_name: e.target.value }))} placeholder="e.g. Vibration, Temperature, Hours" />
            </div>
            <div>
              <Label className="text-xs">Unit</Label>
              <Select value={editing.threshold_unit || "hours"} onValueChange={v => setEditing(p => ({ ...p, threshold_unit: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PARAMETER_UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Threshold Value (Trigger)</Label>
              <Input className="h-8 text-xs" type="number" value={editing.threshold_value || 0} onChange={e => setEditing(p => ({ ...p, threshold_value: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label className="text-xs">Warning Threshold</Label>
              <Input className="h-8 text-xs" type="number" value={editing.warning_threshold ?? ""} onChange={e => setEditing(p => ({ ...p, warning_threshold: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="Optional" />
            </div>
            <div>
              <Label className="text-xs">Critical Threshold</Label>
              <Input className="h-8 text-xs" type="number" value={editing.critical_threshold ?? ""} onChange={e => setEditing(p => ({ ...p, critical_threshold: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="Optional" />
            </div>
            <div>
              <Label className="text-xs">Current Value</Label>
              <Input className="h-8 text-xs" type="number" value={editing.current_value || 0} onChange={e => setEditing(p => ({ ...p, current_value: parseFloat(e.target.value) || 0 }))} />
            </div>
            {editing.trigger_type === "Meter-Based" && (
              <div>
                <Label className="text-xs">Service Interval (hours)</Label>
                <Input className="h-8 text-xs" type="number" value={editing.frequency_hours ?? ""} onChange={e => setEditing(p => ({ ...p, frequency_hours: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="e.g. 500" />
              </div>
            )}
            <div>
              <Label className="text-xs">Linked PM Template</Label>
              <Select value={editing.pm_template_id || "none"} onValueChange={v => setEditing(p => ({ ...p, pm_template_id: v === "none" ? null : v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {pms.slice(0, 50).map(pm => (
                    <SelectItem key={pm.id} value={pm.id}>{pm.pmName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Notes</Label>
              <Textarea className="text-xs min-h-[50px]" value={editing.notes || ""} onChange={e => setEditing(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox checked={!!editing.auto_generate_wo} onCheckedChange={v => setEditing(p => ({ ...p, auto_generate_wo: !!v }))} />
              <Label className="text-xs">Auto-generate Work Order when threshold is exceeded</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Save Changes" : "Create Trigger"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
