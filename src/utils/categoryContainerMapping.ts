/**
 * Description-based Warehouse Allocation
 *
 * Allocates site_spares items to containers based on keywords in the description.
 * Priority order: LD → C01 → C02 → C05 → C04 → C03 → default C04-MP
 *
 * ── CONFIRMED CONTAINER RULES (audited & locked in) ──────────────────────────
 *
 *  LD  – Laydown Yard (forklift / >15kg)
 *        Complete pump assemblies (submersible, multistage, pumpsets), electric
 *        motors, gearbox assemblies, structural steel, full HDPE pipe lengths,
 *        crusher/cone liners, screen panels, large valves (DN150+), air receivers.
 *
 *  C01-EL – Electrical (20ft, positive airflow)
 *        PLC, VSD, breakers, contactors, relays, cables, conduit fittings &
 *        saddles, lighting, soft starters, motor protection devices, enclosures.
 *
 *  C02-IN – Instrumentation, Pneumatics & Process Fittings (20ft, clean/fragile)
 *        Sensors, transmitters, 4-20mA devices, test instruments, pneumatic
 *        regulators/cylinders, dosing & metering pumps, hydraulic filter elements,
 *        strainers, BSP nipples/elbows/reducers/backing rings, solenoid valves,
 *        control valves, diaphragm valves, pinch valves.
 *
 *  C05-CS – Consumables & Supplies (20ft)
 *        Fasteners (bolts, nuts, washers, studs — including M12 frame plate
 *        hardware), lubrication, PPE, hand & power tools, safety equipment,
 *        batteries, vehicle/engine air & fuel filters, adhesives, sealants.
 *
 *  C04-MP – Mechanical Precision (20ft)  ← checked BEFORE C03
 *        Bearings, seals, o-rings, gaskets, shims, circlips, retaining rings,
 *        mechanical seals, lantern rings & restrictors, throat bushes, slingers,
 *        piston rings, labyrinth components, pump parts kits, wear kits/inserts,
 *        rubber spider elements, coupling hubs & elements, motor hubs (small).
 *
 *  C03-ME – Mechanical (40ft, high volume)
 *        General mechanical <15kg: PE/Plasson fittings (all sizes), flanges,
 *        hoses, flexibore, conveyor components (rollers, idlers, belts, scrapers),
 *        general valves <DN150, rigging & lifting (slings, shackles), wear plates,
 *        heavy liners, ezystrut, cable tray, rubber & PTFE sheet, pump casings,
 *        gland packing.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */


export interface ContainerMapping {
  containerId: string;
  zoneCode: string;
  containerLabel: string;
}

// ─── Keyword sets per container ──────────────────────────────────

// LD keywords — heavy/oversized items only
// NOTE: "motor" is handled separately to avoid catching "motor circuit breaker" etc.
const LD_KEYWORDS = [
  "gearbox", "pump assembly", "large pulley",
  "shaft assembly", "large frame", "complete assembly", "heavy valve",
  "switchboard", "heavy actuator", "steel structure",
  "forklift", "palletised",
  "hdpe pipe", // full pipe lengths are LD
  // Heavy liners & crusher wear parts (>15kg, need forklift)
  "crusher liner", "cone liner", "mantle", "concave",
  "frame plate liner", "screen panel",
  "chute liner",
  // Structural steel (long/heavy — always LD)
  "hollow section", "c-channel", "flat bar", "equal angle", "steel beam",
  "channel beam", "steel section", "star picket",
  // Complete pump assemblies (heavy, need forklift)
  "submersible pump", "sump pump", "pumpset", "pump set",
  "triple pump", "process water pump", "kiln discharge pump",
  "kiln carbon feed pump", "diesel pump",
  "vertical multistage", "lowara pump",
  // Air receivers (large pressure vessels)
  "air receiver",
];

// Motor-related terms that indicate actual heavy motors (not electrical protection)
const LD_MOTOR_KEYWORDS = [
  "electric motor", "spare motor", "agitator motor", "hydraulic motor",
  "gear motor", "mixer gearbox",
];

