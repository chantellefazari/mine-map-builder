import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search, ChevronLeft, ChevronRight, Undo2, Save, CalendarDays,
  Pencil, X, Sparkles, Calendar,
} from "lucide-react";
import {
  addDays, addWeeks, startOfWeek, format, isWithinInterval,
  getISOWeek, isSameWeek,
} from "date-fns";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

function freqToDays(freq: string): number {
  if (!freq) return 28;
  const lower = freq.toLowerCase().trim();
  if (lower === "daily") return 1;
  const match = lower.match(/^(\d+)\s*week/i);
  if (match) return parseInt(match[1]) * 7;
  if (lower.includes("month")) return 30;
  if (lower.includes("quarter") || lower.includes("13")) return 91;
  return 28;
}

function freqToExpectedPerWeek(freq: string): number {
  const days = freqToDays(freq);
  if (days === 1) return 7;
  if (days <= 7) return 1;
  return 1; // for multi-week, still show 0/1 per week
}

interface DayOccurrence {
  date: Date;
  dayLabel: string;
  dayName: string;
  status: "Scheduled" | "Projected";
}

interface WeekCell {
  weekStart: Date;
  weekEnd: Date;
  weekNum: number;
  dateLabel: string;
  actual: number;
  expected: number;
  days: DayOccurrence[];
  isCurrent: boolean;
  isPast: boolean;
}

interface PMRow {
  id: string;
  name: string;
  assetNumber: string;
  frequency: string;
  discipline: string;
  freqDays: number;
  expectedPerWeek: number;
  weeks: WeekCell[];
}

const DISCIPLINE_FILTERS = [
  { key: "All", label: "All" },
  { key: "Mechanical", label: "Mechanical" },
  { key: "Electrical", label: "Electrical" },
  { key: "Mobile", label: "Mobile & LVs" },
];

