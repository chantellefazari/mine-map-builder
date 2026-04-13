import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Undo2, Save, CalendarDays, Pencil, Sparkles, Calendar,
  Clock, Wrench, MapPin, AlertTriangle, Package, Shield,
} from "lucide-react";
import {
  addDays, addWeeks, startOfWeek, format, isWithinInterval,
  getISOWeek, isSameWeek,
} from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";
import type { WOMaterialSummary } from "@/hooks/useMaterialReadiness";
import { useAssetCriticality, CRITICALITY_CONFIG, type CriticalityRating } from "@/hooks/useAssetCriticality";

interface Props {
  items: PlannerItem[];
  getReadiness?: (workOrderId: string) => WOMaterialSummary;
  onEditSchedule?: (item: PlannerItem, date: Date) => void;
  onViewWorkOrder?: (item: PlannerItem) => void;
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
  return 1;
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
  estimatedHours: number;
  trade: string;
  originalItem: PlannerItem;
}

const DISCIPLINE_FILTERS = [
  { key: "All", label: "All" },
  { key: "Mechanical", label: "Mechanical" },
  { key: "Electrical", label: "Electrical" },
  { key: "Mobile", label: "Mobile & LVs" },
];

export function PlannerForwardPlanTab({ items, getReadiness, onEditSchedule, onViewWorkOrder }: Props) {
  const now = useMemo(() => new Date(), []);
  const todayWeekStart = useMemo(() => startOfWeek(now, { weekStartsOn: 3 }), [now]);

  const [weekOffset, setWeekOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  // Multi-level expansion: Set of expanded PM ids, and set of "pmId:weekIdx" for expanded weeks, and set of "pmId:weekIdx:dayIdx" for expanded days
  const [expandedPMs, setExpandedPMs] = useState<Set<string>>(new Set());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const NUM_WEEKS = 13;
  const viewStart = useMemo(() => addWeeks(todayWeekStart, weekOffset - 2), [todayWeekStart, weekOffset]);

  const weekColumns = useMemo(() => {
    const cols: { start: Date; end: Date; weekNum: number; dateLabel: string; isCurrent: boolean; isPast: boolean }[] = [];
    for (let i = 0; i < NUM_WEEKS; i++) {
      const start = addWeeks(viewStart, i);
      const end = addDays(start, 6);
      const isCurrent = isSameWeek(now, start, { weekStartsOn: 3 });
      const isPast = end < now && !isCurrent;
      cols.push({ start, end, weekNum: getISOWeek(start), dateLabel: format(start, "dd/MM"), isCurrent, isPast });
    }
    return cols;
  }, [viewStart, now]);

  const pmItems = useMemo(() => {
    const map = new Map<string, PlannerItem>();
    for (const item of items) {
      if (item.source === "pm" && !map.has(item.sourceId)) map.set(item.sourceId, item);
    }
    return Array.from(map.values());
  }, [items]);

  const filteredPMs = useMemo(() => {
    let result = pmItems;
    if (filterDiscipline !== "All") result = result.filter(pm => pm.discipline === filterDiscipline);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(pm => pm.taskName.toLowerCase().includes(q) || pm.assetNumber.toLowerCase().includes(q));
    }
    return result;
  }, [pmItems, filterDiscipline, searchQuery]);

  const disciplineCounts = useMemo(() => {
    const counts: Record<string, number> = { All: pmItems.length };
    for (const pm of pmItems) counts[pm.discipline] = (counts[pm.discipline] || 0) + 1;
    return counts;
  }, [pmItems]);

  const pmRows: PMRow[] = useMemo(() => {
    return filteredPMs.map(pm => {
      const freqDays = freqToDays(pm.frequency);
      const expectedPerWeek = freqToExpectedPerWeek(pm.frequency);
      const adj = adjustments[pm.sourceId] || 0;
      const allStart = weekColumns[0].start;
      const allEnd = weekColumns[weekColumns.length - 1].end;

      const occDates: Date[] = [];
      let d = addDays(startOfWeek(new Date("2026-03-25"), { weekStartsOn: 3 }), adj);
      while (d <= allEnd) {
        if (d >= allStart) occDates.push(new Date(d));
        d = addDays(d, freqDays === 1 ? 1 : freqDays);
      }

      const weeks: WeekCell[] = weekColumns.map(wc => {
        const daysInWeek: DayOccurrence[] = [];
        const dayNames = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
        for (const occ of occDates) {
          if (isWithinInterval(occ, { start: wc.start, end: wc.end })) {
            const dayOfWeek = Math.floor((occ.getTime() - wc.start.getTime()) / 86400000);
            daysInWeek.push({
              date: occ,
              dayLabel: format(occ, "dd MMM"),
              dayName: dayNames[Math.min(dayOfWeek, 6)] || format(occ, "EEE"),
              status: occ <= now ? "Scheduled" : "Projected",
            });
          }
        }
        return {
          weekStart: wc.start, weekEnd: wc.end, weekNum: wc.weekNum, dateLabel: wc.dateLabel,
          actual: daysInWeek.length, expected: expectedPerWeek, days: daysInWeek,
          isCurrent: wc.isCurrent, isPast: wc.isPast,
        };
      });

      return {
        id: pm.sourceId, name: pm.taskName, assetNumber: pm.assetNumber,
        frequency: pm.frequency, discipline: pm.discipline, freqDays,
        expectedPerWeek, weeks, estimatedHours: pm.estimatedHours, trade: pm.trade,
        originalItem: pm,
      };
    });
  }, [filteredPMs, weekColumns, adjustments, now]);

  const togglePM = useCallback((id: string) => {
    setExpandedPMs(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Also collapse all children
        setExpandedWeeks(wp => {
          const n = new Set(wp);
          for (const k of n) { if (k.startsWith(id + ":")) n.delete(k); }
          return n;
        });
        setExpandedDays(dp => {
          const n = new Set(dp);
          for (const k of n) { if (k.startsWith(id + ":")) n.delete(k); }
          return n;
        });
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleWeek = useCallback((key: string) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        // collapse child days
        setExpandedDays(dp => {
          const n = new Set(dp);
          for (const k of n) { if (k.startsWith(key + ":")) n.delete(k); }
          return n;
        });
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleDay = useCallback((key: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const handleAdjust = useCallback((pmId: string, daysDelta: number) => {
    setAdjustments(prev => ({ ...prev, [pmId]: (prev[pmId] || 0) + daysDelta }));
  }, []);

  const hasAdjustments = Object.values(adjustments).some(v => v !== 0);
  const resetAll = () => { setAdjustments({}); toast.success("All adjustments reset"); };
  const saveAdjustments = () => {
    const count = Object.keys(adjustments).filter(k => adjustments[k] !== 0).length;
    toast.success(`${count} PM schedule adjustment${count !== 1 ? "s" : ""} saved`);
  };

  const viewRangeLabel = `W${weekColumns[0]?.weekNum} — ${format(weekColumns[0]?.start, "dd MMM")} – ${format(weekColumns[weekColumns.length - 1]?.end, "dd MMM")}...`;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
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

        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search PMs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 pl-8 text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Calendar className="w-3.5 h-3.5" /> {format(now, "dd MMM yy")}
            </Button>
            <div className="flex items-center border border-border rounded-md">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(p => p - 4)}><ChevronLeft className="w-3.5 h-3.5" /></Button>
              <span className="text-xs font-medium px-3 min-w-[140px] text-center">{viewRangeLabel}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(p => p + 4)}><ChevronRight className="w-3.5 h-3.5" /></Button>
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
          {/* Header */}
          <div className="flex border-b border-border bg-muted/30 sticky top-0 z-10">
            <div className="w-[320px] flex-shrink-0 px-4 py-2 border-r border-border flex items-end">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-[220px]">PM Name</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">Freq</span>
            </div>
            <div className="flex-1 flex">
              {weekColumns.map((wc, i) => (
                <div key={i} className={cn("flex-1 text-center py-2 border-r border-border/40 last:border-r-0", wc.isCurrent && "bg-primary/5")}>
                  <p className={cn("text-xs font-bold", wc.isCurrent ? "text-primary" : "text-foreground")}>W{wc.weekNum}</p>
                  <p className="text-[10px] text-muted-foreground">{wc.dateLabel}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PM Rows */}
          {pmRows.length === 0 && (
            <div className="p-12 text-center text-muted-foreground text-sm">No maintenance plans found</div>
          )}
          {pmRows.map(pm => {
            const isPMExpanded = expandedPMs.has(pm.id);
            const adj = adjustments[pm.id] || 0;
            const totalOccurrences = pm.weeks.reduce((s, w) => s + w.actual, 0);

            return (
              <div key={pm.id} className="border-b border-border/30">
                {/* Main PM row - click to expand */}
                <div
                  className={cn(
                    "flex cursor-pointer transition-colors group",
                    isPMExpanded ? "bg-primary/5" : "hover:bg-muted/5"
                  )}
                  onClick={() => togglePM(pm.id)}
                >
                  {/* PM name cell */}
                  <div className="w-[320px] flex-shrink-0 px-4 py-2.5 border-r border-border flex items-center gap-2">
                    <div className={cn(
                      "w-4 h-4 flex items-center justify-center rounded transition-transform flex-shrink-0",
                      isPMExpanded && "text-primary"
                    )}>
                      {isPMExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-foreground truncate">{pm.name}</p>
                        <Pencil className="w-3 h-3 text-muted-foreground/50 flex-shrink-0 opacity-0 group-hover:opacity-100 cursor-pointer" />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{pm.assetNumber || "No asset linked"}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded flex-shrink-0">{pm.frequency}</span>
                  </div>

                  {/* Week cells */}
                  <div className="flex-1 flex">
                    {pm.weeks.map((week, wIdx) => {
                      const hasOccs = week.actual > 0;
                      const isComplete = week.actual >= week.expected && hasOccs;
                      return (
                        <div key={wIdx} className={cn(
                          "flex-1 flex items-center justify-center py-2 border-r border-border/20 last:border-r-0",
                          week.isCurrent && "bg-primary/5"
                        )}>
                          {hasOccs ? (
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
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* LEVEL 1: Expanded PM → show all weeks with occurrences as inline rows */}
                {isPMExpanded && (
                  <div className="bg-muted/5 border-t border-border/20" onClick={(e) => e.stopPropagation()}>
                    {/* PM summary bar */}
                    <div className="flex items-center gap-4 px-6 py-2 bg-muted/20 border-b border-border/20">
                      <Badge variant="outline" className="text-[10px]">{pm.discipline}</Badge>
                      <span className="text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />{pm.estimatedHours || 0}h est.
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {totalOccurrences} occurrence{totalOccurrences !== 1 ? "s" : ""} in view
                      </span>
                      {adj !== 0 && (
                        <span className="text-[10px] font-mono font-bold text-primary">
                          Shifted {adj > 0 ? `+${adj}` : adj} days
                        </span>
                      )}
                      <div className="flex-1" />
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-5 text-[9px] px-1.5" onClick={(e) => { e.stopPropagation(); handleAdjust(pm.id, -7); }}>
                          <ChevronLeft className="w-2.5 h-2.5" /> −1 wk
                        </Button>
                        <Button variant="outline" size="sm" className="h-5 text-[9px] px-1.5" onClick={(e) => { e.stopPropagation(); handleAdjust(pm.id, -1); }}>−1d</Button>
                        <Button variant="outline" size="sm" className="h-5 text-[9px] px-1.5" onClick={(e) => { e.stopPropagation(); handleAdjust(pm.id, 1); }}>+1d</Button>
                        <Button variant="outline" size="sm" className="h-5 text-[9px] px-1.5" onClick={(e) => { e.stopPropagation(); handleAdjust(pm.id, 7); }}>
                          +1 wk <ChevronRight className="w-2.5 h-2.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Week-by-week breakdown */}
                    {pm.weeks.map((week, wIdx) => {
                      if (week.actual === 0) return null;
                      const weekKey = `${pm.id}:${wIdx}`;
                      const isWeekExpanded = expandedWeeks.has(weekKey);

                      return (
                        <div key={wIdx}>
                          {/* LEVEL 2: Week row - click to expand days */}
                          <div
                            className={cn(
                              "flex items-center gap-3 px-8 py-1.5 cursor-pointer transition-colors border-b border-border/10",
                              isWeekExpanded ? "bg-primary/5" : "hover:bg-muted/10"
                            )}
                            onClick={() => toggleWeek(weekKey)}
                          >
                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                              {isWeekExpanded ? <ChevronDown className="w-3 h-3 text-primary" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                            </div>
                            <div className={cn(
                              "flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold",
                              week.isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-foreground"
                            )}>
                              W{week.weekNum}
                            </div>
                            <span className="text-[11px] font-medium text-foreground">
                              {format(week.weekStart, "dd MMM")} – {format(week.weekEnd, "dd MMM yyyy")}
                            </span>
                            <Badge variant="outline" className="text-[9px] font-mono">
                              {week.actual}/{week.expected}
                            </Badge>
                            {week.isCurrent && (
                              <Badge className="text-[9px] bg-primary/15 text-primary border-primary/30">Current Week</Badge>
                            )}
                          </div>

                          {/* LEVEL 3: Expanded week → individual days */}
                          {isWeekExpanded && (
                            <div className="bg-background">
                              {week.days.map((day, dIdx) => {
                                const dayKey = `${pm.id}:${wIdx}:${dIdx}`;
                                const isDayExpanded = expandedDays.has(dayKey);

                                return (
                                  <div key={dIdx}>
                                    {/* Day row */}
                                    <div
                                      className={cn(
                                        "flex items-center gap-3 px-12 py-2 cursor-pointer transition-colors border-b border-border/10",
                                        isDayExpanded ? "bg-primary/5" : "hover:bg-muted/10"
                                      )}
                                      onClick={() => toggleDay(dayKey)}
                                    >
                                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                        {isDayExpanded ? <ChevronDown className="w-3 h-3 text-primary" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                                      </div>
                                      <span className="text-[10px] text-muted-foreground font-medium w-8">{day.dayName}</span>
                                      <span className="text-xs font-bold text-foreground w-12">{format(day.date, "dd/MM")}</span>
                                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                      <Badge className={cn(
                                        "text-[9px] h-4",
                                        day.status === "Scheduled"
                                          ? "bg-primary/15 text-primary border-primary/30"
                                          : "bg-muted text-muted-foreground border-border"
                                      )}>
                                        {day.status}
                                      </Badge>
                                      <span className="text-[10px] text-muted-foreground">{format(day.date, "EEEE, dd MMMM yyyy")}</span>
                                      <div className="flex-1" />
                                      <Pencil className="w-3 h-3 text-muted-foreground/40 hover:text-foreground cursor-pointer" onClick={e => e.stopPropagation()} />
                                    </div>

                                    {/* LEVEL 4: Expanded day → full detail card */}
                                    {isDayExpanded && (
                                      <div className="px-16 py-3 bg-muted/5 border-b border-border/10" onClick={(e) => e.stopPropagation()}>
                                        <div className="bg-popover border border-border rounded-lg p-4 max-w-2xl shadow-sm" onClick={(e) => e.stopPropagation()}>
                                          <div className="flex items-start justify-between mb-3">
                                            <div>
                                              <h4 className="text-sm font-bold text-foreground">{pm.name}</h4>
                                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {format(day.date, "EEEE dd MMMM yyyy")} · {pm.frequency} · {pm.discipline}
                                              </p>
                                            </div>
                                            <Badge className={cn(
                                              "text-[10px]",
                                              day.status === "Scheduled"
                                                ? "bg-primary/15 text-primary border-primary/30"
                                                : "bg-muted text-muted-foreground border-border"
                                            )}>
                                              {day.status}
                                            </Badge>
                                          </div>

                                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                                            <div className="flex items-center gap-2">
                                              <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
                                              <span className="text-muted-foreground">Asset:</span>
                                              <span className="font-mono font-medium text-foreground">{pm.assetNumber || "—"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                              <span className="text-muted-foreground">Est. Duration:</span>
                                              <span className="font-medium text-foreground">{pm.estimatedHours || 0}h</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                              <span className="text-muted-foreground">Discipline:</span>
                                              <span className="font-medium text-foreground">{pm.discipline}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                                              <span className="text-muted-foreground">Trade:</span>
                                              <span className="font-medium text-foreground">{pm.trade || "—"}</span>
                                            </div>
                                          </div>

                                          {/* Action buttons */}
                                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                                            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1"
                                              onClick={(e) => { e.stopPropagation(); onEditSchedule?.(pm.originalItem, day.date); }}>
                                              <Pencil className="w-3 h-3" /> Edit Schedule
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1"
                                              onClick={(e) => { e.stopPropagation(); onViewWorkOrder?.(pm.originalItem); }}>
                                              <CalendarDays className="w-3 h-3" /> View Work Order
                                            </Button>
                                            <div className="flex-1" />
                                            <div className="flex items-center gap-1">
                                              <Button variant="ghost" size="sm" className="h-6 text-[9px] px-2"
                                                onClick={(e) => { e.stopPropagation(); handleAdjust(pm.id, -1); }}>
                                                −1 day
                                              </Button>
                                              <Button variant="ghost" size="sm" className="h-6 text-[9px] px-2"
                                                onClick={(e) => { e.stopPropagation(); handleAdjust(pm.id, 1); }}>
                                                +1 day
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{filteredPMs.length} PMs · {NUM_WEEKS}-week view · Click rows to drill down</span>
        {hasAdjustments && (
          <span className="text-primary font-medium">
            {Object.values(adjustments).filter(v => v !== 0).length} PMs adjusted
          </span>
        )}
      </div>
    </div>
  );
}
