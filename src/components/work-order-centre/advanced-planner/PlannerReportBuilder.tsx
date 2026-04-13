import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import { usePMasterList } from "@/hooks/usePMData";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Download, Filter, Columns3, Group, FileDown, RotateCcw, Search,
  Zap, FileText, ClipboardList, ShieldAlert, Activity, Package, Gauge, Wrench,
  BarChart3, Hash, Clock,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type DataSource = "work_orders" | "work_requests" | "pm_schedules" | "failure_records" | "permits" | "assets" | "purchase_orders" | "equipment_service" | "condition_triggers";

interface ColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

interface FilterDef {
  field: string;
  operator: "equals" | "contains" | "gte" | "lte";
  value: string;
}

interface ReportPreset {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  source: DataSource;
  filters: FilterDef[];
  groupBy: string;
  visibleColumns?: string[];
}

const REPORT_PRESETS: ReportPreset[] = [
  {
    id: "open_wo_by_type",
    label: "Open WOs by Type",
    description: "All open work orders grouped by WO type",
    icon: FileText,
    source: "work_orders",
    filters: [{ field: "status", operator: "equals", value: "In Progress" }],
    groupBy: "work_type",
  },
  {
    id: "overdue_pms",
    label: "PM Schedule Overview",
    description: "All active PM schedules grouped by frequency",
    icon: ClipboardList,
    source: "pm_schedules",
    filters: [{ field: "status", operator: "equals", value: "Active" }],
    groupBy: "frequency",
  },
  {
    id: "weekly_oos",
    label: "Out of Scope WOs",
    description: "All Out of Scope work orders for tracking contractor costs",
    icon: Wrench,
    source: "work_orders",
    filters: [{ field: "work_type", operator: "equals", value: "Out of Scope" }],
    groupBy: "status",
  },
  {
    id: "failures_by_area",
    label: "Failures by Area",
    description: "Failure records grouped by area for reliability analysis",
    icon: Activity,
    source: "failure_records",
    filters: [],
    groupBy: "area",
  },
  {
    id: "open_permits",
    label: "Active Permits",
    description: "All non-closed permits to work",
    icon: ShieldAlert,
    source: "permits",
    filters: [{ field: "status", operator: "contains", value: "" }],
    groupBy: "permit_type",
  },
  {
    id: "outstanding_pos",
    label: "Outstanding POs",
    description: "Purchase orders not yet received",
    icon: Package,
    source: "purchase_orders",
    filters: [{ field: "status", operator: "equals", value: "Ordered" }],
    groupBy: "supplier",
  },
  {
    id: "cbm_warnings",
    label: "CBM Warning/Critical",
    description: "Condition triggers in warning or critical state",
    icon: Gauge,
    source: "condition_triggers",
    filters: [{ field: "status", operator: "contains", value: "" }],
    groupBy: "area",
  },
  {
    id: "wo_by_discipline",
    label: "WOs by Discipline",
    description: "All work orders grouped by trade/discipline",
    icon: BarChart3,
    source: "work_orders",
    filters: [],
    groupBy: "trade",
  },
];

