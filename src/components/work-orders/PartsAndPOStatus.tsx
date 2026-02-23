import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PackageSearch, RefreshCw } from "lucide-react";
import { usePOTracker, computePartsStatus } from "@/hooks/usePOTracker";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { toast } from "sonner";

interface PartsAndPOStatusProps {
  woNumber?: string;
}

const statusBadgeClass: Record<string, string> = {
  "N/A": "border-muted text-muted-foreground",
  "PO Not Raised": "border-destructive/30 bg-destructive/10 text-destructive",
  "Awaiting Delivery": "border-blue-200 bg-blue-100 text-blue-800",
  "In Transit": "border-amber-200 bg-amber-100 text-amber-800",
  "Partially Received": "border-orange-200 bg-orange-100 text-orange-800",
  "Parts On Site": "border-green-200 bg-green-100 text-green-800",
};

export const PartsAndPOStatus = ({ woNumber }: PartsAndPOStatusProps) => {
  const [partsRequired, setPartsRequired] = useState(false);
  const { workOrders } = useWorkOrders();
  const wo = workOrders.find((w) => w.wo_number === woNumber);
  const { poItems, isLoading } = usePOTracker(wo?.id);

  const partsStatus = computePartsStatus(partsRequired, poItems);

  const handleCheckStatus = () => {
    toast.info(`Parts Status: ${partsStatus}`);
  };

  const totalLines = poItems.reduce((sum, po) => sum + (po.lines?.length ?? 0), 0);

  return (
    <div className="border border-gray-300 print:break-inside-avoid">
      <div className="bg-blue-100 px-3 py-2 border-b border-gray-300 flex items-center gap-2">
        <PackageSearch className="h-4 w-4 text-blue-800" />
        <span className="font-semibold text-blue-800">PARTS & PO STATUS</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Switch checked={partsRequired} onCheckedChange={setPartsRequired} />
          <Label className="text-sm font-medium">Parts Required?</Label>
        </div>

        {partsRequired && (
          <>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">
                Linked Purchase Orders: <span className="text-foreground">{poItems.length} POs, {totalLines} line items</span>
              </p>
              {isLoading ? (
                <p className="text-xs text-muted-foreground">Loading…</p>
              ) : poItems.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No POs linked to this work order</p>
              ) : (
                <div className="space-y-2">
                  {poItems.map((po) => (
                    <div key={po.id} className="border rounded p-2 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-medium">{po.po_number}</span>
                        <Badge variant="outline" className="text-[10px]">{po.status}</Badge>
                      </div>
                      <p className="text-muted-foreground">{po.supplier}</p>
                      {po.lines && po.lines.length > 0 && (
                        <div className="pl-2 border-l-2 border-primary/20 space-y-0.5">
                          {po.lines.map((line, i) => (
                            <p key={i} className="text-muted-foreground">
                              {line.part_number && <span className="font-mono">{line.part_number} — </span>}
                              {line.part_description} (x{line.quantity_ordered})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Parts Status:</span>
                <Badge variant="outline" className={statusBadgeClass[partsStatus] ?? ""}>
                  {partsStatus}
                </Badge>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs print:hidden" onClick={handleCheckStatus}>
                <RefreshCw className="h-3 w-3" />
                Check Parts Status
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
