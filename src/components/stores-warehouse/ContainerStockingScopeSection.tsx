import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, CheckCircle, XCircle, Zap, Gauge, Wrench, Cog, Hammer, Info } from "lucide-react";

export const ContainerStockingScopeSection = () => {
  const stockingCategories = [
    {
      number: 1,
      code: "C01-EL",
      title: "Electrical (20ft – Positive Airflow)",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      containerType: "20ft Modified Container",
      specialRequirement: "Dust-controlled airflow, sealed cabinets",
      items: [
        "Fuses (all types)", "Circuit breakers (MCB, MCCB)", "RCBOs",
        "Contactors", "Overload relays", "Control relays",
        "Power supplies", "Terminal blocks",
        "Isolator handles & internals", "Push buttons",
        "Selector switches", "Indicator lights",
        "VSD/VFD spare boards", "PLC I/O cards", "PLC CPUs",
        "Sensors (photo, proximity)", "Cable glands", "Cable lugs",
        "Ferrules", "Control cables (cut lengths)",
        "Panel cooling fans", "Panel filters"
      ]
    },
    {
      number: 2,
      code: "C02-IN",
      title: "Instrumentation & Pneumatics (20ft – Clean/Fragile)",
      icon: Gauge,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      containerType: "20ft Modified Container",
      specialRequirement: "Labelled bins, clean storage, fragile care",
      items: [
        "Pressure transmitters", "Pressure gauges",
        "Flow switches", "Flow meters (small)",
        "Level switches", "Temperature probes (RTD / thermocouple)",
        "Solenoid valves (small)", "Positioners",
        "Instrument air regulators / FRLs",
        "Small actuators", "Instrument fittings (SS, brass)",
        "Swagelok fittings", "Tubing (coiled lengths)",
        "Manifolds (small)", "Instrument filters",
        "Pneumatic push-in fittings", "Quick connects",
        "Air hoses (small)", "Mufflers", "Needle valves (small)"
      ]
    },
    {
      number: 3,
      code: "C03-ME",
      title: "Mechanical (40ft – High Volume)",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      containerType: "40ft Standard Container",
      specialRequirement: "Dry storage, high-density bins, heavy items at bottom",
      subCategories: [
        {
          name: "Wear Parts & Liners",
          items: [
            "Wear plates", "Chute liners (rubber, ceramic)",
            "Screen panels", "Crusher liners"
          ]
        },
        {
          name: "Conveyor & Drive",
          items: [
            "Rollers", "Idlers", "Pulleys",
            "Scraper blades", "Belt cleaners",
            "Belts (V-belt, drive belt)", "Belt fasteners",
            "Sprockets", "Chains"
          ]
        },
        {
          name: "Valves, Pipe & Fittings",
          items: [
            "Valves (small–medium, <DN150)",
            "Pipe fittings", "Flanges", "Elbows", "Tees",
            "Reducers", "Nipples", "Hoses",
            "Couplings (heavy)"
          ]
        },
        {
          name: "Pump Spares",
          items: [
            "Seal kits", "Impellers (small)",
            "Wear rings", "Shaft sleeves", "Gland packing"
          ]
        }
      ]
    },
    {
      number: 4,
      code: "C04-MP",
      title: "Mechanical Precision (20ft)",
      icon: Cog,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      containerType: "20ft Standard Container",
      specialRequirement: "Dry, precision bins, anti-contamination",
      items: [
        "Bearings (all types)", "Pillow blocks",
        "Spherical roller bearings", "Ball bearings",
        "Seals (oil, lip, mechanical)", "O-rings", "Gaskets",
        "Shims", "Keys & key stock",
        "Retaining rings (circlips)", "Bushes",
        "Small couplings", "Small shafts",
        "Small valves (<DN150)", "Precision parts",
        "Locknuts"
      ]
    },
    {
      number: 5,
      code: "C05-CS",
      title: "Consumables & Supplies (20ft)",
      icon: Hammer,
      color: "text-slate-600",
      bgColor: "bg-slate-500/10",
      containerType: "20ft Standard Container",
      specialRequirement: "High-organisation Kanban bins, spill kit accessible",
      subCategories: [
        {
          name: "Fasteners & Hardware",
          items: [
            "Bolts", "Nuts", "Washers", "Studs",
            "Anchors", "Threaded rod", "U-bolts",
            "Hose clamps", "Retaining clips", "Pins",
            "Screws"
          ]
        },
        {
          name: "Sealants & Adhesives",
          items: [
            "Loctite", "Silicone", "Threadlocker",
            "PTFE tape", "Thread sealant", "Adhesives"
          ]
        },
        {
          name: "Consumables & PPE",
          items: [
            "Gloves", "Respirators", "Hard hats",
            "Rags", "Absorbents", "Zip ties", "Tape", "Batteries"
          ]
        },
        {
          name: "Lubrication",
          items: [
            "Grease cartridges", "Grease nipples", "Grease fittings",
            "Oil filters (small)", "Breathers", "Sight glasses",
            "Auto-lube injectors", "Oil sample bottles",
            "Desiccant breathers"
          ]
        }
      ]
    }
  ];

  const exclusions = [
    "Complete motors (>15 kg)",
    "Gearboxes",
    "Complete pumps / pump assemblies",
    "Large valves (DN150+)",
    "Large PE/Plasson fittings",
    "Drums and bulk chemicals",
    "Palletised items",
    "Structural steel",
    "Heavy equipment assemblies",
    "Switchboards",
    "Anything requiring forklift"
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Categories Only — No Quantities</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This section defines what TYPES of parts are eligible for container storage. It does not specify stock levels or exact items.
          </p>
        </div>
      </div>

      {/* Header Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Container Stocking Scope (≤15 kg Items)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Part categories eligible for container-based storage
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-300 mb-2">
              <strong>Eligibility Rule:</strong> Only carryable items (≤15 kg) that can be safely handled by one person and stored on shelves or in bins.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stocking Categories */}
      <div className="space-y-4">
        {stockingCategories.map((category) => (
          <Card key={category.number} className={`border-border ${category.bgColor}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${category.bgColor} flex items-center justify-center border border-current/20`}>
                  <span className={`font-bold text-sm ${category.color}`}>{category.number}</span>
                </div>
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{category.code}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items list */}
              {'subCategories' in category && category.subCategories ? (
                <div className="space-y-4">
                  {category.subCategories.map((subCat, subIndex) => (
                    <div key={subIndex}>
                      <h4 className="font-medium text-sm text-foreground mb-2">{subCat.name}</h4>
                      <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                        {subCat.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-muted-foreground/60 mt-0.5">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                  {'items' in category && category.items?.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-muted-foreground/60 mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Container & Requirements */}
              <div className="flex flex-wrap gap-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs bg-background/50 px-3 py-1.5 rounded-md border border-border/50">
                  <span className="font-medium text-foreground">📍 Container:</span>
                  <span className="text-muted-foreground">{category.containerType}</span>
                </div>
                {category.specialRequirement && (
                  <div className="flex items-center gap-2 text-xs bg-background/50 px-3 py-1.5 rounded-md border border-border/50">
                    <Info className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{category.specialRequirement}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exclusions */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-destructive" />
            <CardTitle className="text-lg">Excluded from Container Storage → Laydown Yard (LD)</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            These items are stored in laydown yards, dome rows, or heavy spares areas
          </p>
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
    </div>
  );
};
