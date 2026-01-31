import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const HierarchyRulesSection = () => {
  const hierarchyLevels = [
    { level: "1", name: "Site", example: "TCMG", desc: "Top-level site identifier" },
    { level: "2", name: "Facility", example: "Processing Plant", desc: "Major operational facility" },
    { level: "3", name: "Main Area", example: "SITE / UTL / COM / REC / TAIL / SUP", desc: "High-level process grouping (not an asset)" },
    { level: "4", name: "Sub-Area", example: "Ball Mill Circuit, CIP Area, Power Generation", desc: "Logical process subdivision" },
    { level: "5", name: "Parent Asset (System)", example: "BM01 Ball Mill, FP01 Filter Press", desc: "Physical anchor asset for maintenance tracking" },
    { level: "6", name: "Equipment", example: "BM01-MTR01, FP01-GBX01", desc: "Maintainable equipment items" },
    { level: "7", name: "Component", example: "Bearings, seals, impellers, belts", desc: "OEM-level parts (no asset number)" },
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
              Approved hierarchy structure and rules for maintenance, reporting, and future asset creation
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Documentation Notice */}
        <Alert className="border-amber-500/50 bg-amber-500/5">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm">
            <strong>This section is descriptive and instructional only.</strong> It does not modify, move, rename, or update any existing assets or hierarchy data. This document governs future creation and use.
          </AlertDescription>
        </Alert>

        {/* Purpose */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Purpose
          </h4>
          <p className="text-sm text-muted-foreground">
            This document defines the approved hierarchy structure and rules used at Tennant Creek Mine for maintenance, reporting, and future asset creation. This is exactly how SAP / Maximo / D365 mature sites operate — separating rules from data and protecting the asset tree.
          </p>
        </div>

        {/* Hierarchy Levels */}
        <div className="bg-muted/50 rounded-lg p-5">
          <h4 className="font-medium text-foreground mb-4">Approved Asset Hierarchy (7 Levels)</h4>
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
                  <div className="flex items-center gap-2 flex-wrap">
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
              Parent–Child Rules
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Every level (except Site) must have a parent
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Equipment must always sit under a Parent Asset
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Components inherit the Functional Location of their parent
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                Electrical equipment sits under the equipment it powers
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                No orphan assets are permitted
              </li>
            </ul>
          </div>

          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Constraints (Non-Negotiable)
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
                Do NOT create duplicate Parent Assets
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✕</span>
                Do NOT assign asset numbers to components
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✕</span>
                Do NOT change hierarchy once assigned
              </li>
            </ul>
          </div>
        </div>

        {/* Functional Location Rules */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Functional Location Rules</h4>
          <div className="space-y-3">
            <div className="inline-block bg-background border border-border rounded-lg px-4 py-2">
              <code className="text-lg font-mono font-bold text-primary">TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]</code>
            </div>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                FLs stop at Parent Asset (System) level
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Equipment and components inherit the parent FL
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Duty/Standby and identical grouped assets share one Parent FL
              </li>
            </ul>
          </div>
        </div>

        {/* Asset Numbering Rules */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Asset Numbering Rules</h4>
          <div className="inline-block bg-background border border-border rounded-lg px-4 py-2">
            <code className="text-lg font-mono font-bold text-primary">[AREA][NN]-[TYPE][NN]</code>
          </div>
          <div className="grid gap-3 md:grid-cols-2 mt-4">
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="text-sm font-medium">Examples</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li><code className="font-mono">APRN01-CV01</code> — Transfer Conveyor 01</li>
                <li><code className="font-mono">GRND01-BM01</code> — Ball Mill 01</li>
                <li><code className="font-mono">FILT01-FP01</code> — Filter Press 01</li>
              </ul>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="text-sm font-medium">Equipment Abbreviations</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li><code className="font-mono">CV</code> — Conveyor</li>
                <li><code className="font-mono">PP</code> — Pump</li>
                <li><code className="font-mono">MTR</code> — Motor</li>
                <li><code className="font-mono">GBX</code> — Gearbox</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Asset Numbering Rules Grid */}
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { rule: "Sequential", desc: "Numbers allocated in order within each Area" },
            { rule: "Unique", desc: "No duplicate asset numbers across site" },
            { rule: "Immutable", desc: "Once assigned, numbers are never reused or changed" },
            { rule: "No Gaps", desc: "Unused numbers documented with reason" },
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
