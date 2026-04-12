import { useState, useCallback, useMemo } from "react";
import {
  Users, Settings2, Wrench, Zap, Truck, BarChart3, Copy, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format, startOfWeek, addWeeks, addDays, startOfYear } from "date-fns";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

const WORK_CENTRES = [
  { key: "Mechanical", label: "Mechanical", icon: Wrench, short: "MECH" },
  { key: "Electrical", label: "Electrical", icon: Zap, short: "ELEC" },
  { key: "Mobile & LVS", label: "Mobile & LVS", icon: Truck, short: "MOB" },
] as const;

type WorkCentreKey = typeof WORK_CENTRES[number]["key"];

interface WeekCapacity {
  personnel: number;
  hoursPerDay: number;
  loadingTarget: number;
}

interface WeekInfo {
  index: number;
  weekNum: number;
  label: string; // "W2 — 07 Jan – 13 Jan"
  shortLabel: string; // "W2"
}

const TOTAL_WEEKS = 52;
const DAYS_PER_WEEK = 7;

const DEFAULT_VALUES: Record<string, WeekCapacity> = {
  Mechanical: { personnel: 6, hoursPerDay: 10.5, loadingTarget: 80 },
  Electrical: { personnel: 4, hoursPerDay: 10.5, loadingTarget: 90 },
  "Mobile & LVS": { personnel: 3, hoursPerDay: 10.5, loadingTarget: 80 },
};

function buildWeekInfos(year: number): WeekInfo[] {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const infos: WeekInfo[] = [];
  for (let w = 0; w < TOTAL_WEEKS; w++) {
    const ws = startOfWeek(addWeeks(yearStart, w), { weekStartsOn: 1 });
    const we = addDays(ws, 6);
    const wNum = w + 1;
    infos.push({
      index: w,
      weekNum: wNum,
      label: `W${wNum} — ${format(ws, "dd MMM")} – ${format(we, "dd MMM")}`,
      shortLabel: `W${wNum}`,
    });
  }
  return infos;
}

function buildInitialGrid(): Record<string, WeekCapacity[]> {
  const grid: Record<string, WeekCapacity[]> = {};
  for (const wc of WORK_CENTRES) {
    grid[wc.key] = Array.from({ length: TOTAL_WEEKS }, () => ({ ...DEFAULT_VALUES[wc.key] }));
  }
  return grid;
}

const WEEKS_PER_PAGE = 13; // revision view

