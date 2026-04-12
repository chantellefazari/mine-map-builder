import { useState, useCallback } from "react";
import {
  Users, Settings2, Wrench, Zap, Truck, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

const WORK_CENTRES = [
  { key: "Mechanical", label: "Mechanical", icon: Wrench, short: "MECH" },
  { key: "Electrical", label: "Electrical", icon: Zap, short: "ELEC" },
  { key: "Mobile & LVS", label: "Mobile & LVS", icon: Truck, short: "MOB" },
] as const;

interface WorkCentreCapacity {
  personnel: number;
  hoursPerDay: number;
  loadingTarget: number;
}

const DEFAULT_CAPACITY: Record<string, WorkCentreCapacity> = {
  Mechanical: { personnel: 6, hoursPerDay: 10.5, loadingTarget: 80 },
  Electrical: { personnel: 4, hoursPerDay: 10.5, loadingTarget: 90 },
  "Mobile & LVS": { personnel: 3, hoursPerDay: 10.5, loadingTarget: 80 },
};

const DAYS_PER_WEEK = 7;

export function PlannerCapacityTab({ items }: Props) {
  const [capacities, setCapacities] = useState<Record<string, WorkCentreCapacity>>(DEFAULT_CAPACITY);

  const updateCapacity = useCallback((wc: string, field: keyof WorkCentreCapacity, val: number) => {
    setCapacities(prev => ({
      ...prev,
      [wc]: { ...prev[wc], [field]: val },
    }));
  }, []);

  const totalPersonnel = WORK_CENTRES.reduce((s, wc) => s + capacities[wc.key].personnel, 0);
  const totalWeeklyCapacity = WORK_CENTRES.reduce((s, wc) => {
    const c = capacities[wc.key];
    return s + c.personnel * c.hoursPerDay * DAYS_PER_WEEK;
  }, 0);
  const totalWeeklyAvailable = WORK_CENTRES.reduce((s, wc) => {
    const c = capacities[wc.key];
    return s + c.personnel * c.hoursPerDay * DAYS_PER_WEEK * (c.loadingTarget / 100);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center gap-3">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Work Centre Capacity</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <p className="text-xs text-muted-foreground">
            Set the number of personnel, daily hours per person, and target loading percentage for each work centre.
            These values define the available capacity used across the schedule and forecast.
          </p>

          {/* Work Centre Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WORK_CENTRES.map(wc => {
              const cap = capacities[wc.key];
              const weeklyTotal = cap.personnel * cap.hoursPerDay * DAYS_PER_WEEK;
              const weeklyAvail = weeklyTotal * (cap.loadingTarget / 100);

              return (
                <div key={wc.key} className="border border-border rounded-lg p-4 bg-card space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                      <wc.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{wc.label}</div>
                      <div className="text-[10px] text-muted-foreground">{wc.short}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-medium">Personnel (per day)</label>
                      <Input
                        type="number"
                        value={cap.personnel}
                        onChange={e => updateCapacity(wc.key, "personnel", Math.max(0, Number(e.target.value)))}
                        className="h-8 text-xs mt-0.5"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-medium">Hours per Person per Day</label>
                      <Input
                        type="number"
                        step="0.5"
                        value={cap.hoursPerDay}
                        onChange={e => updateCapacity(wc.key, "hoursPerDay", Math.max(0, Number(e.target.value)))}
                        className="h-8 text-xs mt-0.5"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-medium">Loading Target (%)</label>
                      <Input
                        type="number"
                        value={cap.loadingTarget}
                        onChange={e => updateCapacity(wc.key, "loadingTarget", Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="h-8 text-xs mt-0.5"
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-2 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Weekly Total Hrs</span>
                      <span className="font-semibold text-foreground">{weeklyTotal.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Available (at {cap.loadingTarget}%)</span>
                      <span className="font-semibold text-primary">{weeklyAvail.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Annual Capacity</span>
                      <span className="font-semibold text-foreground">{(weeklyAvail * 52).toFixed(0)}h</span>
                    </div>
                  </div>

                  {/* Visual loading bar */}
                  <div>
                    <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                      <span>Breakdown Allowance</span>
                      <span>{100 - cap.loadingTarget}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${cap.loadingTarget}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] mt-0.5">
                      <span className="text-primary font-medium">Planned {cap.loadingTarget}%</span>
                      <span className="text-muted-foreground">Reserve {100 - cap.loadingTarget}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Combined summary */}
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <div className="text-xs font-bold text-foreground mb-3">Combined Capacity Summary</div>
            <div className="grid grid-cols-4 gap-4">
              <SummaryCard label="Total Personnel" value={`${totalPersonnel}`} icon={Users} />
              <SummaryCard label="Weekly Capacity" value={`${totalWeeklyCapacity.toFixed(0)}h`} icon={BarChart3} />
              <SummaryCard label="Weekly Available" value={`${totalWeeklyAvailable.toFixed(0)}h`} icon={Settings2} color="text-primary" />
              <SummaryCard label="Annual Available" value={`${(totalWeeklyAvailable * 52).toFixed(0)}h`} icon={BarChart3} />
            </div>
          </div>

          {/* Per work centre summary table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-muted/30 border-b border-border">
              <span className="text-xs font-bold text-foreground">Work Centre Breakdown</span>
            </div>
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-muted/20 border-b border-border">
                  <th className="text-left px-3 py-1.5 font-semibold">Work Centre</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Personnel</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Hrs/Day</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Loading %</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Weekly Cap</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Weekly Avail</th>
                  <th className="text-center px-2 py-1.5 font-semibold">Annual Avail</th>
                </tr>
              </thead>
              <tbody>
                {WORK_CENTRES.map(wc => {
                  const c = capacities[wc.key];
                  const wkCap = c.personnel * c.hoursPerDay * DAYS_PER_WEEK;
                  const wkAvail = wkCap * (c.loadingTarget / 100);
                  return (
                    <tr key={wc.key} className="border-b border-border/30 hover:bg-muted/10">
                      <td className="px-3 py-1.5 font-medium text-foreground">
                        <div className="flex items-center gap-1.5">
                          <wc.icon className="w-3 h-3 text-muted-foreground" />
                          {wc.label}
                        </div>
                      </td>
                      <td className="text-center px-2 py-1.5 tabular-nums">{c.personnel}</td>
                      <td className="text-center px-2 py-1.5 tabular-nums">{c.hoursPerDay}</td>
                      <td className="text-center px-2 py-1.5 tabular-nums font-semibold">{c.loadingTarget}%</td>
                      <td className="text-center px-2 py-1.5 tabular-nums">{wkCap.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 tabular-nums text-primary font-semibold">{wkAvail.toFixed(0)}h</td>
                      <td className="text-center px-2 py-1.5 tabular-nums">{(wkAvail * 52).toFixed(0)}h</td>
                    </tr>
                  );
                })}
                <tr className="bg-muted/30 font-semibold">
                  <td className="px-3 py-1.5">Total</td>
                  <td className="text-center px-2 py-1.5 tabular-nums">{totalPersonnel}</td>
                  <td className="text-center px-2 py-1.5 tabular-nums">—</td>
                  <td className="text-center px-2 py-1.5 tabular-nums">—</td>
                  <td className="text-center px-2 py-1.5 tabular-nums">{totalWeeklyCapacity.toFixed(0)}h</td>
                  <td className="text-center px-2 py-1.5 tabular-nums text-primary">{totalWeeklyAvailable.toFixed(0)}h</td>
                  <td className="text-center px-2 py-1.5 tabular-nums">{(totalWeeklyAvailable * 52).toFixed(0)}h</td>
                </tr>
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
