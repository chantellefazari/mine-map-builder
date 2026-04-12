import { useState, useMemo, useCallback } from "react";
import {
  Search, ChevronDown, ChevronRight, Plus, Clock, Wrench,
  ListChecks, Package, ShieldAlert, AlertTriangle, Settings2,
  Pencil, Trash2, X, Save, Copy, Activity, Power, RefreshCw, Zap,
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
import { usePMasterList } from "@/hooks/usePMData";
import { toast } from "sonner";
import { type PlannerItem, flattenPMTasks } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

const FREQUENCIES = ["Daily", "Weekly", "Fortnightly", "Monthly", "Quarterly", "6-Monthly", "Annually", "Shutdown"];
const DISCIPLINES = ["Mechanical", "Electrical", "Instrumentation", "Process", "General"];
const STATUSES = ["Draft", "Active", "Review", "Superseded"];
const DUTY_TYPES = ["Online", "Offline", "Shutdown", "Both"];
const SKILL_LEVELS = ["Basic", "Competent", "Advanced", "Specialist"];

export function PlannerMaintenancePlansTab({ items }: Props) {
  const { pms, upsertPM, deletePM } = usePMasterList();
  const [search, setSearch] = useState("");
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [groupBy, setGroupBy] = useState<"frequency" | "discipline" | "area">("frequency");
  const [showCreate, setShowCreate] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlannerItem | null>(null);

  const allPMs = useMemo(() => items, [items]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allPMs;
    const q = search.toLowerCase();
    return allPMs.filter(i =>
      i.taskName.toLowerCase().includes(q) ||
      i.assetNumber.toLowerCase().includes(q) ||
      i.frequency.toLowerCase().includes(q) ||
      i.discipline.toLowerCase().includes(q) ||
      i.area.toLowerCase().includes(q)
    );
  }, [allPMs, search]);

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

  // Find the raw PM data for editing
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
      await upsertPM({ ...rest, id: crypto.randomUUID(), pmName: `${rest.pmName} (Copy)`, status: "Draft" } as any);
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
              <SelectTrigger className="h-6 w-24 text-[10px]">
                <SelectValue />
              </SelectTrigger>
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
            <Input
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-7 w-52 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setShowCreate(true)}>
            <Plus className="w-3.5 h-3.5" /> New Plan
          </Button>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_100px_90px_80px_70px_60px_80px] gap-0 px-4 py-1.5 border-b border-border bg-muted/20 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
        <span>Plan Name / Asset</span>
        <span className="text-center">Discipline</span>
        <span className="text-center">Frequency</span>
        <span className="text-center">Duty</span>
        <span className="text-center">Hours</span>
        <span className="text-center">Status</span>
        <span className="text-center">Actions</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          {groups.map(([groupKey, plans]) => (
            <GroupSection
              key={groupKey}
              groupKey={groupKey}
              plans={plans}
              expandedPlans={expandedPlans}
              togglePlan={togglePlan}
              groupBy={groupBy}
              onEdit={setEditingPlan}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
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
        <EditPlanDialog
          open={!!editingPlan}
          onOpenChange={(v) => { if (!v) setEditingPlan(null); }}
          plannerItem={editingPlan}
          rawPM={getRawPM(editingPlan)}
          onSave={upsertPM}
        />
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
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
      >
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

  return (
    <div className={cn("border-b border-border/20", expanded && "bg-primary/5")}>
      <div className={cn(
        "grid grid-cols-[1fr_100px_90px_80px_70px_60px_80px] gap-0 items-center px-4 py-2 transition-colors",
        hasDetail ? "cursor-pointer hover:bg-muted/20" : ""
      )}>
        <div className="flex items-center gap-2 min-w-0" onClick={hasDetail ? onToggle : undefined}>
          {hasDetail ? (
            expanded
              ? <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          ) : (
            <span className="w-3 flex-shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-foreground truncate">{plan.taskName}</div>
            <div className="text-[10px] text-muted-foreground font-mono">{plan.assetNumber}</div>
          </div>
        </div>
        <div className="text-center text-[10px] text-muted-foreground">{plan.discipline || "—"}</div>
        <div className="text-center">
          <Badge variant="outline" className="text-[9px] px-1.5 py-0">{plan.frequency || "—"}</Badge>
        </div>
        <div className="text-center">
          <Badge variant="outline" className="text-[9px] px-1.5 py-0">{plan.dutyType || "—"}</Badge>
        </div>
        <div className="text-center text-[11px] font-medium text-foreground tabular-nums">{plan.estimatedHours > 0 ? `${plan.estimatedHours}h` : "—"}</div>
        <div className="text-center">
          <span className={cn("text-[9px] font-medium", plan.status === "Active" ? "text-emerald-600" : plan.status === "Draft" ? "text-muted-foreground" : "text-foreground")}>{plan.status}</span>
        </div>
        <div className="flex items-center justify-center gap-0.5">
          <button onClick={(e) => { e.stopPropagation(); onEdit(plan); }} className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Edit Plan">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(plan); }} className="p-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-600 transition-colors" title="Duplicate">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(plan); }} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && hasDetail && (
        <div className="px-8 pb-3 space-y-2">
          {hasTasks && (
            <DetailBlock icon={ListChecks} title="Task List" count={plan.tasks.length}>
              {(() => {
                // Group tasks by section if they have one
                const sections = new Map<string, any[]>();
                for (const task of plan.tasks) {
                  const sec = task.section || "";
                  if (!sections.has(sec)) sections.set(sec, []);
                  sections.get(sec)!.push(task);
                }
                let globalIdx = 0;
                return Array.from(sections.entries()).map(([secName, tasks]) => (
                  <div key={secName || "default"} className="space-y-0.5">
                    {secName && sections.size > 1 && (
                      <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide mt-1 first:mt-0">{secName}</div>
                    )}
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
              <div className="flex flex-wrap gap-1">
                {plan.materialList.filter(Boolean).map((m, i) => (
                  <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0 font-normal">{m}</Badge>
                ))}
              </div>
            </DetailBlock>
          )}
          {hasTools && (
            <DetailBlock icon={Wrench} title="Required Tools" count={plan.requiredTools.length}>
              <div className="flex flex-wrap gap-1">
                {plan.requiredTools.map((t, i) => (
                  <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">{t}</Badge>
                ))}
              </div>
            </DetailBlock>
          )}
          {hasSafety && (
            <DetailBlock icon={ShieldAlert} title="Safety Notes" count={plan.safetyNotes.length}>
              {plan.safetyNotes.map((n, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[10px]">
                  <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{n}</span>
                </div>
              ))}
            </DetailBlock>
          )}
          <div className="flex justify-end pt-1">
            <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => onEdit(plan)}>
              <Pencil className="w-3 h-3" /> Edit Full Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailBlock({ icon: Icon, title, count, children }: { icon: React.ElementType; title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-md p-2.5">
      <div className="flex items-center gap-1.5 mb-1.5 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {title} ({count})
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/* ─── Editable List Component ─── */
function EditableList({ items, onChange, placeholder }: { items: string[]; onChange: (items: string[]) => void; placeholder: string }) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setNewItem("");
  };

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5 group">
          <span className="text-[9px] text-muted-foreground font-mono w-4 shrink-0">{i + 1}.</span>
          <Input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="h-7 text-xs flex-1"
          />
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder={placeholder}
          className="h-7 text-xs flex-1"
        />
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={addItem}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

/** Rebuild flattened tasks back into {sections: [...]} format for DB storage */
function rebuildTaskSections(tasks: any[]): any {
  const hasSections = tasks.some(t => t.section);
  if (!hasSections) {
    return {
      sections: [{
        equipmentName: "",
        tasks: tasks.map(t => {
          if (typeof t === "string") return { task: t };
          const { section, ...rest } = t;
          return { task: rest.task || rest.description || "", ...rest };
        }),
      }],
    };
  }
  const sectionMap = new Map<string, any[]>();
  for (const t of tasks) {
    const sec = t.section || "";
    if (!sectionMap.has(sec)) sectionMap.set(sec, []);
    const { section, ...rest } = t;
    sectionMap.get(sec)!.push(rest);
  }
  return {
    sections: Array.from(sectionMap.entries()).map(([name, items]) => ({
      equipmentName: name,
      tasks: items,
    })),
  };
}

/* ─── Editable Task List ─── */
function EditableTaskList({ tasks, onChange }: { tasks: any[]; onChange: (tasks: any[]) => void }) {
  const [newDesc, setNewDesc] = useState("");

  const addTask = () => {
    const trimmed = newDesc.trim();
    if (!trimmed) return;
    onChange([...tasks, { description: trimmed, category: "General" }]);
    setNewDesc("");
  };

  return (
    <div className="space-y-1.5">
      {tasks.map((task, i) => {
        const desc = typeof task === "string" ? task : task.description || task.task || "";
        return (
          <div key={i} className="flex items-start gap-1.5 group">
            <span className="text-[9px] text-muted-foreground font-mono w-4 shrink-0 mt-2">{i + 1}.</span>
            <Input
              value={desc}
              onChange={(e) => {
                const next = [...tasks];
                if (typeof task === "string") {
                  next[i] = e.target.value;
                } else {
                  next[i] = { ...task, description: e.target.value };
                }
                onChange(next);
              }}
              className="h-7 text-xs flex-1"
            />
            <button
              onClick={() => onChange(tasks.filter((_, idx) => idx !== i))}
              className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all mt-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
      <div className="flex items-center gap-1.5">
        <Input
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task step..."
          className="h-7 text-xs flex-1"
        />
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={addTask}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

/* ─── Edit Plan Dialog ─── */
function EditPlanDialog({ open, onOpenChange, plannerItem, rawPM, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  plannerItem: PlannerItem;
  rawPM: any | undefined;
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
  }));

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.pmName.trim()) {
      toast.error("Plan name is required");
      return;
    }
    setSaving(true);
    try {
      // Rebuild sections format for DB storage so print templates render correctly
      const tasksForDb = rebuildTaskSections(form.tasks);
      await onSave({ id: pmId, ...form, tasks: tasksForDb });
      toast.success("Plan updated successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update plan");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Pencil className="w-4 h-4 text-primary" />
            Edit Maintenance Plan
            <Badge variant="outline" className="text-[9px] ml-2">{pmId.slice(0, 8)}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 min-h-0 flex flex-col">
          <TabsList className="w-full justify-start h-8 bg-muted/30 shrink-0">
            <TabsTrigger value="details" className="text-[10px] h-6 px-3">Details</TabsTrigger>
            <TabsTrigger value="tasks" className="text-[10px] h-6 px-3">Tasks ({form.tasks.length})</TabsTrigger>
            <TabsTrigger value="tools" className="text-[10px] h-6 px-3">Tools & PPE ({form.requiredTools.length + form.requiredPPE.length})</TabsTrigger>
            <TabsTrigger value="safety" className="text-[10px] h-6 px-3">Safety ({form.safetyNotes.length})</TabsTrigger>
            <TabsTrigger value="criteria" className="text-[10px] h-6 px-3">Criteria ({form.acceptableCriteria.length + form.signsOfFailure.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Plan Name *</Label>
                    <Input value={form.pmName} onChange={e => update("pmName", e.target.value)} className="text-xs h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Asset Number</Label>
                    <Input value={form.assetNumber} onChange={e => update("assetNumber", e.target.value)} className="text-xs h-8" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs">Frequency</Label>
                    <Select value={form.frequency} onValueChange={v => update("frequency", v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Discipline</Label>
                    <Select value={form.discipline} onValueChange={v => update("discipline", v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DISCIPLINES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Duty Type</Label>
                    <Select value={form.dutyType} onValueChange={v => update("dutyType", v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DUTY_TYPES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Status</Label>
                    <Select value={form.status} onValueChange={v => update("status", v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
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
                      <SelectContent>
                        {SKILL_LEVELS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Purpose</Label>
                  <Textarea value={form.purpose} onChange={e => update("purpose", e.target.value)} placeholder="Describe the purpose..." className="text-xs min-h-[60px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Isolation Requirements</Label>
                    <Textarea value={form.isolationRequirements} onChange={e => update("isolationRequirements", e.target.value)} className="text-xs min-h-[50px]" />
                  </div>
                  <div>
                    <Label className="text-xs">Lubrication Notes</Label>
                    <Textarea value={form.lubricationNotes} onChange={e => update("lubricationNotes", e.target.value)} className="text-xs min-h-[50px]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">OEM References</Label>
                    <Input value={form.oemReferences} onChange={e => update("oemReferences", e.target.value)} className="text-xs h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Resources</Label>
                    <Input value={form.resources} onChange={e => update("resources", e.target.value)} className="text-xs h-8" />
                  </div>
                </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">Task Steps</h4>
                    <span className="text-[9px] text-muted-foreground">{form.tasks.length} steps</span>
                  </div>
                  <EditableTaskList tasks={form.tasks} onChange={t => update("tasks", t)} />
                </div>
          </TabsContent>

          <TabsContent value="tools" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-foreground">Required Tools</h4>
                      <span className="text-[9px] text-muted-foreground">{form.requiredTools.length} items</span>
                    </div>
                    <EditableList items={form.requiredTools} onChange={t => update("requiredTools", t)} placeholder="Add a tool..." />
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-foreground">Required PPE</h4>
                      <span className="text-[9px] text-muted-foreground">{form.requiredPPE.length} items</span>
                    </div>
                    <EditableList items={form.requiredPPE} onChange={t => update("requiredPPE", t)} placeholder="Add PPE item..." />
                  </div>
                </div>
          </TabsContent>

          <TabsContent value="safety" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-foreground">Safety Notes</h4>
                  <span className="text-[9px] text-muted-foreground">{form.safetyNotes.length} notes</span>
                </div>
                <EditableList items={form.safetyNotes} onChange={t => update("safetyNotes", t)} placeholder="Add safety note..." />
          </TabsContent>

          <TabsContent value="criteria" className="mt-0 flex-1 min-h-0 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-foreground">Acceptable Criteria</h4>
                      <span className="text-[9px] text-muted-foreground">{form.acceptableCriteria.length} items</span>
                    </div>
                    <EditableList items={form.acceptableCriteria} onChange={t => update("acceptableCriteria", t)} placeholder="Add acceptable criteria..." />
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-foreground">Signs of Failure</h4>
                      <span className="text-[9px] text-muted-foreground">{form.signsOfFailure.length} items</span>
                    </div>
                    <EditableList items={form.signsOfFailure} onChange={t => update("signsOfFailure", t)} placeholder="Add sign of failure..." />
                  </div>
                </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t border-border pt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Create Plan Dialog ─── */
function CreatePlanDialog({ open, onOpenChange, onCreatePM }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  onCreatePM: (data: any) => Promise<any>;
}) {
  const [form, setForm] = useState({
    pmName: "", equipmentType: "", frequency: "Monthly", discipline: "Mechanical",
    assetNumber: "", purpose: "", estimatedDuration: "1", dutyType: "Online", skillLevel: "Competent",
  });

  const handleSubmit = async () => {
    if (!form.pmName.trim()) { toast.error("Plan name is required"); return; }
    try {
      await onCreatePM({
        ...form, status: "Draft", requiredTools: [], requiredPPE: [],
        safetyNotes: [], tasks: [], inspectionPoints: [], acceptableCriteria: [], signsOfFailure: [],
      });
      toast.success("Maintenance plan created");
      onOpenChange(false);
      setForm({ pmName: "", equipmentType: "", frequency: "Monthly", discipline: "Mechanical", assetNumber: "", purpose: "", estimatedDuration: "1", dutyType: "Online", skillLevel: "Competent" });
    } catch { toast.error("Failed to create plan"); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="text-base">Create Maintenance Plan</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Plan Name *</Label>
              <Input value={form.pmName} onChange={e => setForm(f => ({ ...f, pmName: e.target.value }))} placeholder="e.g. Ball Mill Monthly Inspection" className="text-xs h-8" />
            </div>
            <div>
              <Label className="text-xs">Asset Number</Label>
              <Input value={form.assetNumber} onChange={e => setForm(f => ({ ...f, assetNumber: e.target.value }))} placeholder="e.g. ML01" className="text-xs h-8" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Frequency</Label>
              <Select value={form.frequency} onValueChange={v => setForm(f => ({ ...f, frequency: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Discipline</Label>
              <Select value={form.discipline} onValueChange={v => setForm(f => ({ ...f, discipline: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{DISCIPLINES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Duty Type</Label>
              <Select value={form.dutyType} onValueChange={v => setForm(f => ({ ...f, dutyType: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{DUTY_TYPES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Equipment Type</Label>
              <Input value={form.equipmentType} onChange={e => setForm(f => ({ ...f, equipmentType: e.target.value }))} placeholder="e.g. Ball Mill" className="text-xs h-8" />
            </div>
            <div>
              <Label className="text-xs">Est. Duration (hrs)</Label>
              <Input type="number" value={form.estimatedDuration} onChange={e => setForm(f => ({ ...f, estimatedDuration: e.target.value }))} className="text-xs h-8" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Purpose</Label>
            <Textarea value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} placeholder="Describe the purpose..." className="text-xs min-h-[60px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>Create Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
