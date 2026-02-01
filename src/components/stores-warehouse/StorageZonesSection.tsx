import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, Zap, Wrench, Gauge, Droplets, Hammer, XCircle, CheckCircle } from "lucide-react";

export const StorageZonesSection = () => {
  const zones = [
    {
      code: "STO-EL",
      name: "Electrical Components Container",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      includes: [
        "Fuses, circuit breakers, contactors",
        "Control relays, power supplies",
        "PLC cards, sensors, switches",
        "Cable glands, lugs, ferrules",
        "Panel fans and filters"
      ],
      excludes: [
        "Oils, greases, lubricants",
        "Dusty mechanical parts",
        "Chemicals or solvents"
      ],
      environment: "Dust-controlled, climate-stable, adequate airflow",
      handling: "Manual only (≤15 kg items)"
    },
    {
      code: "STO-ME",
      name: "Mechanical Small Parts Container",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      includes: [
        "Bearings, seals, O-rings",
        "Couplings, keys, shims",
        "Small rollers, scraper blades",
        "Belt fasteners, pulleys"
      ],
      excludes: [
        "Complete motors or gearboxes",
        "Electrical components",
        "Liquids or chemicals"
      ],
      environment: "Standard industrial, dry storage",
      handling: "Manual only (≤15 kg items)"
    },
    {
      code: "STO-IN",
      name: "Instrumentation & Control Container",
      icon: Gauge,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      includes: [
        "Pressure transmitters, gauges",
        "Flow meters, level switches",
        "Temperature probes (RTD/TC)",
        "Solenoid valves, actuators",
        "Instrument fittings, tubing"
      ],
      excludes: [
        "Heavy process equipment",
        "Bulk chemicals",
        "Mechanical wear parts"
      ],
      environment: "Clean, dust-free, climate-controlled preferred",
      handling: "Manual only, fragile item care"
    },
    {
      code: "STO-LU",
      name: "Lubrication & Oils Container",
      icon: Droplets,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      includes: [
        "Grease cartridges",
        "Oil sample bottles",
        "Breathers, sight glasses",
        "Oil filters, lube fittings",
        "Auto-lube injectors"
      ],
      excludes: [
        "Bulk drums (stored in yard)",
        "Electrical components",
        "Food or potable items"
      ],
      environment: "Ventilated, spill containment provisions",
      handling: "Manual only, spill kit accessible"
    },
    {
      code: "STO-FA",
      name: "Fasteners & Consumables Container",
      icon: Hammer,
      color: "text-slate-600",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/30",
      includes: [
        "Bolts, nuts, washers, studs",
        "Anchors, threaded rod, U-bolts",
        "Hose clamps, pins, clips",
        "Adhesives, sealants, absorbents",
        "PPE consumables, small tools"
      ],
      excludes: [
        "Precision instruments",
        "Electrical components",
        "Bulk items requiring forklift"
      ],
      environment: "Standard industrial, organised bins",
      handling: "Manual only, high-frequency access"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Logical Zones Only</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            These are logical storage zones — not physical layouts. No dimensions, shelves, or rack configurations are defined here.
          </p>
        </div>
      </div>

      {/* Header Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Storage Zones & Logical Areas</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Define what belongs where — before physical design
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Zones */}
      <div className="space-y-4">
        {zones.map((zone, index) => (
          <Card key={index} className={`border-border ${zone.bgColor}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <zone.icon className={`w-6 h-6 ${zone.color}`} />
                <div>
                  <CardTitle className="text-lg">{zone.name}</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">{zone.code}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {/* Includes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Includes</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                  {zone.includes.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Excludes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <XCircle className="w-4 h-4" />
                  <span>Must NOT Store</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                  {zone.excludes.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              {/* Environment & Handling */}
              <div className="md:col-span-2 grid gap-2 sm:grid-cols-2 pt-2 border-t border-border/50">
                <div className="text-sm">
                  <span className="font-medium text-foreground">Environment: </span>
                  <span className="text-muted-foreground">{zone.environment}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-foreground">Handling: </span>
                  <span className="text-muted-foreground">{zone.handling}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
