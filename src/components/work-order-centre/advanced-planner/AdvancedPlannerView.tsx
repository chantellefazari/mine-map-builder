import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search, Download, FolderTree, ClipboardList, FileText, ListChecks,
  LayoutDashboard, Wrench, Package, TrendingUp, Building2, Users, CalendarRange,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { usePMasterList } from "@/hooks/usePMData";
import { useMaterialReadiness } from "@/hooks/useMaterialReadiness";
import { format } from "date-fns";
import { PlannerTreeExplorer } from "./PlannerTreeExplorer";
import { PlannerFilterBar } from "./PlannerFilterBar";
import { PlannerOverviewTab } from "./PlannerOverviewTab";
import { PlannerWorkOrdersTab } from "./PlannerWorkOrdersTab";
import { PlannerMaintenancePlansTab } from "./PlannerMaintenancePlansTab";
import { PlannerRoundsTab } from "./PlannerRoundsTab";
import { PlannerForecastTab } from "./PlannerForecastTab";
import { PlannerShutdownImpactTab } from "./PlannerShutdownImpactTab";
import { PlannerCapacityTab } from "./PlannerCapacityTab";
import { PlannerForwardPlanTab } from "./PlannerForwardPlanTab";
import { PlannerResourceLevelingTab } from "./PlannerResourceLevelingTab";
import { ForwardPlanScheduleDialog } from "./ForwardPlanScheduleDialog";
import { PlannerItemDetail } from "./PlannerItemDetail";

export interface PlannerItem {
  id: string;
  area: string;
  subArea: string;
  assetNumber: string;
  assetName: string;
  woNumber: string;
  woType: "General" | "PM" | "Breakdown" | "Shutdown";
  woTypeCode: string;
  taskName: string;
  frequency: string;
  estimatedHours: number;
  priority: string;
  status: string;
  discipline: string;
  trade: string;
  assignedTo: string;
  scheduledDate: string | null;
  dutyType: string;
  materialList: string[];
  requiredTools: string[];
  safetyNotes: string[];
  tasks: any[];
  source: "wo" | "pm";
  sourceId: string;
  planCategory: string;
  activityType: string;
}

/** Flatten PM tasks from either flat array or {sections: [{tasks, equipmentName}]} format */
export function flattenPMTasks(tasks: any): any[] {
  if (Array.isArray(tasks)) return tasks;
  if (tasks && typeof tasks === "object" && Array.isArray(tasks.sections)) {
    const flat: any[] = [];
    for (const section of tasks.sections) {
      if (Array.isArray(section.tasks)) {
        for (const t of section.tasks) {
          flat.push({
            ...t,
            section: section.equipmentName || section.sectionName || "",
          });
        }
      }
    }
    return flat;
  }
  return [];
}


function getWoTypeFromNumber(woNum: string): { type: PlannerItem["woType"]; code: string } {
  if (woNum.startsWith("WO-12")) return { type: "PM", code: "12" };
  if (woNum.startsWith("WO-13")) return { type: "Breakdown", code: "13" };
  if (woNum.startsWith("WO-14")) return { type: "Shutdown", code: "14" };
  return { type: "General", code: "11" };
}

export const WO_TYPE_CONFIG = {
  General: { label: "General", code: "11", color: "bg-emerald-500", textColor: "text-emerald-700" },
  PM: { label: "PM", code: "12", color: "bg-blue-500", textColor: "text-blue-700" },
  Breakdown: { label: "Breakdown", code: "13", color: "bg-red-500", textColor: "text-red-700" },
  Shutdown: { label: "Shutdown", code: "14", color: "bg-amber-500", textColor: "text-amber-700" },
};

type PlannerTab = "overview" | "maintenance-plans" | "work-orders" | "forward-plan" | "asset-tree" | "rounds" | "forecast" | "capacity" | "resource-leveling" | "schedule-blocks";

const TABS: { key: PlannerTab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "maintenance-plans", label: "Maintenance Plans", icon: ClipboardList },
  { key: "work-orders", label: "Work Orders", icon: FileText },
  { key: "forward-plan", label: "Forward Plan", icon: CalendarRange },
  { key: "rounds", label: "Rounds", icon: Package },
  { key: "forecast", label: "Forecast", icon: TrendingUp },
  { key: "capacity", label: "Capacity", icon: Users },
  { key: "resource-leveling", label: "Resource Leveling", icon: Layers },
  { key: "schedule-blocks", label: "Schedule Blocks", icon: Building2 },
  { key: "asset-tree", label: "Asset Tree", icon: FolderTree },
];

