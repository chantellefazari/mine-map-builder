import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PlannerItem } from "./AdvancedPlannerView";
import { WO_TYPE_CONFIG } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

type SortField = "woNumber" | "woType" | "assetNumber" | "taskName" | "priority" | "status" | "scheduledDate" | "estimatedHours" | "discipline" | "area";
type SortDir = "asc" | "desc";

const STATUS_COLORS: Record<string, string> = {
  Draft: "text-muted-foreground",
  Active: "text-emerald-600",
  Planning: "text-amber-600",
  Scheduled: "text-blue-600",
  "On Hold": "text-red-600",
  Completed: "text-emerald-700",
  Open: "text-emerald-600",
  "In Progress": "text-blue-600",
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "text-red-600 font-bold",
  High: "text-red-500",
  Urgent: "text-red-500",
  Medium: "text-amber-600",
  Standard: "text-foreground",
  Low: "text-blue-600",
};

export function PlannerWorkOrdersTab({ items }: Props) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("woNumber");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    let list = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.woNumber.toLowerCase().includes(q) ||
        i.taskName.toLowerCase().includes(q) ||
        i.assetNumber.toLowerCase().includes(q) ||
        i.assignedTo.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [items, search, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortHeader = ({ field, label, className }: { field: SortField; label: string; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={cn("flex items-center gap-0.5 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground select-none", className)}
    >
      {label}
      {sortField === field && (sortDir === "asc" ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />)}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <span className="text-xs font-semibold text-foreground">{filtered.length} Work Orders</span>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search WO#, asset, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-7 w-56 text-xs"
          />
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[90px_70px_90px_1fr_80px_70px_80px_90px_70px] gap-0 px-4 py-1.5 border-b border-border bg-muted/20">
        <SortHeader field="woNumber" label="WO #" />
        <SortHeader field="woType" label="Type" />
        <SortHeader field="assetNumber" label="Asset" />
        <SortHeader field="taskName" label="Description" />
        <SortHeader field="discipline" label="Discipline" />
        <SortHeader field="priority" label="Priority" />
        <SortHeader field="status" label="Status" />
        <SortHeader field="scheduledDate" label="Scheduled" />
        <SortHeader field="estimatedHours" label="Hours" />
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/30">
          {filtered.map(item => {
            const typeCfg = WO_TYPE_CONFIG[item.woType];
            return (
              <div key={item.id} className="grid grid-cols-[90px_70px_90px_1fr_80px_70px_80px_90px_70px] gap-0 items-center px-4 py-2 hover:bg-muted/20 transition-colors">
                <span className="text-[11px] font-mono font-semibold text-foreground">{item.woNumber || "—"}</span>
                <div>
                  <Badge variant="outline" className={cn("text-[8px] px-1 py-0 h-4", typeCfg ? `${typeCfg.textColor}` : "")}>
                    {item.woType}
                  </Badge>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground truncate">{item.assetNumber || "—"}</span>
                <span className="text-[11px] text-foreground truncate pr-2" title={item.taskName}>{item.taskName}</span>
                <span className="text-[10px] text-muted-foreground">{item.discipline || "—"}</span>
                <span className={cn("text-[10px]", PRIORITY_COLORS[item.priority] || "text-foreground")}>{item.priority}</span>
                <span className={cn("text-[10px] font-medium", STATUS_COLORS[item.status] || "text-muted-foreground")}>{item.status}</span>
                <span className="text-[10px] text-muted-foreground">{item.scheduledDate || "—"}</span>
                <span className="text-[11px] font-medium text-foreground tabular-nums text-center">{item.estimatedHours > 0 ? `${item.estimatedHours}h` : "—"}</span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No work orders found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
