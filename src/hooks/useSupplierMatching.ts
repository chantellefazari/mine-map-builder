import { useMemo } from "react";
import type { Supplier } from "@/hooks/useSuppliers";

/**
 * Category keyword mapping: maps spare categories to keywords
 * that should match against supplier's "whatUsedFor" field.
 */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Pipe Fitting": ["pipe", "fitting", "plumbing"],
  "Valve": ["valve", "actuator"],
  "Pump": ["pump"],
  "Motor": ["motor", "electric"],
  "Gearbox": ["gearbox", "gear", "reducer"],
  "Bearing": ["bearing"],
  "Belt": ["belt", "pulley"],
  "Hydraulic": ["hydraulic"],
  "Pneumatic": ["pneumatic"],
  "Electrical": ["electrical", "electric", "switchgear", "cable"],
  "Fastener": ["fastener", "bolt", "nut", "screw"],
  "Filter": ["filter", "filtration"],
  "Seal": ["seal", "gasket", "o-ring"],
  "Instrumentation": ["instrument", "sensor", "gauge"],
  "Safety": ["safety", "ppe"],
  "Lubricant": ["lubricant", "oil", "grease"],
  "Welding": ["welding", "weld"],
  "General": [],
};

/**
 * Finds keywords for a given category by checking if any
 * known category key is contained in the spare's category string.
 */
function getKeywordsForCategory(category: string): string[] {
  const lower = category.toLowerCase();
  for (const [key, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return keywords;
    }
  }
  // Fallback: use the category itself as keyword
  return lower ? [lower] : [];
}

/**
 * Check if a supplier's "whatUsedFor" field matches any of the keywords.
 */
function supplierMatchesKeywords(supplier: Supplier, keywords: string[]): boolean {
  if (keywords.length === 0) return false;
  const usedFor = supplier.whatUsedFor.toLowerCase();
  return keywords.some((kw) => usedFor.includes(kw));
}

export interface MatchedSupplier extends Supplier {
  isPreferredForPart: boolean;
}

/**
 * Hook that returns suppliers matching a spare's category,
 * with the current preferred supplier flagged.
 */
export function useSupplierMatching(
  suppliers: Supplier[],
  category: string | null | undefined,
  currentPreferredSupplier: string | null | undefined
): MatchedSupplier[] {
  return useMemo(() => {
    if (!category) return [];

    const keywords = getKeywordsForCategory(category);
    const preferredLower = (currentPreferredSupplier || "").toLowerCase().trim();

    const matched = suppliers
      .filter((s) => supplierMatchesKeywords(s, keywords))
      .map((s) => ({
        ...s,
        isPreferredForPart:
          preferredLower !== "" &&
          (s.name.toLowerCase().includes(preferredLower) ||
            preferredLower.includes(s.name.toLowerCase())),
      }));

    // Sort: preferred first, then alphabetical
    matched.sort((a, b) => {
      if (a.isPreferredForPart && !b.isPreferredForPart) return -1;
      if (!a.isPreferredForPart && b.isPreferredForPart) return 1;
      return a.name.localeCompare(b.name);
    });

    return matched;
  }, [suppliers, category, currentPreferredSupplier]);
}
