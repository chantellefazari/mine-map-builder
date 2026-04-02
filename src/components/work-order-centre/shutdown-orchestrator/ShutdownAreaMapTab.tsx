import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  X, Route, Clock, AlertTriangle, Shield, Wrench, Zap,
  ChevronRight, Activity, CheckCircle2, Package, MapPin,
  Filter, Layers, Target, Lock,
} from "lucide-react";
import {
  ALL_AREA_OPTIONS,
  type AreaZone, type ShutdownWorkPackage,
} from "./shutdownData";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type AreaStatus = "Not Started" | "Ready" | "Active" | "At Risk" | "Delayed" | "Complete";
type Overlay = "critical-path" | "delays" | "isolations" | "access" | "trade" | "progress";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

/* Derived from context */

/* ------------------------------------------------------------------ */
/*  STATUS STYLING                                                     */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<AreaStatus, { bg: string; border: string; text: string; dot: string; progressBar: string }> = {
  "Not Started": { bg: "bg-muted/40", border: "border-border", text: "text-muted-foreground", dot: "bg-muted-foreground", progressBar: "bg-muted-foreground" },
  Ready:    { bg: "bg-blue-500/5", border: "border-blue-500/30", text: "text-blue-600", dot: "bg-blue-500", progressBar: "bg-blue-500" },
  Active:   { bg: "bg-emerald-500/5", border: "border-emerald-500/30", text: "text-emerald-600", dot: "bg-emerald-500", progressBar: "bg-emerald-500" },
  "At Risk": { bg: "bg-amber-500/5", border: "border-amber-500/30", text: "text-amber-600", dot: "bg-amber-500", progressBar: "bg-amber-500" },
  Delayed:  { bg: "bg-destructive/5", border: "border-destructive/30", text: "text-destructive", dot: "bg-destructive", progressBar: "bg-destructive" },
  Complete: { bg: "bg-emerald-700/5", border: "border-emerald-700/30", text: "text-emerald-700", dot: "bg-emerald-700", progressBar: "bg-emerald-700" },
};

const WP_STATUS_STYLE: Record<string, string> = {
  Ready: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Blocked: "bg-destructive/10 text-destructive border-destructive/30",
  Delayed: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  Complete: "bg-muted text-muted-foreground border-border",
};

const OVERLAY_OPTIONS: { key: Overlay; label: string; icon: typeof Route }[] = [
  { key: "critical-path", label: "Critical Path", icon: Route },
  { key: "delays", label: "Delays", icon: Clock },
  { key: "isolations", label: "Isolations", icon: Shield },
  { key: "access", label: "Access", icon: Lock },
  { key: "trade", label: "Trade", icon: Wrench },
  { key: "progress", label: "% Complete", icon: Target },
];

const ALL_TRADES = ["All", "Mechanical", "Electrical", "Instrumentation"];
const ALL_STATUSES: AreaStatus[] = ["Not Started", "Ready", "Active", "At Risk", "Delayed", "Complete"];

/* ------------------------------------------------------------------ */
/*  AREA CARD                                                          */
/* ------------------------------------------------------------------ */

