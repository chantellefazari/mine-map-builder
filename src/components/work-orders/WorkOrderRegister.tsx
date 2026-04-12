import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Hash, FileText, Check, Loader2 } from "lucide-react";
import { useWorkOrders } from "@/hooks/useWorkOrders";

interface WorkOrderRegisterProps {
  onAllocateWO?: (woNumber: string) => void;
}

export const WorkOrderRegister = ({ onAllocateWO }: WorkOrderRegisterProps) => {
  const { workOrders, isLoading, allocate } = useWorkOrders();

  const handleAllocate = async () => {
    const result = await allocate.mutateAsync("Planned");
    onAllocateWO?.(result.wo_number);
  };

  const WO_RANGES = [
    { type: "Planned (General)", prefix: "WO-11", range: "WO-110001 → WO-119999" },
    { type: "PM (Preventive)", prefix: "WO-12", range: "WO-120001 → WO-129999" },
    { type: "Breakdown (Reactive)", prefix: "WO-13", range: "WO-130001 → WO-139999" },
    { type: "Shutdown", prefix: "WO-14", range: "WO-140001 → WO-149999" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Numbering Logic Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hash className="h-5 w-5 text-primary" />
            Work Order Numbering Logic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Format Structure</h4>
              <div className="bg-background border rounded-lg p-3">
                <code className="text-primary font-mono text-lg">WO-TTNNNN</code>
                <p className="text-xs text-muted-foreground mt-2">
                  Prefix "WO-" + 2-digit type code + 4-digit sequential number
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Type Ranges</h4>
              <div className="bg-background border rounded-lg p-3 space-y-1">
                {WO_RANGES.map((r) => (
                  <p key={r.prefix} className="text-sm"><span className="font-medium font-mono">{r.prefix}:</span> {r.type}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm text-foreground mb-2">Numbering Rules</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                Numbers are assigned sequentially and never reused
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Each work order receives the next available number upon creation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Cancelled work orders retain their number (marked as "Cancelled" status)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                Numbers provide audit trail and chronological reference
              </li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm text-foreground mb-2">Number Ranges</h4>
            <div className="grid grid-cols-2 gap-2">
              {WO_RANGES.map((r) => (
                <Badge key={r.prefix} variant="outline" className="font-mono text-xs justify-start">
                  {r.range}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocate Button */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Allocate Work Order Number
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click below to generate and allocate the next sequential work order number. The number is persisted in the database and will open the template.
            </p>

            <Button
              onClick={handleAllocate}
              disabled={allocate.isPending}
              className="gap-2"
            >
              {allocate.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Create New WO & Open Template
            </Button>

            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                Total Allocated: <span className="font-medium text-foreground">{workOrders.length}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocated Work Orders List */}
      {workOrders.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Allocated Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {workOrders.map((wo) => (
                <Badge
                  key={wo.id}
                  variant="outline"
                  className="font-mono cursor-pointer hover:bg-primary/10"
                  onClick={() => onAllocateWO?.(wo.wo_number)}
                >
                  {wo.wo_number}
                  <span className={`ml-1 text-[10px] ${wo.status === "Open" ? "text-green-600" : "text-muted-foreground"}`}>
                    ({wo.status})
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
