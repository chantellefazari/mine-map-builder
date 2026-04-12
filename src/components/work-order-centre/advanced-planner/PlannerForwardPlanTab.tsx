import { useState, useMemo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, GripVertical, Undo2, Save } from "lucide-react";
import { addDays, addWeeks, startOfWeek, format, differenceInDays, isSameDay, isWithinInterval } from "date-fns";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

// Parse frequency string (e.g. "4 Week", "Daily") into days
function freqToDays(freq: string): number {
  if (!freq) return 28;
  const lower = freq.toLowerCase().trim();
  if (lower === "daily") return 1;
  const match = lower.match(/^(\d+)\s*week/i);
  if (match) return parseInt(match[1]) * 7;
  return 28; // default 4 weeks
}

interface ScheduledOccurrence {
  pmId: string;
  pmName: string;
  discipline: string;
  equipmentType: string;
  assetNumber: string;
  frequency: string;
  freqDays: number;
  occurrenceIndex: number;
  date: Date;
  originalDate: Date;
  isAdjusted: boolean;
}

const DISCIPLINE_COLORS: Record<string, string> = {
  Lube: "bg-amber-100 text-amber-800 border-amber-300",
  Mechanical: "bg-blue-100 text-blue-800 border-blue-300",
  Electrical: "bg-purple-100 text-purple-800 border-purple-300",
  Mobile: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

export function PlannerForwardPlanTab({ items }: Props) {
  const today = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 3 }), []); // Wed start
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [adjustments, setAdjustments] = useState<Record<string, number>>({}); // pmId -> day offset (shifts all future)
  const [dragState, setDragState] = useState<{ pmId: string; occIdx: number; startX: number; startDay: number } | null>(null);

  const pmItems = useMemo(() => items.filter(i => i.source === "pm"), [items]);

  const disciplines = useMemo(() => {
    const set = new Set(pmItems.map(i => i.discipline).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [pmItems]);

  // Dedupe PMs by name (items may have duplicates from planner mapping)
  const uniquePMs = useMemo(() => {
    const map = new Map<string, PlannerItem>();
    for (const pm of pmItems) {
      if (!map.has(pm.sourceId)) map.set(pm.sourceId, pm);
    }
    return Array.from(map.values());
  }, [pmItems]);

  const filteredPMs = useMemo(() => {
    if (filterDiscipline === "All") return uniquePMs;
    return uniquePMs.filter(pm => pm.discipline === filterDiscipline);
  }, [uniquePMs, filterDiscipline]);

  // Generate 90-day window
  const windowStart = useMemo(() => addWeeks(today, weekOffset), [today, weekOffset]);
  const windowEnd = useMemo(() => addDays(windowStart, 90), [windowStart]);
  const totalDays = 90;

  // Generate weeks for the header
  const weeks = useMemo(() => {
    const w: { start: Date; end: Date; label: string }[] = [];
    let d = windowStart;
    while (d < windowEnd) {
      const end = addDays(d, 6);
      w.push({ start: d, end, label: format(d, "dd MMM") });
      d = addDays(d, 7);
    }
    return w;
  }, [windowStart, windowEnd]);

  // Project all PM occurrences within the 90-day window
  const occurrences = useMemo(() => {
    const result: ScheduledOccurrence[] = [];
    for (const pm of filteredPMs) {
      const freqDays = freqToDays(pm.frequency);
      const adj = adjustments[pm.sourceId] || 0;

      // Project occurrences starting from today + adjustment
      let idx = 0;
      let d = addDays(today, adj);
      // Find first occurrence in or after windowStart
      while (d < windowStart && idx < 200) {
        d = addDays(d, freqDays);
        idx++;
      }
      // Generate within window
      while (d <= windowEnd && idx < 200) {
        const originalDate = addDays(today, idx * freqDays);
        result.push({
          pmId: pm.sourceId,
          pmName: pm.taskName,
          discipline: pm.discipline,
          equipmentType: pm.assetName,
          assetNumber: pm.assetNumber,
          frequency: pm.frequency,
          freqDays,
          occurrenceIndex: idx,
          date: d,
          originalDate,
          isAdjusted: adj !== 0,
        });
        d = addDays(d, freqDays);
        idx++;
      }
    }
    return result;
  }, [filteredPMs, windowStart, windowEnd, adjustments, today]);

  // Group occurrences by PM
  const pmOccurrenceMap = useMemo(() => {
    const map = new Map<string, ScheduledOccurrence[]>();
    for (const occ of occurrences) {
      if (!map.has(occ.pmId)) map.set(occ.pmId, []);
      map.get(occ.pmId)!.push(occ);
    }
    return map;
  }, [occurrences]);

  // Handle dragging to adjust a PM's schedule
  const handleAdjust = useCallback((pmId: string, daysDelta: number) => {
    setAdjustments(prev => ({
      ...prev,
      [pmId]: (prev[pmId] || 0) + daysDelta,
    }));
  }, []);

  const resetAll = () => {
    setAdjustments({});
    toast.success("All adjustments reset");
  };

  const saveAdjustments = () => {
    // In a real implementation, this would persist to the database
    const count = Object.keys(adjustments).length;
    toast.success(`${count} PM schedule adjustment${count !== 1 ? "s" : ""} saved`);
  };

  const hasAdjustments = Object.keys(adjustments).filter(k => adjustments[k] !== 0).length > 0;

  // Day position helper
  const dayToPercent = (date: Date) => {
    const diff = differenceInDays(date, windowStart);
    return (diff / totalDays) * 100;
  };

  // Capacity summary per week
  const weeklyLoad = useMemo(() => {
    return weeks.map(week => {
      const weekOccs = occurrences.filter(o =>
        isWithinInterval(o.date, { start: week.start, end: week.end })
      );
      const totalHours = weekOccs.reduce((sum, o) => {
        const pm = filteredPMs.find(p => p.sourceId === o.pmId);
        return sum + (pm?.estimatedHours || 1);
      }, 0);
      return { count: weekOccs.length, hours: totalHours };
    });
  }, [weeks, occurrences, filteredPMs]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">PM Forward Plan</h3>
          <Badge variant="outline" className="text-[10px]">{filteredPMs.length} plans · {occurrences.length} occurrences</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
            <SelectTrigger className="h-7 text-[10px] w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {disciplines.map(d => (
                <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center border border-border rounded-md">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setWeekOffset(p => p - 4)}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="text-[10px] font-medium px-2 min-w-[120px] text-center">
              {format(windowStart, "dd MMM")} – {format(addDays(windowEnd, -1), "dd MMM yyyy")}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setWeekOffset(p => p + 4)}>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {hasAdjustments && (
            <>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={resetAll}>
                <Undo2 className="w-3 h-3" /> Reset
              </Button>
              <Button size="sm" className="h-7 text-[10px] gap-1" onClick={saveAdjustments}>
                <Save className="w-3 h-3" /> Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Timeline header */}
      <div className="flex border-b border-border">
        <div className="w-[280px] flex-shrink-0 px-3 py-1.5 bg-muted/30 border-r border-border">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">PM Name</span>
        </div>
        <div className="flex-1 flex relative">
          {weeks.map((week, i) => (
            <div
              key={i}
              className="flex-1 text-center border-r border-border/50 last:border-r-0 py-1"
            >
              <p className="text-[9px] font-semibold text-muted-foreground">{week.label}</p>
              <p className={cn(
                "text-[8px]",
                weeklyLoad[i]?.count > 10 ? "text-destructive font-bold" : "text-muted-foreground"
              )}>
                {weeklyLoad[i]?.count || 0} jobs · {weeklyLoad[i]?.hours.toFixed(0) || 0}h
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PM Rows */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          {filteredPMs.length === 0 && (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No maintenance plans found for the selected discipline
            </div>
          )}
          {filteredPMs.map((pm) => {
            const pmOccs = pmOccurrenceMap.get(pm.sourceId) || [];
            const adj = adjustments[pm.sourceId] || 0;
            const discColor = DISCIPLINE_COLORS[pm.discipline] || "bg-muted text-foreground border-border";

            return (
              <div key={pm.sourceId} className="flex hover:bg-muted/10 transition-colors group">
                {/* PM label */}
                <div className="w-[280px] flex-shrink-0 px-3 py-2 border-r border-border flex items-center gap-2">
                  <GripVertical className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-foreground truncate">{pm.taskName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="outline" className={cn("text-[8px] px-1 py-0 h-3.5", discColor)}>
                        {pm.discipline}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground">{pm.frequency}</span>
                      {adj !== 0 && (
                        <span className={cn("text-[9px] font-mono font-bold", adj > 0 ? "text-amber-600" : "text-blue-600")}>
                          {adj > 0 ? `+${adj}d` : `${adj}d`}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Adjustment buttons */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => handleAdjust(pm.sourceId, -7)}
                      title="Shift 1 week earlier"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => handleAdjust(pm.sourceId, 7)}
                      title="Shift 1 week later"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 relative py-1.5 min-h-[36px]">
                  {/* Week gridlines */}
                  {weeks.map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-r border-border/20"
                      style={{ left: `${((i + 1) / weeks.length) * 100}%` }}
                    />
                  ))}

                  {/* Today marker */}
                  {differenceInDays(new Date(), windowStart) >= 0 && differenceInDays(new Date(), windowStart) <= totalDays && (
                    <div
                      className="absolute top-0 bottom-0 w-px bg-destructive/40"
                      style={{ left: `${dayToPercent(new Date())}%` }}
                    />
                  )}

                  {/* Occurrence dots */}
                  <TooltipProvider>
                    {pmOccs.map((occ, i) => {
                      const pct = dayToPercent(occ.date);
                      if (pct < 0 || pct > 100) return null;
                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 cursor-pointer transition-all hover:scale-150",
                                occ.isAdjusted
                                  ? "bg-amber-400 border-amber-600"
                                  : discColor.includes("amber") ? "bg-amber-500 border-amber-700"
                                    : discColor.includes("blue") ? "bg-blue-500 border-blue-700"
                                      : discColor.includes("purple") ? "bg-purple-500 border-purple-700"
                                        : "bg-emerald-500 border-emerald-700"
                              )}
                              style={{ left: `${pct}%`, marginLeft: "-6px" }}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-[10px]">
                            <p className="font-semibold">{occ.pmName}</p>
                            <p>{format(occ.date, "EEEE dd MMM yyyy")}</p>
                            <p className="text-muted-foreground">Every {occ.frequency}</p>
                            {occ.assetNumber && <p>Asset: {occ.assetNumber}</p>}
                            {occ.isAdjusted && <p className="text-amber-600 font-bold">Adjusted {adj > 0 ? `+${adj}` : adj} days</p>}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer summary */}
      <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span>90-day window</span>
          <span>·</span>
          <span>{occurrences.length} total occurrences</span>
          <span>·</span>
          <span>{hasAdjustments ? `${Object.keys(adjustments).filter(k => adjustments[k] !== 0).length} PMs adjusted` : "No adjustments"}</span>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(DISCIPLINE_COLORS).map(([disc, color]) => (
            <div key={disc} className="flex items-center gap-1">
              <div className={cn("w-2.5 h-2.5 rounded-full border", color)} />
              <span className="text-[9px] text-muted-foreground">{disc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
