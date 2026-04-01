import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type OrchestratorStatus = "Not Started" | "Ready" | "Active" | "Blocked" | "Delayed" | "Complete";

export interface ConfirmedRule {
  id: string;
  title: string;
  rule_type: string;
  if_condition: string;
  then_action: string;
  area?: string;
  affected_packages?: string[];
  impact_level: string;
}

interface OrchestratorContextValue {
  // Shared filters
  filterArea: string;
  setFilterArea: (v: string) => void;
  filterTrade: string;
  setFilterTrade: (v: string) => void;
  filterShift: string;
  setFilterShift: (v: string) => void;
  showCriticalOnly: boolean;
  setShowCriticalOnly: (v: boolean) => void;

  // Cross-tab selection
  selectedPackageId: string | null;
  setSelectedPackageId: (id: string | null) => void;
  highlightedPackageIds: Set<string>;
  setHighlightedPackageIds: (ids: Set<string>) => void;

  // Tab navigation
  activeTab: string;
  navigateToTab: (tab: string, options?: { packageId?: string; areaId?: string }) => void;

  // AI Planner integration
  confirmedRules: ConfirmedRule[];
  addConfirmedRule: (rule: ConfirmedRule) => void;
}

const OrchestratorCtx = createContext<OrchestratorContextValue | null>(null);

export function useOrchestratorContext() {
  const ctx = useContext(OrchestratorCtx);
  if (!ctx) throw new Error("useOrchestratorContext must be used within ShutdownOrchestratorProvider");
  return ctx;
}

interface Props {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ShutdownOrchestratorProvider({ children, activeTab, onTabChange }: Props) {
  const [filterArea, setFilterArea] = useState("All");
  const [filterTrade, setFilterTrade] = useState("All");
  const [filterShift, setFilterShift] = useState("All");
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [highlightedPackageIds, setHighlightedPackageIds] = useState<Set<string>>(new Set());
  const [confirmedRules, setConfirmedRules] = useState<ConfirmedRule[]>([]);

  const navigateToTab = useCallback((tab: string, options?: { packageId?: string; areaId?: string }) => {
    if (options?.packageId) setSelectedPackageId(options.packageId);
    if (options?.areaId) {
      // Find area name from id if needed — for now just set filter
      setFilterArea(options.areaId);
    }
    onTabChange(tab);
  }, [onTabChange]);

  const addConfirmedRule = useCallback((rule: ConfirmedRule) => {
    setConfirmedRules(prev => [...prev, rule]);
  }, []);

  return (
    <OrchestratorCtx.Provider value={{
      filterArea, setFilterArea,
      filterTrade, setFilterTrade,
      filterShift, setFilterShift,
      showCriticalOnly, setShowCriticalOnly,
      selectedPackageId, setSelectedPackageId,
      highlightedPackageIds, setHighlightedPackageIds,
      activeTab, navigateToTab,
      confirmedRules, addConfirmedRule,
    }}>
      {children}
    </OrchestratorCtx.Provider>
  );
}
