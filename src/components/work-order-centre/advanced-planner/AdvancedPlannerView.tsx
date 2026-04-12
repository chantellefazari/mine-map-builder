import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  Search, Filter, ChevronDown, ChevronRight, BarChart3, Download,
  Calendar, RefreshCw, ClipboardList, Wrench, Zap, Truck, Settings2,
  Eye, EyeOff, GripVertical, ChevronLeft, ChevronRight as ChevronRightIcon,
  ListTree, LayoutGrid, Clock, AlertTriangle, CheckCircle2, Pause,
  ArrowUpDown, SlidersHorizontal, FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import { usePMasterList } from "@/hooks/usePMData";
import { PMData } from "@/components/pm-design/PMFrequencySection";
import {
  format, addWeeks, startOfWeek, getISOWeek, getYear, parseISO, addDays,
  differenceInWeeks, isValid,
} from "date-fns";
import { AdvancedPlannerFilters } from "./AdvancedPlannerFilters";
import { AdvancedPlannerTable } from "./AdvancedPlannerTable";
import { AdvancedPlannerGantt } from "./AdvancedPlannerGantt";

export type PlannerViewMode = "table" | "gantt";
export type TimeHorizon = "4" | "8" | "13" | "26" | "52";

export interface PlannerRow {
  id: string;
  area: string;
  woNumber: string;
  assetNumber: string;
  woType: "General" | "PM" | "Breakdown" | "Shutdown";
  assetType: string;
  taskName: string;
  frequency: string;
  estimatedHours: number;
  priority: string;
  status: string;
  nextDue: string | null;
  discipline: string;
  trade: string;
  assignedTo: string;
  functionalLocation: string;
  materialList: string;
  dutyType: string;
  source: "wo" | "pm";
  sourceId: string;
  // Weekly occurrence markers - week number keys, value = planned count
  weekMarkers: Record<string, number>;
}

// Frequency -> weeks between occurrences
const FREQ_TO_WEEKS: Record<string, number> = {
  "Daily": 0.14,
  "1 Week": 1,
  "2 Week": 2,
  "4 Week": 4,
  "6 Week": 6,
  "8 Week": 8,
  "12 Week": 12,
  "24 Week": 24,
  "26 Week": 26,
  "52 Week": 52,
};

function getWoType(wo: WorkOrder): PlannerRow["woType"] {
  const wn = wo.wo_number || "";
  if (wn.startsWith("WO-12")) return "PM";
  if (wn.startsWith("WO-13")) return "Breakdown";
  if (wn.startsWith("WO-14")) return "Shutdown";
  return "General";
}

function buildWeekKey(date: Date): string {
  return `${getYear(date)}-W${String(getISOWeek(date)).padStart(2, "0")}`;
}

function generateWeekMarkers(frequency: string, nextDue: string | null, horizonWeeks: number, refDate: Date): Record<string, number> {
  const markers: Record<string, number> = {};
  const freqWeeks = FREQ_TO_WEEKS[frequency];
  if (!freqWeeks || !nextDue) return markers;
  
  const dueDate = parseISO(nextDue);
  if (!isValid(dueDate)) return markers;
  
  const weekInterval = Math.max(1, Math.round(freqWeeks));
  
  // Generate markers forward from next due
  let current = dueDate;
  for (let i = 0; i < 100; i++) {
    const wDiff = differenceInWeeks(current, refDate);
    if (wDiff > horizonWeeks) break;
    if (wDiff >= 0) {
      const key = buildWeekKey(current);
      markers[key] = (markers[key] || 0) + 1;
    }
    current = addWeeks(current, weekInterval);
  }
  
  return markers;
}

