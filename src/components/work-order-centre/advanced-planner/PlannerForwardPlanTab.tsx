import { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Undo2, Save, CalendarDays, Pencil, Sparkles, Calendar,
  Clock, Wrench, MapPin, AlertTriangle, Package, Shield,
  Ban, ArrowRightLeft, Eye, FileCheck,
} from "lucide-react";
import { SupersededLogPanel, type SupersededEntry } from "./SupersededLogPanel";
import {
  addDays, addWeeks, startOfWeek, format, isWithinInterval,
  getISOWeek, isSameWeek,
} from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";
import type { WOMaterialSummary } from "@/hooks/useMaterialReadiness";
import type { WorkOrder } from "@/hooks/useWorkOrders";


interface Props {
  items: PlannerItem[];
  workOrders?: WorkOrder[];
  getReadiness?: (workOrderId: string) => WOMaterialSummary;
  onEditSchedule?: (item: PlannerItem, date: Date) => void;
  onViewWorkOrder?: (item: PlannerItem) => void;
  onSupersededCount?: (count: number) => void;
}

function freqToDays(freq: string): number {
  if (!freq) return 28;
  const lower = freq.toLowerCase().trim();
  if (lower === "daily") return 1;
  const match = lower.match(/^(\d+)\s*week/i);
  if (match) return parseInt(match[1]) * 7;
  if (lower.includes("month")) return 30;
  if (lower.includes("quarter") || lower.includes("13")) return 91;
  if (lower.includes("6") && lower.includes("month")) return 182;
  if (lower.includes("annual") || lower.includes("year") || lower.includes("52")) return 364;
  if (lower.includes("26")) return 182;
  if (lower.includes("fortnight")) return 14;
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
  status: "Scheduled" | "Projected" | "Superseded" | "Completed" | "Overdue";
  supersededBy?: string;
  linkedWO?: WorkOrder;
}

interface WeekCell {
  weekStart: Date;
  weekEnd: Date;
  weekNum: number;
  dateLabel: string;
  actual: number;
  expected: number;
  superseded: number;
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
  planType: "Inspection" | "Maintenance" | "Scheduled WO";
  totalSuperseded: number;
  woType?: PlannerItem["woType"];
}

const DISCIPLINE_FILTERS = [
  { key: "All", label: "All" },
  { key: "Mechanical", label: "Mechanical" },
  { key: "Electrical", label: "Electrical" },
  { key: "Mobile", label: "Mobile & LVs" },
];

const SORT_OPTIONS = [
  { key: "name", label: "PM Name" },
  { key: "frequency", label: "Frequency" },
  { key: "discipline", label: "Discipline" },
  { key: "asset", label: "Asset" },
] as const;
type SortKey = typeof SORT_OPTIONS[number]["key"];

const CALL_HORIZON_DAYS = 91; // 13 weeks / ~3 months

