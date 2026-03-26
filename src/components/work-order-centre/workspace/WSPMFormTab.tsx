import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { pmNameToViewId } from "@/components/pm-design/pmNameToViewId";
import { renderPMDocument } from "../renderPMDocument";

interface Props {
  wo: WorkOrder;
}

/** Extract PM name from work order problem_description field (format: "PM: <name> (<frequency>)") */
function extractPMName(desc: string): string | null {
  const match = desc.match(/^PM:\s*(.+?)\s*\(/);
  return match ? match[1].trim() : null;
}

export function WSPMFormTab({ wo }: Props) {
  const navigate = useNavigate();

  const pmName = useMemo(() => extractPMName(wo.problem_description || ""), [wo.problem_description]);
  const viewId = pmName ? pmNameToViewId[pmName] : null;

  if (!pmName || !viewId) {
    return (
      <div className="border border-dashed border-border rounded-lg p-8 text-center space-y-2">
        <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">
          No PM template linked to this work order.
        </p>
        <p className="text-xs text-muted-foreground">
          Create a work order from a PM template to see the full inspection form here.
        </p>
      </div>
    );
  }

  const handlePrint = () => {
    navigate(`/pm-print/${viewId}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">PM Inspection Form</h2>
          <p className="text-xs text-muted-foreground">{pmName}</p>
        </div>
        <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2 text-xs">
          <Printer className="w-3.5 h-3.5" />
          Print
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="transform origin-top-left scale-[0.85] w-[117.6%]">
          {renderPMDocument(viewId)}
        </div>
      </div>
    </div>
  );
}