export function PlannerCapacityTab({ items }: Props) {
  const [grid, setGrid] = useState<Record<string, WeekCapacity[]>>(buildInitialGrid);
  const [page, setPage] = useState(0);
  const [selectedWC, setSelectedWC] = useState<WorkCentreKey>("Mechanical");
  const [year] = useState(() => new Date().getFullYear());

  // Defaults editor
  const [defaults, setDefaults] = useState<Record<string, WeekCapacity>>(() =>
    JSON.parse(JSON.stringify(DEFAULT_VALUES))
  );

  const weekInfos = useMemo(() => buildWeekInfos(year), [year]);

  const pageStart = page * WEEKS_PER_PAGE;
  const pageEnd = Math.min(pageStart + WEEKS_PER_PAGE, TOTAL_WEEKS);
  const visibleWeeks = Array.from({ length: pageEnd - pageStart }, (_, i) => pageStart + i);
  const totalPages = Math.ceil(TOTAL_WEEKS / WEEKS_PER_PAGE);
  const revFirstWeek = weekInfos[pageStart];
  const revLastWeek = weekInfos[pageEnd - 1];
  const revLabel = `Rev ${page + 1} — ${revFirstWeek?.label.split(" — ")[1]?.split(" – ")[0] || ""} to ${revLastWeek?.label.split(" – ")[1] || ""}`;

  const updateCell = useCallback((wc: string, weekIdx: number, field: keyof WeekCapacity, val: number) => {
    setGrid(prev => {
      const next = { ...prev };
      const arr = [...next[wc]];
      arr[weekIdx] = { ...arr[weekIdx], [field]: val };
      next[wc] = arr;
      return next;
    });
  }, []);

  const applyDefaultsToAll = useCallback((wc: string) => {
    setGrid(prev => {
      const next = { ...prev };
      next[wc] = Array.from({ length: TOTAL_WEEKS }, () => ({ ...defaults[wc] }));
      return next;
    });
  }, [defaults]);

  const applyDefaultsToQuarter = useCallback((wc: string) => {
    setGrid(prev => {
      const next = { ...prev };
      const arr = [...next[wc]];
      for (let i = pageStart; i < pageEnd; i++) {
        arr[i] = { ...defaults[wc] };
      }
      next[wc] = arr;
      return next;
    });
  }, [defaults, pageStart, pageEnd]);

  const getWeekAvail = (cap: WeekCapacity) =>
    cap.personnel * cap.hoursPerDay * DAYS_PER_WEEK * (cap.loadingTarget / 100);

  // Summary for selected WC
  const wcSummary = useMemo(() => {
    const weeks = grid[selectedWC];
    const totalAvail = weeks.reduce((s, w) => s + getWeekAvail(w), 0);
    const totalCap = weeks.reduce((s, w) => s + w.personnel * w.hoursPerDay * DAYS_PER_WEEK, 0);
    const avgPersonnel = weeks.reduce((s, w) => s + w.personnel, 0) / TOTAL_WEEKS;
    return { totalAvail, totalCap, avgPersonnel };
  }, [grid, selectedWC]);

  const wcInfo = WORK_CENTRES.find(w => w.key === selectedWC)!;
  const WCIcon = wcInfo.icon;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center gap-3">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Weekly Capacity Loading</span>
        </div>
        <div className="flex items-center gap-1">
          {WORK_CENTRES.map(wc => (
            <Button
              key={wc.key}
              size="sm"
              variant={selectedWC === wc.key ? "default" : "ghost"}
              className="h-7 text-[10px] gap-1"
              onClick={() => setSelectedWC(wc.key)}
            >
              <wc.icon className="w-3 h-3" />
              {wc.short}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Defaults row */}
          <div className="border border-border rounded-lg p-3 bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <WCIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold text-foreground">{wcInfo.label} — Default Template</span>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-6 text-[9px] gap-1" onClick={() => applyDefaultsToQuarter(selectedWC)}>
                  <Copy className="w-3 h-3" /> Apply to Rev {page + 1}
                </Button>
                <Button size="sm" variant="outline" className="h-6 text-[9px] gap-1" onClick={() => applyDefaultsToAll(selectedWC)}>
                  <Copy className="w-3 h-3" /> Apply to All 52 Weeks
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] text-muted-foreground font-medium">Personnel / Day</label>
                <Input
                  type="number" min={0}
                  value={defaults[selectedWC].personnel}
                  onChange={e => setDefaults(p => ({ ...p, [selectedWC]: { ...p[selectedWC], personnel: Math.max(0, Number(e.target.value)) } }))}
                  className="h-7 text-xs mt-0.5"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground font-medium">Hours / Person / Day</label>
                <Input
                  type="number" min={0} step="0.5"
                  value={defaults[selectedWC].hoursPerDay}
                  onChange={e => setDefaults(p => ({ ...p, [selectedWC]: { ...p[selectedWC], hoursPerDay: Math.max(0, Number(e.target.value)) } }))}
                  className="h-7 text-xs mt-0.5"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground font-medium">Loading Target %</label>
                <Input
                  type="number" min={0} max={100}
                  value={defaults[selectedWC].loadingTarget}
                  onChange={e => setDefaults(p => ({ ...p, [selectedWC]: { ...p[selectedWC], loadingTarget: Math.min(100, Math.max(0, Number(e.target.value))) } }))}
                  className="h-7 text-xs mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Button size="sm" variant="ghost" className="h-7 text-[10px]" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
            </Button>
            <span className="text-xs font-semibold text-foreground">{revLabel}</span>
            <Button size="sm" variant="ghost" className="h-7 text-[10px]" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* Weekly spreadsheet */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="text-left px-2 py-1.5 font-semibold sticky left-0 bg-muted/30 z-10 min-w-[80px]">Field</th>
                    {visibleWeeks.map(w => (
                      <th key={w} className="text-center px-1 py-1.5 font-semibold min-w-[60px]">W{w + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Personnel row */}
                  <tr className="border-b border-border/30">
                    <td className="px-2 py-1 font-medium text-foreground sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-1"><Users className="w-3 h-3 text-muted-foreground" /> Personnel</div>
                    </td>
                    {visibleWeeks.map(w => (
                      <td key={w} className="px-0.5 py-0.5">
                        <Input
                          type="number" min={0}
                          value={grid[selectedWC][w].personnel}
                          onChange={e => updateCell(selectedWC, w, "personnel", Math.max(0, Number(e.target.value)))}
                          className="h-6 text-[10px] text-center px-1 tabular-nums"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* Hours row */}
                  <tr className="border-b border-border/30">
                    <td className="px-2 py-1 font-medium text-foreground sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-1"><Settings2 className="w-3 h-3 text-muted-foreground" /> Hrs/Day</div>
                    </td>
                    {visibleWeeks.map(w => (
                      <td key={w} className="px-0.5 py-0.5">
                        <Input
                          type="number" min={0} step="0.5"
                          value={grid[selectedWC][w].hoursPerDay}
                          onChange={e => updateCell(selectedWC, w, "hoursPerDay", Math.max(0, Number(e.target.value)))}
                          className="h-6 text-[10px] text-center px-1 tabular-nums"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* Loading % row */}
                  <tr className="border-b border-border/30">
                    <td className="px-2 py-1 font-medium text-foreground sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-muted-foreground" /> Loading %</div>
                    </td>
                    {visibleWeeks.map(w => (
                      <td key={w} className="px-0.5 py-0.5">
                        <Input
                          type="number" min={0} max={100}
                          value={grid[selectedWC][w].loadingTarget}
                          onChange={e => updateCell(selectedWC, w, "loadingTarget", Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="h-6 text-[10px] text-center px-1 tabular-nums"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* Calculated: Weekly Available */}
                  <tr className="bg-muted/10 border-b border-border/30">
                    <td className="px-2 py-1.5 font-semibold text-primary sticky left-0 bg-muted/10 z-10">
                      Avail Hrs
                    </td>
                    {visibleWeeks.map(w => {
                      const cap = grid[selectedWC][w];
                      const avail = getWeekAvail(cap);
                      return (
                        <td key={w} className="text-center px-1 py-1.5 tabular-nums font-semibold text-primary">
                          {avail.toFixed(0)}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Calculated: Weekly Total */}
                  <tr className="bg-muted/5">
                    <td className="px-2 py-1.5 font-medium text-muted-foreground sticky left-0 bg-muted/5 z-10">
                      Total Hrs
                    </td>
                    {visibleWeeks.map(w => {
                      const cap = grid[selectedWC][w];
                      const total = cap.personnel * cap.hoursPerDay * DAYS_PER_WEEK;
                      return (
                        <td key={w} className="text-center px-1 py-1.5 tabular-nums text-muted-foreground">
                          {total.toFixed(0)}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Annual summary cards */}
          <div className="border border-border rounded-lg p-3 bg-muted/20">
            <div className="text-xs font-bold text-foreground mb-2">{wcInfo.label} — Annual Summary</div>
            <div className="grid grid-cols-3 gap-3">
              <SummaryCard label="Avg Personnel" value={wcSummary.avgPersonnel.toFixed(1)} icon={Users} />
              <SummaryCard label="Annual Total Hrs" value={`${wcSummary.totalCap.toFixed(0)}h`} icon={BarChart3} />
              <SummaryCard label="Annual Available" value={`${wcSummary.totalAvail.toFixed(0)}h`} icon={Settings2} color="text-primary" />
            </div>
          </div>

          {/* All work centres comparison */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-muted/30 border-b border-border">
              <span className="text-xs font-bold text-foreground">All Work Centres — Annual Totals</span>
            </div>
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-muted/20 border-b border-border">
                  <th className="text-left px-3 py-1.5 font-semibold">Work Centre</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Annual Cap</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Annual Avail</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Avg Loading</th>
                </tr>
              </thead>
              <tbody>
                {WORK_CENTRES.map(wc => {
                  const weeks = grid[wc.key];
                  const annCap = weeks.reduce((s, w) => s + w.personnel * w.hoursPerDay * DAYS_PER_WEEK, 0);
                  const annAvail = weeks.reduce((s, w) => s + getWeekAvail(w), 0);
                  const avgLoading = weeks.reduce((s, w) => s + w.loadingTarget, 0) / TOTAL_WEEKS;
                  return (
                    <tr key={wc.key} className="border-b border-border/30 hover:bg-muted/10">
                      <td className="px-3 py-1.5 font-medium text-foreground">
                        <div className="flex items-center gap-1.5">
                          <wc.icon className="w-3 h-3 text-muted-foreground" />
                          {wc.label}
                        </div>
                      </td>
                      <td className="text-center px-2 py-1.5 tabular-nums">{annCap.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 tabular-nums text-primary font-semibold">{annAvail.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 tabular-nums">{avgLoading.toFixed(0)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2">
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className={cn("w-3.5 h-3.5", color || "text-muted-foreground")} />
        <span className="text-[9px] text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold text-foreground tabular-nums">{value}</span>
    </div>
  );
}
