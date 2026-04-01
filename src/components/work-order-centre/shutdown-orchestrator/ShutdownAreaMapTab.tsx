import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  X, Route, Clock, AlertTriangle, Lock, Shield, Wrench, Zap,
  ChevronRight, Activity, CheckCircle2, Package, MapPin, Eye,
  Target, Filter, Layers, Calendar,
} from "lucide-react";
import {
  PACKAGES, buildAreaZones, ALL_AREA_OPTIONS,
  type AreaZone, type ShutdownWorkPackage,
} from "./shutdownData";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type AreaStatus = "Not Started" | "Ready" | "Active" | "At Risk" | "Delayed" | "Complete";
type WPStatus = "Ready" | "Active" | "Blocked" | "Delayed" | "Complete";
type Overlay = "critical-path" | "delays" | "isolations" | "access" | "trade" | "progress";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const AREAS = buildAreaZones(PACKAGES);

/* ------------------------------------------------------------------ */
/*  STATUS COLOURS                                                     */
/* ------------------------------------------------------------------ */

const STATUS_FILL: Record<AreaStatus, string> = {
  "Not Started": "fill-muted-foreground/15 stroke-muted-foreground/40",
  Ready: "fill-blue-500/15 stroke-blue-500/60",
  Active: "fill-emerald-500/15 stroke-emerald-500/60",
  "At Risk": "fill-amber-500/15 stroke-amber-500/60",
  Delayed: "fill-destructive/15 stroke-destructive/60",
  Complete: "fill-emerald-700/20 stroke-emerald-700/60",
};

