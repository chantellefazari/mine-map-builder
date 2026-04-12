import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Filter, Download, Plus, FolderTree, Wrench, Zap, ShieldAlert,
  Building2, ClipboardList, Package, ListChecks, ChevronDown, ChevronRight,
  Hash, Clock, AlertTriangle, CheckCircle2, Settings2, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { usePMasterList } from "@/hooks/usePMData";
import { format } from "date-fns";
import { PlannerTreeExplorer } from "./PlannerTreeExplorer";
import { PlannerFilterBar } from "./PlannerFilterBar";

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
}

function getWoTypeFromNumber(woNum: string): { type: PlannerItem["woType"]; code: string } {
  if (woNum.startsWith("WO-12")) return { type: "PM", code: "12" };
  if (woNum.startsWith("WO-13")) return { type: "Breakdown", code: "13" };
  if (woNum.startsWith("WO-14")) return { type: "Shutdown", code: "14" };
  return { type: "General", code: "11" };
}

const WO_TYPE_CONFIG = {
  General: { label: "General", code: "11", color: "bg-emerald-500", textColor: "text-emerald-700" },
  PM: { label: "PM", code: "12", color: "bg-blue-500", textColor: "text-blue-700" },
  Breakdown: { label: "Breakdown", code: "13", color: "bg-red-500", textColor: "text-red-700" },
  Shutdown: { label: "Shutdown", code: "14", color: "bg-amber-500", textColor: "text-amber-700" },
};

export function AdvancedPlannerView() {
  const { workOrders } = useWorkOrders();
  const { pms, isLoading: loadingPMs } = usePMasterList();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterWOType, setFilterWOType] = useState("All");
  const [filterArea, setFilterArea] = useState("All");
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterFrequency, setFilterFrequency] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

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
        tasks: Array.isArray(pm.tasks) ? pm.tasks : [],
        source: "pm",
        sourceId: pm.id,
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

  // Filter options
  const filterOptions = useMemo(() => ({
    areas: [...new Set(allItems.map(i => i.area).filter(Boolean))].sort(),
    disciplines: [...new Set(allItems.map(i => i.discipline).filter(Boolean))].sort(),
    frequencies: [...new Set(allItems.map(i => i.frequency).filter(Boolean))].sort(),
    priorities: [...new Set(allItems.map(i => i.priority).filter(Boolean))].sort(),
    statuses: [...new Set(allItems.map(i => i.status).filter(Boolean))].sort(),
  }), [allItems]);

  // Stats
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

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] gap-0">
      {/* Command bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Maintenance Planner</span>
          </div>
          <div className="h-5 w-px bg-border" />
          {/* Type chips */}
          {Object.entries(WO_TYPE_CONFIG).map(([key, cfg]) => {
            const count = key === "PM" ? stats.pm : key === "General" ? stats.general : key === "Breakdown" ? stats.breakdown : stats.shutdown;
            const isActive = filterWOType === key;
            return (
              <button
                key={key}
                onClick={() => setFilterWOType(filterWOType === key ? "All" : key)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all border",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", cfg.color)} />
                {cfg.label}
                <span className="tabular-nums">{count}</span>
              </button>
            );
          })}
          <div className="h-5 w-px bg-border" />
          <span className="text-[10px] text-muted-foreground tabular-nums">{stats.total} items · {stats.areas} areas · {stats.assets} assets · {stats.totalHrs.toFixed(0)} hrs</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search plans, assets, WO#..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-64 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={exportCSV}>
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <PlannerFilterBar
        filterArea={filterArea} setFilterArea={setFilterArea}
        filterDiscipline={filterDiscipline} setFilterDiscipline={setFilterDiscipline}
        filterFrequency={filterFrequency} setFilterFrequency={setFilterFrequency}
        filterPriority={filterPriority} setFilterPriority={setFilterPriority}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        options={filterOptions}
      />

      {/* Tree Explorer */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <PlannerTreeExplorer items={filteredItems} />
      </div>
    </div>
  );
}
