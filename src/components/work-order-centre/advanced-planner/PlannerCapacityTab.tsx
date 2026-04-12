import { useState, useCallback, useMemo } from "react";
import {
  Users, Settings2, Wrench, Zap, Truck, BarChart3, Copy, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { PlannerItem } from "./AdvancedPlannerView";
import {
  useCapacityGrid,
  WORK_CENTRES,
  DEFAULT_CAPACITY,
  buildWeekInfos,
  type WorkCentreKey,
  type WeekCapacity,
} from "@/hooks/useCapacityGrid";

interface Props {
  items: PlannerItem[];
}

const TOTAL_WEEKS = 52;
const DAYS_PER_WEEK = 7;
const WEEKS_PER_PAGE = 13;

const WC_ICONS: Record<string, React.ElementType> = {
  Mechanical: Wrench,
  Electrical: Zap,
  "Mobile & LVS": Truck,
};

export function PlannerCapacityTab({ items }: Props) {
  const { grid, updateCell, applyToAll, applyToRange, year } = useCapacityGrid();
  const [page, setPage] = useState(0);
  const [selectedWC, setSelectedWC] = useState<WorkCentreKey>("Mechanical");

  const [defaults, setDefaults] = useState<Record<string, WeekCapacity>>(() =>
    JSON.parse(JSON.stringify(DEFAULT_CAPACITY))
  );

  const weekInfos = useMemo(() => buildWeekInfos(year), [year]);

  const pageStart = page * WEEKS_PER_PAGE;
  const pageEnd = Math.min(pageStart + WEEKS_PER_PAGE, TOTAL_WEEKS);
  const visibleWeeks = Array.from({ length: pageEnd - pageStart }, (_, i) => pageStart + i);
  const totalPages = Math.ceil(TOTAL_WEEKS / WEEKS_PER_PAGE);
  const revFirstWeek = weekInfos[pageStart];
  const revLastWeek = weekInfos[pageEnd - 1];
  const revLabel = `Rev ${page + 1} — ${revFirstWeek?.label.split(" — ")[1]?.split(" – ")[0] || ""} to ${revLastWeek?.label.split(" – ")[1] || ""}`;

  const applyDefaultsToAll = useCallback((wc: string) => {
    applyToAll(wc, defaults[wc]);
  }, [defaults, applyToAll]);

  const applyDefaultsToQuarter = useCallback((wc: string) => {
    applyToRange(wc, defaults[wc], pageStart, pageEnd);
  }, [defaults, applyToRange, pageStart, pageEnd]);

  const getWeekAvail = (cap: WeekCapacity) =>
    cap.personnel * cap.hoursPerDay * DAYS_PER_WEEK * (cap.loadingTarget / 100);

  const wcSummary = useMemo(() => {
    const weeks = grid[selectedWC];
    if (!weeks) return { totalAvail: 0, totalCap: 0, avgPersonnel: 0 };
    const totalAvail = weeks.reduce((s, w) => s + getWeekAvail(w), 0);
    const totalCap = weeks.reduce((s, w) => s + w.personnel * w.hoursPerDay * DAYS_PER_WEEK, 0);
    const avgPersonnel = weeks.reduce((s, w) => s + w.personnel, 0) / TOTAL_WEEKS;
    return { totalAvail, totalCap, avgPersonnel };
  }, [grid, selectedWC]);

  const WCIcon = WC_ICONS[selectedWC] || Wrench;
  const wcInfo = WORK_CENTRES.find(w => w.key === selectedWC)!;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center gap-3">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Weekly Capacity Loading</span>
          <span className="text-[9px] text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">Auto-saved · Synced to Schedule</span>
        </div>
        <div className="flex items-center gap-1">
          {WORK_CENTRES.map(wc => (
            <Button
              key={wc.key}
              size="sm"
              variant={selectedWC === wc.key ? "default" : "ghost"}
              className="h-7 text-[10px] gap-1"
              onClick={() => setSelectedWC(wc.key as WorkCentreKey)}
            >
              {React.createElement(WC_ICONS[wc.key] || Wrench, { className: "w-3 h-3" })}
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
                    {visibleWeeks.map(w => {
                      const wi = weekInfos[w];
                      return (
                        <Tooltip key={w}>
                          <TooltipTrigger asChild>
                            <th className="text-center px-1 py-1.5 font-semibold min-w-[60px] cursor-help">
                              {wi.shortLabel}
                              <div className="text-[8px] font-normal text-muted-foreground">{wi.label.split(" — ")[1]}</div>
                            </th>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">{wi.label}</TooltipContent>
                        </Tooltip>
                      );
                    })}
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
                          value={grid[selectedWC]?.[w]?.personnel ?? 0}
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
                          value={grid[selectedWC]?.[w]?.hoursPerDay ?? 10.5}
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
                          value={grid[selectedWC]?.[w]?.loadingTarget ?? 80}
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
                      const cap = grid[selectedWC]?.[w];
                      const avail = cap ? getWeekAvail(cap) : 0;
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
                      const cap = grid[selectedWC]?.[w];
                      const total = cap ? cap.personnel * cap.hoursPerDay * DAYS_PER_WEEK : 0;
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
                  if (!weeks) return null;
                  const annCap = weeks.reduce((s, w) => s + w.personnel * w.hoursPerDay * DAYS_PER_WEEK, 0);
                  const annAvail = weeks.reduce((s, w) => s + getWeekAvail(w), 0);
                  const avgLoading = weeks.reduce((s, w) => s + w.loadingTarget, 0) / TOTAL_WEEKS;
                  const Icon = WC_ICONS[wc.key] || Wrench;
                  return (
                    <tr key={wc.key} className="border-b border-border/30 hover:bg-muted/10">
                      <td className="px-3 py-1.5 font-medium text-foreground">
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3 h-3 text-muted-foreground" />
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
