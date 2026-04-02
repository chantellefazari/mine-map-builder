import { useState, useMemo } from "react";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Route, AlertTriangle, Filter, Calendar as CalendarIcon, Lock, ArrowUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { ALL_AREA_OPTIONS, ALL_TRADES } from "./shutdownData";
import { SequenceFlowCard } from "./SequenceFlowCard";
import { SequenceFlowDetailPanel } from "./SequenceFlowDetailPanel";
import { useShutdowns } from "@/hooks/useShutdowns";
import { useRundownSteps } from "@/hooks/useRundownSteps";
import { format, parseISO, addDays, isSameDay } from "date-fns";

type WPStatus = "Ready" | "Active" | "Blocked" | "Delayed" | "Complete";
const ALL_STATUSES: WPStatus[] = ["Ready", "Active", "Blocked", "Delayed", "Complete"];

const STATUS_STYLE: Record<string, string> = {
  Pending: "border-border bg-muted/30",
  "In Progress": "border-amber-500/40 bg-amber-500/10",
  Complete: "border-emerald-500/40 bg-emerald-500/10",
};

export function ShutdownSequenceFlowTab() {
  const {
    selectedPackageId: selectedId, setSelectedPackageId: setSelectedId,
    filterArea, setFilterArea, filterTrade, setFilterTrade,
    showCriticalOnly, setShowCriticalOnly, packages,
    selectedShutdownId,
  } = useOrchestratorContext();
  const { shutdowns } = useShutdowns();
  const { rundownSteps, runupSteps } = useRundownSteps(selectedShutdownId);
  const [filterStatus, setFilterStatus] = useState("All");

  const selected = packages.find((n) => n.id === selectedId) ?? null;
  const shutdown = shutdowns.find(s => s.id === selectedShutdownId) ?? null;

  // Build day columns from shutdown date range
  const dayColumns = useMemo(() => {
    if (!shutdown) return [];
    const start = parseISO(shutdown.start_date);
    const end = shutdown.end_date ? parseISO(shutdown.end_date) : start;
    const days: { date: Date; label: string; dateStr: string }[] = [];
    let d = start;
    let dayNum = 1;
    while (d <= end) {
      days.push({ date: d, label: `Day ${dayNum} — ${format(d, "EEE d MMM")}`, dateStr: format(d, "yyyy-MM-dd") });
      d = addDays(d, 1);
      dayNum++;
    }
    return days;
  }, [shutdown]);

  const visibleNodes = useMemo(() => {
    return packages.filter((n) => {
      if (filterArea !== "All" && n.area !== filterArea) return false;
      if (filterTrade !== "All" && n.trade !== filterTrade) return false;
      if (filterStatus !== "All" && n.status !== filterStatus) return false;
      if (showCriticalOnly && !n.criticalPath) return false;
      return true;
    });
  }, [filterArea, filterTrade, filterStatus, showCriticalOnly, packages]);

  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  // Group packages by scheduled date
  const packagesByDay = useMemo(() => {
    const map = new Map<string, typeof packages>();
    map.set("unscheduled", []);
    for (const col of dayColumns) map.set(col.dateStr, []);
    for (const pkg of packages) {
      const sd = (pkg as any).scheduledDate;
      if (sd && map.has(sd)) map.get(sd)!.push(pkg);
      else map.get("unscheduled")!.push(pkg);
    }
    return map;
  }, [packages, dayColumns]);

  const unscheduled = packagesByDay.get("unscheduled") || [];
  const rdTotalHrs = rundownSteps.reduce((s, r) => s + r.duration_hours, 0);
  const ruTotalHrs = runupSteps.reduce((s, r) => s + r.duration_hours, 0);

  return (
    <div className="space-y-3">
      {/* ── Flow Indicator ── */}
      <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-4 py-2 border border-border">
        <div className="flex items-center gap-1 text-amber-700">
          <Lock className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">Run-Down ({rundownSteps.length} steps · {rdTotalHrs}h)</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <div className="flex items-center gap-1 text-blue-600">
          <span className="text-xs font-bold">Work Packages ({packages.length})</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <div className="flex items-center gap-1 text-emerald-700">
          <ArrowUp className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">Run-Up ({runupSteps.length} steps · {ruTotalHrs}h)</span>
        </div>
        <Badge variant="outline" className="ml-auto text-[9px]">Auto-chained</Badge>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ALL_AREA_OPTIONS.map((a) => <SelectItem key={a} value={a}>{a === "All" ? "All Areas" : a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterTrade} onValueChange={setFilterTrade}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ALL_TRADES.map((t) => <SelectItem key={t} value={t}>{t === "All" ? "All Trades" : t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant={showCriticalOnly ? "default" : "outline"} size="sm" className="h-8 text-xs gap-1" onClick={() => setShowCriticalOnly(!showCriticalOnly)}>
          <Route className="w-3 h-3" /> Critical Path
        </Button>

        <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Run-Down</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Active</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Ready</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Blocked</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-700" /> Run-Up</span>
        </div>
      </div>

      {packages.length === 0 && rundownSteps.length === 0 && runupSteps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-border rounded-lg bg-card">
          <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No Work Packages or Run-Down Steps</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Add run-down steps in Overview, then assign work orders from the Schedule
          </p>
        </div>
      ) : (
        <div className="flex gap-0">
          <div className="flex-1 min-w-0 overflow-x-auto">
            <div className="flex min-w-fit">
              {/* ── Run-Down Column ── */}
              {rundownSteps.length > 0 && (
                <div className="flex items-stretch">
                  <div className="min-w-[240px] max-w-[280px] flex-1">
                    <div className="border border-amber-500/30 px-3 py-2 rounded-tl-lg bg-amber-500/10">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-[11px] font-bold text-amber-700 tracking-wide flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Run-Down
                        </h3>
                        <span className="text-[10px] text-amber-600 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                          {rdTotalHrs}h
                        </span>
                      </div>
                      <span className="text-[9px] text-amber-600">{rundownSteps.length} isolation/shutdown steps</span>
                    </div>
                    <div className="border border-t-0 border-amber-500/30 bg-background p-2 space-y-1.5 min-h-[200px] rounded-bl-lg">
                      {rundownSteps.map((step, i) => (
                        <div
                          key={step.id}
                          className={cn(
                            "rounded border px-2.5 py-2 text-xs",
                            STATUS_STYLE[step.status],
                          )}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-mono font-bold text-[10px] text-amber-700">RD-{i + 1}</span>
                            <span className={cn(
                              "text-[8px] font-semibold",
                              step.status === "Complete" ? "text-emerald-600" : step.status === "In Progress" ? "text-amber-600" : "text-muted-foreground",
                            )}>{step.status}</span>
                          </div>
                          <p className="text-[10px] font-medium text-foreground leading-snug">{step.step_description}</p>
                          <div className="flex items-center gap-2 text-[8px] text-muted-foreground mt-1">
                            {step.work_centre && <span>{step.work_centre}</span>}
                            {step.start_time && <span>{step.start_time}–{step.finish_time}</span>}
                            <span>{step.duration_hours}h</span>
                            {step.responsible && <span>· {step.responsible}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-6 flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              )}

              {/* ── Unscheduled ── */}
              {unscheduled.length > 0 && (
                <div className="flex items-stretch">
                  <div className="min-w-[240px] max-w-[280px] flex-1">
                    <div className="border border-border px-3 py-2 rounded-tl-lg bg-amber-500/5">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-[11px] font-bold text-amber-600 tracking-wide">Unscheduled</h3>
                        <span className="text-[10px] text-muted-foreground font-semibold bg-muted/60 px-1.5 py-0.5 rounded-full">
                          {unscheduled.filter(p => visibleIds.has(p.id)).length}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground">No date assigned</span>
                    </div>
                    <div className="border border-t-0 border-border bg-background p-2 space-y-2 min-h-[200px] rounded-bl-lg">
                      {unscheduled.map(pkg => (
                        <SequenceFlowCard
                          key={pkg.id}
                          pkg={pkg}
                          isSelected={selectedId === pkg.id}
                          isVisible={visibleIds.has(pkg.id)}
                          isImpacted={false}
                          showDelayedOnly={false}
                          incomingEdges={[]}
                          onSelect={() => setSelectedId(selectedId === pkg.id ? null : pkg.id)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-6 flex-shrink-0">
                    <div className="flex-1 w-px bg-border" />
                  </div>
                </div>
              )}

              {/* ── Day columns ── */}
              {dayColumns.map((day, dayIdx) => {
                const dayPkgs = packagesByDay.get(day.dateStr) || [];
                const visibleCount = dayPkgs.filter(p => visibleIds.has(p.id)).length;
                const isLast = dayIdx === dayColumns.length - 1 && runupSteps.length === 0;
                const isToday = isSameDay(day.date, new Date());

                return (
                  <div key={day.dateStr} className="flex items-stretch">
                    <div className="min-w-[240px] max-w-[280px] flex-1">
                      <div className={cn(
                        "border border-border px-3 py-2",
                        isToday && "bg-primary/5 border-primary/30",
                      )}>
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className={cn("text-[11px] font-bold tracking-wide", isToday ? "text-primary" : "text-foreground")}>
                            {day.label}
                          </h3>
                          <span className="text-[10px] text-muted-foreground font-semibold bg-muted/60 px-1.5 py-0.5 rounded-full">
                            {visibleCount}
                          </span>
                        </div>
                        {isToday && <span className="text-[9px] text-primary font-medium">TODAY</span>}
                      </div>
                      <div className="border border-t-0 border-border bg-background p-2 space-y-2 min-h-[200px]">
                        {dayPkgs.map(pkg => (
                          <SequenceFlowCard
                            key={pkg.id}
                            pkg={pkg}
                            isSelected={selectedId === pkg.id}
                            isVisible={visibleIds.has(pkg.id)}
                            isImpacted={false}
                            showDelayedOnly={false}
                            incomingEdges={[]}
                            onSelect={() => setSelectedId(selectedId === pkg.id ? null : pkg.id)}
                          />
                        ))}
                        {visibleCount === 0 && dayPkgs.length === 0 && (
                          <div className="text-center py-8 text-[10px] text-muted-foreground">No packages</div>
                        )}
                      </div>
                    </div>
                    {!isLast && (
                      <div className="flex flex-col items-center justify-center w-4 flex-shrink-0">
                        <div className="flex-1 w-px bg-border" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ── Run-Up Column ── */}
              {runupSteps.length > 0 && (
                <div className="flex items-stretch">
                  <div className="flex flex-col items-center justify-center w-6 flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-[240px] max-w-[280px] flex-1">
                    <div className="border border-emerald-500/30 px-3 py-2 rounded-tr-lg bg-emerald-500/10">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-[11px] font-bold text-emerald-700 tracking-wide flex items-center gap-1">
                          <ArrowUp className="w-3 h-3" /> Run-Up
                        </h3>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                          {ruTotalHrs}h
                        </span>
                      </div>
                      <span className="text-[9px] text-emerald-600">{runupSteps.length} commissioning steps</span>
                    </div>
                    <div className="border border-t-0 border-emerald-500/30 bg-background p-2 space-y-1.5 min-h-[200px] rounded-br-lg">
                      {runupSteps.map((step, i) => (
                        <div
                          key={step.id}
                          className={cn(
                            "rounded border px-2.5 py-2 text-xs",
                            STATUS_STYLE[step.status],
                          )}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-mono font-bold text-[10px] text-emerald-700">RU-{i + 1}</span>
                            <span className={cn(
                              "text-[8px] font-semibold",
                              step.status === "Complete" ? "text-emerald-600" : step.status === "In Progress" ? "text-amber-600" : "text-muted-foreground",
                            )}>{step.status}</span>
                          </div>
                          <p className="text-[10px] font-medium text-foreground leading-snug">{step.step_description}</p>
                          <div className="flex items-center gap-2 text-[8px] text-muted-foreground mt-1">
                            {step.work_centre && <span>{step.work_centre}</span>}
                            {step.start_time && <span>{step.start_time}–{step.finish_time}</span>}
                            <span>{step.duration_hours}h</span>
                            {step.responsible && <span>· {step.responsible}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <SequenceFlowDetailPanel
              selected={selected}
              delayedImpact={new Set()}
              onClose={() => setSelectedId(null)}
              onSelect={setSelectedId}
              packages={packages}
            />
          )}
        </div>
      )}
    </div>
  );
}
