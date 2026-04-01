import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Filter, Route, AlertTriangle, Wrench, Zap, Clock, Lock,
  CheckCircle2, Activity, Package, ChevronRight, Target, Eye,
  LayoutList, Columns3, Calendar, Shield, User, ArrowRight,
  Printer, PlayCircle, X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type WPStatus = "Ready" | "Active" | "Blocked" | "Delayed" | "Complete";
type ViewMode = "table" | "kanban";
type GroupBy = "status" | "area" | "supervisor" | "shift";

interface ControlPackage {
  id: string;
  title: string;
  area: string;
  trade: string;
  plannedStart: string;
  plannedFinish: string;
  status: WPStatus;
  pctComplete: number;
  criticalPath: boolean;
  supervisor: string;
  shift: string;
  nextAction: string;
  blockerType: string;
  blockerDescription: string;
  blockerOwner: string;
  blockerETA: string;
  delayReason: string;
  priority: boolean;
}

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                          */
/* ------------------------------------------------------------------ */

const PACKAGES: ControlPackage[] = [
  { id: "WP-004", title: "SAG Mill Liner Bolt-Out", area: "Grinding", trade: "Mechanical", plannedStart: "Day 1 12:00", plannedFinish: "Day 2 00:00", status: "Active", pctComplete: 45, criticalPath: true, supervisor: "J. Mitchell", shift: "Day", nextAction: "Continue bolt removal — 55% remaining", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: true },
  { id: "WP-005", title: "Jaw Crusher Liner Replacement", area: "Crushing", trade: "Mechanical", plannedStart: "Day 1 10:00", plannedFinish: "Day 1 18:00", status: "Active", pctComplete: 60, criticalPath: false, supervisor: "M. Thompson", shift: "Day", nextAction: "Swing jaw install underway", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: false },
  { id: "WP-006", title: "CIL Agitator Gearbox Inspection", area: "CIL / Leaching", trade: "Mechanical", plannedStart: "Day 1 10:00", plannedFinish: "Day 1 16:00", status: "Active", pctComplete: 70, criticalPath: false, supervisor: "K. Singh", shift: "Day", nextAction: "Tanks 5-6 inspection remaining", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: false },
  { id: "WP-009", title: "Ball Mill Trunnion Bearing Reline", area: "Grinding", trade: "Mechanical", plannedStart: "Day 1 12:00", plannedFinish: "Day 1 22:00", status: "Active", pctComplete: 15, criticalPath: true, supervisor: "J. Mitchell", shift: "Day", nextAction: "Feed-end bearing removal in progress", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: true },
  { id: "WP-010", title: "Thickener Rake Arm Inspection", area: "Thickening", trade: "Mechanical", plannedStart: "Day 1 10:00", plannedFinish: "Day 1 18:00", status: "Active", pctComplete: 40, criticalPath: true, supervisor: "A. Reyes", shift: "Day", nextAction: "Torque tube measurement underway", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: true },
  { id: "WP-013", title: "Carbon Screen Panel Replacement", area: "CIL / Leaching", trade: "Mechanical", plannedStart: "Day 2 06:00", plannedFinish: "Day 2 11:00", status: "Active", pctComplete: 70, criticalPath: false, supervisor: "K. Singh", shift: "Day", nextAction: "Final panels being fitted", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: false },
  { id: "WP-017", title: "Elution Column Heater Service", area: "Gold Room", trade: "Electrical", plannedStart: "Day 2 06:00", plannedFinish: "Day 2 12:00", status: "Active", pctComplete: 80, criticalPath: false, supervisor: "P. Adams", shift: "Day", nextAction: "Thermocouple replacement in progress", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: false },

  { id: "WP-007", title: "Crusher MCC Switchboard Service", area: "Crushing", trade: "Electrical", plannedStart: "Day 1 10:00", plannedFinish: "Day 1 16:00", status: "Blocked", pctComplete: 20, criticalPath: false, supervisor: "L. Chen", shift: "Day", nextAction: "Awaiting isolation clearance", blockerType: "Isolation", blockerDescription: "Crusher MCC isolation not verified — awaiting Control Room sign-off", blockerOwner: "Control Room — D. Kumar", blockerETA: "Est. 2 hrs", delayReason: "", priority: true },
  { id: "WP-012", title: "Cyclone Cluster Replacement", area: "Grinding", trade: "Mechanical", plannedStart: "Day 2 14:00", plannedFinish: "Day 2 20:00", status: "Blocked", pctComplete: 0, criticalPath: true, supervisor: "J. Mitchell", shift: "Night", nextAction: "Cannot proceed until crane available", blockerType: "Crane", blockerDescription: "50t mobile crane delayed — ETA from contractor pending", blockerOwner: "B. Williams — Crane Contractor", blockerETA: "Est. 4 hrs", delayReason: "", priority: true },
  { id: "WP-014", title: "Underflow Pump Impeller Swap", area: "Tailings", trade: "Mechanical", plannedStart: "Day 2 06:00", plannedFinish: "Day 2 12:00", status: "Blocked", pctComplete: 0, criticalPath: true, supervisor: "R. Torres", shift: "Day", nextAction: "Scaffold erection required first", blockerType: "Scaffold", blockerDescription: "Scaffold not erected — crew diverted to Grinding priority", blockerOwner: "Scaffold Crew — T. Brown", blockerETA: "Est. 6 hrs", delayReason: "", priority: true },

  { id: "WP-011", title: "VSD Replacement — Mill Drive", area: "Grinding", trade: "Electrical", plannedStart: "Day 1 14:00", plannedFinish: "Day 1 22:00", status: "Delayed", pctComplete: 10, criticalPath: true, supervisor: "L. Chen", shift: "Day", nextAction: "Expedite parts delivery", blockerType: "Parts", blockerDescription: "Replacement VSD unit not yet received on site — freight tracking shows delayed in transit", blockerOwner: "Procurement — S. Patel", blockerETA: "Est. arrival Day 2 PM", delayReason: "Replacement VSD not received on site", priority: true },
  { id: "WP-015", title: "Tailings Pipeline Tie-In", area: "Tailings", trade: "Mechanical", plannedStart: "Day 2 12:00", plannedFinish: "Day 2 20:00", status: "Delayed", pctComplete: 5, criticalPath: true, supervisor: "R. Torres", shift: "Night", nextAction: "Chase environmental clearance", blockerType: "Permit", blockerDescription: "Environmental clearance pending — Enviro team not yet signed off on discharge zone", blockerOwner: "Environmental — C. Davis", blockerETA: "Unknown", delayReason: "Environmental clearance pending", priority: true },

  { id: "WP-008", title: "SAG Mill Liner Install", area: "Grinding", trade: "Mechanical", plannedStart: "Day 2 00:00", plannedFinish: "Day 2 14:00", status: "Ready", pctComplete: 0, criticalPath: true, supervisor: "J. Mitchell", shift: "Night", nextAction: "Pending WP-004 completion", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: true },
  { id: "WP-016", title: "Mill Alignment & Checks", area: "Grinding", trade: "Mechanical", plannedStart: "Day 2 20:00", plannedFinish: "Day 3 00:00", status: "Ready", pctComplete: 0, criticalPath: true, supervisor: "J. Mitchell", shift: "Night", nextAction: "Awaiting Phase 2 & 3 completion", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: false },
  { id: "WP-018", title: "Pre-Start Commissioning", area: "Infrastructure", trade: "Electrical", plannedStart: "Day 3 00:00", plannedFinish: "Day 3 06:00", status: "Ready", pctComplete: 0, criticalPath: true, supervisor: "L. Chen", shift: "Night", nextAction: "Final gate — all CP packages must complete", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: false },

  { id: "WP-001", title: "Plant Isolation & Lockout", area: "Infrastructure", trade: "Electrical", plannedStart: "Day 1 06:00", plannedFinish: "Day 1 10:00", status: "Complete", pctComplete: 100, criticalPath: true, supervisor: "L. Chen", shift: "Day", nextAction: "—", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: false },
  { id: "WP-002", title: "Scaffold Erection — Grinding", area: "Grinding", trade: "Mechanical", plannedStart: "Day 1 06:00", plannedFinish: "Day 1 12:00", status: "Complete", pctComplete: 100, criticalPath: true, supervisor: "J. Mitchell", shift: "Day", nextAction: "—", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: false },
  { id: "WP-003", title: "Crane Mobilisation", area: "Infrastructure", trade: "Mechanical", plannedStart: "Day 1 06:00", plannedFinish: "Day 1 09:00", status: "Complete", pctComplete: 100, criticalPath: false, supervisor: "B. Williams", shift: "Day", nextAction: "—", blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "", delayReason: "", priority: false },
];

