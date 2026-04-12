import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PlannerRow } from "./AdvancedPlannerView";

interface WeekCol {
  key: string;
  weekNum: number;
  year: number;
  startDay: string;
  endDay: string;
  monthYear: string;
  date: Date;
}

interface Props {
  rows: PlannerRow[];
  weekColumns: WeekCol[];
  monthGroups: { label: string; span: number }[];
  expandedGroups: Set<string>;
  toggleGroup: (key: string) => void;
  supervisorMode: boolean;
}

const WO_TYPE_COLORS: Record<string, string> = {
  PM: "bg-blue-500/20 text-blue-700 border-blue-300",
  General: "bg-emerald-500/20 text-emerald-700 border-emerald-300",
  Breakdown: "bg-red-500/20 text-red-700 border-red-300",
  Shutdown: "bg-amber-500/20 text-amber-700 border-amber-300",
};

const STATUS_COLORS: Record<string, string> = {
  Draft: "text-muted-foreground",
  Active: "text-emerald-600",
  Planning: "text-amber-600",
  Scheduled: "text-blue-600",
  "On Hold": "text-red-600",
  Completed: "text-emerald-700",
  Open: "text-emerald-600",
};

type SortField = "area" | "woNumber" | "assetNumber" | "woType" | "taskName" | "frequency" | "estimatedHours" | "priority" | "status";
type SortDir = "asc" | "desc";

