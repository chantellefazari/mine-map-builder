import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type PriorityTag = "Critical" | "Medium" | "Non-critical";

export interface CatalogueItem {
  id: string;
  supplierId: string | null;
  supplierName: string;
  oemBrand: string;
  componentType: string;
  componentDescription: string;
  oemPartNumber: string;
  alternatePartNumbers: string;
  notes: string;
  priorityTag: PriorityTag;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface DbCatalogueItem {
  id: string;
  supplier_id: string | null;
  supplier_name: string;
  oem_brand: string;
  component_type: string;
  component_description: string;
  oem_part_number: string;
  alternate_part_numbers: string;
  notes: string;
  priority_tag: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

const mapDbToCatalogueItem = (row: DbCatalogueItem): CatalogueItem => ({
  id: row.id,
  supplierId: row.supplier_id,
  supplierName: row.supplier_name,
  oemBrand: row.oem_brand,
  componentType: row.component_type,
  componentDescription: row.component_description,
  oemPartNumber: row.oem_part_number,
  alternatePartNumbers: row.alternate_part_numbers,
  notes: row.notes,
  priorityTag: row.priority_tag as PriorityTag,
  imageUrl: row.image_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapCatalogueItemToDb = (item: Omit<CatalogueItem, "id" | "createdAt" | "updatedAt">) => ({
  supplier_id: item.supplierId,
  supplier_name: item.supplierName,
  oem_brand: item.oemBrand,
  component_type: item.componentType,
  component_description: item.componentDescription,
  oem_part_number: item.oemPartNumber,
  alternate_part_numbers: item.alternatePartNumbers,
  notes: item.notes,
  priority_tag: item.priorityTag,
  image_url: item.imageUrl,
});

export const useSupplierCatalogue = () => {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("supplier_catalogue")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = (data as DbCatalogueItem[]).map(mapDbToCatalogueItem);
      setItems(mapped);
    } catch (error) {
      console.error("Error fetching catalogue items:", error);
      toast({
        title: "Error",
        description: "Failed to load catalogue items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (newItem: Omit<CatalogueItem, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("supplier_catalogue")
        .insert(mapCatalogueItemToDb(newItem));

      if (error) throw error;

      await fetchItems();
      toast({
        title: "Success",
        description: "Catalogue item added successfully",
      });
      return true;
    } catch (error) {
      console.error("Error adding catalogue item:", error);
      toast({
        title: "Error",
        description: "Failed to add catalogue item",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateItem = async (item: CatalogueItem): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("supplier_catalogue")
        .update(mapCatalogueItemToDb(item))
        .eq("id", item.id);

      if (error) throw error;

      await fetchItems();
      toast({
        title: "Success",
        description: "Catalogue item updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating catalogue item:", error);
      toast({
        title: "Error",
        description: "Failed to update catalogue item",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("supplier_catalogue").delete().eq("id", id);

      if (error) throw error;

      await fetchItems();
      toast({
        title: "Success",
        description: "Catalogue item deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting catalogue item:", error);
      toast({
        title: "Error",
        description: "Failed to delete catalogue item",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
};

export const componentTypes = [
  "Motor",
  "Gearbox",
  "Bearing",
  "Pump",
  "Valve",
  "Roller",
  "Belt",
  "Coupling",
  "Seal",
  "Filter",
  "Instrumentation",
  "Electrical",
  "Hydraulic",
  "Pneumatic",
  "Structural",
  "Other",
];

export const priorityTags: PriorityTag[] = ["Critical", "Medium", "Non-critical"];
