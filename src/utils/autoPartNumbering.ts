/**
 * Auto-numbering utility for SSCCNNN site part numbers (7-digit, numeric only).
 *
 * Queries the database for existing part numbers in a given category
 * and returns the next available sequential identifier.
 *
 * Format: SSCCNNN
 *   SS  = Site code (2 digits, currently "10")
 *   CC  = Category code (2 digits, 01–23)
 *   NNN = Sequential identifier (3 digits, 001–999)
 */

import { supabase } from "@/integrations/supabase/client";

const SITE_CODE = "10";

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
  "Unknown / To Be Confirmed": "22", "Unknown / TBC": "22", "General": "22",
  // Additional categories
  "Structural Steel": "23",
  "Belt / Chain": "08",
  "Hydraulic": "15",
  "Rigging": "24",
  "PPE": "25",
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
  return CATEGORY_CODE_MAP[categoryNameOrCode] || "22"; // default to Consumables
}

/**
 * Generate the next available SSCCNNN part number for a given category.
 *
 * @param category - Category name (e.g. "Pumps") or code (e.g. "01")
 * @returns The next available 7-digit part number string, or null if category is full (999 slots)
 */
export async function generateNextPartNumber(
  category: string
): Promise<string | null> {
  const cc = resolveCategoryCode(category);
  const prefix = `${SITE_CODE}${cc}`;

  // Fetch all existing part numbers with this prefix from both tables
  const [visualResult, sparesResult] = await Promise.all([
    supabase
      .from("visual_parts_catalogue")
      .select("site_part_number")
      .like("site_part_number", `${prefix}%`),
    supabase
      .from("site_spares")
      .select("part_number")
      .like("part_number", `${prefix}%`),
  ]);

  if (visualResult.error) {
    console.error("Error fetching existing part numbers:", visualResult.error);
    return null;
  }

  // Collect all used NNN identifiers
  const usedNumbers = new Set<number>();

  for (const row of visualResult.data ?? []) {
    const pn = row.site_part_number;
    if (pn && pn.startsWith(prefix)) {
      const nnn = parseInt(pn.slice(4), 10);
      if (!isNaN(nnn) && nnn >= 1 && nnn <= 999) {
        usedNumbers.add(nnn);
      }
    }
  }

  for (const row of sparesResult.data ?? []) {
    const pn = row.part_number;
    if (pn && pn.startsWith(prefix)) {
      const nnn = parseInt(pn.slice(4), 10);
      if (!isNaN(nnn) && nnn >= 1 && nnn <= 999) {
        usedNumbers.add(nnn);
      }
    }
  }

  // Find the first unused NNN (001–999)
  for (let i = 1; i <= 999; i++) {
    if (!usedNumbers.has(i)) {
      return `${prefix}${String(i).padStart(3, "0")}`;
    }
  }

  // Category is full (999 slots exhausted)
  return null;
}

/**
 * Generate the next available part number for a site_spares entry.
 * Same logic — checks both tables for collision avoidance.
 */
export async function generateNextSparePartNumber(
  category: string
): Promise<string | null> {
  return generateNextPartNumber(category);
}
