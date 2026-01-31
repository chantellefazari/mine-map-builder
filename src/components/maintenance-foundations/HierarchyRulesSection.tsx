import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, AlertTriangle, CheckCircle2 } from "lucide-react";

export const HierarchyRulesSection = () => {
  const hierarchyLevels = [
    { level: "1", name: "Site", example: "TCMG", desc: "Top-level site identifier" },
    { level: "2", name: "Facility", example: "Processing Plant", desc: "Major operational facility" },
    { level: "3", name: "Area", example: "Grinding", desc: "Functional process area" },
    { level: "4", name: "Sub-Area", example: "Ball Mill Circuit", desc: "Specific sub-system" },
    { level: "5", name: "Parent Asset", example: "BM01 Ball Mill", desc: "Physical anchor asset" },
    { level: "6", name: "Equipment", example: "BM01-MTR01", desc: "Individual component" },
    { level: "7", name: "Component", example: "Drive Bearing", desc: "OEM-level parts (no asset number)" },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Asset Hierarchy & Parent–Child Rules</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Structural rules for organising assets in a maintenance-logical hierarchy
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hierarchy Levels */}
        <div className="bg-muted/50 rounded-lg p-5">
          <h4 className="font-medium text-foreground mb-4">Hierarchy Structure (7 Levels)</h4>
          <div className="space-y-2">
            {hierarchyLevels.map((item) => (
              <div
                key={item.level}
                className="flex items-center gap-3 bg-background rounded-md p-3 border border-border"
                style={{ marginLeft: `${(parseInt(item.level) - 1) * 16}px` }}
              >
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {item.level}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.name}</span>
                    <code className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {item.example}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent-Child Rules */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Rules
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Every asset must have a parent (except Site level)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Equipment is always nested under a Parent Asset
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Components inherit their parent's Functional Location
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Electrical assets sit under the equipment they power
              </li>
            </ul>
          </div>

          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Constraints
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✕</span>
                Do NOT merge hierarchy levels
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✕</span>
                Do NOT skip levels in the structure
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✕</span>
                Do NOT create orphan assets without parents
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✕</span>
                Components do NOT receive separate asset numbers
              </li>
            </ul>
          </div>
        </div>

        {/* Functional Location Note */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Functional Location Codes</h4>
          <p className="text-sm text-muted-foreground">
            Functional Locations follow the format <code className="font-mono bg-muted px-1 rounded">TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]</code>. 
            Duty/Standby pairs and grouped identical units (e.g., CIP Tanks 1-8) share a single parent FL code to optimise maintenance tracking.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
