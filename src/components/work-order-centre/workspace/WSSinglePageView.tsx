import { useRef } from "react";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { WSOverviewTab } from "./WSOverviewTab";
import { WSExecutionTab } from "./WSExecutionTab";
import { WSPartsTab } from "./WSPartsTab";
import { Eye, Hammer, Package } from "lucide-react";
import type { WorkOrderPart } from "@/hooks/useWorkOrderParts";

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
  woId: string;
  parts: WorkOrderPart[];
  addPart: any;
  updatePart: any;
  deletePart: any;
}

function SectionHeader({ icon: Icon, title, id }: { icon: any; title: string; id: string }) {
  return (
    <div id={id} className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border py-2 px-1 -mx-1">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
      </div>
    </div>
  );
}

export function WSSinglePageView({ wo, onUpdate, woId, parts, addPart, updatePart, deletePart }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="space-y-8">
      {/* Section 1: Overview */}
      <section>
        <SectionHeader icon={Eye} title="Overview" id="section-overview" />
        <div className="mt-4">
          <WSOverviewTab wo={wo} onUpdate={onUpdate} />
        </div>
      </section>

      {/* Section 2: Execution */}
      <section>
        <SectionHeader icon={Hammer} title="Execution" id="section-execution" />
        <div className="mt-4">
          <WSExecutionTab wo={wo} onUpdate={onUpdate} />
        </div>
      </section>

      {/* Section 3: Parts */}
      <section>
        <SectionHeader icon={Package} title="Parts & Materials" id="section-parts" />
        <div className="mt-4">
          <WSPartsTab woId={woId} assetId={wo.asset_id || ""} parts={parts} addPart={addPart} updatePart={updatePart} deletePart={deletePart} />
        </div>
      </section>
    </div>
  );
}
