import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { WorkRequest } from "@/hooks/useWorkRequests";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadialBarChart, RadialBar,
} from "recharts";
import { Target, DollarSign, Users, Gauge, TrendingUp, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface Props {
  workOrders: WorkOrder[];
  workRequests: WorkRequest[];
}

function RAGIndicator({ value, target, unit = "%", inverse = false }: { value: number; target: number; unit?: string; inverse?: boolean }) {
  const met = inverse ? value <= target : value >= target;
  const close = inverse ? value <= target * 1.2 : value >= target * 0.8;
  const color = met ? "bg-emerald-500" : close ? "bg-amber-500" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="font-bold text-foreground">{value}{unit}</span>
      <span className="text-[10px] text-muted-foreground">/ {target}{unit} target</span>
    </div>
  );
}

/** KPI Scorecard — Executive dashboard with Cost + Resource Utilisation */
export function WOCKPIScorecardTab({ workOrders, workRequests }: Props) {
  const total = workOrders.length;
  const now = Date.now();

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
  const backlog = workOrders.filter((wo) => !["Completed", "Complete", "Closed"].includes(wo.status));
  const backlogCount = backlog.length;
  const backlogWeeks = backlogCount > 0 ? Math.round(backlogCount / Math.max(1, Math.round(completed / 4)) * 10) / 10 : 0;

  // Planned vs Reactive ratio
  const planned = workOrders.filter((wo) => ["PM", "Planned", "Preventive"].includes(wo.work_type)).length;
  const reactive = workOrders.filter((wo) => ["CM", "Corrective", "Breakdown", "Reactive"].includes(wo.work_type)).length;
  const plannedPct = total > 0 ? Math.round((planned / total) * 100) : 0;

  // MTTR (avg hours to complete corrective WOs)
  const correctiveCompleted = workOrders.filter(
    (wo) => wo.date_completed && wo.date_raised && ["CM", "Corrective", "Breakdown", "Reactive"].includes(wo.work_type)
  );
  const avgMTTR = correctiveCompleted.length > 0
    ? Math.round(correctiveCompleted.reduce((s, wo) => {
        return s + (new Date(wo.date_completed!).getTime() - new Date(wo.date_raised).getTime()) / 3600000;
      }, 0) / correctiveCompleted.length * 10) / 10
    : 0;

  // Labour hours summary (resource utilisation proxy)
  const totalLabourHours = useMemo(() => {
    let hrs = 0;
    workOrders.forEach((wo) => {
      if (Array.isArray(wo.labour_hours)) {
        wo.labour_hours.forEach((entry: any) => {
          hrs += Number(entry?.hours) || 0;
        });
      }
    });
    return Math.round(hrs);
  }, [workOrders]);

  // Work type distribution for cost proxy
  const workTypeDist = useMemo(() => {
    const map: Record<string, number> = {};
    workOrders.forEach((wo) => {
      const t = wo.work_type || "Other";
      map[t] = (map[t] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [workOrders]);

  const TYPE_COLORS: Record<string, string> = {
    PM: "hsl(142 71% 45%)", Preventive: "hsl(142 71% 45%)",
    CM: "hsl(0 84% 60%)", Corrective: "hsl(0 84% 60%)", Breakdown: "hsl(0 84% 60%)", Reactive: "hsl(0 84% 60%)",
    Planned: "hsl(210 80% 55%)", Inspection: "hsl(45 93% 47%)",
    Other: "hsl(0 0% 60%)",
  };

  // Scorecard items
  const scorecard = [
    { label: "PM Compliance", value: pmCompliance, target: 90, icon: CheckCircle2, unit: "%" },
    { label: "Schedule Compliance", value: schedCompliance, target: 85, icon: Target, unit: "%" },
    { label: "Planned Work Ratio", value: plannedPct, target: 70, icon: TrendingUp, unit: "%" },
    { label: "Completion Rate", value: completionRate, target: 80, icon: Gauge, unit: "%" },
    { label: "Avg MTTR", value: avgMTTR, target: 24, icon: Clock, unit: "h", inverse: true },
    { label: "Backlog (weeks)", value: backlogWeeks, target: 4, icon: AlertTriangle, unit: "w", inverse: true },
  ];

  return (
    <div className="space-y-4 mt-2">
      {/* Executive header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">KPI Scorecard — Executive Overview</h2>
          <p className="text-[10px] text-muted-foreground">Key performance indicators against industry benchmarks</p>
        </div>
      </div>

      {/* Main Scorecard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {scorecard.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-semibold text-foreground">{kpi.label}</p>
                </div>
                <RAGIndicator value={kpi.value} target={kpi.target} unit={kpi.unit} inverse={kpi.inverse} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Work Type Distribution */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Work Type Distribution</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workTypeDist}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="WOs">
                    {workTypeDist.map((d, i) => (
                      <Cell key={i} fill={TYPE_COLORS[d.name] || TYPE_COLORS.Other} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resource Summary */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Resource Utilisation Summary</p>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xl font-bold text-foreground">{totalLabourHours}h</p>
                  <p className="text-[10px] text-muted-foreground">Total Labour Logged</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <DollarSign className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xl font-bold text-foreground">{planned + reactive}</p>
                  <p className="text-[10px] text-muted-foreground">Classified WOs</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">Planned vs Reactive</span>
                    <span className="font-semibold text-foreground">{plannedPct}% / {100 - plannedPct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${plannedPct}%` }} />
                    <div className="bg-destructive h-full transition-all" style={{ width: `${100 - plannedPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">Backlog Health</span>
                    <span className="font-semibold text-foreground">{backlogCount} open / {backlogWeeks}w</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${backlogWeeks <= 4 ? "bg-emerald-500" : backlogWeeks <= 8 ? "bg-amber-500" : "bg-destructive"}`}
                      style={{ width: `${Math.min(100, (backlogWeeks / 12) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
