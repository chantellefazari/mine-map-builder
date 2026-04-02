/**
 * Printable A1/A0 Wall Chart Gantt — single unified timeline.
 * Run-Down → Work Packages → Run-Up, all as colour-coded bars.
 * Auto-chains: last run-down ➜ all work packages ➜ first run-up.
 */
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useShutdowns } from "@/hooks/useShutdowns";
import { useRundownSteps, type RundownStep } from "@/hooks/useRundownSteps";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { format, parseISO, addDays, differenceInDays } from "date-fns";
import type { ShutdownWorkPackage } from "./shutdownData";
import { CheckCircle2, AlertTriangle, Lock, ArrowUp, Wrench, Zap, ArrowRight } from "lucide-react";

/* ── Status colours ── */
const STATUS_BG: Record<string, string> = {
  "Not Started": "bg-muted/60", Ready: "bg-blue-500/15", Active: "bg-emerald-500/15",
  Blocked: "bg-destructive/15", Delayed: "bg-amber-500/15", Complete: "bg-muted/40",
  Pending: "bg-muted/60", "In Progress": "bg-amber-500/15",
};
const STATUS_BORDER: Record<string, string> = {
  "Not Started": "border-border", Ready: "border-blue-500/40", Active: "border-emerald-500/40",
  Blocked: "border-destructive/40", Delayed: "border-amber-500/40", Complete: "border-muted-foreground/30",
  Pending: "border-border", "In Progress": "border-amber-500/40",
};
const STATUS_TEXT: Record<string, string> = {
  "Not Started": "text-muted-foreground", Ready: "text-blue-600", Active: "text-emerald-600",
  Blocked: "text-destructive", Delayed: "text-amber-600", Complete: "text-muted-foreground",
  Pending: "text-muted-foreground", "In Progress": "text-amber-600",
};

const TRADE_ICON: Record<string, typeof Wrench> = { Mechanical: Wrench, Electrical: Zap };

/* ── Unified timeline item ── */
type TimelinePhase = "run-down" | "work" | "run-up";
interface TimelineItem {
  id: string;
  phase: TimelinePhase;
  title: string;
  subtitle: string;
  durationHrs: number;
  startTime: string;
  finishTime: string;
  status: string;
  pctComplete: number;
  trade: string;
  supervisor: string;
  area: string;
  workCentre: string;
  criticalPath: boolean;
  blockerDescription: string;
  scheduledDate: string | null;
  predecessors: string[];
}

function buildUnifiedTimeline(
  rundownSteps: RundownStep[],
  packages: ShutdownWorkPackage[],
  runupSteps: RundownStep[],
): TimelineItem[] {
  const items: TimelineItem[] = [];
  const lastRundownId = rundownSteps.length > 0 ? `RD-${rundownSteps.length}` : null;

  // Run-Down steps
  rundownSteps.forEach((s, i) => {
    const prevId = i > 0 ? `RD-${i}` : undefined;
    items.push({
      id: `RD-${i + 1}`,
      phase: "run-down",
      title: s.step_description || `Run-Down Step ${i + 1}`,
      subtitle: [s.work_centre, s.responsible].filter(Boolean).join(" · "),
      durationHrs: s.duration_hours,
      startTime: s.start_time,
      finishTime: s.finish_time,
      status: s.status,
      pctComplete: s.status === "Complete" ? 100 : s.status === "In Progress" ? 50 : 0,
      trade: "",
      supervisor: s.responsible,
      area: "",
      workCentre: s.work_centre,
      criticalPath: true,
      blockerDescription: "",
      scheduledDate: null,
      predecessors: prevId ? [prevId] : [],
    });
  });

  // Work Packages — predecessors auto-chain to last run-down step
  packages.forEach((pkg) => {
    items.push({
      id: pkg.id,
      phase: "work",
      title: pkg.title,
      subtitle: [pkg.trade, pkg.supervisor].filter(Boolean).join(" · "),
      durationHrs: pkg.durationHrs,
      startTime: "",
      finishTime: "",
      status: pkg.status,
      pctComplete: pkg.pctComplete,
      trade: pkg.trade,
      supervisor: pkg.supervisor,
      area: pkg.area,
      workCentre: "",
      criticalPath: pkg.criticalPath,
      blockerDescription: pkg.blockerDescription || "",
      scheduledDate: (pkg as any).scheduledDate || null,
      predecessors: lastRundownId ? [lastRundownId] : [],
    });
  });

  // Run-Up steps — first one waits on all work packages
  const allWorkIds = packages.map(p => p.id);
  runupSteps.forEach((s, i) => {
    const preds = i === 0 ? allWorkIds : [`RU-${i}`];
    items.push({
      id: `RU-${i + 1}`,
      phase: "run-up",
      title: s.step_description || `Run-Up Step ${i + 1}`,
      subtitle: [s.work_centre, s.responsible].filter(Boolean).join(" · "),
      durationHrs: s.duration_hours,
      startTime: s.start_time,
      finishTime: s.finish_time,
      status: s.status,
      pctComplete: s.status === "Complete" ? 100 : s.status === "In Progress" ? 50 : 0,
      trade: "",
      supervisor: s.responsible,
      area: "",
      workCentre: s.work_centre,
      criticalPath: true,
      blockerDescription: "",
      scheduledDate: null,
      predecessors: preds,
    });
  });

  return items;
}

