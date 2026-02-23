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

const statusBadge: Record<string, string> = {
  "N/A": "bg-muted text-muted-foreground",
  "PO Not Raised": "bg-red-100 text-red-800 border-red-200",
  "Awaiting Delivery": "bg-blue-100 text-blue-800 border-blue-200",
  "In Transit": "bg-amber-100 text-amber-800 border-amber-200",
  "Partially Received": "bg-orange-100 text-orange-800 border-orange-200",
  "Parts On Site": "bg-green-100 text-green-800 border-green-200",
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

  return (
    <div className="border border-gray-300 print:break-inside-avoid">
      <div className="bg-blue-100 px-3 py-2 border-b border-gray-300 flex items-center gap-2">
        <PackageSearch className="h-4 w-4 text-blue-800" />
        <span className="font-semibold text-blue-800">PARTS & PO STATUS</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Parts Required Toggle */}
        <div className="flex items-center gap-3">
          <Switch checked={partsRequired} onCheckedChange={setPartsRequired} />
          <Label className="text-sm font-medium">Parts Required?</Label>
        </div>

        {partsRequired && (
          <>
            {/* Linked POs */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Linked Purchase Orders:</p>
              {isLoading ? (
                <p className="text-xs text-muted-foreground">Loading…</p>
              ) : poItems.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No POs linked to this work order</p>
              ) : (
                <div className="space-y-1">
                  {poItems.map((po) => (
                    <div key={po.id} className="flex items-center justify-between bg-muted/50 rounded px-2 py-1 text-xs">
                      <span className="font-mono font-medium">{po.po_number}</span>
                      <span className="text-muted-foreground">{po.supplier}</span>
                      <Badge variant="outline" className="text-[10px]">{po.status}</Badge>
                      {po.confirmed_on_site && <Badge className="bg-green-600 text-white text-[10px]">On Site</Badge>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Parts Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Parts Status:</span>
                <Badge variant="outline" className={statusBadge[partsStatus] ?? ""}>
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
