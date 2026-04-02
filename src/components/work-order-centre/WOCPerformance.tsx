import { useState } from "react";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import { BarChart3 } from "lucide-react";
import { WOCReportsTab } from "./performance/WOCReportsTab";
import { WOCAnalyticsTab } from "./performance/WOCAnalyticsTab";
import { WOCPMFormsTab } from "./performance/WOCPMFormsTab";
import { WOCComplianceTab } from "./performance/WOCComplianceTab";
import { WOCScheduleComplianceTab } from "./performance/WOCScheduleComplianceTab";
import { WOCBacklogTab } from "./performance/WOCBacklogTab";
import { WOCReliabilityTab } from "./performance/WOCReliabilityTab";
import { WOCKPIScorecardTab } from "./performance/WOCKPIScorecardTab";

const PERF_TABS = [
  ["reports", "Reports"],
  ["analytics", "Analytics"],
  ["pm-forms", "PM Forms"],
  ["compliance", "PM Compliance"],
  ["sched-compliance", "Sched Compliance"],
  ["backlog", "Backlog"],
  ["reliability", "Reliability"],
  ["kpi-scorecard", "KPI Scorecard"],
] as [string, string][];

export function WOCPerformance() {
  const { workOrders } = useWorkOrders();
  const [tab, setTab] = useState("reports");

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Performance
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Strategic maintenance metrics, compliance tracking, and KPI reporting
        </p>
      </div>

      {/* Tab bar */}
      <div className="border-b border-border">
        <div className="flex gap-0.5">
          {PERF_TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-t-md border-b-2 transition-colors ${
                tab === key
                  ? "border-primary text-foreground bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === "reports" && <WOCReportsTab workOrders={workOrders} />}
      {tab === "analytics" && <WOCAnalyticsTab workOrders={workOrders} />}
      {tab === "pm-forms" && <WOCPMFormsTab />}
      {tab === "compliance" && <WOCComplianceTab />}
      {tab === "sched-compliance" && <WOCScheduleComplianceTab workOrders={workOrders} />}
      {tab === "backlog" && <WOCBacklogTab workOrders={workOrders} />}
      {tab === "reliability" && <WOCReliabilityTab workOrders={workOrders} />}
      {tab === "kpi-scorecard" && <WOCKPIScorecardTab workOrders={workOrders} />}
    </div>
  );
}
