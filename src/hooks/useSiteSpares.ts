import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Legacy → TCMG Category Normalization Map
 *
 * Maps all historical / variant category names in the database to the
 * canonical 25-category TCMG taxonomy (CC 01–22 + sub-codes 10b, 19b, 19c).
 *
 * Canonical names (right-hand side) must match SpareCategory in
 * src/utils/categoryClassification.ts exactly.
 *
 * CC 01  Pump Component
 * CC 02  Motor Component
 * CC 03  Gearbox
 * CC 04  Bearing
 * CC 05  Valve
 * CC 06  Instrumentation
 * CC 07  Electrical
 * CC 08  Conveyor Component
 * CC 09  Wear Parts
 * CC 10  Mechanical
 * CC 10b Structural Steel
 * CC 11  Pipe Fitting
 * CC 12  Seal
 * CC 13  Filter
 * CC 14  Lubrication System
 * CC 15  Air & Pneumatic
 * CC 16  Tanks & Vessels
 * CC 17  Safety Equipment
 * CC 18  Power Generation
 * CC 19  Tooling
 * CC 19b Rigging
 * CC 19c PPE
 * CC 20  OEM Assembly
 * CC 21  Fastener
 * CC 22  Consumables
 */
const LEGACY_CATEGORY_MAP: Record<string, string> = {
  // ── CC 01 Pump Component ──────────────────────────────────────────────────
  "Pump": "Pump Component",
  "Pump Component": "Pump Component",

  // ── CC 02 Motor Component ─────────────────────────────────────────────────
  "Motor": "Motor Component",
  "Motor Component": "Motor Component",

  // ── CC 03 Gearbox ─────────────────────────────────────────────────────────
  "Gearbox": "Gearbox",
  "Gearbox Component": "Gearbox",

  // ── CC 04 Bearing ─────────────────────────────────────────────────────────
  "Bearing": "Bearing",
  "Bearings": "Bearing",

  // ── CC 05 Valve ───────────────────────────────────────────────────────────
  "Valve": "Valve",
  "Valves": "Valve",

  // ── CC 07 Electrical ──────────────────────────────────────────────────────
  "Electrical": "Electrical",
  "Electrical Components": "Electrical",

  // ── CC 08 Conveyor Component ──────────────────────────────────────────────
  "Conveyor": "Conveyor Component",
  "Conveyor Component": "Conveyor Component",
  "Conveying Components": "Conveyor Component",
  "Belt & Transmission": "Conveyor Component",
  "Belt / Chain": "Conveyor Component",
  "Belt and Chain": "Conveyor Component",
  "Belt & Chain": "Conveyor Component",

  // ── CC 09 Wear Parts ──────────────────────────────────────────────────────
  "Wear Part": "Wear Parts",
  "Wear Parts": "Wear Parts",
  "Liner": "Wear Parts",

  // ── CC 10 Mechanical ──────────────────────────────────────────────────────
  "Mechanical": "Mechanical",

  // ── CC 10b Structural Steel ───────────────────────────────────────────────
  "Structural": "Structural Steel",
  "Structural Steel": "Structural Steel",

  // ── CC 11 Pipe Fitting ────────────────────────────────────────────────────
  "Pipe Fitting": "Pipe Fitting",
  "Hose & Tubing": "Pipe Fitting",
  "Hoses & Pipework": "Pipe Fitting",

  // ── CC 12 Seal ────────────────────────────────────────────────────────────
  "Seal": "Seal",
  "Seal / Gasket": "Seal",
  "Seals & Gaskets": "Seal",

  // ── CC 13 Filter ──────────────────────────────────────────────────────────
  "Filter": "Filter",
  "Filters": "Filter",

  // ── CC 14 Lubrication System ──────────────────────────────────────────────
  "Lubrication": "Lubrication System",
  "Lubrication System": "Lubrication System",

  // ── CC 15 Air & Pneumatic ─────────────────────────────────────────────────
  "Pneumatic": "Air & Pneumatic",
  "Hydraulic": "Air & Pneumatic",
  "Air & Pneumatic": "Air & Pneumatic",
  "Air & Pneumatic Components": "Air & Pneumatic",

  // ── CC 16 Tanks & Vessels ─────────────────────────────────────────────────
  "Tanks & Vessels": "Tanks & Vessels",

  // ── CC 17 Safety Equipment ────────────────────────────────────────────────
  "Safety Equipment": "Safety Equipment",

  // ── CC 18 Power Generation ────────────────────────────────────────────────
  "Power Generation": "Power Generation",

  // ── CC 19 Tooling ─────────────────────────────────────────────────────────
  "Tooling": "Tooling",
  "Tools": "Tooling",
  "Tools & Workshop Equipment": "Tooling",

  // ── CC 19b Rigging ────────────────────────────────────────────────────────
  "Rigging": "Rigging",

  // ── CC 19c PPE ────────────────────────────────────────────────────────────
  "PPE": "PPE",

  // ── CC 20 OEM Assembly ────────────────────────────────────────────────────
  "OEM Assembly": "OEM Assembly",

  // ── CC 21 Fastener ────────────────────────────────────────────────────────
  "Fastener": "Fastener",
  "Fasteners": "Fastener",

  // ── CC 22 Consumables (catch-all) ─────────────────────────────────────────
  "Consumable": "Consumables",
  "Consumables": "Consumables",
  "General": "Consumables",
  "Unknown / TBC": "Consumables",
  "Unknown / To Be Confirmed": "Consumables",
};

