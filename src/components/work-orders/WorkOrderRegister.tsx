import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Hash } from "lucide-react";

// Generate first 150 work order numbers
const generateWorkOrderNumbers = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => 
    `WO-${String(i + 1).padStart(6, "0")}`
  );
};

export const WorkOrderRegister = () => {
  const workOrderNumbers = generateWorkOrderNumbers(150);
  const [selectedWO, setSelectedWO] = useState<string>("");

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
              WO-000151
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Work Order Number Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Work Order Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Select Work Order:</span>
              <Select value={selectedWO} onValueChange={setSelectedWO}>
                <SelectTrigger className="w-64 font-mono">
                  <SelectValue placeholder="Select WO Number..." />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50 max-h-64">
                  {workOrderNumbers.map((woNum) => (
                    <SelectItem key={woNum} value={woNum} className="font-mono">
                      {woNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedWO && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-mono font-medium text-primary">{selectedWO}</span>
                </p>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Showing first 150 work order numbers (WO-000001 to WO-000150)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
