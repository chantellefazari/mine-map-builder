import { useState } from "react";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import {
  FileText, Wrench, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, TrendingUp, BarChart3, ClipboardCheck, Activity,
  LayoutDashboard, FileBarChart, Layers,
} from "lucide-react";
import { WOCView } from "@/pages/WorkOrderCentre";
import { cn } from "@/lib/utils";
import { WOCReportsTab } from "./performance/WOCReportsTab";
import { WOCAnalyticsTab } from "./performance/WOCAnalyticsTab";
import { WOCPMFormsTab } from "./performance/WOCPMFormsTab";
import { WOCComplianceTab } from "./performance/WOCComplianceTab";
import { WOCScheduleComplianceTab } from "./performance/WOCScheduleComplianceTab";
import { WOCBacklogTab } from "./performance/WOCBacklogTab";
import { WOCReliabilityTab } from "./performance/WOCReliabilityTab";
import { WOCKPIScorecardTab } from "./performance/WOCKPIScorecardTab";

interface Props {
  onNavigate: (view: WOCView) => void;
}

const DASHBOARD_TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "reports", label: "Reports", icon: FileBarChart },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "pm-forms", label: "PM Forms", icon: ClipboardCheck },
  { key: "compliance", label: "Compliance", icon: CheckCircle2 },
  { key: "reliability", label: "Reliability", icon: Activity },
  { key: "backlog", label: "Backlog", icon: Layers },
  { key: "kpi-scorecard", label: "KPI Scorecard", icon: TrendingUp },
];

const STATUS_BADGE: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  planning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  draft: "bg-muted text-muted-foreground",
  ready: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  active: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "in progress": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "on hold": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  completed: "bg-muted text-muted-foreground",
  complete: "bg-muted text-muted-foreground",
  closed: "bg-muted text-muted-foreground",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-blue-400",
  normal: "bg-emerald-500",
};

export function WOCDashboard({ onNavigate }: Props) {
  const { workOrders } = useWorkOrders();
  const { workRequests } = useWorkRequests();
  const [tab, setTab] = useState("dashboard");

  const woByStatus = (s: string) =>
    workOrders.filter((w) => w.status?.toLowerCase() === s.toLowerCase()).length;
  const wrPending = workRequests.filter((r) =>
    ["Submitted", "Pending Review"].includes(r.status)
  ).length;

  const summaryCards = [
    {
      label: "Pending Requests",
      value: wrPending,
      icon: FileText,
      accent: "border-l-amber-500",
      iconBg: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
      target: "work-requests" as WOCView,
    },
    {
      label: "Planning",
      value: woByStatus("Planning") + woByStatus("Draft") + woByStatus("Open"),
      icon: Clock,
      accent: "border-l-blue-500",
      iconBg: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      target: "wo-management" as WOCView,
    },
    {
      label: "Active",
      value: woByStatus("Active") + woByStatus("In Progress"),
      icon: Wrench,
      accent: "border-l-emerald-500",
      iconBg: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
      target: "wo-management" as WOCView,
    },
    {
      label: "On Hold",
      value: woByStatus("On Hold"),
      icon: AlertTriangle,
      accent: "border-l-orange-500",
      iconBg: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
      target: "wo-management" as WOCView,
    },
    {
      label: "Completed",
      value: woByStatus("Completed") + woByStatus("Complete") + woByStatus("Closed"),
      icon: CheckCircle2,
      accent: "border-l-muted-foreground/40",
      iconBg: "text-muted-foreground bg-muted",
      target: "wo-management" as WOCView,
    },
  ];

  const recentWOs = workOrders.slice(0, 10);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-foreground">Work Order Centre</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Plant equipment management and monitoring
        </p>
      </div>

      {/* Minesite-style tab bar */}
      <div className="border border-border rounded-lg bg-muted/30 p-1 inline-flex gap-0.5">
        {DASHBOARD_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              tab === t.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "dashboard" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {summaryCards.map((c) => (
              <button
                key={c.label}
                onClick={() => onNavigate(c.target)}
                className={cn(
                  "group relative flex flex-col gap-3 p-4 border border-border rounded-lg bg-card",
                  "border-l-[3px] hover:shadow-sm transition-all text-left",
                  c.accent
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={cn("p-1.5 rounded-md", c.iconBg)}>
                    <c.icon className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground leading-none">{c.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{c.label}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Recent Work Orders Table */}
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <h2 className="text-sm font-semibold text-foreground">Recent Work Orders</h2>
              <button
                onClick={() => onNavigate("wo-management")}
                className="text-[11px] text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">WO #</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Asset</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Description</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentWOs.map((wo) => {
                    const statusKey = (wo.status || "").toLowerCase();
                    const priorityKey = (wo.priority || "").toLowerCase();
                    return (
                      <tr key={wo.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                        <td className="px-4 py-2.5 font-mono font-medium text-foreground">{wo.wo_number}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{wo.asset_id || "—"}</td>
                        <td className="px-4 py-2.5 text-foreground max-w-[320px] truncate">{wo.problem_description || "—"}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap", STATUS_BADGE[statusKey] || "bg-muted text-muted-foreground")}>
                            {wo.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-1.5">
                            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", PRIORITY_DOT[priorityKey] || "bg-muted-foreground")} />
                            <span className="text-muted-foreground">{wo.priority}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {workOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No work orders yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "reports" && <WOCReportsTab workOrders={workOrders} />}
      {tab === "analytics" && <WOCAnalyticsTab workOrders={workOrders} />}
      {tab === "pm-forms" && <WOCPMFormsTab />}
      {tab === "compliance" && (
        <div className="space-y-4">
          <WOCComplianceTab />
          <WOCScheduleComplianceTab workOrders={workOrders} />
        </div>
      )}
      {tab === "reliability" && (
        <div className="space-y-4">
          <WOCReliabilityTab workOrders={workOrders} />
          <WOCBacklogTab workOrders={workOrders} />
        </div>
      )}
      {tab === "kpi-scorecard" && <WOCKPIScorecardTab workOrders={workOrders} />}
    </div>
  );
}
