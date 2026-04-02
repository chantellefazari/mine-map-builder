import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { WorkRequest } from "@/hooks/useWorkRequests";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
  PieChart, Pie,
} from "recharts";
import { AlertTriangle, Layers, Clock, TrendingDown, FileText } from "lucide-react";

interface Props {
  workOrders: WorkOrder[];
  workRequests: WorkRequest[];
}

const AGING_BUCKETS = [
  { label: "0–7 days", max: 7, color: "hsl(142 71% 45%)" },
  { label: "8–14 days", max: 14, color: "hsl(45 93% 47%)" },
  { label: "15–30 days", max: 30, color: "hsl(25 90% 55%)" },
  { label: "31–60 days", max: 60, color: "hsl(0 84% 60%)" },
  { label: "60+ days", max: Infinity, color: "hsl(0 60% 40%)" },
];

/** Backlog Management — aging analysis by trade, area, priority */
export function WOCBacklogTab({ workOrders, workRequests }: Props) {
  // Backlog = all open/active WOs not completed/closed
  const backlog = useMemo(
    () => workOrders.filter((wo) => !["Completed", "Complete", "Closed"].includes(wo.status)),
    [workOrders]
  );

  const now = Date.now();
  const ageDays = (wo: WorkOrder) => Math.floor((now - new Date(wo.created_at).getTime()) / 86400000);

  // Aging breakdown
  const agingData = useMemo(() => {
    return AGING_BUCKETS.map((bucket, i) => {
      const prev = i > 0 ? AGING_BUCKETS[i - 1].max : -1;
      const count = backlog.filter((wo) => {
        const age = ageDays(wo);
        return age > prev && age <= bucket.max;
      }).length;
      return { name: bucket.label, count, color: bucket.color };
    });
  }, [backlog]);

  // By trade
  const byTrade = useMemo(() => {
    const map: Record<string, number> = {};
    backlog.forEach((wo) => {
      const t = wo.trade || "Unassigned";
      map[t] = (map[t] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [backlog]);

  // By priority
  const byPriority = useMemo(() => {
    const map: Record<string, number> = {};
    backlog.forEach((wo) => {
      const p = wo.priority || "Medium";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [backlog]);

  // By area
  const byArea = useMemo(() => {
    const map: Record<string, number> = {};
    backlog.forEach((wo) => {
      const a = wo.functional_location?.split("-")[0] || "Unassigned";
      map[a] = (map[a] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [backlog]);

  const avgAge = backlog.length > 0 ? Math.round(backlog.reduce((s, wo) => s + ageDays(wo), 0) / backlog.length) : 0;
  const critical = backlog.filter((wo) => ageDays(wo) > 30).length;
  const highPriority = backlog.filter((wo) => ["Critical", "Emergency", "High", "P1", "P2"].includes(wo.priority)).length;

  const PRIORITY_COLORS: Record<string, string> = {
    Critical: "hsl(0 84% 60%)", Emergency: "hsl(0 84% 60%)", High: "hsl(25 90% 55%)", P1: "hsl(0 84% 60%)", P2: "hsl(25 90% 55%)",
    Medium: "hsl(45 93% 47%)", P3: "hsl(45 93% 47%)", Low: "hsl(142 71% 45%)", P4: "hsl(142 71% 45%)", Other: "hsl(0 0% 60%)",
  };

  return (
    <div className="space-y-4 mt-2">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <Layers className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{backlog.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Total Backlog</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{avgAge}d</p>
            <p className="text-[10px] text-muted-foreground mt-1">Avg Age</p>
          </CardContent>
        </Card>
        <Card className={`border ${critical > 5 ? "bg-destructive/10 border-destructive/30" : "border-border"}`}>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className={`text-2xl font-bold ${critical > 5 ? "text-destructive" : "text-foreground"}`}>{critical}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Over 30 Days</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{highPriority}</p>
            <p className="text-[10px] text-muted-foreground mt-1">High / Critical</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Aging Buckets */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Backlog Aging</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agingData}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="WOs">
                    {agingData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* By Priority */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Backlog by Priority</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byPriority} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={2}>
                    {byPriority.map((d) => (
                      <Cell key={d.name} fill={PRIORITY_COLORS[d.name] || PRIORITY_COLORS.Other} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* By Trade */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Backlog by Trade</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byTrade} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="count" fill="hsl(210 80% 55%)" radius={[0, 4, 4, 0]} name="WOs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* By Area */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Backlog by Area (Top 10)</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byArea}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="count" fill="hsl(25 90% 55%)" radius={[4, 4, 0, 0]} name="WOs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Oldest backlog items */}
      <Card className="border-border">
        <CardContent className="p-4">
          <p className="text-xs font-semibold mb-3">Oldest Backlog Items</p>
          <div className="border border-border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold">WO #</th>
                  <th className="text-left px-3 py-2 font-semibold">Asset</th>
                  <th className="text-left px-3 py-2 font-semibold">Description</th>
                  <th className="text-left px-3 py-2 font-semibold">Priority</th>
                  <th className="text-left px-3 py-2 font-semibold">Age</th>
                  <th className="text-left px-3 py-2 font-semibold">Trade</th>
                  <th className="text-left px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {backlog
                  .sort((a, b) => ageDays(b) - ageDays(a))
                  .slice(0, 15)
                  .map((wo) => (
                    <tr key={wo.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                      <td className="px-3 py-2 font-mono font-medium">{wo.wo_number}</td>
                      <td className="px-3 py-2">{wo.asset_id || "-"}</td>
                      <td className="px-3 py-2 truncate max-w-[180px]">{wo.problem_description || "-"}</td>
                      <td className="px-3 py-2"><Badge variant="outline" className="text-[10px]">{wo.priority}</Badge></td>
                      <td className="px-3 py-2">
                        <span className={ageDays(wo) > 30 ? "text-destructive font-semibold" : ageDays(wo) > 14 ? "text-amber-500" : "text-muted-foreground"}>
                          {ageDays(wo)}d
                        </span>
                      </td>
                      <td className="px-3 py-2">{wo.trade || "-"}</td>
                      <td className="px-3 py-2"><Badge variant="secondary" className="text-[10px]">{wo.status}</Badge></td>
                    </tr>
                  ))}
                {backlog.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No backlog items</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
