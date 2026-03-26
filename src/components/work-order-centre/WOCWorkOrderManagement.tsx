import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import { useWorkOrderParts } from "@/hooks/useWorkOrderParts";
import {
  Plus, Pause, CheckCircle2, Copy, PlayCircle, Search,
  CircleDot, FileText, Wrench, Users, Package,
} from "lucide-react";
import { toast } from "sonner";
import { WOCView } from "@/pages/WorkOrderCentre";
import { WOCReportsTab } from "./performance/WOCReportsTab";
import { WOCAnalyticsTab } from "./performance/WOCAnalyticsTab";
import { WOCPMFormsTab } from "./performance/WOCPMFormsTab";
import { WOCComplianceTab } from "./performance/WOCComplianceTab";
import { WOTypeSelectDialog, PMAutoFill } from "./WOTypeSelectDialog";
import { PMSchedulePanel } from "./PMSchedulePanel";

interface Props {
  onOpenWorkspace: (woId: string, from?: WOCView) => void;
}

const OPS_STATUSES: Record<string, string[]> = {
  planning: ["Draft", "Planning", "Open"],
  planned: ["Planned"],
  scheduled: ["Scheduled"],
  active: ["Active", "In Progress"],
  "on-hold": ["On Hold"],
  completed: ["Completed", "Complete"],
  closed: ["Closed"],
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

/** Compute planning checklist for a work order */
function planningChecklist(wo: WorkOrder, partsCount: number) {
  const checks = [
    { key: "asset", label: "Asset assigned", done: !!wo.asset_id?.trim() },
    { key: "description", label: "Description written", done: !!wo.problem_description?.trim() },
    { key: "scope", label: "Scope of works", done: !!wo.scope_of_works?.trim() || !!wo.work_performed?.trim() },
    { key: "parts", label: "Parts identified", done: partsCount > 0 },
    { key: "labour", label: "Labour planned", done: Array.isArray(wo.labour_hours) && wo.labour_hours.length > 0 },
  ];
  return checks;
}

function PlanningProgress({ wo, partsCount }: { wo: WorkOrder; partsCount: number }) {
  const checks = planningChecklist(wo, partsCount);
  const done = checks.filter((c) => c.done).length;
  const total = checks.length;
  const pct = Math.round((done / total) * 100);

  const color =
    pct === 100 ? "text-emerald-600" :
    pct >= 60 ? "text-amber-500" :
    "text-muted-foreground";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help">
            <div className="flex gap-0.5">
              {checks.map((c) => (
                <div
                  key={c.key}
                  className={`w-2 h-2 rounded-full ${c.done ? "bg-emerald-500" : "bg-border"}`}
                />
              ))}
            </div>
            <span className={`text-[10px] font-semibold ${color}`}>{pct}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs space-y-1 max-w-[200px]">
          <p className="font-semibold mb-1">Planning Checklist</p>
          {checks.map((c) => (
            <div key={c.key} className="flex items-center gap-1.5">
              {c.done ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                <CircleDot className="w-3 h-3 text-muted-foreground" />
              )}
              <span className={c.done ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
            </div>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

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

  const handleCreateConfirm = async (woType: string, pmData?: PMAutoFill) => {
    setShowWoTypeDialog(false);
    try {
      const wo = await allocate.mutateAsync();
      const updates: Record<string, any> = { status: "Planning", work_type: woType };

      if (pmData) {
        const taskDescriptions = (pmData.tasks || [])
          .map((t: any, i: number) => `${i + 1}. ${t.description || t.task || ""}`)
          .filter((s: string) => s.length > 3)
          .join("\n");

        updates.problem_description = `PM: ${pmData.pmName} (${pmData.frequency})`;
        updates.scope_of_works = taskDescriptions || pmData.purpose || "";
        updates.asset_id = pmData.assetNumber || "";
        updates.trade = pmData.discipline || "";
        updates.required_tooling = JSON.stringify(pmData.requiredTools || []);
      }

      await update.mutateAsync({ id: wo.id, updates });
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
    planned: filtered("planned").length,
    scheduled: filtered("scheduled").length,
    active: filtered("active").length,
    "on-hold": filtered("on-hold").length,
    completed: filtered("completed").length,
    closed: filtered("closed").length,
  };

  // Collect all parts counts per WO for planning progress
  // We'll use a simple approach: fetch part counts from the filtered list
  const planningWoIds = useMemo(() => {
    return filtered("planning").map((wo) => wo.id);
  }, [workOrders, search]);

  const renderTable = (items: WorkOrder[], showActions = true, showProgress = false) => (
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
            {showProgress && <th className="text-left px-3 py-2 font-semibold">Progress</th>}
            <th className="text-left px-3 py-2 font-semibold">Trade</th>
            {showActions && (
              <th className="text-left px-3 py-2 font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((wo) => (
            <WOTableRow
              key={wo.id}
              wo={wo}
              showActions={showActions}
              showProgress={showProgress}
              onOpenWorkspace={onOpenWorkspace}
              onDuplicate={handleDuplicate}
              onStatusChange={handleStatusChange}
            />
          ))}
          {items.length === 0 && (
            <tr>
              <td
                colSpan={showActions ? (showProgress ? 9 : 8) : (showProgress ? 8 : 7)}
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
                  ["planned", "Planned"],
                  ["scheduled", "Scheduled"],
                  ["active", "Active"],
                  ["on-hold", "On Hold"],
                  ["completed", "Completed"],
                  ["closed", "Closed"],
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
        <div className="mt-2">
          {renderTable(
            filtered(opsTab),
            opsTab !== "history",
            opsTab === "planning"
          )}
        </div>
      )}

      {perfTab === "reports" && <WOCReportsTab workOrders={workOrders} />}
      {perfTab === "analytics" && <WOCAnalyticsTab workOrders={workOrders} />}
      {perfTab === "pm-forms" && <WOCPMFormsTab />}
      {perfTab === "compliance" && <WOCComplianceTab />}

      <WOTypeSelectDialog
        open={showWoTypeDialog}
        onClose={() => setShowWoTypeDialog(false)}
        onConfirm={handleCreateConfirm}
        title="Create Work Order"
        description="Select the Work Order Type to begin planning:"
      />
    </div>
  );
}

/** Individual row component — fetches its own parts count for progress */
function WOTableRow({
  wo,
  showActions,
  showProgress,
  onOpenWorkspace,
  onDuplicate,
  onStatusChange,
}: {
  wo: WorkOrder;
  showActions: boolean;
  showProgress: boolean;
  onOpenWorkspace: (woId: string, from?: WOCView) => void;
  onDuplicate: (wo: WorkOrder) => void;
  onStatusChange: (wo: WorkOrder, status: string) => void;
}) {
  // Only fetch parts if we need progress
  const { parts } = useWorkOrderParts(showProgress ? wo.id : "");

  return (
    <tr
      className="border-b border-border last:border-b-0 hover:bg-muted/20 cursor-pointer"
      onClick={() => onOpenWorkspace(wo.id, "wo-management")}
    >
      <td className="px-3 py-2 font-mono font-medium">{wo.wo_number}</td>
      <td className="px-3 py-2">{wo.asset_id || "-"}</td>
      <td className="px-3 py-2 truncate max-w-[200px]">{wo.problem_description || "-"}</td>
      <td className="px-3 py-2 text-muted-foreground">{wo.functional_location || "-"}</td>
      <td className="px-3 py-2">
        <Badge variant="outline" className={`text-[10px] ${priorityColor(wo.priority)}`}>
          {wo.priority}
        </Badge>
      </td>
      <td className="px-3 py-2">
        <Badge variant="secondary" className="text-[10px]">{wo.status}</Badge>
      </td>
      {showProgress && (
        <td className="px-3 py-2">
          <PlanningProgress wo={wo} partsCount={parts.length} />
        </td>
      )}
      <td className="px-3 py-2">{wo.trade || "-"}</td>
      {showActions && (
        <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDuplicate(wo)} title="Duplicate">
              <Copy className="w-3 h-3" />
            </Button>
            {wo.status !== "On Hold" && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onStatusChange(wo, "On Hold")} title="Put On Hold">
                <Pause className="w-3 h-3" />
              </Button>
            )}
            {wo.status === "On Hold" && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onStatusChange(wo, "Planning")} title="Resume">
                <PlayCircle className="w-3 h-3" />
              </Button>
            )}
            {OPS_STATUSES.planning.includes(wo.status) && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-600" onClick={() => onStatusChange(wo, "Planned")} title="Mark as Planned">
                <CheckCircle2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
