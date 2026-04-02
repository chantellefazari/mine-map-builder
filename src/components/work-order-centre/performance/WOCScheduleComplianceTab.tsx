import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { WorkRequest } from "@/hooks/useWorkRequests";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { CalendarCheck, CalendarX, TrendingUp, Clock } from "lucide-react";

interface Props {
  workOrders: WorkOrder[];
  workRequests: WorkRequest[];
}

/** Schedule Compliance — Did we execute work on the day it was scheduled? */
export function WOCScheduleComplianceTab({ workOrders }: Props) {
  // Determine compliance: completed WOs where date_completed matches scheduled_date
  const analysis = useMemo(() => {
    const scheduled = workOrders.filter((wo) => wo.scheduled_date);
    const completed = scheduled.filter((wo) => wo.date_completed);
    const onTime = completed.filter((wo) => {
      if (!wo.scheduled_date || !wo.date_completed) return false;
      return wo.date_completed.slice(0, 10) <= wo.scheduled_date.slice(0, 10);
    });
    const late = completed.filter((wo) => {
      if (!wo.scheduled_date || !wo.date_completed) return false;
      return wo.date_completed.slice(0, 10) > wo.scheduled_date.slice(0, 10);
    });
    const notDone = scheduled.filter((wo) => !wo.date_completed && ["Active", "In Progress", "Scheduled", "On Hold"].includes(wo.status));

    const compliancePct = completed.length > 0 ? Math.round((onTime.length / completed.length) * 100) : 0;

    return { scheduled, completed, onTime, late, notDone, compliancePct };
  }, [workOrders]);

  // Weekly trend (last 8 weeks)
  const weeklyTrend = useMemo(() => {
    const weeks: { week: string; compliance: number; total: number; onTime: number }[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7 + now.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const weekLabel = `W${52 - i > 0 ? 52 - i : i}`;

      const weekWOs = workOrders.filter((wo) => {
        if (!wo.scheduled_date || !wo.date_completed) return false;
        const sd = new Date(wo.scheduled_date);
        return sd >= weekStart && sd <= weekEnd;
      });
      const onTime = weekWOs.filter((wo) => wo.date_completed!.slice(0, 10) <= wo.scheduled_date!.slice(0, 10));
      weeks.push({
        week: weekLabel,
        total: weekWOs.length,
        onTime: onTime.length,
        compliance: weekWOs.length > 0 ? Math.round((onTime.length / weekWOs.length) * 100) : 0,
      });
    }
    return weeks;
  }, [workOrders]);

  // By trade breakdown
  const byTrade = useMemo(() => {
    const map: Record<string, { total: number; onTime: number }> = {};
    workOrders.forEach((wo) => {
      if (!wo.scheduled_date || !wo.date_completed) return;
      const trade = wo.trade || "Unassigned";
      if (!map[trade]) map[trade] = { total: 0, onTime: 0 };
      map[trade].total++;
      if (wo.date_completed.slice(0, 10) <= wo.scheduled_date.slice(0, 10)) {
        map[trade].onTime++;
      }
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, compliance: d.total > 0 ? Math.round((d.onTime / d.total) * 100) : 0, total: d.total }))
      .sort((a, b) => b.total - a.total);
  }, [workOrders]);

  const ragColor = (pct: number) =>
    pct >= 90 ? "text-emerald-600" : pct >= 70 ? "text-amber-500" : "text-destructive";

  const ragBg = (pct: number) =>
    pct >= 90 ? "bg-emerald-500/10 border-emerald-500/30" : pct >= 70 ? "bg-amber-500/10 border-amber-500/30" : "bg-destructive/10 border-destructive/30";

  return (
    <div className="space-y-4 mt-2">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className={`border ${ragBg(analysis.compliancePct)}`}>
          <CardContent className="p-4 text-center">
            <CalendarCheck className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className={`text-2xl font-bold ${ragColor(analysis.compliancePct)}`}>
              {analysis.compliancePct}%
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Schedule Compliance</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{analysis.onTime.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">On-Time Completions</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <CalendarX className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-destructive">{analysis.late.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Late Completions</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{analysis.notDone.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Scheduled — Not Done</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Trend */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Weekly Compliance Trend (%)</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="compliance" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Compliance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* By Trade */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Compliance by Trade</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byTrade} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                  <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="compliance" radius={[0, 4, 4, 0]} name="Compliance %">
                    {byTrade.map((d, i) => (
                      <Cell key={i} fill={d.compliance >= 90 ? "hsl(142 71% 45%)" : d.compliance >= 70 ? "hsl(45 93% 47%)" : "hsl(0 84% 60%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Break-in / Unscheduled disruptions table */}
      <Card className="border-border">
        <CardContent className="p-4">
          <p className="text-xs font-semibold mb-3">Schedule Breaks — Late & Overdue Work Orders</p>
          <div className="border border-border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold">WO #</th>
                  <th className="text-left px-3 py-2 font-semibold">Asset</th>
                  <th className="text-left px-3 py-2 font-semibold">Scheduled</th>
                  <th className="text-left px-3 py-2 font-semibold">Completed</th>
                  <th className="text-left px-3 py-2 font-semibold">Days Late</th>
                  <th className="text-left px-3 py-2 font-semibold">Trade</th>
                  <th className="text-left px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...analysis.late, ...analysis.notDone].slice(0, 20).map((wo) => {
                  const schedDate = wo.scheduled_date ? new Date(wo.scheduled_date) : null;
                  const compDate = wo.date_completed ? new Date(wo.date_completed) : null;
                  const daysLate = schedDate
                    ? compDate
                      ? Math.ceil((compDate.getTime() - schedDate.getTime()) / 86400000)
                      : Math.ceil((Date.now() - schedDate.getTime()) / 86400000)
                    : 0;
                  return (
                    <tr key={wo.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                      <td className="px-3 py-2 font-mono font-medium">{wo.wo_number}</td>
                      <td className="px-3 py-2">{wo.asset_id || "-"}</td>
                      <td className="px-3 py-2">{wo.scheduled_date?.slice(0, 10) || "-"}</td>
                      <td className="px-3 py-2">{wo.date_completed?.slice(0, 10) || <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/30">Overdue</Badge>}</td>
                      <td className="px-3 py-2">
                        <span className={daysLate > 7 ? "text-destructive font-semibold" : daysLate > 2 ? "text-amber-500" : "text-muted-foreground"}>
                          +{daysLate}d
                        </span>
                      </td>
                      <td className="px-3 py-2">{wo.trade || "-"}</td>
                      <td className="px-3 py-2"><Badge variant="secondary" className="text-[10px]">{wo.status}</Badge></td>
                    </tr>
                  );
                })}
                {analysis.late.length + analysis.notDone.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">No schedule breaks detected</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
