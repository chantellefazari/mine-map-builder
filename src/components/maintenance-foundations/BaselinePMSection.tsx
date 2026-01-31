import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

export const BaselinePMSection = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Baseline PM List</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              What PMs currently exist and how this baseline will be used
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The baseline PM list captures all currently defined preventive maintenance activities. 
          This serves as the foundation for future optimisation, scheduling, and CMMS configuration.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Purpose of the Baseline</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Document what PMs exist today</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Identify gaps in current coverage</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Provide starting point for optimisation</span>
              </li>
            </ul>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Enable before/after comparison</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Support CMMS migration planning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Track PM maturity over time</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Important Note
          </h4>
          <p className="text-sm text-muted-foreground">
            The baseline is a snapshot, not a schedule. PMs in the baseline are not yet linked to specific assets 
            or scheduled for execution. Asset linking and scheduling happen in the CMMS after PM design is approved.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
