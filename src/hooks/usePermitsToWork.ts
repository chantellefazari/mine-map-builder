import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PermitToWork {
  id: string;
  permit_number: string;
  permit_type: string;
  work_order_id: string | null;
  asset_number: string;
  area: string;
  location_detail: string;
  description: string;
  hazards: any[];
  controls: any[];
  ppe_required: string[];
  isolation_required: boolean;
  hot_work: boolean;
  confined_space: boolean;
  working_at_heights: boolean;
  status: string;
  issued_by: string;
  approved_by: string;
  approved_at: string | null;
  valid_from: string | null;
  valid_to: string | null;
  closed_by: string;
  closed_at: string | null;
  closure_notes: string;
  created_at: string;
  updated_at: string;
}

export function usePermitsToWork() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["permits_to_work"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("permits_to_work")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PermitToWork[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (permit: Partial<PermitToWork>) => {
      const { data, error } = await (supabase as any)
        .from("permits_to_work")
        .insert(permit)
        .select()
        .single();
      if (error) throw error;
      return data as PermitToWork;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permits_to_work"] });
      toast.success("Permit created");
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PermitToWork> }) => {
      const { error } = await (supabase as any)
        .from("permits_to_work")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permits_to_work"] });
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("permits_to_work")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permits_to_work"] });
      toast.success("Permit deleted");
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  return {
    permits: query.data ?? [],
    isLoading: query.isLoading,
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
}
