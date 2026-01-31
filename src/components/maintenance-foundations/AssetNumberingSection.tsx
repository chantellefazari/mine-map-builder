import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, CheckCircle2, AlertCircle } from "lucide-react";

export const AssetNumberingSection = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Hash className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Functional Location Codes</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Site-specific functional location numbering standards
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Placeholder for import */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h4 className="font-medium text-foreground">Ready for Site-Specific Standards</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            This section is prepared for your site-specific functional location numbering standards. 
            Import your FL codes and naming conventions here.
          </p>
        </div>

        {/* Current FL Format Reference */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Current FL Format</h4>
          <p className="text-sm text-muted-foreground">
            Functional Locations follow a structured hierarchy code that maps to physical locations in the plant.
          </p>
          <div className="inline-block bg-background border border-border rounded-lg px-4 py-2">
            <code className="text-lg font-mono font-bold text-primary">TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]</code>
          </div>
        </div>

        {/* Rules */}
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { rule: "Hierarchy-Linked", desc: "FL codes map to physical asset hierarchy" },
            { rule: "System Level", desc: "FLs stop at Parent Asset (System) level" },
            { rule: "Inherited", desc: "Equipment inherits parent's FL code" },
            { rule: "Immutable", desc: "Once assigned, FL codes are not changed" },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2 bg-background rounded-md p-3 border border-border">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{item.rule}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
