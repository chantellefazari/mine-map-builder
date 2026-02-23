import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Package, ClipboardList } from "lucide-react";
import { WorkOrderPart, computeWOPartsStatus, computeReadyToExecute } from "@/hooks/useWorkOrderParts";
import { POTrackerItem } from "@/hooks/usePOTracker";

interface WOOverviewTabProps {
  partsRequired: boolean;
  onPartsRequiredChange: (v: boolean) => void;
  parts: WorkOrderPart[];
  linkedPOs: POTrackerItem[];
}

const statusColors: Record<string, string> = {
  "N/A": "border-muted text-muted-foreground",
  "PO Required": "border-destructive/30 bg-destructive/10 text-destructive",
  "Awaiting Parts": "border-amber-200 bg-amber-100 text-amber-800",
  "Parts Ready": "border-green-200 bg-green-100 text-green-800",
  "Complete": "border-primary/30 bg-primary/10 text-primary",
};

export const WOOverviewTab = ({ partsRequired, onPartsRequiredChange, parts, linkedPOs }: WOOverviewTabProps) => {
  const partsStatus = partsRequired ? computeWOPartsStatus(parts) : "N/A";
  const allOnSite = partsRequired ? parts.length > 0 && parts.every((p) => p.status === "On Site" || p.status === "In Laydown Yard" || p.status === "Installed") : true;
  const readyToExecute = computeReadyToExecute(partsRequired, parts);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <Switch checked={partsRequired} onCheckedChange={onPartsRequiredChange} />
        <Label className="text-sm font-medium">Parts Required?</Label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Parts Status</p>
          <Badge variant="outline" className={statusColors[partsStatus] ?? ""}>
            {partsStatus}
          </Badge>
        </div>

        <div className="border rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Linked POs</p>
          <div className="flex items-center gap-1.5">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold">{linkedPOs.length}</span>
          </div>
        </div>

        <div className="border rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">All Parts On Site?</p>
          <div className="flex items-center gap-1.5">
            {allOnSite ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm font-medium">{allOnSite ? "Yes" : "No"}</span>
          </div>
        </div>

        <div className="border rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Ready To Execute?</p>
          <div className="flex items-center gap-1.5">
            {readyToExecute ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <Badge variant={readyToExecute ? "default" : "destructive"} className="text-xs">
              {readyToExecute ? "Ready" : "Not Ready"}
            </Badge>
          </div>
        </div>
      </div>

      {partsRequired && parts.length > 0 && (
        <div className="border rounded-lg p-3">
          <p className="text-xs text-muted-foreground font-medium mb-2">Parts Summary</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {["Not Ordered", "Ordered", "On Site", "In Laydown Yard", "Installed"].map((s) => {
              const count = parts.filter((p) => p.status === s).length;
              if (count === 0) return null;
              return (
                <span key={s} className="px-2 py-1 bg-muted rounded text-muted-foreground">
                  {s}: {count}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