function AreaCard({
  area,
  isSelected,
  onSelect,
  overlays,
  packages,
}: {
  area: AreaZone;
  isSelected: boolean;
  onSelect: () => void;
  overlays: Set<Overlay>;
  packages: ShutdownWorkPackage[];
}) {
  const status = area.status as AreaStatus;
  const cfg = STATUS_CONFIG[status];
  const cpCount = area.criticalPath;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative text-left rounded-xl border-2 p-4 transition-all hover:shadow-md",
        cfg.bg, cfg.border,
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg",
      )}
    >
      {/* Blocked badge */}
      {area.blocked > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-destructive text-white text-[10px] font-bold shadow-sm">
          {area.blocked}
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-bold text-foreground leading-tight">{area.name}</h4>
        <Badge variant="outline" className={cn("text-[10px] shrink-0 border-current", cfg.text)}>
          {area.status}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className={cn("font-bold", cfg.text)}>{area.pctComplete}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", cfg.progressBar)} style={{ width: `${area.pctComplete}%` }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <div className="text-center rounded-md bg-background/60 py-1">
          <div className="text-xs font-bold text-foreground">{area.total}</div>
          <div className="text-[9px] text-muted-foreground">Packages</div>
        </div>
        <div className="text-center rounded-md bg-background/60 py-1">
          <div className="text-xs font-bold text-emerald-600">{area.active}</div>
          <div className="text-[9px] text-muted-foreground">Active</div>
        </div>
        <div className="text-center rounded-md bg-background/60 py-1">
          <div className={cn("text-xs font-bold", area.delayed > 0 ? "text-amber-600" : "text-muted-foreground")}>{area.delayed}</div>
          <div className="text-[9px] text-muted-foreground">Delayed</div>
        </div>
      </div>

      {/* Overlay info strips */}
      <div className="space-y-1">
        {overlays.has("critical-path") && cpCount > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-destructive">
            <Route className="w-3 h-3" />
            <span className="font-semibold">{cpCount} critical path items</span>
          </div>
        )}
        {overlays.has("isolations") && area.isolationStatus !== "All Clear" && area.isolationStatus !== "N/A" && (
          <div className="flex items-center gap-1.5 text-[10px] text-purple-600">
            <Shield className="w-3 h-3" />
            <span>{area.isolationStatus}</span>
          </div>
        )}
        {overlays.has("access") && area.accessConstraints !== "None" && (
          <div className="flex items-center gap-1.5 text-[10px] text-amber-600">
            <Lock className="w-3 h-3" />
            <span className="truncate">{area.accessConstraints}</span>
          </div>
        )}
        {overlays.has("delays") && area.delayed > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-amber-600">
            <Clock className="w-3 h-3" />
            <span>{area.delayed} delayed package{area.delayed > 1 ? "s" : ""}</span>
          </div>
        )}
        {overlays.has("trade") && (
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            {["Mechanical", "Electrical", "Instrumentation"].map(t => {
              const c = packages.filter(p => p.trade === t).length;
              if (c === 0) return null;
              return (
                <span key={t} className="flex items-center gap-0.5">
                  {t === "Mechanical" ? <Wrench className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5" />}
                  {t.charAt(0)}: {c}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Supervisor */}
      <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Activity className="w-3 h-3" />
        <span>{area.supervisor}</span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  DETAIL PANEL                                                       */
/* ------------------------------------------------------------------ */

function DetailPanel({
  area,
  packages,
  onClose,
  ctx,
}: {
  area: AreaZone;
  packages: ShutdownWorkPackage[];
  onClose: () => void;
  ctx: ReturnType<typeof useOrchestratorContext>;
}) {
  const status = area.status as AreaStatus;
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="w-[380px] flex-shrink-0 border border-border rounded-xl bg-card overflow-hidden shadow-lg">
      {/* Header */}
      <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between", cfg.bg)}>
        <div>
          <h3 className="text-sm font-bold text-foreground">{area.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className={cn("text-[10px] border-current", cfg.text)}>{area.status}</Badge>
            <span className="text-[10px] text-muted-foreground">{area.pctComplete}% complete</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Total", value: area.total, color: "text-foreground" },
            { label: "Active", value: area.active, color: "text-emerald-600" },
            { label: "Blocked", value: area.blocked, color: "text-destructive" },
            { label: "Delayed", value: area.delayed, color: "text-amber-600" },
            { label: "Complete", value: area.complete, color: "text-emerald-700" },
            { label: "Critical Path", value: area.criticalPath, color: "text-destructive" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border px-2.5 py-2 text-center">
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
              <div className={cn("text-lg font-bold", s.color)}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-bold text-foreground">{area.pctComplete}%</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", cfg.progressBar)} style={{ width: `${area.pctComplete}%` }} />
          </div>
        </div>

        {/* Constraints */}
        <div className="space-y-2 rounded-lg bg-muted/30 p-3">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Isolation:</span>
            <span className={cn("font-medium", area.isolationStatus === "All Clear" ? "text-emerald-600" : "text-amber-600")}>
              {area.isolationStatus}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Access:</span>
            <span className={cn("font-medium", area.accessConstraints === "None" ? "text-emerald-600" : "text-amber-600")}>
              {area.accessConstraints}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Activity className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Supervisor:</span>
            <span className="font-medium text-foreground">{area.supervisor}</span>
          </div>
        </div>

        {/* Work Packages */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">Work Packages ({packages.length})</span>
          </div>
          <div className="space-y-2">
            {packages.map((wp) => (
              <button
                key={wp.id}
                onClick={() => { ctx.setSelectedPackageId(wp.id); ctx.navigateToTab("sequence"); }}
                className={cn(
                  "w-full text-left rounded-lg border p-3 transition-colors hover:shadow-sm",
                  WP_STATUS_STYLE[wp.status] || "border-border"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold">{wp.id}</span>
                  <div className="flex items-center gap-1">
                    {wp.criticalPath && (
                      <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-destructive text-destructive">CP</Badge>
                    )}
                    <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-current">{wp.status}</Badge>
                  </div>
                </div>
                <p className="text-[11px] font-medium leading-snug mb-1.5">{wp.title}</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1 opacity-80">
                    {wp.trade === "Mechanical" ? <Wrench className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5" />}
                    {wp.trade}
                  </span>
                  <span className="font-semibold">{wp.pctComplete}%</span>
                </div>
                {wp.delayReason && (
                  <p className="text-[10px] mt-1.5 opacity-70 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" /> {wp.delayReason}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1.5 text-[9px] opacity-50">
                  <ChevronRight className="w-2.5 h-2.5" /> View in Sequence Flow
                </div>
              </button>
            ))}
            {packages.length === 0 && (
              <div className="text-center py-6 text-xs text-muted-foreground">No work packages in this area</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export function ShutdownAreaMapTab() {
  const ctx = useOrchestratorContext();
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [overlays, setOverlays] = useState<Set<Overlay>>(new Set());
  const [filterArea, setFilterArea] = useState("All");
  const [filterTrade, setFilterTrade] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCritical, setFilterCritical] = useState(false);

  const handleAreaSelect = (areaId: string | null) => {
    setSelectedAreaId(areaId);
    if (areaId) {
      const area = AREAS.find(a => a.id === areaId);
      if (area) ctx.setFilterArea(area.name);
    }
  };

  const selectedArea = AREAS.find((a) => a.id === selectedAreaId) ?? null;
  const areaPackages = useMemo(
    () => (selectedArea ? PACKAGES.filter((p) => p.area === selectedArea.name) : []),
    [selectedArea]
  );

  const toggleOverlay = (o: Overlay) => {
    setOverlays((prev) => {
      const next = new Set(prev);
      if (next.has(o)) next.delete(o);
      else next.add(o);
      return next;
    });
  };

  const visibleAreas = useMemo(() => {
    return AREAS.filter((a) => {
      if (filterArea !== "All" && a.id !== filterArea) return false;
      if (filterStatus !== "All" && a.status !== filterStatus) return false;
      if (filterCritical && a.criticalPath === 0) return false;
      if (filterTrade !== "All") {
        const hasTradeWP = PACKAGES.some((p) => p.area === a.name && p.trade === filterTrade);
        if (!hasTradeWP) return false;
      }
      return true;
    });
  }, [filterArea, filterTrade, filterStatus, filterCritical]);

  // Summary stats
  const totalPackages = AREAS.reduce((s, a) => s + a.total, 0);
  const totalActive = AREAS.reduce((s, a) => s + a.active, 0);
  const totalBlocked = AREAS.reduce((s, a) => s + a.blocked, 0);
  const totalDelayed = AREAS.reduce((s, a) => s + a.delayed, 0);
  const overallPct = AREAS.length > 0 ? Math.round(AREAS.reduce((s, a) => s + a.pctComplete, 0) / AREAS.length) : 0;

  return (
    <div className="space-y-4">
      {/* ===== SUMMARY BAR ===== */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total Packages", value: totalPackages, color: "text-foreground" },
          { label: "Active", value: totalActive, color: "text-emerald-600" },
          { label: "Blocked", value: totalBlocked, color: "text-destructive" },
          { label: "Delayed", value: totalDelayed, color: "text-amber-600" },
          { label: "Overall Progress", value: `${overallPct}%`, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card px-3 py-2.5 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className={cn("text-xl font-bold mt-0.5", s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ===== FILTERS BAR ===== */}
      <div className="flex items-center gap-2 flex-wrap rounded-lg border border-border bg-card px-3 py-2">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Area" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Areas</SelectItem>
            {AREAS.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterTrade} onValueChange={setFilterTrade}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Trade" /></SelectTrigger>
          <SelectContent>
            {ALL_TRADES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button
          variant={filterCritical ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs gap-1"
          onClick={() => setFilterCritical(!filterCritical)}
        >
          <Route className="w-3 h-3" /> Critical Path
        </Button>

        <div className="ml-auto flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground mr-0.5">Overlays:</span>
          {OVERLAY_OPTIONS.map((o) => (
            <Button
              key={o.key}
              variant={overlays.has(o.key) ? "default" : "outline"}
              size="sm"
              className="h-7 text-[10px] gap-1 px-2"
              onClick={() => toggleOverlay(o.key)}
            >
              <o.icon className="w-3 h-3" /> {o.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ===== LEGEND ===== */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="font-medium">Zone Status:</span>
        </div>
        {ALL_STATUSES.map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-[10px]">
            <span className={cn("w-2.5 h-2.5 rounded-full", STATUS_CONFIG[s].dot)} />
            <span className="text-muted-foreground">{s}</span>
          </span>
        ))}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex gap-4">
        {/* Zone Grid */}
        <div className="flex-1 min-w-0">
          <div className={cn(
            "grid gap-4",
            selectedArea ? "grid-cols-2" : "grid-cols-3",
          )}>
            {visibleAreas.map((area) => (
              <AreaCard
                key={area.id}
                area={area}
                isSelected={selectedAreaId === area.id}
                onSelect={() => handleAreaSelect(selectedAreaId === area.id ? null : area.id)}
                overlays={overlays}
                packages={PACKAGES.filter(p => p.area === area.name)}
              />
            ))}
          </div>
          {visibleAreas.length === 0 && (
            <div className="text-center py-16 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
              No areas match the current filters
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedArea && (
          <DetailPanel
            area={selectedArea}
            packages={areaPackages}
            onClose={() => handleAreaSelect(null)}
            ctx={ctx}
          />
        )}
      </div>
    </div>
  );
}