export function PlannerForwardPlanTab({ items }: Props) {
  const now = useMemo(() => new Date(), []);
  const todayWeekStart = useMemo(() => startOfWeek(now, { weekStartsOn: 3 }), [now]);

  const [weekOffset, setWeekOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const [expandedCell, setExpandedCell] = useState<{ pmId: string; weekIdx: number } | null>(null);

  const NUM_WEEKS = 13; // quarter view
  const viewStart = useMemo(() => addWeeks(todayWeekStart, weekOffset - 2), [todayWeekStart, weekOffset]);

  // Build week columns
  const weekColumns = useMemo(() => {
    const cols: { start: Date; end: Date; weekNum: number; dateLabel: string; isCurrent: boolean; isPast: boolean }[] = [];
    for (let i = 0; i < NUM_WEEKS; i++) {
      const start = addWeeks(viewStart, i);
      const end = addDays(start, 6);
      const isCurrent = isSameWeek(now, start, { weekStartsOn: 3 });
      const isPast = end < now && !isCurrent;
      cols.push({
        start, end,
        weekNum: getISOWeek(start),
        dateLabel: format(start, "dd/MM"),
        isCurrent,
        isPast,
      });
    }
    return cols;
  }, [viewStart, now]);

  // Get unique PMs
  const pmItems = useMemo(() => {
    const map = new Map<string, PlannerItem>();
    for (const item of items) {
      if (item.source === "pm" && !map.has(item.sourceId)) {
        map.set(item.sourceId, item);
      }
    }
    return Array.from(map.values());
  }, [items]);

  // Apply filters
  const filteredPMs = useMemo(() => {
    let result = pmItems;
    if (filterDiscipline !== "All") {
      result = result.filter(pm => pm.discipline === filterDiscipline);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(pm =>
        pm.taskName.toLowerCase().includes(q) ||
        pm.assetNumber.toLowerCase().includes(q)
      );
    }
    return result;
  }, [pmItems, filterDiscipline, searchQuery]);

  // Discipline counts
  const disciplineCounts = useMemo(() => {
    const counts: Record<string, number> = { All: pmItems.length };
    for (const pm of pmItems) {
      counts[pm.discipline] = (counts[pm.discipline] || 0) + 1;
    }
    return counts;
  }, [pmItems]);

  // Build PM rows with weekly occurrence data
  const pmRows: PMRow[] = useMemo(() => {
    return filteredPMs.map(pm => {
      const freqDays = freqToDays(pm.frequency);
      const expectedPerWeek = freqToExpectedPerWeek(pm.frequency);
      const adj = adjustments[pm.sourceId] || 0;

      // Project occurrences across the full view window
      const allStart = weekColumns[0].start;
      const allEnd = weekColumns[weekColumns.length - 1].end;

      // Generate all occurrence dates
      const occDates: Date[] = [];
      let d = addDays(startOfWeek(new Date("2026-03-25"), { weekStartsOn: 3 }), adj); // anchor date
      // Walk forward to find occurrences in range
      while (d <= allEnd) {
        if (d >= allStart) {
          if (freqDays === 1) {
            // Daily: all 7 days in each week
            occDates.push(new Date(d));
          } else {
            occDates.push(new Date(d));
          }
        }
        d = addDays(d, freqDays === 1 ? 1 : freqDays);
      }

      const weeks: WeekCell[] = weekColumns.map(wc => {
        const daysInWeek: DayOccurrence[] = [];
        const dayNames = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];

        for (const occ of occDates) {
          if (isWithinInterval(occ, { start: wc.start, end: wc.end })) {
            const dayOfWeek = Math.floor((occ.getTime() - wc.start.getTime()) / (86400000));
            daysInWeek.push({
              date: occ,
              dayLabel: format(occ, "dd MMM"),
              dayName: dayNames[Math.min(dayOfWeek, 6)] || format(occ, "EEE"),
              status: occ <= now ? "Scheduled" : "Projected",
            });
          }
        }

        return {
          weekStart: wc.start,
          weekEnd: wc.end,
          weekNum: wc.weekNum,
          dateLabel: wc.dateLabel,
          actual: daysInWeek.length,
          expected: expectedPerWeek,
          days: daysInWeek,
          isCurrent: wc.isCurrent,
          isPast: wc.isPast,
        };
      });

      return {
        id: pm.sourceId,
        name: pm.taskName,
        assetNumber: pm.assetNumber,
        frequency: pm.frequency,
        discipline: pm.discipline,
        freqDays,
        expectedPerWeek,
        weeks,
      };
    });
  }, [filteredPMs, weekColumns, adjustments, now]);

  const handleAdjust = useCallback((pmId: string, daysDelta: number) => {
    setAdjustments(prev => ({
      ...prev,
      [pmId]: (prev[pmId] || 0) + daysDelta,
    }));
    setExpandedCell(null);
  }, []);

  const hasAdjustments = Object.values(adjustments).some(v => v !== 0);

  const resetAll = () => {
    setAdjustments({});
    toast.success("All adjustments reset");
  };

  const saveAdjustments = () => {
    const count = Object.keys(adjustments).filter(k => adjustments[k] !== 0).length;
    toast.success(`${count} PM schedule adjustment${count !== 1 ? "s" : ""} saved`);
  };

  // Current week range label
  const viewRangeLabel = `W${weekColumns[0]?.weekNum} — ${format(weekColumns[0]?.start, "dd MMM")} – ${format(weekColumns[weekColumns.length - 1]?.end, "dd MMM")}...`;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top toolbar */}
      <div className="px-4 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              PM Forward Plan
            </h2>
            <p className="text-xs text-muted-foreground">Plan, preview, and control all preventive maintenance</p>
          </div>
          <div className="flex items-center gap-2">
            {hasAdjustments && (
              <>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={resetAll}>
                  <Undo2 className="w-3.5 h-3.5" /> Reset
                </Button>
                <Button size="sm" className="h-8 text-xs gap-1" onClick={saveAdjustments}>
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Discipline filter chips */}
        <div className="flex items-center gap-2 mb-3">
          {DISCIPLINE_FILTERS.map(df => (
            <button
              key={df.key}
              onClick={() => setFilterDiscipline(df.key)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                filterDiscipline === df.key
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/40"
              )}
            >
              {df.label} {disciplineCounts[df.key === "Mobile" ? "Mobile" : df.key] || 0}
            </button>
          ))}
        </div>

        {/* Search + navigation */}
        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search PMs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(now, "dd MMM yy")}
            </Button>
            <div className="flex items-center border border-border rounded-md">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(p => p - 4)}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-medium px-3 min-w-[140px] text-center">{viewRangeLabel}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(p => p + 4)}>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Button size="sm" className="h-8 text-xs gap-1 bg-foreground text-background hover:bg-foreground/90">
              <Sparkles className="w-3.5 h-3.5" /> Generate
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="flex-1">
        <div className="min-w-[1200px]">
          {/* Header row */}
          <div className="flex border-b border-border bg-muted/30 sticky top-0 z-10">
            <div className="w-[320px] flex-shrink-0 px-4 py-2 border-r border-border flex items-end">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-[220px]">PM Name</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">Freq</span>
            </div>
            <div className="flex-1 flex">
              {weekColumns.map((wc, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 text-center py-2 border-r border-border/40 last:border-r-0",
                    wc.isCurrent && "bg-primary/5"
                  )}
                >
                  <p className={cn(
                    "text-xs font-bold",
                    wc.isCurrent ? "text-primary" : "text-foreground"
                  )}>
                    W{wc.weekNum}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{wc.dateLabel}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PM rows */}
          {pmRows.length === 0 && (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No maintenance plans found
            </div>
          )}
          {pmRows.map(pm => (
            <div key={pm.id} className="flex border-b border-border/30 hover:bg-muted/5 transition-colors group relative">
              {/* PM name cell */}
              <div className="w-[320px] flex-shrink-0 px-4 py-2.5 border-r border-border flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-foreground truncate">{pm.name}</p>
                    <Pencil className="w-3 h-3 text-muted-foreground/50 flex-shrink-0 opacity-0 group-hover:opacity-100 cursor-pointer" />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{pm.assetNumber || "No asset linked"}</p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded flex-shrink-0">
                  {pm.frequency}
                </span>
              </div>

              {/* Week cells */}
              <div className="flex-1 flex">
                {pm.weeks.map((week, wIdx) => {
                  const isExpanded = expandedCell?.pmId === pm.id && expandedCell?.weekIdx === wIdx;
                  const hasOccurrences = week.actual > 0;
                  const isComplete = week.actual >= week.expected && hasOccurrences;
                  const isMissing = week.isPast && week.actual === 0 && week.expected > 0;

                  return (
                    <div
                      key={wIdx}
                      className={cn(
                        "flex-1 flex items-center justify-center py-2 border-r border-border/20 last:border-r-0 cursor-pointer relative",
                        week.isCurrent && "bg-primary/5",
                        isExpanded && "bg-primary/10"
                      )}
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedCell(null);
                        } else if (hasOccurrences) {
                          setExpandedCell({ pmId: pm.id, weekIdx: wIdx });
                        }
                      }}
                    >
                      {hasOccurrences ? (
                        <div className={cn(
                          "flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono font-semibold",
                          isComplete
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-muted border-border text-muted-foreground"
                        )}>
                          <CalendarDays className="w-3 h-3" />
                          <span>{week.actual}/{week.expected}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/40 font-mono">
                          {week.isPast ? "—" : `0/${week.expected}`}
                        </span>
                      )}

                      {/* Expanded popup */}
                      {isExpanded && (
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg min-w-[320px] p-0 overflow-hidden"
                          onClick={e => e.stopPropagation()}
                        >
                          {/* Popup header */}
                          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
                            <div>
                              <p className="text-xs font-bold text-foreground">{pm.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                W{week.weekNum} · {format(week.weekStart, "dd MMM")} – {format(week.weekEnd, "dd MMM")} · {pm.frequency}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold font-mono text-primary">{week.actual}/{week.expected}</span>
                              <button onClick={() => setExpandedCell(null)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Day rows */}
                          <div className="divide-y divide-border/30">
                            {week.days.map((day, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/20 transition-colors">
                                <span className="text-[10px] text-muted-foreground w-6">{day.dayName}</span>
                                <span className="text-xs font-bold text-foreground w-10">{format(day.date, "dd/MM")}</span>
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                <Badge className="text-[9px] h-4 bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">
                                  {day.status}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground flex-1">{format(day.date, "dd MMM")}</span>
                                <Pencil className="w-3 h-3 text-muted-foreground/50 hover:text-foreground cursor-pointer" />
                              </div>
                            ))}
                          </div>

                          {/* Shift controls */}
                          <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/20">
                            <span className="text-[10px] text-muted-foreground">Shift schedule</span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px] px-2"
                                onClick={() => handleAdjust(pm.id, -7)}
                              >
                                <ChevronLeft className="w-3 h-3" /> −1 wk
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px] px-2"
                                onClick={() => handleAdjust(pm.id, -1)}
                              >
                                −1d
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px] px-2"
                                onClick={() => handleAdjust(pm.id, 1)}
                              >
                                +1d
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px] px-2"
                                onClick={() => handleAdjust(pm.id, 7)}
                              >
                                +1 wk <ChevronRight className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{filteredPMs.length} PMs · {NUM_WEEKS}-week view</span>
        {hasAdjustments && (
          <span className="text-amber-600 font-medium">
            {Object.values(adjustments).filter(v => v !== 0).length} PMs adjusted
          </span>
        )}
      </div>
    </div>
  );
}
