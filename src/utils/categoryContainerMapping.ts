/**
 * Category → Container Mapping
 *
 * Maps site_spares categories (aligned with Part Numbering Standard CC codes)
 * to their designated warehouse container.
 * This is the single source of truth for which container a category belongs to.
 *
 * Container layout:
 *   C01 (EL) – Electrical
 *   C02 (IN) – Instrumentation & Control
 *   C03 (ME) – Mechanical Small Parts (bearings, seals, pumps, valves, etc.)
 *   C04 (LU) – Lubrication & Oils
 *   C05 (FA) – Fasteners & Consumables
 */

export interface ContainerMapping {
  containerId: string;   // e.g. "C01"
  zoneCode: string;      // e.g. "EL"
  containerLabel: string; // e.g. "Electrical"
}

/**
 * Primary mapping: category name (matching Part Numbering Standard) → container.
 * Categories not listed here default to C03 (Mechanical) as catch-all.
 */
const CATEGORY_TO_CONTAINER: Record<string, ContainerMapping> = {
  // C01 – Electrical
  "Electrical Components":             { containerId: "C01", zoneCode: "EL", containerLabel: "Electrical" },
  "Power Generation & Distribution":   { containerId: "C01", zoneCode: "EL", containerLabel: "Electrical" },

  // C02 – Instrumentation
  "Instrumentation":                   { containerId: "C02", zoneCode: "IN", containerLabel: "Instrumentation & Control" },

  // C03 – Mechanical (explicit entries)
  "Bearings":                          { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Seals & Gaskets":                   { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Pumps":                             { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Valves":                            { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Motors":                            { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Conveying Components":              { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Structural & Mechanical":           { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Gearboxes / Reducers":              { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Air & Pneumatic Components":        { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Wear Parts":                        { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "OEM Assemblies / Packages":         { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },
  "Tanks & Vessels":                   { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },

  // C03 – Mechanical (Hoses & Pipework merged into Mechanical)
  "Hoses & Pipework":                  { containerId: "C03", zoneCode: "ME", containerLabel: "Mechanical Small Parts" },

  // C04 – Lubrication & Oils
  "Filters":                           { containerId: "C04", zoneCode: "LU", containerLabel: "Lubrication & Oils" },
  "Lubrication System Components":     { containerId: "C04", zoneCode: "LU", containerLabel: "Lubrication & Oils" },

  // C05 – Fasteners & Consumables
  "Fasteners":                         { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners & Consumables" },
  "Consumables":                       { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners & Consumables" },
  "Safety Equipment":                  { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners & Consumables" },
  "Tools & Workshop Equipment":        { containerId: "C05", zoneCode: "FA", containerLabel: "Fasteners & Consumables" },
};

/** Default container for unmapped categories */
const DEFAULT_CONTAINER: ContainerMapping = {
  containerId: "C03",
  zoneCode: "ME",
  containerLabel: "Mechanical Small Parts",
};

/**
 * Get the designated container for a given category.
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
