/**
 * Category → Container Mapping
 *
 * Maps site_spares categories to their designated warehouse container.
 * This is the single source of truth for which container a category belongs to.
 *
 * Container layout:
 *   C01 (EL) – Electrical
 *   C02 (IN) – Instrumentation & Control
 *   C03 (ME) – Mechanical Small Parts (bearings, seals, pumps, valves, etc.)
 *   C04 (LU) – Lubrication & Oils
 *   C05 (FA) – Fasteners & Consumables
 *   C06 (FT) – Pipe Fittings & Plumbing
 */

export interface ContainerMapping {
  containerId: string;   // e.g. "C01"
  zoneCode: string;      // e.g. "EL"
  containerLabel: string; // e.g. "Electrical"
}

/**
 * Primary mapping: category name → container.
 * Categories not listed here default to C03 (Mechanical) as catch-all.
 */
const CATEGORY_TO_CONTAINER: Record<string, ContainerMapping> = {
  // C01 – Electrical
  "Electrical":          { containerId: "C01", zoneCode: "EL", containerLabel: "Electrical" },

  // C02 – Instrumentation
  "Instrumentation":     { containerId: "C02", zoneCode: "IN", containerLabel: "Instrumentation & Control" },

  // C03 – Mechanical (explicit entries)
  "Bearing":             { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Seal":                { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Pump Component":      { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Valve":               { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Motor Component":     { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Conveyor Component":  { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Mechanical":          { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Gearbox":             { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Hydraulic":           { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Pneumatic":           { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Wear Part":           { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Hose & Tubing":       { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },

  // C04 – Lubrication
  "Filter":              { containerId: "C04", zoneCode: "LU", containerLabel: "Lubrication & Oils" },

  // C05 – Fasteners & Consumables
  "Fastener":            { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners & Consumables" },
  "Consumable":          { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners & Consumables" },
  "Liner":               { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners & Consumables" },
  "Safety Equipment":    { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners & Consumables" },

  // C06 – Pipe Fittings
  "Pipe Fitting":        { containerId: "C06", zoneCode: "FT", containerLabel: "Pipe Fittings & Plumbing" },
};

/** Default container for unmapped categories */
const DEFAULT_CONTAINER: ContainerMapping = {
  containerId: "C03",
  zoneCode: "ME",
  containerLabel: "Mechanical Small Parts",
};

/**
 * Get the designated container for a given category.
 * Unmapped or "General" categories default to C03 (Mechanical).
 */
export function getContainerForCategory(category: string | null | undefined): ContainerMapping {
  if (!category) return DEFAULT_CONTAINER;
  return CATEGORY_TO_CONTAINER[category] || DEFAULT_CONTAINER;
}

/**
 * Get all categories mapped to a specific container ID (e.g. "C01").
 */
export function getCategoriesForContainer(containerId: string): string[] {
  return Object.entries(CATEGORY_TO_CONTAINER)
    .filter(([, mapping]) => mapping.containerId === containerId)
    .map(([category]) => category);
}

/**
 * Suggest a bin_location prefix for a given category.
 * Returns the container ID (e.g. "C01") which forms the first segment of
 * the Container-Zone-Position code.
 */
export function suggestBinPrefix(category: string | null | undefined): string {
  const mapping = getContainerForCategory(category);
  return mapping.containerId;
}

/**
 * Get a summary of all container mappings for display purposes.
 */
export function getContainerMappingSummary(): Array<ContainerMapping & { categories: string[] }> {
  const containerMap = new Map<string, { mapping: ContainerMapping; categories: string[] }>();

  for (const [category, mapping] of Object.entries(CATEGORY_TO_CONTAINER)) {
    const existing = containerMap.get(mapping.containerId);
    if (existing) {
      existing.categories.push(category);
    } else {
      containerMap.set(mapping.containerId, { mapping, categories: [category] });
    }
  }

  return Array.from(containerMap.values()).map(({ mapping, categories }) => ({
    ...mapping,
    categories,
  }));
}
