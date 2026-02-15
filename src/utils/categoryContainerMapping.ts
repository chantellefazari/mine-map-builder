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
  "selector switch", "push button", "indicator light", "panel fan",
  "filter electrical", "control module", "i/o card", "cpu",
  "cable", "connector", "switch", "transformer", "generator",
  "motor circuit breaker", "motor starter", "motor protection",
];

const C02_KEYWORDS = [
  "transmitter", "gauge", "flow meter", "level switch", "pressure switch",
  "rtd", "thermocouple", "temperature probe", "positioner",
  "solenoid valve", "instrument tubing", "swagelok",
  "needle valve",
  // Pneumatics
  "pneumatic", "air regulator", "air filter", "frl", "manifold",
  "push-in fitting", "quick connect", "air hose", "muffler",
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
];

// Structural/pipe keywords that override C05 classification
const MECHANICAL_OVERRIDE_KEYWORDS = [
  "pipe", "valve", "flange", "structural", "frame", "liner",
];

const C03_MW_KEYWORDS = [
  "wear plate", "liner", "chute liner", "rubber liner", "ceramic liner",
  "roller", "idler", "scraper blade", "belt cleaner", "pulley",
  "sprocket", "chain", "large valve", "heavy pipe fitting",
  "v belt", "belt drive", "belt fastener", "belt",
  "scraper", "conveyor", "screen panel", "crusher liner",
  "wear part", "coupling heavy",
  // PE/Plasson fittings (small <150mm) go here as pipe fittings
  "plasson", "pe100", "compression fitting", "compression elbow",
  "compression coupler", "compression tee", "electrofusion",
  "stub flange", "spigot", "saddle", "reducing coupler",
  "male adaptor", "female adaptor", "end plug",
  "reducing bush", "reducing nipple", "threaded socket",
  "hex nipple", "reducing hex",
];

const C04_ME_KEYWORDS = [
  "bearing", "seal", "o-ring", "gasket", "shim", "key steel", "key",
  "retaining ring", "circlip", "bush", "mechanical seal",
  "small coupling", "small shaft", "small valve", "small fitting",
  "precision", "pillow block", "spherical roller", "ball bearing",
  "wear insert small",
  "motor coupling", "motor hub", "coupling pump",
];

// ─── Size-based PE/Plasson check ─────────────────────────────────

/**
 * Check if a PE/Plasson fitting is ≥150mm (should go to LD).
 * Parses the first MM dimension from the description.
 */
function isLargePEFitting(desc: string): boolean {
  if (
    !desc.includes("plasson") &&
    !desc.includes("pe100") &&
    !desc.includes("compression fitting") &&
    !desc.includes("electrofusion") &&
    !desc.includes("stub flange") &&
    !desc.includes("spigot")
  ) {
    return false;
  }

  // Match patterns like "160MM", "180mm", "200 MM", "225MM"
  const sizeMatch = desc.match(/(\d{2,4})\s*mm/i);
  if (sizeMatch) {
    const size = parseInt(sizeMatch[1], 10);
    return size >= 150;
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
  return false;
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
  const isLargePE = isLargePEFitting(desc);

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
  if (matchesAny(desc, C02_KEYWORDS)) return "C02-IN";

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
