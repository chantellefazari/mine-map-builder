import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WorkRequest {
  id: string;
  wr_number: string;
  status: string;
  priority: string;
  work_type: string;
  asset_id: string;
  functional_location: string;
  problem_description: string;
  scope_of_works: string;
  requested_by: string;
  trade: string;
  date_raised: string;
  linked_wo_id: string | null;
  approved_by: string;
  approved_at: string | null;
  isolation_required: boolean;
  from_hazard_id: boolean;
  photo_urls: string[];
  created_at: string;
  updated_at: string;
}

export function useWorkRequests() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["work_requests"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("work_requests")
        .select("*")
        .order("wr_number", { ascending: true });
      if (error) throw error;
      return data as WorkRequest[];
    },
  });

  const allocateMutation = useMutation({
    mutationFn: async () => {
      const { data: nextData, error: nextError } = await (supabase as any).rpc("next_wr_number");
      if (nextError) throw nextError;
      const wrNumber = nextData as string;
      const { data, error } = await (supabase as any)
        .from("work_requests")
        .insert({ wr_number: wrNumber })
        .select()
        .single();
      if (error) throw error;
      return data as WorkRequest;
    },
    onSuccess: (wr) => {
      queryClient.invalidateQueries({ queryKey: ["work_requests"] });
      toast.success(`Work Request ${wr.wr_number} created`);
    },
    onError: (err: any) => {
      toast.error(`Failed to create WR: ${err.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; updates: Partial<WorkRequest> }) => {
      const { error } = await (supabase as any)
        .from("work_requests")
        .update(payload.updates)
        .eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work_requests"] });
    },
    onError: (err: any) => {
      toast.error(`Failed to update WR: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("work_requests")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work_requests"] });
      toast.success("Work request deleted");
    },
    onError: (err: any) => {
      toast.error(`Failed to delete WR: ${err.message}`);
    },
  });

  const convertToWOMutation = useMutation({
    mutationFn: async ({ wrId, woType }: { wrId: string; woType: string }) => {
      const { data: wr, error: wrErr } = await (supabase as any)
        .from("work_requests")
        .select("*")
        .eq("id", wrId)
        .single();
      if (wrErr) throw wrErr;

      const { data: woNum, error: woNumErr } = await (supabase as any).rpc("next_wo_number");
      if (woNumErr) throw woNumErr;

      const { data: wo, error: woErr } = await (supabase as any)
        .from("work_orders")
        .insert({
          wo_number: woNum,
          asset_id: wr.asset_id,
          functional_location: wr.functional_location,
          problem_description: wr.problem_description,
          scope_of_works: wr.scope_of_works || "[]",
          priority: wr.priority,
          work_type: woType,
          requested_by: wr.requested_by,
          trade: wr.trade,
          required_tooling: '[""]',
        })
        .select()
        .single();
      if (woErr) throw woErr;

      await (supabase as any)
        .from("work_requests")
        .update({ linked_wo_id: wo.id, status: "Converted to WO" })
        .eq("id", wrId);

      return { wr, wo };
    },
    onSuccess: ({ wo }) => {
      queryClient.invalidateQueries({ queryKey: ["work_requests"] });
      queryClient.invalidateQueries({ queryKey: ["work_orders"] });
      toast.success(`Converted to Work Order ${wo.wo_number}`);
    },
    onError: (err: any) => {
      toast.error(`Failed to convert: ${err.message}`);
    },
  });

  return {
    workRequests: query.data ?? [],
    isLoading: query.isLoading,
    allocate: allocateMutation,
    update: updateMutation,
    remove: deleteMutation,
    convertToWO: convertToWOMutation,
  };
}
