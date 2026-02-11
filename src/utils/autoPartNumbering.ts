/**
 * Auto-numbering utility for SSCCXX site part numbers.
 *
 * Queries the database for existing part numbers in a given category
 * and returns the next available sequential identifier.
 *
 * Sequence order: 01–99, then A0–A9, B0–B9, … Z0–Z9
 * (letters I, O, Q are skipped to avoid misreads)
 */

import { supabase } from "@/integrations/supabase/client";

const SITE_CODE = "10";

/** Letters allowed in the alpha-numeric range (I, O, Q excluded) */
const ALLOWED_LETTERS = "ABCDEFGHJKLMNPRSTUVWXYZ".split("");

/**
 * Build the full ordered sequence of identifiers for a category slot:
 *   "01", "02", … "99", "A0", "A1", … "A9", "B0", … "Z9"
 */
function buildSequenceList(): string[] {
  const seq: string[] = [];

  // Numeric: 01–99
  for (let i = 1; i <= 99; i++) {
    seq.push(String(i).padStart(2, "0"));
  }

  // Alpha-numeric: [A-Z (excl I,O,Q)][0-9]
  for (const letter of ALLOWED_LETTERS) {
    for (let digit = 0; digit <= 9; digit++) {
      seq.push(`${letter}${digit}`);
    }
  }

  return seq;
}

const FULL_SEQUENCE = buildSequenceList();

/**
 * Category code mapping — mirrors the CATEGORY_NAMES in sitePartNumberValidation.ts
 * Maps human-readable category names (and common variants) to their 2-digit codes.
 */
const CATEGORY_CODE_MAP: Record<string, string> = {
  // Standard names
  "Pumps": "01", "Pump": "01", "Pump Component": "01",
  "Motors": "02", "Motor": "02", "Motor Component": "02",
  "Gearboxes / Reducers": "03", "Gearbox": "03", "Gearbox Component": "03",
  "Bearings": "04", "Bearing": "04",
  "Valves": "05", "Valve": "05",
  "Instrumentation": "06",
  "Electrical Components": "07", "Electrical": "07",
  "Conveying Components": "08", "Conveyor": "08", "Conveyor Component": "08",
  "Wear Parts": "09", "Wear Part": "09", "Liner": "09",
  "Structural & Mechanical": "10", "Structural": "10", "Mechanical": "10",
  "Hoses & Pipework": "11", "Hose & Tubing": "11", "Pipe Fitting": "11",
  "Seals & Gaskets": "12", "Seal": "12", "Seal / Gasket": "12",
  "Filters": "13", "Filter": "13",
  "Lubrication System Components": "14", "Lubrication": "14",
  "Air & Pneumatic Components": "15", "Pneumatic": "15",
  "Tanks & Vessels": "16",
  "Safety Equipment": "17",
  "Power Generation & Distribution": "18",
  "Tools & Workshop Equipment": "19", "Tooling": "19",
  "OEM Assemblies / Packages": "20",
  "Fasteners": "21", "Fastener": "21",
  "Consumables": "22", "Consumable": "22",
  "Unknown / To Be Confirmed": "23", "General": "23",
  // Additional visual-parts categories
  "Belt / Chain": "08",
  "Hydraulic": "15",
  "Rigging": "10",
};

/**
 * Resolve a category name (or code) to its 2-digit code.
 */
export function resolveCategoryCode(categoryNameOrCode: string): string {
  // If it already looks like a valid 2-digit code, return it
  if (/^\d{2}$/.test(categoryNameOrCode)) {
    const num = parseInt(categoryNameOrCode, 10);
    if (num >= 1 && num <= 23) return categoryNameOrCode;
  }
  return CATEGORY_CODE_MAP[categoryNameOrCode] || "23"; // default to "Unknown"
}

/**
 * Generate the next available SSCCXX part number for a given category.
 *
 * @param category - Category name (e.g. "Pump Component") or code (e.g. "01")
 * @returns The next available part number string, or null if the category is full
 */
export async function generateNextPartNumber(
  category: string
): Promise<string | null> {
  const cc = resolveCategoryCode(category);
  const prefix = `${SITE_CODE}${cc}`;

  // Fetch all existing part numbers with this prefix
  const { data, error } = await supabase
    .from("visual_parts_catalogue")
    .select("site_part_number")
    .like("site_part_number", `${prefix}%`);

  // Also check site_spares table
  const { data: sparesData } = await supabase
    .from("site_spares")
    .select("part_number")
    .like("part_number", `${prefix}%`);

  if (error) {
    console.error("Error fetching existing part numbers:", error);
    return null;
  }

  // Collect all used sequence identifiers
  const usedSequences = new Set<string>();

  for (const row of data ?? []) {
    const pn = row.site_part_number;
    if (pn && pn.length === 6 && pn.startsWith(prefix)) {
      usedSequences.add(pn.slice(4).toUpperCase());
    }
  }

  for (const row of sparesData ?? []) {
    const pn = row.part_number;
    if (pn && pn.length === 6 && pn.startsWith(prefix)) {
      usedSequences.add(pn.slice(4).toUpperCase());
    }
  }

  // Find the first unused identifier
  for (const seq of FULL_SEQUENCE) {
    if (!usedSequences.has(seq)) {
      return `${prefix}${seq}`;
    }
  }

  // Category is full (329 slots exhausted — extremely unlikely)
  return null;
}

/**
 * Generate the next available part number for a site_spares entry.
 * Same logic, just queries both tables for collision avoidance.
 */
export async function generateNextSparePartNumber(
  category: string
): Promise<string | null> {
  // Reuse the same function — it already checks both tables
  return generateNextPartNumber(category);
}
