import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Map, GitBranch, Columns3, Route, Printer, Brain, Calendar,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShutdownOrchestratorProvider, useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { ShutdownOverviewTab } from "./ShutdownOverviewTab";
import { ShutdownAreaMapTab } from "./ShutdownAreaMapTab";
import { ShutdownSequenceFlowTab } from "./ShutdownSequenceFlowTab";
import { ShutdownControlBoardTab } from "./ShutdownControlBoardTab";
import { ShutdownCriticalPathTab } from "./ShutdownCriticalPathTab";
import { ShutdownPrintPackTab } from "./ShutdownPrintPackTab";
import { ShutdownAIPlannerTab } from "./ShutdownAIPlannerTab";
import { useShutdowns } from "@/hooks/useShutdowns";
import { useShutdownPackages } from "@/hooks/useShutdownPackages";
import { format, parseISO, differenceInDays } from "date-fns";
import { PACKAGES as MOCK_PACKAGES } from "./shutdownData";

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

function OrchestratorInner() {
  const { selectedShutdownId, setSelectedShutdownId, setPackages } = useOrchestratorContext();
  const { shutdowns, isLoading: loadingShutdowns } = useShutdowns();
  const { packages: livePackages, isLoading: loadingPackages } = useShutdownPackages(selectedShutdownId);

  // Sync live packages into the context
  useEffect(() => {
    setPackages(livePackages as any);
  }, [livePackages, setPackages]);

  const selected = shutdowns.find(s => s.id === selectedShutdownId) ?? null;

  return (
    <>
      {/* Shutdown selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Shutdown:</span>
        <Select value={selectedShutdownId ?? ""} onValueChange={setSelectedShutdownId}>
          <SelectTrigger className="w-72 h-8 text-xs">
            <SelectValue placeholder="Select a shutdown…" />
          </SelectTrigger>
          <SelectContent>
            {shutdowns.map(s => (
              <SelectItem key={s.id} value={s.id}>
                <span className="flex items-center gap-2">
                  {s.name}
                  <Badge variant="outline" className="text-[9px] h-4">{s.shutdown_rev}</Badge>
                  <Badge variant="outline" className="text-[9px] h-4">{s.status}</Badge>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selected && (
          <span className="text-xs text-muted-foreground">
            {format(parseISO(selected.start_date), "d MMM yyyy")}
            {selected.end_date && ` – ${format(parseISO(selected.end_date), "d MMM yyyy")}`}
            {selected.end_date && ` (${differenceInDays(parseISO(selected.end_date), parseISO(selected.start_date)) + 1} days)`}
          </span>
        )}

        {loadingPackages && (
          <span className="text-[10px] text-muted-foreground animate-pulse">Loading work packages…</span>
        )}
      </div>

      {!selectedShutdownId ? (
        <div className="flex flex-col items-center justify-center py-20 border border-border rounded-lg bg-card">
          <Calendar className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">Select a Shutdown</h3>
          <p className="text-xs text-muted-foreground mt-1">Choose a shutdown from the dropdown to open the orchestrator</p>
        </div>
      ) : (
        <OrchestratorTabs />
      )}
    </>
  );
}

function OrchestratorTabs() {
  const { activeTab } = useOrchestratorContext();

  return (
    <>
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
    </>
  );
}

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

        <OrchestratorInner />
      </div>
    </ShutdownOrchestratorProvider>
  );
}
