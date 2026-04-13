import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, TrendingUp, Calendar, Wrench,
  BarChart3, Clock, AlertTriangle, PieChart, Percent, FileQuestion,
  ArrowDown, ArrowUp, Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  format, startOfWeek, addWeeks, getISOWeek, getYear, addDays,
  parseISO, isWithinInterval, startOfYear,
} from "date-fns";
import type { PlannerItem } from "./AdvancedPlannerView";
import { WO_TYPE_CONFIG } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

function getWeeksForFrequency(freq: string): number[] {
  if (!freq) return [];
  const f = freq.trim().toLowerCase();
  if (f === "daily") return Array.from({ length: 52 }, (_, i) => i + 1);
  const weekMatch = f.match(/^(\d+)\s*week/i);
  if (weekMatch) {
    const interval = parseInt(weekMatch[1], 10);
    if (interval <= 0) return [];
    if (interval === 1) return Array.from({ length: 52 }, (_, i) => i + 1);
    const weeks: number[] = [];
    for (let w = 1; w <= 52; w += interval) weeks.push(w);
    return weeks;
  }
  if (f === "weekly") return Array.from({ length: 52 }, (_, i) => i + 1);
  if (f === "fortnightly") return Array.from({ length: 26 }, (_, i) => i * 2 + 1);
  if (f === "monthly") return [1, 5, 9, 13, 18, 22, 26, 31, 35, 39, 44, 48];
  if (f === "quarterly") return [1, 13, 26, 39];
  if (f.includes("6-month")) return [1, 26];
  if (f === "annually" || f === "yearly") return [1];
  return [];
}

const TYPE_COLORS: Record<string, string> = {
  PM: "bg-blue-500",
  Planned: "bg-emerald-500",
  Breakdown: "bg-red-500",
  "Out of Scope": "bg-amber-500",
};

const TYPE_TEXT_COLORS: Record<string, string> = {
  PM: "text-blue-600",
  Planned: "text-emerald-600",
  Breakdown: "text-red-600",
  "Out of Scope": "text-amber-600",
};

interface WeekBucket {
  weekNum: number;
  startDate: Date;
  endDate: Date;
  items: PlannerItem[];
  projectedPMs: PlannerItem[];
  totalHours: number;
  pmHours: number;
  plannedHours: number;
  breakdownHours: number;
  oosHours: number;
  totalItems: number;
  byType: Record<string, number>;
  byTypeHours: Record<string, number>;
}

type ViewMode = "heatmap" | "bars" | "percentage";

