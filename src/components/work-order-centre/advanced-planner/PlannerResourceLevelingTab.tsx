import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Layers, AlertTriangle, CheckCircle2,
  Wrench, Zap, Truck, Users, Clock, TrendingDown, Info, ArrowRight,
  BarChart3, CalendarRange, Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  format, startOfWeek, addWeeks, addDays, startOfYear,
  getISOWeek, getYear, parseISO, isWithinInterval,
} from "date-fns";
import type { PlannerItem } from "./AdvancedPlannerView";
import { WO_TYPE_CONFIG } from "./AdvancedPlannerView";
import {
  useCapacityGrid,
  WORK_CENTRES,
  buildWeekInfos,
  type WeekCapacity,
} from "@/hooks/useCapacityGrid";

interface Props {
  items: PlannerItem[];
}

/**
 * Improved frequency-to-week mapping.
 * Handles actual DB values like "1 Week", "12 Week", "26 Week", "Daily", etc.
 */
function getWeeksForFrequency(freq: string): number[] {
  if (!freq) return [];
  const f = freq.trim().toLowerCase();

  // "Daily" / "daily"
  if (f === "daily") return Array.from({ length: 52 }, (_, i) => i + 1);

  // Parse "N Week" pattern (e.g. "1 Week", "12 Week", "26 Week", "52 Week")
  const weekMatch = f.match(/^(\d+)\s*week/i);
  if (weekMatch) {
    const interval = parseInt(weekMatch[1], 10);
    if (interval <= 0) return [];
    if (interval === 1) return Array.from({ length: 52 }, (_, i) => i + 1);
    const weeks: number[] = [];
    for (let w = 1; w <= 52; w += interval) weeks.push(w);
    return weeks;
  }

  // Legacy/alternate formats
  if (f === "weekly" || f === "1w") return Array.from({ length: 52 }, (_, i) => i + 1);
  if (f === "fortnightly" || f === "2w") return Array.from({ length: 26 }, (_, i) => i * 2 + 1);
  if (f === "monthly") return [1, 5, 9, 13, 18, 22, 26, 31, 35, 39, 44, 48];
  if (f === "quarterly") return [1, 13, 26, 39];
  if (f.includes("6-month") || f.includes("6 month")) return [1, 26];
  if (f === "annually" || f === "yearly") return [1];
  if (f === "once") return [];

  return [];
}

/** How many times per year this frequency fires */
function getFrequencyOccurrences(freq: string): number {
  return getWeeksForFrequency(freq).length;
}

const DISCIPLINE_MAP: Record<string, string> = {
  Mechanical: "Mechanical",
  Electrical: "Electrical",
  "Mobile & LVs": "Mobile & LVS",
  "Mobile & LVS": "Mobile & LVS",
  Instrumentation: "Electrical",
  Lube: "Mechanical",
  Ops: "Mechanical",
};

function mapDiscipline(d: string): string {
  return DISCIPLINE_MAP[d] || "Mechanical";
}

const WC_ICONS: Record<string, React.ElementType> = {
  Mechanical: Wrench,
  Electrical: Zap,
  "Mobile & LVS": Truck,
};

const DAYS_PER_WEEK = 7;
const WEEKS_PER_PAGE = 13;

interface WeekLevelData {
  weekIdx: number;
  weekNum: number;
  startDate: Date;
  endDate: Date;
  demand: number;
  capacity: number;
  utilisation: number;
  pmHours: number;
  woHours: number;
  items: PlannerItem[];
  overloaded: boolean;
  underloaded: boolean;
}

