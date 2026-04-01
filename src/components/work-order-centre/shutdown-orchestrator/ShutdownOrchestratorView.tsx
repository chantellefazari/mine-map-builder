import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Map, GitBranch, Columns3, Route, Printer, Brain,
} from "lucide-react";
import { ShutdownOverviewTab } from "./ShutdownOverviewTab";
import { ShutdownAreaMapTab } from "./ShutdownAreaMapTab";
import { ShutdownSequenceFlowTab } from "./ShutdownSequenceFlowTab";
import { ShutdownControlBoardTab } from "./ShutdownControlBoardTab";
import { ShutdownCriticalPathTab } from "./ShutdownCriticalPathTab";
import { ShutdownPrintPackTab } from "./ShutdownPrintPackTab";

const SUB_TABS = [
  { key: "overview", label: "Shutdown Overview", icon: LayoutDashboard },
  { key: "area-map", label: "Area Map", icon: Map },
  { key: "sequence", label: "Sequence Flow", icon: GitBranch },
  { key: "control", label: "Control Board", icon: Columns3 },
  { key: "critical-path", label: "Critical Path", icon: Route },
  { key: "print-pack", label: "Print Pack", icon: Printer },
  { key: "ai-planner", label: "AI Planner", icon: Brain },
] as const;

type SubTab = (typeof SUB_TABS)[number]["key"];

function TabPlaceholder({ tab }: { tab: typeof SUB_TABS[number] }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 border border-border rounded-lg bg-card">
      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
        <tab.icon className="w-7 h-7 text-muted-foreground/40" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{tab.label}</h3>
      <p className="text-xs text-muted-foreground max-w-sm text-center">
        {getPlaceholderDescription(tab.key)}
      </p>
    </div>
  );
}

function getPlaceholderDescription(key: SubTab): string {
  switch (key) {
    case "overview":
      return "High-level shutdown status dashboard — work package progress, readiness gates, area completion, and key metrics at a glance.";
    case "area-map":
      return "Visual area-based status map showing job progress, crew assignments, and blockers across plant zones during shutdown execution.";
    case "sequence":
      return "Dependency-aware work package sequencing — drag-and-drop flow builder replacing traditional Gantt bar dependencies.";
    case "control":
      return "Real-time execution control board — Kanban-style columns for Ready, Active, Blocked, and Complete work packages by area and shift.";
    case "critical-path":
      return "Automated critical path identification — highlights the chain of dependent work packages that determine total shutdown duration.";
    case "print-pack":
      return "Printable shutdown documents — shift plans, area task sheets, isolation lists, and supervisor sign-off packs for field execution.";
    case "ai-planner":
      return "AI-assisted shutdown planning — intelligent sequencing suggestions, resource levelling, and delay impact analysis.";
  }
}

export function ShutdownOrchestratorView() {
  const [activeTab, setActiveTab] = useState<SubTab>("overview");
  const currentTab = SUB_TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="space-y-4">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-1 border-b border-border pb-px overflow-x-auto">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-md border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.key
                ? "border-primary text-foreground bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" ? (
        <ShutdownOverviewTab />
      ) : activeTab === "area-map" ? (
        <ShutdownAreaMapTab />
      ) : activeTab === "sequence" ? (
        <ShutdownSequenceFlowTab />
      ) : activeTab === "control" ? (
        <ShutdownControlBoardTab />
      ) : activeTab === "critical-path" ? (
        <ShutdownCriticalPathTab />
      ) : (
        <TabPlaceholder tab={currentTab} />
      )}
    </div>
  );
}
