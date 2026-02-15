/**
 * Description-based Warehouse Allocation
 *
 * Allocates site_spares items to containers based on keywords in the description.
 * Priority order: LD (heavy) → C01 (EL) → C02 (IN) → C05 (FA) → C03 (MW) → C04 (ME)
 * Fallback: C04-ME
 *
 * Container layout:
 *   C01-EL – Electrical (20ft, clean, positive airflow)
 *   C02-IN – Instrumentation & Pneumatics (20ft, clean/fragile)
 *   C03-MW – Mechanical Wear / Heavy Mechanical (40ft, high volume)
 *   C04-ME – Mechanical Small Precision (20ft)
 *   C05-FA – Fasteners + Consumables + Lubrication (20ft)
 *   LD     – Laydown Yard (forklift / oversized / >15kg)
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
  // Sensor connectors
  "m12x1",
  // 4-20mA signal devices
  "4-20ma",
  // Hydraulic & pneumatic control valves
  "directional valve", "cetop", "dcv ",
  "hydraulic solenoid",
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
  // Tools & hand tools
  "wrench", "spanner", "pliers", "screwdriver", "drill bit",
  "socket set", "tool kit", "power wrench", "power punch",
  "hex key", "allen key", "chuck", "annular cutter", "burr set",
  "buff pad", "abrasive", "cutting disc", "grinding disc",
  // Safety equipment
  "safety glasses", "ear plug", "ear muff",
  // Fuel filters (vehicle consumable)
  "fuel water separator", "fuel filter", "coolant filter",
];

// Structural/pipe keywords that override C05 classification
const MECHANICAL_OVERRIDE_KEYWORDS = [
  "pipe", "valve", "flange", "structural", "frame", "liner",
  "coupling", "hose", "sling", "rope", "conduit", "spool",
];

const C03_MW_KEYWORDS = [
  // Wear parts
  "wear plate", "liner", "chute liner", "rubber liner", "ceramic liner",
  "wear part", "wear insert",
  // Conveyor components
  "roller", "idler", "scraper blade", "belt cleaner", "pulley",
  "sprocket", "chain", "belt", "conveyor", "scraper", "skirting",
  "screen panel", "crusher",
  // Conveyor frames, brackets & accessories
  "k-fra", "k-bra", "k-pul", "k-rol", "k-nife",
  "trough frame", "return frame", "tracking frame",
  "suspension arm", "cushion", "p-tip",
  // Valves (general mechanical — NOT solenoid/control/diaphragm/pinch which are C02)
  "valve", "knife gate", "butterfly", "ball valve", "check valve",
  "non-return", "float valve", "safety valve", "gate valve",
  // Pipe fittings & plumbing
  "pipe", "flange", "backing ring", "coupling", "coupler",
  "elbow", "tee", "nipple", "socket", "reducer", "reducing socket",
  "pipe clamp", "victaulic", "camlock",
  // PE/Plasson fittings
  "plasson", "pe100", "compression fitting", "compression elbow",
  "compression coupler", "compression tee", "electrofusion",
  "stub flange", "spigot", "saddle",
  "male adaptor", "female adaptor", "end plug",
  "reducing bush", "reducing nipple", "threaded socket",
  "hex nipple", "reducing hex",
  // Hoses
  "hose", "hydraulic hose",
  // Structural steel & sections
  "hollow section", "c-channel", "flat bar", "equal angle", "steel beam",
  "channel beam", "steel section", "star picket",
  // Pump components (not complete assemblies which are LD)
  "impeller", "pump sleeve", "volute", "pump casing", "pump shaft",
  "lantern ring", "lantern restrictor",
  "bearing kit", "pump parts",
  // Gland packing
  "gland packing", "packing ring",
  // Rigging & lifting
  "chain sling", "round sling", "wire rope", "shackle", "rope",
  "lever hoist", "turnbuckle",
  // Filter elements (mechanical, not electrical)
  "filter element", "hydraulic filter", "strainer",
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
];

// ─── PE/Plasson pipe vs fitting check ────────────────────────────

/**
 * PE/Plasson fittings (couplings, elbows, tees, reducers, stub flanges, etc.)
 * are compact items that belong in C03-MW regardless of diameter.
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

  // If it's a fitting keyword → NOT a pipe → stays in C03-MW
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
 * Priority: LD → C01 → C02 → C05 (with mech override) → C03 → C04 → default C04-ME
 */
export function allocateWarehouseArea(description: string | null | undefined): string {
  if (!description) return "C04-ME";
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

  // STEP 3 — C02 Instrumentation & Pneumatics
  // But large pneumatic valve assemblies (DN150+) are too heavy → LD
  if (matchesAny(desc, C02_KEYWORDS)) {
    if (isLargePneumaticValve(desc)) return "LD";
    return "C02-IN";
  }

  // STEP 4 — C05 Fasteners/Consumables/Lube
  // BUT if description also contains structural/pipe keywords → skip to mechanical
  if (matchesAny(desc, C05_KEYWORDS) && !matchesAny(desc, MECHANICAL_OVERRIDE_KEYWORDS)) {
    return "C05-FA";
  }

  // STEP 5 — Mechanical split
  // C03-MW: Wear / bulky / high-volume mechanical
  if (matchesAny(desc, C03_MW_KEYWORDS)) return "C03-MW";

  // C04-ME: Precision / small mechanical
  if (matchesAny(desc, C04_ME_KEYWORDS)) return "C04-ME";

  // Default fallback
  return "C04-ME";
}

// ─── Legacy exports for compatibility ────────────────────────────

const CONTAINER_INFO: Record<string, ContainerMapping> = {
  "C01-EL": { containerId: "C01", zoneCode: "EL", containerLabel: "Electrical" },
  "C02-IN": { containerId: "C02", zoneCode: "IN", containerLabel: "Instrumentation & Pneumatics" },
  "C03-MW": { containerId: "C03", zoneCode: "MW", containerLabel: "Mechanical Wear / Heavy" },
  "C04-ME": { containerId: "C04", zoneCode: "ME", containerLabel: "Mechanical Small Precision" },
  "C05-FA": { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners, Consumables & Lubrication" },
  "LD":     { containerId: "LD", zoneCode: "LD", containerLabel: "Laydown Yard" },
};

const DEFAULT_CONTAINER: ContainerMapping = CONTAINER_INFO["C04-ME"];

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
