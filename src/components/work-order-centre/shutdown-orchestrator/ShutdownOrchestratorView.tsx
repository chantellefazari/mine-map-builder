import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Map, GitBranch, Columns3, Route, Printer, Brain,
} from "lucide-react";
import { ShutdownOrchestratorProvider } from "./ShutdownOrchestratorContext";
import { ShutdownOverviewTab } from "./ShutdownOverviewTab";
import { ShutdownAreaMapTab } from "./ShutdownAreaMapTab";
import { ShutdownSequenceFlowTab } from "./ShutdownSequenceFlowTab";
import { ShutdownControlBoardTab } from "./ShutdownControlBoardTab";
import { ShutdownCriticalPathTab } from "./ShutdownCriticalPathTab";
import { ShutdownPrintPackTab } from "./ShutdownPrintPackTab";
import { ShutdownAIPlannerTab } from "./ShutdownAIPlannerTab";

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

export function ShutdownOrchestratorView() {
  const [activeTab, setActiveTab] = useState<SubTab>("overview");

  return (
    <ShutdownOrchestratorProvider activeTab={activeTab} onTabChange={(t) => setActiveTab(t as SubTab)}>
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
        ) : activeTab === "print-pack" ? (
          <ShutdownPrintPackTab />
        ) : activeTab === "ai-planner" ? (
          <ShutdownAIPlannerTab />
        ) : null}
      </div>
    </ShutdownOrchestratorProvider>
  );
}
