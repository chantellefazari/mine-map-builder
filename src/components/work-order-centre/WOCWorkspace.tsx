import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import { useWorkOrderParts } from "@/hooks/useWorkOrderParts";
import { usePOTracker } from "@/hooks/usePOTracker";
import { usePurchaseRequests } from "@/hooks/usePurchaseRequests";
import { WOCWorkspaceHeader } from "./WOCWorkspaceHeader";
import { WSOverviewTab } from "./workspace/WSOverviewTab";
import { WSOperationsTab } from "./workspace/WSOperationsTab";
import { WSLabourToolsTab } from "./workspace/WSLabourToolsTab";
import { WSPartsTab } from "./workspace/WSPartsTab";
import { WSProcurementTab } from "./workspace/WSProcurementTab";
import { WSLinkedPOsTab } from "./workspace/WSLinkedPOsTab";
import { WSActivityLogTab } from "./workspace/WSActivityLogTab";
import { WSPMFormTab } from "./workspace/WSPMFormTab";
import { PrintPreviewModal } from "@/components/pm-design/PrintPreviewModal";
import { MechanicalWorkOrderTemplate } from "@/components/work-orders/MechanicalWorkOrderTemplate";
import { Eye, ListOrdered, Users, Package, ShoppingCart, Link2, History, ClipboardCheck } from "lucide-react";

interface Props {
  woId: string;
  onClose: () => void;
}

export function WOCWorkspace({ woId, onClose }: Props) {
  const { workOrders, update } = useWorkOrders();
  const wo = workOrders.find((w) => w.id === woId);
  const { parts, auditLog, addPart, updatePart, deletePart } = useWorkOrderParts(woId);
  const { poItems, isLoading: poLoading } = usePOTracker(woId);
  const { listQuery: prQuery } = usePurchaseRequests();
  const linkedPRs = (prQuery.data ?? []).filter((pr) => pr.work_order_id === woId);
  const isPMWorkOrder = wo ? (wo.problem_description || "").startsWith("PM:") : false;
  const isPMOnly = wo ? wo.work_type === "PM" : false;
  const [activeTab, setActiveTab] = useState(isPMWorkOrder ? "pm-form" : "overview");
  const [showPrint, setShowPrint] = useState(false);

  if (!wo) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Work order not found. It may have been deleted.
      </div>
    );
  }

  const handleUpdate = (updates: Partial<WorkOrder>) => {
    update.mutateAsync({ id: woId, updates });
  };

  return (
    <div className="flex flex-col h-full">
      <WOCWorkspaceHeader wo={wo} onUpdate={handleUpdate} onClose={onClose} partsCount={parts.length} />

      <div className="flex-1 overflow-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {isPMOnly ? (
            /* PM-only workspace: just the PM Form */
            <>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="pm-form" className="text-xs gap-1"><ClipboardCheck className="w-3 h-3" /> PM Form</TabsTrigger>
                <TabsTrigger value="overview" className="text-xs gap-1"><Eye className="w-3 h-3" /> Overview</TabsTrigger>
              </TabsList>
              <TabsContent value="pm-form" className="mt-4">
                <WSPMFormTab wo={wo} />
              </TabsContent>
              <TabsContent value="overview" className="mt-4">
                <WSOverviewTab wo={wo} onUpdate={handleUpdate} />
              </TabsContent>
            </>
          ) : (
            /* Full workspace for corrective/planned WOs */
            <>
              <TabsList className={`w-full grid ${isPMWorkOrder ? "grid-cols-8" : "grid-cols-7"}`}>
                <TabsTrigger value="overview" className="text-xs gap-1"><Eye className="w-3 h-3" /> Overview</TabsTrigger>
                {isPMWorkOrder && (
                  <TabsTrigger value="pm-form" className="text-xs gap-1"><ClipboardCheck className="w-3 h-3" /> PM Form</TabsTrigger>
                )}
                <TabsTrigger value="operations" className="text-xs gap-1"><ListOrdered className="w-3 h-3" /> Operations</TabsTrigger>
                <TabsTrigger value="labour-tools" className="text-xs gap-1"><Users className="w-3 h-3" /> Labour & Tools</TabsTrigger>
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
              <TabsContent value="operations" className="mt-4">
                <WSOperationsTab wo={wo} onUpdate={handleUpdate} />
              </TabsContent>
              <TabsContent value="labour-tools" className="mt-4">
                <WSLabourToolsTab wo={wo} onUpdate={handleUpdate} />
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
      </div>
    </div>
  );
}
