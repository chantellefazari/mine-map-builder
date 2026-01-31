import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export const MaintenanceHistorySection = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <History className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Maintenance History Structure</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              How maintenance history should be cleaned, structured, and used
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Quality maintenance history is critical for failure analysis, reliability improvement, and CMMS migration. 
          History must be cleaned and structured before it can be used effectively.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-600 text-xs font-bold flex items-center justify-center">1</span>
              Clean
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Remove duplicates</li>
              <li>• Standardise descriptions</li>
              <li>• Correct asset linkages</li>
              <li>• Fill missing fields</li>
              <li>• Validate dates/times</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold flex items-center justify-center">2</span>
              Structure
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Link to asset hierarchy</li>
              <li>• Categorise by work type</li>
              <li>• Tag failure modes</li>
              <li>• Associate parts used</li>
              <li>• Record labour hours</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-600 text-xs font-bold flex items-center justify-center">3</span>
              Use
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Analyse failure patterns</li>
              <li>• Justify PM frequencies</li>
              <li>• Identify bad actors</li>
              <li>• Support defect elimination</li>
              <li>• Inform spare stocking</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
