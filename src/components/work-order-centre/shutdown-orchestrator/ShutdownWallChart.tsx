/**
 * Printable A1/A0 Wall Chart Gantt — designed for large format plotter printing.
 * Shows shutdown timeline with Run-Down → Work Packages → Run-Up, grouped by area.
 */
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useShutdowns } from "@/hooks/useShutdowns";
import { useRundownSteps } from "@/hooks/useRundownSteps";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { format, parseISO, addDays, differenceInDays, differenceInHours } from "date-fns";
import type { ShutdownWorkPackage } from "./shutdownData";
import { CheckCircle2, AlertTriangle, Lock, Clock, Wrench, Zap } from "lucide-react";

/* ── Styling ── */
const STATUS_BG: Record<string, string> = {
  "Not Started": "bg-muted/60",
  Ready: "bg-blue-500/15",
  Active: "bg-emerald-500/15",
  Blocked: "bg-destructive/15",
  Delayed: "bg-amber-500/15",
  Complete: "bg-muted/40",
};

const STATUS_BORDER: Record<string, string> = {
  "Not Started": "border-border",
  Ready: "border-blue-500/40",
  Active: "border-emerald-500/40",
  Blocked: "border-destructive/40",
  Delayed: "border-amber-500/40",
  Complete: "border-muted-foreground/30",
};

const STATUS_TEXT: Record<string, string> = {
  "Not Started": "text-muted-foreground",
  Ready: "text-blue-600",
  Active: "text-emerald-600",
  Blocked: "text-destructive",
  Delayed: "text-amber-600",
  Complete: "text-muted-foreground",
};