const STATUS_BG: Record<AreaStatus, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  Ready: "bg-blue-500/10 text-blue-600",
  Active: "bg-emerald-500/10 text-emerald-600",
  "At Risk": "bg-amber-500/10 text-amber-600",
  Delayed: "bg-destructive/10 text-destructive",
  Complete: "bg-emerald-700/10 text-emerald-700",
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
/*  COMPONENT                                                          */
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

  const visibleIds = new Set(visibleAreas.map((a) => a.id));

  return (
    <div className="space-y-4">
      {/* ===== FILTERS BAR ===== */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder="Area" /></SelectTrigger>
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

        <div className="ml-auto flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground mr-1">Overlays:</span>
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

      {/* ===== MAIN CONTENT: MAP + DETAIL PANEL ===== */}
      <div className="flex gap-4">
        {/* MAP PANEL */}
        <div className={cn("flex-1 min-w-0 border border-border rounded-lg bg-card p-4", selectedArea && "xl:mr-0")}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Plant Shutdown Zone Map</h3>
            <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
              {(["Not Started", "Ready", "Active", "At Risk", "Delayed", "Complete"] as AreaStatus[]).map((s) => (
                <span key={s} className="flex items-center gap-1">
                  <span className={cn("w-2.5 h-2.5 rounded-sm border", STATUS_BG[s])} />
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* SVG Zone Map */}
          <svg viewBox="0 0 100 70" className="w-full" style={{ maxHeight: 520 }}>
            <rect x="0" y="0" width="100" height="70" className="fill-muted/30" rx="1" />

            {AREAS.map((area) => {
              const visible = visibleIds.has(area.id);
              const isSelected = selectedAreaId === area.id;
              const isCriticalOverlay = overlays.has("critical-path") && area.criticalPath > 0;
              const isDelayOverlay = overlays.has("delays") && (area.status === "Delayed" || area.delayed > 0);
              const isIsoOverlay = overlays.has("isolations") && area.isolationStatus !== "All Clear" && area.isolationStatus !== "N/A";
              const isAccessOverlay = overlays.has("access") && area.accessConstraints !== "None";

              return (
                <g
                  key={area.id}
                  className={cn("cursor-pointer transition-opacity", !visible && "opacity-20")}
                  onClick={() => visible && handleAreaSelect(isSelected ? null : area.id)}
                >
                  <rect
                    x={area.x} y={area.y} width={area.w} height={area.h}
                    rx="0.8"
                    className={cn(
                      STATUS_FILL[area.status as AreaStatus],
                      "stroke-[0.4] transition-all",
                      isSelected && "stroke-[0.8] stroke-foreground"
                    )}
                  />

                  {overlays.has("progress") && (
                    <rect
                      x={area.x + 0.5}
                      y={area.y + area.h - 2.5}
                      width={(area.w - 1) * (area.pctComplete / 100)}
                      height="1.5"
                      rx="0.5"
                      className="fill-foreground/20"
                    />
                  )}

                  <text x={area.x + area.w / 2} y={area.y + 5} textAnchor="middle" className="fill-foreground text-[2.6px] font-semibold">
                    {area.name}
                  </text>
                  <text x={area.x + area.w / 2} y={area.y + 8.5} textAnchor="middle" className="fill-muted-foreground text-[2px]">
                    {area.status} — {area.pctComplete}%
                  </text>
                  <text x={area.x + area.w / 2} y={area.y + 12} textAnchor="middle" className="fill-muted-foreground text-[1.8px]">
                    {area.total} packages • {area.active} active
                  </text>

                  {isCriticalOverlay && (
                    <g>
                      <rect x={area.x + 1} y={area.y + area.h - 6} width="6" height="2.5" rx="0.5" className="fill-destructive/80" />
                      <text x={area.x + 4} y={area.y + area.h - 4.2} textAnchor="middle" className="fill-white text-[1.5px] font-bold">CP: {area.criticalPath}</text>
                    </g>
                  )}
                  {isDelayOverlay && (
                    <g>
                      <rect x={area.x + area.w - 8} y={area.y + area.h - 6} width="7" height="2.5" rx="0.5" className="fill-amber-500/80" />
                      <text x={area.x + area.w - 4.5} y={area.y + area.h - 4.2} textAnchor="middle" className="fill-white text-[1.5px] font-bold">DELAY</text>
                    </g>
                  )}
                  {isIsoOverlay && (
                    <g>
                      <rect x={area.x + 1} y={area.y + 15} width="7" height="2.5" rx="0.5" className="fill-purple-500/70" />
                      <text x={area.x + 4.5} y={area.y + 16.8} textAnchor="middle" className="fill-white text-[1.5px] font-bold">ISO</text>
                    </g>
                  )}
                  {isAccessOverlay && (
                    <g>
                      <rect x={area.x + area.w - 9} y={area.y + 15} width="8" height="2.5" rx="0.5" className="fill-orange-500/70" />
                      <text x={area.x + area.w - 5} y={area.y + 16.8} textAnchor="middle" className="fill-white text-[1.5px] font-bold">ACCESS</text>
                    </g>
                  )}

                  {overlays.has("trade") && (
                    <g>
                      {PACKAGES.filter((p) => p.area === area.name && p.trade === "Mechanical").length > 0 && (
                        <>
                          <circle cx={area.x + 3} cy={area.y + area.h - 9} r="1.2" className="fill-blue-500/60" />
                          <text x={area.x + 5.5} y={area.y + area.h - 8.2} className="fill-muted-foreground text-[1.5px]">
                            M: {PACKAGES.filter((p) => p.area === area.name && p.trade === "Mechanical").length}
                          </text>
                        </>
                      )}
                      {PACKAGES.filter((p) => p.area === area.name && p.trade === "Electrical").length > 0 && (
                        <>
                          <circle cx={area.x + area.w / 2 + 2} cy={area.y + area.h - 9} r="1.2" className="fill-amber-500/60" />
                          <text x={area.x + area.w / 2 + 4.5} y={area.y + area.h - 8.2} className="fill-muted-foreground text-[1.5px]">
                            E: {PACKAGES.filter((p) => p.area === area.name && p.trade === "Electrical").length}
                          </text>
                        </>
                      )}
                    </g>
                  )}

                  {area.blocked > 0 && (
                    <g>
                      <circle cx={area.x + area.w - 3} cy={area.y + 3} r="1.8" className="fill-destructive/80" />
                      <text x={area.x + area.w - 3} y={area.y + 3.6} textAnchor="middle" className="fill-white text-[1.8px] font-bold">{area.blocked}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* ===== DETAIL PANEL ===== */}
        {selectedArea && (
          <div className="w-96 flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
            <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between", STATUS_BG[selectedArea.status as AreaStatus])}>
              <div>
                <h3 className="text-sm font-bold">{selectedArea.name}</h3>
                <p className="text-[10px] opacity-80">{selectedArea.status} — {selectedArea.pctComplete}% complete</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAreaSelect(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Total", value: selectedArea.total, color: "text-foreground" },
                  { label: "Active", value: selectedArea.active, color: "text-emerald-600" },
                  { label: "Blocked", value: selectedArea.blocked, color: "text-destructive" },
                  { label: "Delayed", value: selectedArea.delayed, color: "text-amber-600" },
                  { label: "Complete", value: selectedArea.complete, color: "text-emerald-700" },
                  { label: "Critical Path", value: selectedArea.criticalPath, color: "text-destructive" },
                ].map((s) => (
                  <div key={s.label} className="rounded-md border border-border px-2.5 py-1.5 text-center">
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    <div className={cn("text-lg font-bold", s.color)}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">{selectedArea.pctComplete}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${selectedArea.pctComplete}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Isolation:</span>
                  <span className={cn("font-medium", selectedArea.isolationStatus === "All Clear" ? "text-emerald-600" : "text-amber-600")}>
                    {selectedArea.isolationStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Access:</span>
                  <span className={cn("font-medium", selectedArea.accessConstraints === "None" ? "text-emerald-600" : "text-amber-600")}>
                    {selectedArea.accessConstraints}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Supervisor:</span>
                  <span className="font-medium text-foreground">{selectedArea.supervisor}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">Work Packages ({areaPackages.length})</span>
                </div>
                <div className="space-y-1.5">
                  {areaPackages.map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => { ctx.setSelectedPackageId(wp.id); ctx.navigateToTab("sequence"); }}
                      className={cn(
                        "w-full text-left rounded-md border p-2.5 transition-colors hover:shadow-sm",
                        WP_STATUS_STYLE[wp.status] || "border-border"
                      )}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-mono font-semibold">{wp.id}</span>
                        <div className="flex items-center gap-1">
                          {wp.criticalPath && (
                            <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-destructive text-destructive">CP</Badge>
                          )}
                          <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-current">{wp.status}</Badge>
                        </div>
                      </div>
                      <p className="text-[11px] font-medium leading-snug mb-1">{wp.title}</p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1 opacity-80">
                          {wp.trade === "Mechanical" ? <Wrench className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5" />}
                          {wp.trade}
                        </span>
                        <span className="font-medium">{wp.pctComplete}%</span>
                      </div>
                      {wp.delayReason && (
                        <p className="text-[10px] mt-1 opacity-70 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" /> {wp.delayReason}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-1 text-[9px] opacity-50">
                        <ChevronRight className="w-2.5 h-2.5" /> View in Sequence Flow
                      </div>
                    </button>
                  ))}
                  {areaPackages.length === 0 && (
                    <div className="text-center py-6 text-xs text-muted-foreground">No work packages in this area</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
