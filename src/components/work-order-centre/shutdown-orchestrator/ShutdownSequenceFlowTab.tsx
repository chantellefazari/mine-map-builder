import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  X, Route, AlertTriangle, Filter, ArrowRight, Lock,
} from "lucide-react";
import {
  PACKAGES, EDGES, COL_LABELS,
  ALL_AREA_OPTIONS, ALL_TRADES,
  type ShutdownWorkPackage, type DepType,
} from "./shutdownData";

/* ------------------------------------------------------------------ */
/*  STYLING                                                            */
/* ------------------------------------------------------------------ */

const STATUS_ACCENT: Record<string, string> = {
  "Not Started": "border-l-muted-foreground/40",
  Ready:         "border-l-blue-500",
  Active:        "border-l-emerald-500",
  Blocked:       "border-l-destructive",
  Delayed:       "border-l-amber-500",
  Complete:      "border-l-muted-foreground/30",
};

const STATUS_DOT: Record<string, string> = {
  "Not Started": "bg-muted-foreground/40",
  Ready:    "bg-blue-500",
  Active:   "bg-emerald-500",
  Blocked:  "bg-destructive",
  Delayed:  "bg-amber-500",
  Complete: "bg-muted-foreground/30",
};

const STATUS_BG: Record<string, string> = {
  "Not Started": "",
  Ready:    "",
  Active:   "",
  Blocked:  "bg-destructive/[0.03]",
  Delayed:  "bg-amber-500/[0.03]",
  Complete: "bg-muted/30",
};

const PROGRESS_COLOR: Record<string, string> = {
  "Not Started": "bg-muted-foreground/20",
  Ready:    "bg-blue-500/50",
  Active:   "bg-emerald-500",
  Blocked:  "bg-destructive/60",
  Delayed:  "bg-amber-500",
  Complete: "bg-muted-foreground/30",
};

const DEP_LABELS: Record<DepType, string> = {
  "finish-to-start": "FS",
  "start-to-start": "SS",
  parallel: "PAR",
  "hold-point": "HOLD",
};