const SOURCE_CONFIG: Record<DataSource, { label: string; columns: { key: string; label: string }[] }> = {
  work_orders: {
    label: "Work Orders",
    columns: [
      { key: "wo_number", label: "WO #" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "work_type", label: "Type" },
      { key: "asset_id", label: "Asset" },
      { key: "functional_location", label: "Location" },
      { key: "problem_description", label: "Description" },
      { key: "trade", label: "Discipline" },
      { key: "assigned_to", label: "Assigned To" },
      { key: "date_raised", label: "Date Raised" },
      { key: "scheduled_date", label: "Scheduled" },
      { key: "date_completed", label: "Completed" },
      { key: "duty_type", label: "Duty Type" },
      { key: "requested_by", label: "Requested By" },
      { key: "labour_hours", label: "Labour Hours" },
      { key: "work_performed", label: "Work Performed" },
      { key: "parts_used", label: "Parts Used" },
    ],
  },
  work_requests: {
    label: "Work Requests",
    columns: [
      { key: "wr_number", label: "WR #" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "work_type", label: "Type" },
      { key: "asset_id", label: "Asset" },
      { key: "functional_location", label: "Location" },
      { key: "problem_description", label: "Description" },
      { key: "trade", label: "Discipline" },
      { key: "requested_by", label: "Requested By" },
      { key: "date_raised", label: "Date Raised" },
      { key: "linked_wo_id", label: "Linked WO" },
      { key: "approved_by", label: "Approved By" },
    ],
  },
  pm_schedules: {
    label: "PM Schedules",
    columns: [
      { key: "pm_name", label: "PM Name" },
      { key: "equipment_type", label: "Equipment" },
      { key: "frequency", label: "Frequency" },
      { key: "discipline", label: "Discipline" },
      { key: "duty_type", label: "Duty Type" },
      { key: "estimated_duration", label: "Est. Duration" },
      { key: "status", label: "Status" },
      { key: "asset_number", label: "Asset #" },
      { key: "skill_level", label: "Skill Level" },
      { key: "plan_category", label: "Category" },
      { key: "isolation_requirements", label: "Isolation" },
    ],
  },
  failure_records: {
    label: "Failure Records",
    columns: [
      { key: "asset_number", label: "Asset #" },
      { key: "asset_name", label: "Asset Name" },
      { key: "area", label: "Area" },
      { key: "failure_date", label: "Date" },
      { key: "failure_mode", label: "Mode" },
      { key: "failure_cause", label: "Cause" },
      { key: "failure_class", label: "Class" },
      { key: "severity", label: "Severity" },
      { key: "downtime_hours", label: "Downtime (hrs)" },
      { key: "corrective_action", label: "Corrective Action" },
      { key: "reported_by", label: "Reported By" },
    ],
  },
  permits: {
    label: "Permits to Work",
    columns: [
      { key: "permit_number", label: "Permit #" },
      { key: "permit_type", label: "Type" },
      { key: "status", label: "Status" },
      { key: "area", label: "Area" },
      { key: "description", label: "Description" },
      { key: "issued_by", label: "Issued By" },
      { key: "valid_from", label: "Valid From" },
      { key: "valid_to", label: "Valid To" },
      { key: "hot_work", label: "Hot Work" },
      { key: "isolation_required", label: "Isolation" },
    ],
  },
  assets: {
    label: "Asset Register",
    columns: [
      { key: "asset_number", label: "Asset #" },
      { key: "asset_name", label: "Asset Name" },
      { key: "area_label", label: "Area" },
      { key: "sub_area", label: "Sub Area" },
      { key: "parent_asset_label", label: "Parent Asset" },
      { key: "functional_location", label: "Func. Location" },
      { key: "area_code", label: "Area Code" },
      { key: "facility", label: "Facility" },
      { key: "rev_status", label: "Rev Status" },
      { key: "change_type", label: "Change Type" },
    ],
  },
  purchase_orders: {
    label: "Purchase Orders",
    columns: [
      { key: "po_number", label: "PO #" },
      { key: "supplier", label: "Supplier" },
      { key: "status", label: "Status" },
      { key: "description", label: "Description" },
      { key: "total_value", label: "Total Value" },
      { key: "order_date", label: "Order Date" },
      { key: "eta", label: "ETA" },
      { key: "date_received", label: "Received" },
      { key: "freight_company", label: "Freight Co." },
      { key: "supervisor", label: "Supervisor" },
      { key: "created_by", label: "Created By" },
      { key: "confirmed_on_site", label: "On Site" },
    ],
  },
  equipment_service: {
    label: "Equipment Service",
    columns: [
      { key: "equipment_name", label: "Equipment" },
      { key: "asset_number", label: "Asset #" },
      { key: "current_hours", label: "Current Hrs" },
      { key: "service_interval_hours", label: "Interval Hrs" },
      { key: "last_service_hours", label: "Last Service Hrs" },
      { key: "next_service_due_hours", label: "Next Due Hrs" },
      { key: "last_service_date", label: "Last Service" },
      { key: "status", label: "Status" },
      { key: "service_vendor", label: "Vendor" },
      { key: "notes", label: "Notes" },
    ],
  },
  condition_triggers: {
    label: "CBM Triggers",
    columns: [
      { key: "trigger_name", label: "Trigger" },
      { key: "asset_number", label: "Asset #" },
      { key: "asset_name", label: "Asset Name" },
      { key: "area", label: "Area" },
      { key: "trigger_type", label: "Type" },
      { key: "parameter_name", label: "Parameter" },
      { key: "threshold_value", label: "Threshold" },
      { key: "current_value", label: "Current" },
      { key: "threshold_unit", label: "Unit" },
      { key: "status", label: "Status" },
      { key: "auto_generate_wo", label: "Auto WO" },
      { key: "last_reading_date", label: "Last Reading" },
    ],
  },
};