export function AdvancedPlannerTable({ rows, weekColumns, monthGroups, expandedGroups, toggleGroup, supervisorMode }: Props) {
  const [sortField, setSortField] = useState<SortField>("area");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [groupBy, setGroupBy] = useState<"none" | "area" | "woType" | "discipline">("none");

  const sortedRows = useMemo(() => {
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return sorted;
  }, [rows, sortField, sortDir]);

  // Grouping
  const groupedData = useMemo(() => {
    if (groupBy === "none") return [{ key: "__all__", label: "", rows: sortedRows }];
    const map = new Map<string, PlannerRow[]>();
    for (const r of sortedRows) {
      const key = groupBy === "area" ? r.area : groupBy === "woType" ? r.woType : r.discipline;
      const k = key || "—";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    }
    return Array.from(map.entries()).map(([key, rows]) => ({ key, label: key, rows }));
  }, [sortedRows, groupBy]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortHeader = ({ field, label, className }: { field: SortField; label: string; className?: string }) => (
    <th
      className={cn("px-2 py-1.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground select-none whitespace-nowrap", className)}
      onClick={() => handleSort(field)}
    >
      {label}
      {sortField === field && <span className="ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>}
    </th>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Grouping control */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-muted/30">
        <span className="text-[10px] text-muted-foreground font-medium">Group by:</span>
        <Select value={groupBy} onValueChange={(v) => setGroupBy(v as any)}>
          <SelectTrigger className="h-6 text-[10px] w-28 border-none bg-transparent shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="area">Area</SelectItem>
            <SelectItem value="woType">WO Type</SelectItem>
            <SelectItem value="discipline">Discipline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse" style={{ tableLayout: "auto" }}>
          <thead className="sticky top-0 z-20 bg-card">
            {/* Month headers */}
            <tr className="border-b border-border">
              <th colSpan={10} className="bg-card" />
              {monthGroups.map((mg, i) => (
                <th key={i} colSpan={mg.span} className="px-1 py-1 text-[9px] font-semibold text-center text-muted-foreground border-l border-border bg-muted/20">
                  {mg.label}
                </th>
              ))}
            </tr>
            {/* Column headers */}
            <tr className="border-b border-border bg-muted/10">
              <SortHeader field="area" label="Area" className="sticky left-0 bg-muted/10 z-10 min-w-[60px]" />
              <SortHeader field="woNumber" label="WO #" className="min-w-[90px]" />
              <SortHeader field="assetNumber" label="Asset #" className="min-w-[80px]" />
              <SortHeader field="woType" label="WO Type" className="min-w-[50px]" />
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap min-w-[80px]">Asset Type</th>
              <SortHeader field="taskName" label="Task Name" className="min-w-[180px]" />
              <SortHeader field="frequency" label="Freq" className="min-w-[50px]" />
              <SortHeader field="estimatedHours" label="Hrs" className="min-w-[35px]" />
              <SortHeader field="priority" label="Priority" className="min-w-[60px]" />
              <SortHeader field="status" label="Status" className="min-w-[65px]" />
              {/* Week columns */}
              {weekColumns.map(wc => (
                <th key={wc.key} className="px-0.5 py-1 text-center text-[9px] font-medium text-muted-foreground border-l border-border min-w-[36px] whitespace-nowrap">
                  <div>W{wc.weekNum}</div>
                  <div className="text-[8px] text-muted-foreground/60">{wc.startDay}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupedData.map(group => (
              <GroupSection
                key={group.key}
                groupKey={group.key}
                label={group.label}
                rows={group.rows}
                weekColumns={weekColumns}
                showGroupHeader={groupBy !== "none"}
                expanded={expandedGroups.has(group.key) || groupBy === "none"}
                onToggle={() => toggleGroup(group.key)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroupSection({ groupKey, label, rows, weekColumns, showGroupHeader, expanded, onToggle }: {
  groupKey: string;
  label: string;
  rows: PlannerRow[];
  weekColumns: { key: string; weekNum: number }[];
  showGroupHeader: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {showGroupHeader && (
        <tr
          className="bg-muted/40 cursor-pointer hover:bg-muted/60 border-b border-border"
          onClick={onToggle}
        >
          <td colSpan={10 + weekColumns.length} className="px-3 py-1.5 text-xs font-semibold text-foreground">
            {expanded ? <ChevronDown className="w-3.5 h-3.5 inline mr-1.5" /> : <ChevronRight className="w-3.5 h-3.5 inline mr-1.5" />}
            {label}
            <span className="ml-2 text-muted-foreground font-normal">({rows.length})</span>
          </td>
        </tr>
      )}
      {(expanded || !showGroupHeader) && rows.map(row => (
        <PlannerRowItem key={row.id} row={row} weekColumns={weekColumns} />
      ))}
    </>
  );
}

function PlannerRowItem({ row, weekColumns }: { row: PlannerRow; weekColumns: { key: string; weekNum: number }[] }) {
  const typeColor = WO_TYPE_COLORS[row.woType] || "";
  const statusColor = STATUS_COLORS[row.status] || "text-muted-foreground";

  return (
    <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
      <td className="px-2 py-1.5 text-[11px] font-medium text-foreground sticky left-0 bg-card group-hover:bg-muted/20 z-10 whitespace-nowrap">
        {row.area}
      </td>
      <td className="px-2 py-1.5 text-[11px] font-mono text-foreground whitespace-nowrap">
        {row.woNumber || "—"}
      </td>
      <td className="px-2 py-1.5 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
        {row.assetNumber || "—"}
      </td>
      <td className="px-2 py-1.5">
        <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0", typeColor)}>
          {row.woType}
        </Badge>
      </td>
      <td className="px-2 py-1.5 text-[11px] text-muted-foreground truncate max-w-[100px]">
        {row.assetType || "—"}
      </td>
      <td className="px-2 py-1.5 text-[11px] text-foreground truncate max-w-[220px]" title={row.taskName}>
        {row.taskName}
      </td>
      <td className="px-2 py-1.5 text-[10px] text-muted-foreground whitespace-nowrap">
        {row.frequency || "—"}
      </td>
      <td className="px-2 py-1.5 text-[11px] text-center font-medium">
        {row.estimatedHours || "—"}
      </td>
      <td className="px-2 py-1.5">
        <PriorityBadge priority={row.priority} />
      </td>
      <td className="px-2 py-1.5">
        <span className={cn("text-[10px] font-medium", statusColor)}>{row.status}</span>
      </td>
      {/* Week markers */}
      {weekColumns.map(wc => {
        const count = row.weekMarkers[wc.key] || 0;
        return (
          <td key={wc.key} className="px-0 py-1 text-center border-l border-border/30">
            {count > 0 ? (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary/15 text-primary text-[10px] font-bold">
                {count}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/20">—</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = priority?.toLowerCase() || "";
  let color = "text-muted-foreground";
  if (p.includes("high") || p.includes("critical") || p.includes("urgent")) color = "text-red-600";
  else if (p.includes("medium")) color = "text-amber-600";
  else if (p.includes("low")) color = "text-blue-600";
  
  return <span className={cn("text-[10px] font-medium", color)}>{priority || "—"}</span>;
}