const TRADE_ICON: Record<string, typeof Wrench> = {
  Mechanical: Wrench,
  Electrical: Zap,
};

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

  // Build day headers
  const days = useMemo(() => {
    if (!shutdown) return [];
    const result: { date: Date; label: string; dateStr: string; dayNum: number }[] = [];
    for (let i = 0; i < totalDays; i++) {
      const d = addDays(startDate, i);
      result.push({
        date: d,
        label: format(d, "EEE d MMM"),
        dateStr: format(d, "yyyy-MM-dd"),
        dayNum: i + 1,
      });
    }
    return result;
  }, [shutdown, startDate, totalDays]);

  // Group packages by area
  const areaGroups = useMemo(() => {
    const map = new Map<string, ShutdownWorkPackage[]>();
    for (const pkg of packages) {
      const area = pkg.area || "Unassigned";
      if (!map.has(area)) map.set(area, []);
      map.get(area)!.push(pkg);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [packages]);

  // Calculate run-down/run-up total hours
  const rundownHrs = rundownSteps.reduce((s, r) => s + r.duration_hours, 0);
  const runupHrs = runupSteps.reduce((s, r) => s + r.duration_hours, 0);

  return (
    <div className="space-y-0 text-[11px]" style={{ minWidth: `${Math.max(1200, totalDays * 200 + 400)}px` }}>
      {/* ══════════ HEADER ══════════ */}
      <div className="border-2 border-foreground px-6 py-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              SHUTDOWN WALL CHART
            </h1>
            <p className="text-sm font-semibold text-foreground mt-0.5">
              {shutdown.name}
              <span className="text-muted-foreground font-normal ml-3">
                {shutdown.shutdown_rev}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">
              {format(startDate, "d MMM yyyy")} — {format(endDate, "d MMM yyyy")}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalDays} Days · {packages.length} Work Packages · {areaGroups.length} Areas
            </p>
          </div>
        </div>

        {/* Summary stats row */}
        <div className="flex items-center gap-6 mt-3 pt-3 border-t border-border">
          {[
            { label: "Total", value: packages.length, color: "text-foreground" },
            { label: "Active", value: packages.filter(p => p.status === "Active").length, color: "text-emerald-600" },
            { label: "Ready", value: packages.filter(p => p.status === "Ready" || p.status === "Not Started").length, color: "text-blue-600" },
            { label: "Blocked", value: packages.filter(p => p.status === "Blocked").length, color: "text-destructive" },
            { label: "Delayed", value: packages.filter(p => p.status === "Delayed").length, color: "text-amber-600" },
            { label: "Complete", value: packages.filter(p => p.status === "Complete").length, color: "text-muted-foreground" },
            { label: "Run-Down", value: `${rundownHrs}h`, color: "text-foreground" },
            { label: "Run-Up", value: `${runupHrs}h`, color: "text-foreground" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={cn("text-lg font-black", s.color)}>{s.value}</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </div>
          ))}

          {/* Legend */}
          <div className="ml-auto flex items-center gap-4 text-[10px]">
            {[
              { label: "Active", color: "bg-emerald-500" },
              { label: "Ready", color: "bg-blue-500" },
              { label: "Blocked", color: "bg-destructive" },
              { label: "Delayed", color: "bg-amber-500" },
              { label: "Complete", color: "bg-muted-foreground/50" },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1">
                <span className={cn("w-3 h-2 rounded-sm", l.color)} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ TIMELINE GRID ══════════ */}
      <div className="border-x-2 border-foreground">
        {/* Day headers */}
        <div className="flex border-b-2 border-foreground">
          {/* Area label column */}
          <div className="w-[200px] flex-shrink-0 border-r-2 border-foreground bg-muted/30 px-3 py-2 font-bold text-xs text-foreground">
            AREA / PACKAGE
          </div>

          {/* Run-Down column */}
          {rundownSteps.length > 0 && (
            <div className="w-[160px] flex-shrink-0 border-r border-foreground bg-amber-500/10 px-2 py-2 text-center">
              <div className="font-bold text-xs text-amber-700">RUN-DOWN</div>
              <div className="text-[9px] text-amber-600">{rundownHrs}h total</div>
            </div>
          )}

          {/* Day columns */}
          {days.map((day, i) => (
            <div
              key={day.dateStr}
              className={cn(
                "flex-1 min-w-[160px] px-2 py-2 text-center border-r border-border",
                i === 0 && "border-l border-border",
              )}
            >
              <div className="font-bold text-xs text-foreground">Day {day.dayNum}</div>
              <div className="text-[9px] text-muted-foreground">{day.label}</div>
            </div>
          ))}

          {/* Run-Up column */}
          {runupSteps.length > 0 && (
            <div className="w-[160px] flex-shrink-0 border-l border-foreground bg-emerald-500/10 px-2 py-2 text-center">
              <div className="font-bold text-xs text-emerald-700">RUN-UP</div>
              <div className="text-[9px] text-emerald-600">{runupHrs}h total</div>
            </div>
          )}
        </div>

        {/* ── Run-Down checklist row ── */}
        {rundownSteps.length > 0 && (
          <div className="flex border-b border-foreground/50">
            <div className="w-[200px] flex-shrink-0 border-r-2 border-foreground bg-amber-500/5 px-3 py-2">
              <div className="font-bold text-xs text-amber-700 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Run-Down Checklist
              </div>
            </div>
            <div className="w-[160px] flex-shrink-0 border-r border-foreground bg-amber-500/5 px-2 py-1">
              {rundownSteps.map((step, i) => (
                <div key={step.id} className="flex items-start gap-1.5 py-0.5 border-b border-amber-500/20 last:border-b-0">
                  <span className={cn(
                    "w-3 h-3 rounded-sm border flex-shrink-0 mt-0.5 flex items-center justify-center",
                    step.status === "Complete" ? "bg-emerald-500 border-emerald-500" : "border-amber-500/40"
                  )}>
                    {step.status === "Complete" && <CheckCircle2 className="w-2 h-2 text-white" />}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[9px] font-medium leading-tight truncate">{step.step_description}</div>
                    {step.responsible && <div className="text-[8px] text-muted-foreground">{step.responsible} · {step.duration_hours}h</div>}
                  </div>
                </div>
              ))}
            </div>
            {/* Empty day cells */}
            {days.map(day => (
              <div key={day.dateStr} className="flex-1 min-w-[160px] border-r border-border" />
            ))}
            {runupSteps.length > 0 && <div className="w-[160px] flex-shrink-0" />}
          </div>
        )}

        {/* ── Area rows ── */}
        {areaGroups.map(([area, areaPkgs]) => {
          const areaComplete = areaPkgs.filter(p => p.status === "Complete").length;
          const areaPct = areaPkgs.length > 0 ? Math.round((areaComplete / areaPkgs.length) * 100) : 0;

          return (
            <div key={area} className="border-b border-border">
              {/* Area header row */}
              <div className="flex bg-muted/30 border-b border-border/50">
                <div className="w-[200px] flex-shrink-0 border-r-2 border-foreground px-3 py-1.5">
                  <div className="font-bold text-xs text-foreground">{area}</div>
                  <div className="text-[9px] text-muted-foreground">
                    {areaPkgs.length} pkgs · {areaPct}% done
                  </div>
                </div>
                {rundownSteps.length > 0 && <div className="w-[160px] flex-shrink-0 border-r border-foreground" />}
                {days.map(day => (
                  <div key={day.dateStr} className="flex-1 min-w-[160px] border-r border-border" />
                ))}
                {runupSteps.length > 0 && <div className="w-[160px] flex-shrink-0" />}
              </div>

              {/* Package rows */}
              {areaPkgs.map((pkg, pkgIdx) => {
                const scheduledDate = (pkg as any).scheduledDate;
                const TradeIcon = TRADE_ICON[pkg.trade] || Wrench;

                return (
                  <div key={pkg.id} className={cn("flex", pkgIdx % 2 === 0 && "bg-muted/10")}>
                    {/* Package label */}
                    <div className="w-[200px] flex-shrink-0 border-r-2 border-foreground px-3 py-1.5">
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-[10px] text-foreground">{pkg.id}</span>
                        <TradeIcon className="w-2.5 h-2.5 text-muted-foreground" />
                        {pkg.criticalPath && (
                          <span className="text-[8px] font-bold text-destructive bg-destructive/10 px-1 rounded">CP</span>
                        )}
                      </div>
                      <div className="text-[10px] font-medium text-foreground leading-tight truncate">{pkg.title}</div>
                      <div className="flex items-center gap-2 text-[8px] text-muted-foreground mt-0.5">
                        <span>{pkg.trade}</span>
                        <span>·</span>
                        <span>{pkg.durationHrs}h</span>
                        {pkg.supervisor && <><span>·</span><span>{pkg.supervisor}</span></>}
                      </div>
                    </div>

                    {/* Run-down column (empty for packages) */}
                    {rundownSteps.length > 0 && (
                      <div className="w-[160px] flex-shrink-0 border-r border-foreground" />
                    )}

                    {/* Day cells — show bar on scheduled day */}
                    {days.map(day => {
                      const isScheduled = scheduledDate === day.dateStr;
                      return (
                        <div key={day.dateStr} className={cn("flex-1 min-w-[160px] border-r border-border px-1 py-1")}>
                          {isScheduled && (
                            <div className={cn(
                              "rounded border px-1.5 py-1",
                              STATUS_BG[pkg.status],
                              STATUS_BORDER[pkg.status],
                            )}>
                              <div className="flex items-center justify-between">
                                <span className={cn("text-[9px] font-bold", STATUS_TEXT[pkg.status])}>
                                  {pkg.status}
                                </span>
                                <span className="text-[9px] font-bold text-foreground">{pkg.pctComplete}%</span>
                              </div>
                              {/* Progress bar */}
                              <div className="w-full h-1 bg-muted/50 rounded-full mt-0.5 overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    pkg.status === "Complete" ? "bg-muted-foreground/50" :
                                    pkg.status === "Active" ? "bg-emerald-500" :
                                    pkg.status === "Blocked" ? "bg-destructive" :
                                    pkg.status === "Delayed" ? "bg-amber-500" : "bg-blue-500"
                                  )}
                                  style={{ width: `${pkg.pctComplete}%` }}
                                />
                              </div>
                              {pkg.blockerDescription && (
                                <div className="flex items-start gap-0.5 mt-0.5">
                                  <AlertTriangle className="w-2 h-2 text-destructive flex-shrink-0 mt-0.5" />
                                  <span className="text-[8px] text-destructive leading-tight truncate">{pkg.blockerDescription.substring(0, 40)}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Run-up column (empty for packages) */}
                    {runupSteps.length > 0 && (
                      <div className="w-[160px] flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* ── Run-Up checklist row ── */}
        {runupSteps.length > 0 && (
          <div className="flex border-t border-foreground/50">
            <div className="w-[200px] flex-shrink-0 border-r-2 border-foreground bg-emerald-500/5 px-3 py-2">
              <div className="font-bold text-xs text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Run-Up Checklist
              </div>
            </div>
            {rundownSteps.length > 0 && <div className="w-[160px] flex-shrink-0 border-r border-foreground" />}
            {days.map(day => (
              <div key={day.dateStr} className="flex-1 min-w-[160px] border-r border-border" />
            ))}
            <div className="w-[160px] flex-shrink-0 bg-emerald-500/5 px-2 py-1">
              {runupSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-1.5 py-0.5 border-b border-emerald-500/20 last:border-b-0">
                  <span className={cn(
                    "w-3 h-3 rounded-sm border flex-shrink-0 mt-0.5 flex items-center justify-center",
                    step.status === "Complete" ? "bg-emerald-500 border-emerald-500" : "border-emerald-500/40"
                  )}>
                    {step.status === "Complete" && <CheckCircle2 className="w-2 h-2 text-white" />}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[9px] font-medium leading-tight truncate">{step.step_description}</div>
                    {step.responsible && <div className="text-[8px] text-muted-foreground">{step.responsible} · {step.duration_hours}h</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <div className="border-2 border-t-0 border-foreground px-6 py-3 bg-card flex items-center justify-between">
        <div className="text-[9px] text-muted-foreground">
          Generated: {new Date().toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
          <span className="mx-2">·</span>
          Print at A1/A0 for wall display
        </div>
        <div className="text-[9px] text-muted-foreground font-semibold">
          TENNANT CREEK MINE — SHUTDOWN MANAGEMENT
        </div>
      </div>

      {/* ── Empty state ── */}
      {packages.length === 0 && (
        <div className="text-center py-12 text-sm text-muted-foreground">
          No work packages assigned to this shutdown yet.
          <br />
          Assign work orders from the Shutdown Schedule view.
        </div>
      )}
    </div>
  );
}
