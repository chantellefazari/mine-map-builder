import { useState, useMemo, useCallback } from "react";
import {
  Search, ChevronDown, ChevronRight, Plus, Clock, Wrench,
  ListChecks, Package, ShieldAlert, AlertTriangle, Settings2,
  Pencil, Trash2, X, Save, Copy, Activity, Power, RefreshCw, Zap,
  Eye, CheckCircle2, FileCheck, ClipboardCheck, Users, Gauge, FileText,
  Lock, Flame, Mountain, Droplets,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { usePMasterList } from "@/hooks/usePMData";
import { toast } from "sonner";
import { type PlannerItem, flattenPMTasks } from "./AdvancedPlannerView";
import { AssetSearchSelect, AssetMultiSelect } from "./AssetSearchSelect";

interface Props {
  items: PlannerItem[];
}

const FREQUENCIES = ["Daily", "Weekly", "Fortnightly", "Monthly", "Quarterly", "6-Monthly", "Annually", "Shutdown"];
const DISCIPLINES = ["Mechanical", "Electrical", "Instrumentation", "Process", "General"];
const LIFECYCLE_STATUSES = ["Draft", "Preview", "Approved", "Active"] as const;
const DUTY_TYPES = ["Online", "Offline", "Both"];
const SKILL_LEVELS = ["Basic", "Competent", "Advanced", "Specialist"];
const PLAN_CATEGORIES = ["Preventive", "Shutdown", "Condition-Based", "Lifecycle"] as const;
const WORK_CENTRES = ["MECH", "ELEC", "MOBILE", "PROJ"];
const PERMIT_TYPES = ["None", "General", "Hot Work", "Confined Space", "Working at Heights", "Isolation"];

type PlanCategory = typeof PLAN_CATEGORIES[number];
type LifecycleStatus = typeof LIFECYCLE_STATUSES[number];
type PlanType = "Inspection" | "Maintenance";

function getPlanType(category: string): PlanType {
  if (category === "Lifecycle") return "Maintenance";
  return "Inspection";
}

const CATEGORY_CONFIG: Record<PlanCategory, { label: string; icon: React.ElementType; description: string; color: string }> = {
  Preventive: { label: "Preventive (Online)", icon: Activity, description: "Routine inspections & running PMs", color: "text-emerald-600" },
  Shutdown: { label: "Shutdown / Offline", icon: Power, description: "Isolation-dependent maintenance", color: "text-amber-600" },
  "Condition-Based": { label: "Condition-Based", icon: Zap, description: "Triggered by monitoring data", color: "text-blue-600" },
  Lifecycle: { label: "Lifecycle / Changeout", icon: RefreshCw, description: "Overhauls, rebuilds & replacements", color: "text-purple-600" },
};

const LIFECYCLE_CONFIG: Record<LifecycleStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  Draft: { label: "Draft", icon: Pencil, color: "text-muted-foreground", bg: "bg-muted" },
  Preview: { label: "Preview", icon: Eye, color: "text-blue-600", bg: "bg-blue-500/10" },
  Approved: { label: "Approved", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-500/10" },
  Active: { label: "Active", icon: FileCheck, color: "text-emerald-600", bg: "bg-emerald-500/10" },
};

export function PlannerMaintenancePlansTab({ items }: Props) {
  const { pms, upsertPM, deletePM } = usePMasterList();
  const [search, setSearch] = useState("");
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [groupBy, setGroupBy] = useState<"frequency" | "discipline" | "area">("frequency");
  const [showCreate, setShowCreate] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlannerItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<PlanCategory | "All">("All");

  const allPMs = useMemo(() => items, [items]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allPMs.length };
    for (const cat of PLAN_CATEGORIES) counts[cat] = 0;
    for (const item of allPMs) {
      const cat = item.planCategory || "Preventive";
      if (counts[cat] !== undefined) counts[cat]++;
    }
    return counts;
  }, [allPMs]);

  const filtered = useMemo(() => {
    let items2 = allPMs;
    if (activeCategory !== "All") {
      items2 = items2.filter(i => (i.planCategory || "Preventive") === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items2 = items2.filter(i =>
        i.taskName.toLowerCase().includes(q) ||
        i.assetNumber.toLowerCase().includes(q) ||
        i.frequency.toLowerCase().includes(q) ||
        i.discipline.toLowerCase().includes(q) ||
        i.area.toLowerCase().includes(q)
      );
    }
    return items2;
  }, [allPMs, search, activeCategory]);

  const groups = useMemo(() => {
    const map = new Map<string, PlannerItem[]>();
    for (const item of filtered) {
      const key = groupBy === "frequency" ? (item.frequency || "No Frequency")
        : groupBy === "discipline" ? (item.discipline || "Unassigned")
        : (item.area || "Unassigned");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered, groupBy]);

  const togglePlan = (id: string) => {
    setExpandedPlans(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getRawPM = useCallback((plannerItem: PlannerItem) => {
    return pms.find(p => p.id === plannerItem.sourceId) || pms.find(p => p.id === plannerItem.id);
  }, [pms]);

  const handleDelete = async (plan: PlannerItem) => {
    const id = plan.sourceId || plan.id;
    if (!confirm(`Delete "${plan.taskName}"? This cannot be undone.`)) return;
    try {
      await deletePM(id);
      toast.success("Plan deleted");
    } catch {
      toast.error("Failed to delete plan");
    }
  };

  const handleDuplicate = async (plan: PlannerItem) => {
    const raw = getRawPM(plan);
    if (!raw) return;
    try {
      const { id, ...rest } = raw;
      await upsertPM({ ...rest, id: crypto.randomUUID(), pmName: `${rest.pmName} (Copy)`, status: "Active" } as any);
      toast.success("Plan duplicated");
    } catch {
      toast.error("Failed to duplicate plan");
    }
  };

  const totalHrs = filtered.reduce((s, i) => s + i.estimatedHours, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-foreground">{filtered.length} Maintenance Plans</span>
          <span className="text-[10px] text-muted-foreground">{groups.length} groups · {totalHrs.toFixed(0)}h total</span>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-muted-foreground">Group:</span>
            <Select value={groupBy} onValueChange={(v: any) => setGroupBy(v)}>
              <SelectTrigger className="h-6 w-24 text-[10px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="frequency">Frequency</SelectItem>
                <SelectItem value="discipline">Discipline</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search plans..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-7 w-52 text-xs" />
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setShowCreate(true)}>
            <Plus className="w-3.5 h-3.5" /> New Plan
          </Button>
        </div>
      </div>

      {/* Category bar */}
      <div className="flex items-center gap-1 px-4 py-1.5 border-b border-border bg-muted/5 overflow-x-auto">
        <button onClick={() => setActiveCategory("All")} className={cn("flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium transition-all whitespace-nowrap", activeCategory === "All" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
          <ListChecks className="w-3 h-3" /> All Plans <Badge variant="secondary" className="text-[8px] px-1 h-3.5 ml-0.5">{categoryCounts.All}</Badge>
        </button>
        <div className="h-4 w-px bg-border mx-0.5" />
        {PLAN_CATEGORIES.map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={cn("flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium transition-all whitespace-nowrap", activeCategory === cat ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
              <cfg.icon className="w-3 h-3" /> {cfg.label} <Badge variant="secondary" className="text-[8px] px-1 h-3.5 ml-0.5">{categoryCounts[cat] || 0}</Badge>
            </button>
          );
        })}
      </div>


      {/* Column headers */}
      <div className="grid grid-cols-[1fr_80px_100px_90px_80px_70px_80px] gap-0 px-4 py-1.5 border-b border-border bg-muted/20 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
        <span>Plan Name / Asset</span>
        <span className="text-center">Type</span>
        <span className="text-center">Discipline</span>
        <span className="text-center">Frequency</span>
        <span className="text-center">Duty</span>
        <span className="text-center">Hours</span>
        <span className="text-center">Actions</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          {groups.map(([groupKey, plans]) => (
            <GroupSection key={groupKey} groupKey={groupKey} plans={plans} expandedPlans={expandedPlans} togglePlan={togglePlan} groupBy={groupBy} onEdit={setEditingPlan} onDelete={handleDelete} onDuplicate={handleDuplicate} />
          ))}
          {groups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-2">
              <ListChecks className="w-10 h-10 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">No maintenance plans found</p>
              <Button variant="outline" size="sm" className="mt-2 gap-1 text-xs" onClick={() => setShowCreate(true)}>
                <Plus className="w-3 h-3" /> Create Maintenance Plan
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <CreatePlanDialog open={showCreate} onOpenChange={setShowCreate} onCreatePM={upsertPM} />
      {editingPlan && (
        <EditPlanDialog open={!!editingPlan} onOpenChange={(v) => { if (!v) setEditingPlan(null); }} plannerItem={editingPlan} rawPM={getRawPM(editingPlan)} onSave={upsertPM} />
      )}
    </div>
  );
}

/* ─── Group Section ─── */
function GroupSection({ groupKey, plans, expandedPlans, togglePlan, groupBy, onEdit, onDelete, onDuplicate }: {
  groupKey: string; plans: PlannerItem[]; expandedPlans: Set<string>; togglePlan: (id: string) => void; groupBy: string;
  onEdit: (p: PlannerItem) => void; onDelete: (p: PlannerItem) => void; onDuplicate: (p: PlannerItem) => void;
}) {
  const [open, setOpen] = useState(true);
  const totalHrs = plans.reduce((s, p) => s + p.estimatedHours, 0);
  const Icon = groupBy === "frequency" ? Clock : groupBy === "discipline" ? Wrench : Settings2;

  return (
    <div>
      <div onClick={() => setOpen(!open)} className="flex items-center gap-2 px-4 py-2 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        <Icon className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-xs font-bold text-foreground">{groupKey}</span>
        <Badge variant="secondary" className="text-[9px] px-1.5 h-4">{plans.length}</Badge>
        <span className="text-[10px] text-muted-foreground ml-auto">{totalHrs.toFixed(0)} hrs total</span>
      </div>
      {open && plans.map(plan => (
        <PlanRow key={plan.id} plan={plan} expanded={expandedPlans.has(plan.id)} onToggle={() => togglePlan(plan.id)} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} />
      ))}
    </div>
  );
}

/* ─── Plan Row ─── */
function PlanRow({ plan, expanded, onToggle, onEdit, onDelete, onDuplicate }: {
  plan: PlannerItem; expanded: boolean; onToggle: () => void;
  onEdit: (p: PlannerItem) => void; onDelete: (p: PlannerItem) => void; onDuplicate: (p: PlannerItem) => void;
}) {
  const hasTasks = plan.tasks.length > 0;
  const hasMaterials = plan.materialList.length > 0 && plan.materialList.some(Boolean);
  const hasTools = plan.requiredTools.length > 0;
  const hasSafety = plan.safetyNotes.length > 0;
  const hasDetail = hasTasks || hasMaterials || hasTools || hasSafety;

  const planType = getPlanType(plan.planCategory || "Preventive");

  return (
    <div className={cn("border-b border-border/20", expanded && "bg-primary/5")}>
      <div className={cn("grid grid-cols-[1fr_80px_100px_90px_80px_70px_80px] gap-0 items-center px-4 py-2 transition-colors", hasDetail ? "cursor-pointer hover:bg-muted/20" : "")}>
        <div className="flex items-center gap-2 min-w-0" onClick={hasDetail ? onToggle : undefined}>
          {hasDetail ? (expanded ? <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />) : <span className="w-3 flex-shrink-0" />}
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-foreground truncate">{plan.taskName}</div>
            <div className="text-[10px] text-muted-foreground font-mono">{plan.assetNumber}</div>
          </div>
        </div>
        <div className="text-center">
          <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0", planType === "Inspection" ? "border-primary/40 text-primary" : "border-purple-500/40 text-purple-600")}>
            {planType === "Inspection" ? "INS" : "MNT"}
          </Badge>
        </div>
        <div className="text-center text-[10px] text-muted-foreground">{plan.discipline || "—"}</div>
        <div className="text-center"><Badge variant="outline" className="text-[9px] px-1.5 py-0">{plan.frequency || "—"}</Badge></div>
        <div className="text-center"><Badge variant="outline" className="text-[9px] px-1.5 py-0">{plan.dutyType || "—"}</Badge></div>
        <div className="text-center text-[11px] font-medium text-foreground tabular-nums">{plan.estimatedHours > 0 ? `${plan.estimatedHours}h` : "—"}</div>
        <div className="flex items-center justify-center gap-0.5">
          <button onClick={(e) => { e.stopPropagation(); onEdit(plan); }} className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Edit Plan"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(plan); }} className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(plan); }} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {expanded && hasDetail && (
        <div className="px-8 pb-3 space-y-2">
          {hasTasks && (
            <DetailBlock icon={ListChecks} title="Task List" count={plan.tasks.length}>
              {(() => {
                const sections = new Map<string, any[]>();
                for (const task of plan.tasks) {
                  const sec = task.section || "";
                  if (!sections.has(sec)) sections.set(sec, []);
                  sections.get(sec)!.push(task);
                }
                let globalIdx = 0;
                return Array.from(sections.entries()).map(([secName, tasks]) => (
                  <div key={secName || "default"} className="space-y-0.5">
                    {secName && sections.size > 1 && <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide mt-1 first:mt-0">{secName}</div>}
                    {tasks.map((task: any) => {
                      globalIdx++;
                      return (
                        <div key={globalIdx} className="flex items-start gap-2 text-[10px]">
                          <span className="text-muted-foreground font-mono w-4 shrink-0">{globalIdx}.</span>
                          <span className="text-foreground">{typeof task === "string" ? task : task.description || task.task || JSON.stringify(task)}</span>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </DetailBlock>
          )}
          {hasMaterials && (
            <DetailBlock icon={Package} title="Materials" count={plan.materialList.filter(Boolean).length}>
              <div className="flex flex-wrap gap-1">{plan.materialList.filter(Boolean).map((m, i) => <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0 font-normal">{m}</Badge>)}</div>
            </DetailBlock>
          )}
          {hasTools && (
            <DetailBlock icon={Wrench} title="Required Tools" count={plan.requiredTools.length}>
              <div className="flex flex-wrap gap-1">{plan.requiredTools.map((t, i) => <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">{t}</Badge>)}</div>
            </DetailBlock>
          )}
          {hasSafety && (
            <DetailBlock icon={ShieldAlert} title="Safety Notes" count={plan.safetyNotes.length}>
              {plan.safetyNotes.map((n, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[10px]"><AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" /><span className="text-foreground">{n}</span></div>
              ))}
            </DetailBlock>
          )}
          <div className="flex justify-end pt-1">
            <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => onEdit(plan)}><Pencil className="w-3 h-3" /> Edit Full Plan</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailBlock({ icon: Icon, title, count, children }: { icon: React.ElementType; title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-md p-2.5">
      <div className="flex items-center gap-1.5 mb-1.5 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider"><Icon className="w-3 h-3" /> {title} ({count})</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/* ─── Editable List Component ─── */
function EditableList({ items, onChange, placeholder }: { items: string[]; onChange: (items: string[]) => void; placeholder: string }) {
  const [newItem, setNewItem] = useState("");
  const addItem = () => { const t = newItem.trim(); if (!t) return; onChange([...items, t]); setNewItem(""); };

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5 group">
          <span className="text-[9px] text-muted-foreground font-mono w-4 shrink-0">{i + 1}.</span>
          <Input value={item} onChange={(e) => { const next = [...items]; next[i] = e.target.value; onChange(next); }} className="h-7 text-xs flex-1" />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"><X className="w-3 h-3" /></button>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} placeholder={placeholder} className="h-7 text-xs flex-1" />
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={addItem}><Plus className="w-3 h-3" /></Button>
      </div>
    </div>
  );
}

function rebuildTaskSections(tasks: any[]): any {
  const hasSections = tasks.some(t => t.section);
  if (!hasSections) {
    return { sections: [{ equipmentName: "", tasks: tasks.map(t => { if (typeof t === "string") return { task: t }; const { section, ...rest } = t; return { task: rest.task || rest.description || "", ...rest }; }) }] };
  }
  const sectionMap = new Map<string, any[]>();
  for (const t of tasks) { const sec = t.section || ""; if (!sectionMap.has(sec)) sectionMap.set(sec, []); const { section, ...rest } = t; sectionMap.get(sec)!.push(rest); }
  return { sections: Array.from(sectionMap.entries()).map(([name, items]) => ({ equipmentName: name, tasks: items })) };
}

/* ─── Editable Task List ─── */
function EditableTaskList({ tasks, onChange }: { tasks: any[]; onChange: (tasks: any[]) => void }) {
  const [newDesc, setNewDesc] = useState("");
  const addTask = () => { const t = newDesc.trim(); if (!t) return; onChange([...tasks, { description: t, category: "General" }]); setNewDesc(""); };

  return (
    <div className="space-y-1.5">
      {tasks.map((task, i) => {
        const desc = typeof task === "string" ? task : task.description || task.task || "";
        return (
          <div key={i} className="flex items-start gap-1.5 group">
            <span className="text-[9px] text-muted-foreground font-mono w-4 shrink-0 mt-2">{i + 1}.</span>
            <Input value={desc} onChange={(e) => { const next = [...tasks]; if (typeof task === "string") next[i] = e.target.value; else next[i] = { ...task, description: e.target.value }; onChange(next); }} className="h-7 text-xs flex-1" />
            <button onClick={() => onChange(tasks.filter((_, idx) => idx !== i))} className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all mt-1"><X className="w-3 h-3" /></button>
          </div>
        );
      })}
      <div className="flex items-center gap-1.5">
        <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Add a task step..." className="h-7 text-xs flex-1" />
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={addTask}><Plus className="w-3 h-3" /></Button>
      </div>
    </div>
  );
}

/* ─── Materials Table Editor ─── */
function MaterialsEditor({ materials, onChange }: { materials: any[]; onChange: (m: any[]) => void }) {
  const addRow = () => onChange([...materials, { partNumber: "", description: "", qty: 1, stockCode: "" }]);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[100px_1fr_60px_100px_30px] gap-1.5 text-[9px] font-semibold text-muted-foreground uppercase">
        <span>Part Number</span><span>Description</span><span>Qty</span><span>Stock Code</span><span />
      </div>
      {materials.map((m, i) => (
        <div key={i} className="grid grid-cols-[100px_1fr_60px_100px_30px] gap-1.5 group">
          <Input value={m.partNumber} onChange={e => { const n = [...materials]; n[i] = { ...m, partNumber: e.target.value }; onChange(n); }} className="h-7 text-xs" placeholder="P/N" />
          <Input value={m.description} onChange={e => { const n = [...materials]; n[i] = { ...m, description: e.target.value }; onChange(n); }} className="h-7 text-xs" placeholder="Description" />
          <Input type="number" value={m.qty} onChange={e => { const n = [...materials]; n[i] = { ...m, qty: parseInt(e.target.value) || 1 }; onChange(n); }} className="h-7 text-xs" />
          <Input value={m.stockCode} onChange={e => { const n = [...materials]; n[i] = { ...m, stockCode: e.target.value }; onChange(n); }} className="h-7 text-xs" placeholder="Stock Code" />
          <button onClick={() => onChange(materials.filter((_, idx) => idx !== i))} className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addRow}><Plus className="w-3 h-3" /> Add Part</Button>
    </div>
  );
}

/* ─── Measurements Table Editor ─── */
function MeasurementsEditor({ measurements, onChange }: { measurements: any[]; onChange: (m: any[]) => void }) {
  const addRow = () => onChange([...measurements, { parameter: "", unit: "", min: "", max: "" }]);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_80px_80px_80px_30px] gap-1.5 text-[9px] font-semibold text-muted-foreground uppercase">
        <span>Parameter</span><span>Unit</span><span>Min</span><span>Max</span><span />
      </div>
      {measurements.map((m, i) => (
        <div key={i} className="grid grid-cols-[1fr_80px_80px_80px_30px] gap-1.5 group">
          <Input value={m.parameter} onChange={e => { const n = [...measurements]; n[i] = { ...m, parameter: e.target.value }; onChange(n); }} className="h-7 text-xs" placeholder="e.g. Vibration" />
          <Input value={m.unit} onChange={e => { const n = [...measurements]; n[i] = { ...m, unit: e.target.value }; onChange(n); }} className="h-7 text-xs" placeholder="mm/s" />
          <Input value={m.min} onChange={e => { const n = [...measurements]; n[i] = { ...m, min: e.target.value }; onChange(n); }} className="h-7 text-xs" placeholder="Min" />
          <Input value={m.max} onChange={e => { const n = [...measurements]; n[i] = { ...m, max: e.target.value }; onChange(n); }} className="h-7 text-xs" placeholder="Max" />
          <button onClick={() => onChange(measurements.filter((_, idx) => idx !== i))} className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addRow}><Plus className="w-3 h-3" /> Add Measurement</Button>
    </div>
  );
}

/* ─── Documents Table Editor ─── */
function DocumentsEditor({ documents, onChange }: { documents: any[]; onChange: (d: any[]) => void }) {
  const addRow = () => onChange([...documents, { title: "", type: "OEM Manual", reference: "" }]);
  const DOC_TYPES = ["OEM Manual", "SOP", "SWMS", "Drawing", "Datasheet", "Procedure", "Other"];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_120px_1fr_30px] gap-1.5 text-[9px] font-semibold text-muted-foreground uppercase">
        <span>Title</span><span>Type</span><span>Reference / Link</span><span />
      </div>
      {documents.map((d, i) => (
        <div key={i} className="grid grid-cols-[1fr_120px_1fr_30px] gap-1.5 group">
          <Input value={d.title} onChange={e => { const n = [...documents]; n[i] = { ...d, title: e.target.value }; onChange(n); }} className="h-7 text-xs" placeholder="Document title" />
          <Select value={d.type} onValueChange={v => { const n = [...documents]; n[i] = { ...d, type: v }; onChange(n); }}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Input value={d.reference} onChange={e => { const n = [...documents]; n[i] = { ...d, reference: e.target.value }; onChange(n); }} className="h-7 text-xs" placeholder="Reference or URL" />
          <button onClick={() => onChange(documents.filter((_, idx) => idx !== i))} className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addRow}><Plus className="w-3 h-3" /> Add Document</Button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
/* ─── Create Plan Dialog (Enhanced with Asset Search)    ─── */
/* ════════════════════════════════════════════════════════════ */
function CreatePlanDialog({ open, onOpenChange, onCreatePM }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  onCreatePM: (data: any) => Promise<any>;
}) {
  const [multiMode, setMultiMode] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const defaultForm = () => ({
    pmName: "", equipmentType: "", frequency: "Monthly", discipline: "Mechanical",
    assetNumber: "", purpose: "", estimatedDuration: "1", dutyType: "Online", skillLevel: "Competent",
    planCategory: "Preventive" as string, workCentre: "MECH",
    status: "Active", isolationRequirements: "", lubricationNotes: "", oemReferences: "", resources: "",
    tasks: [] as { step: number; description: string; section: string }[],
    requiredTools: [] as string[], requiredPPE: [] as string[], safetyNotes: [] as string[],
    acceptableCriteria: [] as string[], signsOfFailure: [] as string[], inspectionPoints: [] as any[],
    crewSize: 1, tradeHours: {} as Record<string, number>,
    materials: [] as { partNumber: string; description: string; qty: number; stockCode: string }[],
    permitRequirements: { loto_required: false, confined_space: false, hot_work: false, working_at_heights: false, isolation_required: false, permit_type: "None", environmental_hazards: "", stored_energy_hazards: "" },
    measurements: [] as { parameter: string; unit: string; min: string; max: string; target: string }[],
    documents: [] as { title: string; type: string; reference: string; url: string }[],
  });
  const [form, setForm] = useState(defaultForm);
  const [creating, setCreating] = useState(false);

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));
  const updatePermit = (key: string, value: any) => setForm(f => ({ ...f, permitRequirements: { ...f.permitRequirements, [key]: value } }));

  const handleSubmit = async () => {
    if (!form.pmName.trim()) { toast.error("Plan name is required"); return; }
    const assets = multiMode ? selectedAssets : (form.assetNumber ? [form.assetNumber] : [""]);
    if (assets.length === 0) { toast.error("Select at least one asset"); return; }

    setCreating(true);
    try {
      for (const asset of assets) {
        await onCreatePM({ ...form, assetNumber: asset, id: crypto.randomUUID() });
      }
      toast.success(assets.length > 1 ? `${assets.length} maintenance plans created` : "Maintenance plan created");
      onOpenChange(false);
      setForm(defaultForm());
      setSelectedAssets([]);
    } catch { toast.error("Failed to create plan"); }
    finally { setCreating(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader><DialogTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Create Maintenance Plan</DialogTitle></DialogHeader>

        <Tabs defaultValue="details" className="flex-1 min-h-0 flex flex-col">
          <TabsList className="w-full justify-start h-8 bg-muted/30 shrink-0 overflow-x-auto">
            <TabsTrigger value="details" className="text-[10px] h-6 px-2.5">Details</TabsTrigger>
            <TabsTrigger value="tasks" className="text-[10px] h-6 px-2.5">Tasks ({form.tasks.length})</TabsTrigger>
            <TabsTrigger value="resources" className="text-[10px] h-6 px-2.5">Resources</TabsTrigger>
            <TabsTrigger value="materials" className="text-[10px] h-6 px-2.5">Materials ({form.materials.length})</TabsTrigger>
            <TabsTrigger value="tools" className="text-[10px] h-6 px-2.5">Tools & PPE ({form.requiredTools.length + form.requiredPPE.length})</TabsTrigger>
            <TabsTrigger value="safety" className="text-[10px] h-6 px-2.5">Safety & Permits</TabsTrigger>
            <TabsTrigger value="criteria" className="text-[10px] h-6 px-2.5">Criteria ({form.acceptableCriteria.length + form.signsOfFailure.length})</TabsTrigger>
            <TabsTrigger value="measurements" className="text-[10px] h-6 px-2.5">Measurements ({form.measurements.length})</TabsTrigger>
            <TabsTrigger value="documents" className="text-[10px] h-6 px-2.5">Documents ({form.documents.length})</TabsTrigger>
          </TabsList>

          {/* ── Details Tab ── */}
          <TabsContent value="details" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
            <div>
              <Label className="text-xs">Plan Name *</Label>
              <Input value={form.pmName} onChange={e => update("pmName", e.target.value)} placeholder="e.g. Ball Mill Monthly Inspection" className="text-xs h-8" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs">{multiMode ? "Assets (Multi-Select)" : "Asset"}</Label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground">Multi-asset</span>
                  <Switch checked={multiMode} onCheckedChange={setMultiMode} className="h-4 w-7" />
                </div>
              </div>
              {multiMode ? (
                <AssetMultiSelect selected={selectedAssets} onChange={setSelectedAssets} />
              ) : (
                <AssetSearchSelect value={form.assetNumber} onChange={v => update("assetNumber", v)} />
              )}
              {multiMode && selectedAssets.length > 0 && (
                <p className="text-[9px] text-muted-foreground mt-1">Will create {selectedAssets.length} identical plans — one per asset</p>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={form.planCategory} onValueChange={v => update("planCategory", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{PLAN_CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_CONFIG[c].label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Frequency</Label>
                <Select value={form.frequency} onValueChange={v => update("frequency", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Discipline</Label>
                <Select value={form.discipline} onValueChange={v => update("discipline", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{DISCIPLINES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Duty Type</Label>
                <Select value={form.dutyType} onValueChange={v => update("dutyType", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{DUTY_TYPES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Equipment Type</Label>
                <Input value={form.equipmentType} onChange={e => update("equipmentType", e.target.value)} placeholder="e.g. Ball Mill" className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Est. Duration (hrs)</Label>
                <Input type="number" value={form.estimatedDuration} onChange={e => update("estimatedDuration", e.target.value)} className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Skill Level</Label>
                <Select value={form.skillLevel} onValueChange={v => update("skillLevel", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{SKILL_LEVELS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Purpose</Label>
                <Textarea value={form.purpose} onChange={e => update("purpose", e.target.value)} placeholder="Describe the purpose..." className="text-xs min-h-[60px]" />
              </div>
              <div>
                <Label className="text-xs">OEM References</Label>
                <Input value={form.oemReferences} onChange={e => update("oemReferences", e.target.value)} className="text-xs h-8 mb-2" />
                <Label className="text-xs">Lubrication Notes</Label>
                <Textarea value={form.lubricationNotes} onChange={e => update("lubricationNotes", e.target.value)} className="text-xs min-h-[40px]" />
              </div>
            </div>
          </TabsContent>

          {/* ── Tasks Tab ── */}
          <TabsContent value="tasks" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
            <EditableTaskList tasks={form.tasks} onChange={t => update("tasks", t)} />
          </TabsContent>

          {/* ── Resources Tab ── */}
          <TabsContent value="resources" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Work Centre</Label>
                <Select value={form.workCentre} onValueChange={v => update("workCentre", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{WORK_CENTRES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Crew Size</Label>
                <Input type="number" min={1} value={form.crewSize} onChange={e => update("crewSize", parseInt(e.target.value) || 1)} className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Resources / Notes</Label>
                <Input value={form.resources} onChange={e => update("resources", e.target.value)} className="text-xs h-8" placeholder="e.g. Crane required" />
              </div>
            </div>
            <div>
              <Label className="text-xs mb-2 block">Trade Hours Breakdown</Label>
              <div className="grid grid-cols-4 gap-3">
                {["Mechanical", "Electrical", "Boilermaker", "Rigger"].map(trade => (
                  <div key={trade}>
                    <Label className="text-[9px] text-muted-foreground">{trade}</Label>
                    <Input
                      type="number" min={0} step={0.5}
                      value={form.tradeHours[trade] || ""}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        const next = { ...form.tradeHours };
                        if (isNaN(val) || val === 0) delete next[trade]; else next[trade] = val;
                        update("tradeHours", next);
                      }}
                      className="text-xs h-7" placeholder="hrs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── Materials Tab ── */}
          <TabsContent value="materials" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
            <p className="text-[10px] text-muted-foreground mb-3">Spare parts and consumables required for this maintenance plan.</p>
            <MaterialsEditor materials={form.materials} onChange={m => update("materials", m)} />
          </TabsContent>

          {/* ── Tools & PPE Tab ── */}
          <TabsContent value="tools" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div>
              <Label className="text-xs mb-1.5 block">Required Tools</Label>
              <EditableList items={form.requiredTools} onChange={t => update("requiredTools", t)} placeholder="Add a tool..." />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Required PPE</Label>
              <EditableList items={form.requiredPPE} onChange={p => update("requiredPPE", p)} placeholder="Add PPE item..." />
            </div>
          </TabsContent>

          {/* ── Safety & Permits Tab ── */}
          <TabsContent value="safety" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Permit Type</Label>
                <Select value={form.permitRequirements.permit_type} onValueChange={v => updatePermit("permit_type", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{PERMIT_TYPES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Isolation Requirements</Label>
                <Textarea value={form.isolationRequirements} onChange={e => update("isolationRequirements", e.target.value)} className="text-xs min-h-[60px]" placeholder="Describe isolations needed..." />
              </div>
              <div>
                <Label className="text-xs">Stored Energy Hazards</Label>
                <Textarea value={form.permitRequirements.stored_energy_hazards} onChange={e => updatePermit("stored_energy_hazards", e.target.value)} className="text-xs min-h-[60px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-muted/20 rounded-lg p-4">
              <span className="text-xs font-semibold text-foreground col-span-2 mb-1">Hazard Flags</span>
              {[
                { key: "loto_required", label: "LOTO Required", icon: Lock },
                { key: "isolation_required", label: "Isolation Required", icon: ShieldAlert },
                { key: "confined_space", label: "Confined Space", icon: AlertTriangle },
                { key: "hot_work", label: "Hot Work", icon: Flame },
                { key: "working_at_heights", label: "Working at Heights", icon: Mountain },
              ].map(({ key, label, icon: HIcon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs">{label}</span>
                  </div>
                  <Switch checked={form.permitRequirements[key as keyof typeof form.permitRequirements] as boolean} onCheckedChange={v => updatePermit(key, v)} className="h-4 w-7" />
                </div>
              ))}
            </div>
            <div>
              <Label className="text-xs">Environmental Hazards</Label>
              <Textarea value={form.permitRequirements.environmental_hazards} onChange={e => updatePermit("environmental_hazards", e.target.value)} className="text-xs min-h-[50px]" placeholder="e.g. Cyanide, acid, high pressure..." />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Safety Notes</Label>
              <EditableList items={form.safetyNotes} onChange={n => update("safetyNotes", n)} placeholder="Add safety note..." />
            </div>
          </TabsContent>

          {/* ── Criteria Tab ── */}
          <TabsContent value="criteria" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div>
              <Label className="text-xs mb-1.5 block">Acceptable Criteria</Label>
              <EditableList items={form.acceptableCriteria} onChange={c => update("acceptableCriteria", c)} placeholder="Add acceptance criteria..." />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Signs of Failure</Label>
              <EditableList items={form.signsOfFailure} onChange={s => update("signsOfFailure", s)} placeholder="Add failure indicator..." />
            </div>
          </TabsContent>

          {/* ── Measurements Tab ── */}
          <TabsContent value="measurements" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
            <p className="text-[10px] text-muted-foreground mb-3">Condition data points to capture during execution.</p>
            <MeasurementsEditor measurements={form.measurements} onChange={m => update("measurements", m)} />
          </TabsContent>

          {/* ── Documents Tab ── */}
          <TabsContent value="documents" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
            <p className="text-[10px] text-muted-foreground mb-3">Linked OEM manuals, SOPs, SWMS, drawings, and procedures.</p>
            <DocumentsEditor documents={form.documents} onChange={d => update("documents", d)} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t border-border pt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={creating} className="gap-1">
            <Save className="w-3.5 h-3.5" /> {creating ? "Creating..." : multiMode && selectedAssets.length > 1 ? `Create ${selectedAssets.length} Plans` : "Create Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════════════════════════ */
/* ─── Edit Plan Dialog (9 Comprehensive Tabs)            ─── */
/* ════════════════════════════════════════════════════════════ */
function EditPlanDialog({ open, onOpenChange, plannerItem, rawPM, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  plannerItem: PlannerItem; rawPM: any | undefined;
  onSave: (data: any) => Promise<any>;
}) {
  const pmId = rawPM?.id || plannerItem.sourceId || plannerItem.id;

  const [form, setForm] = useState(() => ({
    pmName: rawPM?.pmName || plannerItem.taskName,
    equipmentType: rawPM?.equipmentType || "",
    frequency: rawPM?.frequency || plannerItem.frequency || "Monthly",
    discipline: rawPM?.discipline || plannerItem.discipline || "Mechanical",
    assetNumber: rawPM?.assetNumber || plannerItem.assetNumber || "",
    purpose: rawPM?.purpose || "",
    estimatedDuration: rawPM?.estimatedDuration || String(plannerItem.estimatedHours) || "1",
    dutyType: rawPM?.dutyType || plannerItem.dutyType || "Online",
    skillLevel: rawPM?.skillLevel || "Competent",
    status: rawPM?.status || plannerItem.status || "Draft",
    isolationRequirements: rawPM?.isolationRequirements || "",
    lubricationNotes: rawPM?.lubricationNotes || "",
    oemReferences: rawPM?.oemReferences || "",
    resources: rawPM?.resources || "",
    tasks: flattenPMTasks(rawPM?.tasks || plannerItem.tasks || []),
    requiredTools: rawPM?.requiredTools || plannerItem.requiredTools || [],
    requiredPPE: rawPM?.requiredPPE || [],
    safetyNotes: rawPM?.safetyNotes || plannerItem.safetyNotes || [],
    acceptableCriteria: rawPM?.acceptableCriteria || [],
    signsOfFailure: rawPM?.signsOfFailure || [],
    inspectionPoints: rawPM?.inspectionPoints || [],
    planCategory: rawPM?.planCategory || plannerItem.planCategory || "Preventive",
    // New fields
    workCentre: rawPM?.workCentre || "MECH",
    crewSize: rawPM?.crewSize || 1,
    tradeHours: rawPM?.tradeHours || {},
    materials: rawPM?.materials || [],
    permitRequirements: rawPM?.permitRequirements || { loto_required: false, confined_space: false, hot_work: false, working_at_heights: false, isolation_required: false, permit_type: "None", environmental_hazards: "", stored_energy_hazards: "" },
    measurements: rawPM?.measurements || [],
    documents: rawPM?.documents || [],
  }));

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.pmName.trim()) { toast.error("Plan name is required"); return; }
    setSaving(true);
    try {
      const tasksForDb = rebuildTaskSections(form.tasks);
      await onSave({ id: pmId, ...form, tasks: tasksForDb });
      toast.success("Plan updated successfully");
      onOpenChange(false);
    } catch { toast.error("Failed to update plan"); }
    finally { setSaving(false); }
  };

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));
  const updatePermit = (key: string, value: any) => setForm(f => ({ ...f, permitRequirements: { ...f.permitRequirements, [key]: value } }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Pencil className="w-4 h-4 text-primary" /> Edit Maintenance Plan
            <Badge variant="outline" className="text-[9px] ml-2">{pmId.slice(0, 8)}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 min-h-0 flex flex-col">
          <TabsList className="w-full justify-start h-8 bg-muted/30 shrink-0 overflow-x-auto">
            <TabsTrigger value="details" className="text-[10px] h-6 px-2.5">Details</TabsTrigger>
            <TabsTrigger value="tasks" className="text-[10px] h-6 px-2.5">Tasks ({form.tasks.length})</TabsTrigger>
            <TabsTrigger value="resources" className="text-[10px] h-6 px-2.5">Resources</TabsTrigger>
            <TabsTrigger value="materials" className="text-[10px] h-6 px-2.5">Materials ({form.materials.length})</TabsTrigger>
            <TabsTrigger value="tools" className="text-[10px] h-6 px-2.5">Tools & PPE ({form.requiredTools.length + form.requiredPPE.length})</TabsTrigger>
            <TabsTrigger value="safety" className="text-[10px] h-6 px-2.5">Safety & Permits</TabsTrigger>
            <TabsTrigger value="criteria" className="text-[10px] h-6 px-2.5">Criteria ({form.acceptableCriteria.length + form.signsOfFailure.length})</TabsTrigger>
            <TabsTrigger value="measurements" className="text-[10px] h-6 px-2.5">Measurements ({form.measurements.length})</TabsTrigger>
            <TabsTrigger value="documents" className="text-[10px] h-6 px-2.5">Documents ({form.documents.length})</TabsTrigger>
          </TabsList>

          {/* ── Details Tab ── */}
          <TabsContent value="details" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Plan Name *</Label>
                <Input value={form.pmName} onChange={e => update("pmName", e.target.value)} className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Asset</Label>
                <AssetSearchSelect value={form.assetNumber} onChange={v => update("assetNumber", v)} />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={form.planCategory} onValueChange={v => update("planCategory", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{PLAN_CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_CONFIG[c].label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Frequency</Label>
                <Select value={form.frequency} onValueChange={v => update("frequency", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Discipline</Label>
                <Select value={form.discipline} onValueChange={v => update("discipline", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{DISCIPLINES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Duty Type</Label>
                <Select value={form.dutyType} onValueChange={v => update("dutyType", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{DUTY_TYPES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => update("status", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{LIFECYCLE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Equipment Type</Label>
                <Input value={form.equipmentType} onChange={e => update("equipmentType", e.target.value)} className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Est. Duration (hrs)</Label>
                <Input type="number" value={form.estimatedDuration} onChange={e => update("estimatedDuration", e.target.value)} className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Skill Level</Label>
                <Select value={form.skillLevel} onValueChange={v => update("skillLevel", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{SKILL_LEVELS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Purpose</Label>
              <Textarea value={form.purpose} onChange={e => update("purpose", e.target.value)} placeholder="Describe the purpose..." className="text-xs min-h-[60px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">OEM References</Label>
                <Input value={form.oemReferences} onChange={e => update("oemReferences", e.target.value)} className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Lubrication Notes</Label>
                <Textarea value={form.lubricationNotes} onChange={e => update("lubricationNotes", e.target.value)} className="text-xs min-h-[50px]" />
              </div>
            </div>
          </TabsContent>

          {/* ── Tasks Tab ── */}
          <TabsContent value="tasks" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
            <EditableTaskList tasks={form.tasks} onChange={t => update("tasks", t)} />
          </TabsContent>

          {/* ── Resources Tab ── */}
          <TabsContent value="resources" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Work Centre</Label>
                <Select value={form.workCentre} onValueChange={v => update("workCentre", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{WORK_CENTRES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Crew Size</Label>
                <Input type="number" min={1} value={form.crewSize} onChange={e => update("crewSize", parseInt(e.target.value) || 1)} className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Resources / Notes</Label>
                <Input value={form.resources} onChange={e => update("resources", e.target.value)} className="text-xs h-8" placeholder="e.g. Crane required" />
              </div>
            </div>
            <div>
              <Label className="text-xs mb-2 block">Trade Hours Breakdown</Label>
              <div className="grid grid-cols-4 gap-3">
                {["Mechanical", "Electrical", "Boilermaker", "Rigger"].map(trade => (
                  <div key={trade}>
                    <Label className="text-[9px] text-muted-foreground">{trade}</Label>
                    <Input
                      type="number" min={0} step={0.5}
                      value={form.tradeHours[trade] || ""}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        const next = { ...form.tradeHours };
                        if (isNaN(val) || val === 0) delete next[trade]; else next[trade] = val;
                        update("tradeHours", next);
                      }}
                      className="text-xs h-7" placeholder="hrs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── Materials Tab ── */}
          <TabsContent value="materials" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
            <p className="text-[10px] text-muted-foreground mb-3">Spare parts and consumables required for this maintenance plan.</p>
            <MaterialsEditor materials={form.materials} onChange={m => update("materials", m)} />
          </TabsContent>

          {/* ── Tools & PPE Tab ── */}
          <TabsContent value="tools" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div>
              <Label className="text-xs mb-1.5 block">Required Tools</Label>
              <EditableList items={form.requiredTools} onChange={t => update("requiredTools", t)} placeholder="Add a tool..." />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Required PPE</Label>
              <EditableList items={form.requiredPPE} onChange={p => update("requiredPPE", p)} placeholder="Add PPE item..." />
            </div>
          </TabsContent>

          {/* ── Safety & Permits Tab ── */}
          <TabsContent value="safety" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Permit Type</Label>
                <Select value={form.permitRequirements.permit_type} onValueChange={v => updatePermit("permit_type", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{PERMIT_TYPES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Isolation Requirements</Label>
                <Textarea value={form.isolationRequirements} onChange={e => update("isolationRequirements", e.target.value)} className="text-xs min-h-[60px]" placeholder="Describe isolations needed..." />
              </div>
              <div>
                <Label className="text-xs">Stored Energy Hazards</Label>
                <Textarea value={form.permitRequirements.stored_energy_hazards} onChange={e => updatePermit("stored_energy_hazards", e.target.value)} className="text-xs min-h-[60px]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-muted/20 rounded-lg p-4">
              <span className="text-xs font-semibold text-foreground col-span-2 mb-1">Hazard Flags</span>
              {[
                { key: "loto_required", label: "LOTO Required", icon: Lock },
                { key: "isolation_required", label: "Isolation Required", icon: ShieldAlert },
                { key: "confined_space", label: "Confined Space", icon: AlertTriangle },
                { key: "hot_work", label: "Hot Work", icon: Flame },
                { key: "working_at_heights", label: "Working at Heights", icon: Mountain },
              ].map(({ key, label, icon: HIcon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs">{label}</span>
                  </div>
                  <Switch checked={form.permitRequirements[key as keyof typeof form.permitRequirements] as boolean} onCheckedChange={v => updatePermit(key, v)} className="h-4 w-7" />
                </div>
              ))}
            </div>

            <div>
              <Label className="text-xs">Environmental Hazards</Label>
              <Textarea value={form.permitRequirements.environmental_hazards} onChange={e => updatePermit("environmental_hazards", e.target.value)} className="text-xs min-h-[50px]" placeholder="e.g. Cyanide, acid, high pressure..." />
            </div>

            <div>
              <Label className="text-xs mb-1.5 block">Safety Notes</Label>
              <EditableList items={form.safetyNotes} onChange={n => update("safetyNotes", n)} placeholder="Add safety note..." />
            </div>
          </TabsContent>

          {/* ── Criteria Tab ── */}
          <TabsContent value="criteria" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div>
              <Label className="text-xs mb-1.5 block">Acceptable Criteria</Label>
              <EditableList items={form.acceptableCriteria} onChange={c => update("acceptableCriteria", c)} placeholder="Add acceptance criteria..." />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Signs of Failure</Label>
              <EditableList items={form.signsOfFailure} onChange={s => update("signsOfFailure", s)} placeholder="Add failure indicator..." />
            </div>
          </TabsContent>

          {/* ── Measurements Tab ── */}
          <TabsContent value="measurements" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
            <p className="text-[10px] text-muted-foreground mb-3">Condition data points to capture during execution. Readings will appear on the work order.</p>
            <MeasurementsEditor measurements={form.measurements} onChange={m => update("measurements", m)} />
          </TabsContent>

          {/* ── Documents Tab ── */}
          <TabsContent value="documents" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
            <p className="text-[10px] text-muted-foreground mb-3">Linked OEM manuals, SOPs, SWMS, drawings, and procedures for this maintenance plan.</p>
            <DocumentsEditor documents={form.documents} onChange={d => update("documents", d)} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t border-border pt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
            <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
