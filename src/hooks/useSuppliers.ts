import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type SupplierType = "OEM" | "Critical Spares Supplier" | "Trade / General Supplier" | "Service Provider";

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contact: string;
  type: SupplierType;
  workPhone: string;
  mobile: string;
  email: string;
  whatUsedFor: string;
  notes: string;
}

interface DbSupplier {
  id: string;
  code: string;
  name: string;
  contact: string;
  type: string;
  work_phone: string;
  mobile: string;
  email: string;
  what_used_for: string;
  notes: string;
}

const mapDbToSupplier = (row: DbSupplier): Supplier => ({
  id: row.id,
  code: row.code,
  name: row.name,
  contact: row.contact,
  type: row.type as SupplierType,
  workPhone: row.work_phone,
  mobile: row.mobile,
  email: row.email,
  whatUsedFor: row.what_used_for,
  notes: row.notes,
});

const mapSupplierToDb = (supplier: Omit<Supplier, "id">) => ({
  code: supplier.code,
  name: supplier.name,
  contact: supplier.contact,
  type: supplier.type,
  work_phone: supplier.workPhone,
  mobile: supplier.mobile,
  email: supplier.email,
  what_used_for: supplier.whatUsedFor,
  notes: supplier.notes,
});

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name");

      if (error) throw error;

      const mapped = (data as DbSupplier[]).map(mapDbToSupplier);
      setSuppliers(mapped);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const addSupplier = async (newSupplier: Omit<Supplier, "id">): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("suppliers")
        .insert(mapSupplierToDb(newSupplier));

      if (error) throw error;

      await fetchSuppliers();
      toast({
        title: "Success",
        description: "Supplier added successfully",
      });
      return true;
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast({
        title: "Error",
        description: "Failed to add supplier",
        variant: "destructive",
      });
      return false;
    }
  };

  const importSuppliers = async (newSuppliers: Omit<Supplier, "id">[]): Promise<boolean> => {
    try {
      const dbRecords = newSuppliers.map(mapSupplierToDb);
      
      // Insert in batches of 500
      const batchSize = 500;
      for (let i = 0; i < dbRecords.length; i += batchSize) {
        const batch = dbRecords.slice(i, i + batchSize);
        const { error } = await supabase.from("suppliers").insert(batch);
        if (error) throw error;
      }

      await fetchSuppliers();
      toast({
        title: "Success",
        description: `${newSuppliers.length} suppliers imported successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error importing suppliers:", error);
      toast({
        title: "Error",
        description: "Failed to import suppliers",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSupplier = async (supplier: Supplier): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("suppliers")
        .update(mapSupplierToDb(supplier))
        .eq("id", supplier.id);

      if (error) throw error;

      await fetchSuppliers();
      toast({
        title: "Success",
        description: "Supplier updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast({
        title: "Error",
        description: "Failed to update supplier",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteSupplier = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("suppliers").delete().eq("id", id);

      if (error) throw error;

      await fetchSuppliers();
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    suppliers,
    isLoading,
    addSupplier,
    importSuppliers,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers,
  };
};

export const supplierTypes: SupplierType[] = [
  "OEM",
  "Critical Spares Supplier",
  "Trade / General Supplier",
  "Service Provider",
];
