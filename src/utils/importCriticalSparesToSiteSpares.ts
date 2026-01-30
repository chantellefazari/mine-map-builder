/**
 * Utility to import Critical Spares Register items into Site Spares Catalogue
 * Maps sparesData.ts fields to site_spares database schema
 */

import { sparesData, type SpareItem } from "@/components/critical-spares/sparesData";
import { supabase } from "@/integrations/supabase/client";
import { classifyCategory } from "@/utils/categoryClassification";

// Parse price string to number (e.g., "$16,450.00" -> 16450)
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[$,]/g, "");
  return parseFloat(cleaned) || 0;
};

// Map criticality to is_critical flag
const mapCriticality = (criticality: string): boolean => {
  return criticality === "High";
};

// Convert SpareItem to site_spares insert format
export const mapCriticalSpareToSiteSpare = (item: SpareItem) => {
  const description = item.sparePartDescription || `${item.componentName} - ${item.system}`;
  // Use centralized category classification
  const category = classifyCategory(description);
  return {
    description,
    category,
    subcategory: item.componentType,
    warehouse_area: "", // To be filled during site inventory
    bin_location: "", // To be filled during site inventory
    uom: item.uom || "EA",
    manufacturer: item.manufacturer || item.assetManufacturer || "",
    oem_part_number: item.oemPartNumber || "",
    qty_on_hand: 0, // Default - actual inventory to be verified
    min_qty: parseInt(item.minQty) || 0,
    max_qty: parseInt(item.maxQty) || 1,
    unit_cost: parsePrice(item.unitPrice),
    is_critical: mapCriticality(item.spareCriticality),
    preferred_supplier: item.vendor || "",
    critical_spare_id: item.id, // Link back to Critical Spares Register (CS-001, etc.)
    asset_tag: item.assetNumber, // Asset number for cross-reference
    specifications: `${item.areaLabel} > ${item.subArea} > ${item.system}`,
    notes: item.reasonCritical ? `Criticality: ${item.spareCriticality} - ${item.reasonCritical}. Status: ${item.status}` : "",
    status: "Pending Review", // Mark as pending for verification
  };
};

// Check for existing items by critical_spare_id
export const getExistingCriticalSpareIds = async (): Promise<Set<string>> => {
  const { data, error } = await supabase
    .from("site_spares")
    .select("critical_spare_id")
    .not("critical_spare_id", "eq", "");

  if (error) {
    console.error("Error fetching existing critical spare IDs:", error);
    return new Set();
  }

  return new Set(data?.map((d) => d.critical_spare_id || "") || []);
};

// Import all critical spares that don't already exist
export const importCriticalSparesToSiteSpares = async (): Promise<{
  inserted: number;
  skipped: number;
  errors: string[];
}> => {
  const existingIds = await getExistingCriticalSpareIds();
  const toInsert: ReturnType<typeof mapCriticalSpareToSiteSpare>[] = [];
  let skipped = 0;
  const errors: string[] = [];

  for (const item of sparesData) {
    if (existingIds.has(item.id)) {
      skipped++;
      continue;
    }
    toInsert.push(mapCriticalSpareToSiteSpare(item));
  }

  if (toInsert.length === 0) {
    return { inserted: 0, skipped, errors };
  }

  // Insert in batches of 50
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const { error } = await supabase.from("site_spares").insert(batch);

    if (error) {
      errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }

  return { inserted, skipped, errors };
};

// Get import preview (dry run)
export const getImportPreview = () => {
  return {
    totalItems: sparesData.length,
    highCriticality: sparesData.filter((s) => s.spareCriticality === "High").length,
    mediumCriticality: sparesData.filter((s) => s.spareCriticality === "Medium").length,
    items: sparesData.slice(0, 10).map(mapCriticalSpareToSiteSpare), // Preview first 10
  };
};
