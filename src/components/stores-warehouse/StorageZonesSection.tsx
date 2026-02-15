import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, Zap, Wrench, Gauge, Hammer, XCircle, CheckCircle, Cog, Truck } from "lucide-react";

export const StorageZonesSection = () => {
  const zones = [
    {
      code: "C01-EL",
      name: "Electrical Container (20ft)",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      includes: [
        "Fuses, circuit breakers, contactors",
        "Control relays, power supplies, PLCs",
        "VSD/VFD spare boards, I/O cards",
        "Cable glands, lugs, ferrules",
        "Push buttons, selector switches, indicator lights",
        "Panel fans and filters"
      ],
      excludes: [
        "Motors, gearboxes (→ LD)",
        "Switchboards (→ LD)",
        "Oils, greases, lubricants",
        "Dusty mechanical parts"
      ],
      environment: "Dust-controlled, positive airflow, sealed cabinets",
      handling: "Manual only (≤15 kg items)"
    },
    {
      code: "C02-IN",
      name: "Instrumentation & Pneumatics Container (20ft)",
      icon: Gauge,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      includes: [
        "Pressure transmitters, gauges",
        "Flow meters, level switches",
        "Temperature probes (RTD/TC), thermowells",
        "Sensors (pressure, proximity, radar level)",
        "Electrode holders, analysers, signal converters",
        "Solenoid valves, positioners",
        "Process control valves (diaphragm, pinch)",
        "Instrument fittings, Swagelok, tubing",
        "Pneumatic regulators, FRLs",
        "Push-in fittings, quick connects, manifolds",
        "Small pneumatic cylinders & actuators"
      ],
      excludes: [
        "Heavy pneumatic valve assemblies DN150+ (→ LD)",
        "Vehicle/engine air filters (→ C05-FA)",
        "Electrical components (→ C01)",
        "Mechanical wear parts (→ C03)"
      ],
      environment: "Clean, dust-free, climate-controlled preferred",
      handling: "Manual only, fragile item care"
    },
    {
      code: "C03-MW",
      name: "Mechanical Wear / Heavy Container (40ft)",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      includes: [
        "Wear plates, liners, ceramic/rubber liners",
        "Rollers, idlers, pulleys, sprockets",
        "Scraper blades, belt cleaners, belts",
        "Valves (small–medium), pipe fittings",
        "Couplings, chains, hoses",
        "PE/Plasson fittings (small), flanges, elbows"
      ],
      excludes: [
        "Precision bearings/seals (→ C04-ME)",
        "Complete motors or gearboxes (→ LD)",
        "Electrical components (→ C01)",
        "Fasteners/consumables (→ C05)"
      ],
      environment: "Standard industrial, dry storage, high-density bins",
      handling: "Manual only (≤15 kg items)"
    },
    {
      code: "C04-ME",
      name: "Mechanical Small Precision Container (20ft)",
      icon: Cog,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      includes: [
        "Bearings (all types), pillow blocks",
        "Seals, O-rings, gaskets",
        "Shims, keys, retaining rings, circlips",
        "Small couplings, small shafts",
        "Mechanical seals, bushes",
        "Small valves (<DN150), precision parts"
      ],
      excludes: [
        "Sensors, gauges, flowmeters (→ C02-IN)",
        "Pneumatic regulators, filter regulators (→ C02-IN)",
        "Wear parts, liners (→ C03-MW)",
        "Belts, rollers, idlers (→ C03-MW)",
        "Electrical components (→ C01)",
        "Fasteners (→ C05)"
      ],
      environment: "Dry storage, organised precision bins",
      handling: "Manual only (≤15 kg items)"
    },
    {
      code: "C05-FA",
      name: "Fasteners, Consumables & Lubrication Container (20ft)",
      icon: Hammer,
      color: "text-slate-600",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/30",
      includes: [
        "Bolts, nuts, washers, studs, anchors",
        "Threaded rod, U-bolts, hose clamps, pins",
        "Adhesives, sealants, Loctite, silicone",
        "PPE consumables, gloves, tape, zip ties",
        "Grease cartridges, oil filters, breathers",
        "Sight glasses, auto-lube injectors, grease nipples",
        "Vehicle/engine/cabin air filters"
      ],
      excludes: [
        "Instrument air filters/regulators (→ C02-IN)",
        "Structural pipe fittings (→ C03-MW)",
        "Precision instruments (→ C02)",
        "Electrical components (→ C01)",
        "Bulk drums/oils (→ LD)"
      ],
      environment: "Standard industrial, high-organisation bins (Kanban)",
      handling: "Manual only, high-frequency access"
    },
    {
      code: "LD",
      name: "Laydown Yard (External Storage)",
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      includes: [
        "Complete motors, gearboxes, pump assemblies",
        "Large pulleys, drums, shaft assemblies",
        "Heavy pneumatic valve assemblies DN150+",
        "Crusher liners, cone liners, mantles, screen panels",
        "Switchboards, large frames, complete assemblies",
        "Bulk drums, oils, palletised items",
        "Any item >15 kg or requiring forklift handling"
      ],
      excludes: [
        "Small electrical components (→ C01-EL)",
        "Instruments, sensors (→ C02-IN)",
        "Bearings, seals, precision parts (→ C04-ME)",
        "Fasteners, consumables (→ C05-FA)"
      ],
      environment: "Outdoor / covered laydown, dome rows, yard bays",
      handling: "Forklift / crane, heavy lifting equipment required"
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
