import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import { toast } from "sonner";
import { useWorkOrderParts } from "@/hooks/useWorkOrderParts";
import { usePOTracker } from "@/hooks/usePOTracker";
import { usePurchaseRequests } from "@/hooks/usePurchaseRequests";
import { WOCWorkspaceHeader } from "./WOCWorkspaceHeader";
import { WSOverviewTab } from "./workspace/WSOverviewTab";
import { WSExecutionTab } from "./workspace/WSExecutionTab";
import { WSPartsTab } from "./workspace/WSPartsTab";
import { WSProcurementTab } from "./workspace/WSProcurementTab";
import { WSLinkedPOsTab } from "./workspace/WSLinkedPOsTab";
import { WSActivityLogTab } from "./workspace/WSActivityLogTab";
import { WSPMFormTab } from "./workspace/WSPMFormTab";
import { WSSinglePageView } from "./workspace/WSSinglePageView";
import { PrintPreviewModal } from "@/components/pm-design/PrintPreviewModal";
import { MechanicalWorkOrderTemplate } from "@/components/work-orders/MechanicalWorkOrderTemplate";
import { Eye, Hammer, Package, ShoppingCart, Link2, History, ClipboardCheck } from "lucide-react";

interface Props {
  woId: string;
  onClose: () => void;
  isNew?: boolean;
  onSaved?: () => void;
}

