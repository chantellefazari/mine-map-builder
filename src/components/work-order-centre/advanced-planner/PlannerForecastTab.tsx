import { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, TrendingUp, Calendar, Wrench,
  BarChart3, Clock, AlertTriangle, Users, Settings2, Zap, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  format, startOfWeek, addWeeks, getISOWeek, getYear, addDays,
  parseISO, isWithinInterval, startOfYear,
} from "date-fns";
import type { PlannerItem } from "./AdvancedPlannerView";
import { WO_TYPE_CONFIG } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

const WORK_CENTRES = [
  { key: "Mechanical", label: "Mechanical", icon: Wrench, short: "MECH" },
  { key: "Electrical", label: "Electrical", icon: Zap, short: "ELEC" },
  { key: "Mobile & LVS", label: "Mobile & LVS", icon: Truck, short: "MOB" },
] as const;

type WorkCentreKey = typeof WORK_CENTRES[number]["key"];

interface WorkCentreCapacity {
  personnel: number;
  hoursPerDay: number;
  loadingTarget: number; // percentage e.g. 80
}

const DEFAULT_CAPACITY: Record<string, WorkCentreCapacity> = {
  Mechanical: { personnel: 6, hoursPerDay: 10.5, loadingTarget: 80 },
  Electrical: { personnel: 4, hoursPerDay: 10.5, loadingTarget: 90 },
  "Mobile & LVS": { personnel: 3, hoursPerDay: 10.5, loadingTarget: 80 },
};

const FREQ_TO_WEEKS: Record<string, number[]> = {
  Daily: Array.from({ length: 52 }, (_, i) => i + 1),
  Weekly: Array.from({ length: 52 }, (_, i) => i + 1),
  Fortnightly: Array.from({ length: 26 }, (_, i) => i * 2 + 1),
  Monthly: [1, 5, 9, 13, 18, 22, 26, 31, 35, 39, 44, 48],
  "6-Monthly": [1, 26],
  Quarterly: [1, 13, 26, 39],
  Annually: [1],
  Yearly: [1],
};

function getWeeksForFrequency(freq: string): number[] {
  const key = Object.keys(FREQ_TO_WEEKS).find(k => freq.toLowerCase().includes(k.toLowerCase()));
  return key ? FREQ_TO_WEEKS[key] : [];
}

function mapItemToWorkCentre(item: PlannerItem): WorkCentreKey {
  const d = (item.discipline || "").toLowerCase();
  if (d.includes("elec")) return "Electrical";
  if (d.includes("mobile") || d.includes("lvs")) return "Mobile & LVS";
  return "Mechanical";
}

interface WeekBucket {
  weekNum: number;
  weekIndex: number;
  startDate: Date;
  endDate: Date;
  items: PlannerItem[];
  projectedPMs: PlannerItem[];
  totalHours: number;
  pmHours: number;
  woHours: number;
  byWorkCentre: Record<string, { hours: number; items: PlannerItem[] }>;
}

