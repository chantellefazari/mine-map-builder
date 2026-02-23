import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WorkOrderPart {
  id: string;
  work_order_id: string;
  part_description: string;
  part_number: string;
  quantity_required: number;
  status: string;
  location: string;
  comment: string;
  last_updated_by: string;
  last_updated_date: string;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderPartAudit {
  id: string;
  work_order_part_id: string;
  work_order_id: string;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  changed_by: string;
  changed_at: string;
}

const PART_STATUSES = ["Not Ordered", "Ordered", "On Site", "In Laydown Yard", "Installed"] as const;
export { PART_STATUSES };

export function useWorkOrderParts(workOrderId?: string) {
  const queryClient = useQueryClient();

  const partsQuery = useQuery({
    queryKey: ["work_order_parts", workOrderId],
    enabled: !!workOrderId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("work_order_parts")
        .select("*")
        .eq("work_order_id", workOrderId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as WorkOrderPart[];
    },
  });

  const auditQuery = useQuery({
    queryKey: ["work_order_parts_audit", workOrderId],
    enabled: !!workOrderId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("work_order_parts_audit")
        .select("*")
        .eq("work_order_id", workOrderId)
        .order("changed_at", { ascending: false });
      if (error) throw error;
      return data as WorkOrderPartAudit[];
    },
  });

  const addPart = useMutation({
    mutationFn: async (part: Partial<WorkOrderPart> & { work_order_id: string }) => {
      const { data, error } = await (supabase as any)
        .from("work_order_parts")
        .insert(part)
        .select()
        .single();
      if (error) throw error;
      return data as WorkOrderPart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work_order_parts", workOrderId] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updatePart = useMutation({
    mutationFn: async (payload: { id: string; updates: Partial<WorkOrderPart> }) => {
      const { error } = await (supabase as any)
        .from("work_order_parts")
        .update(payload.updates)
        .eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work_order_parts", workOrderId] });
      queryClient.invalidateQueries({ queryKey: ["work_order_parts_audit", workOrderId] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deletePart = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("work_order_parts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work_order_parts", workOrderId] });
      queryClient.invalidateQueries({ queryKey: ["work_order_parts_audit", workOrderId] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return {
    parts: partsQuery.data ?? [],
    auditLog: auditQuery.data ?? [],
    isLoading: partsQuery.isLoading,
    addPart,
    updatePart,
    deletePart,
  };
}

export function computeWOPartsStatus(parts: WorkOrderPart[]): string {
  if (parts.length === 0) return "N/A";
  if (parts.some((p) => p.status === "Not Ordered")) return "PO Required";
  if (parts.some((p) => p.status === "Ordered")) return "Awaiting Parts";
  if (parts.every((p) => p.status === "Installed")) return "Complete";
  if (parts.every((p) => p.status === "On Site" || p.status === "In Laydown Yard")) return "Parts Ready";
  return "Awaiting Parts";
}

export function computeReadyToExecute(partsRequired: boolean, parts: WorkOrderPart[]): boolean {
  if (!partsRequired) return true;
  if (parts.length === 0) return false;
  return parts.every((p) => p.status === "On Site" || p.status === "In Laydown Yard");
}
