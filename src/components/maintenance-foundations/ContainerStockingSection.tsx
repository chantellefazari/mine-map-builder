import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, Zap, Gauge, Wrench, Settings, Droplets, Hammer, Layers, XCircle, Info } from "lucide-react";

export const ContainerStockingSection = () => {
  const stockingCategories = [
    {
      title: "Electrical Components",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      note: "Requires clean, dust-controlled container with airflow.",
      items: [
        "Fuses", "Circuit breakers (MCB / MCCB)", "Contactors", "Overload relays",
        "Control relays", "Power supplies", "Terminal blocks", "Push buttons",
        "Selector switches", "Indicator lights", "PLC I/O cards", "PLC CPUs (spares)",
        "Sensors (photo, proximity)", "Cable glands", "Cable lugs and ferrules",
        "Panel cooling fans", "Panel filters"
      ]
    },
    {
      title: "Instrumentation & Process Control",
      icon: Gauge,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      items: [
        "Pressure transmitters", "Pressure gauges", "Flow switches", "Flow meters (small)",
        "Level switches", "Temperature probes (RTD / TC)", "Solenoid valves",
        "Position switches", "Instrument air regulators", "Small actuators",
        "Instrument fittings", "Tubing and manifolds"
      ]
    },
    {
      title: "Mechanical Wear & Service Parts",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      items: [
        "Bearings", "Bearing housings (small)", "Oil seals", "Mechanical seals",
        "O-rings", "Gaskets", "Couplings", "Coupling inserts", "Keys and key stock",
        "Shims", "Locknuts", "Circlips"
      ]
    },
    {
      title: "Conveyor Small Components",
      icon: Layers,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      items: [
        "Idler rollers (individual)", "Guide rollers", "Skirt rubber (cut lengths)",
        "Impact bars (short)", "Scraper blades", "Belt fasteners", "Pulley lagging strips",
        "Pull cord switches", "Belt alignment switches"
      ]
    },
    {
      title: "Pump & Process Equipment Small Spares",
      icon: Settings,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      items: [
        "Mechanical seal kits", "Impellers (small)", "Wear rings", "Shaft sleeves",
        "Gland packing", "Pump bearings", "Flush kits", "Check valve internals"
      ]
    },
    {
      title: "Valves & Valve Internals",
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      items: [
        "Small manual valves", "Ball valves", "Needle valves", "Check valves",
        "Valve seats", "Seals and diaphragms", "Actuator repair kits", "Solenoid coils"
      ]
    },
    {
      title: "Lubrication & Condition Monitoring",
      icon: Droplets,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      items: [
        "Grease cartridges", "Oil sample bottles", "Breathers", "Sight glasses",
        "Level indicators", "Desiccant breathers", "Oil filters", "Lube fittings",
        "Auto-lube injectors"
      ]
    },
    {
      title: "Fasteners & General Hardware",
      icon: Hammer,
      color: "text-slate-600",
      bgColor: "bg-slate-500/10",
      items: [
        "Bolts", "Nuts", "Washers", "Studs", "Anchors", "Threaded rod",
        "U-bolts", "Hose clamps", "Pins and clips"
      ]
    },
    {
      title: "Consumables & Small Tools",
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
      items: [
        "Hydraulic hoses (short)", "Hose ends and fittings", "Adaptors",
        "Thread sealants", "Adhesives", "Absorbents", "PPE consumables",
        "Small test equipment (multimeters, torque tools)"
      ]
    }
  ];

  const exclusions = [
    "Motors", "Gearboxes", "Pumps (complete)", "Large valves",
    "Drums and chemicals", "Palletised items", "Structural steel"
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Documentation Only</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This section defines what parts are eligible for container storage. It must NOT modify assets, PMs, functional locations, or spares quantities.
          </p>
        </div>
      </div>

      {/* Purpose Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Container Stocking Scope & Parts Zoning</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Eligibility criteria for site container storage at Tennant Creek Mine
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Purpose</h4>
            <p className="text-sm text-muted-foreground mb-3">
              This document defines which spare parts will be stocked inside site containers based on:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Manual handling suitability (≤15 kg)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Frequency of use</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Criticality to plant operation</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Suitability for shelving, bins, and drawers</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">This scope supports:</h4>
            <div className="grid gap-1 sm:grid-cols-2 text-sm text-muted-foreground">
              <span>• Stores design</span>
              <span>• Parts catalogue development</span>
              <span>• Critical spares planning</span>
              <span>• Supplier catalogue alignment</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Container Stocking Rule */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Container Stocking Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              <strong>Only parts that meet ALL criteria are eligible for container storage:</strong>
            </p>
            <ul className="text-sm space-y-2 text-green-600 dark:text-green-400">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Can be safely handled by one person
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Can be stored on shelves or in bins
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Do not require lifting equipment
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-green-500/20">
              Large assemblies (motors, gearboxes, pumps, drums, pallets) are excluded.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Approved Categories */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Approved Container Stocking Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stockingCategories.map((category, index) => (
              <div key={index} className={`rounded-lg p-4 border border-border ${category.bgColor}`}>
                <div className="flex items-center gap-2 mb-3">
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <h4 className="font-medium text-sm">{index + 1}. {category.title}</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-muted-foreground/60">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {category.note && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 pt-2 border-t border-border/50 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {category.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Explicit Exclusions */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg">Explicit Exclusions (Not Stored in Containers)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                These items are stored in laydown yards, racking, or heavy spares areas
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {exclusions.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-md text-sm bg-destructive/10 text-destructive border border-destructive/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Governance Note */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-muted-foreground" />
            Governance Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="text-sm text-muted-foreground">This document:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Defines container eligibility only</li>
              <li>• Does NOT assign stock quantities</li>
              <li>• Does NOT replace supplier catalogues</li>
              <li>• Will be refined as P&IDs and component lists are updated</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Important Instruction */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-destructive">Important Instruction</p>
          <ul className="text-sm text-destructive/80 mt-1 space-y-1">
            <li>⚠️ Do NOT auto-create parts, quantities, or suppliers.</li>
            <li>⚠️ This is a design and governance reference only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
