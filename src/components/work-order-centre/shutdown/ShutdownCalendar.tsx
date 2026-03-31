import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Search, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Shutdown, ShutdownVendor, ShutdownWorkOrder } from "@/hooks/useShutdowns";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { format, parseISO, addDays, differenceInDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  shutdown: Shutdown;
  vendors: ShutdownVendor[];
  woLinks: ShutdownWorkOrder[];
  workOrders: WorkOrder[];
  selectedVendor: string;
  onAssignWO: (woId: string, date?: string, vendorId?: string) => void;
  onUnassignWO: (linkId: string) => void;
}

export function ShutdownCalendar({ shutdown, vendors, woLinks, workOrders, selectedVendor, onAssignWO, onUnassignWO }: Props) {
  const [search, setSearch] = useState("");
  const [dragWoId, setDragWoId] = useState<string | null>(null);

  const startDate = parseISO(shutdown.start_date);
  const endDate = shutdown.end_date ? parseISO(shutdown.end_date) : addDays(startDate, 7);
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const days = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));

  const assignedWoIds = new Set(woLinks.map((l) => l.work_order_id));

  const unscheduled = useMemo(() => {
    let list = workOrders.filter(
      (wo) => wo.work_type === "Shutdown" && !assignedWoIds.has(wo.id)
    );
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (wo) =>
          wo.wo_number?.toLowerCase().includes(q) ||
          wo.problem_description?.toLowerCase().includes(q) ||
          wo.asset_id?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [workOrders, assignedWoIds, search]);

  const getWOsForDay = (day: Date) => {
    let links = woLinks.filter((l) => l.scheduled_date && isSameDay(parseISO(l.scheduled_date), day));
    if (selectedVendor !== "all") links = links.filter((l) => l.vendor_id === selectedVendor);
    return links.map((link) => ({
      ...link,
      wo: workOrders.find((wo) => wo.id === link.work_order_id),
      vendor: vendors.find((v) => v.id === link.vendor_id),
    }));
  };

  const handleDrop = (dayKey: string) => {
    if (!dragWoId) return;
    onAssignWO(dragWoId, dayKey, selectedVendor !== "all" ? selectedVendor : undefined);
    setDragWoId(null);
  };

  const today = new Date();

  return (
    <div className="flex gap-3">
      {/* Unscheduled Sidebar */}
      <div className="w-56 flex-shrink-0 space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search WOs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-7 h-7 text-xs" />
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">Unscheduled ({unscheduled.length})</span>
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {unscheduled.length === 0 ? (
            <div className="text-center py-6 text-[10px] text-muted-foreground">All work orders scheduled</div>
          ) : (
            unscheduled.map((wo) => (
              <div
                key={wo.id}
                draggable
                onDragStart={() => setDragWoId(wo.id)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-border bg-card cursor-grab hover:shadow-sm text-[10px]"
              >
                <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-mono font-semibold">{wo.wo_number}</span>
                  <p className="text-muted-foreground truncate">{wo.problem_description || wo.asset_id || "No description"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {/* Day Headers */}
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="bg-muted/50 px-2 py-1.5 text-center text-[10px] font-semibold text-muted-foreground">{d}</div>
          ))}

          {/* Pad first row to correct day of week (Mon=0) */}
          {Array.from({ length: (startDate.getDay() + 6) % 7 }, (_, i) => (
            <div key={`pad-${i}`} className="bg-background min-h-[100px]" />
          ))}

          {/* Day Cells */}
          {days.map((day) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayWOs = getWOsForDay(day);
            const isToday = isSameDay(day, today);

            return (
              <div
                key={dayKey}
                className={cn(
                  "bg-background min-h-[100px] p-1.5 transition-colors",
                  isToday && "bg-primary/5",
                  dragWoId && "hover:bg-muted/30"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleDrop(dayKey); }}
              >
                <div className={cn("text-[10px] font-semibold mb-1", isToday ? "text-primary" : "text-foreground")}>
                  {format(day, "d MMM")}
                </div>
                <div className="space-y-0.5">
                  {dayWOs.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/10 text-primary border border-primary/20 cursor-pointer group"
                    >
                      <span className="font-mono truncate">{item.wo?.wo_number}</span>
                      {item.vendor && (
                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 ml-auto">{item.vendor.vendor_code || item.vendor.vendor_name.substring(0, 3)}</Badge>
                      )}
                      <button
                        onClick={() => onUnassignWO(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive ml-0.5"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
