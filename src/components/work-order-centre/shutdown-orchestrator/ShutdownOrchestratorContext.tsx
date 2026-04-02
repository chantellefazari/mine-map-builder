import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { SHUTDOWN_AREAS, AREA_LABELS, buildAreaSummaries, buildAreaZones, type ShutdownWorkPackage, type AreaSummary, type AreaZone } from "./shutdownData";

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
  // Selected shutdown
  selectedShutdownId: string | null;
  setSelectedShutdownId: (id: string | null) => void;

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

  // ── Live packages state ──
  packages: ShutdownWorkPackage[];
  updatePackage: (id: string, updates: Partial<ShutdownWorkPackage>) => void;
  addPackage: (pkg: ShutdownWorkPackage) => void;
  removePackage: (id: string) => void;
  setPackages: (pkgs: ShutdownWorkPackage[]) => void;

  // ── Derived data (recomputed when packages change) ──
  areaSummaries: AreaSummary[];
  areaZones: AreaZone[];

  // ── Loading state ──
  isLoadingPackages: boolean;
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
  const [selectedShutdownId, setSelectedShutdownId] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState("All");
  const [filterTrade, setFilterTrade] = useState("All");
  const [filterShift, setFilterShift] = useState("All");
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [highlightedPackageIds, setHighlightedPackageIds] = useState<Set<string>>(new Set());
  const [confirmedRules, setConfirmedRules] = useState<ConfirmedRule[]>([]);
  const [packages, setPackagesState] = useState<ShutdownWorkPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);

  const navigateToTab = useCallback((tab: string, options?: { packageId?: string; areaId?: string }) => {
    if (options?.packageId) setSelectedPackageId(options.packageId);
    if (options?.areaId) {
      setFilterArea(options.areaId);
    }
    onTabChange(tab);
  }, [onTabChange]);

  const addConfirmedRule = useCallback((rule: ConfirmedRule) => {
    setConfirmedRules(prev => [...prev, rule]);
  }, []);

  const updatePackage = useCallback((id: string, updates: Partial<ShutdownWorkPackage>) => {
    setPackagesState(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const addPackage = useCallback((pkg: ShutdownWorkPackage) => {
    setPackagesState(prev => [...prev, pkg]);
  }, []);

  const removePackage = useCallback((id: string) => {
    setPackagesState(prev => prev.filter(p => p.id !== id));
  }, []);

  const setPackages = useCallback((pkgs: ShutdownWorkPackage[]) => {
    setPackagesState(pkgs);
  }, []);

  const areaSummaries = useMemo(() => buildAreaSummaries(packages), [packages]);
  const areaZones = useMemo(() => buildAreaZones(packages), [packages]);

  return (
    <OrchestratorCtx.Provider value={{
      selectedShutdownId, setSelectedShutdownId,
      filterArea, setFilterArea,
      filterTrade, setFilterTrade,
      filterShift, setFilterShift,
      showCriticalOnly, setShowCriticalOnly,
      selectedPackageId, setSelectedPackageId,
      highlightedPackageIds, setHighlightedPackageIds,
      activeTab, navigateToTab,
      confirmedRules, addConfirmedRule,
      packages, updatePackage, addPackage, removePackage, setPackages,
      areaSummaries, areaZones,
      isLoadingPackages,
    }}>
      {children}
    </OrchestratorCtx.Provider>
  );
}
