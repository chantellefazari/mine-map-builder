import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
}

export const useSiteSpares = () => {
  const [spares, setSpares] = useState<SiteSpareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all spares from database
  const fetchSpares = async () => {
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

      const batch = data || [];
      all.push(...batch);

      if (batch.length < pageSize) break;
      from += pageSize;
    }

    setSpares(all);
    setLoading(false);
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
    updateSpare,
    deleteSpare,
    refetch: fetchSpares,
  };
};