// If "motor" appears in desc but NOT with these terms, it's still LD
// These exclusions keep motor protection devices in C01-EL
const MOTOR_NOT_LD_KEYWORDS = [
  "motor circuit breaker", "motor starter", "motor protection",
  "motor coupling", "motor hub", "motor adaptor", "motor adapter",
];

const C01_KEYWORDS = [
  "plc", "vsd", "vfd", "breaker", "mcb", "mccb", "rcbo", "relay", "contactor",
  "power supply", "isolator", "terminal", "cable gland", "cable lug", "ferrule",
  "selector switch", "push button", "indicator light", "pilot light", "panel fan",
  "filter electrical", "control module", "i/o card", "cpu",
  "cable", "connector", "switch", "transformer", "generator",
  "motor circuit breaker", "motor starter", "motor protection",
  "soft starter",
  // Lighting & emergency lighting
  "led batten", "floodlight", "exit light", "emergency batten",
  "led flood", "light fitting", "batten",
  // Electrical enclosures & accessories
  "pole filler", "din socket", "enclosure",
  // Panel wire
  "panel wire", "flexible panel wire",
];

const C02_KEYWORDS = [
  "transmitter", "gauge", "flow meter", "flowmeter", "level switch", "pressure switch",
  "rtd", "thermocouple", "temperature probe", "positioner",
  "solenoid valve", "instrument tubing", "swagelok",
  "needle valve",
  // Sensors & probes (instrumentation, not mechanical)
  "sensor", "probe", "electrode holder", "sensor electrode", "transducer", "analyser", "analyzer",
  "radar level", "thermowell", "signal converter",
  // Instruments & measurement devices
  "thermometer", "load cell", "level control", "process clamp",
  "indicator electrical", "electrical indicator",
  "modular regulator",
  // Process control valves (small, instrument-adjacent)
  "diaphragm valve", "pinch valve", "control valve",
  // Pneumatics
  "pneumatic", "air regulator", "filter regulator", "frl", "manifold",
  "push-in fitting", "quick connect", "air hose", "muffler",
  // SMC / pneumatic fittings, tubing & accessories
  "nylon tubing", "nylon tube", "one touch", "one-touch", "kq2", "positioner",
  "modular lubricator", "hand valve",
  "pneumatic cylinder", "pneumatic check valve",
  "silencer", "bulkhead union",
  // Speed/position feedback & weighing instruments
  "encoder", "tachometer", "weight processor",
  // Flow restriction devices (process instrumentation)
  "restrictor",
  // Pneumatic brands (all products are instrumentation/pneumatic)
  "norgren", "norgen",
  // Test & measurement instruments
  "multimeter", "clamp meter", "insulation tester", "megger",
  // Process dosing/metering (instrument-adjacent)
  "dosing pump", "metering pump",
  // Process tubing
  "pump tubing",
  // Sensor connectors (M12x1 thread pitch for sensors, not M12 bolts)
  "m12x1 ", "m12x1.", "m12 5 pole", "m12 4 pole", "m12 connector",
  // 4-20mA signal devices
  "4-20ma",
  // Hydraulic & pneumatic control valves
  "directional valve", "cetop", "dcv ",
  "hydraulic solenoid",
  // Process fittings (BSP, small pipe fittings — moved from C03)
  "nipple", "hex nipple", "reducing nipple", "reducing hex",
  "elbow", "reducer", "reducing bush", "reducing socket",
  "class 150", "bsp",
  "backing ring",
  // Strainers & filter elements (process-adjacent)
  "strainer", "filter element",
];

