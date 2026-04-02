import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { WorkRequest } from "@/hooks/useWorkRequests";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
  ScatterChart, Scatter, CartesianGrid, ZAxis,
} from "recharts";
import { Activity, Timer, Repeat, ShieldAlert, FileText } from "lucide-react";

interface Props {
  workOrders: WorkOrder[];
  workRequests: WorkRequest[];
}

/** Reliability — MTBF / MTTR per asset class */
export function WOCReliabilityTab({ workOrders }: Props) {
  // Group completed corrective WOs by asset to compute MTBF & MTTR
  const assetMetrics = useMemo(() => {
    // Only corrective / breakdown work
    const corrective = workOrders.filter(
      (wo) =>
        wo.date_completed &&
        wo.date_raised &&
        ["CM", "Corrective", "Breakdown", "Reactive"].includes(wo.work_type)
    );

    const byAsset: Record<string, WorkOrder[]> = {};
    corrective.forEach((wo) => {
      const key = wo.asset_id || "Unknown";
      if (!byAsset[key]) byAsset[key] = [];
      byAsset[key].push(wo);
    });

    return Object.entries(byAsset)
      .map(([asset, wos]) => {
        // Sort by date raised
        const sorted = wos.sort((a, b) => new Date(a.date_raised).getTime() - new Date(b.date_raised).getTime());

        // MTTR = avg time from raised to completed (hours)
        const repairTimes = sorted.map((wo) => {
          const raised = new Date(wo.date_raised).getTime();
          const completed = new Date(wo.date_completed!).getTime();
          return Math.max(0, (completed - raised) / 3600000);
        });
        const mttr = repairTimes.length > 0 ? repairTimes.reduce((a, b) => a + b, 0) / repairTimes.length : 0;

        // MTBF = avg time between consecutive failures (days)
        const gaps: number[] = [];
        for (let i = 1; i < sorted.length; i++) {
          const prev = new Date(sorted[i - 1].date_raised).getTime();
          const curr = new Date(sorted[i].date_raised).getTime();
          gaps.push((curr - prev) / 86400000);
        }
        const mtbf = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;

        return {
          asset,
          failures: wos.length,
          mtbf: Math.round(mtbf),
          mttr: Math.round(mttr * 10) / 10,
        };
      })
      .filter((a) => a.failures >= 1)
      .sort((a, b) => b.failures - a.failures);
  }, [workOrders]);

  // Summary metrics
  const totalFailures = assetMetrics.reduce((s, a) => s + a.failures, 0);
  const avgMTTR = assetMetrics.length > 0 ? Math.round(assetMetrics.reduce((s, a) => s + a.mttr, 0) / assetMetrics.length * 10) / 10 : 0;
  const avgMTBF = assetMetrics.length > 0 ? Math.round(assetMetrics.reduce((s, a) => s + a.mtbf, 0) / assetMetrics.length) : 0;
  const worstAssets = assetMetrics.slice(0, 5);
  const repeatOffenders = assetMetrics.filter((a) => a.failures >= 3);

  // Top 10 for charts
  const top10 = assetMetrics.slice(0, 10);

  return (
    <div className="space-y-4 mt-2">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <Activity className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{totalFailures}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Total Failures</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <Timer className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{avgMTTR}h</p>
            <p className="text-[10px] text-muted-foreground mt-1">Avg MTTR</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <Repeat className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{avgMTBF}d</p>
            <p className="text-[10px] text-muted-foreground mt-1">Avg MTBF</p>
          </CardContent>
        </Card>
        <Card className={`border ${repeatOffenders.length > 3 ? "bg-destructive/10 border-destructive/30" : "border-border"}`}>
          <CardContent className="p-4 text-center">
            <ShieldAlert className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className={`text-2xl font-bold ${repeatOffenders.length > 3 ? "text-destructive" : "text-foreground"}`}>{repeatOffenders.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Repeat Offenders (3+)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MTTR by Asset */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">MTTR by Asset (hrs) — Top 10</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top10} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="asset" tick={{ fontSize: 9 }} width={100} />
                  <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number) => `${v}h`} />
                  <Bar dataKey="mttr" fill="hsl(25 90% 55%)" radius={[0, 4, 4, 0]} name="MTTR (hrs)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Failure Count */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Failure Count by Asset — Top 10</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top10} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="asset" tick={{ fontSize: 9 }} width={100} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="failures" radius={[0, 4, 4, 0]} name="Failures">
                    {top10.map((d, i) => (
                      <Cell key={i} fill={d.failures >= 5 ? "hsl(0 84% 60%)" : d.failures >= 3 ? "hsl(25 90% 55%)" : "hsl(210 80% 55%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full asset reliability table */}
      <Card className="border-border">
        <CardContent className="p-4">
          <p className="text-xs font-semibold mb-3">Asset Reliability Register</p>
          <div className="border border-border rounded-lg overflow-hidden max-h-72 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold">Asset</th>
                  <th className="text-left px-3 py-2 font-semibold">Failures</th>
                  <th className="text-left px-3 py-2 font-semibold">MTBF (days)</th>
                  <th className="text-left px-3 py-2 font-semibold">MTTR (hrs)</th>
                  <th className="text-left px-3 py-2 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {assetMetrics.slice(0, 25).map((a) => {
                  const risk = a.failures >= 5 || a.mtbf < 7 ? "High" : a.failures >= 3 || a.mtbf < 30 ? "Medium" : "Low";
                  const riskColor = risk === "High" ? "bg-destructive/10 text-destructive border-destructive/30" : risk === "Medium" ? "bg-amber-500/10 text-amber-600 border-amber-500/30" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
                  return (
                    <tr key={a.asset} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                      <td className="px-3 py-2 font-mono font-medium">{a.asset}</td>
                      <td className="px-3 py-2">{a.failures}</td>
                      <td className="px-3 py-2">{a.mtbf || "-"}</td>
                      <td className="px-3 py-2">{a.mttr}h</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className={`text-[9px] ${riskColor}`}>{risk}</Badge>
                      </td>
                    </tr>
                  );
                })}
                {assetMetrics.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No corrective maintenance data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
