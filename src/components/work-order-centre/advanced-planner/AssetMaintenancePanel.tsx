import { useMemo } from "react";
import {
  X, Wrench, Clock, ClipboardList, FileText, Cpu,
  Calendar, AlertTriangle, CheckCircle2, TrendingUp,
  ChevronRight, ShieldAlert, Package, ListChecks, Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO, differenceInDays } from "date-fns";
import type { Equipment, Component } from "@/components/hierarchy/assetData";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  equipment: Equipment;
  plans: PlannerItem[];
  allItems: PlannerItem[];
  onClose: () => void;
}

const WO_TYPE_DOTS: Record<string, string> = {
  PM: "bg-blue-500",
  Planned: "bg-emerald-500",
  Breakdown: "bg-red-500",
  Shutdown: "bg-amber-500",
};

const WO_TYPE_BADGE: Record<string, string> = {
  PM: "bg-blue-500/10 text-blue-700 border-blue-200",
  Planned: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  Breakdown: "bg-red-500/10 text-red-700 border-red-200",
  Shutdown: "bg-amber-500/10 text-amber-700 border-amber-200",
};

const STATUS_COLOR: Record<string, string> = {
  Active: "text-emerald-600",
  Draft: "text-muted-foreground",
  Planning: "text-blue-600",
  "In Progress": "text-amber-600",
  Open: "text-blue-600",
  Completed: "text-emerald-600",
  "On Hold": "text-muted-foreground",
};

