import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, CheckCircle, XCircle, Zap, Gauge, Wrench, Settings, Droplets, Hammer, Cable, Cog, Info } from "lucide-react";

export const ContainerStockingScopeSection = () => {
  const stockingCategories = [
    {
      number: 1,
      title: "Electrical",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      containerType: "Electrical container",
      specialRequirement: "Airflow, dust control, sealed cabinets",
      items: [
        "Fuses (all types)",
        "Circuit breakers (MCB, MCCB)",
        "Contactors",
        "Overload relays",
        "Control relays",
        "Power supplies",
        "Terminal blocks",
        "Isolator handles & internals",
        "Push buttons",
        "Selector switches",
        "Indicator lights",
        "VSD spare boards (small)",
        "PLC I/O cards",
        "PLC CPUs (spares)",
        "Sensors (photo, proximity)",
        "Cable glands",
        "Cable lugs",
        "Ferrules",
        "Control cables (cut lengths)",
        "Panel cooling fans",
        "Panel filters"
      ]
    },
    {
      number: 2,
      title: "Instrumentation & Process Control",
      icon: Gauge,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      containerType: "Often paired with electrical container",
      specialRequirement: "Labelled bins + clean storage",
      items: [
        "Pressure transmitters",
        "Pressure gauges",
        "Flow switches",
        "Flow meters (small)",
        "Level switches",
        "Temperature probes (RTD / thermocouple)",
        "Solenoid valves",
        "Position switches",
        "Instrument air regulators",
        "Small actuators",
        "Instrument fittings (SS, brass)",
        "Tubing (coiled lengths)",
        "Manifolds",
        "Instrument filters"
      ]
    },
    {
      number: 3,
      title: "Mechanical Wear & Service Parts (Small)",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      containerType: "Mechanical container",
      specialRequirement: "Dry storage, organised bins",
      subCategories: [
        {
          name: "Bearings & Power Transmission",
          items: [
            "Bearings (all sizes)",
            "Bearing housings (small)",
            "Seals (oil, lip, mechanical)",
            "O-rings",
            "Gaskets",
            "Couplings (jaw, grid, flexible)",
            "Coupling inserts / spiders",
            "Keys & key stock",
            "Shims",
            "Locknuts",
            "Retaining rings (circlips)"
          ]
        },
        {
          name: "Conveyor Components (Small)",
          items: [
            "Idler rollers (return / trough – individual)",
            "Guide rollers",
            "Skirt rubber (cut lengths)",
            "Impact bars (short)",
            "Scraper blades",
            "Belt fasteners",
            "Pulley lagging strips",
            "Belt tracking components",
            "Pull cord switches",
            "Belt alignment switches"
          ]
        }
      ]
    },
    {
      number: 4,
      title: "Pumps & Process Equipment – Small Spares",
      icon: Cog,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      containerType: "Mechanical container",
      specialRequirement: "NOT full pumps — parts only",
      items: [
        "Mechanical seals",
        "Seal kits",
        "Impellers (small)",
        "Wear rings",
        "Shaft sleeves",
        "O-rings",
        "Gland packing",
        "Pump bearings",
        "Flush kits",
        "Check valve internals"
      ]
    },
    {
      number: 5,
      title: "Valves & Valve Internals",
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      containerType: "Mechanical or dedicated valve container",
      specialRequirement: null,
      items: [
        "Small manual valves",
        "Ball valves",
        "Needle valves",
        "Check valves",
        "Valve seal kits",
        "Seats",
        "Stems",
        "Actuator repair kits",
        "Solenoid coils",
        "Diaphragms"
      ]
    },
    {
      number: 6,
      title: "Lubrication & Condition Monitoring",
      icon: Droplets,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      containerType: "Lubrication container",
      specialRequirement: "Ventilated, spill containment",
      items: [
        "Grease cartridges",
        "Oil sample bottles",
        "Breathers",
        "Sight glasses",
        "Level indicators",
        "Desiccant breathers",
        "Oil filters",
        "Lube lines & fittings",
        "Auto-lube injectors",
        "Grease nipples"
      ]
    },
    {
      number: 7,
      title: "Fasteners & General Hardware",
      icon: Hammer,
      color: "text-slate-600",
      bgColor: "bg-slate-500/10",
      containerType: "Fasteners container",
      specialRequirement: "High-organisation bins (Kanban friendly)",
      items: [
        "Bolts",
        "Nuts",
        "Washers",
        "Studs",
        "Anchors",
        "Threaded rod",
        "U-bolts",
        "Hose clamps",
        "Retaining clips",
        "Pins"
      ]
    },
    {
      number: 8,
      title: "Hoses, Fittings & Consumables",
      icon: Cable,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
      containerType: "Consumables container",
      specialRequirement: null,
      items: [
        "Hydraulic hoses (short)",
        "Hose ends",
        "Adaptors",
        "Fittings (BSP, NPT, metric)",
        "PTFE tape",
        "Thread sealant",
        "Sealants",
        "Adhesives",
        "Rags",
        "Absorbents",
        "PPE consumables (gloves, earplugs)"
      ]
    },
    {
      number: 9,
      title: "Tools & Test Equipment (Optional Container)",
      icon: Wrench,
      color: "text-rose-600",
      bgColor: "bg-rose-500/10",
      containerType: "Controlled tools container (optional)",
      specialRequirement: "If choosing to store controlled tools separately",
      items: [
        "Multimeters",
        "Insulation testers",
        "Torque wrenches",
        "Laser alignment tools",
        "Dial indicators",
        "Bearing heaters (small)",
        "Pullers",
        "Calibration tools"
      ]
    }
  ];

  const exclusions = [
    "Complete motors (>15 kg)",
    "Gearboxes",
    "Complete pumps",
    "Large valves",
    "Drums and bulk chemicals",
    "Palletised items",
    "Structural steel",
    "Heavy equipment assemblies"
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
                <CardTitle className="text-lg">{category.title}</CardTitle>
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
                  {category.items?.map((item, i) => (
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
            <CardTitle className="text-lg">Excluded from Container Storage</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            These items are stored in laydown yards, racking, or heavy spares areas
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
