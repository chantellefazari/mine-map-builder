import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, CheckCircle2 } from "lucide-react";

export const AssetNumberingSection = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Hash className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Site Part Numbering Standards</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Consistent numbering conventions for spare parts and consumables
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Part Numbering */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Site Part Number Format</h4>
          <p className="text-sm text-muted-foreground">
            Site-specific part numbers are assigned for inventory management. OEM part numbers are retained as reference only.
          </p>
          <div className="inline-block bg-background border border-border rounded-lg px-4 py-2">
            <code className="text-lg font-mono font-bold text-primary">TCMG-[CAT]-[NNNN]</code>
          </div>
          <div className="grid gap-2 mt-4">
            {[
              { code: "TCMG-BRG-0001", desc: "Bearing, Ball 6310-2RS" },
              { code: "TCMG-SEL-0042", desc: "Seal, Mechanical 65mm" },
              { code: "TCMG-VLV-0103", desc: "Valve, Gate DN100 PN16" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-background rounded-md p-2 border border-border">
                <code className="font-mono text-xs text-primary">{item.code}</code>
                <span className="text-xs text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Codes */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Category Codes</h4>
          <p className="text-sm text-muted-foreground">
            Standard category abbreviations used in part numbering:
          </p>
          <div className="grid gap-2 md:grid-cols-3">
            {[
              { code: "BRG", desc: "Bearings" },
              { code: "SEL", desc: "Seals" },
              { code: "VLV", desc: "Valves" },
              { code: "PPE", desc: "PPE & Safety" },
              { code: "FLT", desc: "Filters" },
              { code: "BLT", desc: "Belts" },
              { code: "HSE", desc: "Hoses" },
              { code: "ELC", desc: "Electrical" },
              { code: "FST", desc: "Fasteners" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-background rounded-md p-2 border border-border">
                <code className="font-mono text-xs text-primary font-bold">{item.code}</code>
                <span className="text-xs text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { rule: "Unique", desc: "No duplicate part numbers across site" },
            { rule: "Sequential", desc: "Numbers allocated in order within each category" },
            { rule: "OEM Reference", desc: "OEM part numbers stored as cross-reference only" },
            { rule: "Immutable", desc: "Once assigned, part numbers are never reused" },
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