export function PlannerForecastTab({ items }: Props) {
  const [year, setYear] = useState(getYear(new Date()));
  const [filterWorkCentre, setFilterWorkCentre] = useState<"All" | WorkCentreKey>("All");
  const [filterType, setFilterType] = useState("All");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [tab, setTab] = useState<"heatmap" | "spreadsheet" | "capacity">("spreadsheet");

  // Capacity state - per work centre
  const [capacities, setCapacities] = useState<Record<string, WorkCentreCapacity>>(DEFAULT_CAPACITY);

  const updateCapacity = useCallback((wc: string, field: keyof WorkCentreCapacity, val: number) => {
    setCapacities(prev => ({
      ...prev,
      [wc]: { ...prev[wc], [field]: val },
    }));
  }, []);

  const yearStart = startOfYear(new Date(year, 0, 1));
  const DAYS_PER_WEEK = 7;

  const weekData = useMemo(() => {
    const weeks: WeekBucket[] = [];

    let filteredItems = items;
    if (filterType !== "All") filteredItems = filteredItems.filter(i => i.woType === filterType);

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

      // Group by work centre
      const byWorkCentre: Record<string, { hours: number; items: PlannerItem[] }> = {};
      for (const wc of WORK_CENTRES) {
        const wcItems = allWeekItems.filter(i => mapItemToWorkCentre(i) === wc.key);
        byWorkCentre[wc.key] = {
          hours: wcItems.reduce((s, i) => s + i.estimatedHours, 0),
          items: wcItems,
        };
      }

      const totalHours = allWeekItems.reduce((s, i) => s + i.estimatedHours, 0);
      const pmHours = allWeekItems.filter(i => i.woType === "PM" || i.source === "pm").reduce((s, i) => s + i.estimatedHours, 0);

      weeks.push({
        weekNum,
        weekIndex: w,
        startDate: weekStart,
        endDate: weekEnd,
        items: weekItems,
        projectedPMs: projected,
        totalHours,
        pmHours,
        woHours: totalHours - pmHours,
        byWorkCentre,
      });
    }
    return weeks;
  }, [items, year, filterType]);

  // Capacity for a work centre per week (personnel × hoursPerDay × 7 days × loading%)
  const getWeeklyCapacity = useCallback((wc: string) => {
    const c = capacities[wc];
    if (!c) return 0;
    return c.personnel * c.hoursPerDay * DAYS_PER_WEEK;
  }, [capacities]);

  const getWeeklyAvailable = useCallback((wc: string) => {
    const c = capacities[wc];
    if (!c) return 0;
    return c.personnel * c.hoursPerDay * DAYS_PER_WEEK * (c.loadingTarget / 100);
  }, [capacities]);

  const totalWeeklyCapacity = WORK_CENTRES.reduce((s, wc) => s + getWeeklyCapacity(wc.key), 0);
  const totalWeeklyAvailable = WORK_CENTRES.reduce((s, wc) => s + getWeeklyAvailable(wc.key), 0);

  const maxHours = Math.max(...weekData.map(w => w.totalHours), 1);
  const totalYearHours = weekData.reduce((s, w) => s + w.totalHours, 0);
  const totalPMHours = weekData.reduce((s, w) => s + w.pmHours, 0);
  const totalWOHours = weekData.reduce((s, w) => s + w.woHours, 0);
  const peakWeek = weekData.reduce((max, w) => w.totalHours > max.totalHours ? w : max, weekData[0]);
  const currentWeekNum = getISOWeek(new Date());
  const currentYear = getYear(new Date());

  const quarters = [
    { label: "Q1", weeks: weekData.slice(0, 13) },
    { label: "Q2", weeks: weekData.slice(13, 26) },
    { label: "Q3", weeks: weekData.slice(26, 39) },
    { label: "Q4", weeks: weekData.slice(39, 52) },
  ];

  const selectedData = selectedWeek !== null ? weekData.find(w => w.weekNum === selectedWeek) : null;

  return (
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
          <Select value={filterWorkCentre} onValueChange={(v: "All" | WorkCentreKey) => setFilterWorkCentre(v)}>
            <SelectTrigger className="h-6 w-32 text-[10px]"><SelectValue placeholder="Work Centre" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Work Centres</SelectItem>
              {WORK_CENTRES.map(wc => (
                <SelectItem key={wc.key} value={wc.key}>{wc.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-6 w-24 text-[10px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Breakdown">Breakdown</SelectItem>
              <SelectItem value="Shutdown">Shutdown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-6 gap-2 px-4 py-2 border-b border-border">
        <StatCard label="Total Year Hours" value={`${totalYearHours.toFixed(0)}h`} icon={Clock} />
        <StatCard label="PM Hours" value={`${totalPMHours.toFixed(0)}h`} icon={Calendar} color="text-blue-600" />
        <StatCard label="WO Hours" value={`${totalWOHours.toFixed(0)}h`} icon={Wrench} color="text-emerald-600" />
        <StatCard label="Weekly Capacity" value={`${totalWeeklyCapacity.toFixed(0)}h`} icon={Users} />
        <StatCard label="Available (Target)" value={`${totalWeeklyAvailable.toFixed(0)}h`} icon={BarChart3} color="text-primary" />
        <StatCard label="Peak Week" value={peakWeek ? `W${peakWeek.weekNum} (${peakWeek.totalHours.toFixed(0)}h)` : "—"} icon={AlertTriangle} color="text-amber-600" />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-2 mb-0 w-fit h-7">
          <TabsTrigger value="spreadsheet" className="text-[10px] h-5 px-3 gap-1">
            <BarChart3 className="w-3 h-3" /> Spreadsheet
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="text-[10px] h-5 px-3 gap-1">
            <Calendar className="w-3 h-3" /> Heatmap
          </TabsTrigger>
          <TabsTrigger value="capacity" className="text-[10px] h-5 px-3 gap-1">
            <Settings2 className="w-3 h-3" /> Capacity Setup
          </TabsTrigger>
        </TabsList>

        {/* SPREADSHEET VIEW */}
        <TabsContent value="spreadsheet" className="flex-1 min-h-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] whitespace-nowrap">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="text-left px-2 py-1.5 font-semibold sticky left-0 bg-muted/50 z-10 min-w-[100px]">Work Centre</th>
                        <th className="text-left px-2 py-1.5 font-semibold sticky left-[100px] bg-muted/50 z-10 min-w-[70px]">Metric</th>
                        {weekData.map(w => {
                          const isCurrent = year === currentYear && w.weekNum === currentWeekNum;
                          return (
                            <th
                              key={w.weekNum}
                              className={cn(
                                "text-center px-1 py-1.5 font-medium min-w-[52px]",
                                isCurrent && "bg-primary/10"
                              )}
                            >
                              <div className="text-[9px]">W{w.weekNum}</div>
                              <div className="text-[8px] text-muted-foreground font-normal">{format(w.startDate, "d/M")}</div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {(filterWorkCentre === "All" ? WORK_CENTRES : WORK_CENTRES.filter(wc => wc.key === filterWorkCentre)).map((wc) => {
                        const cap = capacities[wc.key];
                        const weeklyCapHrs = getWeeklyCapacity(wc.key);
                        const weeklyAvail = getWeeklyAvailable(wc.key);

                        return (
                          <>
                            {/* Available Hours Row */}
                            <tr key={`${wc.key}-avail`} className="border-b border-border/30">
                              <td rowSpan={4} className="px-2 py-1 font-semibold text-foreground sticky left-0 bg-card z-10 border-r border-border/30 align-top">
                                <div className="flex items-center gap-1.5">
                                  <wc.icon className="w-3 h-3 text-muted-foreground" />
                                  <div>
                                    <div className="text-[10px]">{wc.label}</div>
                                    <div className="text-[8px] text-muted-foreground font-normal">
                                      {cap.personnel}p × {cap.hoursPerDay}h × {DAYS_PER_WEEK}d
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-2 py-1 text-muted-foreground sticky left-[100px] bg-card z-10">Available</td>
                              {weekData.map(w => (
                                <td key={w.weekNum} className="text-center px-1 py-1 text-muted-foreground tabular-nums">
                                  {weeklyAvail.toFixed(0)}
                                </td>
                              ))}
                            </tr>
                            {/* Planned Hours Row */}
                            <tr key={`${wc.key}-planned`} className="border-b border-border/30">
                              <td className="px-2 py-1 text-muted-foreground sticky left-[100px] bg-card z-10">Planned</td>
                              {weekData.map(w => {
                                const hrs = w.byWorkCentre[wc.key]?.hours || 0;
                                return (
                                  <td key={w.weekNum} className="text-center px-1 py-1 font-medium text-foreground tabular-nums">
                                    {hrs > 0 ? hrs.toFixed(0) : "—"}
                                  </td>
                                );
                              })}
                            </tr>
                            {/* Remaining Row */}
                            <tr key={`${wc.key}-remain`} className="border-b border-border/30">
                              <td className="px-2 py-1 text-muted-foreground sticky left-[100px] bg-card z-10">Remaining</td>
                              {weekData.map(w => {
                                const hrs = w.byWorkCentre[wc.key]?.hours || 0;
                                const remaining = weeklyAvail - hrs;
                                return (
                                  <td key={w.weekNum} className={cn(
                                    "text-center px-1 py-1 tabular-nums font-medium",
                                    remaining < 0 ? "text-destructive" : remaining < weeklyAvail * 0.1 ? "text-amber-600" : "text-emerald-600"
                                  )}>
                                    {remaining.toFixed(0)}
                                  </td>
                                );
                              })}
                            </tr>
                            {/* Loading % Row */}
                            <tr key={`${wc.key}-load`} className="border-b border-border">
                              <td className="px-2 py-1 text-muted-foreground sticky left-[100px] bg-card z-10">Loading %</td>
                              {weekData.map(w => {
                                const hrs = w.byWorkCentre[wc.key]?.hours || 0;
                                const loadPct = weeklyCapHrs > 0 ? Math.round((hrs / weeklyCapHrs) * 100) : 0;
                                const overTarget = loadPct > cap.loadingTarget;
                                return (
                                  <td key={w.weekNum} className="text-center px-1 py-1 tabular-nums">
                                    <span className={cn(
                                      "inline-block px-1 rounded text-[9px] font-semibold",
                                      overTarget ? "bg-destructive/10 text-destructive" :
                                      loadPct > cap.loadingTarget * 0.8 ? "bg-amber-100 text-amber-700" :
                                      loadPct > 0 ? "bg-emerald-50 text-emerald-700" : "text-muted-foreground"
                                    )}>
                                      {loadPct > 0 ? `${loadPct}%` : "—"}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          </>
                        );
                      })}

                      {/* Total row when showing all */}
                      {filterWorkCentre === "All" && (
                        <>
                          <tr className="bg-muted/30 border-b border-border font-semibold">
                            <td className="px-2 py-1.5 sticky left-0 bg-muted/30 z-10">Combined Total</td>
                            <td className="px-2 py-1.5 text-muted-foreground sticky left-[100px] bg-muted/30 z-10">Planned</td>
                            {weekData.map(w => (
                              <td key={w.weekNum} className="text-center px-1 py-1.5 tabular-nums">
                                {w.totalHours > 0 ? w.totalHours.toFixed(0) : "—"}
                              </td>
                            ))}
                          </tr>
                          <tr className="bg-muted/30">
                            <td className="px-2 py-1.5 sticky left-0 bg-muted/30 z-10"></td>
                            <td className="px-2 py-1.5 text-muted-foreground sticky left-[100px] bg-muted/30 z-10">Loading %</td>
                            {weekData.map(w => {
                              const loadPct = totalWeeklyCapacity > 0 ? Math.round((w.totalHours / totalWeeklyCapacity) * 100) : 0;
                              return (
                                <td key={w.weekNum} className="text-center px-1 py-1.5 tabular-nums">
                                  <span className={cn(
                                    "inline-block px-1 rounded text-[9px] font-semibold",
                                    loadPct > 85 ? "bg-destructive/10 text-destructive" :
                                    loadPct > 60 ? "bg-amber-100 text-amber-700" :
                                    loadPct > 0 ? "bg-emerald-50 text-emerald-700" : "text-muted-foreground"
                                  )}>
                                    {loadPct > 0 ? `${loadPct}%` : "—"}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* HEATMAP VIEW */}
        <TabsContent value="heatmap" className="flex-1 min-h-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {quarters.map(q => {
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
                        const loadPct = totalWeeklyCapacity > 0 ? (week.totalHours / totalWeeklyCapacity) * 100 : 0;

                        return (
                          <button
                            key={week.weekNum}
                            onClick={() => setSelectedWeek(prev => prev === week.weekNum ? null : week.weekNum)}
                            className={cn(
                              "h-12 rounded transition-all text-[8px] font-mono relative flex flex-col items-center justify-center gap-0.5",
                              isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                              isSelected && "ring-2 ring-foreground ring-offset-1 ring-offset-background",
                            )}
                            style={{
                              backgroundColor: intensity === 0
                                ? "hsl(var(--muted))"
                                : loadPct > 85 ? "hsl(0 84% 60% / 0.3)" :
                                  `hsl(var(--primary) / ${Math.max(0.15, intensity)})`,
                            }}
                            title={`W${week.weekNum} — ${format(week.startDate, "d MMM")} · ${week.totalHours.toFixed(0)}h · ${loadPct.toFixed(0)}%`}
                          >
                            <span className="text-muted-foreground">{week.weekNum}</span>
                            {week.totalHours > 0 && (
                              <span className="text-[7px] text-foreground/70">{loadPct.toFixed(0)}%</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="flex items-center gap-4 px-1">
                <span className="text-[9px] text-muted-foreground">Load:</span>
                <div className="flex items-center gap-0.5">
                  {[0, 0.2, 0.4, 0.6, 0.8, 1].map(v => (
                    <div key={v} className="w-4 h-3 rounded-sm" style={{
                      backgroundColor: v === 0 ? "hsl(var(--muted))" : `hsl(var(--primary) / ${Math.max(0.15, v)})`,
                    }} />
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground">Low → High</span>
                <div className="h-3 w-px bg-border" />
                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: "hsl(0 84% 60% / 0.3)" }} />
                <span className="text-[9px] text-muted-foreground">Over Target</span>
              </div>

              {/* Selected week detail */}
              {selectedData && (
                <div className="border border-border rounded-lg bg-card p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Week {selectedData.weekNum} — {format(selectedData.startDate, "d MMM")} to {format(selectedData.endDate, "d MMM yyyy")}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {selectedData.totalHours.toFixed(1)}h total
                    </span>
                  </div>
                  {/* Per work-centre breakdown */}
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {WORK_CENTRES.map(wc => {
                      const wcData = selectedData.byWorkCentre[wc.key];
                      const wcHrs = wcData?.hours || 0;
                      const wcAvail = getWeeklyAvailable(wc.key);
                      const pct = wcAvail > 0 ? Math.round((wcHrs / wcAvail) * 100) : 0;
                      return (
                        <div key={wc.key} className="bg-muted/30 rounded px-2 py-1.5">
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                            <wc.icon className="w-2.5 h-2.5" /> {wc.short}
                          </div>
                          <div className="text-[11px] font-bold text-foreground">{wcHrs.toFixed(0)}h <span className="font-normal text-muted-foreground">/ {wcAvail.toFixed(0)}h</span></div>
                          <div className="w-full h-1 bg-muted rounded-full mt-0.5">
                            <div className={cn("h-full rounded-full", pct > 100 ? "bg-destructive" : "bg-primary")} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {[...selectedData.items, ...selectedData.projectedPMs].map((item, i) => (
                      <div key={`${item.id}-${i}`} className="flex items-center gap-2 text-[10px] py-0.5">
                        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", WO_TYPE_CONFIG[item.woType]?.color || "bg-muted-foreground")} />
                        <span className="font-mono text-muted-foreground w-20 flex-shrink-0">{item.woNumber || "PM"}</span>
                        <span className="text-foreground truncate flex-1">{item.taskName}</span>
                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">{mapItemToWorkCentre(item)}</Badge>
                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">{item.frequency || item.woType}</Badge>
                      </div>
                    ))}
                    {selectedData.items.length === 0 && selectedData.projectedPMs.length === 0 && (
                      <span className="text-[10px] text-muted-foreground">No work planned for this week</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* CAPACITY SETUP */}
        <TabsContent value="capacity" className="flex-1 min-h-0 mt-0">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Work Centre Capacity Configuration</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Set the number of personnel, daily hours per person, and target loading percentage for each work centre. These values are used to calculate available capacity across the forecast.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {WORK_CENTRES.map(wc => {
                const cap = capacities[wc.key];
                const weeklyTotal = cap.personnel * cap.hoursPerDay * DAYS_PER_WEEK;
                const weeklyAvail = weeklyTotal * (cap.loadingTarget / 100);

                return (
                  <div key={wc.key} className="border border-border rounded-lg p-4 bg-card space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                        <wc.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{wc.label}</div>
                        <div className="text-[10px] text-muted-foreground">{wc.short}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-medium">Personnel (per day)</label>
                        <Input
                          type="number"
                          value={cap.personnel}
                          onChange={e => updateCapacity(wc.key, "personnel", Math.max(0, Number(e.target.value)))}
                          className="h-8 text-xs mt-0.5"
                          min={0}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-medium">Hours per Person per Day</label>
                        <Input
                          type="number"
                          step="0.5"
                          value={cap.hoursPerDay}
                          onChange={e => updateCapacity(wc.key, "hoursPerDay", Math.max(0, Number(e.target.value)))}
                          className="h-8 text-xs mt-0.5"
                          min={0}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-medium">Loading Target (%)</label>
                        <Input
                          type="number"
                          value={cap.loadingTarget}
                          onChange={e => updateCapacity(wc.key, "loadingTarget", Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="h-8 text-xs mt-0.5"
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>

                    <div className="border-t border-border pt-2 space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Weekly Total Hrs</span>
                        <span className="font-semibold text-foreground">{weeklyTotal.toFixed(1)}h</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Available (at {cap.loadingTarget}%)</span>
                        <span className="font-semibold text-primary">{weeklyAvail.toFixed(1)}h</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Annual Capacity</span>
                        <span className="font-semibold text-foreground">{(weeklyAvail * 52).toFixed(0)}h</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Combined summary */}
            <div className="border border-border rounded-lg p-3 bg-muted/20">
              <div className="text-xs font-bold text-foreground mb-2">Combined Capacity Summary</div>
              <div className="grid grid-cols-4 gap-3 text-[10px]">
                <div>
                  <span className="text-muted-foreground">Total Personnel</span>
                  <div className="text-sm font-bold text-foreground">{WORK_CENTRES.reduce((s, wc) => s + capacities[wc.key].personnel, 0)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Weekly Capacity</span>
                  <div className="text-sm font-bold text-foreground">{totalWeeklyCapacity.toFixed(0)}h</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Weekly Available</span>
                  <div className="text-sm font-bold text-primary">{totalWeeklyAvailable.toFixed(0)}h</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Annual Available</span>
                  <div className="text-sm font-bold text-foreground">{(totalWeeklyAvailable * 52).toFixed(0)}h</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg px-2.5 py-1.5">
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className={cn("w-3 h-3", color || "text-muted-foreground")} />
        <span className="text-[8px] text-muted-foreground">{label}</span>
      </div>
      <span className="text-xs font-bold text-foreground tabular-nums">{value}</span>
    </div>
  );
}
