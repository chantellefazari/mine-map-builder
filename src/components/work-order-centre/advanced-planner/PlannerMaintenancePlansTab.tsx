import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, Plus, Clock, Wrench, ListChecks, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

export function PlannerMaintenancePlansTab({ items }: Props) {
  const [search, setSearch] = useState("");
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(i =>
      i.taskName.toLowerCase().includes(q) ||
      i.assetNumber.toLowerCase().includes(q) ||
      i.frequency.toLowerCase().includes(q) ||
      i.discipline.toLowerCase().includes(q)
    );
  }, [items, search]);

  // Group by frequency
  const byFrequency = useMemo(() => {
    const map = new Map<string, PlannerItem[]>();
    for (const item of filtered) {
      const freq = item.frequency || "No Frequency";
      if (!map.has(freq)) map.set(freq, []);
      map.get(freq)!.push(item);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  const togglePlan = (id: string) => {
    setExpandedPlans(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-foreground">{filtered.length} Maintenance Plans</span>
          <span className="text-[10px] text-muted-foreground">{byFrequency.length} frequency groups</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-7 w-52 text-xs"
          />
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_100px_80px_80px_80px_60px] gap-0 px-4 py-1.5 border-b border-border bg-muted/20 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
        <span>Plan Name / Asset</span>
        <span className="text-center">Discipline</span>
        <span className="text-center">Frequency</span>
        <span className="text-center">Duty</span>
        <span className="text-center">Hours</span>
        <span className="text-center">Status</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          {byFrequency.map(([freq, plans]) => (
            <FrequencyGroup key={freq} frequency={freq} plans={plans} expandedPlans={expandedPlans} togglePlan={togglePlan} />
          ))}
          {byFrequency.length === 0 && (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No maintenance plans found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function FrequencyGroup({ frequency, plans, expandedPlans, togglePlan }: {
  frequency: string; plans: PlannerItem[]; expandedPlans: Set<string>; togglePlan: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const totalHrs = plans.reduce((s, p) => s + p.estimatedHours, 0);

  return (
    <div>
      {/* Group header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        <Clock className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-xs font-bold text-foreground">{frequency}</span>
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
      {/* Main row */}
      <div
        onClick={hasDetail ? onToggle : undefined}
        className={cn(
          "grid grid-cols-[1fr_100px_80px_80px_80px_60px] gap-0 items-center px-4 py-2 transition-colors",
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
        <div className="text-center text-[10px] text-muted-foreground">{plan.frequency || "—"}</div>
        <div className="text-center">
          <Badge variant="outline" className="text-[9px] px-1.5 py-0">{plan.dutyType || "—"}</Badge>
        </div>
        <div className="text-center text-[11px] font-medium text-foreground tabular-nums">{plan.estimatedHours > 0 ? `${plan.estimatedHours}h` : "—"}</div>
        <div className="text-center">
          <span className={cn("text-[9px] font-medium", plan.status === "Active" ? "text-emerald-600" : plan.status === "Draft" ? "text-muted-foreground" : "text-foreground")}>{plan.status}</span>
        </div>
      </div>

      {/* Expanded detail */}
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
            <DetailBlock icon={Wrench} title="Safety Notes" count={plan.safetyNotes.length}>
              {plan.safetyNotes.map((n, i) => (
                <div key={i} className="text-[10px] text-foreground">{n}</div>
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
