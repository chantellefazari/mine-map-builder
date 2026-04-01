import { useMemo } from "react";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useShutdowns, useShutdownWorkOrders, useShutdownVendors } from "@/hooks/useShutdowns";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { format, parseISO, differenceInDays, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Download, Printer, Brain, Package, PlayCircle, Activity, ShieldAlert,
  Clock, CheckCircle2, Route, AlertTriangle, MapPin, Wrench, Lock,
  Truck, ArrowRightLeft, Calendar, Target, ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface AreaSummary {
  area: string;
  total: number;
  active: number;
  blocked: number;
  delayed: number;
  complete: number;
  pctComplete: number;
  status: "Ready" | "Active" | "At Risk" | "Delayed" | "Complete";
}

interface RiskItem {
  risk: string;
  area: string;
  workPackage: string;
  severity: "Critical" | "High" | "Medium";
  owner: string;
}

interface ShiftFocusItem {
  label: string;
  type: "start" | "finish" | "decision" | "handover";
  area: string;
}

/* ------------------------------------------------------------------ */
/*  DEMO DATA — will be replaced by real queries later                 */
/* ------------------------------------------------------------------ */

const DEMO_AREAS: AreaSummary[] = [
  { area: "Crushing", total: 14, active: 4, blocked: 1, delayed: 0, complete: 6, pctComplete: 43, status: "Active" },
  { area: "Grinding", total: 22, active: 6, blocked: 2, delayed: 1, complete: 8, pctComplete: 36, status: "At Risk" },
  { area: "CIL / Leaching", total: 18, active: 3, blocked: 0, delayed: 0, complete: 12, pctComplete: 67, status: "Active" },
  { area: "Thickening", total: 10, active: 2, blocked: 0, delayed: 0, complete: 7, pctComplete: 70, status: "Active" },
  { area: "Gold Room", total: 8, active: 1, blocked: 0, delayed: 0, complete: 5, pctComplete: 63, status: "Active" },
  { area: "Reagents", total: 6, active: 1, blocked: 0, delayed: 0, complete: 5, pctComplete: 83, status: "Active" },
  { area: "Tailings", total: 12, active: 2, blocked: 1, delayed: 1, complete: 4, pctComplete: 33, status: "Delayed" },
  { area: "Water Services", total: 5, active: 0, blocked: 0, delayed: 0, complete: 5, pctComplete: 100, status: "Complete" },
];

const DEMO_RISKS: RiskItem[] = [
  { risk: "Crane unavailable — 50t mobile crane delayed by 4 hrs", area: "Grinding", workPackage: "WP-GRN-008", severity: "Critical", owner: "J. Mitchell" },
  { risk: "Scaffold not erected — Level 3 access pending", area: "Tailings", workPackage: "WP-TAL-003", severity: "High", owner: "R. Torres" },
  { risk: "Isolation tag clearance delayed by Control Room", area: "Grinding", workPackage: "WP-GRN-012", severity: "High", owner: "D. Kumar" },
  { risk: "Replacement gasket set not yet received on site", area: "CIL / Leaching", workPackage: "WP-CIL-006", severity: "Medium", owner: "S. Patel" },
  { risk: "Confined space permit pending gas test re-check", area: "Tailings", workPackage: "WP-TAL-009", severity: "High", owner: "M. Chen" },
];

const DEMO_SHIFT_FOCUS: ShiftFocusItem[] = [
  { label: "SAG Mill liner bolt-out — Day Shift start", type: "start", area: "Grinding" },
  { label: "Thickener rake arm inspection — target completion", type: "finish", area: "Thickening" },
  { label: "Approve crane lift plan for ball mill trunnion", type: "decision", area: "Grinding" },
  { label: "Elution column handover from Electrical to Mech", type: "handover", area: "Gold Room" },
  { label: "CIL Tank 4 agitator gearbox swap — planned start", type: "start", area: "CIL / Leaching" },
  { label: "Tailings pipeline tie-in clearance from Enviro", type: "decision", area: "Tailings" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const AREA_STATUS_STYLE: Record<string, string> = {
  Ready: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  "At Risk": "bg-amber-500/10 text-amber-600 border-amber-500/30",
  Delayed: "bg-destructive/10 text-destructive border-destructive/30",
  Complete: "bg-muted text-muted-foreground border-border",
};

const SEVERITY_STYLE: Record<string, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  Medium: "bg-blue-500/15 text-blue-600 border-blue-500/30",
};

const SHIFT_ICON: Record<string, typeof PlayCircle> = {
  start: PlayCircle,
  finish: CheckCircle2,
  decision: ShieldAlert,
  handover: ArrowRightLeft,
};

const SHIFT_STYLE: Record<string, string> = {
  start: "text-emerald-600",
  finish: "text-blue-600",
  decision: "text-amber-600",
  handover: "text-purple-600",
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ShutdownOverviewTab() {
  const { shutdowns } = useShutdowns();

  // Use first shutdown as current — later this will come from orchestrator context
  const shutdown = shutdowns[0] ?? null;

  // Compute summary numbers from demo data
  const summary = useMemo(() => {
    const total = DEMO_AREAS.reduce((s, a) => s + a.total, 0);
    const active = DEMO_AREAS.reduce((s, a) => s + a.active, 0);
    const blocked = DEMO_AREAS.reduce((s, a) => s + a.blocked, 0);
    const delayed = DEMO_AREAS.reduce((s, a) => s + a.delayed, 0);
    const complete = DEMO_AREAS.reduce((s, a) => s + a.complete, 0);
    const ready = total - active - blocked - delayed - complete;
    const criticalPath = 6; // placeholder
    const highRiskAreas = DEMO_AREAS.filter((a) => a.status === "At Risk" || a.status === "Delayed").length;
    const overallPct = total > 0 ? Math.round((complete / total) * 100) : 0;
    return { total, ready, active, blocked, delayed, complete, criticalPath, highRiskAreas, overallPct };
  }, []);

  const plannedDays = shutdown?.end_date
    ? differenceInDays(parseISO(shutdown.end_date), parseISO(shutdown.start_date)) + 1
    : 0;

  const currentDay = shutdown
    ? Math.max(1, differenceInDays(new Date(), parseISO(shutdown.start_date)) + 1)
    : 0;

  const CARDS = [
    { label: "Total Packages", value: summary.total, icon: Package, color: "text-foreground" },
    { label: "Ready to Start", value: summary.ready, icon: Target, color: "text-blue-600" },
    { label: "Active", value: summary.active, icon: Activity, color: "text-emerald-600" },
    { label: "Blocked", value: summary.blocked, icon: Lock, color: "text-destructive" },
    { label: "Delayed", value: summary.delayed, icon: Clock, color: "text-amber-600" },
    { label: "Complete", value: summary.complete, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Critical Path", value: summary.criticalPath, icon: Route, color: "text-destructive" },
    { label: "High Risk Areas", value: summary.highRiskAreas, icon: AlertTriangle, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-5">
      {/* ============ HEADER ============ */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">
              {shutdown?.name ?? "No Shutdown Selected"}
            </h2>
            {shutdown && (
              <Badge variant="outline" className="text-[10px] font-mono">
                {shutdown.shutdown_rev || shutdown.id.substring(0, 8).toUpperCase()}
              </Badge>
            )}
            {shutdown && (
              <Badge
                className={cn(
                  "text-[10px]",
                  shutdown.status === "In Progress"
                    ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                    : shutdown.status === "Completed"
                    ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                    : "bg-blue-500/15 text-blue-600 border-blue-500/30"
                )}
                variant="outline"
              >
                {shutdown.status}
              </Badge>
            )}
          </div>
          {shutdown && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(parseISO(shutdown.start_date), "dd MMM yyyy")}
                {shutdown.end_date && ` — ${format(parseISO(shutdown.end_date), "dd MMM yyyy")}`}
              </span>
              <span>
                Day <span className="font-semibold text-foreground">{currentDay}</span> of {plannedDays}
              </span>
              <span>
                Day Shift
              </span>
              <span>
                Overall: <span className="font-semibold text-foreground">{summary.overallPct}%</span> complete
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" /> Export Summary
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Printer className="w-3.5 h-3.5" /> Print Overview
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Brain className="w-3.5 h-3.5" /> AI Planner
          </Button>
        </div>
      </div>

      {/* ============ PROGRESS BAR ============ */}
      {shutdown && (
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-foreground">Overall Shutdown Progress</span>
            <span className="font-bold text-foreground">{summary.overallPct}%</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${summary.overallPct}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> Complete ({summary.complete})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Active ({summary.active})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Delayed ({summary.delayed})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive inline-block" /> Blocked ({summary.blocked})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/30 inline-block" /> Ready ({summary.ready})</span>
          </div>
        </div>
      )}

      {/* ============ SUMMARY CARDS ============ */}
      <div className="grid grid-cols-4 xl:grid-cols-8 gap-3">
        {CARDS.map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between px-3 py-3 rounded-lg border border-border bg-card"
          >
            <div>
              <div className="text-[10px] text-muted-foreground leading-tight">{card.label}</div>
              <div className={cn("text-xl font-bold", card.color)}>{card.value}</div>
            </div>
            <card.icon className="w-4 h-4 text-muted-foreground/40" />
          </div>
        ))}
      </div>

      {/* ============ AREA STATUS + RISKS SIDE-BY-SIDE ============ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area Status — 2 cols */}
        <div className="xl:col-span-2 border border-border rounded-lg bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Area Status Overview</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {DEMO_AREAS.map((area) => (
              <button
                key={area.area}
                className={cn(
                  "text-left rounded-lg border p-3 transition-colors hover:shadow-sm",
                  AREA_STATUS_STYLE[area.status]
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold truncate">{area.area}</span>
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-current">
                    {area.status}
                  </Badge>
                </div>
                {/* Mini progress bar */}
                <div className="w-full h-1.5 bg-background/50 rounded-full mb-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current opacity-60 transition-all"
                    style={{ width: `${area.pctComplete}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                  <span>Packages: <span className="font-semibold">{area.total}</span></span>
                  <span>{area.pctComplete}% done</span>
                  <span>Active: <span className="font-semibold">{area.active}</span></span>
                  <span>Blocked: <span className={cn("font-semibold", area.blocked > 0 && "text-destructive")}>{area.blocked}</span></span>
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] opacity-70">
                  <ChevronRight className="w-3 h-3" /> View area detail
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Top Risks — 1 col */}
        <div className="border border-border rounded-lg bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-foreground">Top Risks / Constraints</h3>
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {DEMO_RISKS.map((r, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-md border p-2.5 text-xs",
                  SEVERITY_STYLE[r.severity]
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-current font-semibold">
                    {r.severity}
                  </Badge>
                  <span className="text-[10px] opacity-80">{r.area}</span>
                </div>
                <p className="font-medium leading-snug mb-1">{r.risk}</p>
                <div className="flex items-center justify-between text-[10px] opacity-80">
                  <span className="font-mono">{r.workPackage}</span>
                  <span>{r.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ TODAY / THIS SHIFT FOCUS ============ */}
      <div className="border border-border rounded-lg bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Today / This Shift Focus</h3>
          <Badge variant="secondary" className="text-[9px] h-4 ml-1">Day Shift</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {DEMO_SHIFT_FOCUS.map((item, i) => {
            const Icon = SHIFT_ICON[item.type];
            return (
              <div
                key={i}
                className="flex items-start gap-2.5 px-3 py-2.5 rounded-md border border-border bg-background"
              >
                <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", SHIFT_STYLE[item.type])} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground leading-snug">{item.label}</p>
                  <span className="text-[10px] text-muted-foreground">{item.area}</span>
                </div>
                <Badge variant="outline" className="text-[9px] h-4 capitalize flex-shrink-0">
                  {item.type}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
