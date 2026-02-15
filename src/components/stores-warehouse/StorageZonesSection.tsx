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
        "Push buttons, selector switches, indicator/pilot lights",
        "Soft starters, panel fans and filters",
        "LED battens, floodlights, emergency/exit lighting",
        "Electrical enclosures, pole fillers, DIN sockets",
        "Panel wire, flexible panel wire"
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
      name: "Instrumentation, Pneumatics & Process Fittings Container (20ft)",
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
        "SMC KQ2 fittings, nylon tubing, one-touch connectors",
        "Pneumatic check valves, hand valves, lubricators",
        "Silencers, bulkhead unions, exhaust accessories",
        "Encoders, tachometers, weight processors",
        "Flow restrictors, positioners",
        "Norgren/Norgen pneumatic fittings & connectors",
        "Test instruments (multimeters, clamp meters, meggers)",
        "Dosing pumps, metering pumps",
        "4-20mA signal devices, process pump tubing",
        "Hydraulic/pneumatic directional control valves (CETOP, DCV)",
        "M12 sensor connectors",
        "Small pneumatic cylinders & actuators",
        "BSP nipples, elbows, reducers (Class 150, stainless/steel)",
        "Backing rings",
        "Strainers, filter elements"
      ],
      excludes: [
        "Heavy pneumatic valve assemblies DN150+ (→ LD)",
        "Vehicle/engine air filters (→ C05-FA)",
        "Electrical components (→ C01)",
        "Mechanical wear parts (→ C03)",
        "PE/Plasson bulk fittings (→ C03-ME)"
      ],
      environment: "Clean, dust-free, climate-controlled preferred",
      handling: "Manual only, fragile item care"
    },
    {
      code: "C03-ME",
      name: "Mechanical Container (40ft)",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      includes: [
        "Small wear plates, rubber/ceramic liners (<15 kg)",
        "Rollers, idlers, pulleys, sprockets, belts",
        "Scraper blades, belt cleaners, conveyor frames & brackets",
        "Valves (ball, butterfly, knife gate, check, float, safety)",
        "Pipe fittings (couplings, tees, flanges, pipe clamps)",
        "Victaulic couplings, camlock fittings",
        "PE/Plasson fittings, compression fittings",
        "Hoses (hydraulic, PVC, general)",
        "Structural steel (hollow sections, C-channel, flat bar, star pickets)",
        "Pump components (impellers, sleeves, lantern rings)",
        "Gland packing, hydraulic filters",
        "Rigging (chain slings, round slings, wire rope, lever hoists)",
        "Cable tray covers (EzyStrut), conduit, pipe spools",
        "Rubber cord, PTFE sheet, repair strips",
        "Blowers, heat exchangers, bollards"
      ],
      excludes: [
        "Crusher liners, cone liners, mantles, screen panels (→ LD)",
        "Complete motors, gearboxes, pump assemblies (→ LD)",
        "Heavy valve assemblies DN150+ with actuators (→ LD)",
        "BSP nipples, elbows, reducers, backing rings (→ C02-IN)",
        "Strainers, filter elements (→ C02-IN)",
        "Precision bearings/seals (→ C04-MP)",
        "Electrical components (→ C01)",
        "Fasteners/consumables (→ C05)",
        "Instruments, sensors, pneumatic controls (→ C02)"
      ],
      environment: "Standard industrial, dry storage, high-density bins",
      handling: "Manual only (≤15 kg items)"
    },
    {
      code: "C04-MP",
      name: "Mechanical Precision Container (20ft)",
      icon: Cog,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      includes: [
        "Bearings (all types), pillow blocks",
        "Seals, O-rings, gaskets",
        "Shims, key steel, retaining rings, circlips",
        "Mechanical seals",
        "Motor couplings, motor hubs"
      ],
      excludes: [
        "Valves, pipe fittings, flanges (→ C03-ME)",
        "Hoses, couplings, structural steel (→ C03-ME)",
        "Lighting, battens, floodlights (→ C01-EL)",
        "Sensors, pneumatic controls (→ C02-IN)",
        "Tools, PPE, fire safety (→ C05-FA)",
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
        "PPE consumables, gloves, safety glasses, tape, zip ties",
        "Grease cartridges, oil filters, breathers",
        "Sight glasses, auto-lube injectors, grease nipples",
        "Vehicle/engine/cabin air filters, fuel filters",
        "Fire extinguishers, fire blankets, first aid",
        "Hand tools (wrenches, spanners, drill bits, chucks)",
        "Power tools (Milwaukee, Makita, DeWalt drills, drivers)",
        "Hammers, chisels, demolition tools",
        "Abrasives, cutting discs, grinding discs, buff pads",
        "Batteries (Energizer, Duracell, 12V industrial)"
      ],
      excludes: [
        "Instrument air filters/regulators (→ C02-IN)",
        "Structural pipe fittings (→ C03-ME)",
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
        "Submersible pumps, sump pumps, pumpsets, multistage pumps",
        "Large pulleys, drums, shaft assemblies",
        "Heavy pneumatic valve assemblies DN150+",
        "Crusher liners, cone liners, mantles, screen panels",
        "Switchboards, large frames, complete assemblies",
        "Air receivers, large pressure vessels",
        "Bulk drums, oils, palletised items",
        "Any item >15 kg or requiring forklift handling"
      ],
      excludes: [
        "Small electrical components (→ C01-EL)",
        "Instruments, sensors (→ C02-IN)",
        "Bearings, seals, precision parts (→ C04-MP)",
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
