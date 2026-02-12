/**
 * Visual Parts Category Classification Utility
 * 
 * Auto-classifies parts into Visual Parts Catalogue categories based on:
 * 1. Supplier name (known supplier specializations)
 * 2. Description keywords (fallback pattern matching)
 * 
 * Categories aligned with Site Parts Numbering Standard (TCMG) CC codes.
 */

import { type SpareCategory } from "./categoryClassification";

// Re-export SpareCategory as VisualPartCategory for backward compat
export type VisualPartCategory = SpareCategory;

// Supplier specialization mappings — using approved category names
const SUPPLIER_CATEGORY_MAP: Record<string, SpareCategory> = {
  "pps": "Pumps",
  "pps australia": "Pumps",
  "pump power services": "Pumps",
  "gwg": "Hoses & Pipework",
  "gwg poly": "Hoses & Pipework",
  "newman": "Motors",
  "newmans": "Motors",
  "newmans electrical": "Motors",
  "keyflo": "Valves",
  "keyflo valves": "Valves",
  "britrac": "Wear Parts",
  "britrac conveyor": "Wear Parts",
  "motion": "Bearings",
  "motion australia": "Bearings",
  "mme": "Wear Parts",
  "matec": "Filters",
  "sydney tools": "Tools & Workshop Equipment",
  "sydneytools": "Tools & Workshop Equipment",
  "all rig": "Tools & Workshop Equipment",
  "allrig": "Tools & Workshop Equipment",
  "mixtec": "Gearboxes / Reducers",
};

/**
 * Normalize text for matching
 */
const normalizeText = (text: string): string => {
  return text.toLowerCase().trim();
};

/**
 * Classify a part by supplier name first, then fall back to the main
 * classifyCategory engine from categoryClassification.ts
 */
export const classifyVisualPartCategory = (
  description: string,
  supplier?: string | null
): SpareCategory => {
  // First try supplier-based classification
  if (supplier) {
    const normalizedSupplier = normalizeText(supplier);
    for (const [key, category] of Object.entries(SUPPLIER_CATEGORY_MAP)) {
      if (normalizedSupplier.includes(key) || key.includes(normalizedSupplier)) {
        return category;
      }
    }
  }

  // Fall back to the unified classification engine
  const { classifyCategory } = require("./categoryClassification");
  return classifyCategory(description);
};

/**
 * Get all visual part categories (delegates to main engine)
 */
export const getAllVisualPartCategories = (): SpareCategory[] => {
  const { getAllCategories } = require("./categoryClassification");
  return getAllCategories();
};
