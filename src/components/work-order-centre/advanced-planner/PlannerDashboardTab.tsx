import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import {
  Target, CheckCircle2, TrendingUp, Gauge, Clock, AlertTriangle,
  Users, BarChart3, Wrench, CalendarCheck, Layers, ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlannerItem } from "./AdvancedPlannerView";
import type { WOCView } from "@/pages/WorkOrderCentre";

interface Props {
  items: PlannerItem[];
  onNavigateWOC?: (view: WOCView) => void;
}

function RAGDot({ value, target, inverse = false }: { value: number; target: number; inverse?: boolean }) {
  const met = inverse ? value <= target : value >= target;
  const close = inverse ? value <= target * 1.2 : value >= target * 0.8;
  const color = met ? "bg-emerald-500" : close ? "bg-amber-500" : "bg-destructive";
  return <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", color)} />;
}

function KPICard({ label, value, unit, target, targetLabel, icon: Icon, inverse = false, onClick }: {
  label: string; value: number; unit: string; target: number; targetLabel?: string;
  icon: React.ElementType; inverse?: boolean; onClick?: () => void;
}) {
  const met = inverse ? value <= target : value >= target;
  return (
    <Card
      className={cn("border-border transition-colors", onClick && "cursor-pointer hover:border-primary/40 hover:bg-primary/5")}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
          </div>
          <div className="flex items-center gap-1">
            <RAGDot value={value} target={target} inverse={inverse} />
            {onClick && <ArrowUpRight className="w-3 h-3 text-muted-foreground" />}
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-foreground tabular-nums">{value}</span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className={cn("text-[9px] font-medium", met ? "text-emerald-600" : "text-amber-600")}>
            {met ? "On Target" : "Below Target"}
          </span>
          <span className="text-[9px] text-muted-foreground">• {targetLabel || `${target}${unit} target`}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlannerDashboardTab({ items, onNavigateWOC }: Props) {
  const { workOrders } = useWorkOrders();
  const { workRequests } = useWorkRequests();

  const total = workOrders.length;

  // PM Compliance
  const pmWOs = workOrders.filter((wo) => wo.work_type === "PM");
  const pmCompleted = pmWOs.filter((wo) => ["Completed", "Complete", "Closed"].includes(wo.status)).length;
  const pmCompliance = pmWOs.length > 0 ? Math.round((pmCompleted / pmWOs.length) * 100) : 0;

  // Schedule Compliance
  const scheduled = workOrders.filter((wo) => wo.scheduled_date && wo.date_completed);
  const onTime = scheduled.filter((wo) => wo.date_completed!.slice(0, 10) <= wo.scheduled_date!.slice(0, 10)).length;
  const schedCompliance = scheduled.length > 0 ? Math.round((onTime / scheduled.length) * 100) : 0;

  // Completion Rate
  const completed = workOrders.filter((wo) => ["Completed", "Complete", "Closed"].includes(wo.status)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Backlog
  const backlog = workOrders.filter((wo) => !["Completed", "Complete", "Closed", "Cancelled"].includes(wo.status));
  const backlogCount = backlog.length;
  const backlogWeeks = backlogCount > 0 ? Math.round(backlogCount / Math.max(1, Math.round(completed / 4)) * 10) / 10 : 0;

  // Planned vs Reactive ratio
  const planned = workOrders.filter((wo) => ["PM", "Planned", "Preventive"].includes(wo.work_type)).length;
  const reactive = workOrders.filter((wo) => ["CM", "Corrective", "Breakdown", "Reactive"].includes(wo.work_type)).length;
  const plannedPct = total > 0 ? Math.round((planned / total) * 100) : 0;

  // MTTR
  const correctiveCompleted = workOrders.filter(
    (wo) => wo.date_completed && wo.date_raised && ["CM", "Corrective", "Breakdown", "Reactive"].includes(wo.work_type)
  );
  const avgMTTR = correctiveCompleted.length > 0
    ? Math.round(correctiveCompleted.reduce((s, wo) => {
        return s + (new Date(wo.date_completed!).getTime() - new Date(wo.date_raised).getTime()) / 3600000;
      }, 0) / correctiveCompleted.length * 10) / 10
    : 0;

  // Work Requests pending
  const pendingWRs = workRequests.filter((wr) => wr.status === "Pending" || wr.status === "Open").length;
  const wrToWoRate = workRequests.length > 0
    ? Math.round(workRequests.filter(wr => wr.status === "Approved" || wr.linked_wo_id).length / workRequests.length * 100)
    : 0;

  // Planner-specific: duty type breakdown
  const onlineCount = items.filter(i => (i.dutyType || "Online") === "Online").length;
  const offlineCount = items.filter(i => i.dutyType === "Offline").length;

  // Total labour from planner items
  const totalPlannerHrs = useMemo(() => Math.round(items.reduce((s, i) => s + i.estimatedHours, 0)), [items]);

  // Backlog aging bands
  const now = Date.now();
  const agingBands = useMemo(() => {
    const bands = { "0-7d": 0, "8-14d": 0, "15-30d": 0, "30d+": 0 };
    backlog.forEach(wo => {
      const age = (now - new Date(wo.date_raised).getTime()) / 86400000;
      if (age <= 7) bands["0-7d"]++;
      else if (age <= 14) bands["8-14d"]++;
      else if (age <= 30) bands["15-30d"]++;
      else bands["30d+"]++;
    });
    return bands;
  }, [backlog, now]);

  // By discipline for planner items
  const disciplineHours = useMemo(() => {
    const map = new Map<string, { count: number; hours: number }>();
    items.forEach(i => {
      const d = i.discipline || "Unassigned";
      const entry = map.get(d) || { count: 0, hours: 0 };
      entry.count++;
      entry.hours += i.estimatedHours;
      map.set(d, entry);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].hours - a[1].hours).slice(0, 6);
  }, [items]);

  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Performance — Maintenance KPIs &amp; Reporting</h2>
          </div>
          <Badge variant="outline" className="text-[9px]">Live from WO Centre</Badge>
        </div>

        {/* KPI Scorecard Row */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          <KPICard label="PM Compliance" value={pmCompliance} unit="%" target={90} icon={CheckCircle2} />
          <KPICard label="Schedule Compliance" value={schedCompliance} unit="%" target={85} icon={Target} />
          <KPICard label="Planned Ratio" value={plannedPct} unit="%" target={70} icon={TrendingUp} />
          <KPICard label="Completion Rate" value={completionRate} unit="%" target={80} icon={Gauge} />
          <KPICard label="Avg MTTR" value={avgMTTR} unit="h" target={24} icon={Clock} inverse />
          <KPICard label="Backlog" value={backlogWeeks} unit="wks" target={4} icon={AlertTriangle} inverse targetLabel="≤4 wks target" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Work Requests Pipeline */}
          <Card className="border-border">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-3">
                <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Work Request Pipeline</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Total WRs</span>
                  <span className="text-sm font-bold text-foreground tabular-nums">{workRequests.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Pending Review</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 text-amber-700 border-amber-300 bg-amber-500/10">{pendingWRs}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">WR → WO Conversion</span>
                  <span className="text-sm font-bold text-foreground tabular-nums">{wrToWoRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planned vs Reactive */}
          <Card className="border-border">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-3">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Planned vs Reactive</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-emerald-600 tabular-nums">{plannedPct}%</p>
                  <p className="text-[9px] text-muted-foreground">Planned</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-destructive tabular-nums">{100 - plannedPct}%</p>
                  <p className="text-[9px] text-muted-foreground">Reactive</p>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${plannedPct}%` }} />
                <div className="bg-destructive h-full" style={{ width: `${100 - plannedPct}%` }} />
              </div>
              <p className={cn("text-[9px] mt-1", plannedPct >= 70 ? "text-emerald-600" : "text-amber-600")}>
                {plannedPct >= 70 ? "✓ Meeting 70/30 target" : "⚠ Below 70/30 target"}
              </p>
            </CardContent>
          </Card>

          {/* Duty Type + Planner Stats */}
          <Card className="border-border">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-3">
                <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Planner Load</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Total Planner Items</span>
                  <span className="text-sm font-bold text-foreground tabular-nums">{items.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Est. Labour Hours</span>
                  <span className="text-sm font-bold text-foreground tabular-nums">{totalPlannerHrs}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-muted-foreground">Online</span>
                  </div>
                  <span className="text-[11px] font-semibold text-foreground tabular-nums">{onlineCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[11px] text-muted-foreground">Offline</span>
                  </div>
                  <span className="text-[11px] font-semibold text-foreground tabular-nums">{offlineCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Backlog Aging */}
          <Card className="border-border">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">Backlog Aging</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{backlogCount} open WOs</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(agingBands).map(([band, count]) => {
                  const isOld = band === "30d+";
                  const isMid = band === "15-30d";
                  return (
                    <div key={band} className="text-center p-2 rounded-md bg-muted/30">
                      <p className={cn(
                        "text-lg font-bold tabular-nums",
                        isOld ? "text-destructive" : isMid ? "text-amber-600" : "text-foreground"
                      )}>{count}</p>
                      <p className="text-[9px] text-muted-foreground">{band}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex mt-2 h-2 bg-muted rounded-full overflow-hidden">
                {Object.entries(agingBands).map(([band, count], i) => {
                  const pct = backlogCount > 0 ? (count / backlogCount) * 100 : 0;
                  const colors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-destructive"];
                  return <div key={band} className={cn("h-full", colors[i])} style={{ width: `${pct}%` }} />;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Discipline Hours */}
          <Card className="border-border">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-3">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Labour by Discipline</span>
              </div>
              <div className="space-y-1.5">
                {disciplineHours.map(([disc, data]) => {
                  const maxHrs = disciplineHours[0]?.[1]?.hours || 1;
                  const pct = Math.round((data.hours / maxHrs) * 100);
                  return (
                    <div key={disc}>
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-foreground font-medium truncate">{disc}</span>
                        <div className="flex items-center gap-2 tabular-nums text-muted-foreground">
                          <span>{data.count} items</span>
                          <span className="font-semibold text-foreground">{Math.round(data.hours)}h</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {disciplineHours.length === 0 && (
                  <p className="text-[11px] text-muted-foreground text-center py-3">No discipline data</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