const GROUPABLE_FIELDS: Record<DataSource, string[]> = {
  work_orders: ["status", "priority", "work_type", "trade", "duty_type"],
  work_requests: ["status", "priority", "work_type", "trade"],
  pm_schedules: ["frequency", "discipline", "duty_type", "status", "plan_category"],
  failure_records: ["area", "failure_class", "severity", "failure_mode"],
  permits: ["permit_type", "status", "area"],
  assets: ["area_label", "sub_area", "facility", "rev_status", "change_type"],
  purchase_orders: ["status", "supplier", "freight_company"],
  equipment_service: ["status", "service_vendor"],
  condition_triggers: ["area", "trigger_type", "status"],
};

// Numeric fields for summary stats
const NUMERIC_FIELDS: Record<DataSource, string[]> = {
  work_orders: ["labour_hours"],
  work_requests: [],
  pm_schedules: ["estimated_duration"],
  failure_records: ["downtime_hours"],
  permits: [],
  assets: [],
  purchase_orders: ["total_value"],
  equipment_service: ["current_hours", "service_interval_hours", "last_service_hours", "next_service_due_hours"],
  condition_triggers: ["threshold_value", "current_value"],
};

export function PlannerReportBuilder() {
  const [source, setSource] = useState<DataSource>("work_orders");
  const [columns, setColumns] = useState<ColumnDef[]>(() =>
    SOURCE_CONFIG.work_orders.columns.map((c, i) => ({ ...c, visible: i < 8 }))
  );
  const [filters, setFilters] = useState<FilterDef[]>([]);
  const [groupBy, setGroupBy] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [showPresets, setShowPresets] = useState(true);
  const [showStats, setShowStats] = useState(true);

  // Fetch data based on source
  const { workOrders } = useWorkOrders();
  const { workRequests } = useWorkRequests();
  const { pms } = usePMasterList();

  const failuresQuery = useQuery({
    queryKey: ["failure_records_report"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("failure_records").select("*").order("failure_date", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const permitsQuery = useQuery({
    queryKey: ["permits_report"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("permits_to_work").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const assetsQuery = useQuery({
    queryKey: ["assets_report"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("processing_plant_assets_rev_b").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  const poQuery = useQuery({
    queryKey: ["po_tracker_report"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("po_tracker").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const equipServiceQuery = useQuery({
    queryKey: ["equipment_service_report"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("equipment_service_tracking").select("*").order("equipment_name", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  const cbmQuery = useQuery({
    queryKey: ["condition_triggers_report"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("condition_triggers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  // Switch columns when source changes
  const handleSourceChange = useCallback((s: DataSource) => {
    setSource(s);
    setColumns(SOURCE_CONFIG[s].columns.map((c, i) => ({ ...c, visible: i < 8 })));
    setFilters([]);
    setGroupBy("");
    setSearchText("");
    setShowPresets(false);
  }, []);

  // Apply preset
  const applyPreset = useCallback((preset: ReportPreset) => {
    setSource(preset.source);
    const cols = SOURCE_CONFIG[preset.source].columns;
    setColumns(cols.map((c, i) => ({
      ...c,
      visible: preset.visibleColumns ? preset.visibleColumns.includes(c.key) : i < 8,
    })));
    setFilters(preset.filters);
    setGroupBy(preset.groupBy);
    setSearchText("");
    setDateFrom("");
    setDateTo("");
    setShowPresets(false);
  }, []);

  // Raw data for current source
  const rawData = useMemo((): any[] => {
    switch (source) {
      case "work_orders": return workOrders;
      case "work_requests": return workRequests;
      case "pm_schedules": return pms.map(pm => ({
        pm_name: pm.pmName,
        equipment_type: pm.equipmentType,
        frequency: pm.frequency,
        discipline: pm.discipline,
        duty_type: pm.dutyType,
        estimated_duration: pm.estimatedDuration,
        status: pm.status,
        asset_number: pm.assetNumber,
        skill_level: (pm as any).skillLevel || "",
        plan_category: (pm as any).planCategory || "Preventive",
        isolation_requirements: (pm as any).isolationRequirements || "",
      }));
      case "failure_records": return failuresQuery.data || [];
      case "permits": return permitsQuery.data || [];
      case "assets": return assetsQuery.data || [];
      case "purchase_orders": return poQuery.data || [];
      case "equipment_service": return equipServiceQuery.data || [];
      case "condition_triggers": return cbmQuery.data || [];
      default: return [];
    }
  }, [source, workOrders, workRequests, pms, failuresQuery.data, permitsQuery.data, assetsQuery.data, poQuery.data, equipServiceQuery.data, cbmQuery.data]);

  // Date field for each source
  const dateField = useMemo(() => {
    switch (source) {
      case "work_orders": return "date_raised";
      case "work_requests": return "date_raised";
      case "pm_schedules": return null;
      case "failure_records": return "failure_date";
      case "permits": return "valid_from";
      case "assets": return null;
      case "purchase_orders": return "order_date";
      case "equipment_service": return "last_service_date";
      case "condition_triggers": return "last_reading_date";
      default: return null;
    }
  }, [source]);

  // Apply filters
  const filteredData = useMemo(() => {
    let data = [...rawData];

    // Date range
    if (dateField && dateFrom) {
      data = data.filter(r => (r[dateField] || "") >= dateFrom);
    }
    if (dateField && dateTo) {
      data = data.filter(r => (r[dateField] || "") <= dateTo);
    }

    // Custom filters
    for (const f of filters) {
      data = data.filter(r => {
        const val = String(r[f.field] ?? "").toLowerCase();
        const fv = f.value.toLowerCase();
        if (f.operator === "equals") return val === fv;
        if (f.operator === "contains") return val.includes(fv);
        if (f.operator === "gte") return val >= fv;
        if (f.operator === "lte") return val <= fv;
        return true;
      });
    }

    // Search across visible columns
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      const visibleKeys = columns.filter(c => c.visible).map(c => c.key);
      data = data.filter(r =>
        visibleKeys.some(k => String(r[k] ?? "").toLowerCase().includes(q))
      );
    }

    return data;
  }, [rawData, dateField, dateFrom, dateTo, filters, searchText, columns]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    const numericFields = NUMERIC_FIELDS[source] || [];
    const stats: { field: string; label: string; sum: number; avg: number; min: number; max: number; count: number }[] = [];

    for (const fieldKey of numericFields) {
      const colDef = SOURCE_CONFIG[source].columns.find(c => c.key === fieldKey);
      const values = filteredData.map(r => parseFloat(r[fieldKey])).filter(v => !isNaN(v) && v > 0);
      if (values.length > 0) {
        stats.push({
          field: fieldKey,
          label: colDef?.label || fieldKey,
          sum: values.reduce((s, v) => s + v, 0),
          avg: values.reduce((s, v) => s + v, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length,
        });
      }
    }

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    for (const row of filteredData) {
      const s = String(row["status"] || row["Status"] || "Unknown");
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    }

    return { numericStats: stats, statusCounts };
  }, [filteredData, source]);

  // Grouped data
  const groupedData = useMemo(() => {
    if (!groupBy) return null;
    const groups: Record<string, any[]> = {};
    for (const row of filteredData) {
      const key = String(row[groupBy] || "Unspecified");
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    }
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredData, groupBy]);

  const visibleCols = columns.filter(c => c.visible);

  // Add filter
  const addFilter = useCallback(() => {
    const firstCol = columns[0]?.key || "";
    setFilters(prev => [...prev, { field: firstCol, operator: "contains", value: "" }]);
  }, [columns]);

  const removeFilter = useCallback((idx: number) => {
    setFilters(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateFilter = useCallback((idx: number, patch: Partial<FilterDef>) => {
    setFilters(prev => prev.map((f, i) => i === idx ? { ...f, ...patch } : f));
  }, []);

  // Toggle column visibility
  const toggleColumn = useCallback((key: string) => {
    setColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  }, []);

  // Export
  const exportCSV = useCallback(() => {
    const headers = visibleCols.map(c => c.label);
    const csvRows = [headers.join(",")];
    for (const row of filteredData) {
      csvRows.push(visibleCols.map(c => {
        const val = String(row[c.key] ?? "");
        return `"${val.replace(/"/g, '""')}"`;
      }).join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${source}-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredData, visibleCols, source]);

  const reset = useCallback(() => {
    setFilters([]);
    setGroupBy("");
    setDateFrom("");
    setDateTo("");
    setSearchText("");
    setColumns(SOURCE_CONFIG[source].columns.map((c, i) => ({ ...c, visible: i < 8 })));
    setShowPresets(true);
  }, [source]);

  const renderValue = (val: any) => {
    if (val === null || val === undefined || val === "") return <span className="text-muted-foreground">—</span>;
    if (typeof val === "boolean") return val ? "Yes" : "No";
    return String(val);
  };

  const renderTable = (data: any[]) => (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/30">
          {visibleCols.map(c => (
            <TableHead key={c.key} className="text-[10px] font-semibold uppercase tracking-wider py-2 px-3 whitespace-nowrap">
              {c.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.slice(0, 500).map((row, i) => (
          <TableRow key={i} className="hover:bg-muted/20">
            {visibleCols.map(c => (
              <TableCell key={c.key} className="text-xs py-1.5 px-3 max-w-[250px] truncate">
                {renderValue(row[c.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Quick report presets */}
      {showPresets && (
        <div className="px-4 py-3 border-b border-border bg-muted/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-foreground">Quick Reports</span>
            </div>
            <Button variant="ghost" size="sm" className="h-5 text-[10px] text-muted-foreground" onClick={() => setShowPresets(false)}>
              Hide
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {REPORT_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="flex items-start gap-2 p-2 rounded-lg border border-border bg-card hover:bg-muted/30 hover:border-primary/30 transition-all text-left"
              >
                <preset.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-semibold text-foreground">{preset.label}</div>
                  <div className="text-[9px] text-muted-foreground">{preset.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border bg-card">
        {/* Source */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Source</span>
          <Select value={source} onValueChange={(v) => handleSourceChange(v as DataSource)}>
            <SelectTrigger className="h-7 text-xs w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(SOURCE_CONFIG) as [DataSource, any][]).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="w-px h-5 bg-border" />

        {/* Date range */}
        {dateField && (
          <>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">From</span>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-7 w-32 text-xs" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">To</span>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-7 w-32 text-xs" />
            </div>
            <span className="w-px h-5 bg-border" />
          </>
        )}

        {/* Group By */}
        <div className="flex items-center gap-1.5">
          <Group className="w-3.5 h-3.5 text-muted-foreground" />
          <Select value={groupBy || "none"} onValueChange={(v) => setGroupBy(v === "none" ? "" : v)}>
            <SelectTrigger className="h-7 text-xs w-[120px]">
              <SelectValue placeholder="Group by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No grouping</SelectItem>
              {GROUPABLE_FIELDS[source].map(f => (
                <SelectItem key={f} value={f}>
                  {columns.find(c => c.key === f)?.label || f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="w-px h-5 bg-border" />

        {/* Column picker toggle */}
        <Button
          variant={showColumnPicker ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => setShowColumnPicker(!showColumnPicker)}
        >
          <Columns3 className="w-3.5 h-3.5" /> Columns
        </Button>

        {/* Add filter */}
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addFilter}>
          <Filter className="w-3.5 h-3.5" /> Add Filter
        </Button>

        {/* Stats toggle */}
        <Button
          variant={showStats ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => setShowStats(!showStats)}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Stats
        </Button>

        {!showPresets && (
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground" onClick={() => setShowPresets(true)}>
            <Zap className="w-3 h-3" /> Presets
          </Button>
        )}

        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground" onClick={reset}>
          <RotateCcw className="w-3 h-3" /> Reset
        </Button>

        {/* Spacer + Search + Export */}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search results..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-7 h-7 w-44 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={exportCSV}>
            <FileDown className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Column picker panel */}
      {showColumnPicker && (
        <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 border-b border-border bg-muted/20">
          <span className="text-[10px] font-medium text-muted-foreground mr-1">Show:</span>
          {columns.map(c => (
            <label key={c.key} className="flex items-center gap-1 cursor-pointer">
              <Checkbox
                checked={c.visible}
                onCheckedChange={() => toggleColumn(c.key)}
                className="w-3 h-3"
              />
              <span className="text-[10px]">{c.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Active filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-border bg-muted/10">
          {filters.map((f, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-background border border-border rounded-md px-1.5 py-0.5">
              <Select value={f.field} onValueChange={(v) => updateFilter(idx, { field: v })}>
                <SelectTrigger className="h-5 text-[10px] w-auto min-w-[70px] border-none shadow-none p-0 px-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(c => (
                    <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={f.operator} onValueChange={(v) => updateFilter(idx, { operator: v as FilterDef["operator"] })}>
                <SelectTrigger className="h-5 text-[10px] w-auto min-w-[60px] border-none shadow-none p-0 px-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">contains</SelectItem>
                  <SelectItem value="equals">equals</SelectItem>
                  <SelectItem value="gte">≥</SelectItem>
                  <SelectItem value="lte">≤</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={f.value}
                onChange={(e) => updateFilter(idx, { value: e.target.value })}
                className="h-5 text-[10px] w-24 border-none shadow-none px-1"
                placeholder="value..."
              />
              <button onClick={() => removeFilter(idx)} className="text-muted-foreground hover:text-destructive text-xs px-1">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Summary stats panel */}
      {showStats && (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/5">
          {/* Record count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-card border border-border rounded-md">
            <Hash className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Records</span>
            <span className="text-xs font-bold text-foreground tabular-nums">{filteredData.length}</span>
          </div>
          {/* Numeric summaries */}
          {summaryStats.numericStats.map(stat => (
            <div key={stat.field} className="flex items-center gap-2 px-2.5 py-1 bg-card border border-border rounded-md">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-foreground font-semibold tabular-nums" title="Total">Σ {stat.sum.toFixed(1)}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground tabular-nums" title="Average">μ {stat.avg.toFixed(1)}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground tabular-nums" title="Min-Max">{stat.min.toFixed(0)}–{stat.max.toFixed(0)}</span>
              </div>
            </div>
          ))}
          {/* Status breakdown chips */}
          {Object.entries(summaryStats.statusCounts).length > 0 && Object.entries(summaryStats.statusCounts).length <= 8 && (
            <>
              <span className="w-px h-5 bg-border" />
              {Object.entries(summaryStats.statusCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([status, count]) => (
                <Badge key={status} variant="outline" className="text-[9px] gap-1 py-0">
                  {status} <span className="font-bold">{count}</span>
                </Badge>
              ))}
            </>
          )}
          {groupedData && (
            <>
              <span className="w-px h-5 bg-border" />
              <Badge variant="secondary" className="text-[10px]">{groupedData.length} groups</Badge>
            </>
          )}
        </div>
      )}

      {/* Summary bar (minimal if stats shown) */}
      {!showStats && (
        <div className="flex items-center gap-3 px-4 py-1.5 border-b border-border bg-muted/10">
          <Badge variant="secondary" className="text-[10px] font-mono">
            {filteredData.length} records
          </Badge>
          {groupedData && (
            <Badge variant="outline" className="text-[10px]">
              {groupedData.length} groups
            </Badge>
          )}
          {filteredData.length > 500 && (
            <span className="text-[10px] text-amber-600">Showing first 500 rows • Export for full data</span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">
            {visibleCols.length} of {columns.length} columns visible
          </span>
        </div>
      )}

      {/* Data table */}
      <div className="flex-1 min-h-0 overflow-auto">
        {groupedData ? (
          <div className="space-y-0">
            {groupedData.map(([groupKey, rows]) => (
              <div key={groupKey}>
                <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-1.5 bg-muted border-b border-border">
                  <span className="text-xs font-bold text-foreground">{groupKey}</span>
                  <Badge variant="secondary" className="text-[10px]">{rows.length}</Badge>
                  {/* Group-level numeric summary */}
                  {NUMERIC_FIELDS[source].map(nf => {
                    const vals = rows.map(r => parseFloat(r[nf])).filter(v => !isNaN(v));
                    const total = vals.reduce((s, v) => s + v, 0);
                    if (total > 0) {
                      const colLabel = SOURCE_CONFIG[source].columns.find(c => c.key === nf)?.label || nf;
                      return (
                        <span key={nf} className="text-[10px] text-muted-foreground ml-1">
                          {colLabel}: {total.toFixed(1)}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                {renderTable(rows)}
              </div>
            ))}
          </div>
        ) : (
          renderTable(filteredData)
        )}

        {filteredData.length === 0 && (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            No records match your criteria. Try adjusting filters or date range.
          </div>
        )}
      </div>
    </div>
  );
}