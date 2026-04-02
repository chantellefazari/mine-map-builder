import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Filter, Route, AlertTriangle, Wrench, Zap, Clock, Lock,
  CheckCircle2, Activity, Package, ChevronRight, Target, Eye,
  LayoutList, Columns3, Calendar, Shield, User, ArrowRight,
  Printer, PlayCircle, X, GitBranch, Pencil, Save,
} from "lucide-react";
import {
  ALL_AREA_OPTIONS, ALL_TRADES, ALL_SHIFTS, STATUS_ORDER, AREA_LABELS,
  type ShutdownWorkPackage, type WPStatus,
} from "./shutdownData";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type ViewMode = "table" | "kanban";
type GroupBy = "status" | "area" | "supervisor" | "shift";

/* ------------------------------------------------------------------ */
/*  STYLING                                                            */
/* ------------------------------------------------------------------ */

const DISPLAY_ORDER: WPStatus[] = ["Blocked", "Delayed", "Active", "Ready", "Not Started", "Complete"];

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Not Started": { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground/50" },
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

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ShutdownControlBoardTab() {
  const { selectedPackageId: selectedId, setSelectedPackageId: setSelectedId, filterArea, setFilterArea, filterTrade, setFilterTrade, filterShift, setFilterShift, showCriticalOnly: filterCritical, setShowCriticalOnly: setFilterCritical, navigateToTab, packages, updatePackage } = useOrchestratorContext();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [groupBy, setGroupBy] = useState<GroupBy>("status");
  const [filterDelayed, setFilterDelayed] = useState(false);

  const selected = packages.find((p) => p.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    return packages.filter((p) => {
      if (filterArea !== "All" && p.area !== filterArea) return false;
      if (filterTrade !== "All" && p.trade !== filterTrade) return false;
      if (filterShift !== "All" && p.shift !== filterShift) return false;
      if (filterCritical && !p.criticalPath) return false;
      if (filterDelayed && p.status !== "Delayed" && p.status !== "Blocked") return false;
      return true;
    });
  }, [filterArea, filterTrade, filterShift, filterCritical, filterDelayed, packages]);

  const priorityPackages = useMemo(() => filtered.filter((p) => p.priority), [filtered]);

  const grouped = useMemo(() => {
    const map = new Map<string, ShutdownWorkPackage[]>();
    for (const p of filtered) {
      const key = groupBy === "status" ? p.status : groupBy === "area" ? p.area : groupBy === "supervisor" ? p.supervisor : p.shift;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    if (groupBy === "status") {
      const ordered = new Map<string, ShutdownWorkPackage[]>();
      for (const s of DISPLAY_ORDER) {
        if (map.has(s)) ordered.set(s, map.get(s)!);
      }
      return ordered;
    }
    return map;
  }, [filtered, groupBy]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of DISPLAY_ORDER) c[s] = 0;
    for (const p of filtered) c[p.status] = (c[p.status] || 0) + 1;
    return c;
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* ===== STATUS SUMMARY BAR ===== */}
      <div className="flex items-center gap-2 flex-wrap">
        {DISPLAY_ORDER.map((s) => {
          const st = STATUS_STYLE[s];
          return (
            <div key={s} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", st.border, st.bg)}>
              <span className={cn("w-2.5 h-2.5 rounded-full", st.dot)} />
              <span className={cn("text-xs font-semibold", st.text)}>{s}</span>
              <span className={cn("text-lg font-bold", st.text)}>{counts[s] || 0}</span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Package className="w-3.5 h-3.5" />
          Total: <span className="font-bold text-foreground">{filtered.length}</span>
        </div>
      </div>

      {/* ===== FILTERS & CONTROLS ===== */}
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
            <div className="space-y-4">
              {Array.from(grouped.entries()).map(([group, items]) => {
                const st = STATUS_STYLE[group] || STATUS_STYLE.Ready;
                return (
                  <div key={group} className="border border-border rounded-lg bg-card overflow-hidden">
                    <div className={cn("px-4 py-2 border-b border-border flex items-center gap-2", groupBy === "status" ? st.bg : "bg-muted/30")}>
                      {groupBy === "status" && <span className={cn("w-2.5 h-2.5 rounded-full", st.dot)} />}
                      <span className="text-xs font-bold text-foreground">{group}</span>
                      <Badge variant="secondary" className="text-[9px] h-4">{items.length}</Badge>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          <th className="text-left px-3 py-1.5 font-semibold w-24">WP ID</th>
                          <th className="text-left px-3 py-1.5 font-semibold">Title</th>
                          <th className="text-left px-3 py-1.5 font-semibold w-36">Area</th>
                          <th className="text-left px-3 py-1.5 font-semibold w-20">Trade</th>
                          <th className="text-center px-3 py-1.5 font-semibold w-14">%</th>
                          <th className="text-left px-3 py-1.5 font-semibold w-24">Status</th>
                          <th className="text-left px-3 py-1.5 font-semibold">Next Action / Blocker</th>
                          <th className="text-left px-3 py-1.5 font-semibold w-24">Owner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((p) => {
                          const pst = STATUS_STYLE[p.status];
                          return (
                            <tr key={p.id} className={cn("border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/20 transition-colors", selectedId === p.id && "bg-primary/5", (p.status === "Blocked" || p.status === "Delayed") && "bg-destructive/[0.02]")} onClick={() => setSelectedId(p.id)}>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-1.5">
                                  <span className={cn("w-2 h-2 rounded-full flex-shrink-0", pst.dot)} />
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
                                <Badge variant="outline" className={cn("text-[9px]", pst.text, pst.border)}>{p.status}</Badge>
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
                );
              })}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {DISPLAY_ORDER.map((status) => {
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
                        <button key={p.id} onClick={() => setSelectedId(p.id)} className={cn("w-full text-left rounded-md border p-2.5 transition-all hover:shadow-sm bg-card", selectedId === p.id ? "border-foreground shadow-sm" : "border-border")}>
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
          <EditableDetailPanel
            selected={selected}
            onClose={() => setSelectedId(null)}
            onUpdate={updatePackage}
            onNavigate={navigateToTab}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EDITABLE DETAIL PANEL                                              */
/* ------------------------------------------------------------------ */

const ALL_STATUSES: WPStatus[] = ["Not Started", "Ready", "Active", "Blocked", "Delayed", "Complete"];

function EditableDetailPanel({
  selected,
  onClose,
  onUpdate,
  onNavigate,
}: {
  selected: ShutdownWorkPackage;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ShutdownWorkPackage>) => void;
  onNavigate: (tab: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<ShutdownWorkPackage>>({});

  const startEditing = () => {
    setIsEditing(true);
    setDraft({
      status: selected.status,
      pctComplete: selected.pctComplete,
      nextAction: selected.nextAction,
      supervisor: selected.supervisor,
      shift: selected.shift,
      trade: selected.trade,
      area: selected.area,
      blockerType: selected.blockerType,
      blockerDescription: selected.blockerDescription,
      blockerOwner: selected.blockerOwner,
      blockerETA: selected.blockerETA,
      delayReason: selected.delayReason,
      handoverNotes: selected.handoverNotes,
      criticalPath: selected.criticalPath,
    });
  };

  const saveChanges = () => {
    onUpdate(selected.id, draft);
    setIsEditing(false);
    setDraft({});
    toast.success(`${selected.id} updated — synced across all tabs`);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraft({});
  };

  const st = STATUS_STYLE[(draft.status ?? selected.status) as string] ?? STATUS_STYLE.Ready;

  return (
    <div className="w-[420px] flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
      <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between", st.bg)}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-foreground">{selected.id}</span>
            {(draft.criticalPath ?? selected.criticalPath) && <Badge variant="outline" className="text-[8px] h-3.5 border-destructive text-destructive">Critical Path</Badge>}
            <Badge variant="outline" className={cn("text-[9px] h-4", st.text, st.border)}>{draft.status ?? selected.status}</Badge>
          </div>
          <h3 className="text-sm font-semibold text-foreground mt-1">{selected.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {!isEditing ? (
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={startEditing} title="Edit">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <>
              <Button variant="default" size="icon" className="h-7 w-7" onClick={saveChanges} title="Save">
                <Save className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEditing} title="Cancel">
                <X className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
          {!isEditing && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* ── Status & Progress (always editable inline) ── */}
        {isEditing ? (
          <>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border border-border px-2.5 py-1.5">
                <div className="text-[10px] text-muted-foreground mb-1">Status</div>
                <Select value={draft.status ?? selected.status} onValueChange={(v: WPStatus) => setDraft(d => ({ ...d, status: v }))}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{ALL_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="rounded-md border border-border px-2.5 py-1.5">
                <div className="text-[10px] text-muted-foreground mb-1">Trade</div>
                <Select value={draft.trade ?? selected.trade} onValueChange={(v) => setDraft(d => ({ ...d, trade: v }))}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Mechanical", "Electrical", "Instrumentation"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md border border-border px-2.5 py-1.5">
                <div className="text-[10px] text-muted-foreground mb-1">Area</div>
                <Select value={draft.area ?? selected.area} onValueChange={(v) => setDraft(d => ({ ...d, area: v }))}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{AREA_LABELS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="rounded-md border border-border px-2.5 py-1.5">
                <div className="text-[10px] text-muted-foreground mb-1">Shift</div>
                <Select value={draft.shift ?? selected.shift} onValueChange={(v) => setDraft(d => ({ ...d, shift: v }))}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Day", "Night"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md border border-border px-2.5 py-1.5">
                <div className="text-[10px] text-muted-foreground mb-1">Supervisor</div>
                <Input className="h-7 text-xs" value={draft.supervisor ?? ""} onChange={e => setDraft(d => ({ ...d, supervisor: e.target.value }))} />
              </div>
              <div className="rounded-md border border-border px-2.5 py-1.5 flex items-center gap-2">
                <div className="text-[10px] text-muted-foreground">Critical Path</div>
                <button
                  onClick={() => setDraft(d => ({ ...d, criticalPath: !(d.criticalPath ?? selected.criticalPath) }))}
                  className={cn("w-8 h-5 rounded-full transition-colors flex items-center px-0.5", (draft.criticalPath ?? selected.criticalPath) ? "bg-destructive justify-end" : "bg-muted justify-start")}
                >
                  <span className="w-4 h-4 rounded-full bg-background shadow-sm" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] mb-1.5">
                <span className="text-muted-foreground">% Complete</span>
                <span className="font-bold text-foreground">{draft.pctComplete ?? selected.pctComplete}%</span>
              </div>
              <Slider
                value={[draft.pctComplete ?? selected.pctComplete]}
                onValueChange={([v]) => setDraft(d => ({ ...d, pctComplete: v }))}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground mb-1">Next Action</div>
              <Input className="h-7 text-xs" value={draft.nextAction ?? ""} onChange={e => setDraft(d => ({ ...d, nextAction: e.target.value }))} />
            </div>

            {/* Blocker fields */}
            <div className="rounded-md border border-border p-2.5 space-y-2">
              <div className="text-[10px] font-semibold text-muted-foreground">Blocker Details</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[9px] text-muted-foreground mb-0.5">Blocker Type</div>
                  <Select value={draft.blockerType ?? selected.blockerType ?? ""} onValueChange={(v) => setDraft(d => ({ ...d, blockerType: v }))}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {["Isolation", "Crane", "Scaffold", "Parts", "Permit", "Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-[9px] text-muted-foreground mb-0.5">Blocker Owner</div>
                  <Input className="h-7 text-xs" value={draft.blockerOwner ?? ""} onChange={e => setDraft(d => ({ ...d, blockerOwner: e.target.value }))} />
                </div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground mb-0.5">Blocker Description</div>
                <Input className="h-7 text-xs" value={draft.blockerDescription ?? ""} onChange={e => setDraft(d => ({ ...d, blockerDescription: e.target.value }))} />
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground mb-0.5">Expected Resolution</div>
                <Input className="h-7 text-xs" value={draft.blockerETA ?? ""} onChange={e => setDraft(d => ({ ...d, blockerETA: e.target.value }))} />
              </div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground mb-1">Handover Notes</div>
              <Input className="h-7 text-xs" value={draft.handoverNotes ?? ""} onChange={e => setDraft(d => ({ ...d, handoverNotes: e.target.value }))} />
            </div>
          </>
        ) : (
          <>
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

            <div>
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-foreground">{selected.pctComplete}%</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", STATUS_STYLE[selected.status].dot)} style={{ width: `${selected.pctComplete}%` }} />
              </div>
            </div>

            <div className="rounded-md border border-blue-500/30 bg-blue-500/5 p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 mb-0.5">
                <ArrowRight className="w-3 h-3" /> Next Action
              </div>
              <p className="text-xs text-blue-600">{selected.nextAction}</p>
            </div>

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

            {selected.delayReason && !selected.blockerDescription && (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 mb-0.5">
                  <Clock className="w-3 h-3" /> Delay Reason
                </div>
                <p className="text-xs text-amber-600">{selected.delayReason}</p>
              </div>
            )}

            {selected.handoverNotes && (
              <div className="rounded-md border border-border bg-muted/30 p-2.5">
                <div className="text-[10px] font-semibold text-muted-foreground mb-0.5">Handover Notes</div>
                <p className="text-xs text-foreground">{selected.handoverNotes}</p>
              </div>
            )}
          </>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 flex-1" onClick={() => onNavigate("sequence")}>
            <GitBranch className="w-3 h-3" /> View in Sequence Flow
          </Button>
          {selected.criticalPath && (
            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 flex-1" onClick={() => onNavigate("critical-path")}>
              <Route className="w-3 h-3" /> View in Critical Path
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
