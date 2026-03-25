import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import { Plus, Pause, CheckCircle2, Copy, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { WOCView } from "@/pages/WorkOrderCentre";

interface Props {
  onOpenWorkspace: (woId: string, from?: WOCView) => void;
}

const TAB_STATUSES: Record<string, string[]> = {
  planning: ["Draft", "Planning", "Open"],
  ready: ["Ready"],
  active: ["Active", "In Progress"],
  "on-hold": ["On Hold"],
  completed: ["Completed", "Complete", "Closed"],
  history: [],
};

const priorityColor = (p: string) => {
  switch (p?.toLowerCase()) {
    case "critical": case "emergency": return "bg-destructive/10 text-destructive border-destructive/30";
    case "high": return "bg-orange-100 text-orange-700 border-orange-300";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export function WOCWorkOrderManagement({ onOpenWorkspace }: Props) {
  const { workOrders, allocate, update } = useWorkOrders();
  const [tab, setTab] = useState("planning");

  const filtered = (key: string) => {
    if (key === "history") return workOrders;
    return workOrders.filter((wo) => TAB_STATUSES[key]?.includes(wo.status));
  };

  const handleCreate = async () => {
    try {
      const wo = await allocate.mutateAsync();
      await update.mutateAsync({ id: wo.id, updates: { status: "Planning" } });
      onOpenWorkspace(wo.id, "wo-management");
    } catch {
      // handled in hook
    }
  };

  const handleStatusChange = async (wo: WorkOrder, status: string) => {
    await update.mutateAsync({ id: wo.id, updates: { status } });
    toast.success(`${wo.wo_number} moved to ${status}`);
  };

  const handleDuplicate = async (wo: WorkOrder) => {
    try {
      const newWo = await allocate.mutateAsync();
      await update.mutateAsync({
        id: newWo.id,
        updates: {
          status: "Planning",
          asset_id: wo.asset_id,
          functional_location: wo.functional_location,
          problem_description: wo.problem_description,
          priority: wo.priority,
          work_type: wo.work_type,
          trade: wo.trade,
        },
      });
      toast.success(`Duplicated as ${newWo.wo_number}`);
    } catch { /* handled */ }
  };

  const renderTable = (items: WorkOrder[], showActions = true) => (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="text-left px-3 py-2 font-semibold">WO #</th>
            <th className="text-left px-3 py-2 font-semibold">Asset</th>
            <th className="text-left px-3 py-2 font-semibold">Description</th>
            <th className="text-left px-3 py-2 font-semibold">Area</th>
            <th className="text-left px-3 py-2 font-semibold">Priority</th>
            <th className="text-left px-3 py-2 font-semibold">Status</th>
            <th className="text-left px-3 py-2 font-semibold">Trade</th>
            {showActions && <th className="text-left px-3 py-2 font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((wo) => (
            <tr
              key={wo.id}
              className="border-b border-border last:border-b-0 hover:bg-muted/20 cursor-pointer"
              onClick={() => onOpenWorkspace(wo.id, "wo-management")}
            >
              <td className="px-3 py-2 font-mono font-medium">{wo.wo_number}</td>
              <td className="px-3 py-2">{wo.asset_id || "-"}</td>
              <td className="px-3 py-2 truncate max-w-[200px]">{wo.problem_description || "-"}</td>
              <td className="px-3 py-2 text-muted-foreground">{wo.functional_location || "-"}</td>
              <td className="px-3 py-2">
                <Badge variant="outline" className={`text-[10px] ${priorityColor(wo.priority)}`}>{wo.priority}</Badge>
              </td>
              <td className="px-3 py-2">
                <Badge variant="secondary" className="text-[10px]">{wo.status}</Badge>
              </td>
              <td className="px-3 py-2">{wo.trade || "-"}</td>
              {showActions && (
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDuplicate(wo)} title="Duplicate">
                      <Copy className="w-3 h-3" />
                    </Button>
                    {wo.status !== "On Hold" && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleStatusChange(wo, "On Hold")} title="Put On Hold">
                        <Pause className="w-3 h-3" />
                      </Button>
                    )}
                    {wo.status === "On Hold" && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleStatusChange(wo, "Planning")} title="Resume">
                        <PlayCircle className="w-3 h-3" />
                      </Button>
                    )}
                    {!["Completed", "Complete", "Closed", "Ready"].includes(wo.status) && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-600" onClick={() => handleStatusChange(wo, "Ready")} title="Mark Ready">
                        <CheckCircle2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={showActions ? 8 : 7} className="px-3 py-8 text-center text-muted-foreground">No work orders in this category</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Work Order Management</h1>
          <p className="text-xs text-muted-foreground">Plan, track and manage all work orders</p>
        </div>
        <Button onClick={handleCreate} disabled={allocate.isPending} className="text-sm gap-1.5">
          <Plus className="w-4 h-4" /> Create Work Order
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="planning" className="text-xs">Planning ({filtered("planning").length})</TabsTrigger>
          <TabsTrigger value="ready" className="text-xs">Ready ({filtered("ready").length})</TabsTrigger>
          <TabsTrigger value="active" className="text-xs">Active ({filtered("active").length})</TabsTrigger>
          <TabsTrigger value="on-hold" className="text-xs">On Hold ({filtered("on-hold").length})</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">Completed ({filtered("completed").length})</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
        </TabsList>

        {Object.keys(TAB_STATUSES).map((key) => (
          <TabsContent key={key} value={key} className="mt-4">
            {renderTable(filtered(key), key !== "history")}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