const STATUS_ORDER: WPStatus[] = ["Blocked", "Delayed", "Active", "Ready", "Complete"];

const STATUS_STYLE: Record<WPStatus, { bg: string; text: string; border: string; dot: string }> = {
  Ready: { bg: "bg-blue-500/5", text: "text-blue-600", border: "border-blue-500/30", dot: "bg-blue-500" },
  Active: { bg: "bg-emerald-500/5", text: "text-emerald-600", border: "border-emerald-500/30", dot: "bg-emerald-500" },
  Blocked: { bg: "bg-destructive/5", text: "text-destructive", border: "border-destructive/30", dot: "bg-destructive" },
  Delayed: { bg: "bg-amber-500/5", text: "text-amber-600", border: "border-amber-500/30", dot: "bg-amber-500" },
  Complete: { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground/50" },
};

const BLOCKER_ICON: Record<string, typeof Lock> = {
  Isolation: Shield,
  Crane: Wrench,
  Scaffold: Wrench,
  Parts: Package,
  Permit: Lock,
};

const ALL_AREAS = ["All", ...Array.from(new Set(PACKAGES.map((p) => p.area)))];
const ALL_TRADES = ["All", "Mechanical", "Electrical"];
const ALL_SHIFTS = ["All", "Day", "Night"];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ShutdownControlBoardTab() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [groupBy, setGroupBy] = useState<GroupBy>("status");
  const [filterArea, setFilterArea] = useState("All");
  const [filterTrade, setFilterTrade] = useState("All");
  const [filterShift, setFilterShift] = useState("All");
  const [filterCritical, setFilterCritical] = useState(false);
  const [filterDelayed, setFilterDelayed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = PACKAGES.find((p) => p.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    return PACKAGES.filter((p) => {
      if (filterArea !== "All" && p.area !== filterArea) return false;
      if (filterTrade !== "All" && p.trade !== filterTrade) return false;
      if (filterShift !== "All" && p.shift !== filterShift) return false;
      if (filterCritical && !p.criticalPath) return false;
      if (filterDelayed && p.status !== "Delayed" && p.status !== "Blocked") return false;
      return true;
    });
  }, [filterArea, filterTrade, filterShift, filterCritical, filterDelayed]);

  const priorityPackages = useMemo(() => filtered.filter((p) => p.priority), [filtered]);

  const grouped = useMemo(() => {
    const map = new Map<string, ControlPackage[]>();
    for (const p of filtered) {
      const key = groupBy === "status" ? p.status : groupBy === "area" ? p.area : groupBy === "supervisor" ? p.supervisor : p.shift;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    if (groupBy === "status") {
      const ordered = new Map<string, ControlPackage[]>();
      for (const s of STATUS_ORDER) {
        if (map.has(s)) ordered.set(s, map.get(s)!);
      }
      return ordered;
    }
    return map;
  }, [filtered, groupBy]);

  const counts = useMemo(() => {
    const c: Record<WPStatus, number> = { Ready: 0, Active: 0, Blocked: 0, Delayed: 0, Complete: 0 };
    for (const p of filtered) c[p.status]++;
    return c;
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* ===== STATUS SUMMARY BAR ===== */}
      <div className="flex items-center gap-2">
        {STATUS_ORDER.map((s) => (
          <div key={s} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", STATUS_STYLE[s].border, STATUS_STYLE[s].bg)}>
            <span className={cn("w-2.5 h-2.5 rounded-full", STATUS_STYLE[s].dot)} />
            <span className={cn("text-xs font-semibold", STATUS_STYLE[s].text)}>{s}</span>
            <span className={cn("text-lg font-bold", STATUS_STYLE[s].text)}>{counts[s]}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Package className="w-3.5 h-3.5" />
          Total: <span className="font-bold text-foreground">{filtered.length}</span>
        </div>
      </div>

      {/* ===== FILTERS & CONTROLS ===== */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{ALL_AREAS.map((a) => <SelectItem key={a} value={a}>{a === "All" ? "All Areas" : a}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filterTrade} onValueChange={setFilterTrade}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{ALL_TRADES.map((t) => <SelectItem key={t} value={t}>{t === "All" ? "All Trades" : t}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filterShift} onValueChange={setFilterShift}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{ALL_SHIFTS.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "All Shifts" : `${s} Shift`}</SelectItem>)}</SelectContent>
        </Select>
        <Button variant={filterCritical ? "default" : "outline"} size="sm" className="h-8 text-xs gap-1" onClick={() => setFilterCritical(!filterCritical)}>
          <Route className="w-3 h-3" /> Critical Path
        </Button>
        <Button variant={filterDelayed ? "default" : "outline"} size="sm" className="h-8 text-xs gap-1" onClick={() => setFilterDelayed(!filterDelayed)}>
          <AlertTriangle className="w-3 h-3" /> Blocked / Delayed
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Select value={groupBy} onValueChange={(v: GroupBy) => setGroupBy(v)}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Group: Status</SelectItem>
              <SelectItem value="area">Group: Area</SelectItem>
              <SelectItem value="supervisor">Group: Supervisor</SelectItem>
              <SelectItem value="shift">Group: Shift</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("table")} className={cn("flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium transition-colors", viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground")}>
              <LayoutList className="w-3 h-3" /> Table
            </button>
            <button onClick={() => setViewMode("kanban")} className={cn("flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium transition-colors", viewMode === "kanban" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground")}>
              <Columns3 className="w-3 h-3" /> Kanban
            </button>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
            <Printer className="w-3 h-3" /> Print
          </Button>
        </div>
      </div>

      {/* ===== TODAY'S PRIORITY PACKAGES ===== */}
      {priorityPackages.length > 0 && (
        <div className="border border-amber-500/30 rounded-lg bg-amber-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-amber-600">Today's Priority Packages — Immediate Coordination Focus</h3>
            <Badge variant="outline" className="text-[9px] h-4 border-amber-500/30 text-amber-600">{priorityPackages.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {priorityPackages.map((p) => {
              const st = STATUS_STYLE[p.status];
              return (
                <button key={p.id} onClick={() => setSelectedId(p.id)} className={cn("text-left rounded-md border p-2.5 transition-colors hover:shadow-sm", st.border, st.bg)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold">{p.id}</span>
                    <div className="flex items-center gap-1">
                      {p.criticalPath && <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-destructive text-destructive">CP</Badge>}
                      <Badge variant="outline" className={cn("text-[8px] h-3.5 px-1", st.text, st.border)}>{p.status}</Badge>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-foreground truncate">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{p.area} • {p.trade} • {p.supervisor}</p>
                  {p.blockerDescription && (
                    <p className="text-[10px] mt-1 text-destructive flex items-center gap-1 truncate">
                      <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" /> {p.blockerDescription.substring(0, 50)}…
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT: BOARD + DETAIL ===== */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          {viewMode === "table" ? (
            /* ---- TABLE VIEW ---- */
            <div className="space-y-4">
              {Array.from(grouped.entries()).map(([group, items]) => (
                <div key={group} className="border border-border rounded-lg bg-card overflow-hidden">
                  <div className={cn("px-4 py-2 border-b border-border flex items-center gap-2",
                    groupBy === "status" && STATUS_STYLE[group as WPStatus] ? STATUS_STYLE[group as WPStatus].bg : "bg-muted/30"
                  )}>
                    {groupBy === "status" && STATUS_STYLE[group as WPStatus] && (
                      <span className={cn("w-2.5 h-2.5 rounded-full", STATUS_STYLE[group as WPStatus].dot)} />
                    )}
                    <span className="text-xs font-bold text-foreground">{group}</span>
                    <Badge variant="secondary" className="text-[9px] h-4">{items.length}</Badge>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        <th className="text-left px-3 py-1.5 font-semibold w-24">WP ID</th>
                        <th className="text-left px-3 py-1.5 font-semibold">Title</th>
                        <th className="text-left px-3 py-1.5 font-semibold w-28">Area</th>
                        <th className="text-left px-3 py-1.5 font-semibold w-20">Trade</th>
                        <th className="text-center px-3 py-1.5 font-semibold w-14">%</th>
                        <th className="text-left px-3 py-1.5 font-semibold w-24">Status</th>
                        <th className="text-left px-3 py-1.5 font-semibold">Next Action / Blocker</th>
                        <th className="text-left px-3 py-1.5 font-semibold w-24">Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((p) => {
                        const st = STATUS_STYLE[p.status];
                        return (
                          <tr
                            key={p.id}
                            className={cn(
                              "border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/20 transition-colors",
                              selectedId === p.id && "bg-primary/5",
                              (p.status === "Blocked" || p.status === "Delayed") && "bg-destructive/[0.02]"
                            )}
                            onClick={() => setSelectedId(p.id)}
                          >
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-1.5">
                                <span className={cn("w-2 h-2 rounded-full flex-shrink-0", st.dot)} />
                                <span className="font-mono font-semibold">{p.id}</span>
                                {p.criticalPath && <span className="text-destructive text-[8px] font-bold">CP</span>}
                              </div>
                            </td>
                            <td className="px-3 py-2 font-medium">{p.title}</td>
                            <td className="px-3 py-2 text-muted-foreground">{p.area}</td>
                            <td className="px-3 py-2">
                              <span className="flex items-center gap-1">
                                {p.trade === "Mechanical" ? <Wrench className="w-2.5 h-2.5 text-blue-600" /> : <Zap className="w-2.5 h-2.5 text-amber-600" />}
                                <span className="text-muted-foreground">{p.trade.substring(0, 4)}</span>
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center font-semibold">{p.pctComplete}%</td>
                            <td className="px-3 py-2">
                              <Badge variant="outline" className={cn("text-[9px]", st.text, st.border)}>{p.status}</Badge>
                            </td>
                            <td className="px-3 py-2">
                              {p.blockerDescription ? (
                                <span className="text-destructive flex items-center gap-1 text-[10px]">
                                  <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" />
                                  <span className="truncate max-w-[200px]">{p.blockerDescription.substring(0, 45)}…</span>
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-[10px] truncate max-w-[200px] block">{p.nextAction}</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">{p.supervisor}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            /* ---- KANBAN VIEW ---- */
            <div className="flex gap-3 overflow-x-auto pb-2">
              {STATUS_ORDER.map((status) => {
                const st = STATUS_STYLE[status];
                const items = filtered.filter((p) => p.status === status);
                return (
                  <div key={status} className="flex-shrink-0 w-72">
                    <div className={cn("rounded-t-lg px-3 py-2 flex items-center gap-2 border border-b-0", st.border, st.bg)}>
                      <span className={cn("w-2.5 h-2.5 rounded-full", st.dot)} />
                      <span className={cn("text-xs font-bold", st.text)}>{status}</span>
                      <Badge variant="outline" className={cn("text-[9px] h-4 ml-auto", st.text, st.border)}>{items.length}</Badge>
                    </div>
                    <div className={cn("border border-t-0 rounded-b-lg p-2 space-y-2 min-h-[200px] max-h-[600px] overflow-y-auto", st.border)}>
                      {items.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedId(p.id)}
                          className={cn(
                            "w-full text-left rounded-md border p-2.5 transition-all hover:shadow-sm bg-card",
                            selectedId === p.id ? "border-foreground shadow-sm" : "border-border"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-bold text-foreground">{p.id}</span>
                            {p.criticalPath && <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-destructive text-destructive">CP</Badge>}
                          </div>
                          <p className="text-[11px] font-medium text-foreground leading-snug mb-1">{p.title}</p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                            <span>{p.area}</span>
                            <span className="flex items-center gap-1">
                              {p.trade === "Mechanical" ? <Wrench className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5" />}
                              {p.trade.substring(0, 4)}
                            </span>
                          </div>
                          {/* Progress */}
                          <div className="w-full h-1.5 bg-muted rounded-full mb-1.5 overflow-hidden">
                            <div className={cn("h-full rounded-full", st.dot)} style={{ width: `${p.pctComplete}%` }} />
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">{p.supervisor}</span>
                            <span className="font-semibold text-foreground">{p.pctComplete}%</span>
                          </div>
                          {p.blockerDescription && (
                            <div className="mt-1.5 rounded border border-destructive/20 bg-destructive/5 px-2 py-1 text-[10px] text-destructive">
                              <span className="flex items-center gap-1 font-semibold mb-0.5">
                                <AlertTriangle className="w-2.5 h-2.5" /> {p.blockerType}
                              </span>
                              <p className="leading-snug">{p.blockerDescription.substring(0, 60)}…</p>
                              <p className="mt-0.5 opacity-70">Owner: {p.blockerOwner} • {p.blockerETA}</p>
                            </div>
                          )}
                        </button>
                      ))}
                      {items.length === 0 && (
                        <div className="text-center py-8 text-[10px] text-muted-foreground">No packages</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== DETAIL PANEL ===== */}
        {selected && (
          <div className="w-96 flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
            <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between", STATUS_STYLE[selected.status].bg)}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-foreground">{selected.id}</span>
                  {selected.criticalPath && <Badge variant="outline" className="text-[8px] h-3.5 border-destructive text-destructive">Critical Path</Badge>}
                  <Badge variant="outline" className={cn("text-[9px] h-4", STATUS_STYLE[selected.status].text, STATUS_STYLE[selected.status].border)}>{selected.status}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-foreground mt-1">{selected.title}</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedId(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4 max-h-[560px] overflow-y-auto">
              {/* Key info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Area", value: selected.area },
                  { label: "Trade", value: selected.trade },
                  { label: "Planned Start", value: selected.plannedStart },
                  { label: "Planned Finish", value: selected.plannedFinish },
                  { label: "% Complete", value: `${selected.pctComplete}%` },
                  { label: "Shift", value: `${selected.shift} Shift` },
                  { label: "Supervisor", value: selected.supervisor },
                  { label: "Status", value: selected.status },
                ].map((item) => (
                  <div key={item.label} className="rounded-md border border-border px-2.5 py-1.5">
                    <div className="text-[10px] text-muted-foreground">{item.label}</div>
                    <div className="font-medium text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">{selected.pctComplete}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", STATUS_STYLE[selected.status].dot)} style={{ width: `${selected.pctComplete}%` }} />
                </div>
              </div>

              {/* Next Action */}
              <div className="rounded-md border border-blue-500/30 bg-blue-500/5 p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 mb-0.5">
                  <ArrowRight className="w-3 h-3" /> Next Action
                </div>
                <p className="text-xs text-blue-600">{selected.nextAction}</p>
              </div>

              {/* Blocker */}
              {selected.blockerDescription && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-destructive">
                    <AlertTriangle className="w-3.5 h-3.5" /> BLOCKER — {selected.blockerType}
                  </div>
                  <p className="text-xs text-destructive leading-relaxed">{selected.blockerDescription}</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded border border-destructive/20 px-2 py-1">
                      <div className="text-destructive/60">Owner to Clear</div>
                      <div className="font-semibold text-destructive">{selected.blockerOwner}</div>
                    </div>
                    <div className="rounded border border-destructive/20 px-2 py-1">
                      <div className="text-destructive/60">Expected Resolution</div>
                      <div className="font-semibold text-destructive">{selected.blockerETA}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delay Reason */}
              {selected.delayReason && !selected.blockerDescription && (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 mb-0.5">
                    <Clock className="w-3 h-3" /> Delay Reason
                  </div>
                  <p className="text-xs text-amber-600">{selected.delayReason}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
