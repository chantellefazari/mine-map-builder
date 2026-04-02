import { useState, useMemo } from "react";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Route, AlertTriangle, Filter, ChevronRight } from "lucide-react";
import {
  EDGES, COL_LABELS,
  ALL_AREA_OPTIONS, ALL_TRADES,
} from "./shutdownData";
import { SequenceFlowCard } from "./SequenceFlowCard";
import { SequenceFlowDetailPanel } from "./SequenceFlowDetailPanel";

/* ── Phase timeline ranges ── */
const PHASE_TIME: { start: string; end: string }[] = [
  { start: "Day 1  06:00", end: "Day 1  12:00" },
  { start: "Day 1  10:00", end: "Day 2  00:00" },
  { start: "Day 1  12:00", end: "Day 2  14:00" },
  { start: "Day 2  06:00", end: "Day 2  20:00" },
  { start: "Day 2  20:00", end: "Day 3  06:00" },
];

type WPStatus = "Ready" | "Active" | "Blocked" | "Delayed" | "Complete";
const ALL_STATUSES: WPStatus[] = ["Ready", "Active", "Blocked", "Delayed", "Complete"];

export function ShutdownSequenceFlowTab() {
  const {
    selectedPackageId: selectedId, setSelectedPackageId: setSelectedId,
    filterArea, setFilterArea, filterTrade, setFilterTrade,
    showCriticalOnly, setShowCriticalOnly, packages,
  } = useOrchestratorContext();
  const [filterStatus, setFilterStatus] = useState("All");
  const [showDelayedOnly, setShowDelayedOnly] = useState(false);

  const selected = packages.find((n) => n.id === selectedId) ?? null;

  const delayedImpact = useMemo(() => {
    const delayedIds = new Set(packages.filter((n) => n.status === "Delayed" || n.status === "Blocked").map((n) => n.id));
    const affected = new Set<string>();
    const visit = (id: string) => {
      EDGES.filter((e) => e.from === id).forEach((e) => {
        if (!affected.has(e.to) && !delayedIds.has(e.to)) {
          affected.add(e.to);
          visit(e.to);
        }
      });
    };
    delayedIds.forEach((id) => visit(id));
    return affected;
  }, [packages]);

  const visibleNodes = useMemo(() => {
    return packages.filter((n) => {
      if (filterArea !== "All" && n.area !== filterArea) return false;
      if (filterTrade !== "All" && n.trade !== filterTrade) return false;
      if (filterStatus !== "All" && n.status !== filterStatus) return false;
      if (showCriticalOnly && !n.criticalPath) return false;
      if (showDelayedOnly && n.status !== "Delayed" && n.status !== "Blocked" && !delayedImpact.has(n.id)) return false;
      return true;
    });
  }, [filterArea, filterTrade, filterStatus, showCriticalOnly, showDelayedOnly, delayedImpact, packages]);

  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  const phases = useMemo(() => {
    return COL_LABELS.map((label, colIdx) => ({
      label,
      packages: PACKAGES.filter(p => p.col === colIdx).sort((a, b) => {
        // Sort by planned start time, then by row
        if (a.plannedStart !== b.plannedStart) return a.plannedStart < b.plannedStart ? -1 : 1;
        return a.row - b.row;
      }),
    }));
  }, []);

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
        <Button variant={showDelayedOnly ? "default" : "outline"} size="sm" className="h-8 text-xs gap-1" onClick={() => setShowDelayedOnly(!showDelayedOnly)}>
          <AlertTriangle className="w-3 h-3" /> Delay Impact
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

      {/* ===== MAIN: PHASE COLUMNS + DETAIL PANEL ===== */}
      <div className="flex gap-0">
        {/* Phase columns */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          <div className="flex min-w-fit">
            {phases.map((phase, phaseIdx) => {
              const visibleCount = phase.packages.filter(p => visibleIds.has(p.id)).length;
              const time = PHASE_TIME[phaseIdx];
              const isLastPhase = phaseIdx === phases.length - 1;

              return (
                <div key={phaseIdx} className="flex items-stretch">
                  {/* Phase column */}
                  <div className="min-w-[240px] max-w-[280px] flex-1">
                    {/* Phase header with timeline */}
                    <div className={cn(
                      "border border-border px-3 py-2",
                      phaseIdx === 0 ? "rounded-tl-lg" : "",
                      isLastPhase ? "rounded-tr-lg" : "",
                    )}>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-[11px] font-bold text-foreground tracking-wide">{phase.label}</h3>
                        <span className="text-[10px] text-muted-foreground font-semibold bg-muted/60 px-1.5 py-0.5 rounded-full">{visibleCount}</span>
                      </div>
                      {/* Time range bar */}
                      <div className="flex items-center gap-1.5 text-[9px]">
                        <span className="font-mono font-semibold text-foreground bg-muted/80 px-1.5 py-0.5 rounded">{time.start}</span>
                        <div className="flex-1 h-px bg-border relative">
                          <ChevronRight className="w-3 h-3 text-muted-foreground absolute -right-1 -top-1.5" />
                        </div>
                        <span className="font-mono text-muted-foreground">{time.end}</span>
                      </div>
                    </div>

                    {/* Phase cards */}
                    <div className={cn(
                      "border border-t-0 border-border bg-background p-2 space-y-2 min-h-[200px]",
                      phaseIdx === 0 ? "rounded-bl-lg" : "",
                      isLastPhase ? "rounded-br-lg" : "",
                    )}>
                      {phase.packages.map((pkg) => {
                        const visible = visibleIds.has(pkg.id);
                        const isSelected = selectedId === pkg.id;
                        const isImpacted = delayedImpact.has(pkg.id);
                        const incomingEdges = EDGES.filter(e => e.to === pkg.id);

                        return (
                          <SequenceFlowCard
                            key={pkg.id}
                            pkg={pkg}
                            isSelected={isSelected}
                            isVisible={visible}
                            isImpacted={isImpacted}
                            showDelayedOnly={showDelayedOnly}
                            incomingEdges={incomingEdges}
                            onSelect={() => setSelectedId(isSelected ? null : pkg.id)}
                          />
                        );
                      })}

                      {visibleCount === 0 && (
                        <div className="text-center py-8 text-[10px] text-muted-foreground">No packages</div>
                      )}
                    </div>
                  </div>

                  {/* Flow arrow between phases */}
                  {!isLastPhase && (
                    <div className="flex flex-col items-center justify-center w-8 flex-shrink-0">
                      <div className="flex-1 w-px bg-border" />
                      <div className="my-2 flex flex-col items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-muted/60 border border-border flex items-center justify-center">
                          <ChevronRight className="w-3.5 h-3.5 text-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 w-px bg-border" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== DETAIL PANEL ===== */}
        {selected && (
          <SequenceFlowDetailPanel
            selected={selected}
            delayedImpact={delayedImpact}
            onClose={() => setSelectedId(null)}
            onSelect={setSelectedId}
          />
        )}
      </div>
    </div>
  );
}
