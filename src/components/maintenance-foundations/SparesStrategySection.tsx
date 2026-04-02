import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertCircle, CheckCircle2, ArrowDown, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SparesStrategySection = () => {
  const criticalityLevels = [
    {
      level: "HIGH",
      color: "border-l-red-500 bg-red-500/5",
      badge: "destructive" as const,
      desc: "Production/Safety Critical",
      impact: "Failure causes immediate plant stoppage or safety risk",
      examples: "Motors, Gearboxes, Major Pumps, PLCs, VSDs, Crushers, Compressors, Transformers, Hoses",
      policy: "Min/Max levels mandatory, long lead time buffer",
      keywordNote: "Matches complete equipment assemblies and major drive units",
    },
    {
      level: "MEDIUM",
      color: "border-l-orange-500 bg-orange-500/5",
      badge: "default" as const,
      desc: "Reliability/Throughput Impact",
      impact: "Plant can run in degraded mode, manageable delay",
      examples: "Bearings, Seals, Valves, Instrumentation, Idlers, Pulleys, Couplings, Contactors, Screens",
      policy: "Min/Max levels recommended, reorder point set",
      keywordNote: "Matches reliability components, sensors, and wear items",
    },
    {
      level: "LOW",
      color: "border-l-green-500 bg-green-500/5",
      badge: "secondary" as const,
      desc: "Operational/Consumable",
      impact: "Minimal disruption, readily available or easy to source",
      examples: "Fasteners, Pipe Fittings, Filters, O-Rings, Cable Ties, PPE, Gaskets, Pump Parts, V-Belts",
      policy: "Stores-managed, replenish on demand",
      keywordNote: "Matches consumables, fittings, individual components, and kits",
    },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Spare Parts Strategy & Criticality Definitions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Inventory classification and stocking rules based on maintenance criticality
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Classification Engine Logic */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            Auto-Classification Engine
          </h4>
          <p className="text-sm text-muted-foreground">
            Every spare part is automatically classified by scanning its description against keyword libraries.
            The engine uses <span className="font-medium text-foreground">word-boundary regex</span> to prevent partial matches (e.g. "bolt" won't match "bolting").
          </p>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-medium text-foreground">Priority check order:</span>
            <Badge variant="secondary" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              1. LOW first
            </Badge>
            <ArrowDown className="w-3 h-3 text-muted-foreground" />
            <Badge variant="destructive" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              2. HIGH
            </Badge>
            <ArrowDown className="w-3 h-3 text-muted-foreground" />
            <Badge variant="default" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
              3. MEDIUM
            </Badge>
            <ArrowDown className="w-3 h-3 text-muted-foreground" />
            <Badge variant="outline" className="gap-1">
              Default → LOW
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground italic">
            LOW is checked first so component-level items (e.g. "pump sleeve", "motor hub") are correctly classified as consumables
            rather than being falsely elevated by generic equipment keywords like "pump" or "motor".
          </p>
        </div>

        {/* Criticality Matrix */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Criticality Classification</h4>
          <div className="grid gap-4">
            {criticalityLevels.map((item) => (
              <div
                key={item.level}
                className={`rounded-lg p-4 border-l-4 ${item.color}`}
              >
                <div className="flex items-start gap-3">
                  <Badge variant={item.badge} className="mt-0.5">
                    {item.level}
                  </Badge>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="font-medium text-sm">{item.desc}</p>
                      <p className="text-xs text-muted-foreground">{item.impact}</p>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 text-xs">
                      <div>
                        <span className="font-medium text-foreground">Examples: </span>
                        <span className="text-muted-foreground">{item.examples}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Policy: </span>
                        <span className="text-muted-foreground">{item.policy}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground/70 italic">{item.keywordNote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* is_critical flag */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 text-sm">Database Flag: is_critical</h4>
          <p className="text-xs text-muted-foreground">
            Only <Badge variant="destructive" className="text-[10px] px-1.5 py-0">HIGH</Badge> items set <code className="bg-muted px-1 rounded text-[11px]">is_critical = true</code> in the database.
            MEDIUM and LOW items are always <code className="bg-muted px-1 rounded text-[11px]">false</code>.
            The "Reclassify Criticality" bulk action in the Spares Catalogue re-scans all 2,000+ items and updates this flag.
          </p>
        </div>

        {/* Stocking Rules */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Stocking Rules</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { rule: "Lead Time Buffer", desc: "HIGH items: stock ≥ 2× lead time consumption" },
              { rule: "Min/Max Levels", desc: "Set for HIGH and MEDIUM items only" },
              { rule: "Reorder Point", desc: "Trigger when stock falls below minimum" },
              { rule: "Criticality Source", desc: "Tag as 'Confirmed' or 'Assumed' pending verification" },
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
        </div>

        {/* Data Status */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Data Status Definitions
          </h4>
          <div className="grid gap-2 md:grid-cols-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-300">Provisional</Badge>
              <span className="text-xs text-muted-foreground">Initial entry, rough values</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-300">TBC</Badge>
              <span className="text-xs text-muted-foreground">Awaiting verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-300">Confirmed</Badge>
              <span className="text-xs text-muted-foreground">Engineering verified</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
