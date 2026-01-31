import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Hash } from "lucide-react";

export const JobNumberingSection = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Hash className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Job Numbering Rules</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Standards for unique job numbering and traceability
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Numbering Format</h4>
            <p className="text-sm text-muted-foreground mb-3">
              All work orders use a standardised 6-digit sequential numbering system:
            </p>
            <div className="inline-block bg-background border border-border rounded-lg px-4 py-2">
              <code className="text-lg font-mono font-bold text-primary">WO-XXXXXX</code>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Example: WO-000001, WO-000150, WO-001234
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-foreground mb-2">Numbering Rules</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">1.</span>
                <span><strong>Unique:</strong> Each job number must be unique and never reused</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">2.</span>
                <span><strong>Sequential:</strong> Numbers are allocated in sequence from a central register</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">3.</span>
                <span><strong>Controlled:</strong> Numbers are reserved before work begins, not after</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">4.</span>
                <span><strong>Traceable:</strong> Every number links to documented work and history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary">5.</span>
                <span><strong>No Gaps:</strong> Unused numbers should be recorded with a reason</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
