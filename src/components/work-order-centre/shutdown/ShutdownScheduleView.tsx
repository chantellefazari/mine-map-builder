import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar as CalendarIcon, Clock, Wrench, CheckCircle2, DollarSign,
  Plus, Building2, BarChart3, Users,
} from "lucide-react";
import { useShutdowns, useShutdownVendors, useShutdownWorkOrders } from "@/hooks/useShutdowns";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { CreateShutdownDialog } from "./CreateShutdownDialog";
import { ShutdownGantt } from "./ShutdownGantt";
import { ShutdownCalendar } from "./ShutdownCalendar";
import { ShutdownVendorPanel } from "./ShutdownVendorPanel";
import { ShutdownResourcesTab } from "./ShutdownResourcesTab";
import { format, parseISO, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  Planning: "text-blue-600",
  "In Progress": "text-amber-600",
  Completed: "text-emerald-600",
};

export function ShutdownScheduleView() {
  const { shutdowns, isLoading, createShutdown } = useShutdowns();
  const { workOrders } = useWorkOrders();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [viewMode, setViewMode] = useState<"gantt" | "calendar" | "resources">("gantt");

  const selected = shutdowns.find((s) => s.id === selectedId) ?? null;
  const { vendors } = useShutdownVendors(selectedId);
  const { woLinks, assignWO, removeAssignment } = useShutdownWorkOrders(selectedId);

  // Summary stats
  const stats = useMemo(() => {
    const total = shutdowns.length;
    const planning = shutdowns.filter((s) => s.status === "Planning").length;
    const inProgress = shutdowns.filter((s) => s.status === "In Progress").length;
    const completed = shutdowns.filter((s) => s.status === "Completed").length;
    return { total, planning, inProgress, completed };
  }, [shutdowns]);

  const handleAssignWO = (woId: string, date?: string, vendorId?: string) => {
    if (!selectedId) return;
    assignWO.mutate({
      shutdown_id: selectedId,
      work_order_id: woId,
      scheduled_date: date,
      vendor_id: vendorId !== "all" ? vendorId : undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, icon: CalendarIcon, color: "text-foreground" },
          { label: "Planning", value: stats.planning, icon: Clock, color: "text-blue-600" },
          { label: "In Progress", value: stats.inProgress, icon: Wrench, color: "text-amber-600" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Est. Cost", value: "$0k", icon: DollarSign, color: "text-foreground" },
        ].map((card) => (
          <div key={card.label} className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card">
            <div>
              <div className="text-xs text-muted-foreground">{card.label}</div>
              <div className={cn("text-xl font-bold", card.color)}>{card.value}</div>
            </div>
            <card.icon className="w-5 h-5 text-muted-foreground/50" />
          </div>
        ))}
      </div>

      {/* Shutdown Selector Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Shutdown:</span>
        <Select value={selectedId ?? ""} onValueChange={(v) => { setSelectedId(v); setSelectedVendor("all"); }}>
          <SelectTrigger className="w-64 h-9">
            <SelectValue placeholder="Select a shutdown..." />
          </SelectTrigger>
          <SelectContent>
            {shutdowns.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                <span className="flex items-center gap-2">
                  {s.name}
                  <Badge variant="outline" className="text-[9px] h-4">{s.status}</Badge>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selected && (
          <>
            <span className="text-xs text-muted-foreground">
              {format(parseISO(selected.start_date), "MMM d, yyyy")}
              {selected.end_date && ` – ${format(parseISO(selected.end_date), "MMM d, yyyy")}`}
              {selected.end_date && ` (${differenceInDays(parseISO(selected.end_date), parseISO(selected.start_date)) + 1} days)`}
            </span>

            {/* Vendor Filter */}
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger className="w-56 h-9">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> All Vendors</span>
                </SelectItem>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <span className="flex items-center gap-1.5">
                      + {v.vendor_code || v.vendor_name.substring(0, 4).toUpperCase()} – {v.vendor_name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("gantt")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "gantt" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Gantt
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "calendar" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5" /> Calendar
              </button>
              <button
                onClick={() => setViewMode("resources")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "resources" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="w-3.5 h-3.5" /> Resources
              </button>
            </div>
          </>
        )}

        <Button variant="outline" size="sm" className="gap-1.5 text-xs ml-auto" onClick={() => setShowCreate(true)}>
          <Plus className="w-3.5 h-3.5" /> New Shutdown
        </Button>
      </div>

      {/* Main Content */}
      {!selected ? (
        <div className="flex flex-col items-center justify-center py-20 border border-border rounded-lg bg-card">
          <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">Select a shutdown</h3>
          <p className="text-xs text-muted-foreground">Choose a shutdown from the dropdown to view the Gantt schedule</p>
        </div>
      ) : (
        <div className="space-y-4">
          {viewMode === "gantt" ? (
            <ShutdownGantt
              shutdown={selected}
              vendors={vendors}
              woLinks={woLinks}
              workOrders={workOrders}
              selectedVendor={selectedVendor}
              onAssignWO={handleAssignWO}
              onUnassignWO={(linkId) => removeAssignment.mutate(linkId)}
            />
          ) : viewMode === "calendar" ? (
            <ShutdownCalendar
              shutdown={selected}
              vendors={vendors}
              woLinks={woLinks}
              workOrders={workOrders}
              selectedVendor={selectedVendor}
              onAssignWO={handleAssignWO}
              onUnassignWO={(linkId) => removeAssignment.mutate(linkId)}
            />
          ) : (
            <ShutdownResourcesTab shutdownId={selected.id} />
          )}

          {/* Resource Allocation (compact) - only on Gantt/Calendar */}
          {viewMode !== "resources" && (
            <div className="border border-border rounded-lg p-4 bg-card">
              <ShutdownVendorPanel shutdownId={selected.id} />
            </div>
          )}
        </div>
      )}

      {/* Shutdown Revisions */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Shutdown Revisions</h3>
        </div>
        {shutdowns.length === 0 ? (
          <div className="text-center py-4 text-xs text-muted-foreground">No shutdowns created yet</div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">Shutdown Rev</th>
                <th className="text-left px-3 py-2 font-semibold">Name</th>
                <th className="text-left px-3 py-2 font-semibold">Period</th>
                <th className="text-center px-3 py-2 font-semibold">Days</th>
                <th className="text-center px-3 py-2 font-semibold">WOs</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {shutdowns.map((s) => {
                const days = s.end_date
                  ? differenceInDays(parseISO(s.end_date), parseISO(s.start_date)) + 1
                  : "—";
                return (
                  <tr
                    key={s.id}
                    className={cn(
                      "border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/30",
                      selectedId === s.id && "bg-primary/5"
                    )}
                    onClick={() => setSelectedId(s.id)}
                  >
                    <td className="px-3 py-2 font-mono">{s.shutdown_rev || "—"}</td>
                    <td className="px-3 py-2">{s.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {format(parseISO(s.start_date), "d MMM")}
                      {s.end_date && ` – ${format(parseISO(s.end_date), "dd MMM yy")}`}
                    </td>
                    <td className="px-3 py-2 text-center">{days}</td>
                    <td className="px-3 py-2 text-center">0</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={cn("text-[10px]", STATUS_COLOR[s.status])}>
                        {s.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <CreateShutdownDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={(values) => createShutdown.mutate(values)}
      />
    </div>
  );
}