export function AdvancedPlannerView() {
  const { workOrders } = useWorkOrders();
  const { pms, isLoading: loadingPMs } = usePMasterList();
  
  const [viewMode, setViewMode] = useState<PlannerViewMode>("table");
  const [horizon, setHorizon] = useState<TimeHorizon>("13");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchWO, setSearchWO] = useState("");
  
  // Filters
  const [filterArea, setFilterArea] = useState("All");
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [filterWOType, setFilterWOType] = useState("All");
  const [filterFrequency, setFilterFrequency] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDuty, setFilterDuty] = useState("All");

  const [weekOffset, setWeekOffset] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [supervisorMode, setSupervisorMode] = useState(false);

  const today = new Date();
  const refDate = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
  const horizonWeeks = parseInt(horizon);

  // Build week columns
  const weekColumns = useMemo(() => {
    return Array.from({ length: horizonWeeks }, (_, i) => {
      const weekStart = addWeeks(refDate, i);
      const weekNum = getISOWeek(weekStart);
      const year = getYear(weekStart);
      const key = buildWeekKey(weekStart);
      const startDay = format(weekStart, "d MMM");
      const endDay = format(addDays(weekStart, 6), "d MMM");
      const monthYear = format(weekStart, "MMM yyyy");
      return { key, weekNum, year, startDay, endDay, monthYear, date: weekStart };
    });
  }, [refDate, horizonWeeks]);

  // Group week columns by month for header grouping
  const monthGroups = useMemo(() => {
    const groups: { label: string; span: number }[] = [];
    let currentMonth = "";
    for (const wc of weekColumns) {
      if (wc.monthYear !== currentMonth) {
        currentMonth = wc.monthYear;
        groups.push({ label: currentMonth, span: 1 });
      } else {
        groups[groups.length - 1].span++;
      }
    }
    return groups;
  }, [weekColumns]);

  // Build unified planner rows from PMs + WOs
  const allRows: PlannerRow[] = useMemo(() => {
    const rows: PlannerRow[] = [];

    // PM rows
    for (const pm of pms) {
      const row: PlannerRow = {
        id: `pm-${pm.id}`,
        area: extractArea(pm.assetNumber),
        woNumber: "",
        assetNumber: pm.assetNumber || "",
        woType: "PM",
        assetType: pm.equipmentType || "",
        taskName: pm.pmName,
        frequency: pm.frequency || "",
        estimatedHours: parseFloat(pm.estimatedDuration) || 1,
        priority: "Standard",
        status: pm.status || "Draft",
        nextDue: null, // Will be set from WO link or calculated
        discipline: pm.discipline || "",
        trade: pm.discipline || "",
        assignedTo: "",
        functionalLocation: "",
        materialList: (pm.requiredTools || []).join(", "),
        dutyType: pm.dutyType || "Online",
        source: "pm",
        sourceId: pm.id,
        weekMarkers: {},
      };
      // Generate forward schedule markers based on frequency
      if (pm.frequency) {
        // Use a synthetic next-due based on today for PMs without explicit dates
        const syntheticDue = format(today, "yyyy-MM-dd");
        row.nextDue = syntheticDue;
        row.weekMarkers = generateWeekMarkers(pm.frequency, syntheticDue, horizonWeeks, refDate);
      }
      rows.push(row);
    }

    // WO rows
    for (const wo of workOrders) {
      if (wo.status === "Closed" || wo.status === "Cancelled") continue;
      const woType = getWoType(wo);
      rows.push({
        id: `wo-${wo.id}`,
        area: extractAreaFromFL(wo.functional_location),
        woNumber: wo.wo_number || "",
        assetNumber: wo.asset_id || "",
        woType,
        assetType: "",
        taskName: wo.problem_description || wo.wo_number,
        frequency: woType === "PM" ? "" : "Once",
        estimatedHours: parseFloat(wo.labour_hours) || 0,
        priority: wo.priority || "Standard",
        status: wo.status || "Planning",
        nextDue: wo.scheduled_date || null,
        discipline: wo.trade || "",
        trade: wo.trade || "",
        assignedTo: wo.assigned_to || "",
        functionalLocation: wo.functional_location || "",
        materialList: wo.parts_used || "",
        dutyType: "",
        source: "wo",
        sourceId: wo.id,
        weekMarkers: wo.scheduled_date ? { [buildWeekKey(parseISO(wo.scheduled_date))]: 1 } : {},
      });
    }

    return rows;
  }, [pms, workOrders, horizonWeeks, refDate]);

  // Apply filters
  const filteredRows = useMemo(() => {
    let rows = allRows;
    if (filterArea !== "All") rows = rows.filter(r => r.area === filterArea);
    if (filterDiscipline !== "All") rows = rows.filter(r => r.discipline === filterDiscipline);
    if (filterWOType !== "All") rows = rows.filter(r => r.woType === filterWOType);
    if (filterFrequency !== "All") rows = rows.filter(r => r.frequency === filterFrequency);
    if (filterPriority !== "All") rows = rows.filter(r => r.priority === filterPriority);
    if (filterStatus !== "All") rows = rows.filter(r => r.status === filterStatus);
    if (filterDuty !== "All") rows = rows.filter(r => r.dutyType === filterDuty);
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(r =>
        r.taskName.toLowerCase().includes(q) ||
        r.assetNumber.toLowerCase().includes(q) ||
        r.assetType.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q)
      );
    }
    if (searchWO.trim()) {
      const q = searchWO.toLowerCase();
      rows = rows.filter(r => r.woNumber.toLowerCase().includes(q));
    }

    return rows;
  }, [allRows, filterArea, filterDiscipline, filterWOType, filterFrequency, filterPriority, filterStatus, filterDuty, searchQuery, searchWO]);

  // Extract unique values for filter dropdowns
  const filterOptions = useMemo(() => ({
    areas: [...new Set(allRows.map(r => r.area).filter(Boolean))].sort(),
    disciplines: [...new Set(allRows.map(r => r.discipline).filter(Boolean))].sort(),
    frequencies: [...new Set(allRows.map(r => r.frequency).filter(Boolean))].sort(),
    priorities: [...new Set(allRows.map(r => r.priority).filter(Boolean))].sort(),
    statuses: [...new Set(allRows.map(r => r.status).filter(Boolean))].sort(),
    duties: [...new Set(allRows.map(r => r.dutyType).filter(Boolean))].sort(),
  }), [allRows]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredRows.length;
    const pmCount = filteredRows.filter(r => r.woType === "PM").length;
    const woCount = filteredRows.filter(r => r.woType === "General").length;
    const bdCount = filteredRows.filter(r => r.woType === "Breakdown").length;
    const sdCount = filteredRows.filter(r => r.woType === "Shutdown").length;
    const totalHrs = filteredRows.reduce((s, r) => s + r.estimatedHours, 0);
    return { total, pmCount, woCount, bdCount, sdCount, totalHrs };
  }, [filteredRows]);

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ["Area", "WO #", "Asset #", "WO Type", "Asset Type", "Task Name", "Frequency", "Est. Hours", "Priority", "Status", "Next Due", "Discipline", "Duty"];
    const csvRows = [headers.join(",")];
    for (const r of filteredRows) {
      csvRows.push([
        r.area, r.woNumber, r.assetNumber, r.woType, r.assetType,
        `"${r.taskName.replace(/"/g, '""')}"`,
        r.frequency, r.estimatedHours, r.priority, r.status, r.nextDue || "", r.discipline, r.dutyType,
      ].join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `advanced-planner-${format(today, "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredRows]);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full gap-3">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Advanced Planner Schedule</h1>
              <p className="text-xs text-muted-foreground">Drag and drop work orders to schedule</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Supervisor / Planner toggle */}
            <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5">
              <span className={cn("text-xs font-medium", !supervisorMode ? "text-foreground" : "text-muted-foreground")}>Supervisor</span>
              <Switch checked={supervisorMode} onCheckedChange={setSupervisorMode} />
              <span className={cn("text-xs font-medium", supervisorMode ? "text-foreground" : "text-muted-foreground")}>Planner</span>
            </div>

            {/* View toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <ListTree className="w-3.5 h-3.5" /> Table
              </button>
              <button
                onClick={() => setViewMode("gantt")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "gantt" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Gantt
              </button>
            </div>

            {/* Horizon */}
            <Select value={horizon} onValueChange={(v) => setHorizon(v as TimeHorizon)}>
              <SelectTrigger className="w-44 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 weeks (month)</SelectItem>
                <SelectItem value="8">8 weeks</SelectItem>
                <SelectItem value="13">13 weeks (quarter)</SelectItem>
                <SelectItem value="26">26 weeks (half year)</SelectItem>
                <SelectItem value="52">52 weeks (year)</SelectItem>
              </SelectContent>
            </Select>

            {/* Counts */}
            <Badge variant="secondary" className="text-xs px-3 py-1">{stats.total} PMs</Badge>

            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={exportCSV}>
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <AdvancedPlannerFilters
          filterArea={filterArea} setFilterArea={setFilterArea}
          filterDiscipline={filterDiscipline} setFilterDiscipline={setFilterDiscipline}
          filterWOType={filterWOType} setFilterWOType={setFilterWOType}
          filterFrequency={filterFrequency} setFilterFrequency={setFilterFrequency}
          filterPriority={filterPriority} setFilterPriority={setFilterPriority}
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          filterDuty={filterDuty} setFilterDuty={setFilterDuty}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          searchWO={searchWO} setSearchWO={setSearchWO}
          options={filterOptions}
        />

        {/* Stats row */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
          <span className="font-medium text-foreground">{stats.total} items</span>
          <span>•</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500" /> {stats.pmCount} PM</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> {stats.woCount} General</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" /> {stats.bdCount} Breakdown</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500" /> {stats.sdCount} Shutdown</span>
          <span>•</span>
          <span>{stats.totalHrs.toFixed(0)} total hrs</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setWeekOffset(prev => prev - parseInt(horizon))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setWeekOffset(0)}>Today</Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setWeekOffset(prev => prev + parseInt(horizon))}>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 border border-border rounded-lg overflow-hidden bg-card">
          {viewMode === "table" ? (
            <AdvancedPlannerTable
              rows={filteredRows}
              weekColumns={weekColumns}
              monthGroups={monthGroups}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
              supervisorMode={supervisorMode}
            />
          ) : (
            <AdvancedPlannerGantt
              rows={filteredRows}
              weekColumns={weekColumns}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

// Helpers
function extractArea(assetNumber: string): string {
  if (!assetNumber) return "—";
  const prefix = assetNumber.split("-")[0]?.toUpperCase() || "";
  const areaMap: Record<string, string> = {
    "ML": "MILL", "BM": "MILL", "CY": "MILL", "SC": "MILL",
    "GR": "REC", "KN": "REC", "EL": "REC", "FP": "REC", "LT": "REC",
    "TK": "TAIL", "PP": "TAIL",
    "GN": "UTL", "CP": "UTL", "RO": "UTL", "AC": "UTL",
    "CB": "CRU", "JC": "CRU",
    "KBT": "MOB", "HV": "MOB",
  };
  for (const [k, v] of Object.entries(areaMap)) {
    if (prefix.startsWith(k)) return v;
  }
  return "—";
}

function extractAreaFromFL(fl: string): string {
  if (!fl) return "—";
  const parts = fl.split("-");
  if (parts.length >= 3) return parts[2];
  return "—";
}