export function AssetMaintenancePanel({ equipment, plans, allItems, onClose }: Props) {
  // Separate PMs from WOs
  const pms = useMemo(() => plans.filter(p => p.source === "pm" || p.woType === "PM"), [plans]);
  const wos = useMemo(() => plans.filter(p => p.source === "wo" && p.woType !== "PM"), [plans]);
  const breakdowns = useMemo(() => wos.filter(w => w.woType === "Breakdown"), [wos]);

  // Stats
  const totalPMHours = pms.reduce((s, p) => s + p.estimatedHours, 0);
  const totalWOHours = wos.reduce((s, w) => s + w.estimatedHours, 0);
  const openWOs = wos.filter(w => w.status !== "Completed" && w.status !== "Closed");
  const scheduledPMs = pms.filter(p => p.scheduledDate);

  // Frequencies used
  const frequencies = [...new Set(pms.map(p => p.frequency).filter(Boolean))];
  const disciplines = [...new Set(plans.map(p => p.discipline).filter(Boolean))];

  // Components
  const components = equipment.components || [];

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/10">
        <div className="flex items-center gap-3 min-w-0">
          <Wrench className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground truncate">{equipment.assetNumber}</div>
            <div className="text-xs text-muted-foreground truncate">{equipment.name}</div>
          </div>
          {equipment.functionalLocation && (
            <Badge variant="outline" className="text-[8px] font-mono px-1.5 h-4 flex-shrink-0">{equipment.functionalLocation}</Badge>
          )}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 px-4 py-2.5 border-b border-border">
        <MiniStat label="PM Plans" value={pms.length} icon={ClipboardList} color="text-blue-600" />
        <MiniStat label="Work Orders" value={wos.length} icon={FileText} color="text-emerald-600" />
        <MiniStat label="Breakdowns" value={breakdowns.length} icon={AlertTriangle} color="text-red-600" />
        <MiniStat label="Components" value={components.length} icon={Cpu} color="text-muted-foreground" />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Maintenance Plans Section */}
          <PanelSection
            title="Maintenance Plans"
            icon={ClipboardList}
            count={pms.length}
            subtitle={`${totalPMHours.toFixed(0)}h total · ${frequencies.join(", ") || "No frequency"}`}
          >
            {pms.length === 0 ? (
              <EmptyState text="No maintenance plans linked to this asset" />
            ) : (
              <div className="space-y-0.5">
                {pms.map(pm => (
                  <div key={pm.id} className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                    <span className={cn("w-2 h-2 rounded-full flex-shrink-0", WO_TYPE_DOTS[pm.woType])} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-foreground truncate">{pm.taskName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {pm.frequency && (
                          <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" /> {pm.frequency}
                          </span>
                        )}
                        {pm.discipline && (
                          <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                            <Wrench className="w-2.5 h-2.5" /> {pm.discipline}
                          </span>
                        )}
                        {pm.estimatedHours > 0 && (
                          <span className="text-[9px] text-muted-foreground tabular-nums">{pm.estimatedHours}h</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">{pm.dutyType || "Online"}</Badge>
                      <span className={cn("text-[9px] font-medium", STATUS_COLOR[pm.status] || "text-muted-foreground")}>{pm.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PanelSection>

          {/* Task Lists preview (from PM data) */}
          {pms.some(p => p.tasks.length > 0) && (
            <PanelSection title="Task Lists" icon={ListChecks} count={pms.reduce((s, p) => s + p.tasks.length, 0)} subtitle="Across all PM plans">
              {pms.filter(p => p.tasks.length > 0).map(pm => (
                <div key={pm.id} className="mb-2 last:mb-0">
                  <div className="text-[10px] font-semibold text-foreground mb-1">{pm.taskName}</div>
                  <div className="space-y-0.5 pl-2 border-l-2 border-border/50">
                    {pm.tasks.slice(0, 5).map((task: any, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 text-[10px]">
                        <span className="text-muted-foreground font-mono w-3 flex-shrink-0">{i + 1}.</span>
                        <span className="text-foreground">{typeof task === "string" ? task : task.description || task.task || "—"}</span>
                      </div>
                    ))}
                    {pm.tasks.length > 5 && (
                      <span className="text-[9px] text-primary font-medium">+{pm.tasks.length - 5} more tasks</span>
                    )}
                  </div>
                </div>
              ))}
            </PanelSection>
          )}

          {/* Work Order History */}
          <PanelSection
            title="Work Order History"
            icon={FileText}
            count={wos.length}
            subtitle={`${openWOs.length} open · ${totalWOHours.toFixed(0)}h total`}
          >
            {wos.length === 0 ? (
              <EmptyState text="No work orders recorded for this asset" />
            ) : (
              <div className="space-y-0.5">
                {wos.map(wo => (
                  <div key={wo.id} className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                    <span className={cn("w-2 h-2 rounded-full flex-shrink-0", WO_TYPE_DOTS[wo.woType])} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold text-foreground">{wo.woNumber}</span>
                        <Badge variant="outline" className={cn("text-[8px] px-1 py-0 h-3.5 border", WO_TYPE_BADGE[wo.woType])}>{wo.woType}</Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate mt-0.5">{wo.taskName}</div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <span className={cn("text-[9px] font-medium", STATUS_COLOR[wo.status] || "text-muted-foreground")}>{wo.status}</span>
                      {wo.scheduledDate && (
                        <span className="text-[8px] text-muted-foreground flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {format(parseISO(wo.scheduledDate), "d MMM yy")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PanelSection>

          {/* Materials & Tools */}
          {plans.some(p => p.materialList.some(Boolean) || p.requiredTools.length > 0) && (
            <PanelSection title="Materials & Tools" icon={Package} count={plans.reduce((s, p) => s + p.materialList.filter(Boolean).length + p.requiredTools.length, 0)} subtitle="Required across all plans">
              <div className="flex flex-wrap gap-1">
                {[...new Set(plans.flatMap(p => p.requiredTools))].filter(Boolean).map((t, i) => (
                  <Badge key={`t-${i}`} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">{t}</Badge>
                ))}
                {[...new Set(plans.flatMap(p => p.materialList))].filter(Boolean).map((m, i) => (
                  <Badge key={`m-${i}`} variant="outline" className="text-[9px] px-1.5 py-0 font-normal">{m}</Badge>
                ))}
              </div>
            </PanelSection>
          )}

          {/* Safety Notes */}
          {plans.some(p => p.safetyNotes.length > 0) && (
            <PanelSection title="Safety Notes" icon={ShieldAlert} count={plans.reduce((s, p) => s + p.safetyNotes.length, 0)}>
              {[...new Set(plans.flatMap(p => p.safetyNotes))].filter(Boolean).map((n, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[10px]">
                  <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{n}</span>
                </div>
              ))}
            </PanelSection>
          )}

          {/* Components */}
          {components.length > 0 && (
            <PanelSection title="Components (Level 7)" icon={Cpu} count={components.length}>
              <div className="space-y-0.5">
                {components.map((comp, i) => (
                  <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-muted/20 transition-colors">
                    <Cpu className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                    <span className="text-[10px] font-mono text-foreground">{comp.componentCode}</span>
                    <span className="text-[10px] text-muted-foreground truncate flex-1">{comp.componentName}</span>
                    {comp.componentType && (
                      <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">{comp.componentType}</Badge>
                    )}
                    {comp.manufacturer && (
                      <span className="text-[8px] text-muted-foreground/50 flex-shrink-0">{comp.manufacturer}</span>
                    )}
                  </div>
                ))}
              </div>
            </PanelSection>
          )}

          {/* Maintenance Summary */}
          <PanelSection title="Maintenance Summary" icon={TrendingUp}>
            <div className="grid grid-cols-2 gap-2">
              <SummaryRow label="Total PM Plans" value={String(pms.length)} />
              <SummaryRow label="Total WOs" value={String(wos.length)} />
              <SummaryRow label="PM Hours/Cycle" value={`${totalPMHours.toFixed(0)}h`} />
              <SummaryRow label="WO Hours" value={`${totalWOHours.toFixed(0)}h`} />
              <SummaryRow label="Frequencies" value={frequencies.join(", ") || "—"} />
              <SummaryRow label="Disciplines" value={disciplines.join(", ") || "—"} />
              <SummaryRow label="Open WOs" value={String(openWOs.length)} />
              <SummaryRow label="Breakdowns" value={String(breakdowns.length)} highlight={breakdowns.length > 0} />
            </div>
          </PanelSection>
        </div>
      </ScrollArea>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/20">
      <Icon className={cn("w-3.5 h-3.5", color)} />
      <div>
        <div className="text-sm font-bold text-foreground tabular-nums">{value}</div>
        <div className="text-[8px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function PanelSection({ title, icon: Icon, count, subtitle, children }: {
  title: string; icon: React.ElementType; count?: number; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 border-b border-border">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">{title}</span>
        {count !== undefined && <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{count}</Badge>}
        {subtitle && <span className="text-[9px] text-muted-foreground ml-auto">{subtitle}</span>}
      </div>
      <div className="p-2.5">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded bg-muted/10">
      <span className="text-[9px] text-muted-foreground">{label}</span>
      <span className={cn("text-[10px] font-semibold tabular-nums", highlight ? "text-red-600" : "text-foreground")}>{value}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-4 text-[10px] text-muted-foreground/60 italic">{text}</div>
  );
}