import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { WorkRequest } from "@/hooks/useWorkRequests";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

interface Props {
  workOrders: WorkOrder[];
  workRequests: WorkRequest[];
}

const STATUS_COLORS: Record<string, string> = {
  Completed: "hsl(142 71% 45%)",
  Active: "hsl(210 80% 55%)",
  Planning: "hsl(45 93% 47%)",
  "On Hold": "hsl(25 90% 55%)",
  Ready: "hsl(190 80% 45%)",
  Other: "hsl(0 0% 60%)",
};

export function WOCAnalyticsTab({ workOrders }: Props) {
  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    workOrders.forEach((wo) => {
      const s = wo.status || "Other";
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [workOrders]);

  const priorityData = useMemo(() => {
    const map: Record<string, number> = {};
    workOrders.forEach((wo) => {
      const p = wo.priority || "Medium";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [workOrders]);

  const areaData = useMemo(() => {
    const map: Record<string, number> = {};
    workOrders.forEach((wo) => {
      const a = wo.functional_location?.split("-")[0] || "Unassigned";
      map[a] = (map[a] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [workOrders]);

  const total = workOrders.length;
  const completed = workOrders.filter((w) =>
    ["Completed", "Complete", "Closed"].includes(w.status)
  ).length;
  const planned = workOrders.filter((w) =>
    ["Planning", "Draft", "Ready"].includes(w.status)
  ).length;
  const reactive = total - planned - completed;

  return (
    <div className="space-y-4 mt-2">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total WOs", value: total },
          { label: "Completion %", value: total ? `${Math.round((completed / total) * 100)}%` : "-" },
          { label: "Planned Work", value: planned },
          { label: "Reactive / Break-in", value: reactive },
        ].map((k) => (
          <Card key={k.label} className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-xl font-bold text-foreground">{k.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status breakdown */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Work Orders by Status</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={2}>
                    {statusData.map((d) => (
                      <Cell key={d.name} fill={STATUS_COLORS[d.name] || STATUS_COLORS.Other} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Priority breakdown */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Work Orders by Priority</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="count" fill="hsl(45 93% 47%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Area breakdown */}
        <Card className="border-border lg:col-span-2">
          <CardContent className="p-4">
            <p className="text-xs font-semibold mb-3">Work Orders by Area (Top 10)</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaData}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="count" fill="hsl(210 80% 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
