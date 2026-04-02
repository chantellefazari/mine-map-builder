import { useState, useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { ShutdownWallChart } from "./ShutdownWallChart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Printer, FileDown, Eye, Filter, Map, Route, Clock, BarChart3,
  AlertTriangle, Wrench, Zap, CheckCircle2, Shield, ChevronRight,
  ArrowRight, Target, Activity, CircleDot, Calendar, User,
} from "lucide-react";
import {
  SHUTDOWN_NAME, SHUTDOWN_DATE,
  ALL_AREA_OPTIONS, ALL_TRADES, ALL_SHIFTS,
  type ShutdownWorkPackage, type WPStatus,
} from "./shutdownData";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type PackType = "wall-chart" | "area-overview" | "critical-sequence" | "shift-execution";

/* ------------------------------------------------------------------ */
/*  STYLING                                                            */
/* ------------------------------------------------------------------ */

const STATUS_STYLE: Record<string, { text: string; border: string; dot: string; label: string }> = {
  "Not Started": { text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground/50", label: "Not Started" },
  Complete: { text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground/50", label: "Complete" },
  Active: { text: "text-emerald-600", border: "border-emerald-500/30", dot: "bg-emerald-500", label: "Active" },
  Ready: { text: "text-blue-600", border: "border-blue-500/30", dot: "bg-blue-500", label: "Ready" },
  Blocked: { text: "text-destructive", border: "border-destructive/30", dot: "bg-destructive", label: "Blocked" },
  Delayed: { text: "text-amber-600", border: "border-amber-500/30", dot: "bg-amber-500", label: "Delayed" },
};

const PACK_TYPES: { key: PackType; label: string; icon: typeof Map; description: string }[] = [
  { key: "wall-chart", label: "Wall Chart Gantt", icon: BarChart3, description: "A1/A0 plotter print — full shutdown timeline with run-down, jobs by area, and run-up" },
  { key: "area-overview", label: "Shutdown Area Overview", icon: Map, description: "Leadership summary — area status, progress, and key risks" },
  { key: "critical-sequence", label: "Critical Sequence Sheet", icon: Route, description: "Critical path packages in dependency order with blockers" },
  { key: "shift-execution", label: "Shift Execution Board", icon: Clock, description: "Shift-specific packages, owners, blockers, and handover notes" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function getAreaSummary(packages: ShutdownWorkPackage[]) {
  const areas = Array.from(new Set(packages.map((p) => p.area)));
  return areas.map((area) => {
    const ap = packages.filter((p) => p.area === area);
    const complete = ap.filter((p) => p.status === "Complete").length;
    const active = ap.filter((p) => p.status === "Active").length;
    const blocked = ap.filter((p) => p.status === "Blocked" || p.status === "Delayed").length;
    const pct = ap.length > 0 ? Math.round(ap.reduce((s, p) => s + p.pctComplete, 0) / ap.length) : 0;
    const status: string = blocked > 0 ? "Blocked" : active > 0 ? "Active" : complete === ap.length ? "Complete" : "Ready";
    const delays = ap.filter((p) => p.blockerDescription);
    return { area, total: ap.length, complete, active, blocked, pct, status, delays, packages: ap };
  });
}

function handlePrint(ref: React.RefObject<HTMLDivElement | null>) {
  if (!ref.current) return;
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']")).map((el) => el.outerHTML).join("\n");
  printWindow.document.write(`<!DOCTYPE html><html><head><title>Shutdown Print Pack</title>${styles}<style>@media print { body { margin: 8mm; font-size: 11px; color: #000; background: #fff; } .no-print { display: none !important; } table { break-inside: auto; } tr { break-inside: avoid; } thead { display: table-header-group; } } body { background: #fff; padding: 16px; }</style></head><body>${ref.current.innerHTML}</body></html>`);
  printWindow.document.close();
  setTimeout(() => { printWindow.focus(); printWindow.print(); }, 400);
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ShutdownPrintPackTab() {
  const { filterArea, setFilterArea, filterTrade, setFilterTrade, filterShift, setFilterShift, packages } = useOrchestratorContext();
  const [packType, setPackType] = useState<PackType>("area-overview");
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return packages.filter((p) => {
      if (filterArea !== "All" && p.area !== filterArea) return false;
      if (filterTrade !== "All" && p.trade !== filterTrade) return false;
      if (filterShift !== "All" && p.shift !== filterShift) return false;
      return true;
    });
  }, [filterArea, filterTrade, filterShift, packages]);

  const currentPack = PACK_TYPES.find((p) => p.key === packType)!;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {PACK_TYPES.map((pack) => (
          <button key={pack.key} onClick={() => setPackType(pack.key)} className={cn("text-left rounded-lg border p-4 transition-all hover:shadow-sm", packType === pack.key ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card")}>
            <div className="flex items-center gap-2 mb-1.5">
              <pack.icon className={cn("w-4 h-4", packType === pack.key ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-xs font-bold", packType === pack.key ? "text-primary" : "text-foreground")}>{pack.label}</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-snug">{pack.description}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{ALL_AREA_OPTIONS.map((a) => <SelectItem key={a} value={a}>{a === "All" ? "All Areas" : a}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filterTrade} onValueChange={setFilterTrade}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{ALL_TRADES.map((t) => <SelectItem key={t} value={t}>{t === "All" ? "All Trades" : t}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filterShift} onValueChange={setFilterShift}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{ALL_SHIFTS.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "All Shifts" : `${s} Shift`}</SelectItem>)}</SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant={showPreview ? "default" : "outline"} size="sm" className="h-8 text-xs gap-1.5" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-3.5 h-3.5" /> {showPreview ? "Close Preview" : "Print Preview"}
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => handlePrint(printRef)}>
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => handlePrint(printRef)}>
            <FileDown className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      <div className={cn(showPreview && "border-2 border-dashed border-primary/20 rounded-lg p-6 bg-background shadow-inner")}>
        <div ref={printRef}>
          <div className="mb-6 border-b-2 border-foreground pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black text-foreground tracking-tight">{currentPack.label}</h1>
                <p className="text-sm text-muted-foreground">{SHUTDOWN_NAME}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">{SHUTDOWN_DATE}</p>
                <p>Generated: {new Date().toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}</p>
                {filterArea !== "All" && <p>Area: {filterArea}</p>}
                {filterShift !== "All" && <p>Shift: {filterShift}</p>}
              </div>
            </div>
          </div>

          {packType === "area-overview" && <AreaOverviewPack packages={filtered} />}
          {packType === "critical-sequence" && <CriticalSequencePack packages={filtered} />}
          {packType === "shift-execution" && <ShiftExecutionPack packages={filtered} filterShift={filterShift} />}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PACK 1: AREA OVERVIEW                                              */
/* ------------------------------------------------------------------ */

function AreaOverviewPack({ packages }: { packages: ShutdownWorkPackage[] }) {
  const areas = getAreaSummary(packages);
  const totalPct = packages.length > 0 ? Math.round(packages.reduce((s, p) => s + p.pctComplete, 0) / packages.length) : 0;
  const totalBlocked = packages.filter((p) => p.status === "Blocked" || p.status === "Delayed").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Overall Progress", value: `${totalPct}%` },
          { label: "Total Packages", value: packages.length },
          { label: "Areas", value: areas.length },
          { label: "Blocked / Delayed", value: totalBlocked },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-md p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-black text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b-2 border-foreground">
            <th className="text-left py-2 px-2 font-bold">Area</th>
            <th className="text-center py-2 px-2 font-bold w-16">Total</th>
            <th className="text-center py-2 px-2 font-bold w-16">Done</th>
            <th className="text-center py-2 px-2 font-bold w-16">Active</th>
            <th className="text-center py-2 px-2 font-bold w-20">Blocked</th>
            <th className="text-center py-2 px-2 font-bold w-14">%</th>
            <th className="text-center py-2 px-2 font-bold w-20">Status</th>
            <th className="text-left py-2 px-2 font-bold">Key Risks / Delays</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((a, i) => {
            const st = STATUS_STYLE[a.status] || STATUS_STYLE.Ready;
            return (
              <tr key={a.area} className={cn("border-b border-border", i % 2 === 0 && "bg-muted/20")}>
                <td className="py-2 px-2 font-semibold">{a.area}</td>
                <td className="py-2 px-2 text-center">{a.total}</td>
                <td className="py-2 px-2 text-center">{a.complete}</td>
                <td className="py-2 px-2 text-center">{a.active}</td>
                <td className="py-2 px-2 text-center font-semibold">{a.blocked > 0 ? <span className="text-destructive">{a.blocked}</span> : "0"}</td>
                <td className="py-2 px-2 text-center">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", st.dot)} style={{ width: `${a.pct}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold w-7">{a.pct}%</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold", st.text)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                    {st.label}
                  </span>
                </td>
                <td className="py-2 px-2 text-[10px] text-muted-foreground">
                  {a.delays.length > 0 ? a.delays.map((d) => d.blockerDescription.substring(0, 50)).join("; ") : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {areas.filter((a) => a.packages.some((p) => p.status !== "Complete")).map((a) => (
        <div key={a.area}>
          <h3 className="text-xs font-bold text-foreground border-b border-border pb-1 mb-2 flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", (STATUS_STYLE[a.status] || STATUS_STYLE.Ready).dot)} />
            {a.area} — {a.pct}% Complete
          </h3>
          <table className="w-full text-[11px] border-collapse mb-3">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-1.5 px-2 font-semibold w-20">WP</th>
                <th className="text-left py-1.5 px-2 font-semibold">Title</th>
                <th className="text-left py-1.5 px-2 font-semibold w-20">Trade</th>
                <th className="text-center py-1.5 px-2 font-semibold w-16">Status</th>
                <th className="text-center py-1.5 px-2 font-semibold w-10">%</th>
                <th className="text-left py-1.5 px-2 font-semibold">Next Action / Risk</th>
              </tr>
            </thead>
            <tbody>
              {a.packages.filter((p) => p.status !== "Complete").map((p) => {
                const ps = STATUS_STYLE[p.status] || STATUS_STYLE.Ready;
                return (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-1.5 px-2 font-mono font-semibold">{p.id}</td>
                    <td className="py-1.5 px-2">{p.title}{p.criticalPath && <span className="text-destructive text-[9px] font-bold ml-1">CP</span>}</td>
                    <td className="py-1.5 px-2">{p.trade}</td>
                    <td className="py-1.5 px-2 text-center"><span className={cn("text-[10px] font-semibold", ps.text)}>{p.status}</span></td>
                    <td className="py-1.5 px-2 text-center font-semibold">{p.pctComplete}</td>
                    <td className="py-1.5 px-2 text-muted-foreground">{p.blockerDescription || p.nextAction}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PACK 2: CRITICAL SEQUENCE SHEET                                    */
/* ------------------------------------------------------------------ */

function CriticalSequencePack({ packages }: { packages: ShutdownWorkPackage[] }) {
  const cpPackages = packages.filter((p) => p.criticalPath);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Critical Packages", value: cpPackages.length },
          { label: "Blocked", value: cpPackages.filter((p) => p.status === "Blocked").length },
          { label: "Delayed", value: cpPackages.filter((p) => p.status === "Delayed").length },
          { label: "Complete", value: cpPackages.filter((p) => p.status === "Complete").length },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-md p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-black text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="border-b-2 border-foreground">
            <th className="text-left py-2 px-2 font-bold w-6">#</th>
            <th className="text-left py-2 px-2 font-bold w-20">WP</th>
            <th className="text-left py-2 px-2 font-bold">Title</th>
            <th className="text-left py-2 px-2 font-bold w-32">Area</th>
            <th className="text-left py-2 px-2 font-bold w-20">Trade</th>
            <th className="text-left py-2 px-2 font-bold w-24">Start</th>
            <th className="text-left py-2 px-2 font-bold w-24">Finish</th>
            <th className="text-center py-2 px-2 font-bold w-12">Hrs</th>
            <th className="text-center py-2 px-2 font-bold w-16">Status</th>
            <th className="text-left py-2 px-2 font-bold w-20">Depends</th>
            <th className="text-left py-2 px-2 font-bold">Blocker / Next Action</th>
          </tr>
        </thead>
        <tbody>
          {cpPackages.map((p, i) => {
            const ps = STATUS_STYLE[p.status] || STATUS_STYLE.Ready;
            return (
              <tr key={p.id} className={cn("border-b border-border", i % 2 === 0 && "bg-muted/20", (p.status === "Blocked" || p.status === "Delayed") && "bg-destructive/[0.03]")}>
                <td className="py-2 px-2 text-muted-foreground font-semibold">{i + 1}</td>
                <td className="py-2 px-2 font-mono font-semibold">{p.id}</td>
                <td className="py-2 px-2 font-medium">{p.title}</td>
                <td className="py-2 px-2">{p.area}</td>
                <td className="py-2 px-2">{p.trade}</td>
                <td className="py-2 px-2 text-muted-foreground">{p.plannedStart}</td>
                <td className="py-2 px-2 text-muted-foreground">{p.plannedFinish}</td>
                <td className="py-2 px-2 text-center font-semibold">{p.durationHrs}</td>
                <td className="py-2 px-2 text-center"><span className={cn("text-[10px] font-bold", ps.text)}>{p.status}</span></td>
                <td className="py-2 px-2 text-muted-foreground font-mono text-[10px]">{p.predecessors.length > 0 ? p.predecessors.join(", ") : "—"}</td>
                <td className="py-2 px-2">{p.blockerDescription ? <span className="text-destructive">{p.blockerDescription.substring(0, 55)}…</span> : <span className="text-muted-foreground">{p.nextAction}</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {cpPackages.filter((p) => p.blockerDescription).length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-destructive border-b border-destructive/30 pb-1 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Active Critical Blockers
          </h3>
          <div className="space-y-2">
            {cpPackages.filter((p) => p.blockerDescription).map((p) => {
              const ps = STATUS_STYLE[p.status] || STATUS_STYLE.Ready;
              return (
                <div key={p.id} className="border border-destructive/20 rounded-md p-3 bg-destructive/[0.02]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold">{p.id}</span>
                    <span className="text-xs font-semibold text-foreground">{p.title}</span>
                    <Badge variant="outline" className={cn("text-[8px] h-3.5 ml-auto", ps.text, ps.border)}>{p.blockerType}</Badge>
                  </div>
                  <p className="text-[11px] text-destructive">{p.blockerDescription}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-[10px] text-muted-foreground">
                    <span>Owner: <strong className="text-foreground">{p.blockerOwner}</strong></span>
                    <span>Successors: <strong className="text-foreground">{p.successors.join(", ") || "—"}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PACK 3: SHIFT EXECUTION BOARD                                      */
/* ------------------------------------------------------------------ */

function ShiftExecutionPack({ packages, filterShift }: { packages: ShutdownWorkPackage[]; filterShift: string }) {
  const toStart = packages.filter((p) => p.status === "Ready");
  const active = packages.filter((p) => p.status === "Active");
  const blocked = packages.filter((p) => p.status === "Blocked" || p.status === "Delayed");
  const toComplete = packages.filter((p) => p.status === "Active" && p.pctComplete >= 70);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total", value: packages.length },
          { label: "To Start", value: toStart.length },
          { label: "Active", value: active.length },
          { label: "Blocked", value: blocked.length },
          { label: "Near Complete", value: toComplete.length },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-md p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-black text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {blocked.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-destructive border-b border-destructive/30 pb-1 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Blockers — Immediate Action Required
          </h3>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-destructive/30 bg-destructive/[0.03]">
                <th className="text-left py-1.5 px-2 font-bold w-20">WP</th>
                <th className="text-left py-1.5 px-2 font-bold">Title</th>
                <th className="text-left py-1.5 px-2 font-bold w-20">Type</th>
                <th className="text-left py-1.5 px-2 font-bold">Blocker Description</th>
                <th className="text-left py-1.5 px-2 font-bold">Owner to Clear</th>
              </tr>
            </thead>
            <tbody>
              {blocked.map((p) => (
                <tr key={p.id} className="border-b border-destructive/20">
                  <td className="py-2 px-2 font-mono font-semibold">{p.id}</td>
                  <td className="py-2 px-2 font-medium">{p.title}</td>
                  <td className="py-2 px-2 text-destructive font-semibold">{p.blockerType || p.status}</td>
                  <td className="py-2 px-2 text-destructive">{p.blockerDescription || p.delayReason}</td>
                  <td className="py-2 px-2 font-semibold">{p.blockerOwner || p.supervisor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active.length > 0 && <ShiftSection title="Active Work" icon={<Activity className="w-3.5 h-3.5 text-emerald-600" />} color="emerald" packages={active} showHandover />}
      {toStart.length > 0 && <ShiftSection title="Packages to Start" icon={<CircleDot className="w-3.5 h-3.5 text-blue-600" />} color="blue" packages={toStart} showHandover={false} />}

      {toComplete.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-foreground border-b border-border pb-1 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Packages Near Completion — Handover Points
          </h3>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-1.5 px-2 font-semibold w-20">WP</th>
                <th className="text-left py-1.5 px-2 font-semibold">Title</th>
                <th className="text-center py-1.5 px-2 font-semibold w-10">%</th>
                <th className="text-left py-1.5 px-2 font-semibold w-24">Owner</th>
                <th className="text-left py-1.5 px-2 font-semibold">Handover Notes</th>
              </tr>
            </thead>
            <tbody>
              {toComplete.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-1.5 px-2 font-mono font-semibold">{p.id}</td>
                  <td className="py-1.5 px-2">{p.title}</td>
                  <td className="py-1.5 px-2 text-center font-bold text-emerald-600">{p.pctComplete}%</td>
                  <td className="py-1.5 px-2">{p.supervisor}</td>
                  <td className="py-1.5 px-2 text-muted-foreground">{p.handoverNotes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ShiftSection({ title, icon, color, packages, showHandover }: { title: string; icon: React.ReactNode; color: string; packages: ShutdownWorkPackage[]; showHandover: boolean }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-foreground border-b border-border pb-1 mb-2 flex items-center gap-1.5">
        {icon} {title}
      </h3>
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left py-1.5 px-2 font-semibold w-20">WP</th>
            <th className="text-left py-1.5 px-2 font-semibold">Title</th>
            <th className="text-left py-1.5 px-2 font-semibold w-32">Area</th>
            <th className="text-left py-1.5 px-2 font-semibold w-20">Trade</th>
            <th className="text-center py-1.5 px-2 font-semibold w-10">%</th>
            <th className="text-left py-1.5 px-2 font-semibold w-24">Owner</th>
            <th className="text-left py-1.5 px-2 font-semibold">{showHandover ? "Handover / Next Action" : "Next Action"}</th>
            <th className="text-center py-1.5 px-2 font-semibold w-8">CP</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((p) => (
            <tr key={p.id} className="border-b border-border/50">
              <td className="py-1.5 px-2 font-mono font-semibold">{p.id}</td>
              <td className="py-1.5 px-2 font-medium">{p.title}</td>
              <td className="py-1.5 px-2">{p.area}</td>
              <td className="py-1.5 px-2">{p.trade}</td>
              <td className="py-1.5 px-2 text-center font-semibold">{p.pctComplete}</td>
              <td className="py-1.5 px-2">{p.supervisor}</td>
              <td className="py-1.5 px-2 text-muted-foreground">{showHandover && p.handoverNotes ? p.handoverNotes : p.nextAction}</td>
              <td className="py-1.5 px-2 text-center">{p.criticalPath ? <span className="text-destructive font-bold">●</span> : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