// C05 checked BEFORE mechanical split so fasteners don't leak into C03/C04
const C05_KEYWORDS = [
  "bolt", "nut", "washer", "stud", "anchor", "threaded rod", "u-bolt",
  "clamp", "hose clamp", "pin", "clip", "split pin", "cotter pin",
  "adhesive", "sealant", "loctite", "silicone", "threadlocker",
  "absorbent", "rag", "gloves", "ppe", "zip tie", "tape",
  "shrinkage bag", "pallet bag",
  // Lubrication
  "grease", "cartridge", "lube", "lubrication", "oil filter",
  "breather", "sight glass", "injector", "auto-lube",
  "grease nipple", "grease fitting", "sample bottle",
  "respirator", "hard hat", "battery", "consumable",
  "screw", "fastener",
  // Vehicle/engine air filters are consumables, not instrumentation
  "air filter",
  // Fire safety
  "fire extinguisher", "fire blanket", "first aid",
  // Tools & hand tools (including power tools)
  "wrench", "spanner", "pliers", "screwdriver", "drill bit",
  "socket set", "tool kit", "power wrench", "power punch",
  "hex key", "allen key", "chuck", "annular cutter", "burr set",
  "buff pad", "abrasive", "cutting disc", "grinding disc",
  "hammer", "chisel", "magnetic drill", "drill/driver", "impact driver",
  "demolition", "makita", "milwaukee", "dewalt",
  // Safety equipment
  "safety glasses", "ear plug", "ear muff",
  // Batteries (consumables)
  "battery", "batteries", "energizer", "duracell",
  // Fuel filters (vehicle consumable)
  "fuel water separator", "fuel filter", "coolant filter",
];

// Structural/pipe keywords that override C05 classification
// Removed "frame", "sling", "rope" — too generic, blocks PPE/tools/rigging
const MECHANICAL_OVERRIDE_KEYWORDS = [
  "pipe", "valve", "flange", "structural", "liner",
  "coupling", "hose", "conduit", "spool",
];

// C05 keywords that should NEVER be overridden by mechanical keywords
// (e.g. "safety glasses" with "frame" in description should stay C05)
const C05_PRIORITY_KEYWORDS = [
  "safety glasses", "ear plug", "ear muff", "ppe", "hard hat",
  "fire extinguisher", "fire blanket", "first aid",
  "wrench", "spanner", "pliers", "screwdriver", "drill bit",
  "socket set", "tool kit", "power wrench", "power punch",
  "hex key", "allen key", "chuck", "annular cutter", "burr set",
  "buff pad", "abrasive", "cutting disc", "grinding disc",
  "hammer", "chisel", "magnetic drill", "drill/driver", "impact driver",
  "demolition", "makita", "milwaukee", "dewalt",
  "grease cartridge", "grease nipple", "oil filter",
  "zip tie", "gloves", "adhesive", "sealant",
  "battery", "batteries", "energizer", "respirator",
  "fuel water separator", "fuel filter", "coolant filter",
  "air filter",
];

const C03_MW_KEYWORDS = [
  // Wear parts — heavy plates & liners only (wear kits/inserts/parts now → C04-MP)
  "wear plate", "liner", "rubber liner", "ceramic liner",
  // Conveyor components (chute liner & screen panel removed — handled by LD)
  "roller", "idler", "scraper blade", "belt cleaner", "pulley",
  "sprocket", "chain", "belt", "conveyor", "scraper", "skirting",
  "crusher",
  // Conveyor frames, brackets & accessories
  "k-fra", "k-bra", "k-pul", "k-rol", "k-nife",
  "trough frame", "return frame", "tracking frame",
  "suspension arm", "cushion", "p-tip",
  // Valves (general mechanical — NOT solenoid/control/diaphragm/pinch which are C02)
  "valve", "knife gate", "butterfly", "ball valve", "check valve",
  "non-return", "float valve", "safety valve", "gate valve",
  // Pipe fittings & plumbing (BSP nipples/elbows/reducers/backing rings now in C02)
  "pipe", "flange", "coupling", "coupler",
  "tee", "socket",
  "pipe clamp", "victaulic", "camlock",
  // PE/Plasson fittings (remain in C03 — bulk plastic fittings)
  "plasson", "pe100", "compression fitting", "compression elbow",
  "compression coupler", "compression tee", "electrofusion",
  "stub flange", "spigot", "saddle",
  "male adaptor", "female adaptor", "end plug",
  "threaded socket",
  // Hoses
  "hose", "hydraulic hose",
   // Structural steel — moved to LD (heavy/long items)
  // Pump components — large/structural only (precision pump parts → C04-MP)
  "impeller", "pump sleeve", "volute", "pump casing", "pump shaft",
  "bearing kit",
  // Gland packing
  "gland packing", "packing ring",
  // Rigging & lifting
  "sling", "chain sling", "round sling", "wire rope", "shackle", "rope",
  "lever hoist", "turnbuckle",
  // Hydraulic filters (strainers & filter elements now in C02)
  "hydraulic filter",
  // Cable tray & conduit covers
  "ezystrut", "cable tray",
  // Rubber & PTFE sheet
  "rubber cord", "ptfe sheet", "rubber sheet", "repair strip",
  // Misc general mechanical
  "bollard", "blower", "heat exchanger",
  "conduit", "pipe spool", "air receiver",
];