export function WOCWorkspace({ woId, onClose, isNew, onSaved }: Props) {
  const { workOrders, update, allocate } = useWorkOrders();
  const wo = workOrders.find((w) => w.id === woId);
  const { parts, auditLog, addPart, updatePart, deletePart } = useWorkOrderParts(woId);
  const { poItems, isLoading: poLoading } = usePOTracker(woId);
  const { listQuery: prQuery } = usePurchaseRequests();
  const linkedPRs = (prQuery.data ?? []).filter((pr) => pr.work_order_id === woId);
  const isPMWorkOrder = wo ? (wo.problem_description || "").startsWith("PM:") : false;
  const isPMOnly = wo ? wo.work_type === "PM" : false;
  const [activeTab, setActiveTab] = useState(isPMWorkOrder ? "pm-form" : "overview");
  const [showPrint, setShowPrint] = useState(false);

  const isCreationMode = !!isNew;

  if (!wo) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Work order not found. It may have been deleted.
      </div>
    );
  }

  const handleUpdate = (updates: Partial<WorkOrder>) => {
    update.mutateAsync({ id: woId, updates }).then(() => {
      if (isNew && onSaved) onSaved();
    });
  };

  const handleRaiseDefect = async () => {
    try {
      const defectWO = await allocate.mutateAsync("Breakdown");
      // Pre-populate with parent PM data
      await update.mutateAsync({
        id: defectWO.id,
        updates: {
          asset_id: wo.asset_id,
          functional_location: wo.functional_location,
          work_centre: wo.work_centre,
          trade: wo.trade,
          problem_description: `Defect from ${wo.wo_number}: `,
          work_title: `Defect — ${wo.work_title || wo.problem_description?.replace(/^PM:\s*/, "").split("(")[0]?.trim() || ""}`,
          linked_wr_number: wo.wo_number,
          status: "Planning",
        } as any,
      });
      toast.success(`Defect ${defectWO.wo_number} created and linked to ${wo.wo_number}`);
    } catch {
      toast.error("Failed to create defect work order");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <WOCWorkspaceHeader wo={wo} onUpdate={handleUpdate} onClose={onClose} onPrint={() => setShowPrint(true)} partsCount={parts.length} onRaiseDefect={isPMOnly ? handleRaiseDefect : undefined} />

      <div className="flex-1 overflow-auto p-4">
        {isCreationMode && !isPMOnly ? (
          /* ── Single-page creation flow ── */
          <WSSinglePageView
            wo={wo}
            onUpdate={handleUpdate}
            woId={woId}
            parts={parts}
            addPart={addPart}
            updatePart={updatePart}
            deletePart={deletePart}
          />
        ) : (
          /* ── Tabbed workspace for ongoing management ── */
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {isPMOnly ? (
              <>
                <TabsList className="w-full grid grid-cols-5">
                  <TabsTrigger value="pm-form" className="text-xs gap-1"><ClipboardCheck className="w-3 h-3" /> PM Form</TabsTrigger>
                  <TabsTrigger value="overview" className="text-xs gap-1"><Eye className="w-3 h-3" /> Overview</TabsTrigger>
                  <TabsTrigger value="execution" className="text-xs gap-1"><Hammer className="w-3 h-3" /> Execution</TabsTrigger>
                  <TabsTrigger value="parts" className="text-xs gap-1"><Package className="w-3 h-3" /> Parts</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs gap-1"><History className="w-3 h-3" /> History</TabsTrigger>
                </TabsList>
                <TabsContent value="pm-form" className="mt-4">
                  <WSPMFormTab wo={wo} />
                </TabsContent>
                <TabsContent value="overview" className="mt-4">
                  <WSOverviewTab wo={wo} onUpdate={handleUpdate} />
                </TabsContent>
                <TabsContent value="execution" className="mt-4">
                  <WSExecutionTab wo={wo} onUpdate={handleUpdate} />
                </TabsContent>
                <TabsContent value="parts" className="mt-4">
                  <WSPartsTab woId={woId} assetId={wo.asset_id || ""} parts={parts} addPart={addPart} updatePart={updatePart} deletePart={deletePart} />
                </TabsContent>
                <TabsContent value="activity" className="mt-4">
                  <WSActivityLogTab auditLog={auditLog} wo={wo} />
                </TabsContent>
              </>
            ) : (
              <>
                <TabsList className={`w-full grid ${isPMWorkOrder ? "grid-cols-7" : "grid-cols-6"}`}>
                  <TabsTrigger value="overview" className="text-xs gap-1"><Eye className="w-3 h-3" /> Overview</TabsTrigger>
                  {isPMWorkOrder && (
                    <TabsTrigger value="pm-form" className="text-xs gap-1"><ClipboardCheck className="w-3 h-3" /> PM Form</TabsTrigger>
                  )}
                  <TabsTrigger value="execution" className="text-xs gap-1"><Hammer className="w-3 h-3" /> Execution</TabsTrigger>
                  <TabsTrigger value="parts" className="text-xs gap-1"><Package className="w-3 h-3" /> Parts</TabsTrigger>
                  <TabsTrigger value="procurement" className="text-xs gap-1"><ShoppingCart className="w-3 h-3" /> Procurement</TabsTrigger>
                  <TabsTrigger value="linked-pos" className="text-xs gap-1"><Link2 className="w-3 h-3" /> Linked POs</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs gap-1"><History className="w-3 h-3" /> Activity Log</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <WSOverviewTab wo={wo} onUpdate={handleUpdate} />
                </TabsContent>
                {isPMWorkOrder && (
                  <TabsContent value="pm-form" className="mt-4">
                    <WSPMFormTab wo={wo} />
                  </TabsContent>
                )}
                <TabsContent value="execution" className="mt-4">
                  <WSExecutionTab wo={wo} onUpdate={handleUpdate} />
                </TabsContent>
                <TabsContent value="parts" className="mt-4">
                  <WSPartsTab woId={woId} assetId={wo.asset_id || ""} parts={parts} addPart={addPart} updatePart={updatePart} deletePart={deletePart} />
                </TabsContent>
                <TabsContent value="procurement" className="mt-4">
                  <WSProcurementTab parts={parts} poItems={poItems} linkedPRs={linkedPRs} />
                </TabsContent>
                <TabsContent value="linked-pos" className="mt-4">
                  <WSLinkedPOsTab poItems={poItems} linkedPRs={linkedPRs} poLoading={poLoading} />
                </TabsContent>
                <TabsContent value="activity" className="mt-4">
                  <WSActivityLogTab auditLog={auditLog} wo={wo} />
                </TabsContent>
              </>
            )}
          </Tabs>
        )}
      </div>

      <PrintPreviewModal
        isOpen={showPrint}
        onClose={() => setShowPrint(false)}
        title={`Work Order ${wo.wo_number}`}
      >
        <MechanicalWorkOrderTemplate woNumber={wo.wo_number} />
      </PrintPreviewModal>
    </div>
  );
}