interface Props {
  shutdownId: string;
}

export function ShutdownWallChart({ shutdownId }: Props) {
  const { shutdowns } = useShutdowns();
  const { packages } = useOrchestratorContext();
  const { rundownSteps, runupSteps } = useRundownSteps(shutdownId);

  const shutdown = shutdowns.find(s => s.id === shutdownId);
  const startDate = shutdown ? parseISO(shutdown.start_date) : new Date();
  const endDate = shutdown?.end_date ? parseISO(shutdown.end_date) : startDate;
  const totalDays = differenceInDays(endDate, startDate) + 1;

  const timeline = useMemo(
    () => buildUnifiedTimeline(rundownSteps, packages, runupSteps),
    [rundownSteps, packages, runupSteps],
  );

  const days = useMemo(() => {
    if (!shutdown) return [];
    return Array.from({ length: totalDays }, (_, i) => {
      const d = addDays(startDate, i);
      return { date: d, label: format(d, "EEE d MMM"), dateStr: format(d, "yyyy-MM-dd"), dayNum: i + 1 };
    });
  }, [shutdown, startDate, totalDays]);

  // Separate items by phase
  const rdItems = timeline.filter(t => t.phase === "run-down");
  const workItems = timeline.filter(t => t.phase === "work");
  const ruItems = timeline.filter(t => t.phase === "run-up");

  // Group work items by area
  const areaGroups = useMemo(() => {
    const map = new Map<string, TimelineItem[]>();
    for (const item of workItems) {
      const area = item.area || "Unassigned";
      if (!map.has(area)) map.set(area, []);
      map.get(area)!.push(item);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [workItems]);

  const rdTotalHrs = rdItems.reduce((s, r) => s + r.durationHrs, 0);
  const ruTotalHrs = ruItems.reduce((s, r) => s + r.durationHrs, 0);

  if (!shutdown) return <div className="text-center py-12 text-sm text-muted-foreground">No shutdown selected</div>;

  const PHASE_COL_W = "w-[200px]";
  const LABEL_COL_W = "w-[220px]";

  const renderPhaseBar = (item: TimelineItem, phaseColor: string) => (
    <div
      key={item.id}
      className={cn(
        "rounded border px-2 py-1.5 mb-1",
        STATUS_BG[item.status], STATUS_BORDER[item.status],
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-mono font-bold text-foreground">{item.id}</span>
        <span className={cn("text-[8px] font-semibold", STATUS_TEXT[item.status])}>{item.status}</span>
      </div>
      <div className="text-[9px] font-medium text-foreground leading-tight truncate mt-0.5">{item.title}</div>
      <div className="flex items-center gap-2 text-[8px] text-muted-foreground mt-0.5">
        {item.startTime && <span>{item.startTime}–{item.finishTime}</span>}
        <span>{item.durationHrs}h</span>
        {item.workCentre && <span>· {item.workCentre}</span>}
        {item.supervisor && <span>· {item.supervisor}</span>}
      </div>
      {/* Progress bar */}
      <div className="w-full h-1 bg-muted/50 rounded-full mt-1 overflow-hidden">
        <div className={cn("h-full rounded-full", phaseColor)} style={{ width: `${item.pctComplete}%` }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-0 text-[11px]" style={{ minWidth: `${Math.max(1200, totalDays * 180 + 500)}px` }}>
      {/* ══════════ HEADER ══════════ */}
      <div className="border-2 border-foreground px-6 py-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">SHUTDOWN WALL CHART</h1>
            <p className="text-sm font-semibold text-foreground mt-0.5">
              {shutdown.name}
              <span className="text-muted-foreground font-normal ml-3">{shutdown.shutdown_rev}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">
              {format(startDate, "d MMM yyyy")} — {format(endDate, "d MMM yyyy")}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalDays} Days · {packages.length} Work Packages · {rdItems.length} Run-Down · {ruItems.length} Run-Up
            </p>
          </div>
        </div>

        {/* Summary + Flow Indicator */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          {/* Flow diagram */}
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg px-3 py-1.5 border border-border">
            <div className="flex items-center gap-1 text-amber-700">
              <Lock className="w-3 h-3" />
              <span className="text-[10px] font-bold">Run-Down ({rdTotalHrs}h)</span>
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-1 text-blue-600">
              <Wrench className="w-3 h-3" />
              <span className="text-[10px] font-bold">Work ({workItems.length} pkgs)</span>
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-1 text-emerald-700">
              <ArrowUp className="w-3 h-3" />
              <span className="text-[10px] font-bold">Run-Up ({ruTotalHrs}h)</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 ml-auto">
            {[
              { label: "Active", value: workItems.filter(p => p.status === "Active").length, color: "text-emerald-600" },
              { label: "Blocked", value: workItems.filter(p => p.status === "Blocked").length, color: "text-destructive" },
              { label: "Complete", value: workItems.filter(p => p.status === "Complete").length, color: "text-muted-foreground" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={cn("text-lg font-black", s.color)}>{s.value}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px] ml-4">
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-amber-500" /> Run-Down</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-blue-500" /> Work</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-emerald-500" /> Run-Up</span>
            <span className="ml-2 flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-destructive" /> Blocked</span>
          </div>
        </div>
      </div>

      {/* ══════════ TIMELINE GRID ══════════ */}
      <div className="border-x-2 border-foreground">
        {/* Column headers */}
        <div className="flex border-b-2 border-foreground">
          <div className={cn(LABEL_COL_W, "flex-shrink-0 border-r-2 border-foreground bg-muted/30 px-3 py-2 font-bold text-xs text-foreground")}>
            PHASE / PACKAGE
          </div>
          {days.map((day) => (
            <div key={day.dateStr} className="flex-1 min-w-[160px] px-2 py-2 text-center border-r border-border">
              <div className="font-bold text-xs text-foreground">Day {day.dayNum}</div>
              <div className="text-[9px] text-muted-foreground">{day.label}</div>
            </div>
          ))}
        </div>

        {/* ── RUN-DOWN PHASE ── */}
        {rdItems.length > 0 && (
          <div className="border-b-2 border-amber-500/50">
            <div className="flex bg-amber-500/5 border-b border-amber-500/20">
              <div className={cn(LABEL_COL_W, "flex-shrink-0 border-r-2 border-foreground px-3 py-2")}>
                <div className="font-bold text-xs text-amber-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> RUN-DOWN PHASE
                </div>
                <div className="text-[9px] text-amber-600 mt-0.5">{rdItems.length} steps · {rdTotalHrs}h total</div>
              </div>
              {days.map(day => (
                <div key={day.dateStr} className="flex-1 min-w-[160px] border-r border-border" />
              ))}
            </div>
            {rdItems.map((item, i) => (
              <div key={item.id} className={cn("flex", i % 2 === 0 && "bg-amber-500/[0.02]")}>
                <div className={cn(LABEL_COL_W, "flex-shrink-0 border-r-2 border-foreground px-3 py-1.5")}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-700">{item.id}</span>
                    {item.startTime && (
                      <span className="text-[9px] font-mono text-muted-foreground">{item.startTime}–{item.finishTime}</span>
                    )}
                  </div>
                  <div className="text-[10px] font-medium text-foreground leading-tight truncate">{item.title}</div>
                  <div className="flex items-center gap-2 text-[8px] text-muted-foreground mt-0.5">
                    {item.workCentre && <span>{item.workCentre}</span>}
                    <span>{item.durationHrs}h</span>
                    {item.supervisor && <span>· {item.supervisor}</span>}
                  </div>
                </div>
                {/* Bar on Day 1 for run-down */}
                {days.map((day, dayIdx) => (
                  <div key={day.dateStr} className="flex-1 min-w-[160px] border-r border-border px-1 py-1">
                    {dayIdx === 0 && renderPhaseBar(item, "bg-amber-500")}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── WORK PACKAGES BY AREA ── */}
        {areaGroups.map(([area, areaPkgs]) => {
          const areaComplete = areaPkgs.filter(p => p.status === "Complete").length;
          const areaPct = areaPkgs.length > 0 ? Math.round((areaComplete / areaPkgs.length) * 100) : 0;

          return (
            <div key={area} className="border-b border-border">
              {/* Area header */}
              <div className="flex bg-muted/30 border-b border-border/50">
                <div className={cn(LABEL_COL_W, "flex-shrink-0 border-r-2 border-foreground px-3 py-1.5")}>
                  <div className="font-bold text-xs text-foreground">{area}</div>
                  <div className="text-[9px] text-muted-foreground">{areaPkgs.length} pkgs · {areaPct}% done</div>
                </div>
                {days.map(day => (
                  <div key={day.dateStr} className="flex-1 min-w-[160px] border-r border-border" />
                ))}
              </div>

              {/* Package rows */}
              {areaPkgs.map((item, pkgIdx) => {
                const TradeIcon = TRADE_ICON[item.trade] || Wrench;
                return (
                  <div key={item.id} className={cn("flex", pkgIdx % 2 === 0 && "bg-muted/10")}>
                    <div className={cn(LABEL_COL_W, "flex-shrink-0 border-r-2 border-foreground px-3 py-1.5")}>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-[10px] text-foreground">{item.id}</span>
                        <TradeIcon className="w-2.5 h-2.5 text-muted-foreground" />
                        {item.criticalPath && (
                          <span className="text-[8px] font-bold text-destructive bg-destructive/10 px-1 rounded">CP</span>
                        )}
                      </div>
                      <div className="text-[10px] font-medium text-foreground leading-tight truncate">{item.title}</div>
                      <div className="flex items-center gap-2 text-[8px] text-muted-foreground mt-0.5">
                        <span>{item.trade}</span><span>·</span><span>{item.durationHrs}h</span>
                        {item.supervisor && <><span>·</span><span>{item.supervisor}</span></>}
                      </div>
                    </div>

                    {/* Day cells — bar on scheduled day */}
                    {days.map(day => {
                      const isScheduled = item.scheduledDate === day.dateStr;
                      return (
                        <div key={day.dateStr} className="flex-1 min-w-[160px] border-r border-border px-1 py-1">
                          {isScheduled && (
                            <div className={cn("rounded border px-1.5 py-1", STATUS_BG[item.status], STATUS_BORDER[item.status])}>
                              <div className="flex items-center justify-between">
                                <span className={cn("text-[9px] font-bold", STATUS_TEXT[item.status])}>{item.status}</span>
                                <span className="text-[9px] font-bold text-foreground">{item.pctComplete}%</span>
                              </div>
                              <div className="w-full h-1 bg-muted/50 rounded-full mt-0.5 overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    item.status === "Complete" ? "bg-muted-foreground/50" :
                                    item.status === "Active" ? "bg-emerald-500" :
                                    item.status === "Blocked" ? "bg-destructive" :
                                    item.status === "Delayed" ? "bg-amber-500" : "bg-blue-500"
                                  )}
                                  style={{ width: `${item.pctComplete}%` }}
                                />
                              </div>
                              {item.blockerDescription && (
                                <div className="flex items-start gap-0.5 mt-0.5">
                                  <AlertTriangle className="w-2 h-2 text-destructive flex-shrink-0 mt-0.5" />
                                  <span className="text-[8px] text-destructive leading-tight truncate">{item.blockerDescription.substring(0, 40)}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* ── RUN-UP PHASE ── */}
        {ruItems.length > 0 && (
          <div className="border-t-2 border-emerald-500/50">
            <div className="flex bg-emerald-500/5 border-b border-emerald-500/20">
              <div className={cn(LABEL_COL_W, "flex-shrink-0 border-r-2 border-foreground px-3 py-2")}>
                <div className="font-bold text-xs text-emerald-700 flex items-center gap-1.5">
                  <ArrowUp className="w-3.5 h-3.5" /> RUN-UP PHASE
                </div>
                <div className="text-[9px] text-emerald-600 mt-0.5">{ruItems.length} steps · {ruTotalHrs}h total</div>
              </div>
              {days.map(day => (
                <div key={day.dateStr} className="flex-1 min-w-[160px] border-r border-border" />
              ))}
            </div>
            {ruItems.map((item, i) => (
              <div key={item.id} className={cn("flex", i % 2 === 0 && "bg-emerald-500/[0.02]")}>
                <div className={cn(LABEL_COL_W, "flex-shrink-0 border-r-2 border-foreground px-3 py-1.5")}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-700">{item.id}</span>
                    {item.startTime && (
                      <span className="text-[9px] font-mono text-muted-foreground">{item.startTime}–{item.finishTime}</span>
                    )}
                  </div>
                  <div className="text-[10px] font-medium text-foreground leading-tight truncate">{item.title}</div>
                  <div className="flex items-center gap-2 text-[8px] text-muted-foreground mt-0.5">
                    {item.workCentre && <span>{item.workCentre}</span>}
                    <span>{item.durationHrs}h</span>
                    {item.supervisor && <span>· {item.supervisor}</span>}
                  </div>
                </div>
                {/* Bar on last day for run-up */}
                {days.map((day, dayIdx) => (
                  <div key={day.dateStr} className="flex-1 min-w-[160px] border-r border-border px-1 py-1">
                    {dayIdx === days.length - 1 && renderPhaseBar(item, "bg-emerald-500")}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════ DEPENDENCY CHAIN SUMMARY ══════════ */}
      <div className="border-x-2 border-b-2 border-foreground px-6 py-3 bg-muted/20">
        <div className="text-[10px] font-semibold text-foreground mb-1">Auto-Chained Dependencies</div>
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground flex-wrap">
          {rdItems.length > 0 && (
            <>
              <span className="bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded border border-amber-500/30 font-medium">
                {rdItems[rdItems.length - 1].id} (Last Run-Down)
              </span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-foreground font-medium">All {workItems.length} Work Packages</span>
            </>
          )}
          {ruItems.length > 0 && (
            <>
              <ArrowRight className="w-3 h-3" />
              <span className="bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded border border-emerald-500/30 font-medium">
                {ruItems[0].id} (First Run-Up)
              </span>
            </>
          )}
          {rdItems.length === 0 && ruItems.length === 0 && (
            <span>Add run-down/run-up steps to auto-chain the shutdown sequence</span>
          )}
        </div>
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <div className="border-2 border-t-0 border-foreground px-6 py-3 bg-card flex items-center justify-between">
        <div className="text-[9px] text-muted-foreground">
          Generated: {new Date().toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
          <span className="mx-2">·</span>Print at A1/A0 for wall display
        </div>
        <div className="text-[9px] text-muted-foreground font-semibold">
          TENNANT CREEK MINE — SHUTDOWN MANAGEMENT
        </div>
      </div>
    </div>
  );
}
