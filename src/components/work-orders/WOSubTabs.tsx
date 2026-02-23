import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Eye, Package, Link2, History, ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { useWorkOrderParts, computeWOPartsStatus } from "@/hooks/useWorkOrderParts";
import { usePOTracker } from "@/hooks/usePOTracker";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { Badge } from "@/components/ui/badge";
import { WOOverviewTab } from "./WOOverviewTab";
import { WOPartsAvailabilityTab } from "./WOPartsAvailabilityTab";
import { WOLinkedPOsTab } from "./WOLinkedPOsTab";
import { WOActivityLogTab } from "./WOActivityLogTab";

interface WOSubTabsProps {
  woNumber?: string;
}

export const WOSubTabs = ({ woNumber }: WOSubTabsProps) => {
  const [partsRequired, setPartsRequired] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { workOrders } = useWorkOrders();
  const wo = workOrders.find((w) => w.wo_number === woNumber);
  const { parts, auditLog, addPart, updatePart, deletePart } = useWorkOrderParts(wo?.id);
  const { poItems, isLoading: poLoading } = usePOTracker(wo?.id);

  if (!woNumber) return null;

  const partsStatus = partsRequired ? computeWOPartsStatus(parts) : "N/A";

  return (
    <div className="print:hidden mt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-muted/50 border rounded-lg hover:bg-muted transition-colors">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Work Order Management</span>
            <Badge variant="outline" className="text-[10px] ml-2">
              {parts.length} parts
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {poItems.length} POs
            </Badge>
            {partsRequired && partsStatus !== "N/A" && (
              <Badge variant="secondary" className="text-[10px]">
                {partsStatus}
              </Badge>
            )}
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3">
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
