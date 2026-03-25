import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import {
  Plus, Pause, CheckCircle2, Copy, PlayCircle, Search,
} from "lucide-react";
import { toast } from "sonner";
import { WOCView } from "@/pages/WorkOrderCentre";
import { WOCReportsTab } from "./performance/WOCReportsTab";
import { WOCAnalyticsTab } from "./performance/WOCAnalyticsTab";
import { WOCPMFormsTab } from "./performance/WOCPMFormsTab";
import { WOCComplianceTab } from "./performance/WOCComplianceTab";
import { WOTypeSelectDialog } from "./WOTypeSelectDialog";

interface Props {
  onOpenWorkspace: (woId: string, from?: WOCView) => void;
}

const OPS_STATUSES: Record<string, string[]> = {
  planning: ["Draft", "Planning", "Open"],
  ready: ["Ready"],
  active: ["Active", "In Progress"],
  "on-hold": ["On Hold"],
  completed: ["Completed", "Complete", "Closed"],
  history: [],
};

const priorityColor = (p: string) => {
  switch (p?.toLowerCase()) {
    case "critical":
    case "emergency":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "high":
      return "bg-orange-100 text-orange-700 border-orange-300";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export function WOCWorkOrderManagement({ onOpenWorkspace }: Props) {
  const { workOrders, allocate, update } = useWorkOrders();
  const [opsTab, setOpsTab] = useState("planning");
  const [perfTab, setPerfTab] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showWoTypeDialog, setShowWoTypeDialog] = useState(false);

  const activeGroup = perfTab ? "performance" : "operations";

  const filtered = (key: string) => {
    let list = key === "history" ? workOrders : workOrders.filter((wo) => OPS_STATUSES[key]?.includes(wo.status));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (wo) =>
          wo.wo_number?.toLowerCase().includes(q) ||
          wo.asset_id?.toLowerCase().includes(q) ||
          wo.problem_description?.toLowerCase().includes(q) ||
          wo.functional_location?.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const handleCreate = () => {
    setShowWoTypeDialog(true);
  };

  const handleCreateConfirm = async (woType: string) => {
    setShowWoTypeDialog(false);
    try {
      const wo = await allocate.mutateAsync();
      await update.mutateAsync({ id: wo.id, updates: { status: "Planning", work_type: woType } });
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
    } catch {
      /* handled */
    }
  };

  const selectOps = (key: string) => {
    setOpsTab(key);
    setPerfTab(null);
  };

  const selectPerf = (key: string) => {
    setPerfTab(key);
  };

  const counts = {
    planning: filtered("planning").length,
    ready: filtered("ready").length,
    active: filtered("active").length,
    "on-hold": filtered("on-hold").length,
    completed: filtered("completed").length,
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
            {showActions && (
              <th className="text-left px-3 py-2 font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((wo) => (
            <tr
              key={wo.id}
              className="border-b border-border last:border-b-0 hover:bg-muted/20 cursor-pointer"
              onClick={() => onOpenWorkspace(wo.id, "wo-management")}
            >
              <td className="px-3 py-2 font-mono font-medium">
                {wo.wo_number}
              </td>
              <td className="px-3 py-2">{wo.asset_id || "-"}</td>
              <td className="px-3 py-2 truncate max-w-[200px]">
                {wo.problem_description || "-"}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {wo.functional_location || "-"}
              </td>
              <td className="px-3 py-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${priorityColor(wo.priority)}`}
                >
                  {wo.priority}
                </Badge>
              </td>
              <td className="px-3 py-2">
                <Badge variant="secondary" className="text-[10px]">
                  {wo.status}
                </Badge>
              </td>
              <td className="px-3 py-2">{wo.trade || "-"}</td>
              {showActions && (
                <td
                  className="px-3 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDuplicate(wo)}
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {wo.status !== "On Hold" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleStatusChange(wo, "On Hold")}
                        title="Put On Hold"
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                    )}
                    {wo.status === "On Hold" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleStatusChange(wo, "Planning")}
                        title="Resume"
                      >
                        <PlayCircle className="w-3 h-3" />
                      </Button>
                    )}
                    {!["Completed", "Complete", "Closed", "Ready"].includes(
                      wo.status
                    ) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-emerald-600"
                        onClick={() => handleStatusChange(wo, "Ready")}
                        title="Mark Ready"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td
                colSpan={showActions ? 8 : 7}
                className="px-3 py-8 text-center text-muted-foreground"
              >
                No work orders in this category
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      {/* ---- Header Bar ---- */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Work Order Management
          </h1>
          <p className="text-xs text-muted-foreground">
            Plan, track and manage all work orders
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search WO, asset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 w-48 text-xs bg-background"
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={allocate.isPending}
            className="text-sm gap-1.5 h-8"
          >
            <Plus className="w-4 h-4" /> Create Work Order
          </Button>
        </div>
      </div>

      {/* ---- Two Tab Groups ---- */}
      <div className="space-y-1">
        {/* Group Labels + Tabs on one row */}
        <div className="flex items-end gap-6 border-b border-border pb-px">
          {/* Operations group */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Operations
            </span>
            <div className="flex gap-0.5">
              {(
                [
                  ["planning", "Planning"],
                  ["ready", "Ready"],
                  ["active", "Active"],
                  ["on-hold", "On Hold"],
                  ["completed", "Completed"],
                  ["history", "History"],
                ] as [string, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => selectOps(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-t-md border-b-2 transition-colors ${
                    activeGroup === "operations" && opsTab === key
                      ? "border-primary text-foreground bg-background"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {label}
                  {key !== "history" && counts[key as keyof typeof counts] !== undefined && (
                    <span className="ml-1 text-[10px] opacity-60">
                      ({counts[key as keyof typeof counts]})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border mx-1" />

          {/* Performance group */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Performance
            </span>
            <div className="flex gap-0.5">
              {(
                [
                  ["reports", "Reports"],
                  ["analytics", "Analytics"],
                  ["pm-forms", "PM Forms"],
                  ["compliance", "Compliance"],
                ] as [string, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => selectPerf(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-t-md border-b-2 transition-colors ${
                    perfTab === key
                      ? "border-primary text-foreground bg-background"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Content ---- */}
      {activeGroup === "operations" && (
        <div className="mt-2">{renderTable(filtered(opsTab), opsTab !== "history")}</div>
      )}

      {perfTab === "reports" && <WOCReportsTab workOrders={workOrders} />}
      {perfTab === "analytics" && <WOCAnalyticsTab workOrders={workOrders} />}
      {perfTab === "pm-forms" && <WOCPMFormsTab />}
      {perfTab === "compliance" && <WOCComplianceTab />}
    </div>
  );
}
