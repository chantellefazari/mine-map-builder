import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, TrendingUp, Calendar, Wrench,
  BarChart3, Clock, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  format, startOfWeek, addWeeks, getISOWeek, getYear, addDays,
  parseISO, isWithinInterval, startOfYear,
} from "date-fns";
import type { PlannerItem } from "./AdvancedPlannerView";
import { WO_TYPE_CONFIG } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

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

interface WeekBucket {
  weekNum: number;
  startDate: Date;
  endDate: Date;
  items: PlannerItem[];
  projectedPMs: PlannerItem[];
  totalHours: number;
  pmHours: number;
  woHours: number;
}

export function PlannerForecastTab({ items }: Props) {
  const [year, setYear] = useState(getYear(new Date()));
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const yearStart = startOfYear(new Date(year, 0, 1));

  const weekData = useMemo(() => {
    const weeks: WeekBucket[] = [];

    let filteredItems = items;
    if (filterDiscipline !== "All") filteredItems = filteredItems.filter(i => i.discipline === filterDiscipline);
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
      const totalHours = allWeekItems.reduce((s, i) => s + i.estimatedHours, 0);
      const pmHours = allWeekItems.filter(i => i.woType === "PM" || i.source === "pm").reduce((s, i) => s + i.estimatedHours, 0);

      weeks.push({
        weekNum,
        startDate: weekStart,
        endDate: weekEnd,
        items: weekItems,
        projectedPMs: projected,
        totalHours,
        pmHours,
        woHours: totalHours - pmHours,
      });
    }
    return weeks;
  }, [items, year, filterDiscipline, filterType]);

  const maxHours = Math.max(...weekData.map(w => w.totalHours), 1);
  const totalYearHours = weekData.reduce((s, w) => s + w.totalHours, 0);
  const totalPMHours = weekData.reduce((s, w) => s + w.pmHours, 0);
  const totalWOHours = weekData.reduce((s, w) => s + w.woHours, 0);
  const avgWeeklyHours = totalYearHours / 52;
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
          <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
            <SelectTrigger className="h-6 w-28 text-[10px]"><SelectValue placeholder="Discipline" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Disciplines</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Instrumentation">Instrumentation</SelectItem>
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
      <div className="grid grid-cols-5 gap-3 px-4 py-3 border-b border-border">
        <StatCard label="Total Year Hours" value={`${totalYearHours.toFixed(0)}h`} icon={Clock} />
        <StatCard label="PM Hours" value={`${totalPMHours.toFixed(0)}h`} icon={Calendar} color="text-blue-600" />
        <StatCard label="WO Hours" value={`${totalWOHours.toFixed(0)}h`} icon={Wrench} color="text-emerald-600" />
        <StatCard label="Avg Weekly" value={`${avgWeeklyHours.toFixed(0)}h`} icon={BarChart3} />
        <StatCard label="Peak Week" value={peakWeek ? `W${peakWeek.weekNum} (${peakWeek.totalHours.toFixed(0)}h)` : "—"} icon={AlertTriangle} color="text-amber-600" />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {/* Heatmap by quarter */}
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

          {/* Legend */}
          <div className="flex items-center gap-4 px-1">
            <span className="text-[9px] text-muted-foreground">Load:</span>
            <div className="flex items-center gap-0.5">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map(v => (
                <div
                  key={v}
                  className="w-4 h-3 rounded-sm"
                  style={{
                    backgroundColor: v === 0
                      ? "hsl(var(--muted))"
                      : `hsl(var(--primary) / ${Math.max(0.15, v)})`,
                  }}
                />
              ))}
            </div>
            <span className="text-[9px] text-muted-foreground">Low → High</span>
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
                <span className="text-[10px] text-muted-foreground ml-auto">
                  {selectedData.totalHours.toFixed(1)}h total · {selectedData.pmHours.toFixed(1)}h PM · {selectedData.woHours.toFixed(1)}h WO
                </span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {[...selectedData.items, ...selectedData.projectedPMs].map((item, i) => (
                  <div key={`${item.id}-${i}`} className="flex items-center gap-2 text-[10px] py-0.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", WO_TYPE_CONFIG[item.woType]?.color || "bg-muted-foreground")} />
                    <span className="font-mono text-muted-foreground w-20 flex-shrink-0">{item.woNumber || "PM"}</span>
                    <span className="text-foreground truncate flex-1">{item.taskName}</span>
                    <span className="text-muted-foreground flex-shrink-0">{item.assetNumber}</span>
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
                  <th className="text-center px-2 py-1.5 font-semibold">PM Hours</th>
                  <th className="text-center px-2 py-1.5 font-semibold">WO Hours</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Avg/Week</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Items</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, m) => {
                  const monthWeeks = weekData.filter(w => w.startDate.getMonth() === m);
                  const totalH = monthWeeks.reduce((s, w) => s + w.totalHours, 0);
                  const pmH = monthWeeks.reduce((s, w) => s + w.pmHours, 0);
                  const woH = monthWeeks.reduce((s, w) => s + w.woHours, 0);
                  const itemCount = monthWeeks.reduce((s, w) => s + w.items.length + w.projectedPMs.length, 0);
                  return (
                    <tr key={m} className="border-b border-border/30 hover:bg-muted/10">
                      <td className="px-3 py-1.5 font-medium text-foreground">{format(new Date(year, m, 1), "MMMM")}</td>
                      <td className="text-center px-2 py-1.5 text-muted-foreground tabular-nums">{monthWeeks.length}</td>
                      <td className="text-center px-2 py-1.5 font-semibold text-foreground tabular-nums">{totalH.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 text-blue-600 tabular-nums">{pmH.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 text-emerald-600 tabular-nums">{woH.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 text-muted-foreground tabular-nums">{monthWeeks.length > 0 ? (totalH / monthWeeks.length).toFixed(0) : 0}h</td>
                      <td className="text-center px-2 py-1.5 text-muted-foreground tabular-nums">{itemCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollArea>
    </div>
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
