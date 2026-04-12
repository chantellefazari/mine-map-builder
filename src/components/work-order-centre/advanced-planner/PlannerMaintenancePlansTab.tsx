import { useState, useMemo } from "react";
import {
  Search, ChevronDown, ChevronRight, Plus, Clock, Wrench,
  ListChecks, Package, ShieldAlert, AlertTriangle, Settings2,
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
import { usePMasterList } from "@/hooks/usePMData";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

const FREQUENCIES = ["Daily", "Weekly", "Fortnightly", "Monthly", "Quarterly", "6-Monthly", "Annually", "Shutdown"];
const DISCIPLINES = ["Mechanical", "Electrical", "Instrumentation", "Process", "General"];

export function PlannerMaintenancePlansTab({ items }: Props) {
  const { upsertPM } = usePMasterList();
  const [search, setSearch] = useState("");
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [groupBy, setGroupBy] = useState<"frequency" | "discipline" | "area">("frequency");
  const [showCreate, setShowCreate] = useState(false);

  // Use raw PM data directly for the count and display
  const allPMs = useMemo(() => {
    // Merge items (which may be filtered) with any additional PM data
    // items already contains PM data from AdvancedPlannerView
    return items;
  }, [items]);

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

  // Group items
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
      <div className="grid grid-cols-[1fr_100px_90px_80px_70px_60px] gap-0 px-4 py-1.5 border-b border-border bg-muted/20 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
        <span>Plan Name / Asset</span>
        <span className="text-center">Discipline</span>
        <span className="text-center">Frequency</span>
        <span className="text-center">Duty</span>
        <span className="text-center">Hours</span>
        <span className="text-center">Status</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          {groups.map(([groupKey, plans]) => (
            <GroupSection key={groupKey} groupKey={groupKey} plans={plans} expandedPlans={expandedPlans} togglePlan={togglePlan} groupBy={groupBy} />
          ))}
          {groups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-2">
              <ClipboardIcon className="w-10 h-10 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">No maintenance plans found</p>
              <p className="text-[10px] text-muted-foreground/60">Try adjusting your search or filters, or create a new plan</p>
              <Button variant="outline" size="sm" className="mt-2 gap-1 text-xs" onClick={() => setShowCreate(true)}>
                <Plus className="w-3 h-3" /> Create Maintenance Plan
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <CreatePlanDialog open={showCreate} onOpenChange={setShowCreate} onCreatePM={upsertPM} />
    </div>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return <ListChecks className={className} />;
}

function GroupSection({ groupKey, plans, expandedPlans, togglePlan, groupBy }: {
  groupKey: string; plans: PlannerItem[]; expandedPlans: Set<string>; togglePlan: (id: string) => void; groupBy: string;
}) {
  const [open, setOpen] = useState(true);
  const totalHrs = plans.reduce((s, p) => s + p.estimatedHours, 0);
  const icon = groupBy === "frequency" ? Clock : groupBy === "discipline" ? Wrench : Settings2;
  const Icon = icon;

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
        <PlanRow key={plan.id} plan={plan} expanded={expandedPlans.has(plan.id)} onToggle={() => togglePlan(plan.id)} />
      ))}
    </div>
  );
}

function PlanRow({ plan, expanded, onToggle }: { plan: PlannerItem; expanded: boolean; onToggle: () => void }) {
  const hasTasks = plan.tasks.length > 0;
  const hasMaterials = plan.materialList.length > 0 && plan.materialList.some(Boolean);
  const hasTools = plan.requiredTools.length > 0;
  const hasSafety = plan.safetyNotes.length > 0;
  const hasDetail = hasTasks || hasMaterials || hasTools || hasSafety;

  return (
    <div className={cn("border-b border-border/20", expanded && "bg-primary/5")}>
      <div
        onClick={hasDetail ? onToggle : undefined}
        className={cn(
          "grid grid-cols-[1fr_100px_90px_80px_70px_60px] gap-0 items-center px-4 py-2 transition-colors",
          hasDetail ? "cursor-pointer hover:bg-muted/20" : ""
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
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
      </div>

      {expanded && hasDetail && (
        <div className="px-8 pb-3 space-y-2">
          {hasTasks && (
            <DetailBlock icon={ListChecks} title="Task List" count={plan.tasks.length}>
              {plan.tasks.map((task: any, i: number) => (
                <div key={i} className="flex items-start gap-2 text-[10px]">
                  <span className="text-muted-foreground font-mono w-4 shrink-0">{i + 1}.</span>
                  <span className="text-foreground">{typeof task === "string" ? task : task.description || task.task || JSON.stringify(task)}</span>
                </div>
              ))}
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

/* ─── Create Plan Dialog ─── */
function CreatePlanDialog({ open, onOpenChange, onCreatePM }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  onCreatePM: (data: any) => Promise<any>;
}) {
  const [form, setForm] = useState({
    pmName: "",
    equipmentType: "",
    frequency: "Monthly",
    discipline: "Mechanical",
    assetNumber: "",
    purpose: "",
    estimatedDuration: "1",
    dutyType: "Online",
    skillLevel: "Competent",
  });

  const handleSubmit = async () => {
    if (!form.pmName.trim()) {
      toast.error("Plan name is required");
      return;
    }
    try {
      await onCreatePM({
        pmName: form.pmName,
        equipmentType: form.equipmentType,
        frequency: form.frequency,
        discipline: form.discipline,
        assetNumber: form.assetNumber,
        purpose: form.purpose,
        estimatedDuration: form.estimatedDuration,
        dutyType: form.dutyType,
        skillLevel: form.skillLevel,
        status: "Draft",
        requiredTools: [],
        requiredPPE: [],
        safetyNotes: [],
        tasks: [],
        inspectionPoints: [],
        acceptableCriteria: [],
        signsOfFailure: [],
      });
      toast.success("Maintenance plan created");
      onOpenChange(false);
      setForm({ pmName: "", equipmentType: "", frequency: "Monthly", discipline: "Mechanical", assetNumber: "", purpose: "", estimatedDuration: "1", dutyType: "Online", skillLevel: "Competent" });
    } catch (err) {
      toast.error("Failed to create plan");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Create Maintenance Plan</DialogTitle>
        </DialogHeader>
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
                <SelectContent>
                  {FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Discipline</Label>
              <Select value={form.discipline} onValueChange={v => setForm(f => ({ ...f, discipline: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DISCIPLINES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Duty Type</Label>
              <Select value={form.dutyType} onValueChange={v => setForm(f => ({ ...f, dutyType: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Shutdown">Shutdown</SelectItem>
                </SelectContent>
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
            <Textarea value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} placeholder="Describe the purpose of this maintenance plan..." className="text-xs min-h-[60px]" />
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