import { useState, useMemo, useCallback } from "react";
import { Search, ChevronDown, ChevronUp, CalendarDays, ArrowRightLeft, CheckSquare, Square, ChevronsRight, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { format, addDays, parseISO } from "date-fns";
import { toast } from "sonner";
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
  const { update } = useWorkOrders();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("woNumber");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const [pushDays, setPushDays] = useState(7);
  const [editingDateId, setEditingDateId] = useState<string | null>(null);

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

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(i => i.id)));
    }
  }, [filtered, selectedIds.size]);

  // Update single WO date
  const updateDate = useCallback(async (item: PlannerItem, newDate: Date | undefined) => {
    if (item.source !== "wo") return;
    const dateStr = newDate ? format(newDate, "yyyy-MM-dd") : null;
    try {
      await update.mutateAsync({
        id: item.sourceId,
        updates: { scheduled_date: dateStr } as any,
      });
      toast.success(`${item.woNumber} → ${dateStr || "unscheduled"}`);
    } catch { /* handled */ }
    setEditingDateId(null);
  }, [update]);

  // Bulk push dates by N days
  const bulkPushDates = useCallback(async () => {
    const woItems = filtered.filter(i => selectedIds.has(i.id) && i.source === "wo");
    if (woItems.length === 0) { toast.error("Select work orders first"); return; }
    let count = 0;
    for (const item of woItems) {
      const currentDate = item.scheduledDate ? parseISO(item.scheduledDate) : new Date();
      const newDate = addDays(currentDate, pushDays);
      try {
        await update.mutateAsync({
          id: item.sourceId,
          updates: { scheduled_date: format(newDate, "yyyy-MM-dd") } as any,
        });
        count++;
      } catch { /* continue */ }
    }
    toast.success(`Pushed ${count} work orders by ${pushDays} days`);
    setSelectedIds(new Set());
  }, [filtered, selectedIds, pushDays, update]);

  // Bulk set date
  const bulkSetDate = useCallback(async (date: Date | undefined) => {
    if (!date) return;
    const woItems = filtered.filter(i => selectedIds.has(i.id) && i.source === "wo");
    if (woItems.length === 0) { toast.error("Select work orders first"); return; }
    const dateStr = format(date, "yyyy-MM-dd");
    let count = 0;
    for (const item of woItems) {
      try {
        await update.mutateAsync({
          id: item.sourceId,
          updates: { scheduled_date: dateStr } as any,
        });
        count++;
      } catch { /* continue */ }
    }
    toast.success(`Set ${count} work orders to ${dateStr}`);
    setSelectedIds(new Set());
  }, [filtered, selectedIds, update]);

  // Bulk status update
  const bulkUpdateStatus = useCallback(async (newStatus: string) => {
    const woItems = filtered.filter(i => selectedIds.has(i.id) && i.source === "wo");
    if (woItems.length === 0) { toast.error("Select work orders first"); return; }
    let count = 0;
    for (const item of woItems) {
      try {
        await update.mutateAsync({
          id: item.sourceId,
          updates: { status: newStatus } as any,
        });
        count++;
      } catch { /* continue */ }
    }
    toast.success(`Updated ${count} work orders to ${newStatus}`);
    setSelectedIds(new Set());
  }, [filtered, selectedIds, update]);

  const SortHeader = ({ field, label, className }: { field: SortField; label: string; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={cn("flex items-center gap-0.5 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground select-none", className)}
    >
      {label}
      {sortField === field && (sortDir === "asc" ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />)}
    </button>
  );

  const hasSelection = selectedIds.size > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-foreground">{filtered.length} Work Orders</span>
          <Button
            variant={bulkMode ? "default" : "outline"}
            size="sm"
            className="h-6 text-[10px] gap-1"
            onClick={() => { setBulkMode(!bulkMode); setSelectedIds(new Set()); }}
          >
            <CheckSquare className="w-3 h-3" />
            {bulkMode ? "Exit Select" : "Multi-Select"}
          </Button>
        </div>
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

      {/* Bulk actions toolbar */}
      {bulkMode && (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-primary/5">
          <button onClick={selectAll} className="text-[10px] text-primary hover:underline font-medium">
            {selectedIds.size === filtered.length ? "Deselect All" : "Select All"}
          </button>
          <span className="text-[10px] text-muted-foreground">{selectedIds.size} selected</span>

          {hasSelection && (
            <>
              <div className="h-4 w-px bg-border" />

              {/* Push dates by N days */}
              <div className="flex items-center gap-1.5">
                <ChevronsRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Push by</span>
                <Input
                  type="number"
                  value={pushDays}
                  onChange={(e) => setPushDays(Number(e.target.value))}
                  className="w-14 h-6 text-[10px] text-center"
                />
                <span className="text-[10px] text-muted-foreground">days</span>
                <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={bulkPushDates}>
                  Push
                </Button>
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Set specific date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1">
                    <CalendarDays className="w-3 h-3" /> Set Date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" onSelect={bulkSetDate} />
                </PopoverContent>
              </Popover>

              <div className="h-4 w-px bg-border" />

              {/* Bulk status */}
              <Select onValueChange={bulkUpdateStatus}>
                <SelectTrigger className="h-6 w-32 text-[10px]">
                  <SelectValue placeholder="Set Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="sm" className="h-6 text-[10px] ml-auto" onClick={() => setSelectedIds(new Set())}>
                <X className="w-3 h-3" /> Clear
              </Button>
            </>
          )}
        </div>
      )}

      {/* Column headers */}
      <div className={cn(
        "grid gap-0 px-4 py-1.5 border-b border-border bg-muted/20",
        bulkMode
          ? "grid-cols-[28px_90px_70px_60px_90px_1fr_80px_70px_80px_110px_70px]"
          : "grid-cols-[90px_70px_60px_90px_1fr_80px_70px_80px_110px_70px]"
      )}>
        {bulkMode && <span />}
        <SortHeader field="woNumber" label="WO #" />
        <SortHeader field="woType" label="Type" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide px-1">Activity</span>
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
            const isSelected = selectedIds.has(item.id);
            const isEditingDate = editingDateId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "grid gap-0 items-center px-4 py-2 hover:bg-muted/20 transition-colors",
                  bulkMode
                    ? "grid-cols-[28px_90px_70px_60px_90px_1fr_80px_70px_80px_110px_70px]"
                    : "grid-cols-[90px_70px_60px_90px_1fr_80px_70px_80px_110px_70px]",
                  isSelected && "bg-primary/5"
                )}
              >
                {bulkMode && (
                  <button onClick={() => toggleSelect(item.id)} className="flex items-center justify-center">
                    {isSelected
                      ? <CheckSquare className="w-3.5 h-3.5 text-primary" />
                      : <Square className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                  </button>
                )}
                <span className="text-[11px] font-mono font-semibold text-foreground">{item.woNumber || "—"}</span>
                <div>
                  <Badge variant="outline" className={cn("text-[8px] px-1 py-0 h-4", typeCfg ? `${typeCfg.textColor}` : "")}>
                    {item.woType}
                  </Badge>
                </div>
                <span className="text-[10px] font-mono font-semibold text-muted-foreground">{item.activityType || "—"}</span>
                <span className="text-[10px] font-mono text-muted-foreground truncate">{item.assetNumber || "—"}</span>
                <span className="text-[11px] text-foreground truncate pr-2" title={item.taskName}>{item.taskName}</span>
                <span className="text-[10px] text-muted-foreground">{item.discipline || "—"}</span>
                <span className={cn("text-[10px]", PRIORITY_COLORS[item.priority] || "text-foreground")}>{item.priority}</span>
                <span className={cn("text-[10px] font-medium", STATUS_COLORS[item.status] || "text-muted-foreground")}>{item.status}</span>

                {/* Editable scheduled date */}
                <Popover open={isEditingDate} onOpenChange={(open) => setEditingDateId(open ? item.id : null)}>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "text-[10px] text-left px-1.5 py-0.5 rounded border transition-colors",
                      item.scheduledDate
                        ? "text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                        : "text-muted-foreground/50 border-dashed border-border hover:border-primary/50 hover:bg-primary/5"
                    )}>
                      {item.scheduledDate || "Set date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={item.scheduledDate ? parseISO(item.scheduledDate) : undefined}
                      onSelect={(d) => updateDate(item, d)}
                    />
                    {item.scheduledDate && (
                      <div className="p-2 border-t border-border">
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] w-full" onClick={() => updateDate(item, undefined)}>
                          Clear Date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

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