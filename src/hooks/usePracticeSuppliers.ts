import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Supplier, SupplierType } from "@/hooks/useSuppliers";

interface DbRow {
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
  location: string;
  is_preferred: boolean;
  abn: string;
  payment_terms: string;
  preferred_freight_company: string;
  default_delivery_address: string;
  organises_freight: boolean;
}

const toSupplier = (r: DbRow): Supplier => ({
  id: r.id, code: r.code, name: r.name, contact: r.contact,
  type: r.type as SupplierType, workPhone: r.work_phone, mobile: r.mobile,
  email: r.email, whatUsedFor: r.what_used_for, notes: r.notes,
  location: r.location, isPreferred: r.is_preferred, abn: r.abn,
  paymentTerms: r.payment_terms, preferredFreightCompany: r.preferred_freight_company,
  defaultDeliveryAddress: r.default_delivery_address, organisesFreight: r.organises_freight,
});

const toDb = (s: Omit<Supplier, "id">) => ({
  code: s.code, name: s.name, contact: s.contact, type: s.type,
  work_phone: s.workPhone, mobile: s.mobile, email: s.email,
  what_used_for: s.whatUsedFor, notes: s.notes, location: s.location || "",
  is_preferred: s.isPreferred || false, abn: s.abn || "",
  payment_terms: s.paymentTerms || "", preferred_freight_company: s.preferredFreightCompany || "",
  default_delivery_address: s.defaultDeliveryAddress || "", organises_freight: s.organisesFreight || false,
});

export const usePracticeSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any).from("practice_suppliers").select("*").order("name");
      if (error) throw error;
      setSuppliers((data as DbRow[]).map(toSupplier));
    } catch (e) {
      console.error("Error fetching practice suppliers:", e);
      toast({ title: "Error", description: "Failed to load practice suppliers", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetch(); }, [fetch]);

  const addSupplier = async (s: Omit<Supplier, "id">): Promise<boolean> => {
    try {
      const { error } = await (supabase as any).from("practice_suppliers").insert(toDb(s));
      if (error) throw error;
      await fetch();
      toast({ title: "Success", description: "Practice supplier added" });
      return true;
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to add practice supplier", variant: "destructive" });
      return false;
    }
  };

  const updateSupplier = async (s: Supplier): Promise<boolean> => {
    try {
      const { error } = await (supabase as any).from("practice_suppliers").update(toDb(s)).eq("id", s.id);
      if (error) throw error;
      await fetch();
      toast({ title: "Success", description: "Practice supplier updated" });
      return true;
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
      return false;
    }
  };

  const deleteSupplier = async (id: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any).from("practice_suppliers").delete().eq("id", id);
      if (error) throw error;
      await fetch();
      toast({ title: "Success", description: "Practice supplier deleted" });
      return true;
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      return false;
    }
  };

  const importSuppliers = async (list: Omit<Supplier, "id">[]): Promise<boolean> => {
    try {
      const rows = list.map(toDb);
      for (let i = 0; i < rows.length; i += 500) {
        const { error } = await (supabase as any).from("practice_suppliers").insert(rows.slice(i, i + 500));
        if (error) throw error;
      }
      await fetch();
      toast({ title: "Success", description: `${list.length} practice suppliers imported` });
      return true;
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to import", variant: "destructive" });
      return false;
    }
  };

  return { suppliers, isLoading, addSupplier, updateSupplier, deleteSupplier, importSuppliers, refetch: fetch };
};