export function PlannerForecastTab({ items }: Props) {
  const [year, setYear] = useState(getYear(new Date()));
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterArea, setFilterArea] = useState("All");
  const [filterDutyType, setFilterDutyType] = useState("All");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("heatmap");

  const yearStart = startOfYear(new Date(year, 0, 1));

  const areas = useMemo(() => [...new Set(items.map(i => i.area).filter(Boolean))].sort(), [items]);
  const disciplines = useMemo(() => [...new Set(items.map(i => i.discipline).filter(Boolean))].sort(), [items]);

  const weekData = useMemo(() => {
    const weeks: WeekBucket[] = [];

    let filteredItems = items;
    if (filterDiscipline !== "All") filteredItems = filteredItems.filter(i => i.discipline === filterDiscipline);
    if (filterType !== "All") filteredItems = filteredItems.filter(i => i.woType === filterType);
    if (filterArea !== "All") filteredItems = filteredItems.filter(i => i.area === filterArea);
    if (filterDutyType !== "All") filteredItems = filteredItems.filter(i => (i.dutyType || "Online") === filterDutyType);

    const scheduledItems = filteredItems.filter(i => i.scheduledDate);
    const pmItems = filteredItems.filter(i => i.source === "pm" && i.frequency);

    for (let w = 0; w < 52; w++) {
      const weekStart = startOfWeek(addWeeks(yearStart, w), { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);
      const weekNum = getISOWeek(weekStart);

      const weekItems = scheduledItems.filter(i => {
        if (!i.scheduledDate) return false;
        try {
          const d = parseISO(i.scheduledDate);
          return isWithinInterval(d, { start: weekStart, end: weekEnd });
        } catch { return false; }
      });

      const projected: PlannerItem[] = [];
      for (const pm of pmItems) {
        const freqWeeks = getWeeksForFrequency(pm.frequency);
        if (freqWeeks.includes(weekNum)) projected.push(pm);
      }

      const allWeekItems = [...weekItems, ...projected];
      const byType: Record<string, number> = { PM: 0, Planned: 0, Breakdown: 0, "Out of Scope": 0 };
      const byTypeHours: Record<string, number> = { PM: 0, Planned: 0, Breakdown: 0, "Out of Scope": 0 };
      
      for (const item of allWeekItems) {
        const t = item.woType || (item.source === "pm" ? "PM" : "Planned");
        byType[t] = (byType[t] || 0) + 1;
        byTypeHours[t] = (byTypeHours[t] || 0) + item.estimatedHours;
      }

      const totalHours = allWeekItems.reduce((s, i) => s + i.estimatedHours, 0);

      weeks.push({
        weekNum,
        startDate: weekStart,
        endDate: weekEnd,
        items: weekItems,
        projectedPMs: projected,
        totalHours,
        pmHours: byTypeHours.PM || 0,
        plannedHours: byTypeHours.Planned || 0,
        breakdownHours: byTypeHours.Breakdown || 0,
        oosHours: byTypeHours["Out of Scope"] || 0,
        totalItems: allWeekItems.length,
        byType,
        byTypeHours,
      });
    }
    return weeks;
  }, [items, year, filterDiscipline, filterType, filterArea, filterDutyType]);

  const maxHours = Math.max(...weekData.map(w => w.totalHours), 1);
  const totalYearHours = weekData.reduce((s, w) => s + w.totalHours, 0);
  const totalPMHours = weekData.reduce((s, w) => s + w.pmHours, 0);
  const totalPlannedHours = weekData.reduce((s, w) => s + w.plannedHours, 0);
  const totalBreakdownHours = weekData.reduce((s, w) => s + w.breakdownHours, 0);
  const totalOOSHours = weekData.reduce((s, w) => s + w.oosHours, 0);
  const avgWeeklyHours = totalYearHours / 52;
  const peakWeek = weekData.reduce((max, w) => w.totalHours > max.totalHours ? w : max, weekData[0]);
  const currentWeekNum = getISOWeek(new Date());
  const currentYear = getYear(new Date());

  // Percentage calculations
  const pctPM = totalYearHours > 0 ? ((totalPMHours / totalYearHours) * 100) : 0;
  const pctPlanned = totalYearHours > 0 ? ((totalPlannedHours / totalYearHours) * 100) : 0;
  const pctBreakdown = totalYearHours > 0 ? ((totalBreakdownHours / totalYearHours) * 100) : 0;
  const pctOOS = totalYearHours > 0 ? ((totalOOSHours / totalYearHours) * 100) : 0;

  // Area breakdown
  const areaBreakdown = useMemo(() => {
    const map: Record<string, { hours: number; items: number }> = {};
    for (const w of weekData) {
      const allItems = [...w.items, ...w.projectedPMs];
      for (const item of allItems) {
        const area = item.area || "Unassigned";
        if (!map[area]) map[area] = { hours: 0, items: 0 };
        map[area].hours += item.estimatedHours;
        map[area].items += 1;
      }
    }
    return Object.entries(map).sort((a, b) => b[1].hours - a[1].hours);
  }, [weekData]);

  // Discipline breakdown
  const disciplineBreakdown = useMemo(() => {
    const map: Record<string, { hours: number; items: number }> = {};
    for (const w of weekData) {
      const allItems = [...w.items, ...w.projectedPMs];
      for (const item of allItems) {
        const disc = item.discipline || "Unassigned";
        if (!map[disc]) map[disc] = { hours: 0, items: 0 };
        map[disc].hours += item.estimatedHours;
        map[disc].items += 1;
      }
    }
    return Object.entries(map).sort((a, b) => b[1].hours - a[1].hours);
  }, [weekData]);

  // Duty type breakdown
  const dutyBreakdown = useMemo(() => {
    let online = 0, offline = 0;
    for (const w of weekData) {
      const allItems = [...w.items, ...w.projectedPMs];
      for (const item of allItems) {
        if ((item.dutyType || "Online") === "Offline") offline += item.estimatedHours;
        else online += item.estimatedHours;
      }
    }
    return { online, offline };
  }, [weekData]);

  const quarters = [
    { label: "Q1", weeks: weekData.slice(0, 13) },
    { label: "Q2", weeks: weekData.slice(13, 26) },
    { label: "Q3", weeks: weekData.slice(26, 39) },
    { label: "Q4", weeks: weekData.slice(39, 52) },
  ];

  const selectedData = selectedWeek !== null ? weekData.find(w => w.weekNum === selectedWeek) : null;

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground">Yearly Forecast</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setYear(y => y - 1)}>
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <span className="text-sm font-bold text-foreground tabular-nums w-12 text-center">{year}</span>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setYear(y => y + 1)}>
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger className="h-6 w-24 text-[10px]"><SelectValue placeholder="Area" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Areas</SelectItem>
                {areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
              <SelectTrigger className="h-6 w-28 text-[10px]"><SelectValue placeholder="Discipline" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Disciplines</SelectItem>
                {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-6 w-24 text-[10px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="Breakdown">Breakdown</SelectItem>
                <SelectItem value="Out of Scope">Out of Scope</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDutyType} onValueChange={setFilterDutyType}>
              <SelectTrigger className="h-6 w-24 text-[10px]"><SelectValue placeholder="Duty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Duty</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <span className="w-px h-5 bg-border" />
            <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
              {(["heatmap", "bars", "percentage"] as ViewMode[]).map(mode => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  className="h-5 px-2 text-[10px]"
                  onClick={() => setViewMode(mode)}
                >
                  {mode === "heatmap" ? "Heat" : mode === "bars" ? "Bars" : "%"}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary cards - 2 rows */}
        <div className="px-4 py-3 border-b border-border space-y-2">
          {/* Row 1: Hour totals */}
          <div className="grid grid-cols-6 gap-3">
            <StatCard label="Total Year Hours" value={`${totalYearHours.toFixed(0)}h`} icon={Clock} />
            <StatCard label="PM Hours" value={`${totalPMHours.toFixed(0)}h`} icon={Calendar} color="text-blue-600" />
            <StatCard label="Planned Hours" value={`${totalPlannedHours.toFixed(0)}h`} icon={Wrench} color="text-emerald-600" />
            <StatCard label="Breakdown Hours" value={`${totalBreakdownHours.toFixed(0)}h`} icon={AlertTriangle} color="text-red-600" />
            <StatCard label="Out of Scope Hours" value={`${totalOOSHours.toFixed(0)}h`} icon={FileQuestion} color="text-amber-600" />
            <StatCard label="Avg Weekly" value={`${avgWeeklyHours.toFixed(0)}h`} icon={BarChart3} />
          </div>
          {/* Row 2: Percentages & peak */}
          <div className="grid grid-cols-6 gap-3">
            <PercentCard label="PM %" value={pctPM} color="bg-blue-500" />
            <PercentCard label="Planned %" value={pctPlanned} color="bg-emerald-500" />
            <PercentCard label="Breakdown %" value={pctBreakdown} color="bg-red-500" />
            <PercentCard label="Out of Scope %" value={pctOOS} color="bg-amber-500" />
            <div className="bg-card border border-border rounded-lg px-3 py-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] text-muted-foreground">Online / Offline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground tabular-nums">{dutyBreakdown.online.toFixed(0)}h</span>
                <span className="text-[9px] text-muted-foreground">/</span>
                <span className="text-xs font-bold text-foreground tabular-nums">{dutyBreakdown.offline.toFixed(0)}h</span>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span className="text-[9px] text-muted-foreground">Peak Week</span>
              </div>
              <span className="text-xs font-bold text-foreground tabular-nums">
                {peakWeek ? `W${peakWeek.weekNum} (${peakWeek.totalHours.toFixed(0)}h)` : "—"}
              </span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {/* Visualisation by quarter */}
            {viewMode === "heatmap" && quarters.map(q => {
              const qHours = q.weeks.reduce((s, w) => s + w.totalHours, 0);
              return (
                <div key={q.label}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-foreground w-8">{q.label}</span>
                    <span className="text-[9px] text-muted-foreground">{qHours.toFixed(0)}h total</span>
                  </div>
                  <div className="grid grid-cols-13 gap-1">
                    {q.weeks.map(week => {
                      const intensity = maxHours > 0 ? week.totalHours / maxHours : 0;
                      const isCurrent = year === currentYear && week.weekNum === currentWeekNum;
                      const isSelected = selectedWeek === week.weekNum;
                      return (
                        <button
                          key={week.weekNum}
                          onClick={() => setSelectedWeek(prev => prev === week.weekNum ? null : week.weekNum)}
                          className={cn(
                            "h-10 rounded transition-all text-[8px] font-mono relative flex items-end justify-center pb-0.5",
                            isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                            isSelected && "ring-2 ring-foreground ring-offset-1 ring-offset-background",
                          )}
                          style={{
                            backgroundColor: intensity === 0
                              ? "hsl(var(--muted))"
                              : `hsl(var(--primary) / ${Math.max(0.15, intensity)})`,
                          }}
                          title={`W${week.weekNum} — ${format(week.startDate, "d MMM")} · ${week.totalHours.toFixed(0)}h`}
                        >
                          <span className="text-muted-foreground">{week.weekNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Stacked bar view */}
            {viewMode === "bars" && (
              <div className="space-y-3">
                {quarters.map(q => (
                  <div key={q.label}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-foreground w-8">{q.label}</span>
                    </div>
                    <div className="grid grid-cols-13 gap-1 items-end" style={{ height: 80 }}>
                      {q.weeks.map(week => {
                        const h = maxHours > 0 ? (week.totalHours / maxHours) * 100 : 0;
                        const isCurrent = year === currentYear && week.weekNum === currentWeekNum;
                        const isSelected = selectedWeek === week.weekNum;
                        const pmPct = week.totalHours > 0 ? (week.pmHours / week.totalHours) * 100 : 0;
                        const plannedPct = week.totalHours > 0 ? (week.plannedHours / week.totalHours) * 100 : 0;
                        const bdPct = week.totalHours > 0 ? (week.breakdownHours / week.totalHours) * 100 : 0;
                        const oosPct = 100 - pmPct - plannedPct - bdPct;
                        return (
                          <Tooltip key={week.weekNum}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setSelectedWeek(prev => prev === week.weekNum ? null : week.weekNum)}
                                className={cn(
                                  "w-full rounded-t overflow-hidden flex flex-col-reverse",
                                  isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                                  isSelected && "ring-2 ring-foreground ring-offset-1 ring-offset-background",
                                )}
                                style={{ height: `${Math.max(h, 4)}%` }}
                              >
                                {week.totalHours > 0 && (
                                  <>
                                    <div className="w-full bg-blue-500" style={{ height: `${pmPct}%` }} />
                                    <div className="w-full bg-emerald-500" style={{ height: `${plannedPct}%` }} />
                                    <div className="w-full bg-red-500" style={{ height: `${bdPct}%` }} />
                                    <div className="w-full bg-amber-500" style={{ height: `${oosPct}%` }} />
                                  </>
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="text-[10px]">
                              <div className="font-bold">W{week.weekNum} — {format(week.startDate, "d MMM")}</div>
                              <div>Total: {week.totalHours.toFixed(1)}h</div>
                              <div className="text-blue-400">PM: {week.pmHours.toFixed(1)}h</div>
                              <div className="text-emerald-400">Planned: {week.plannedHours.toFixed(1)}h</div>
                              <div className="text-red-400">BD: {week.breakdownHours.toFixed(1)}h</div>
                              <div className="text-amber-400">OOS: {week.oosHours.toFixed(1)}h</div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-13 gap-1">
                      {q.weeks.map(week => (
                        <span key={week.weekNum} className="text-[7px] text-center text-muted-foreground font-mono">{week.weekNum}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Percentage view — OOS trend per week */}
            {viewMode === "percentage" && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-foreground">Weekly WO Type % Breakdown</div>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="text-left px-3 py-1.5 font-semibold">Week</th>
                        <th className="text-left px-2 py-1.5 font-semibold">Dates</th>
                        <th className="text-center px-2 py-1.5 font-semibold">Total Hrs</th>
                        <th className="text-center px-2 py-1.5 font-semibold text-blue-600">PM %</th>
                        <th className="text-center px-2 py-1.5 font-semibold text-emerald-600">Planned %</th>
                        <th className="text-center px-2 py-1.5 font-semibold text-red-600">BD %</th>
                        <th className="text-center px-2 py-1.5 font-semibold text-amber-600">OOS %</th>
                        <th className="text-left px-2 py-1.5 font-semibold w-[200px]">Split</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekData.filter(w => w.totalHours > 0).map(week => {
                        const pmP = (week.pmHours / week.totalHours) * 100;
                        const plP = (week.plannedHours / week.totalHours) * 100;
                        const bdP = (week.breakdownHours / week.totalHours) * 100;
                        const oosP = (week.oosHours / week.totalHours) * 100;
                        const isCurrent = year === currentYear && week.weekNum === currentWeekNum;
                        return (
                          <tr
                            key={week.weekNum}
                            className={cn(
                              "border-b border-border/30 hover:bg-muted/10 cursor-pointer",
                              isCurrent && "bg-primary/5",
                              selectedWeek === week.weekNum && "bg-muted/30"
                            )}
                            onClick={() => setSelectedWeek(prev => prev === week.weekNum ? null : week.weekNum)}
                          >
                            <td className="px-3 py-1.5 font-mono font-medium text-foreground">
                              W{week.weekNum}
                              {isCurrent && <Badge className="ml-1 text-[7px] px-1 py-0 h-3">NOW</Badge>}
                            </td>
                            <td className="px-2 py-1.5 text-muted-foreground">{format(week.startDate, "d MMM")} – {format(week.endDate, "d MMM")}</td>
                            <td className="text-center px-2 py-1.5 font-semibold tabular-nums">{week.totalHours.toFixed(0)}h</td>
                            <td className="text-center px-2 py-1.5 tabular-nums text-blue-600">{pmP.toFixed(0)}%</td>
                            <td className="text-center px-2 py-1.5 tabular-nums text-emerald-600">{plP.toFixed(0)}%</td>
                            <td className="text-center px-2 py-1.5 tabular-nums text-red-600">{bdP.toFixed(0)}%</td>
                            <td className={cn("text-center px-2 py-1.5 tabular-nums font-bold", oosP > 20 ? "text-red-600" : "text-amber-600")}>{oosP.toFixed(0)}%</td>
                            <td className="px-2 py-1.5">
                              <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                                <div className="bg-blue-500" style={{ width: `${pmP}%` }} />
                                <div className="bg-emerald-500" style={{ width: `${plP}%` }} />
                                <div className="bg-red-500" style={{ width: `${bdP}%` }} />
                                <div className="bg-amber-500" style={{ width: `${oosP}%` }} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 px-1">
              {viewMode === "heatmap" && (
                <>
                  <span className="text-[9px] text-muted-foreground">Load:</span>
                  <div className="flex items-center gap-0.5">
                    {[0, 0.2, 0.4, 0.6, 0.8, 1].map(v => (
                      <div key={v} className="w-4 h-3 rounded-sm" style={{
                        backgroundColor: v === 0 ? "hsl(var(--muted))" : `hsl(var(--primary) / ${Math.max(0.15, v)})`,
                      }} />
                    ))}
                  </div>
                  <span className="text-[9px] text-muted-foreground">Low → High</span>
                </>
              )}
              <div className="h-3 w-px bg-border" />
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1">
                  <div className={cn("w-2.5 h-2.5 rounded-sm", color)} />
                  <span className="text-[9px] text-muted-foreground">{type}</span>
                </div>
              ))}
              <div className="h-3 w-px bg-border" />
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm ring-2 ring-primary ring-offset-1 ring-offset-background" />
                <span className="text-[9px] text-muted-foreground">Current Week</span>
              </div>
            </div>

            {/* Selected week detail */}
            {selectedData && (
              <div className="border border-border rounded-lg bg-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    Week {selectedData.weekNum} — {format(selectedData.startDate, "d MMM")} to {format(selectedData.endDate, "d MMM yyyy")}
                  </span>
                  <div className="flex items-center gap-3 ml-auto">
                    {Object.entries(selectedData.byTypeHours).map(([type, hrs]) => hrs > 0 && (
                      <span key={type} className={cn("text-[10px] font-semibold", TYPE_TEXT_COLORS[type] || "text-muted-foreground")}>
                        {type}: {(hrs as number).toFixed(1)}h
                        ({selectedData.totalHours > 0 ? (((hrs as number) / selectedData.totalHours) * 100).toFixed(0) : 0}%)
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {[...selectedData.items, ...selectedData.projectedPMs].map((item, i) => (
                    <div key={`${item.id}-${i}`} className="flex items-center gap-2 text-[10px] py-0.5">
                      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", TYPE_COLORS[item.woType] || "bg-muted-foreground")} />
                      <span className="font-mono text-muted-foreground w-20 flex-shrink-0">{item.woNumber || "PM"}</span>
                      <span className="text-foreground truncate flex-1">{item.taskName}</span>
                      <span className="text-muted-foreground flex-shrink-0">{item.assetNumber}</span>
                      <span className="text-muted-foreground flex-shrink-0 w-12 text-right tabular-nums">{item.estimatedHours}h</span>
                      <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 flex-shrink-0">{item.frequency || item.woType}</Badge>
                    </div>
                  ))}
                  {selectedData.items.length === 0 && selectedData.projectedPMs.length === 0 && (
                    <span className="text-[10px] text-muted-foreground">No work planned for this week</span>
                  )}
                </div>
              </div>
            )}

            {/* Monthly summary table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-muted/30 border-b border-border">
                <span className="text-xs font-bold text-foreground">Monthly Summary</span>
              </div>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left px-3 py-1.5 font-semibold">Month</th>
                    <th className="text-center px-2 py-1.5 font-semibold">Weeks</th>
                    <th className="text-center px-2 py-1.5 font-semibold">Total Hours</th>
                    <th className="text-center px-2 py-1.5 font-semibold text-blue-600">PM</th>
                    <th className="text-center px-2 py-1.5 font-semibold text-emerald-600">Planned</th>
                    <th className="text-center px-2 py-1.5 font-semibold text-red-600">BD</th>
                    <th className="text-center px-2 py-1.5 font-semibold text-amber-600">OOS</th>
                    <th className="text-center px-2 py-1.5 font-semibold text-amber-600">OOS %</th>
                    <th className="text-center px-2 py-1.5 font-semibold">Avg/Week</th>
                    <th className="text-center px-2 py-1.5 font-semibold">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 12 }, (_, m) => {
                    const monthWeeks = weekData.filter(w => w.startDate.getMonth() === m);
                    const totalH = monthWeeks.reduce((s, w) => s + w.totalHours, 0);
                    const pmH = monthWeeks.reduce((s, w) => s + w.pmHours, 0);
                    const plH = monthWeeks.reduce((s, w) => s + w.plannedHours, 0);
                    const bdH = monthWeeks.reduce((s, w) => s + w.breakdownHours, 0);
                    const oosH = monthWeeks.reduce((s, w) => s + w.oosHours, 0);
                    const itemCount = monthWeeks.reduce((s, w) => s + w.items.length + w.projectedPMs.length, 0);
                    const oosPercent = totalH > 0 ? ((oosH / totalH) * 100) : 0;
                    return (
                      <tr key={m} className="border-b border-border/30 hover:bg-muted/10">
                        <td className="px-3 py-1.5 font-medium text-foreground">{format(new Date(year, m, 1), "MMMM")}</td>
                        <td className="text-center px-2 py-1.5 text-muted-foreground tabular-nums">{monthWeeks.length}</td>
                        <td className="text-center px-2 py-1.5 font-semibold text-foreground tabular-nums">{totalH.toFixed(0)}h</td>
                        <td className="text-center px-2 py-1.5 text-blue-600 tabular-nums">{pmH.toFixed(0)}h</td>
                        <td className="text-center px-2 py-1.5 text-emerald-600 tabular-nums">{plH.toFixed(0)}h</td>
                        <td className="text-center px-2 py-1.5 text-red-600 tabular-nums">{bdH.toFixed(0)}h</td>
                        <td className="text-center px-2 py-1.5 text-amber-600 tabular-nums">{oosH.toFixed(0)}h</td>
                        <td className={cn("text-center px-2 py-1.5 font-bold tabular-nums", oosPercent > 20 ? "text-red-600" : "text-amber-600")}>{oosPercent.toFixed(0)}%</td>
                        <td className="text-center px-2 py-1.5 text-muted-foreground tabular-nums">{monthWeeks.length > 0 ? (totalH / monthWeeks.length).toFixed(0) : 0}h</td>
                        <td className="text-center px-2 py-1.5 text-muted-foreground tabular-nums">{itemCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Area & Discipline breakdown side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Area breakdown */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-muted/30 border-b border-border">
                  <span className="text-xs font-bold text-foreground">Breakdown by Area</span>
                </div>
                <div className="p-2 space-y-1.5">
                  {areaBreakdown.slice(0, 10).map(([area, data]) => {
                    const pct = totalYearHours > 0 ? (data.hours / totalYearHours) * 100 : 0;
                    return (
                      <div key={area} className="flex items-center gap-2">
                        <span className="text-[10px] text-foreground w-24 truncate font-medium">{area}</span>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums w-14 text-right">{data.hours.toFixed(0)}h</span>
                        <span className="text-[9px] text-muted-foreground tabular-nums w-10 text-right">{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                  {areaBreakdown.length === 0 && <span className="text-[10px] text-muted-foreground">No data</span>}
                </div>
              </div>

              {/* Discipline breakdown */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-muted/30 border-b border-border">
                  <span className="text-xs font-bold text-foreground">Breakdown by Discipline</span>
                </div>
                <div className="p-2 space-y-1.5">
                  {disciplineBreakdown.slice(0, 10).map(([disc, data]) => {
                    const pct = totalYearHours > 0 ? (data.hours / totalYearHours) * 100 : 0;
                    return (
                      <div key={disc} className="flex items-center gap-2">
                        <span className="text-[10px] text-foreground w-24 truncate font-medium">{disc}</span>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums w-14 text-right">{data.hours.toFixed(0)}h</span>
                        <span className="text-[9px] text-muted-foreground tabular-nums w-10 text-right">{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                  {disciplineBreakdown.length === 0 && <span className="text-[10px] text-muted-foreground">No data</span>}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2">
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className={cn("w-3.5 h-3.5", color || "text-muted-foreground")} />
        <span className="text-[9px] text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold text-foreground tabular-nums">{value}</span>
    </div>
  );
}

function PercentCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2">
      <div className="flex items-center gap-1.5 mb-1">
        <div className={cn("w-2 h-2 rounded-sm", color)} />
        <span className="text-[9px] text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-foreground tabular-nums">{value.toFixed(1)}%</span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