export function PlannerResourceLevelingTab({ items }: Props) {
  const { grid, year } = useCapacityGrid();
  const [selectedWC, setSelectedWC] = useState("All");
  const currentWeekNum = getISOWeek(new Date());
  const currentYear = getYear(new Date());
  const initialPage = Math.floor((currentWeekNum - 1) / WEEKS_PER_PAGE);
  const [page, setPage] = useState(initialPage);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const yearStart = startOfYear(new Date(year, 0, 1));
  const weekInfos = useMemo(() => buildWeekInfos(year), [year]);

  const weekData = useMemo(() => {
    const workCentres = selectedWC === "All"
      ? WORK_CENTRES.map(w => w.key)
      : [selectedWC];

    const weeks: WeekLevelData[] = [];

    for (let w = 0; w < 52; w++) {
      const weekStart = startOfWeek(addWeeks(yearStart, w), { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);
      const weekNum = w + 1;

      // Calculate capacity for this week across selected work centres
      let totalCapacity = 0;
      for (const wc of workCentres) {
        const cap = grid[wc]?.[w];
        if (cap) {
          totalCapacity += cap.personnel * cap.hoursPerDay * DAYS_PER_WEEK * (cap.loadingTarget / 100);
        }
      }

      // Filter items by discipline
      const wcItems = items.filter(i => {
        const mapped = mapDiscipline(i.discipline);
        return workCentres.includes(mapped);
      });

      // Get scheduled WOs for this week
      const scheduledItems = wcItems.filter(i => {
        if (!i.scheduledDate) return false;
        try {
          const d = parseISO(i.scheduledDate);
          return isWithinInterval(d, { start: weekStart, end: weekEnd });
        } catch { return false; }
      });

      // Get projected PMs for this week
      const projectedPMs: PlannerItem[] = [];
      for (const pm of wcItems.filter(i => i.source === "pm" && i.frequency)) {
        const freqWeeks = getWeeksForFrequency(pm.frequency);
        if (freqWeeks.includes(weekNum)) projectedPMs.push(pm);
      }

      const allWeekItems = [...scheduledItems, ...projectedPMs];
      const demand = allWeekItems.reduce((s, i) => s + i.estimatedHours, 0);
      const pmHours = allWeekItems.filter(i => i.woType === "PM" || i.source === "pm").reduce((s, i) => s + i.estimatedHours, 0);
      const utilisation = totalCapacity > 0 ? (demand / totalCapacity) * 100 : 0;

      weeks.push({
        weekIdx: w,
        weekNum,
        startDate: weekStart,
        endDate: weekEnd,
        demand,
        capacity: totalCapacity,
        utilisation,
        pmHours,
        woHours: demand - pmHours,
        items: allWeekItems,
        overloaded: utilisation > 100,
        underloaded: utilisation < 50 && totalCapacity > 0,
      });
    }
    return weeks;
  }, [items, grid, year, selectedWC]);

  // Stats
  const overloadedWeeks = weekData.filter(w => w.overloaded).length;
  const underloadedWeeks = weekData.filter(w => w.underloaded).length;
  const balancedWeeks = 52 - overloadedWeeks - underloadedWeeks;
  const avgUtilisation = weekData.reduce((s, w) => s + w.utilisation, 0) / 52;
  const totalDemand = weekData.reduce((s, w) => s + w.demand, 0);
  const totalCapacity = weekData.reduce((s, w) => s + w.capacity, 0);

  // Scheduled vs unscheduled counts
  const scheduledWOs = items.filter(i => i.source === "wo" && i.scheduledDate).length;
  const unscheduledWOs = items.filter(i => i.source === "wo" && !i.scheduledDate).length;
  const totalPMs = items.filter(i => i.source === "pm").length;

  // Pagination
  const pageStart = page * WEEKS_PER_PAGE;
  const pageEnd = Math.min(pageStart + WEEKS_PER_PAGE, 52);
  const visibleWeeks = weekData.slice(pageStart, pageEnd);
  const totalPages = Math.ceil(52 / WEEKS_PER_PAGE);
  const maxBarValue = Math.max(...visibleWeeks.map(w => Math.max(w.demand, w.capacity)), 1);

  const selectedData = selectedWeek !== null ? weekData.find(w => w.weekNum === selectedWeek) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Resource Leveling</span>
          <span className="text-[9px] text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">Demand vs Capacity</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[10px] gap-1"
            onClick={() => setShowGuide(!showGuide)}
          >
            <Lightbulb className="w-3 h-3" />
            {showGuide ? "Hide" : "Show"} Guide
          </Button>
          <Select value={selectedWC} onValueChange={setSelectedWC}>
            <SelectTrigger className="h-7 w-36 text-[10px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Disciplines</SelectItem>
              {WORK_CENTRES.map(wc => (
                <SelectItem key={wc.key} value={wc.key}>{wc.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">

          {/* How-to guide */}
          {showGuide && (
            <div className="border border-primary/30 rounded-lg bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h3 className="text-xs font-bold text-foreground">How Resource Leveling Works</h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    This view compares your <strong>weekly work demand</strong> (scheduled WOs + projected PM hours)
                    against your <strong>available crew capacity</strong> (personnel × hours/day × 7 days × loading target%).
                    Use it to spot weeks that are overloaded or underutilised so you can redistribute work.
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-primary">1</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-foreground">Set Capacity</p>
                        <p className="text-[9px] text-muted-foreground">Go to the <strong>Capacity</strong> tab and set your personnel, hours/day and loading % per discipline per week.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-primary">2</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-foreground">Schedule Work</p>
                        <p className="text-[9px] text-muted-foreground">Use the <strong>Forward Plan</strong> or <strong>Weekly Schedule</strong> to assign WOs to specific weeks. PMs are auto-projected from frequency.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-primary">3</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-foreground">Balance Load</p>
                        <p className="text-[9px] text-muted-foreground">Review the heatmap and chart below. Move work from <strong className="text-destructive">red</strong> (overloaded) weeks to <strong className="text-amber-600">amber</strong> (underloaded) weeks.</p>
                      </div>
                    </div>
                  </div>

                  {/* Data coverage status */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-primary/20">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-3 h-3 text-blue-500" />
                      <span className="text-[9px] text-foreground font-medium">{totalPMs} PMs projected</span>
                      <span className="text-[8px] text-muted-foreground">(from frequency)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarRange className="w-3 h-3 text-emerald-500" />
                      <span className="text-[9px] text-foreground font-medium">{scheduledWOs} WOs scheduled</span>
                    </div>
                    {unscheduledWOs > 0 && (
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <span className="text-[9px] text-amber-600 font-medium">{unscheduledWOs} WOs unscheduled</span>
                        <span className="text-[8px] text-muted-foreground">(not shown in demand)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary cards */}
          <div className="grid grid-cols-6 gap-2">
            <LevelCard
              label="Overloaded"
              value={`${overloadedWeeks} weeks`}
              icon={AlertTriangle}
              color="text-destructive"
              bg="bg-destructive/5 border-destructive/20"
            />
            <LevelCard
              label="Balanced"
              value={`${balancedWeeks} weeks`}
              icon={CheckCircle2}
              color="text-emerald-600"
              bg="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800"
            />
            <LevelCard
              label="Underloaded"
              value={`${underloadedWeeks} weeks`}
              icon={TrendingDown}
              color="text-amber-600"
              bg="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
            />
            <LevelCard
              label="Avg Utilisation"
              value={`${avgUtilisation.toFixed(0)}%`}
              icon={Users}
              color={avgUtilisation > 100 ? "text-destructive" : avgUtilisation > 80 ? "text-emerald-600" : "text-amber-600"}
            />
            <LevelCard
              label="Total Demand"
              value={`${totalDemand.toFixed(0)}h`}
              icon={Clock}
            />
            <LevelCard
              label="Total Capacity"
              value={`${totalCapacity.toFixed(0)}h`}
              icon={Users}
              color="text-primary"
            />
          </div>

          {/* 52-week mini heatmap */}
          <div className="border border-border rounded-lg p-3 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-foreground">52-Week Utilisation Overview</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-destructive/80" />
                  <span className="text-[8px] text-muted-foreground">&gt;100%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-amber-500/80" />
                  <span className="text-[8px] text-muted-foreground">80-100%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500/80" />
                  <span className="text-[8px] text-muted-foreground">50-80%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <span className="text-[8px] text-muted-foreground">&lt;50%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(26,1fr)] gap-0.5">
              {weekData.map(week => {
                const isCurrent = year === currentYear && week.weekNum === currentWeekNum;
                const isSelected = selectedWeek === week.weekNum;
                const bgColor = week.capacity === 0
                  ? "bg-muted"
                  : week.utilisation > 100
                    ? "bg-destructive/80"
                    : week.utilisation > 80
                      ? "bg-amber-500/80"
                      : week.utilisation > 50
                        ? "bg-emerald-500/80"
                        : "bg-muted";

                return (
                  <Tooltip key={week.weekIdx}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setSelectedWeek(prev => prev === week.weekNum ? null : week.weekNum);
                          setPage(Math.floor(week.weekIdx / WEEKS_PER_PAGE));
                        }}
                        className={cn(
                          "h-6 rounded-sm transition-all text-[7px] font-mono flex items-center justify-center",
                          bgColor,
                          isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                          isSelected && "ring-2 ring-foreground ring-offset-1 ring-offset-background",
                        )}
                      >
                        <span className={cn(
                          "leading-none",
                          week.utilisation > 50 ? "text-white" : "text-muted-foreground",
                        )}>
                          {week.weekNum}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-[10px]">
                      <div className="font-semibold">W{week.weekNum} — {format(week.startDate, "d MMM")}</div>
                      <div>Demand: {week.demand.toFixed(0)}h / Capacity: {week.capacity.toFixed(0)}h</div>
                      <div>Utilisation: {week.utilisation.toFixed(0)}% • {week.items.length} jobs</div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
            <div className="text-[8px] text-muted-foreground mt-1.5 text-center">
              Click any week to drill down • Current week highlighted with gold ring
            </div>
          </div>

          {/* Bar chart - demand vs capacity */}
          <div className="border border-border rounded-lg bg-card">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-[10px] font-bold text-foreground">Demand vs Capacity — Weekly Breakdown</span>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-6 text-[9px] px-2" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <span className="text-[10px] font-semibold text-foreground tabular-nums">
                  W{pageStart + 1}–W{pageEnd} (Rev {page + 1} of {totalPages})
                </span>
                <Button size="sm" variant="ghost" className="h-6 text-[9px] px-2" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="p-3">
              {/* Y-axis labels + bars */}
              <div className="flex gap-2">
                {/* Y axis */}
                <div className="flex flex-col justify-between h-48 py-1 text-[8px] text-muted-foreground tabular-nums w-8 text-right">
                  <span>{maxBarValue.toFixed(0)}h</span>
                  <span>{(maxBarValue * 0.75).toFixed(0)}h</span>
                  <span>{(maxBarValue * 0.5).toFixed(0)}h</span>
                  <span>{(maxBarValue * 0.25).toFixed(0)}h</span>
                  <span>0h</span>
                </div>

                {/* Bars */}
                <div className="flex-1 flex items-end gap-1 h-48 border-l border-b border-border/50 px-1 relative">
                  {/* Grid lines */}
                  {[0.25, 0.5, 0.75, 1].map(v => (
                    <div
                      key={v}
                      className="absolute left-0 right-0 border-t border-border/20"
                      style={{ bottom: `${v * 100}%` }}
                    />
                  ))}

                  {visibleWeeks.map(week => {
                    const demandH = maxBarValue > 0 ? (week.demand / maxBarValue) * 100 : 0;
                    const capH = maxBarValue > 0 ? (week.capacity / maxBarValue) * 100 : 0;
                    const isCurrent = year === currentYear && week.weekNum === currentWeekNum;
                    const isSelected = selectedWeek === week.weekNum;

                    return (
                      <Tooltip key={week.weekIdx}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setSelectedWeek(prev => prev === week.weekNum ? null : week.weekNum)}
                            className={cn(
                              "flex-1 flex items-end gap-px relative",
                              isSelected && "bg-foreground/5 rounded",
                            )}
                          >
                            {/* Capacity bar */}
                            <div
                              className="flex-1 rounded-t-sm bg-primary/20 border border-primary/30 transition-all"
                              style={{ height: `${capH}%` }}
                            />
                            {/* Demand bar */}
                            <div
                              className={cn(
                                "flex-1 rounded-t-sm transition-all border",
                                week.overloaded
                                  ? "bg-destructive/70 border-destructive"
                                  : week.utilisation > 80
                                    ? "bg-amber-500/70 border-amber-600"
                                    : "bg-emerald-500/70 border-emerald-600",
                              )}
                              style={{ height: `${demandH}%` }}
                            />
                            {/* Current week marker */}
                            {isCurrent && (
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-[10px]">
                          <div className="font-semibold">W{week.weekNum} — {format(week.startDate, "d MMM")}</div>
                          <div className="text-primary">Capacity: {week.capacity.toFixed(0)}h</div>
                          <div className={week.overloaded ? "text-destructive" : "text-emerald-600"}>
                            Demand: {week.demand.toFixed(0)}h ({week.utilisation.toFixed(0)}%)
                          </div>
                          <div className="text-muted-foreground">{week.items.length} jobs this week</div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>

              {/* X axis labels */}
              <div className="flex gap-1 ml-10 mt-1">
                {visibleWeeks.map(week => {
                  const isCurrent = year === currentYear && week.weekNum === currentWeekNum;
                  return (
                    <div key={week.weekIdx} className="flex-1 text-center">
                      <div className={cn(
                        "text-[7px] font-mono",
                        isCurrent ? "text-primary font-bold" : "text-muted-foreground",
                      )}>W{week.weekNum}</div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-2 ml-10">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" />
                  <span className="text-[8px] text-muted-foreground">Capacity</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500/70 border border-emerald-600" />
                  <span className="text-[8px] text-muted-foreground">Demand (OK)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-amber-500/70 border border-amber-600" />
                  <span className="text-[8px] text-muted-foreground">Demand (&gt;80%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-destructive/70 border border-destructive" />
                  <span className="text-[8px] text-muted-foreground">Overloaded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Utilisation table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-muted/30 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Weekly Detail — W{pageStart + 1} to W{pageEnd}</span>
              <span className="text-[9px] text-muted-foreground">Click a row to see jobs breakdown</span>
            </div>
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-muted/20 border-b border-border">
                  <th className="text-left px-3 py-1.5 font-semibold">Week</th>
                  <th className="text-left px-2 py-1.5 font-semibold">Dates</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Capacity</th>
                  <th className="text-center px-2 py-1.5 font-semibold">PM Hrs</th>
                  <th className="text-center px-2 py-1.5 font-semibold">WO Hrs</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Total Demand</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Jobs</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Utilisation</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Variance</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleWeeks.map(week => {
                  const variance = week.capacity - week.demand;
                  const isCurrent = year === currentYear && week.weekNum === currentWeekNum;
                  return (
                    <tr
                      key={week.weekIdx}
                      className={cn(
                        "border-b border-border/30 hover:bg-muted/10 cursor-pointer",
                        isCurrent && "bg-primary/5",
                        selectedWeek === week.weekNum && "bg-primary/10",
                      )}
                      onClick={() => setSelectedWeek(prev => prev === week.weekNum ? null : week.weekNum)}
                    >
                      <td className="px-3 py-1.5 font-mono font-semibold text-foreground">
                        W{week.weekNum}
                        {isCurrent && <span className="ml-1 text-[8px] text-primary font-normal">Now</span>}
                      </td>
                      <td className="px-2 py-1.5 text-muted-foreground">
                        {format(week.startDate, "d MMM")} – {format(week.endDate, "d MMM")}
                      </td>
                      <td className="text-center px-2 py-1.5 tabular-nums text-primary font-medium">{week.capacity.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 tabular-nums text-blue-600">{week.pmHours.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 tabular-nums text-emerald-600">{week.woHours.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 tabular-nums font-semibold text-foreground">{week.demand.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 tabular-nums text-muted-foreground">{week.items.length}</td>
                      <td className="text-center px-2 py-1.5">
                        {/* Visual bar + percentage */}
                        <div className="flex items-center gap-1 justify-center">
                          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                week.overloaded ? "bg-destructive" : week.utilisation > 80 ? "bg-amber-500" : "bg-emerald-500",
                              )}
                              style={{ width: `${Math.min(week.utilisation, 100)}%` }}
                            />
                          </div>
                          <span className={cn(
                            "tabular-nums font-semibold text-[9px]",
                            week.overloaded ? "text-destructive" : week.utilisation > 80 ? "text-amber-600" : "text-emerald-600",
                          )}>
                            {week.utilisation.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className={cn(
                        "text-center px-2 py-1.5 tabular-nums font-medium",
                        variance < 0 ? "text-destructive" : "text-emerald-600",
                      )}>
                        {variance >= 0 ? "+" : ""}{variance.toFixed(0)}h
                      </td>
                      <td className="text-center px-2 py-1.5">
                        {week.overloaded ? (
                          <Badge variant="destructive" className="text-[8px] px-1.5 py-0 h-4">Over</Badge>
                        ) : week.underloaded ? (
                          <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-amber-300 text-amber-600">Under</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-emerald-300 text-emerald-600">OK</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected week drill-down */}
          {selectedData && (
            <div className="border border-primary/30 rounded-lg bg-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  Week {selectedData.weekNum} Drill-Down — {format(selectedData.startDate, "d MMM")} to {format(selectedData.endDate, "d MMM yyyy")}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px] text-primary tabular-nums">Cap: {selectedData.capacity.toFixed(0)}h</span>
                  <span className="text-[10px] text-foreground font-semibold tabular-nums">Demand: {selectedData.demand.toFixed(0)}h</span>
                  <Badge
                    variant={selectedData.overloaded ? "destructive" : "outline"}
                    className="text-[8px] px-1.5 py-0 h-4"
                  >
                    {selectedData.utilisation.toFixed(0)}%
                  </Badge>
                </div>
              </div>

              {selectedData.items.length > 0 ? (
                <div className="border border-border rounded overflow-hidden">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="text-left px-2 py-1 font-semibold">Type</th>
                        <th className="text-left px-2 py-1 font-semibold">WO / PM</th>
                        <th className="text-left px-2 py-1 font-semibold">Task</th>
                        <th className="text-left px-2 py-1 font-semibold">Asset</th>
                        <th className="text-left px-2 py-1 font-semibold">Discipline</th>
                        <th className="text-left px-2 py-1 font-semibold">Frequency</th>
                        <th className="text-right px-2 py-1 font-semibold">Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedData.items.map((item, i) => (
                        <tr key={`${item.id}-${i}`} className="border-b border-border/30 hover:bg-muted/10">
                          <td className="px-2 py-1">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[8px] px-1 py-0 h-3.5",
                                WO_TYPE_CONFIG[item.woType]?.textColor || "text-muted-foreground",
                              )}
                            >
                              {item.woType}
                            </Badge>
                          </td>
                          <td className="px-2 py-1 font-mono text-muted-foreground">{item.woNumber || "PM"}</td>
                          <td className="px-2 py-1 text-foreground truncate max-w-[300px]">{item.taskName}</td>
                          <td className="px-2 py-1 text-muted-foreground font-mono">{item.assetNumber || "—"}</td>
                          <td className="px-2 py-1 text-muted-foreground">{item.discipline || "—"}</td>
                          <td className="px-2 py-1 text-muted-foreground">{item.frequency || "Once"}</td>
                          <td className="px-2 py-1 text-right tabular-nums font-semibold">{item.estimatedHours.toFixed(1)}h</td>
                        </tr>
                      ))}
                      <tr className="bg-muted/20 font-semibold">
                        <td colSpan={6} className="px-2 py-1 text-right text-foreground">Total</td>
                        <td className="px-2 py-1 text-right tabular-nums">{selectedData.demand.toFixed(1)}h</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarRange className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[10px] text-muted-foreground">No work planned for this week</p>
                  <p className="text-[9px] text-muted-foreground mt-1">Schedule WOs via the Forward Plan or Weekly Schedule</p>
                </div>
              )}
            </div>
          )}

          {/* Per-discipline breakdown (when "All" is selected) */}
          {selectedWC === "All" && (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-muted/30 border-b border-border">
                <span className="text-xs font-bold text-foreground">Discipline Breakdown — W{pageStart + 1} to W{pageEnd}</span>
              </div>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left px-3 py-1.5 font-semibold">Discipline</th>
                    <th className="text-center px-2 py-1.5 font-semibold">Personnel</th>
                    <th className="text-center px-2 py-1.5 font-semibold">Period Capacity</th>
                    <th className="text-center px-2 py-1.5 font-semibold">Period Demand</th>
                    <th className="text-center px-2 py-1.5 font-semibold">Utilisation</th>
                    <th className="text-center px-2 py-1.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {WORK_CENTRES.map(wc => {
                    let cap = 0;
                    let dem = 0;
                    let avgPersonnel = 0;
                    for (let w = pageStart; w < pageEnd; w++) {
                      const c = grid[wc.key]?.[w];
                      if (c) {
                        cap += c.personnel * c.hoursPerDay * DAYS_PER_WEEK * (c.loadingTarget / 100);
                        avgPersonnel += c.personnel;
                      }
                    }
                    avgPersonnel = avgPersonnel / (pageEnd - pageStart);
                    const wcItems = items.filter(i => mapDiscipline(i.discipline) === wc.key);
                    for (let w = pageStart; w < pageEnd; w++) {
                      const weekStart = startOfWeek(addWeeks(yearStart, w), { weekStartsOn: 1 });
                      const weekEnd = addDays(weekStart, 6);
                      const weekNum = w + 1;
                      const scheduled = wcItems.filter(i => {
                        if (!i.scheduledDate) return false;
                        try { return isWithinInterval(parseISO(i.scheduledDate), { start: weekStart, end: weekEnd }); }
                        catch { return false; }
                      });
                      const projected = wcItems.filter(i => i.source === "pm" && i.frequency && getWeeksForFrequency(i.frequency).includes(weekNum));
                      dem += [...scheduled, ...projected].reduce((s, i) => s + i.estimatedHours, 0);
                    }
                    const util = cap > 0 ? (dem / cap) * 100 : 0;
                    const Icon = WC_ICONS[wc.key] || Wrench;
                    return (
                      <tr key={wc.key} className="border-b border-border/30 hover:bg-muted/10">
                        <td className="px-3 py-1.5 font-medium text-foreground">
                          <div className="flex items-center gap-1.5">
                            <Icon className="w-3 h-3 text-muted-foreground" />
                            {wc.label}
                          </div>
                        </td>
                        <td className="text-center px-2 py-1.5 tabular-nums text-muted-foreground">{avgPersonnel.toFixed(0)} avg</td>
                        <td className="text-center px-2 py-1.5 tabular-nums text-primary">{cap.toFixed(0)}h</td>
                        <td className="text-center px-2 py-1.5 tabular-nums font-semibold">{dem.toFixed(0)}h</td>
                        <td className="text-center px-2 py-1.5">
                          <div className="flex items-center gap-1 justify-center">
                            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  util > 100 ? "bg-destructive" : util > 80 ? "bg-amber-500" : "bg-emerald-500",
                                )}
                                style={{ width: `${Math.min(util, 100)}%` }}
                              />
                            </div>
                            <span className={cn(
                              "tabular-nums font-semibold text-[9px]",
                              util > 100 ? "text-destructive" : util > 80 ? "text-amber-600" : "text-emerald-600",
                            )}>
                              {util.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center px-2 py-1.5">
                          {util > 100 ? (
                            <Badge variant="destructive" className="text-[8px] px-1.5 py-0 h-4">Over</Badge>
                          ) : util < 50 && cap > 0 ? (
                            <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-amber-300 text-amber-600">Under</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-4 border-emerald-300 text-emerald-600">OK</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function LevelCard({ label, value, icon: Icon, color, bg }: {
  label: string; value: string; icon: React.ElementType; color?: string; bg?: string;
}) {
  return (
    <div className={cn("border rounded-lg px-3 py-2", bg || "bg-card border-border")}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className={cn("w-3.5 h-3.5", color || "text-muted-foreground")} />
        <span className="text-[9px] text-muted-foreground">{label}</span>
      </div>
      <span className={cn("text-sm font-bold tabular-nums", color || "text-foreground")}>{value}</span>
    </div>
  );
}
