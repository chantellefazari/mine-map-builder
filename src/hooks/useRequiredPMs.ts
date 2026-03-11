import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RequiredPMRow {
  id: string;
  pm_name: string;
  discipline: string;
  frequency: string;
  equipment_type: string;
  source: string;
  notes: string;
}

export function useRequiredPMs() {
  const qc = useQueryClient();

  const { data: requiredPMs = [], isLoading } = useQuery({
    queryKey: ["required-pms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("required_pms")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as RequiredPMRow[];
    },
  });

  const addPM = useMutation({
    mutationFn: async (pm: Omit<RequiredPMRow, "id">) => {
      const { error } = await supabase.from("required_pms").insert(pm);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["required-pms"] }); toast.success("Required PM added"); },
    onError: () => toast.error("Failed to add PM"),
  });

  const addMany = useMutation({
    mutationFn: async (pms: Omit<RequiredPMRow, "id">[]) => {
      const { error } = await supabase.from("required_pms").insert(pms);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => { qc.invalidateQueries({ queryKey: ["required-pms"] }); toast.success(`${vars.length} required PMs imported`); },
    onError: () => toast.error("Failed to import PMs"),
  });

  const deletePM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("required_pms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["required-pms"] }); toast.success("Removed from required list"); },
    onError: () => toast.error("Failed to delete PM"),
  });

  return { requiredPMs, isLoading, addPM, addMany, deletePM };
}