const C04_ME_KEYWORDS = [
  // Precision small parts ONLY
  "bearing", "seal", "o-ring", "gasket", "shim", "key steel",
  "retaining ring", "circlip", "mechanical seal",
  "pillow block", "spherical roller", "ball bearing",
  "motor coupling", "motor hub", "coupling pump",
  // Pump internals & precision wear parts (small, hand-carry)
  "lantern ring", "lantern restrictor",
  "throat bush",
  "slinger",
  "piston ring",
  "labyrinth pump", "labyrinth component",
  "pump wear", "pump parts",
  "wear kit", "wear insert",
  // Small coupling elements
  "rubber spider", "coupling element",
  // Precision spigots & asymmetrical fittings (pump internals)
  "asymmetrical spigot",
];

// ─── PE/Plasson pipe vs fitting check ────────────────────────────

/**
 * PE/Plasson fittings (couplings, elbows, tees, reducers, stub flanges, etc.)
 * are compact items that belong in C03-ME regardless of diameter.
 * Only full pipe lengths (e.g. "DN 90x6M HDPE Pipe") go to LD.
 *
 * This function returns true ONLY for actual pipe lengths, not fittings.
 */
function isLargePEPipe(desc: string): boolean {
  // Must be PE-related
  if (
    !desc.includes("pe100") &&
    !desc.includes("hdpe") &&
    !desc.includes("plasson")
  ) {
    return false;
  }

  // If it's a fitting keyword → NOT a pipe → stays in C03-ME
  const FITTING_KEYWORDS = [
    "coupling", "coupler", "elbow", "tee", "reducer", "reducing",
    "stub flange", "spigot", "saddle", "end plug", "adaptor", "adapter",
    "nipple", "socket", "bush", "bow", "bend", "electrofusion",
    "compression", "stub end",
  ];
  if (FITTING_KEYWORDS.some((kw) => desc.includes(kw))) {
    return false;
  }

  // Only actual pipe lengths go to LD (e.g. "DN 90x6M", "x 420MM ... Pipe")
  if (desc.includes("pipe")) {
    return true;
  }

  return false;
}

/**
 * Check if "motor" appears but it's NOT a heavy motor — it's an electrical device
 */
function isMotorButNotHeavy(desc: string): boolean {
  if (!desc.includes("motor")) return false;
  // If it matches any explicit LD motor term, it IS heavy
  if (LD_MOTOR_KEYWORDS.some((kw) => desc.includes(kw))) return false;
  // If it matches exclusion terms, it's NOT heavy (electrical protection device or small part)
  if (MOTOR_NOT_LD_KEYWORDS.some((kw) => desc.includes(kw))) return true;
  // If it matches any C01 keyword (breaker, starter, switch, etc.), it's electrical
  if (matchesAny(desc, C01_KEYWORDS)) return true;
  return false;
}

/**
 * Check if a pneumatic valve assembly is large (DN150+) and too heavy for containers
 */
function isLargePneumaticValve(desc: string): boolean {
  const hasValve = desc.includes("valve") || desc.includes("actuator");
  if (!hasValve) return false;
  // DN150+ or DN200+ are heavy assemblies
  const largeDN = /dn\s*(?:1[5-9]\d|[2-9]\d{2}|\d{4,})/.test(desc);
  return largeDN;
}

// ─── Allocation function ─────────────────────────────────────────
function matchesAny(desc: string, keywords: string[]): boolean {
  return keywords.some((kw) => desc.includes(kw));
}

/**
 * Allocate a warehouse area code based on the item description.
 * Priority: LD → C01 → C02 → C05 (with mech override) → C04 → C03 → default C04-MP
 */
