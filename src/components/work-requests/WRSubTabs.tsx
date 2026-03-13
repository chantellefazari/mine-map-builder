import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Eye, History, ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { useWorkOrderParts } from "@/hooks/useWorkOrderParts";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { WOOverviewTab } from "@/components/work-orders/WOOverviewTab";
import { WOActivityLogTab } from "@/components/work-orders/WOActivityLogTab";

interface WRSubTabsProps {
  woNumber?: string;
}

export const WRSubTabs = ({ woNumber }: WRSubTabsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { workOrders } = useWorkOrders();
  const wo = workOrders.find((w) => w.wo_number === woNumber);
  const { parts, auditLog } = useWorkOrderParts(wo?.id);

  if (!woNumber) return null;

  return (
    <div className="print:hidden mt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-muted/50 border rounded-lg hover:bg-muted transition-colors">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Work Request Management</span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="overview" className="text-xs gap-1">
                <Eye className="h-3 w-3" /> Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs gap-1">
                <History className="h-3 w-3" /> Activity Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <WOOverviewTab
                partsRequired={false}
                onPartsRequiredChange={() => {}}
                parts={parts}
                linkedPOs={[]}
              />
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