type WPStatus = "Ready" | "Active" | "Blocked" | "Delayed" | "Complete";
const ALL_STATUSES: WPStatus[] = ["Ready", "Active", "Blocked", "Delayed", "Complete"];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ShutdownSequenceFlowTab() {
  const { selectedPackageId: selectedId, setSelectedPackageId: setSelectedId, filterArea, setFilterArea, filterTrade, setFilterTrade, showCriticalOnly, setShowCriticalOnly } = useOrchestratorContext();
  const [filterStatus, setFilterStatus] = useState("All");
  const [showDelayedOnly, setShowDelayedOnly] = useState(false);

  const selected = PACKAGES.find((n) => n.id === selectedId) ?? null;

  const delayedImpact = useMemo(() => {
    const delayedIds = new Set(PACKAGES.filter((n) => n.status === "Delayed" || n.status === "Blocked").map((n) => n.id));
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
  }, []);

  const visibleNodes = useMemo(() => {
    return PACKAGES.filter((n) => {
      if (filterArea !== "All" && n.area !== filterArea) return false;
      if (filterTrade !== "All" && n.trade !== filterTrade) return false;
      if (filterStatus !== "All" && n.status !== filterStatus) return false;
      if (showCriticalOnly && !n.criticalPath) return false;
      if (showDelayedOnly && n.status !== "Delayed" && n.status !== "Blocked" && !delayedImpact.has(n.id)) return false;
      return true;
    });
  }, [filterArea, filterTrade, filterStatus, showCriticalOnly, showDelayedOnly, delayedImpact]);

  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  // Group packages by column (phase)
  const phases = useMemo(() => {
    return COL_LABELS.map((label, colIdx) => ({
      label,
      packages: PACKAGES.filter(p => p.col === colIdx).sort((a, b) => a.row - b.row),
    }));
  }, []);

  // Get predecessors/successors for selected
  const predecessors = useMemo(
    () => (selectedId ? EDGES.filter((e) => e.to === selectedId).map((e) => ({ ...e, node: PACKAGES.find((n) => n.id === e.from)! })).filter(e => e.node) : []),
    [selectedId]
  );
  const successors = useMemo(
    () => (selectedId ? EDGES.filter((e) => e.from === selectedId).map((e) => ({ ...e, node: PACKAGES.find((n) => n.id === e.to)! })).filter(e => e.node) : []),
    [selectedId]
  );

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
      <div className="flex gap-4">
        {/* Phase columns */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          <div className="flex gap-3 min-w-fit">
            {phases.map((phase, phaseIdx) => (
              <div key={phaseIdx} className="flex-1 min-w-[220px] max-w-[280px]">
                {/* Phase header */}
                <div className="rounded-t-lg bg-muted/60 border border-b-0 border-border px-3 py-2 flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-foreground tracking-wide">{phase.label}</h3>
                  <span className="text-[10px] text-muted-foreground font-medium">{phase.packages.filter(p => visibleIds.has(p.id)).length}</span>
                </div>

                {/* Phase cards */}
                <div className="border border-border rounded-b-lg bg-background p-2 space-y-2 min-h-[200px]">
                  {phase.packages.map((pkg) => {
                    const visible = visibleIds.has(pkg.id);
                    const isSelected = selectedId === pkg.id;
                    const isImpacted = delayedImpact.has(pkg.id);

                    // Get incoming edges for this package
                    const incomingEdges = EDGES.filter(e => e.to === pkg.id);
                    const outgoingEdges = EDGES.filter(e => e.from === pkg.id);

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => visible && setSelectedId(isSelected ? null : pkg.id)}
                        className={cn(
                          "rounded-md border border-border border-l-[3px] p-2.5 cursor-pointer transition-all",
                          STATUS_ACCENT[pkg.status],
                          STATUS_BG[pkg.status],
                          !visible && "opacity-15 pointer-events-none",
                          isSelected && "ring-2 ring-foreground/20 shadow-sm",
                          isImpacted && showDelayedOnly && "ring-1 ring-amber-500/40",
                        )}
                      >
                        {/* Row 1: ID + badges */}
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", STATUS_DOT[pkg.status])} />
                          <span className="text-[10px] font-mono font-bold text-foreground">{pkg.id}</span>
                          {pkg.criticalPath && (
                            <span className="text-[8px] font-bold text-destructive bg-destructive/10 px-1 rounded">CP</span>
                          )}
                          <span className="ml-auto text-[9px] font-semibold text-foreground">{pkg.pctComplete}%</span>
                        </div>

                        {/* Row 2: Title */}
                        <p className="text-[11px] font-medium text-foreground leading-tight mb-1 line-clamp-2">
                          {pkg.title}
                        </p>

                        {/* Row 3: Meta */}
                        <p className="text-[9px] text-muted-foreground mb-1.5">
                          {pkg.trade} · {pkg.durationHrs}h · {pkg.supervisor}
                        </p>

                        {/* Progress bar */}
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-1.5">
                          <div
                            className={cn("h-full rounded-full transition-all", PROGRESS_COLOR[pkg.status])}
                            style={{ width: `${pkg.pctComplete}%` }}
                          />
                        </div>

                        {/* Dependencies — compact inline */}
                        {incomingEdges.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap mb-1">
                            <span className="text-[8px] text-muted-foreground">From:</span>
                            {incomingEdges.map((e, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "text-[8px] font-mono px-1 rounded border",
                                  e.type === "hold-point"
                                    ? "bg-destructive/10 border-destructive/20 text-destructive font-bold"
                                    : "bg-muted/60 border-border text-muted-foreground"
                                )}
                              >
                                {e.from}{e.type !== "finish-to-start" ? ` ${DEP_LABELS[e.type]}` : ""}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Delay/blocker warning */}
                        {pkg.delayReason && (
                          <div className="flex items-start gap-1 mt-1 text-[9px] text-amber-600 bg-amber-500/5 rounded px-1.5 py-1 border border-amber-500/10">
                            <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{pkg.delayReason}</span>
                          </div>
                        )}
                        {pkg.blockerDescription && !pkg.delayReason && (
                          <div className="flex items-start gap-1 mt-1 text-[9px] text-destructive bg-destructive/5 rounded px-1.5 py-1 border border-destructive/10">
                            <Lock className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{pkg.blockerDescription}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {phase.packages.filter(p => visibleIds.has(p.id)).length === 0 && (
                    <div className="text-center py-8 text-[10px] text-muted-foreground">No packages</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DETAIL PANEL ===== */}
        {selected && (
          <div className="w-[340px] flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
            <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between",
              selected.status === "Active" ? "bg-emerald-500/5" :
              selected.status === "Blocked" ? "bg-destructive/5" :
              selected.status === "Delayed" ? "bg-amber-500/5" :
              "bg-muted/30"
            )}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-foreground">{selected.id}</span>
                  {selected.criticalPath && <Badge variant="outline" className="text-[8px] h-3.5 border-destructive text-destructive">CP</Badge>}
                  <Badge variant="outline" className="text-[9px] h-4">{selected.status}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-foreground mt-1">{selected.title}</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedId(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-3 space-y-3 max-h-[560px] overflow-y-auto">
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { label: "Area", value: selected.area },
                  { label: "Trade", value: selected.trade },
                  { label: "Duration", value: `${selected.durationHrs}h` },
                  { label: "Progress", value: `${selected.pctComplete}%` },
                  { label: "Start", value: selected.plannedStart },
                  { label: "Finish", value: selected.plannedFinish },
                  { label: "Supervisor", value: selected.supervisor },
                  { label: "Shift", value: selected.shift },
                ].map((item) => (
                  <div key={item.label} className="rounded border border-border px-2 py-1.5">
                    <div className="text-[9px] text-muted-foreground">{item.label}</div>
                    <div className="font-medium text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">{selected.pctComplete}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", PROGRESS_COLOR[selected.status])} style={{ width: `${selected.pctComplete}%` }} />
                </div>
              </div>

              {/* Blocker */}
              {selected.blockerDescription && (
                <div className="rounded border border-destructive/30 bg-destructive/5 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-destructive mb-0.5">
                    <AlertTriangle className="w-3 h-3" /> Blocker — {selected.blockerType}
                  </div>
                  <p className="text-xs text-destructive mb-1">{selected.blockerDescription}</p>
                  {selected.blockerOwner && (
                    <p className="text-[10px] text-destructive/70">Owner: {selected.blockerOwner} · {selected.blockerETA}</p>
                  )}
                </div>
              )}

              {selected.delayReason && !selected.blockerDescription && (
                <div className="rounded border border-amber-500/30 bg-amber-500/5 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 mb-0.5">
                    <Lock className="w-3 h-3" /> Delay
                  </div>
                  <p className="text-xs text-amber-600">{selected.delayReason}</p>
                </div>
              )}

              {/* Predecessors */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">
                  ← Predecessors ({predecessors.length})
                </p>
                {predecessors.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">None — start point</p>
                ) : (
                  <div className="space-y-1">
                    {predecessors.map((p) => (
                      <button key={p.from} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-muted/30 transition-colors" onClick={() => setSelectedId(p.from)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[p.node.status])} />
                        <span className="text-[10px] font-mono font-semibold">{p.node.id}</span>
                        <span className="text-[10px] text-muted-foreground truncate flex-1">{p.node.title}</span>
                        <span className={cn(
                          "text-[8px] font-mono px-1 rounded border",
                          p.type === "hold-point" ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-muted/60 border-border text-muted-foreground"
                        )}>{DEP_LABELS[p.type]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Successors */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">
                  → Successors ({successors.length})
                </p>
                {successors.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">None — end point</p>
                ) : (
                  <div className="space-y-1">
                    {successors.map((s) => (
                      <button key={s.to} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-muted/30 transition-colors" onClick={() => setSelectedId(s.to)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[s.node.status])} />
                        <span className="text-[10px] font-mono font-semibold">{s.node.id}</span>
                        <span className="text-[10px] text-muted-foreground truncate flex-1">{s.node.title}</span>
                        <span className={cn(
                          "text-[8px] font-mono px-1 rounded border",
                          s.type === "hold-point" ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-muted/60 border-border text-muted-foreground"
                        )}>{DEP_LABELS[s.type]}</span>
                        {delayedImpact.has(s.to) && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Handover notes */}
              {selected.handoverNotes && (
                <div className="rounded border border-border bg-muted/20 p-2.5">
                  <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">Handover Notes</p>
                  <p className="text-xs text-foreground">{selected.handoverNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
