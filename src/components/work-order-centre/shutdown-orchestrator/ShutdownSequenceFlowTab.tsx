import { useState, useMemo } from "react";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Route, AlertTriangle, Filter, Calendar as CalendarIcon } from "lucide-react";
import { ALL_AREA_OPTIONS, ALL_TRADES } from "./shutdownData";
import { SequenceFlowCard } from "./SequenceFlowCard";
import { SequenceFlowDetailPanel } from "./SequenceFlowDetailPanel";
import { useShutdowns } from "@/hooks/useShutdowns";
import { format, parseISO, addDays, isSameDay } from "date-fns";

type WPStatus = "Ready" | "Active" | "Blocked" | "Delayed" | "Complete";
const ALL_STATUSES: WPStatus[] = ["Ready", "Active", "Blocked", "Delayed", "Complete"];

export function ShutdownSequenceFlowTab() {
  const {
    selectedPackageId: selectedId, setSelectedPackageId: setSelectedId,
    filterArea, setFilterArea, filterTrade, setFilterTrade,
    showCriticalOnly, setShowCriticalOnly, packages,
    selectedShutdownId,
  } = useOrchestratorContext();
  const { shutdowns } = useShutdowns();
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
      days.push({
        date: d,
        label: `Day ${dayNum} — ${format(d, "EEE d MMM")}`,
        dateStr: format(d, "yyyy-MM-dd"),
      });
      d = addDays(d, 1);
      dayNum++;
    }
    // Add an "Unscheduled" column for WOs without a date
    return days;
  }, [shutdown]);

  const visibleNodes = useMemo(() => {
    return packages.filter((n) => {
      if (filterArea !== "All" && n.area !== filterArea) return false;
      if (filterTrade !== "All" && n.trade !== filterTrade) return false;
      if (filterStatus !== "All" && n.status !== filterStatus) return false;
      if (showCriticalOnly && n.criticalPath) return false;
      return true;
    });
  }, [filterArea, filterTrade, filterStatus, showCriticalOnly, packages]);

  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  // Group packages by scheduled date
  const packagesByDay = useMemo(() => {
    const map = new Map<string, typeof packages>();
    // Unscheduled bucket
    map.set("unscheduled", []);
    for (const col of dayColumns) {
      map.set(col.dateStr, []);
    }
    for (const pkg of packages) {
      const sd = (pkg as any).scheduledDate;
      if (sd && map.has(sd)) {
        map.get(sd)!.push(pkg);
      } else {
        map.get("unscheduled")!.push(pkg);
      }
    }
    return map;
  }, [packages, dayColumns]);

  const unscheduled = packagesByDay.get("unscheduled") || [];

  return (
    <div className="space-y-3">
      {/* ===== FILTERS ===== */}
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

        {/* Legend */}
        <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Active</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Ready</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Blocked</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Delayed</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/30" /> Complete</span>
        </div>
      </div>

      {packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-border rounded-lg bg-card">
          <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No Work Packages</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Assign work orders to this shutdown from the Shutdown Schedule view
          </p>
        </div>
      ) : (
        <div className="flex gap-0">
          {/* Day columns */}
          <div className="flex-1 min-w-0 overflow-x-auto">
            <div className="flex min-w-fit">
              {/* Unscheduled column */}
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
                      {unscheduled.map(pkg => {
                        const visible = visibleIds.has(pkg.id);
                        const isSelected = selectedId === pkg.id;
                        return (
                          <SequenceFlowCard
                            key={pkg.id}
                            pkg={pkg}
                            isSelected={isSelected}
                            isVisible={visible}
                            isImpacted={false}
                            showDelayedOnly={false}
                            incomingEdges={[]}
                            onSelect={() => setSelectedId(isSelected ? null : pkg.id)}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-6 flex-shrink-0">
                    <div className="flex-1 w-px bg-border" />
                  </div>
                </div>
              )}

              {/* Day columns */}
              {dayColumns.map((day, dayIdx) => {
                const dayPkgs = packagesByDay.get(day.dateStr) || [];
                const visibleCount = dayPkgs.filter(p => visibleIds.has(p.id)).length;
                const isFirst = dayIdx === 0 && unscheduled.length === 0;
                const isLast = dayIdx === dayColumns.length - 1;
                const isToday = isSameDay(day.date, new Date());

                return (
                  <div key={day.dateStr} className="flex items-stretch">
                    <div className="min-w-[240px] max-w-[280px] flex-1">
                      {/* Day header */}
                      <div className={cn(
                        "border border-border px-3 py-2",
                        isFirst ? "rounded-tl-lg" : "",
                        isLast ? "rounded-tr-lg" : "",
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

                      {/* Day cards */}
                      <div className={cn(
                        "border border-t-0 border-border bg-background p-2 space-y-2 min-h-[200px]",
                        isFirst ? "rounded-bl-lg" : "",
                        isLast ? "rounded-br-lg" : "",
                      )}>
                        {dayPkgs.map(pkg => {
                          const visible = visibleIds.has(pkg.id);
                          const isSelected = selectedId === pkg.id;
                          return (
                            <SequenceFlowCard
                              key={pkg.id}
                              pkg={pkg}
                              isSelected={isSelected}
                              isVisible={visible}
                              isImpacted={false}
                              showDelayedOnly={false}
                              incomingEdges={[]}
                              onSelect={() => setSelectedId(isSelected ? null : pkg.id)}
                            />
                          );
                        })}
                        {visibleCount === 0 && dayPkgs.length === 0 && (
                          <div className="text-center py-8 text-[10px] text-muted-foreground">No packages</div>
                        )}
                      </div>
                    </div>

                    {/* Divider between days */}
                    {!isLast && (
                      <div className="flex flex-col items-center justify-center w-4 flex-shrink-0">
                        <div className="flex-1 w-px bg-border" />
                      </div>
                    )}
                  </div>
                );
              })}
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
