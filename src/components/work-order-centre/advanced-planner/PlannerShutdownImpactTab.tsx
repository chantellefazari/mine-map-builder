import { useState, useMemo, useCallback } from "react";
import {
  AlertTriangle, Calendar, ChevronDown, ChevronRight, ChevronsRight,
  X, CheckSquare, Square, Building2, Clock, Ban, ArrowRightLeft,
  Wrench, Zap, ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import {
  format, addDays, parseISO, isWithinInterval, differenceInDays,
  startOfWeek, endOfWeek,
} from "date-fns";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";
import { WO_TYPE_CONFIG } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

// Frequencies that should be cancelled during shutdown (plant offline)
const CANCEL_FREQUENCIES = ["Daily", "Weekly", "Shift"];

export function PlannerShutdownImpactTab({ items }: Props) {
  const { update } = useWorkOrders();
  const [shutdownStart, setShutdownStart] = useState<Date | undefined>(undefined);
  const [shutdownEnd, setShutdownEnd] = useState<Date | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pushDays, setPushDays] = useState(7);
  const [processing, setProcessing] = useState(false);

  // Items affected by the shutdown window
  const { impactedWOs, dailyPMs, otherPMs, unaffected } = useMemo(() => {
    if (!shutdownStart || !shutdownEnd) return { impactedWOs: [], dailyPMs: [], otherPMs: [], unaffected: items };

    const impactedWOs: PlannerItem[] = [];
    const dailyPMs: PlannerItem[] = [];
    const otherPMs: PlannerItem[] = [];
    const unaffected: PlannerItem[] = [];

    for (const item of items) {
      // Check if scheduled within shutdown window
      if (item.scheduledDate) {
        try {
          const d = parseISO(item.scheduledDate);
          if (isWithinInterval(d, { start: shutdownStart, end: shutdownEnd })) {
            if (item.source === "pm" || item.woType === "PM") {
              if (CANCEL_FREQUENCIES.some(f => item.frequency.toLowerCase().includes(f.toLowerCase()))) {
                dailyPMs.push(item);
              } else {
                otherPMs.push(item);
              }
            } else {
              impactedWOs.push(item);
            }
            continue;
          }
        } catch { /* ignore */ }
      }

      // Also check PM frequency projections
      if (item.source === "pm" && CANCEL_FREQUENCIES.some(f => item.frequency.toLowerCase().includes(f.toLowerCase()))) {
        dailyPMs.push(item);
        continue;
      }

      unaffected.push(item);
    }

    return { impactedWOs, dailyPMs, otherPMs, unaffected };
  }, [items, shutdownStart, shutdownEnd]);

  const shutdownDays = shutdownStart && shutdownEnd ? differenceInDays(shutdownEnd, shutdownStart) + 1 : 0;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAllImpacted = () => {
    const allIds = [...impactedWOs, ...otherPMs].map(i => i.id);
    setSelectedIds(new Set(allIds));
  };

  const selectAllDaily = () => {
    setSelectedIds(new Set(dailyPMs.map(i => i.id)));
  };

  // Bulk push selected WOs after shutdown
  const pushAfterShutdown = useCallback(async () => {
    if (!shutdownEnd) return;
    setProcessing(true);
    const targetDate = addDays(shutdownEnd, pushDays);
    const dateStr = format(targetDate, "yyyy-MM-dd");
    let count = 0;
    for (const id of selectedIds) {
      const item = items.find(i => i.id === id);
      if (!item || item.source !== "wo") continue;
      try {
        await update.mutateAsync({
          id: item.sourceId,
          updates: { scheduled_date: dateStr } as any,
        });
        count++;
      } catch { /* continue */ }
    }
    toast.success(`Rescheduled ${count} WOs to ${dateStr}`);
    setSelectedIds(new Set());
    setProcessing(false);
  }, [shutdownEnd, pushDays, selectedIds, items, update]);

  // Cancel daily PMs (set status to On Hold or remove scheduled_date)
  const cancelDailyPMs = useCallback(async () => {
    setProcessing(true);
    let count = 0;
    for (const item of dailyPMs) {
      if (item.source !== "wo") continue;
      try {
        await update.mutateAsync({
          id: item.sourceId,
          updates: { status: "On Hold", scheduled_date: null } as any,
        });
        count++;
      } catch { /* continue */ }
    }
    toast.success(`Cancelled ${count} daily PMs during shutdown`);
    setProcessing(false);
  }, [dailyPMs, update]);

  // Bulk reschedule selected to specific date
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const bulkReschedule = useCallback(async () => {
    if (!rescheduleDate) return;
    setProcessing(true);
    const dateStr = format(rescheduleDate, "yyyy-MM-dd");
    let count = 0;
    for (const id of selectedIds) {
      const item = items.find(i => i.id === id);
      if (!item || item.source !== "wo") continue;
      try {
        await update.mutateAsync({
          id: item.sourceId,
          updates: { scheduled_date: dateStr } as any,
        });
        count++;
      } catch { /* continue */ }
    }
    toast.success(`Rescheduled ${count} WOs to ${dateStr}`);
    setSelectedIds(new Set());
    setProcessing(false);
  }, [rescheduleDate, selectedIds, items, update]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-foreground">Shutdown Impact Analysis</span>
        </div>
      </div>

      {/* Shutdown window selector */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-amber-500/5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-medium">Shutdown Window:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <Calendar className="w-3 h-3" />
                {shutdownStart ? format(shutdownStart, "d MMM yyyy") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarPicker mode="single" selected={shutdownStart} onSelect={setShutdownStart} />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <Calendar className="w-3 h-3" />
                {shutdownEnd ? format(shutdownEnd, "d MMM yyyy") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarPicker mode="single" selected={shutdownEnd} onSelect={setShutdownEnd} />
            </PopoverContent>
          </Popover>
          {shutdownDays > 0 && (
            <Badge variant="secondary" className="text-[10px] h-5">
              {shutdownDays} days
            </Badge>
          )}
        </div>
      </div>

      {!shutdownStart || !shutdownEnd ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Building2 className="w-10 h-10 text-muted-foreground/20 mx-auto" />
            <p className="text-sm text-muted-foreground">Select a shutdown window to analyse impact</p>
            <p className="text-[10px] text-muted-foreground/60">
              The system will identify all affected work orders and daily PMs that need to be moved or cancelled
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Impact summary */}
          <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-border">
            <ImpactCard label="Impacted WOs" value={impactedWOs.length} icon={AlertTriangle} color="text-red-600" description="Need rescheduling" />
            <ImpactCard label="Daily PMs to Cancel" value={dailyPMs.length} icon={Ban} color="text-amber-600" description="Plant offline — not required" />
            <ImpactCard label="Other PMs Affected" value={otherPMs.length} icon={Clock} color="text-blue-600" description="May need rescheduling" />
            <ImpactCard label="Hours Affected" value={`${(impactedWOs.reduce((s, i) => s + i.estimatedHours, 0) + dailyPMs.reduce((s, i) => s + i.estimatedHours, 0) + otherPMs.reduce((s, i) => s + i.estimatedHours, 0)).toFixed(0)}h`} icon={Clock} color="text-muted-foreground" description="Total planned hours" />
          </div>

          {/* Bulk actions */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={selectAllImpacted}
            >
              <CheckSquare className="w-3 h-3" /> Select WOs
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={selectAllDaily}
            >
              <CheckSquare className="w-3 h-3" /> Select Daily PMs
            </Button>
            <span className="text-[10px] text-muted-foreground">{selectedIds.size} selected</span>

            <div className="h-4 w-px bg-border" />

            {/* Push after shutdown */}
            <div className="flex items-center gap-1">
              <ChevronsRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Push</span>
              <Input
                type="number"
                value={pushDays}
                onChange={e => setPushDays(Number(e.target.value))}
                className="w-12 h-6 text-[10px] text-center"
              />
              <span className="text-[10px] text-muted-foreground">days after shutdown</span>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[10px]"
                onClick={pushAfterShutdown}
                disabled={processing || selectedIds.size === 0}
              >
                Push
              </Button>
            </div>

            <div className="h-4 w-px bg-border" />

            {/* Reschedule to date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" disabled={selectedIds.size === 0}>
                  <Calendar className="w-3 h-3" /> Reschedule to...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker mode="single" onSelect={(d) => { setRescheduleDate(d); if (d) bulkReschedule(); }} />
              </PopoverContent>
            </Popover>

            <div className="h-4 w-px bg-border" />

            {/* Cancel daily PMs */}
            <Button
              variant="destructive"
              size="sm"
              className="h-6 text-[10px] gap-1"
              onClick={cancelDailyPMs}
              disabled={processing || dailyPMs.length === 0}
            >
              <Ban className="w-3 h-3" /> Cancel Daily PMs ({dailyPMs.length})
            </Button>

            {selectedIds.size > 0 && (
              <Button variant="ghost" size="sm" className="h-6 text-[10px] ml-auto" onClick={() => setSelectedIds(new Set())}>
                <X className="w-3 h-3" /> Clear
              </Button>
            )}
          </div>

          {/* Lists */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Impacted WOs */}
              <ImpactSection
                title="Work Orders in Shutdown Window"
                icon={AlertTriangle}
                color="text-red-600"
                items={impactedWOs}
                selectedIds={selectedIds}
                onToggle={toggleSelect}
                emptyText="No scheduled work orders fall within the shutdown window"
              />

              {/* Daily PMs to cancel */}
              <ImpactSection
                title="Daily/Weekly PMs — Cancel (Plant Offline)"
                icon={Ban}
                color="text-amber-600"
                items={dailyPMs}
                selectedIds={selectedIds}
                onToggle={toggleSelect}
                emptyText="No daily/weekly PMs to cancel"
                highlight
              />

              {/* Other affected PMs */}
              <ImpactSection
                title="Other PMs Affected"
                icon={Clock}
                color="text-blue-600"
                items={otherPMs}
                selectedIds={selectedIds}
                onToggle={toggleSelect}
                emptyText="No other PMs affected"
              />
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}

function ImpactCard({ label, value, icon: Icon, color, description }: {
  label: string; value: number | string; icon: React.ElementType; color: string; description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={cn("w-3.5 h-3.5", color)} />
        <span className="text-[9px] text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-[9px] text-muted-foreground/70">{description}</div>
    </div>
  );
}

function ImpactSection({ title, icon: Icon, color, items, selectedIds, onToggle, emptyText, highlight }: {
  title: string; icon: React.ElementType; color: string; items: PlannerItem[];
  selectedIds: Set<string>; onToggle: (id: string) => void; emptyText: string; highlight?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const totalHrs = items.reduce((s, i) => s + i.estimatedHours, 0);

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", highlight && "border-amber-300 bg-amber-500/5")}>
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        <Icon className={cn("w-3.5 h-3.5", color)} />
        <span className="text-xs font-bold text-foreground">{title}</span>
        <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{items.length}</Badge>
        <span className="text-[9px] text-muted-foreground ml-auto">{totalHrs.toFixed(0)} hrs</span>
      </div>

      {open && (
        <div className="border-t border-border/50">
          {items.length === 0 ? (
            <div className="px-4 py-4 text-center text-[10px] text-muted-foreground">{emptyText}</div>
          ) : (
            items.map(item => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 border-b border-border/20 last:border-b-0 cursor-pointer hover:bg-muted/20 transition-colors",
                    isSelected && "bg-primary/5"
                  )}
                  onClick={() => onToggle(item.id)}
                >
                  {isSelected
                    ? <CheckSquare className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    : <Square className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                  }
                  <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", WO_TYPE_CONFIG[item.woType]?.color || "bg-muted-foreground")} />
                  <span className="text-[10px] font-mono text-muted-foreground w-20 flex-shrink-0">{item.woNumber || "PM"}</span>
                  <span className="text-[10px] text-foreground truncate flex-1">{item.taskName}</span>
                  <span className="text-[9px] font-mono text-muted-foreground flex-shrink-0">{item.assetNumber}</span>
                  <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 flex-shrink-0">{item.frequency || item.woType}</Badge>
                  {item.scheduledDate && (
                    <span className="text-[9px] text-muted-foreground flex-shrink-0">{item.scheduledDate}</span>
                  )}
                  <span className="text-[9px] text-muted-foreground tabular-nums flex-shrink-0">{item.estimatedHours > 0 ? `${item.estimatedHours}h` : ""}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
