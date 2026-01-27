import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Hash, FileText, Check } from "lucide-react";

interface WorkOrderRegisterProps {
  onAllocateWO?: (woNumber: string) => void;
}

// Generate first 150 work order numbers
const generateWorkOrderNumbers = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => 
    `WO-${String(i + 1).padStart(6, "0")}`
  );
};

export const WorkOrderRegister = ({ onAllocateWO }: WorkOrderRegisterProps) => {
  const workOrderNumbers = generateWorkOrderNumbers(150);
  const [selectedWO, setSelectedWO] = useState<string>("");
  const [allocatedNumbers, setAllocatedNumbers] = useState<Set<string>>(new Set());

  const handleAllocate = () => {
    if (selectedWO && !allocatedNumbers.has(selectedWO)) {
      setAllocatedNumbers(prev => new Set([...prev, selectedWO]));
      onAllocateWO?.(selectedWO);
    }
  };

  const availableNumbers = workOrderNumbers.filter(wo => !allocatedNumbers.has(wo));
  const nextAvailable = availableNumbers[0] || "All allocated";

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
                <code className="text-primary font-mono text-lg">WO-XXXXXX</code>
                <p className="text-xs text-muted-foreground mt-2">
                  Prefix "WO-" + 6-digit sequential number
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Capacity</h4>
              <div className="bg-background border rounded-lg p-3">
                <p className="text-sm"><span className="font-medium">Range:</span> WO-000001 to WO-999999</p>
                <p className="text-sm"><span className="font-medium">Total Capacity:</span> 999,999 work orders</p>
                <p className="text-xs text-muted-foreground mt-1">
                  At 50 WOs/week = ~385 years of capacity
                </p>
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

          <div className="flex items-center gap-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Next Available Number:</span>
            </div>
            <Badge variant="outline" className="font-mono text-primary border-primary">
              {nextAvailable}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Work Order Allocation */}
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
              Select a work order number to allocate it to a new work order. Once allocated, the number will be reserved and the work order template will open.
            </p>
            
            <div className="flex items-center gap-4">
              <Select value={selectedWO} onValueChange={setSelectedWO}>
                <SelectTrigger className="w-64 font-mono">
                  <SelectValue placeholder="Select WO Number..." />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50 max-h-64">
                  {workOrderNumbers.map((woNum) => {
                    const isAllocated = allocatedNumbers.has(woNum);
                    return (
                      <SelectItem 
                        key={woNum} 
                        value={woNum} 
                        className="font-mono"
                        disabled={isAllocated}
                      >
                        <span className="flex items-center gap-2">
                          {woNum}
                          {isAllocated && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Allocated
                            </Badge>
                          )}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleAllocate}
                disabled={!selectedWO || allocatedNumbers.has(selectedWO)}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Allocate & Open Template
              </Button>
            </div>

            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                Available: <span className="font-medium text-foreground">{availableNumbers.length}</span>
              </span>
              <span className="text-muted-foreground">
                Allocated: <span className="font-medium text-green-600">{allocatedNumbers.size}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocated Work Orders List */}
      {allocatedNumbers.size > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Allocated Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(allocatedNumbers).sort().map((woNum) => (
                <Badge 
                  key={woNum} 
                  variant="outline" 
                  className="font-mono cursor-pointer hover:bg-primary/10"
                  onClick={() => onAllocateWO?.(woNum)}
                >
                  {woNum}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
