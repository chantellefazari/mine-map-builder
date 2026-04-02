import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Route, AlertTriangle, Clock, Wrench, Zap, ChevronRight, Target,
  Filter, ArrowRight, Shield, X, TrendingDown, Calendar, User,
  Activity, CheckCircle2, CircleDot,
} from "lucide-react";
import {
  ALL_AREA_OPTIONS, ALL_TRADES, ALL_SHIFTS,
  type ShutdownWorkPackage,
} from "./shutdownData";

/* ------------------------------------------------------------------ */
/*  STYLING                                                            */
/* ------------------------------------------------------------------ */

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Not Started": { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground/50" },
  Complete: { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground/50" },
  Active: { bg: "bg-emerald-500/5", text: "text-emerald-600", border: "border-emerald-500/30", dot: "bg-emerald-500" },
  Ready: { bg: "bg-blue-500/5", text: "text-blue-600", border: "border-blue-500/30", dot: "bg-blue-500" },
  Blocked: { bg: "bg-destructive/5", text: "text-destructive", border: "border-destructive/30", dot: "bg-destructive" },
  Delayed: { bg: "bg-amber-500/5", text: "text-amber-600", border: "border-amber-500/30", dot: "bg-amber-500" },
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ShutdownCriticalPathTab() {
  const { selectedPackageId: selectedId, setSelectedPackageId: setSelectedId, filterArea, setFilterArea, filterTrade, setFilterTrade, filterShift, setFilterShift, navigateToTab, packages } = useOrchestratorContext();
  const [filterSeverity, setFilterSeverity] = useState("All");

  const selected = packages.find((p) => p.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    return packages.filter((p) => {
      if (filterArea !== "All" && p.area !== filterArea) return false;
      if (filterTrade !== "All" && p.trade !== filterTrade) return false;
      if (filterShift !== "All" && p.shift !== filterShift) return false;
      if (filterSeverity === "Delayed" && p.delayHrs === 0) return false;
      if (filterSeverity === "High" && p.delayHrs < 6) return false;
      return true;
    });
  }, [filterArea, filterTrade, filterShift, filterSeverity, packages]);

  const criticalPath = useMemo(() => filtered.filter((p) => !p.nearCritical && p.criticalPath), [filtered]);
  const nearCritical = useMemo(() => filtered.filter((p) => p.nearCritical), [filtered]);
  const criticalDelays = useMemo(() => filtered.filter((p) => p.delayHrs > 0), [filtered]);

  const totalDelayHrs = useMemo(() => Math.max(...criticalDelays.map((d) => d.delayHrs), 0), [criticalDelays]);
  const currentDriver = useMemo(() => {
    const active = criticalPath.filter((p) => p.status === "Active" || p.status === "Blocked" || p.status === "Delayed");
    return active.sort((a, b) => b.delayHrs - a.delayHrs)[0] ?? null;
  }, [criticalPath]);

  const downstreamAffected = useMemo(() => {
    const delayed = new Set(criticalDelays.map((d) => d.id));
    const affected = new Set<string>();
    const visit = (id: string) => {
      const pkg = PACKAGES.find((p) => p.id === id);
      if (!pkg) return;
      pkg.successors.forEach((s) => {
        if (!delayed.has(s) && !affected.has(s)) {
          affected.add(s);
          visit(s);
        }
      });
    };
    delayed.forEach((id) => visit(id));
    return affected;
  }, [criticalDelays]);

  const plannedFinish = "Day 3 06:00";
  const projectedFinish = totalDelayHrs > 0 ? `Day 3 ${String(6 + Math.ceil(totalDelayHrs / 2)).padStart(2, "0")}:00` : plannedFinish;

  return (
    <div className="space-y-4">
      {/* ===== EXECUTIVE SUMMARY ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {[
          { label: "Critical Path Packages", value: criticalPath.length, icon: Route, color: "text-primary" },
          { label: "Near-Critical", value: nearCritical.length, icon: Activity, color: "text-amber-600" },
          { label: "Critical Delays", value: criticalDelays.length, icon: AlertTriangle, color: "text-destructive" },
          { label: "Max Delay Impact", value: `${totalDelayHrs}h`, icon: TrendingDown, color: "text-destructive" },
          { label: "Projected Finish", value: projectedFinish, icon: Calendar, color: totalDelayHrs > 0 ? "text-destructive" : "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-lg bg-card p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <s.icon className={cn("w-3.5 h-3.5", s.color)} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
            <p className={cn("text-xl font-black", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ===== FILTERS ===== */}
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
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Severity</SelectItem>
            <SelectItem value="Delayed">Delayed Only</SelectItem>
            <SelectItem value="High">High Impact (6h+)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0 space-y-5">
          {currentDriver && (
            <div className={cn("border rounded-lg p-4", currentDriver.delayHrs > 0 ? "border-destructive/40 bg-destructive/5" : "border-primary/30 bg-primary/5")}>
              <div className="flex items-center gap-2 mb-2">
                <Target className={cn("w-4 h-4", currentDriver.delayHrs > 0 ? "text-destructive" : "text-primary")} />
                <h3 className={cn("text-xs font-bold uppercase tracking-wider", currentDriver.delayHrs > 0 ? "text-destructive" : "text-primary")}>
                  Current Critical Driver
                </h3>
              </div>
              <button onClick={() => setSelectedId(currentDriver.id)} className="w-full text-left">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-mono font-bold text-foreground">{currentDriver.id}</span>
                      <Badge variant="outline" className={cn("text-[9px]", STATUS_STYLE[currentDriver.status].text, STATUS_STYLE[currentDriver.status].border)}>{currentDriver.status}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{currentDriver.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{currentDriver.area} • {currentDriver.trade} • {currentDriver.supervisor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-lg font-black text-foreground">{currentDriver.pctComplete}%</p>
                    {currentDriver.delayHrs > 0 && <p className="text-xs text-destructive font-semibold">+{currentDriver.delayHrs}h delay</p>}
                  </div>
                </div>
                {currentDriver.delayReason && (
                  <div className="mt-2 rounded border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />{currentDriver.delayReason}
                  </div>
                )}
              </button>
            </div>
          )}

          <Section title="Critical Path" icon={<Route className="w-4 h-4 text-primary" />} count={criticalPath.length} color="primary">
            {criticalPath.map((p) => (
              <PackageRow key={p.id} pkg={p} isSelected={selectedId === p.id} isDownstreamAffected={downstreamAffected.has(p.id)} onClick={() => setSelectedId(p.id)} />
            ))}
          </Section>

          {nearCritical.length > 0 && (
            <Section title="Near-Critical Packages" icon={<Activity className="w-4 h-4 text-amber-600" />} count={nearCritical.length} color="amber">
              {nearCritical.map((p) => (
                <PackageRow key={p.id} pkg={p} isSelected={selectedId === p.id} isDownstreamAffected={false} onClick={() => setSelectedId(p.id)} />
              ))}
            </Section>
          )}

          {criticalDelays.length > 0 && (
            <Section title="Critical Delays" icon={<AlertTriangle className="w-4 h-4 text-destructive" />} count={criticalDelays.length} color="destructive">
              {criticalDelays.map((p) => (
                <div key={p.id} className="border border-destructive/20 rounded-lg p-3 bg-destructive/[0.02]">
                  <button className="w-full text-left" onClick={() => setSelectedId(p.id)}>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono font-bold">{p.id}</span>
                          <Badge variant="outline" className={cn("text-[9px]", STATUS_STYLE[p.status].text, STATUS_STYLE[p.status].border)}>{p.status}</Badge>
                        </div>
                        <p className="text-xs font-medium text-foreground">{p.title}</p>
                        <p className="text-[10px] text-muted-foreground">{p.area} • {p.supervisor}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-black text-destructive">+{p.delayHrs}h</p>
                        <p className="text-[10px] text-muted-foreground">{p.successors.length} downstream</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-destructive mt-1.5"><AlertTriangle className="w-2.5 h-2.5 inline mr-1" />{p.delayReason}</p>
                  </button>
                </div>
              ))}
            </Section>
          )}

          <Section title="Finish Date Risks" icon={<TrendingDown className="w-4 h-4 text-destructive" />} count={criticalDelays.length + downstreamAffected.size} color="destructive">
            <div className="border border-border rounded-lg p-4 bg-card space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md border border-border p-2">
                  <p className="text-[10px] text-muted-foreground">Planned Finish</p>
                  <p className="text-sm font-bold text-foreground">{plannedFinish}</p>
                </div>
                <div className={cn("rounded-md border p-2", totalDelayHrs > 0 ? "border-destructive/30 bg-destructive/5" : "border-emerald-500/30 bg-emerald-500/5")}>
                  <p className="text-[10px] text-muted-foreground">Projected Finish</p>
                  <p className={cn("text-sm font-bold", totalDelayHrs > 0 ? "text-destructive" : "text-emerald-600")}>{projectedFinish}</p>
                </div>
                <div className={cn("rounded-md border p-2", totalDelayHrs > 0 ? "border-destructive/30 bg-destructive/5" : "border-border")}>
                  <p className="text-[10px] text-muted-foreground">Slip</p>
                  <p className={cn("text-sm font-bold", totalDelayHrs > 0 ? "text-destructive" : "text-emerald-600")}>{totalDelayHrs > 0 ? `+${Math.ceil(totalDelayHrs / 2)}h` : "On Track"}</p>
                </div>
              </div>
              {downstreamAffected.size > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Downstream Packages at Risk</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(downstreamAffected).map((id) => {
                      const pkg = PACKAGES.find((p) => p.id === id);
                      return (
                        <button key={id} onClick={() => setSelectedId(id)} className="flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/5 px-2 py-1 text-[10px] font-medium text-amber-600 hover:bg-amber-500/10 transition-colors">
                          <CircleDot className="w-2.5 h-2.5" />
                          {id}{pkg ? ` — ${pkg.title.substring(0, 20)}…` : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* ===== DETAIL PANEL ===== */}
        {selected && (
          <div className="w-96 flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
            <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between", STATUS_STYLE[selected.status].bg)}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-foreground">{selected.id}</span>
                  <Badge variant="outline" className={cn("text-[9px]", STATUS_STYLE[selected.status].text, STATUS_STYLE[selected.status].border)}>{selected.status}</Badge>
                  {selected.criticalPath && !selected.nearCritical && <Badge variant="outline" className="text-[8px] h-3.5 border-destructive text-destructive">Critical Path</Badge>}
                  {selected.nearCritical && <Badge variant="outline" className="text-[8px] h-3.5 border-amber-500 text-amber-600">Near-Critical</Badge>}
                </div>
                <h3 className="text-sm font-semibold text-foreground mt-1">{selected.title}</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedId(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4 max-h-[560px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Area", value: selected.area },
                  { label: "Trade", value: selected.trade },
                  { label: "Planned Start", value: selected.plannedStart },
                  { label: "Planned Finish", value: selected.plannedFinish },
                  { label: "Duration", value: `${selected.durationHrs}h` },
                  { label: "% Complete", value: `${selected.pctComplete}%` },
                  { label: "Shift", value: `${selected.shift} Shift` },
                  { label: "Float", value: `${selected.floatHrs}h` },
                  { label: "Supervisor", value: selected.supervisor },
                  { label: "Delay", value: selected.delayHrs > 0 ? `+${selected.delayHrs}h` : "None" },
                ].map((item) => (
                  <div key={item.label} className="rounded-md border border-border px-2.5 py-1.5">
                    <div className="text-[10px] text-muted-foreground">{item.label}</div>
                    <div className="font-medium text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">{selected.pctComplete}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", STATUS_STYLE[selected.status].dot)} style={{ width: `${selected.pctComplete}%` }} />
                </div>
              </div>
              {selected.delayHrs > 0 && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-destructive">
                    <AlertTriangle className="w-3.5 h-3.5" /> DELAY — +{selected.delayHrs}h
                  </div>
                  <p className="text-xs text-destructive leading-relaxed">{selected.delayReason}</p>
                </div>
              )}
              {selected.successors.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Successor Packages</p>
                  <div className="space-y-1">
                    {selected.successors.map((sId) => {
                      const s = PACKAGES.find((p) => p.id === sId);
                      const isAffected = downstreamAffected.has(sId);
                      return (
                        <button key={sId} onClick={() => setSelectedId(sId)} className={cn("w-full text-left rounded border px-2.5 py-1.5 text-xs flex items-center gap-2 transition-colors hover:bg-muted/30", isAffected ? "border-amber-500/30 bg-amber-500/5" : "border-border")}>
                          <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="font-mono font-semibold">{sId}</span>
                          <span className="text-muted-foreground truncate">{s?.title}</span>
                          {isAffected && <Badge variant="outline" className="text-[8px] h-3.5 ml-auto border-amber-500/30 text-amber-600">At Risk</Badge>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 flex-1" onClick={() => navigateToTab("sequence")}>
                  <ArrowRight className="w-3 h-3" /> View in Sequence Flow
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 flex-1" onClick={() => navigateToTab("control")}>
                  <ArrowRight className="w-3 h-3" /> View in Control Board
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function Section({ title, icon, count, color, children }: { title: string; icon: React.ReactNode; count: number; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-xs font-bold text-foreground">{title}</h3>
        <Badge variant="secondary" className="text-[9px] h-4">{count}</Badge>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function PackageRow({ pkg, isSelected, isDownstreamAffected, onClick }: { pkg: ShutdownWorkPackage; isSelected: boolean; isDownstreamAffected: boolean; onClick: () => void }) {
  const st = STATUS_STYLE[pkg.status];
  return (
    <button onClick={onClick} className={cn("w-full text-left rounded-lg border p-3 transition-all hover:shadow-sm", isSelected ? "border-foreground shadow-sm" : isDownstreamAffected ? "border-amber-500/40 bg-amber-500/[0.03]" : "border-border bg-card")}>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-0.5">
          <span className={cn("w-3 h-3 rounded-full border-2", st.dot, st.border)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono font-bold text-foreground">{pkg.id}</span>
            <Badge variant="outline" className={cn("text-[9px]", st.text, st.border)}>{pkg.status}</Badge>
            {isDownstreamAffected && <Badge variant="outline" className="text-[8px] h-3.5 border-amber-500/30 text-amber-600">Downstream Risk</Badge>}
          </div>
          <p className="text-xs font-medium text-foreground">{pkg.title}</p>
          <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
            <span>{pkg.area}</span>
            <span className="flex items-center gap-0.5">
              {pkg.trade === "Mechanical" ? <Wrench className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5" />}
              {pkg.trade}
            </span>
            <span>{pkg.plannedStart} → {pkg.plannedFinish}</span>
            <span>{pkg.durationHrs}h</span>
            {pkg.floatHrs > 0 && <span className="text-amber-600">Float: {pkg.floatHrs}h</span>}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-foreground">{pkg.pctComplete}%</p>
          {pkg.delayHrs > 0 && <p className="text-xs font-semibold text-destructive">+{pkg.delayHrs}h</p>}
          <p className="text-[10px] text-muted-foreground">{pkg.supervisor}</p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      </div>
      {pkg.delayReason && (
        <div className="mt-2 ml-7 rounded border border-destructive/20 bg-destructive/5 px-2.5 py-1.5 text-[10px] text-destructive">
          <AlertTriangle className="w-2.5 h-2.5 inline mr-1" />{pkg.delayReason}
        </div>
      )}
    </button>
  );
}