export function AdvancedPlannerView() {
  const { workOrders } = useWorkOrders();
  const { pms, isLoading: loadingPMs } = usePMasterList();
  const { getReadiness, readinessMap } = useMaterialReadiness();
  const [activeTab, setActiveTab] = useState<PlannerTab>("overview");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterWOType, setFilterWOType] = useState("All");
  const [filterArea, setFilterArea] = useState("All");
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterFrequency, setFilterFrequency] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  // Forward Plan interactions
  const [fpScheduleOpen, setFpScheduleOpen] = useState(false);
  const [fpScheduleItem, setFpScheduleItem] = useState<PlannerItem | null>(null);
  const [fpScheduleDate, setFpScheduleDate] = useState<Date | undefined>();
  const [fpDetailItem, setFpDetailItem] = useState<PlannerItem | null>(null);
  // Build unified items
  const allItems: PlannerItem[] = useMemo(() => {
    const items: PlannerItem[] = [];

    for (const pm of pms) {
      const areaParts = (pm.assetNumber || "").split("-");
      items.push({
        id: `pm-${pm.id}`,
        area: areaParts.length > 1 ? areaParts[0] : "Unassigned",
        subArea: areaParts.length > 2 ? areaParts.slice(0, 2).join("-") : "",
        assetNumber: pm.assetNumber || "",
        assetName: pm.equipmentType || pm.assetNumber || "",
        woNumber: "",
        woType: "PM",
        woTypeCode: "12",
        taskName: pm.pmName,
        frequency: pm.frequency || "",
        estimatedHours: parseFloat(pm.estimatedDuration) || 1,
        priority: "Standard",
        status: pm.status || "Draft",
        discipline: pm.discipline || "",
        trade: pm.discipline || "",
        assignedTo: "",
        scheduledDate: null,
        dutyType: pm.dutyType || "Online",
        materialList: pm.requiredTools || [],
        requiredTools: pm.requiredTools || [],
        safetyNotes: pm.safetyNotes || [],
        tasks: flattenPMTasks(pm.tasks),
        source: "pm",
        sourceId: pm.id,
        planCategory: (pm as any).planCategory || "Preventive",
        activityType: "INS",
      });
    }

    for (const wo of workOrders) {
      if (wo.status === "Closed" || wo.status === "Cancelled") continue;
      const { type, code } = getWoTypeFromNumber(wo.wo_number || "");
      const areaParts = (wo.asset_id || "").split("-");
      items.push({
        id: `wo-${wo.id}`,
        area: areaParts.length > 1 ? areaParts[0] : (wo.functional_location?.split("-")?.[0] || "Unassigned"),
        subArea: wo.functional_location || "",
        assetNumber: wo.asset_id || "",
        assetName: wo.asset_id || "",
        woNumber: wo.wo_number || "",
        woType: type,
        woTypeCode: code,
        taskName: wo.problem_description || wo.wo_number || "",
        frequency: type === "PM" ? "" : "Once",
        estimatedHours: parseFloat(wo.labour_hours as any) || 0,
        priority: wo.priority || "Standard",
        status: wo.status || "Planning",
        discipline: wo.trade || "",
        trade: wo.trade || "",
        assignedTo: wo.assigned_to || "",
        scheduledDate: wo.scheduled_date || null,
        dutyType: "",
        materialList: wo.parts_used ? [wo.parts_used] : [],
        requiredTools: [],
        safetyNotes: [],
        tasks: [],
        source: "wo",
        sourceId: wo.id,
        planCategory: "Preventive",
        activityType: (wo as any).activity_type || "",
      });
    }

    return items;
  }, [pms, workOrders]);

  // Apply filters
  const filteredItems = useMemo(() => {
    let items = allItems;
    if (filterWOType !== "All") items = items.filter(i => i.woType === filterWOType);
    if (filterArea !== "All") items = items.filter(i => i.area === filterArea);
    if (filterDiscipline !== "All") items = items.filter(i => i.discipline === filterDiscipline);
    if (filterStatus !== "All") items = items.filter(i => i.status === filterStatus);
    if (filterFrequency !== "All") items = items.filter(i => i.frequency === filterFrequency);
    if (filterPriority !== "All") items = items.filter(i => i.priority === filterPriority);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        i.taskName.toLowerCase().includes(q) ||
        i.assetNumber.toLowerCase().includes(q) ||
        i.woNumber.toLowerCase().includes(q) ||
        i.area.toLowerCase().includes(q) ||
        i.discipline.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allItems, filterWOType, filterArea, filterDiscipline, filterStatus, filterFrequency, filterPriority, searchQuery]);

  const filterOptions = useMemo(() => ({
    areas: [...new Set(allItems.map(i => i.area).filter(Boolean))].sort(),
    disciplines: [...new Set(allItems.map(i => i.discipline).filter(Boolean))].sort(),
    frequencies: [...new Set(allItems.map(i => i.frequency).filter(Boolean))].sort(),
    priorities: [...new Set(allItems.map(i => i.priority).filter(Boolean))].sort(),
    statuses: [...new Set(allItems.map(i => i.status).filter(Boolean))].sort(),
  }), [allItems]);

  const stats = useMemo(() => ({
    total: filteredItems.length,
    pm: filteredItems.filter(i => i.woType === "PM").length,
    general: filteredItems.filter(i => i.woType === "General").length,
    breakdown: filteredItems.filter(i => i.woType === "Breakdown").length,
    shutdown: filteredItems.filter(i => i.woType === "Shutdown").length,
    totalHrs: filteredItems.reduce((s, i) => s + i.estimatedHours, 0),
    areas: new Set(filteredItems.map(i => i.area)).size,
    assets: new Set(filteredItems.map(i => i.assetNumber)).size,
  }), [filteredItems]);

  const exportCSV = useCallback(() => {
    const headers = ["Area", "WO #", "WO Type", "Asset #", "Task Name", "Frequency", "Est Hours", "Priority", "Status", "Discipline", "Scheduled"];
    const csvRows = [headers.join(",")];
    for (const r of filteredItems) {
      csvRows.push([r.area, r.woNumber, r.woType, r.assetNumber, `"${r.taskName.replace(/"/g, '""')}"`, r.frequency, r.estimatedHours, r.priority, r.status, r.discipline, r.scheduledDate || ""].join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `advanced-planner-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }, [filteredItems]);

  const showFilters = activeTab === "work-orders" || activeTab === "asset-tree" || activeTab === "rounds" || activeTab === "forecast";

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] gap-0">
      {/* Top bar with tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-0.5 bg-muted/40 rounded-lg p-0.5">
            {TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search plans, assets, WO#..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-56 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={exportCSV}>
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Filter bar - only on relevant tabs */}
      {showFilters && (
        <PlannerFilterBar
          filterArea={filterArea} setFilterArea={setFilterArea}
          filterDiscipline={filterDiscipline} setFilterDiscipline={setFilterDiscipline}
          filterFrequency={filterFrequency} setFilterFrequency={setFilterFrequency}
          filterPriority={filterPriority} setFilterPriority={setFilterPriority}
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          options={filterOptions}
        />
      )}

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "overview" && (
          <PlannerOverviewTab
            items={filteredItems}
            allItems={allItems}
            stats={stats}
            onNavigate={setActiveTab}
            filterWOType={filterWOType}
            setFilterWOType={setFilterWOType}
          />
        )}
        {activeTab === "maintenance-plans" && (
          <PlannerMaintenancePlansTab items={allItems.filter(i => i.source === "pm")} />
        )}
        {activeTab === "work-orders" && (
          <PlannerWorkOrdersTab items={filteredItems.filter(i => i.source === "wo")} getReadiness={getReadiness} />
        )}
        {activeTab === "forward-plan" && (
          <PlannerForwardPlanTab
            items={allItems}
            getReadiness={getReadiness}
            onEditSchedule={(item, date) => {
              setFpScheduleItem(item);
              setFpScheduleDate(date);
              setFpScheduleOpen(true);
            }}
            onViewWorkOrder={(item) => {
              setFpDetailItem(item);
            }}
          />
        )}
        {activeTab === "rounds" && (
          <PlannerRoundsTab items={filteredItems} />
        )}
        {activeTab === "forecast" && (
          <PlannerForecastTab items={filteredItems} />
        )}
        {activeTab === "schedule-blocks" && (
          <PlannerShutdownImpactTab items={filteredItems} />
        )}
        {activeTab === "capacity" && (
          <PlannerCapacityTab items={filteredItems} />
        )}
        {activeTab === "asset-tree" && (
          <PlannerTreeExplorer items={filteredItems} />
        )}
      </div>

      {/* Forward Plan Schedule Dialog */}
      <ForwardPlanScheduleDialog
        item={fpScheduleItem}
        initialDate={fpScheduleDate}
        open={fpScheduleOpen}
        onOpenChange={(open) => {
          setFpScheduleOpen(open);
          if (!open) { setFpScheduleItem(null); setFpScheduleDate(undefined); }
        }}
      />

      {/* Forward Plan Detail Side Panel */}
      {fpDetailItem && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setFpDetailItem(null)} />
          <div className="w-[480px] bg-card border-l border-border shadow-2xl animate-in slide-in-from-right">
            <PlannerItemDetail item={fpDetailItem} onClose={() => setFpDetailItem(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
