/**
 * Description-based Warehouse Allocation
 *
 * Allocates site_spares items to containers based on keywords in the description.
 * Priority order: LD (heavy) → C01 (EL) → C02 (IN) → C03 (ME) → C04 (MW) → C05 (FA)
 * Fallback: C03-ME
 *
 * Container layout:
 *   C01-EL – Electrical (Positive Airflow Container)
 *   C02-IN – Instrumentation & Control (Fragile)
 *   C03-ME – Mechanical Precision (40ft, high-density small parts)
 *   C04-MW – Mechanical Wear & Belts (20ft)
 *   C05-FA – Fasteners, Consumables & Lubrication Combined
 *   LD     – Laydown Yard (Heavy & Oversized)
 */

export interface ContainerMapping {
  containerId: string;
  zoneCode: string;
  containerLabel: string;
}

// ─── Keyword sets per container ──────────────────────────────────
const LD_KEYWORDS = [
  "motor", "gearbox", "pump", "large valve", "complete assembly", "frame",
  "large roller", "bulk drum", "switchboard", "heavy actuator", "steel structure",
  "forklift", "pallet",
];

const C01_KEYWORDS = [
  "fuse", "breaker", "mcb", "mccb", "rcbo", "relay", "contactor", "plc", "vsd",
  "power supply", "selector", "push button", "indicator", "terminal block",
  "cable gland", "lug", "ferrule", "isolator", "control module", "i/o card",
  "cpu", "sensor electrical", "panel fan", "filter electrical",
  "cable", "connector", "switch", "transformer", "generator",
];

const C02_KEYWORDS = [
  "pressure transmitter", "flow meter", "level switch", "temperature probe",
  "rtd", "thermocouple", "solenoid valve", "positioner", "gauge",
  "instrument fitting", "instrument tubing", "actuator small",
  "control valve small", "transmitter", "sensor", "transducer",
];

const C03_KEYWORDS = [
  "bearing", "seal", "o-ring", "gasket", "shim", "key steel", "retaining ring",
  "circlip", "bush", "mechanical seal", "small coupling", "small shaft",
  "wear insert small", "pillow block", "spherical roller", "ball bearing",
];

const C04_KEYWORDS = [
  "v belt", "belt drive", "roller small", "scraper blade", "belt fastener",
  "pulley small", "idler small", "coupling heavy", "idler", "belt", "scraper",
  "pulley", "roller", "conveyor", "screen panel", "crusher liner", "liner",
  "wear part",
];

const C05_KEYWORDS = [
  "bolt", "nut", "washer", "stud", "threaded rod", "u-bolt", "anchor",
  "hose clamp", "pin", "clip", "adhesive", "sealant", "absorbent",
  "ppe", "glove", "respirator", "hard hat", "grease cartridge", "oil filter",
  "breather", "sight glass", "auto-lube", "oil sample bottle",
  "grease", "lubricant", "tape", "battery", "consumable",
  "safety shower", "fire extinguisher", "sling", "wrench", "tool",
  "screw", "fastener",
];

// ─── Allocation function ─────────────────────────────────────────
function matchesAny(desc: string, keywords: string[]): boolean {
  return keywords.some((kw) => desc.includes(kw));
}

/**
 * Allocate a warehouse area code based on the item description.
 * Priority: LD → C01 → C02 → C03 → C04 → C05 → default C03-ME
 */
export function allocateWarehouseArea(description: string | null | undefined): string {
  if (!description) return "C03-ME";
  const desc = description.toLowerCase();

  // LD overrides — heavy/oversized items
  if (matchesAny(desc, LD_KEYWORDS)) return "LD";

  // C01 — Electrical
  if (matchesAny(desc, C01_KEYWORDS)) return "C01-EL";

  // C02 — Instrumentation
  if (matchesAny(desc, C02_KEYWORDS)) return "C02-IN";

  // C03 — Precision Mechanical (small)
  if (matchesAny(desc, C03_KEYWORDS)) return "C03-ME";

  // C04 — Mechanical Wear & Belts
  if (matchesAny(desc, C04_KEYWORDS)) return "C04-MW";

  // C05 — Fasteners, Consumables & Lubrication
  if (matchesAny(desc, C05_KEYWORDS)) return "C05-FA";

  // Default fallback
  return "C03-ME";
}

// ─── Legacy exports for compatibility ────────────────────────────

const CONTAINER_INFO: Record<string, ContainerMapping> = {
  "C01-EL": { containerId: "C01", zoneCode: "EL", containerLabel: "Electrical" },
  "C02-IN": { containerId: "C02", zoneCode: "IN", containerLabel: "Instrumentation & Control" },
  "C03-ME": { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Precision" },
  "C04-MW": { containerId: "C04", zoneCode: "MW", containerLabel: "Mechanical Wear & Belts" },
  "C05-FA": { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners, Consumables & Lubrication" },
  "LD":     { containerId: "LD", zoneCode: "LD", containerLabel: "Laydown Yard" },
};

const DEFAULT_CONTAINER: ContainerMapping = CONTAINER_INFO["C03-ME"];

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
