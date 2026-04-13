import { useMemo } from "react";
import {
  ClipboardList, FileText, FolderTree, Wrench, Zap, Clock,
  AlertTriangle, CheckCircle2, Package, TrendingUp, BarChart3,
  ArrowRight, Calendar, Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PlannerItem } from "./AdvancedPlannerView";
import { WO_TYPE_CONFIG } from "./AdvancedPlannerView";

type PlannerTab = "overview" | "maintenance-plans" | "work-orders" | "asset-tree";

interface Props {
  items: PlannerItem[];
  allItems: PlannerItem[];
  stats: {
    total: number; pm: number; planned: number; breakdown: number; shutdown: number;
    totalHrs: number; areas: number; assets: number;
  };
  onNavigate: (tab: PlannerTab) => void;
  filterWOType: string;
  setFilterWOType: (v: string) => void;
}

export function PlannerOverviewTab({ items, allItems, stats, onNavigate, filterWOType, setFilterWOType }: Props) {
  // By-area breakdown
  const areaBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; pm: number; wo: number; hours: number }>();
    for (const item of items) {
      const area = item.area || "Unassigned";
      if (!map.has(area)) map.set(area, { total: 0, pm: 0, wo: 0, hours: 0 });
      const a = map.get(area)!;
      a.total++;
      if (item.source === "pm") a.pm++; else a.wo++;
      a.hours += item.estimatedHours;
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10);
  }, [items]);

  // By-discipline breakdown
  const disciplineBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const d = item.discipline || "Unassigned";
      map.set(d, (map.get(d) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [items]);

  // By-status breakdown
  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const s = item.status || "Unknown";
      map.set(s, (map.get(s) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [items]);

  // By-frequency breakdown
  const frequencyBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      if (item.frequency) map.set(item.frequency, (map.get(item.frequency) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [items]);

  // Upcoming scheduled
  const upcomingScheduled = useMemo(() => {
    return items
      .filter(i => i.scheduledDate)
      .sort((a, b) => (a.scheduledDate || "").localeCompare(b.scheduledDate || ""))
      .slice(0, 8);
  }, [items]);

  // Unassigned items
  const unassignedCount = useMemo(() => items.filter(i => !i.assignedTo).length, [items]);

  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-5">
        {/* WO Type filter chips */}
        <div className="flex items-center gap-2">
          {Object.entries(WO_TYPE_CONFIG).map(([key, cfg]) => {
            const count = key === "PM" ? stats.pm : key === "Planned" ? stats.planned : key === "Breakdown" ? stats.breakdown : stats.shutdown;
            const isActive = filterWOType === key;
            return (
              <button
                key={key}
                onClick={() => setFilterWOType(filterWOType === key ? "All" : key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all border",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", cfg.color)} />
                {cfg.label}
                <span className="tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>
        {/* Summary cards */}
        <div className="grid grid-cols-6 gap-3">
          <SummaryCard
            label="Total Plans"
            value={stats.total}
            icon={ClipboardList}
            color="text-primary"
            onClick={() => onNavigate("maintenance-plans")}
          />
          <SummaryCard
            label="Work Orders"
            value={stats.planned + stats.breakdown + stats.shutdown}
            icon={FileText}
            color="text-emerald-600"
            onClick={() => onNavigate("work-orders")}
          />
          <SummaryCard
            label="PM Schedules"
            value={stats.pm}
            icon={Calendar}
            color="text-blue-600"
            onClick={() => onNavigate("maintenance-plans")}
          />
          <SummaryCard
            label="Areas Covered"
            value={stats.areas}
            icon={FolderTree}
            color="text-amber-600"
            onClick={() => onNavigate("asset-tree")}
          />
          <SummaryCard
            label="Total Hours"
            value={`${stats.totalHrs.toFixed(0)}h`}
            icon={Clock}
            color="text-muted-foreground"
          />
          <SummaryCard
            label="Unassigned"
            value={unassignedCount}
            icon={AlertTriangle}
            color="text-destructive"
          />
        </div>

        {/* WO Type breakdown */}
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(WO_TYPE_CONFIG).map(([key, cfg]) => {
            const count = key === "PM" ? stats.pm : key === "Planned" ? stats.planned : key === "Breakdown" ? stats.breakdown : stats.shutdown;
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={key} className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full", cfg.color)} />
                    <span className="text-xs font-semibold text-foreground">{cfg.label}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">({cfg.code})</span>
                  </div>
                  <span className="text-lg font-bold text-foreground tabular-nums">{count}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", cfg.color)} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">{pct}% of total</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Area Breakdown */}
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-xs font-semibold text-foreground">By Area</span>
              <button onClick={() => onNavigate("asset-tree")} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                View Tree <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-2 space-y-1">
              {areaBreakdown.map(([area, data]) => (
                <div key={area} className="flex items-center justify-between px-2 py-1 rounded hover:bg-muted/30 text-[11px]">
                  <span className="font-medium text-foreground truncate">{area}</span>
                  <div className="flex items-center gap-3 text-muted-foreground tabular-nums">
                    <span>{data.pm} PM</span>
                    <span>{data.wo} WO</span>
                    <span className="font-semibold text-foreground">{data.total}</span>
                  </div>
                </div>
              ))}
              {areaBreakdown.length === 0 && <p className="text-[11px] text-muted-foreground text-center py-4">No data</p>}
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-card border border-border rounded-lg">
            <div className="px-3 py-2 border-b border-border">
              <span className="text-xs font-semibold text-foreground">By Status</span>
            </div>
            <div className="p-2 space-y-1">
              {statusBreakdown.map(([status, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={status} className="flex items-center justify-between px-2 py-1 rounded hover:bg-muted/30 text-[11px]">
                    <div className="flex items-center gap-2">
                      <StatusDot status={status} />
                      <span className="text-foreground">{status}</span>
                    </div>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="text-muted-foreground">{pct}%</span>
                      <span className="font-semibold text-foreground w-6 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discipline & Frequency */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-xs font-semibold text-foreground">By Discipline</span>
              </div>
              <div className="p-2 space-y-1">
                {disciplineBreakdown.slice(0, 5).map(([disc, count]) => (
                  <div key={disc} className="flex items-center justify-between px-2 py-1 text-[11px]">
                    <span className="text-foreground">{disc}</span>
                    <span className="font-semibold text-foreground tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-xs font-semibold text-foreground">By Frequency</span>
              </div>
              <div className="p-2 space-y-1">
                {frequencyBreakdown.slice(0, 5).map(([freq, count]) => (
                  <div key={freq} className="flex items-center justify-between px-2 py-1 text-[11px]">
                    <span className="text-foreground">{freq}</span>
                    <span className="font-semibold text-foreground tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Scheduled */}
        {upcomingScheduled.length > 0 && (
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-xs font-semibold text-foreground">Upcoming Scheduled</span>
              <button onClick={() => onNavigate("work-orders")} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-border/50">
              {upcomingScheduled.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/20 text-[11px]">
                  <span className={cn("w-2 h-2 rounded-full flex-shrink-0", WO_TYPE_CONFIG[item.woType]?.color)} />
                  <span className="font-mono text-muted-foreground w-20 flex-shrink-0">{item.woNumber || "—"}</span>
                  <span className="text-foreground truncate flex-1">{item.taskName}</span>
                  <span className="text-muted-foreground flex-shrink-0">{item.assetNumber}</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 flex-shrink-0">{item.scheduledDate}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

function SummaryCard({ label, value, icon: Icon, color, onClick }: {
  label: string; value: number | string; icon: React.ElementType; color: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-lg p-3 transition-colors",
        onClick && "cursor-pointer hover:border-primary/30 hover:bg-primary/5"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <Icon className={cn("w-4 h-4", color)} />
        {onClick && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
      </div>
      <div className="text-xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const s = status.toLowerCase();
  let color = "bg-muted-foreground";
  if (s === "active" || s === "open") color = "bg-emerald-500";
  else if (s === "planning") color = "bg-amber-500";
  else if (s === "scheduled") color = "bg-blue-500";
  else if (s === "on hold") color = "bg-red-500";
  else if (s === "completed") color = "bg-emerald-700";
  else if (s === "draft") color = "bg-muted-foreground";
  return <span className={cn("w-1.5 h-1.5 rounded-full", color)} />;
}
