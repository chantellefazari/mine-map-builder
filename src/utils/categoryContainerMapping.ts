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

const LD_KEYWORDS = [
  "motor", "gearbox", "pump assembly", "large pulley", "drum",
  "shaft assembly", "large frame", "complete assembly", "heavy valve",
  "switchboard", "heavy actuator", "steel structure",
  "forklift", "pallet", "pe pipe", "plasson",
];

const C01_KEYWORDS = [
  "plc", "vsd", "vfd", "breaker", "mcb", "mccb", "rcbo", "relay", "contactor",
  "power supply", "isolator", "terminal", "cable gland", "cable lug", "ferrule",
  "selector switch", "push button", "indicator light", "panel fan",
  "filter electrical", "control module", "i/o card", "cpu",
  "cable", "connector", "switch", "transformer", "generator",
];

const C02_KEYWORDS = [
  "transmitter", "gauge", "flow meter", "level switch", "pressure switch",
  "rtd", "thermocouple", "temperature probe", "positioner",
  "solenoid valve", "instrument tubing", "tube", "swagelok",
  "needle valve", "compression fitting",
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
];

const C04_ME_KEYWORDS = [
  "bearing", "seal", "o-ring", "gasket", "shim", "key steel", "key",
  "retaining ring", "circlip", "bush", "mechanical seal",
  "small coupling", "small shaft", "small valve", "small fitting",
  "precision", "pillow block", "spherical roller", "ball bearing",
  "wear insert small",
];

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
  if (matchesAny(desc, LD_KEYWORDS)) return "LD";

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