export function allocateWarehouseArea(description: string | null | undefined): string {
  if (!description) return "C04-MP";
  const desc = description.toLowerCase();

  // STEP 1 — LD overrides everything
  // But NOT for motor protection devices or small motor parts
  const hasLDKeyword = matchesAny(desc, LD_KEYWORDS);
  const hasLDMotor = LD_MOTOR_KEYWORDS.some((kw) => desc.includes(kw));
  const hasMotorNotHeavy = isMotorButNotHeavy(desc);
  const isLargePE = isLargePEPipe(desc);

  // Motor in desc but it's NOT heavy → skip LD, let C01 catch it
  if (desc.includes("motor") && !hasMotorNotHeavy && !hasLDKeyword) {
    // standalone "motor" (e.g. "Ball Mill Spare Motor") → LD
    if (!matchesAny(desc, C01_KEYWORDS)) return "LD";
  }
  if (hasLDMotor) return "LD";
  if (hasLDKeyword && !hasMotorNotHeavy) return "LD";
  if (isLargePE) return "LD";

  // STEP 2 — C01 Electrical
  if (matchesAny(desc, C01_KEYWORDS)) return "C01-EL";

  // STEP 3 — C02 Instrumentation, Pneumatics & Process Fittings
  // But large pneumatic valve assemblies (DN150+) are too heavy → LD
  if (matchesAny(desc, C02_KEYWORDS)) {
    if (isLargePneumaticValve(desc)) return "LD";
    return "C02-IN";
  }

  // STEP 4 — C05 Fasteners/Consumables/Lube
  // Priority C05 items ALWAYS go to C05 regardless of other keywords
  if (matchesAny(desc, C05_PRIORITY_KEYWORDS)) {
    return "C05-CS";
  }
  // Other C05 items only if no structural/pipe keywords present
  if (matchesAny(desc, C05_KEYWORDS) && !matchesAny(desc, MECHANICAL_OVERRIDE_KEYWORDS)) {
    return "C05-CS";
  }

  // STEP 5 — Precision first, then general mechanical
  // C04-MP checked BEFORE C03-ME so precision parts (gaskets, pump kits, coupling
  // elements, lantern rings, etc.) are not absorbed into the larger container.
  if (matchesAny(desc, C04_ME_KEYWORDS)) return "C04-MP";

  // C03-ME: General Mechanical (40ft, high volume)
  if (matchesAny(desc, C03_MW_KEYWORDS)) return "C03-ME";

  // Default fallback
  return "C04-MP";
}

// ─── Legacy exports for compatibility ────────────────────────────

const CONTAINER_INFO: Record<string, ContainerMapping> = {
  "C01-EL": { containerId: "C01", zoneCode: "EL", containerLabel: "Electrical" },
  "C02-IN": { containerId: "C02", zoneCode: "IN", containerLabel: "Instrumentation, Pneumatics & Process Fittings" },
  "C03-ME": { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical" },
  "C04-MP": { containerId: "C04", zoneCode: "MP", containerLabel: "Mechanical Precision" },
  "C05-CS": { containerId: "C05", zoneCode: "CS", containerLabel: "Consumables & Supplies" },
  "LD":     { containerId: "LD", zoneCode: "LD", containerLabel: "Laydown Yard" },
};

const DEFAULT_CONTAINER: ContainerMapping = CONTAINER_INFO["C04-MP"];

export function getContainerForCategory(category: string | null | undefined): ContainerMapping {
  if (!category) return DEFAULT_CONTAINER;
  return CONTAINER_INFO[category] || DEFAULT_CONTAINER;
}

export function suggestBinPrefix(category: string | null | undefined): string {
  const mapping = getContainerForCategory(category);
  return mapping.containerId;
}

export function getContainerMappingSummary(): Array<ContainerMapping & { categories: string[] }> {
  return Object.entries(CONTAINER_INFO).map(([code, mapping]) => ({
    ...mapping,
    categories: [code],
  }));
}

export function getCategoriesForContainer(containerId: string): string[] {
  return Object.entries(CONTAINER_INFO)
    .filter(([, m]) => m.containerId === containerId)
    .map(([code]) => code);
}
