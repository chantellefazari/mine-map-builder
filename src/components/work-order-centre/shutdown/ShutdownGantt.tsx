import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, GripVertical, Link2, Columns3, ZoomIn, ZoomOut, Maximize2, RotateCw } from "lucide-react";
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

export function ShutdownGantt({ shutdown, vendors, woLinks, workOrders, selectedVendor, onAssignWO, onUnassignWO }: Props) {
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(50);
  const [dragWoId, setDragWoId] = useState<string | null>(null);

  const startDate = parseISO(shutdown.start_date);
  const endDate = shutdown.end_date ? parseISO(shutdown.end_date) : addDays(startDate, 7);
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const days = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));

  // WOs assigned to this shutdown
  const assignedWoIds = new Set(woLinks.map((l) => l.work_order_id));

  // Unscheduled: Shutdown-type WOs not yet assigned
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

  // Scheduled WOs with their details
  const scheduledWOs = useMemo(() => {
    let links = woLinks;
    if (selectedVendor !== "all") {
      links = links.filter((l) => l.vendor_id === selectedVendor);
    }
    return links.map((link) => ({
      ...link,
      wo: workOrders.find((wo) => wo.id === link.work_order_id),
      vendor: vendors.find((v) => v.id === link.vendor_id),
    }));
  }, [woLinks, workOrders, vendors, selectedVendor]);

  const colWidth = Math.max(60, zoom * 2);

  const handleDrop = (dayKey: string) => {
    if (!dragWoId) return;
    onAssignWO(dragWoId, dayKey, selectedVendor !== "all" ? selectedVendor : undefined);
    setDragWoId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {/* Unscheduled Sidebar */}
        <div className="w-56 flex-shrink-0 space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search WOs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-7 h-7 text-xs" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground">Unscheduled ({unscheduled.length})</span>
          </div>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
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

        {/* Gantt Area */}
        <div className="flex-1 min-w-0 border border-border rounded-lg overflow-hidden">
          {/* Gantt Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span>{shutdown.name}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {format(startDate, "MMM d")} – {format(endDate, "MMM d, yyyy")}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{totalDays} days</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
                <Link2 className="w-3 h-3" /> Link Mode
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
                <Columns3 className="w-3 h-3" /> Columns
              </Button>
              <span className="text-[10px] text-muted-foreground">{scheduledWOs.length} WOs</span>
              <div className="flex items-center gap-1">
                <ZoomOut className="w-3 h-3 text-muted-foreground" />
                <input type="range" min={20} max={100} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-16 h-1" />
                <ZoomIn className="w-3 h-3 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Maximize2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <RotateCw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Gantt Table + Timeline */}
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-2 py-1.5 font-semibold w-10 sticky left-0 bg-muted/40 z-10">Line</th>
                  <th className="text-left px-2 py-1.5 font-semibold w-20 sticky left-10 bg-muted/40 z-10">Order No.</th>
                  <th className="text-left px-2 py-1.5 font-semibold w-24">Vendor</th>
                  <th className="text-left px-2 py-1.5 font-semibold w-28">Asset / Location</th>
                  <th className="text-left px-2 py-1.5 font-semibold w-40">Description</th>
                  <th className="text-center px-2 py-1.5 font-semibold w-14">Priority</th>
                  <th className="text-center px-2 py-1.5 font-semibold w-14">Duration</th>
                  {days.map((day) => (
                    <th key={day.toISOString()} className="text-center px-1 py-1.5 font-semibold border-l border-border" style={{ minWidth: colWidth }}>
                      <div>{format(day, "EEE")}</div>
                      <div className="text-muted-foreground font-normal">{format(day, "d MMM")}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduledWOs.length === 0 ? (
                  <tr>
                    <td colSpan={7 + days.length} className="text-center py-8 text-xs text-muted-foreground">
                      No scheduled work orders — drag from the sidebar to place them
                    </td>
                  </tr>
                ) : (
                  scheduledWOs.map((item, idx) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/20">
                      <td className="px-2 py-1.5 sticky left-0 bg-background z-10">{idx + 1}</td>
                      <td className="px-2 py-1.5 font-mono font-semibold sticky left-10 bg-background z-10">{item.wo?.wo_number || "—"}</td>
                      <td className="px-2 py-1.5">{item.vendor?.vendor_name || "—"}</td>
                      <td className="px-2 py-1.5 truncate">{item.wo?.asset_id || item.wo?.functional_location || "—"}</td>
                      <td className="px-2 py-1.5 truncate max-w-[160px]">{item.wo?.problem_description || "—"}</td>
                      <td className="px-2 py-1.5 text-center">
                        <Badge variant="outline" className="text-[9px] h-4">{item.wo?.priority || "—"}</Badge>
                      </td>
                      <td className="px-2 py-1.5 text-center">{item.duration_hours || 0}h</td>
                      {days.map((day) => {
                        const dayKey = format(day, "yyyy-MM-dd");
                        const isScheduledHere = item.scheduled_date && isSameDay(parseISO(item.scheduled_date), day);
                        return (
                          <td
                            key={dayKey}
                            className={cn(
                              "px-1 py-1.5 border-l border-border text-center",
                              isScheduledHere && "bg-primary/10"
                            )}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => { e.preventDefault(); handleDrop(dayKey); }}
                          >
                            {isScheduledHere && (
                              <div className="bg-primary/20 text-primary rounded px-1 py-0.5 text-[9px] font-medium">
                                {item.duration_hours || 0}h
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
                {/* Drop zone row when dragging */}
                {dragWoId && (
                  <tr className="border-b border-border bg-muted/10">
                    <td colSpan={7} className="px-2 py-2 text-muted-foreground italic">Drop to schedule...</td>
                    {days.map((day) => {
                      const dayKey = format(day, "yyyy-MM-dd");
                      return (
                        <td
                          key={dayKey}
                          className="border-l border-border hover:bg-primary/10 transition-colors"
                          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("bg-primary/10"); }}
                          onDragLeave={(e) => e.currentTarget.classList.remove("bg-primary/10")}
                          onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("bg-primary/10"); handleDrop(dayKey); }}
                        />
                      );
                    })}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