const normalizeCategory = (category: string | null): string => {
  if (!category) return "Consumables";
  return LEGACY_CATEGORY_MAP[category] || category;
};

export interface SiteSpareItem {
  id: string;
  part_number: string;
  description: string;
  category: string;
  subcategory: string;
  warehouse_area: string;
  bin_location: string;
  aisle: string;
  rack: string;
  storage_type: string;
  qty_on_hand: number;
  min_qty: number;
  max_qty: number;
  reorder_point: number;
  uom: string;
  unit_cost: number;
  preferred_supplier: string;
  lead_time_days: number;
  last_purchase_date: string | null;
  manufacturer: string;
  oem_part_number: string;
  alternate_part_number: string;
  condition: string;
  status: string;
  is_critical: boolean;
  critical_spare_id: string;
  asset_tag: string;
  specifications: string;
  notes: string;
  image_urls: string[];
}

export const useSiteSpares = () => {
  const [spares, setSpares] = useState<SiteSpareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all spares from database — returns data directly for callers
  const fetchSpares = async (): Promise<SiteSpareItem[]> => {
    setLoading(true);
    // NOTE: The backend applies a default 1000-row limit per request.
    // We page through results to ensure large catalogues (e.g. 1700+ rows)
    // load fully.
    const pageSize = 1000;
    let from = 0;
    const all: SiteSpareItem[] = [];

    while (true) {
      const { data, error } = await supabase
        .from("site_spares")
        .select("*")
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error("Error fetching spares:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory data.",
          variant: "destructive",
        });
        break;
      }

      // Normalize image_urls to always be an array and normalize legacy categories
      const batch = (data || []).map((row: any) => ({
        ...row,
        category: normalizeCategory(row.category),
        image_urls: (row.image_urls ?? []) as string[],
      })) as SiteSpareItem[];
      all.push(...batch);

      if (batch.length < pageSize) break;
      from += pageSize;
    }

    setSpares(all);
    setLoading(false);
    return all;
  };

  // Add a single spare
  const addSpare = async (spare: Omit<SiteSpareItem, "id">) => {
    const { data, error } = await supabase
      .from("site_spares")
      .insert([spare])
      .select()
      .single();

    if (error) {
      console.error("Error adding spare:", error);
      toast({
        title: "Error",
        description: "Failed to add item.",
        variant: "destructive",
      });
      return null;
    }

    setSpares((prev) => [...prev, data]);
    toast({
      title: "Item Added",
      description: `${spare.description} has been added to inventory.`,
    });
    return data;
  };

  // Import multiple spares (replaces all existing)
  const importSpares = async (newSpares: Omit<SiteSpareItem, "id">[]) => {
    // SAFETY: Do NOT delete the existing inventory first.
    // If an insert fails mid-way (network / validation), deleting up-front can
    // leave the catalogue empty after refresh.
    // Instead: insert the new rows first, then delete the old rows after a
    // successful import.
    const importStartIso = new Date().toISOString();

    // Insert new spares in batches of 100
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < newSpares.length; i += batchSize) {
      const batch = newSpares.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from("site_spares")
        .insert(batch);

      if (insertError) {
        console.error("Error inserting batch:", insertError);
        toast({
          title: "Error",
          description: `Failed to import items (batch ${Math.floor(i / batchSize) + 1}).`,
          variant: "destructive",
        });
        return false;
      }
      insertedCount += batch.length;
    }

    // Remove the old inventory only after a full successful insert.
    // New rows will have created_at >= importStartIso (default now()).
    const { error: cleanupError } = await supabase
      .from("site_spares")
      .delete()
      .or(`created_at.is.null,created_at.lt.${importStartIso}`);

    if (cleanupError) {
      console.error("Error cleaning up old inventory:", cleanupError);
      toast({
        title: "Import completed with warning",
        description:
          "New items were imported, but old items could not be removed automatically. Please try importing again or refresh.",
        variant: "destructive",
      });
      // Still refresh so the user sees the newly imported items.
    }

    // Refresh the data
    await fetchSpares();

    toast({
      title: "Import Successful",
      description: `${insertedCount} items have been imported to inventory.`,
    });
    return true;
  };

  // Merge multiple spares (adds to existing, preserves photos from existing records)
  const mergeSpares = async (newSpares: Omit<SiteSpareItem, "id">[]) => {
    if (newSpares.length === 0) {
      toast({
        title: "No Items",
        description: "No unique items to import.",
      });
      return true;
    }

    // Build a lookup of existing items with photos by normalized description
    const normalizeDesc = (d: string) => (d || "").toLowerCase().trim();
    const existingWithPhotos = new Map<string, string[]>();
    
    spares.forEach((s) => {
      if (s.image_urls && s.image_urls.length > 0) {
        const key = normalizeDesc(s.description);
        if (key) {
          existingWithPhotos.set(key, s.image_urls);
        }
      }
    });

    // Preserve photos from existing records when merging
    const sparesWithPhotos = newSpares.map((spare) => {
      const key = normalizeDesc(spare.description);
      const existingPhotos = existingWithPhotos.get(key);
      
      if (existingPhotos && existingPhotos.length > 0 && (!spare.image_urls || spare.image_urls.length === 0)) {
        return { ...spare, image_urls: existingPhotos };
      }
      return spare;
    });

    // Insert new spares in batches of 100
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < sparesWithPhotos.length; i += batchSize) {
      const batch = sparesWithPhotos.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from("site_spares")
        .insert(batch);

      if (insertError) {
        console.error("Error inserting batch:", insertError);
        toast({
          title: "Error",
          description: `Failed to merge items (batch ${Math.floor(i / batchSize) + 1}).`,
          variant: "destructive",
        });
        return false;
      }
      insertedCount += batch.length;
    }

    // Refresh the data
    await fetchSpares();

    toast({
      title: "Merge Successful",
      description: `${insertedCount} new items have been added to inventory.`,
    });
    return true;
  };

  // Update a spare
  const updateSpare = async (id: string, updates: Partial<SiteSpareItem>) => {
    const { error } = await supabase
      .from("site_spares")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating spare:", error);
      return false;
    }

    setSpares((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    return true;
  };

  // Delete a spare
  const deleteSpare = async (id: string) => {
    const { error } = await supabase
      .from("site_spares")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting spare:", error);
      return false;
    }

    setSpares((prev) => prev.filter((s) => s.id !== id));
    return true;
  };

  useEffect(() => {
    fetchSpares();
  }, []);

  return {
    spares,
    loading,
    addSpare,
    importSpares,
    mergeSpares,
    updateSpare,
    deleteSpare,
    refetch: fetchSpares,
  };
};
