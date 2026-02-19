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
  "pps": "Pump Component",
  "pps australia": "Pump Component",
  "pump power services": "Pump Component",
  "gwg": "Pipe Fitting",
  "gwg poly": "Pipe Fitting",
  "newman": "Motor Component",
  "newmans": "Motor Component",
  "newmans electrical": "Motor Component",
  "keyflo": "Valve",
  "keyflo valves": "Valve",
  "britrac": "Wear Parts",
  "britrac conveyor": "Wear Parts",
  "motion": "Bearing",
  "motion australia": "Bearing",
  "mme": "Wear Parts",
  "matec": "Filter",
  "sydney tools": "Tooling",
  "sydneytools": "Tooling",
  "all rig": "Rigging",
  "allrig": "Rigging",
  "mixtec": "Gearbox",
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
