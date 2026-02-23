import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface POTrackerItem {
  id: string;
  po_number: string;
  work_order_id: string | null;
  supplier: string;
  part_description: string;
  part_number: string;
  quantity_ordered: number;
  order_date: string | null;
  eta: string | null;
  status: string;
  confirmed_on_site: boolean;
  date_received: string | null;
  comments: string;
  created_at: string;
  updated_at: string;
  // joined
  wo_number?: string;
}

export function usePOTracker(workOrderId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["po_tracker", workOrderId],
    queryFn: async () => {
      let q = (supabase as any)
        .from("po_tracker")
        .select("*, work_orders(wo_number)")
        .order("created_at", { ascending: false });

      if (workOrderId) {
        q = q.eq("work_order_id", workOrderId);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data as any[]).map((row) => ({
        ...row,
        wo_number: row.work_orders?.wo_number ?? null,
        work_orders: undefined,
      })) as POTrackerItem[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (item: Partial<POTrackerItem> & { po_number: string }) => {
      const { wo_number, ...payload } = item as any;
      if (payload.id) {
        const { error } = await (supabase as any)
          .from("po_tracker")
          .update(payload)
          .eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("po_tracker")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["po_tracker"] });
      toast.success("PO saved");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("po_tracker").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["po_tracker"] });
      toast.success("PO deleted");
    },
    onError: (err: any) => toast.error(err.message),
  });

  return {
    poItems: query.data ?? [],
    isLoading: query.isLoading,
    upsert: upsertMutation,
    remove: deleteMutation,
  };
}

export function computePartsStatus(
  partsRequired: boolean,
  linkedPOs: POTrackerItem[]
): string {
  if (!partsRequired) return "N/A";
  if (linkedPOs.length === 0) return "PO Not Raised";
  if (linkedPOs.every((po) => po.confirmed_on_site)) return "Parts On Site";
  if (linkedPOs.some((po) => po.status === "In Transit")) return "In Transit";
  if (linkedPOs.some((po) => po.status === "Ordered")) return "Awaiting Delivery";
  if (linkedPOs.some((po) => po.status === "Partially Received")) return "Partially Received";
  return "Awaiting Delivery";
}
