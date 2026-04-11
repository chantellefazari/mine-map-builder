/**
 * Canonical sub-area code mapping used across the entire asset tree.
 * Single source of truth — import this everywhere instead of duplicating.
 */
export const subAreaCodeMap: Record<string, string> = {
  "Site Infrastructure": "INFRA",
  "Buildings": "BLDG",
  "Compressed Air": "COMP",
  "Power Station / MCC": "PSMCC",
  "Power Generation": "PWR",
  "Reagents (Lime)": "REAG",
  "Reagents": "REAG",
  "Water": "WTR",
  "Hydraulic Systems": "HYD",
  "Fuel Systems": "FUEL",
  "Feed / Reclaim": "FEED",
  "Conveying": "CONV",
  "Grinding": "GRIND",
  "Classification": "CLASS",
  "Gravity Circuit": "GRAV",
  "CIP": "CIP",
  "Elution": "ELUT",
  "Carbon Regeneration": "REGEN",
  "Gold Room": "GOLD",
  "Thickening": "THK",
  "Filtering": "FILT",
  "Workshop": "WKSHP",
  "Lab": "LAB",
  "Heavy Vehicles": "HV",
  "Small Mobile Equipment": "SME",
  "Lighting Towers": "LTW",
  "Light Vehicles": "LV",
  
};

/**
 * Returns the abbreviated sub-area code for a given label.
 * Falls back to first 4 uppercase chars if not mapped.
 */
export function getSubAreaCode(label: string): string {
  return subAreaCodeMap[label] || label.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, "");
}

/**
 * Formats a sub-area label with its abbreviation prefix.
 * e.g. "Buildings" → "BLDG Buildings"
 */
export function formatSubAreaLabel(label: string): string {
  const code = getSubAreaCode(label);
  return `${code} ${label}`;
}
