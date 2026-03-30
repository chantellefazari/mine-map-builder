import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, Zap, Gauge, Wrench, Settings, Hammer, XCircle, Info, MapPin, Wind } from "lucide-react";

const ZONE_COLOR = {
  "C01-EL":  { bg: "bg-sky-500/10",    border: "border-sky-500/30",    text: "text-sky-700",    badge: "bg-sky-100 text-sky-700 border-sky-200" },
  "C02-IN":  { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-700", badge: "bg-violet-100 text-violet-700 border-violet-200" },
  "C03-ME":  { bg: "bg-zinc-500/10",   border: "border-zinc-500/30",   text: "text-zinc-700",   badge: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  "C04-MP":  { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  "C05-CS":  { bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700 border-amber-200" },
  "LD":      { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-700", badge: "bg-orange-100 text-orange-700 border-orange-200" },
  "Special": { bg: "bg-rose-500/10",   border: "border-rose-500/30",   text: "text-rose-700",   badge: "bg-rose-100 text-rose-700 border-rose-200" },
};

const zones = [
  {
    zoneId: "C01-EL",
    label: "C01-EL — Electrical",
    subtitle: "20ft container · Positive airflow · Climate controlled",
    icon: Zap,
    colorKey: "C01-EL" as const,
    categories: [
      { cc: "07", name: "Electrical", items: ["VSDs / VFDs / soft starters", "Contactors, relays, overloads", "MCBs / MCCBs / RCBOs / RCDs", "PLC CPUs & I/O cards", "Power supplies", "Terminal blocks, cable lugs, ferrules", "Cable glands, heat shrink, cable ties", "Cables (control, power, signal)", "Enclosures, junction boxes, entry boxes", "Conduit & conduit fittings", "LED lighting, emergency battens", "DIN sockets, UPS units"] },
      { cc: "18", name: "Power Generation (small parts)", items: ["Distribution board components", "Panel wire & flexible cable", "Indicator lights, push buttons, selector switches", "Motor circuit breakers, motor starters, motor protection devices"] },
    ],
    notes: "All electrical items requiring ESD-safe storage or dust control. Full generators, switchboards & substations → LD.",
    maxWeight: "≤15 kg",
  },
  {
    zoneId: "C02-IN",
    label: "C02-IN — Instrumentation, Pneumatics & Process Fittings",
    subtitle: "20ft container · Clean / fragile items · Drawer units & totes",
    icon: Gauge,
    colorKey: "C02-IN" as const,
    categories: [
      { cc: "06", name: "Instrumentation", items: ["Pressure transmitters & gauges", "Flow meters & flow switches", "Level sensors & switches", "Temperature probes, RTDs, thermocouples", "pH probes, conductivity & turbidity sensors", "Encoders, positioners, analysers", "4–20 mA signal converters, isolating amplifiers", "Multimeters, clamp meters, insulation testers"] },
      { cc: "15", name: "Air & Pneumatic (small)", items: ["Pneumatic cylinders & actuators", "Air regulators, FRL units, lubricators", "Pneumatic fittings (push-in, one-touch, bulkhead)", "Nylon tubing, manifolds, silencers", "Solenoid coils & directional control valves (CETOP)", "Norgren / Norgen components"] },
      { cc: "05", name: "Valves (instrument-adjacent)", items: ["Solenoid valves", "Diaphragm valves", "Pinch valves", "Needle valves", "Control valves (small, DN<150)"] },
      { cc: "11", name: "Pipe Fitting (BSP / Class 150)", items: ["BSP nipples, elbows, reducers, tees, bushes", "Class 150 fittings", "Backing rings, stub flanges (small)", "Instrument tubing & fittings (Swagelok)", "Dosing pump tubing, pump tubing"] },
      { cc: "13", name: "Filter (process-adjacent)", items: ["Hydraulic filter elements", "Strainers", "Process filter elements (not vehicle filters)"] },
    ],
    notes: "Items adjacent to instrumentation and process control. Large pneumatic assemblies DN150+ → LD.",
    maxWeight: "≤15 kg",
  },
  {
    zoneId: "C03-ME",
    label: "C03-ME — Mechanical (40ft)",
    subtitle: "40ft container · High-volume general mechanical storage · Heavy-duty bays",
    icon: Wrench,
    colorKey: "C03-ME" as const,
    categories: [
      { cc: "10", name: "Mechanical", items: ["Flexible couplings & coupling inserts", "Shaft couplings & shaft collars", "Flexseal couplings, Durasleeve carriers", "Brackets, clamps, mounts", "Frames, guards, supports, handrails", "Machine guards & safety guards", "Structural mounts, anti-vibration mounts"] },
      { cc: "08", name: "Conveyor Component", items: ["Idler rollers, return rollers, trough rollers", "Belt scrapers & belt cleaners", "Skirting rubber", "V-belts, timing belts, wedge belts", "Sprockets, chains", "Fenner pulleys, belt tensioners", "Belt misalignment & pull-cord switches"] },
      { cc: "11", name: "Pipe Fitting (PE/Plasson & hoses)", items: ["PE100 / Plasson compression fittings (couplings, elbows, tees)", "Electrofusion fittings", "Rubber hoses (air, water, drag)", "Hydraulic hoses", "Claw couplings, camlocks, hosetails", "Pipe spools (short), repair clamps", "Saddle clamps, Saddle fittings"] },
      { cc: "05", name: "Valve (general mechanical)", items: ["Ball valves, knife gate valves", "Butterfly valves, check valves", "Gate valves, float valves, safety valves", "General process valves DN<150"] },
      { cc: "24", name: "Rigging", items: ["Round slings, flat slings, web slings", "Chain blocks, lever hoists", "Shackles (dee, bow, screw pin)", "Wire rope & wire rope clips", "Turnbuckles, hook & eye sets", "Jack chain, ear-lokt buckles"] },
      { cc: "09", name: "Wear Parts (light)", items: ["Wear plates <15 kg", "Rubber liners <15 kg", "Wear strips & repair strips", "Light wear parts & kits"] },
      { cc: "01", name: "Pump Component (structural)", items: ["Pump casings", "Pump shafts & sleeves", "Impellers (medium)", "Volutes", "Gland packing, packing rings"] },
    ],
    notes: "All items must be ≤15 kg for manual handling. Heavy crusher liners, full pipe lengths, complete pump assemblies → LD.",
    maxWeight: "≤15 kg",
  },
  {
    zoneId: "C04-MP",
    label: "C04-MP — Mechanical Precision",
    subtitle: "20ft container · Small precision parts · Seal drawer cabinets & flat-file shelves",
    icon: Settings,
    colorKey: "C04-MP" as const,
    categories: [
      { cc: "04", name: "Bearing", items: ["Ball bearings, roller bearings", "Tapered roller bearings", "Spherical roller bearings", "Pillow blocks, plummer blocks", "Bearing housings & adapters", "Bearing isolators, slingers, flingers"] },
      { cc: "12", name: "Seal", items: ["Mechanical seals & seal kits", "O-rings (all sizes)", "Gaskets & gasket sets", "Gland packing", "Oil seals, lip seals", "PTFE sheet & expanded PTFE", "Diaphragm seals"] },
      { cc: "01", name: "Pump Component (precision)", items: ["Lantern rings & lantern restrictors", "Throat bushes", "Wear kits & wear inserts", "Pump parts kits", "Piston rings, labyrinth components", "Asymmetrical spigots", "Rubber spider elements"] },
      { cc: "14", name: "Lubrication System", items: ["Lube injectors & auto-lube cartridges", "Grease nipples & grease fittings", "Divider valves, manifolds (small)", "Sight glasses, level indicators"] },
      { cc: "10", name: "Mechanical (small precision)", items: ["Coupling elements, rubber spiders", "Motor hubs & coupling hubs", "Keys & key steel", "Shims, circlips, retaining rings"] },
    ],
    notes: "Precision parts requiring organized small-parts storage. Checked before C03-ME to avoid misclassification.",
    maxWeight: "≤5 kg typical",
  },
  {
    zoneId: "C05-CS",
    label: "C05-CS — Consumables & Supplies",
    subtitle: "20ft container · High-frequency items · Bin walls & PPE rack",
    icon: Package,
    colorKey: "C05-CS" as const,
    categories: [
      { cc: "21", name: "Fastener", items: ["Bolts (hex, cap, set, zinc plated)", "Nuts (hex, nyloc, lock, spring)", "Washers (flat, spring)", "Studs, anchors, rivets", "Threaded rod, U-bolts"] },
      { cc: "22", name: "Consumables", items: ["Flap discs, cutting wheels, grinding discs", "Abrasives, fibre discs", "Adhesives, sealants, Loctite, silicone", "Paint, markers, tape (insulation, PVC)", "Anti-corrosion products, VCI bags"] },
      { cc: "19", name: "Tooling", items: ["Hand tools (wrenches, spanners, pliers)", "Power tools (Milwaukee, Makita, DeWalt)", "Drill bits, annular cutters, burr sets", "Torque tools, socket sets", "Site boxes, fluid extractors, gravity tables"] },
      { cc: "25", name: "PPE", items: ["Hard hats, safety helmets", "Safety glasses, face shields, visors", "Respirators & respiratory filters", "Earmuffs, earplugs", "Nitrile & rigger gloves", "Hi-vis vests, safety harnesses, lanyards"] },
      { cc: "17", name: "Safety Equipment", items: ["Fire extinguishers, fire blankets", "First aid kits, spill kits", "Safety signage", "Emergency equipment (non-electrical)"] },
      { cc: "13", name: "Filter (vehicle)", items: ["CAT, Donaldson, Fleetguard air filters", "Engine oil filters, fuel filters", "Fuel water separators", "Cabin air filters, breathers"] },
      { cc: "14", name: "Lubrication (bulk)", items: ["Grease cartridges", "Oil sample bottles", "Bulk lubricants (small containers)", "Desiccant breathers"] },
    ],
    notes: "High-frequency consumable items. Flammable items (aerosols, sprays, solvents) → Flammable Cabinet regardless of category.",
    maxWeight: "≤15 kg",
  },
  {
    zoneId: "LD",
    label: "LD — Laydown Yard",
    subtitle: "Open yard · Forklift access · Structured bays LD-A through LD-F",
    icon: MapPin,
    colorKey: "LD" as const,
    categories: [
      { cc: "02", name: "Motor Component (complete motors)", items: ["Electric motors (all sizes)", "Spare motors, agitator motors", "Gear motors, hydraulic motors", "Mixer gearboxes"] },
      { cc: "03", name: "Gearbox", items: ["All gearbox assemblies (SEW-Eurodrive, Falk, Flender)", "Speed reducers, planetary gearboxes", "Any complete gearbox unit"] },
      { cc: "01", name: "Pump Component (complete assemblies)", items: ["Submersible pumps, sump pumps, pumpsets", "Process water pumps, vertical multistage pumps", "Grundfos, Lowara complete assemblies", "Diesel pumps"] },
      { cc: "09", name: "Wear Parts (heavy)", items: ["Crusher liner concave & mantle", "Cone liners, jaw plates, cheek plates", "Chute liners (heavy)", "Screen panels", "Frame plate liners"] },
      { cc: "23", name: "Structural Steel", items: ["SHS — square hollow sections", "RHS — rectangular hollow sections", "C-channel, channel beam", "Equal angle, flat bar (long)", "Steel plate, star pickets", "Bollards, stay brackets"] },
      { cc: "11", name: "Pipe Fitting (full pipe lengths)", items: ["Full HDPE pipe lengths (6m)", "Vinidex HDPE pipe", "Long pipe spools (DN150+)", "Pipe lengths >2m"] },
      { cc: "05", name: "Valve (large)", items: ["Valves DN150 and above", "Large pneumatic valve assemblies", "Heavy actuated valves"] },
      { cc: "15", name: "Air & Pneumatic (large)", items: ["Air receivers (1000L+)", "Large compressors", "Side channel blowers"] },
      { cc: "16", name: "Tanks & Vessels", items: ["All process tanks, CIP tanks, reagent tanks", "Sumps, hoppers, vessels", "Heat exchangers (Dynacool)"] },
      { cc: "18", name: "Power Generation (heavy)", items: ["Generators (complete units)", "Substations, switchboards", "Heavy transformers, distribution boards"] },
      { cc: "20", name: "OEM Assembly", items: ["Complete pump skids", "Lube skids, filter press packages", "Any OEM skid-mounted assembly"] },
    ],
    notes: "LD bays: LD-C = Crusher Liners, LD-D = Screen Panels, LD-E = Large Motors, LD-F = Overflow/Staging. Forklift required for all LD items.",
    maxWeight: ">15 kg or >2m length",
  },
  {
    zoneId: "Special",
    label: "Special Cabinets",
    subtitle: "Wurth Cabinet & Flammable Cabinet — dedicated segregated storage",
    icon: Wind,
    colorKey: "Special" as const,
    categories: [
      { cc: "—", name: "Wurth Cabinet (all Wurth-supplied items)", items: ["All items supplied by Wurth or Würth regardless of category", "Typically: fasteners, consumables, workshop supplies from Wurth"] },
      { cc: "22", name: "Flammable Cabinet (all aerosols & solvents)", items: ["Aerosol spray cans (any product)", "Brake cleaner, contact cleaner, chain lube spray", "WD-40, INOX, Lanox, Dy-Mark sprays", "Gear wheel spray, wire cable spray", "Degreaser sprays, butane gas", "Paint sprays, spray paint"] },
    ],
    notes: "These cabinets override all other zone logic. Wurth items → Wurth Cabinet. Flammable aerosols → Flammable Cabinet. No exceptions.",
    maxWeight: "N/A",
  },
];

export const ContainerStockingSection = () => {
  const exclusions = [
    "Complete electric motors (any size) → LD-E",
    "Complete gearboxes & SEW-Eurodrive units → LD",
    "Complete pump assemblies / pumpsets → LD",
    "Crusher liner concave & mantle → LD-C",
    "Screen panels → LD-D",
    "Structural steel (SHS, RHS, channel, angle, flat bar) → LD",
    "Full HDPE pipe lengths (6m) → LD",
    "Large valves DN150+ → LD",
    "Air receivers (large pressure vessels) → LD",
    "Process tanks, vessels, heat exchangers → LD",
    "Generators & switchboards (complete units) → LD",
    "OEM skid packages → LD",
    "All aerosols & flammable sprays → Flammable Cabinet",
    "All Wurth / Würth supplier items → Wurth Cabinet",
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Documentation Only</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This section defines what parts are eligible for each storage zone. It does NOT modify assets, PMs, functional locations, or spares quantities.
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
                Category-to-zone allocation logic for Tennant Creek Mine — aligned with live inventory categories
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Purpose</h4>
            <p className="text-sm text-muted-foreground mb-3">
              This document defines which spare parts go into which storage zone based on:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {["Manual handling suitability (≤15 kg)", "Part category classification (CC code)", "Fragility and environmental sensitivity", "Access method (shelving vs forklift)"].map(p => (
                <div key={p} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Zone Summary</h4>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              {[
                { id: "C01-EL", desc: "Electrical (20ft)" },
                { id: "C02-IN", desc: "Instrumentation, Pneumatics & Fittings (20ft)" },
                { id: "C03-ME", desc: "Mechanical — high volume (40ft)" },
                { id: "C04-MP", desc: "Mechanical Precision — small parts (20ft)" },
                { id: "C05-CS", desc: "Consumables & Supplies (20ft)" },
                { id: "LD", desc: "Laydown Yard — heavy/oversized (forklift)" },
              ].map(z => (
                <div key={z.id} className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-muted px-2 py-0.5 rounded">{z.id}</span>
                  <span className="text-muted-foreground text-xs">{z.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone Cards */}
      {zones.map((zone) => {
        const colors = ZONE_COLOR[zone.colorKey];
        const Icon = zone.icon;
        return (
          <Card key={zone.zoneId} className={`border ${colors.border}`}>
            <CardHeader className="pb-4">
              <div className={`flex items-start gap-3 p-4 rounded-lg ${colors.bg}`}>
                <div className="w-10 h-10 rounded-lg bg-background/60 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className={`text-lg ${colors.text}`}>{zone.label}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{zone.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${colors.badge}`}>
                      Weight limit: {zone.maxWeight}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {zone.categories.map((cat, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${colors.badge}`}>CC {cat.cc}</span>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {cat.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-1">
                          <span className="text-muted-foreground/50 flex-shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {zone.notes && (
                <div className={`rounded-lg p-3 border ${colors.border} ${colors.bg} flex items-start gap-2`}>
                  <Info className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                  <p className={`text-xs ${colors.text}`}>{zone.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Explicit Exclusions */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg">Container Exclusions — Laydown Yard & Special Cabinets</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                These items cannot be stored in the five containers (C01–C05)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              {exclusions.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-destructive/80">
                  <span className="text-destructive font-bold flex-shrink-0">✕</span>
                  {item}
                </div>
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
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Defines container eligibility and zone allocation only</li>
              <li>• Does NOT assign stock quantities or min/max levels</li>
              <li>• Does NOT replace supplier catalogues</li>
              <li>• Zone logic is enforced automatically in the Site Spares Catalogue via the warehouse allocation engine</li>
              <li>• Will be refined as P&IDs and component lists are updated</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-destructive">Important Instruction</p>
          <ul className="text-sm text-destructive/80 mt-1 space-y-1">
            <li>⚠️ Do NOT auto-create parts, quantities, or suppliers from this document.</li>
            <li>⚠️ This is a design and governance reference only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
