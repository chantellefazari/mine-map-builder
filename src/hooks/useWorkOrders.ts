import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WorkOrder {
  id: string;
  wo_number: string;
  status: string;
  priority: string;
  work_type: string;
  asset_id: string;
  functional_location: string;
  problem_description: string;
  work_performed: string;
  scope_of_works: string;
  parts_used: string;
  trade: string;
  requested_by: string;
  assigned_to: string;
  date_raised: string;
  date_completed: string | null;
  returned_to_service: string;
  technician_name: string;
  technician_sign_date: string;
  supervisor_name: string;
  supervisor_sign_date: string;
  operations_handover_name: string;
  operations_handover_date: string;
  labour_hours: any;
  photo_urls: string[];
  scheduled_date: string | null;
  job_status: string;
  wo_return_status: string;
  created_at: string;
  updated_at: string;
}

export function useWorkOrders() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["work_orders"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("work_orders")
        .select("*")
        .order("wo_number", { ascending: true });
      if (error) throw error;
      return data as WorkOrder[];
    },
  });

  const allocateMutation = useMutation({
    mutationFn: async () => {
      const { data: nextData, error: nextError } = await (supabase as any).rpc("next_wo_number");
      if (nextError) throw nextError;
      const woNumber = nextData as string;
      const { data, error } = await (supabase as any)
        .from("work_orders")
        .insert({ wo_number: woNumber, required_tooling: '[""]' })
        .select()
        .single();
      if (error) throw error;
      return data as WorkOrder;
    },
    onSuccess: (wo) => {
      queryClient.invalidateQueries({ queryKey: ["work_orders"] });
      toast.success(`Work Order ${wo.wo_number} allocated`);
    },
    onError: (err: any) => {
      toast.error(`Failed to allocate WO: ${err.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; updates: Partial<WorkOrder> }) => {
      const { error } = await (supabase as any)
        .from("work_orders")
        .update(payload.updates)
        .eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work_orders"] });
    },
    onError: (err: any) => {
      toast.error(`Failed to update WO: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("work_orders")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work_orders"] });
      toast.success("Work order deleted");
    },
    onError: (err: any) => {
      toast.error(`Failed to delete WO: ${err.message}`);
    },
  });

  return { workOrders: query.data ?? [], isLoading: query.isLoading, allocate: allocateMutation, update: updateMutation, remove: deleteMutation };
}
