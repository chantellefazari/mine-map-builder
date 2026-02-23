import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Package, Link2, History } from "lucide-react";
import { useWorkOrderParts } from "@/hooks/useWorkOrderParts";
import { usePOTracker } from "@/hooks/usePOTracker";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { WOOverviewTab } from "./WOOverviewTab";
import { WOPartsAvailabilityTab } from "./WOPartsAvailabilityTab";
import { WOLinkedPOsTab } from "./WOLinkedPOsTab";
import { WOActivityLogTab } from "./WOActivityLogTab";

interface WOSubTabsProps {
  woNumber?: string;
}

export const WOSubTabs = ({ woNumber }: WOSubTabsProps) => {
  const [partsRequired, setPartsRequired] = useState(false);
  const { workOrders } = useWorkOrders();
  const wo = workOrders.find((w) => w.wo_number === woNumber);
  const { parts, auditLog, addPart, updatePart, deletePart } = useWorkOrderParts(wo?.id);
  const { poItems, isLoading: poLoading } = usePOTracker(wo?.id);

  if (!woNumber) return null;

  return (
    <div className="print:hidden mt-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview" className="text-xs gap-1">
            <Eye className="h-3 w-3" /> Overview
          </TabsTrigger>
          <TabsTrigger value="parts" className="text-xs gap-1">
            <Package className="h-3 w-3" /> Parts & Availability
          </TabsTrigger>
          <TabsTrigger value="linked-pos" className="text-xs gap-1">
            <Link2 className="h-3 w-3" /> Linked POs
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs gap-1">
            <History className="h-3 w-3" /> Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <WOOverviewTab
            partsRequired={partsRequired}
            onPartsRequiredChange={setPartsRequired}
            parts={parts}
            linkedPOs={poItems}
          />
        </TabsContent>

        <TabsContent value="parts" className="mt-4">
          {wo?.id ? (
            <WOPartsAvailabilityTab
              workOrderId={wo.id}
              parts={parts}
              addPart={addPart}
              updatePart={updatePart}
              deletePart={deletePart}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Work order not found in database.</p>
          )}
        </TabsContent>

        <TabsContent value="linked-pos" className="mt-4">
          <WOLinkedPOsTab linkedPOs={poItems} isLoading={poLoading} />
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <WOActivityLogTab auditLog={auditLog} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