export function PlannerForwardPlanTab({ items, workOrders = [], getReadiness, onEditSchedule, onViewWorkOrder, onSupersededCount }: Props) {
  
  const now = useMemo(() => new Date(), []);
  const todayWeekStart = useMemo(() => startOfWeek(now, { weekStartsOn: 3 }), [now]);

  const [weekOffset, setWeekOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const [showSuperseded, setShowSuperseded] = useState(true);
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

  // PM template items (recurring plans)
  const pmItems = useMemo(() => {
    const map = new Map<string, PlannerItem>();
    for (const item of items) {
      if (item.source === "pm" && !map.has(item.sourceId)) map.set(item.sourceId, item);
    }
    return Array.from(map.values());
  }, [items]);

  // Forward Plan only shows recurring PM plans — one-off WOs are managed elsewhere

  const filteredPMs = useMemo(() => {
    let result = pmItems;
    if (filterDiscipline !== "All") result = result.filter(pm => pm.discipline === filterDiscipline);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(pm => pm.taskName.toLowerCase().includes(q) || pm.assetNumber.toLowerCase().includes(q));
    }
    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.taskName.localeCompare(b.taskName);
      if (sortBy === "frequency") return freqToDays(a.frequency) - freqToDays(b.frequency);
      if (sortBy === "discipline") return (a.discipline || "").localeCompare(b.discipline || "");
      if (sortBy === "asset") return (a.assetNumber || "").localeCompare(b.assetNumber || "");
      return 0;
    });
    return result;
  }, [pmItems, filterDiscipline, searchQuery, sortBy]);

  const disciplineCounts = useMemo(() => {
    const counts: Record<string, number> = { All: pmItems.length };
    for (const pm of pmItems) counts[pm.discipline] = (counts[pm.discipline] || 0) + 1;
    return counts;
  }, [pmItems]);

  // Build supersession map: for each asset+equipmentType+week, find the longest-frequency PM
  // IMPORTANT: Only supersede when PMs share the SAME asset AND the SAME equipment type.
  // Different inspection types (e.g. "Weekly Generator Inspection" vs "RCD Testing") must NOT supersede each other.
  // Extract the "inspection family" from a PM name by stripping frequency words.
  // This determines which PMs are the SAME type of work at different intervals.
  // Daily PMs are ALWAYS a different family — they're quick operational checks, not the same scope as weekly/monthly.
  const getSupersessionFamily = useCallback((pm: PlannerItem): string => {
    const freq = pm.frequency.toLowerCase().trim();
    // Daily PMs are never superseded — different scope of work entirely
    if (freq === "daily" || freqToDays(pm.frequency) === 1) return `__daily__${pm.taskName.toLowerCase()}`;
    
    const stripped = pm.taskName
      .toLowerCase()
      .replace(/\b(daily|weekly|fortnightly|monthly|quarterly|yearly|annual)\b/gi, "")
      .replace(/\b\d+\s*(?:week|wk|month|mth|day|yr|year|m)\b/gi, "")
      .replace(/\b(?:1|2|3|4|6|12|13|26|52)\s*(?:week|wk|month|mth)\b/gi, "")
      .replace(/\b\d+[mM]\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return stripped;
  }, []);

  const supersessionMap = useMemo(() => {
    // Group PMs by asset number + inspection family (NOT just equipment type)
    // "Admin Generator Weekly Inspection" and "Admin Generator 3M Inspection" = SAME family
    // "Admin Generator Weekly Inspection" and "RCD Testing Sheets" = DIFFERENT families
    const familyPMs = new Map<string, PlannerItem[]>();
    for (const pm of filteredPMs) {
      if (!pm.assetNumber) continue;
      const family = getSupersessionFamily(pm);
      const familyKey = `${pm.assetNumber}::${family}`;
      if (!familyPMs.has(familyKey)) familyPMs.set(familyKey, []);
      familyPMs.get(familyKey)!.push(pm);
    }

    const map = new Map<string, { supersededBy: string }>();

    for (const [, pmsForFamily] of familyPMs) {
      if (pmsForFamily.length < 2) continue;

      for (let wIdx = 0; wIdx < weekColumns.length; wIdx++) {
        const wc = weekColumns[wIdx];
        
        const pmsInWeek: { pm: PlannerItem; freqDays: number }[] = [];
        
        for (const pm of pmsForFamily) {
          const fDays = freqToDays(pm.frequency);
          const adj = adjustments[pm.sourceId] || 0;
          let d = addDays(startOfWeek(new Date("2026-03-25"), { weekStartsOn: 3 }), adj);
          let hasOcc = false;
          while (d <= wc.end) {
            if (d >= wc.start && isWithinInterval(d, { start: wc.start, end: wc.end })) {
              hasOcc = true;
              break;
            }
            d = addDays(d, fDays === 1 ? 1 : fDays);
          }
          if (hasOcc) pmsInWeek.push({ pm, freqDays: fDays });
        }

        if (pmsInWeek.length < 2) continue;

        // Sort by frequency days descending — longest frequency wins
        pmsInWeek.sort((a, b) => b.freqDays - a.freqDays);
        const winner = pmsInWeek[0];

        for (let i = 1; i < pmsInWeek.length; i++) {
          const loser = pmsInWeek[i];
          const ratio = winner.freqDays / loser.freqDays;
          if (ratio >= 1.8) {
            map.set(`${loser.pm.sourceId}:${wIdx}`, {
              supersededBy: `${winner.pm.taskName} (${winner.pm.frequency})`,
            });
          }
        }
      }
    }

    return map;
  }, [filteredPMs, weekColumns, adjustments]);

  // Build superseded entries for the log panel
  const supersededEntries: SupersededEntry[] = useMemo(() => {
    const entries: SupersededEntry[] = [];
    for (const [key, value] of supersessionMap) {
      const [pmId, wIdxStr] = key.split(":");
      const wIdx = parseInt(wIdxStr);
      const pm = filteredPMs.find(p => p.sourceId === pmId);
      const wc = weekColumns[wIdx];
      if (pm && wc) {
        entries.push({
          pmId: pm.sourceId,
          pmName: pm.taskName,
          assetNumber: pm.assetNumber,
          frequency: pm.frequency,
          discipline: pm.discipline,
          weekNum: wc.weekNum,
          weekStart: wc.start,
          supersededBy: value.supersededBy,
        });
      }
    }
    return entries.sort((a, b) => a.weekNum - b.weekNum || a.pmName.localeCompare(b.pmName));
  }, [supersessionMap, filteredPMs, weekColumns]);

  useEffect(() => {
    onSupersededCount?.(supersededEntries.length);
  }, [supersededEntries.length, onSupersededCount]);

  const handleReinstate = useCallback((pmId: string, weekNum: number) => {
    toast.success(`Plan reinstated for W${weekNum} — manual override applied`);
  }, []);

  // Build a lookup of existing PM work orders by PM name + date for cross-referencing
  const pmWOLookup = useMemo(() => {
    const map = new Map<string, WorkOrder>();
    for (const wo of workOrders) {
      if (wo.work_type !== "PM" || !wo.scheduled_date) continue;
      const match = wo.problem_description?.match(/^PM:\s*(.+?)\s*\(/);
      if (match) {
        const key = `${match[1].trim()}::${wo.scheduled_date}`;
        map.set(key, wo);
      }
    }
    return map;
  }, [workOrders]);

  const pmRows: PMRow[] = useMemo(() => {
    return filteredPMs.map(pm => {
      const freqDays = freqToDays(pm.frequency);
      const expectedPerWeek = freqToExpectedPerWeek(pm.frequency);
      const adj = adjustments[pm.sourceId] || 0;
      const allStart = weekColumns[0].start;
      const allEnd = weekColumns[weekColumns.length - 1].end;
      const planCategory = pm.planCategory || "Preventive";
      const planType = planCategory === "Lifecycle" ? "Maintenance" as const : "Inspection" as const;

      const occDates: Date[] = [];
      let d = addDays(startOfWeek(new Date("2026-03-25"), { weekStartsOn: 3 }), adj);
      while (d <= allEnd) {
        if (d >= allStart) occDates.push(new Date(d));
        d = addDays(d, freqDays === 1 ? 1 : freqDays);
      }

      let totalSuperseded = 0;

      const weeks: WeekCell[] = weekColumns.map((wc, wIdx) => {
        const supersession = supersessionMap.get(`${pm.sourceId}:${wIdx}`);
        const isSuperseded = !!supersession;

        const daysInWeek: DayOccurrence[] = [];
        const dayNames = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
        for (const occ of occDates) {
          if (isWithinInterval(occ, { start: wc.start, end: wc.end })) {
            const dayOfWeek = Math.floor((occ.getTime() - wc.start.getTime()) / 86400000);
            const dateStr = format(occ, "yyyy-MM-dd");
            const linkedWO = pmWOLookup.get(`${pm.taskName}::${dateStr}`);
            
            let status: DayOccurrence["status"];
            if (isSuperseded) {
              status = "Superseded";
            } else if (linkedWO) {
              if (linkedWO.status === "Completed" || linkedWO.status === "Closed") {
                status = "Completed";
              } else if (occ < now) {
                status = "Overdue";
              } else {
                status = "Scheduled";
              }
            } else {
              status = occ <= now ? "Overdue" : "Projected";
            }

            daysInWeek.push({
              date: occ,
              dayLabel: format(occ, "dd MMM"),
              dayName: dayNames[Math.min(dayOfWeek, 6)] || format(occ, "EEE"),
              status,
              supersededBy: supersession?.supersededBy,
              linkedWO,
            });
          }
        }

        const supersededCount = isSuperseded ? daysInWeek.length : 0;
        totalSuperseded += supersededCount;

        return {
          weekStart: wc.start, weekEnd: wc.end, weekNum: wc.weekNum, dateLabel: wc.dateLabel,
          actual: isSuperseded ? 0 : daysInWeek.length,
          expected: expectedPerWeek,
          superseded: supersededCount,
          days: daysInWeek,
          isCurrent: wc.isCurrent, isPast: wc.isPast,
        };
      });

      return {
        id: pm.sourceId, name: pm.taskName, assetNumber: pm.assetNumber,
        frequency: pm.frequency, discipline: pm.discipline, freqDays,
        expectedPerWeek, weeks, estimatedHours: pm.estimatedHours, trade: pm.trade,
        originalItem: pm, planType, totalSuperseded,
      };
    });
  }, [filteredPMs, weekColumns, adjustments, now, supersessionMap]);

  // No one-off WO rows in Forward Plan — recurring PMs only

  // All rows are recurring PM rows only
  const allRows = pmRows;

  // Summary stats
  const summaryStats = useMemo(() => {
    let totalOccurrences = 0;
    let totalSuperseded = 0;
    for (const row of allRows) {
      for (const w of row.weeks) {
        totalOccurrences += w.actual + w.superseded;
        totalSuperseded += w.superseded;
      }
    }
    return { totalOccurrences, totalSuperseded, netWOs: totalOccurrences - totalSuperseded };
  }, [allRows]);

  const togglePM = useCallback((id: string) => {
    setExpandedPMs(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setExpandedWeeks(wp => { const n = new Set(wp); for (const k of n) { if (k.startsWith(id + ":")) n.delete(k); } return n; });
        setExpandedDays(dp => { const n = new Set(dp); for (const k of n) { if (k.startsWith(id + ":")) n.delete(k); } return n; });
      } else { next.add(id); }
      return next;
    });
  }, []);

  const toggleWeek = useCallback((key: string) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        setExpandedDays(dp => { const n = new Set(dp); for (const k of n) { if (k.startsWith(key + ":")) n.delete(k); } return n; });
      } else { next.add(key); }
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

  const viewRangeLabel = `W${weekColumns[0]?.weekNum} — ${format(weekColumns[0]?.start, "dd MMM")} – ${format(weekColumns[weekColumns.length - 1]?.end, "dd MMM")}`;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Forward Plan — 90-Day Call Horizon
            </h2>
            <p className="text-xs text-muted-foreground">All maintenance plans · PMs, scheduled work orders & rebuilds · 13-week rolling view</p>
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

        {/* Summary row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border">
            <CalendarDays className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground">Projected WOs:</span>
            <span className="text-xs font-bold text-foreground">{summaryStats.totalOccurrences}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/5 border border-primary/20">
            <FileCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground">Net WOs to Generate:</span>
            <span className="text-xs font-bold text-primary">{summaryStats.netWOs}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/50">
            <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Superseded:</span>
            <span className={cn("text-xs font-bold", supersededEntries.length > 0 ? "text-primary" : "text-muted-foreground")}>
              {supersededEntries.length > 0 ? supersededEntries.length : "None"}
            </span>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setShowSuperseded(!showSuperseded)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium border transition-colors",
              showSuperseded
                ? "bg-muted border-border text-foreground"
                : "bg-background border-border text-muted-foreground"
            )}
          >
            <Eye className="w-3 h-3" />
            {showSuperseded ? "Showing" : "Hiding"} Superseded
          </button>
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
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search PMs or assets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 pl-8 text-xs" />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              className="h-8 px-2 text-xs border border-border rounded-md bg-background text-foreground"
            >
              {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" className="h-8 text-xs gap-1 bg-foreground text-background hover:bg-foreground/90">
                  <Sparkles className="w-3.5 h-3.5" /> Generate 90-Day
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs max-w-xs">
                <p className="font-semibold mb-1">Auto-Generate PM Work Orders</p>
                <p>Creates WO-12xxxx (Inspection) and WO-11xxxx (Maintenance) work orders for the next 90 days. Applies frequency supersession? to prevent duplicates on the same asset.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-1.5 border-b border-border bg-muted/10 text-[9px] text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider">Legend:</span>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Projected (will generate WO)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary/40" /> Scheduled (WO exists)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-muted-foreground/30" /><span className="line-through">Superseded</span> (longer freq overrides)</div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-[8px] px-1 py-0 border-primary/40 text-primary">INS</Badge> Inspection (12-series)
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-[8px] px-1 py-0 border-purple-500/40 text-purple-600">MNT</Badge> Maintenance (11-series)
        </div>
      </div>

      {/* Superseded Log — expandable audit trail */}
      <SupersededLogPanel entries={supersededEntries} onReinstate={handleReinstate} />

      {/* Table */}
      <ScrollArea className="flex-1">
        <div className="min-w-[1200px]">
          {/* Header */}
          <div className="flex border-b border-border bg-muted/30 sticky top-0 z-10">
            <div className="w-[340px] flex-shrink-0 px-4 py-2 border-r border-border flex items-end gap-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex-1">PM Name / Asset</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-12 text-center">Type</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-mono w-16 text-right">Freq</span>
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

          {/* All Maintenance Plan Rows (PMs + Scheduled WOs) */}
          {allRows.length === 0 && (
            <div className="p-12 text-center text-muted-foreground text-sm">No maintenance plans found</div>
          )}
          {allRows.map(pm => {
            const isPMExpanded = expandedPMs.has(pm.id);
            const adj = adjustments[pm.id] || 0;
            const totalOccurrences = pm.weeks.reduce((s, w) => s + w.actual, 0);
            const totalSupersededWeeks = pm.weeks.filter(w => w.superseded > 0).length;

            return (
              <div key={pm.id} className="border-b border-border/30">
                {/* Main PM row */}
                <div
                  className={cn(
                    "flex cursor-pointer transition-colors group",
                    isPMExpanded ? "bg-primary/5" : "hover:bg-muted/5"
                  )}
                  onClick={() => togglePM(pm.id)}
                >
                  {/* PM name cell */}
                  <div className="w-[340px] flex-shrink-0 px-4 py-2.5 border-r border-border flex items-center gap-2">
                    <div className={cn("w-4 h-4 flex items-center justify-center rounded transition-transform flex-shrink-0", isPMExpanded && "text-primary")}>
                      {isPMExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-foreground truncate">{pm.name}</p>
                        {pm.totalSuperseded > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-[8px] px-1 py-0 border-muted-foreground/30 text-muted-foreground">
                                <Ban className="w-2.5 h-2.5 mr-0.5" />{pm.totalSuperseded}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">{pm.totalSuperseded} occurrence{pm.totalSuperseded !== 1 ? "s" : ""} superseded by longer-frequency PM on same asset</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{pm.assetNumber || "No asset linked"}</p>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[8px] px-1 py-0 flex-shrink-0",
                      pm.planType === "Inspection" ? "border-primary/40 text-primary" 
                        : pm.planType === "Scheduled WO" ? "border-blue-500/40 text-blue-600"
                        : "border-purple-500/40 text-purple-600"
                    )}>
                      {pm.planType === "Inspection" ? "INS" : pm.planType === "Scheduled WO" ? pm.woType || "WO" : "MNT"}
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded flex-shrink-0 w-16 text-right">{pm.frequency}</span>
                  </div>

                  {/* Week cells */}
                  <div className="flex-1 flex">
                    {pm.weeks.map((week, wIdx) => {
                      const hasOccs = week.actual > 0;
                      const hasSuperseded = week.superseded > 0;
                      const isComplete = week.actual >= week.expected && hasOccs;
                      return (
                        <div key={wIdx} className={cn(
                          "flex-1 flex items-center justify-center py-2 border-r border-border/20 last:border-r-0",
                          week.isCurrent && "bg-primary/5"
                        )}>
                          {hasSuperseded && showSuperseded ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-mono text-muted-foreground/50">
                                  <Ban className="w-3 h-3" />
                                  <span className="line-through">{week.superseded}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                Superseded by: {week.days[0]?.supersededBy || "longer-frequency PM"}
                              </TooltipContent>
                            </Tooltip>
                          ) : hasOccs ? (
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
                      <Badge variant="outline" className={cn(
                        "text-[9px]",
                        pm.planType === "Inspection" ? "border-primary/40 text-primary" : "border-purple-500/40 text-purple-600"
                      )}>
                        {pm.planType === "Inspection" ? "12-series (PM)" : "11-series (Planned)"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />{pm.estimatedHours || 0}h est.
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {totalOccurrences} occurrence{totalOccurrences !== 1 ? "s" : ""} in view
                      </span>
                      {pm.totalSuperseded > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          <Ban className="w-3 h-3 inline mr-1" />{pm.totalSuperseded} superseded
                        </span>
                      )}
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
                      if (week.actual === 0 && week.superseded === 0) return null;
                      const weekKey = `${pm.id}:${wIdx}`;
                      const isWeekExpanded = expandedWeeks.has(weekKey);
                      const isSupersededWeek = week.superseded > 0 && week.actual === 0;

                      return (
                        <div key={wIdx}>
                          {/* LEVEL 2: Week row */}
                          <div
                            className={cn(
                              "flex items-center gap-3 px-8 py-1.5 cursor-pointer transition-colors border-b border-border/10",
                              isSupersededWeek ? "bg-muted/10 opacity-60" : isWeekExpanded ? "bg-primary/5" : "hover:bg-muted/10"
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
                            <span className={cn("text-[11px] font-medium", isSupersededWeek ? "text-muted-foreground line-through" : "text-foreground")}>
                              {format(week.weekStart, "dd MMM")} – {format(week.weekEnd, "dd MMM yyyy")}
                            </span>
                            {isSupersededWeek ? (
                              <Badge variant="outline" className="text-[9px] font-mono border-muted-foreground/30 text-muted-foreground">
                                <Ban className="w-3 h-3 mr-1" /> Superseded
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[9px] font-mono">
                                {week.actual}/{week.expected}
                              </Badge>
                            )}
                            {isSupersededWeek && week.days[0]?.supersededBy && (
                              <span className="text-[9px] text-muted-foreground italic">
                                → {week.days[0].supersededBy}
                              </span>
                            )}
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
                                const isSupersededDay = day.status === "Superseded";

                                return (
                                  <div key={dIdx}>
                                    {/* Day row */}
                                    <div
                                      className={cn(
                                        "flex items-center gap-3 px-12 py-2 cursor-pointer transition-colors border-b border-border/10",
                                        isSupersededDay ? "opacity-50" : isDayExpanded ? "bg-primary/5" : "hover:bg-muted/10"
                                      )}
                                      onClick={() => toggleDay(dayKey)}
                                    >
                                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                        {isDayExpanded ? <ChevronDown className="w-3 h-3 text-primary" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                                      </div>
                                      <span className="text-[10px] text-muted-foreground font-medium w-8">{day.dayName}</span>
                                      <span className={cn("text-xs font-bold w-12", isSupersededDay ? "text-muted-foreground line-through" : "text-foreground")}>{format(day.date, "dd/MM")}</span>
                                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", isSupersededDay ? "bg-muted-foreground/30" : "bg-primary")} />
                                      <Badge className={cn(
                                        "text-[9px] h-4",
                                        day.status === "Scheduled" ? "bg-primary/15 text-primary border-primary/30"
                                          : day.status === "Superseded" ? "bg-muted text-muted-foreground border-muted-foreground/30"
                                          : "bg-muted text-muted-foreground border-border"
                                      )}>
                                        {day.status}
                                      </Badge>
                                      {isSupersededDay && day.supersededBy && (
                                        <span className="text-[9px] text-muted-foreground italic">→ {day.supersededBy}</span>
                                      )}
                                      {!isSupersededDay && (
                                        <span className="text-[10px] text-muted-foreground">{format(day.date, "EEEE, dd MMMM yyyy")}</span>
                                      )}
                                      <div className="flex-1" />
                                      {!isSupersededDay && <Pencil className="w-3 h-3 text-muted-foreground/40 hover:text-foreground cursor-pointer" onClick={e => e.stopPropagation()} />}
                                    </div>

                                    {/* LEVEL 4: Expanded day → full detail card */}
                                    {isDayExpanded && (
                                      <div className="px-16 py-3 bg-muted/5 border-b border-border/10" onClick={(e) => e.stopPropagation()}>
                                        <div className="bg-popover border border-border rounded-lg p-4 max-w-2xl shadow-sm" onClick={(e) => e.stopPropagation()}>
                                          <div className="flex items-start justify-between mb-3">
                                            <div>
                                              <h4 className={cn("text-sm font-bold", isSupersededDay ? "text-muted-foreground line-through" : "text-foreground")}>{pm.name}</h4>
                                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {format(day.date, "EEEE dd MMMM yyyy")} · {pm.frequency} · {pm.discipline}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <Badge variant="outline" className={cn(
                                                "text-[9px]",
                                                pm.planType === "Inspection" ? "border-primary/40 text-primary" : "border-purple-500/40 text-purple-600"
                                              )}>
                                                {pm.planType === "Inspection" ? "WO-12xxxx" : "WO-11xxxx"}
                                              </Badge>
                                              <Badge className={cn(
                                                "text-[10px]",
                                                day.status === "Scheduled" ? "bg-primary/15 text-primary border-primary/30"
                                                  : day.status === "Superseded" ? "bg-muted text-muted-foreground border-muted-foreground/30"
                                                  : "bg-muted text-muted-foreground border-border"
                                              )}>
                                                {day.status}
                                              </Badge>
                                            </div>
                                          </div>

                                          {isSupersededDay && day.supersededBy && (
                                            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md bg-muted/50 border border-border">
                                              <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                                              <div>
                                                <p className="text-[11px] font-medium text-foreground">Superseded by longer-frequency PM</p>
                                                <p className="text-[10px] text-muted-foreground">{day.supersededBy} — WO will not be generated for this occurrence</p>
                                              </div>
                                            </div>
                                          )}

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
                                          {!isSupersededDay && (
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
                                          )}
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

      {/* Superseded Log moved to toolbar area above */}

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{filteredPMs.length} PMs · {NUM_WEEKS}-week call horizon · Click rows to drill down</span>
          <span>Call Horizon: {CALL_HORIZON_DAYS} days ({Math.ceil(CALL_HORIZON_DAYS / 7)} weeks)</span>
        </div>
        <div className="flex items-center gap-3">
          {summaryStats.totalSuperseded > 0 && (
            <span>{summaryStats.totalSuperseded} superseded (same-asset frequency override)</span>
          )}
          {hasAdjustments && (
            <span className="text-primary font-medium">
              {Object.values(adjustments).filter(v => v !== 0).length} PMs adjusted
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
