/**
 * Core Part Extractor Utility
 * Extracts the core part identifier from descriptions, ignoring
 * trailing asset-specific comments like conveyor names, asset tags, etc.
 */

/**
 * Patterns that indicate asset-specific suffixes to strip
 * These are typically appended comments about WHERE a part is used
 */
const ASSET_SUFFIX_PATTERNS: RegExp[] = [
  // Asset tags in parentheses: (Transfer Conveyor), (Mill Feed), etc.
  /\s*\([^)]*(?:conveyor|pump|mill|tank|thickener|crusher|screen|feeder|motor|agitator|filter|press)[^)]*\)\s*$/gi,
  
  // Asset codes like 04-FE-101, 04-BC-100, etc. at end
  /\s*\d{2}-[A-Z]{2,3}-\d{2,3}[A-Z]?\s*$/gi,
  
  // Asset codes in parentheses
  /\s*\(\d{2}-[A-Z]{2,3}-\d{2,3}[A-Z]?\)\s*$/gi,
  
  // Common trailing location indicators
  /\s*(?:for|on|at)\s+(?:the\s+)?(?:\w+\s+)?(?:conveyor|pump|mill|tank|thickener|crusher|screen|feeder|motor|agitator|filter|press)s?\s*$/gi,
  
  // "Conveyor Belt 04-FE-101 (Transfer Conveyor)" pattern - strip the asset reference portion
  /\s+\d{2}-[A-Z]{2,3}-\d{2,3}[A-Z]?\s*\([^)]+\)\s*$/gi,
];

/**
 * Patterns to identify core part identifiers (model numbers, specs)
 * These should be preserved and used for matching
 */
const CORE_PART_PATTERNS: RegExp[] = [
  // Belt model codes: BLT-600-4P-6+2, EP800/4, etc.
  /\b(BLT[-\s]?\d+[-\s]?\d*[A-Z]?[-\s]?\d*[-+]?\d*)\b/gi,
  /\b(EP\d+\/?\d*)\b/gi,
  
  // Pump model numbers: WBH-75, SHW-100, etc.
  /\b([A-Z]{2,4}[-\s]?\d{2,4}[A-Z]?)\b/gi,
  
  // Valve model codes: KGD, SU10R, F990, etc.
  /\b(KGD|SU\d+[A-Z]?|F\d{3}[A-Z]?)\b/gi,
  
  // Size specifications: DN150, DN200, 6", 8", etc.
  /\b(DN\d+)\b/gi,
  /\b(\d+[""])\b/gi,
  
  // Material specs: 316SS, CS, CI, etc.
  /\b(316SS|304SS|CS|CI|DI)\b/gi,
  
  // Bearing numbers: 6310, 22318, etc.
  /\b(\d{4,5}[A-Z]?\d*)\b/gi,
  
  // SEW model numbers: R87DRE132MC4, etc.
  /\b([RKFS]\d{2,3}[A-Z]{2,3}\d{2,3}[A-Z]{2,3}\d?)\b/gi,
];

/**
 * Extract the core part identifier from a description
 * This strips asset-specific suffixes to enable better duplicate detection
 */
export const extractCorePart = (description: string): string => {
  if (!description) return "";
  
  let core = description.trim();
  
  // First, try to strip trailing asset-specific suffixes
  for (const pattern of ASSET_SUFFIX_PATTERNS) {
    core = core.replace(pattern, "");
  }
  
  // Clean up any resulting double spaces or trailing punctuation
  core = core.replace(/\s+/g, " ").trim();
  core = core.replace(/[\s,;:\-\|]+$/, "").trim();
  
  return core;
};

/**
 * Generate a smarter duplicate key based on core part identifiers
 * Prioritizes model numbers and key specs over raw description text
 */
export const generateSmartDuplicateKey = (
  partNumber: string,
  manufacturer: string,
  model: string,
  description: string
): string => {
  // Priority 1: Part number
  if (partNumber && partNumber.trim().length > 3) {
    return `PN:${partNumber.toUpperCase().trim()}`;
  }
  
  // Priority 2: Manufacturer + Model
  if (manufacturer && model) {
    return `MM:${manufacturer.toUpperCase().trim()}|${model.toUpperCase().trim()}`;
  }
  
  // Priority 3: Extract core identifiers from description
  const coreDesc = extractCorePart(description);
  const identifiers = extractCoreIdentifiers(coreDesc);
  
  if (identifiers.length > 0) {
    // Use the first 2-3 key identifiers as the key
    const keyParts = identifiers.slice(0, 3).join("|");
    return `ID:${keyParts.toUpperCase()}`;
  }
  
  // Fallback: Use cleaned description (first 60 chars)
  return `DESC:${coreDesc.substring(0, 60).toUpperCase()}`;
};

/**
 * Extract key identifiers (model numbers, specs) from description
 */
export const extractCoreIdentifiers = (description: string): string[] => {
  if (!description) return [];
  
  const found: Set<string> = new Set();
  
  for (const pattern of CORE_PART_PATTERNS) {
    const matches = description.matchAll(new RegExp(pattern));
    for (const match of matches) {
      const value = (match[1] || match[0]).trim();
      if (value.length >= 3) {
        found.add(value.toUpperCase());
      }
    }
  }
  
  return Array.from(found);
};

/**
 * Calculate similarity between two descriptions based on core parts
 * Returns a score from 0-1 where 1 is identical core parts
 */
export const calculateCorePartSimilarity = (desc1: string, desc2: string): number => {
  const core1 = extractCorePart(desc1).toUpperCase();
  const core2 = extractCorePart(desc2).toUpperCase();
  
  // If cores are identical, perfect match
  if (core1 === core2) return 1;
  
  // Check if core identifiers match
  const ids1 = extractCoreIdentifiers(desc1);
  const ids2 = extractCoreIdentifiers(desc2);
  
  if (ids1.length === 0 || ids2.length === 0) {
    // Fall back to simple string comparison
    return simpleStringSimilarity(core1, core2);
  }
  
  // Count matching identifiers
  const matches = ids1.filter(id => ids2.includes(id));
  const maxLen = Math.max(ids1.length, ids2.length);
  
  return matches.length / maxLen;
};

/**
 * Simple string similarity using Jaccard index on words
 */
const simpleStringSimilarity = (s1: string, s2: string): number => {
  const words1 = new Set(s1.split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(s2.split(/\s+/).filter(w => w.length > 2));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
};

export default {
  extractCorePart,
  generateSmartDuplicateKey,
  extractCoreIdentifiers,
  calculateCorePartSimilarity,
};
