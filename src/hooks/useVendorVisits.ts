import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VendorVisit {
  id: string;
  vendor_name: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  visit_date: string;
  visit_end_date: string | null;
  purpose: string;
  forms_required: string[];
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type VendorVisitInsert = Omit<VendorVisit, "id" | "created_at" | "updated_at">;

const FORM_OPTIONS = [
  "Service Report",
  "JSEA / SWMS",
  "Take 5",
  "Permit to Work",
  "Hot Work Permit",
  "Confined Space Permit",
  "Isolation Permit",
  "Site Induction Sign-off",
  "Toolbox Talk Record",
  "Equipment Inspection",
] as const;

export const VENDOR_FORM_OPTIONS = FORM_OPTIONS;

export function useVendorVisits() {
  const qc = useQueryClient();
  const key = ["vendor_visits"];

  const { data: visits = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("vendor_visits")
        .select("*")
        .order("visit_date", { ascending: true });
      if (error) throw error;
      return data as VendorVisit[];
    },
  });

  const addVisit = useMutation({
    mutationFn: async (visit: VendorVisitInsert) => {
      const { error } = await (supabase as any).from("vendor_visits").insert(visit);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Vendor visit scheduled"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateVisit = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<VendorVisit> }) => {
      const { error } = await (supabase as any).from("vendor_visits").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Visit updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteVisit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("vendor_visits").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Visit removed"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { visits, isLoading, addVisit, updateVisit, deleteVisit };
}
