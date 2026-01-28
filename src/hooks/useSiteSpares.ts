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
    const { data, error } = await supabase
      .from("site_spares")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching spares:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory data.",
        variant: "destructive",
      });
    } else {
      setSpares(data || []);
    }
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
    // First delete all existing spares
    const { error: deleteError } = await supabase
      .from("site_spares")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all rows

    if (deleteError) {
      console.error("Error clearing spares:", deleteError);
      toast({
        title: "Error",
        description: "Failed to clear existing inventory.",
        variant: "destructive",
      });
      return false;
    }

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
