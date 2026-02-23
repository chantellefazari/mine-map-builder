import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface POLineItem {
  id?: string;
  po_tracker_id?: string;
  part_description: string;
  part_number: string;
  quantity_ordered: number;
  unit_price: number;
  received_qty: number;
  notes: string;
}

export interface POTrackerItem {
  id: string;
  po_number: string;
  work_order_id: string | null;
  supplier: string;
  order_date: string | null;
  eta: string | null;
  status: string;
  confirmed_on_site: boolean;
  date_received: string | null;
  comments: string;
  created_at: string;
  updated_at: string;
  wo_number?: string;
  lines?: POLineItem[];
}

export function usePOTracker(workOrderId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["po_tracker", workOrderId],
    queryFn: async () => {
      let q = (supabase as any)
        .from("po_tracker")
        .select("*, work_orders(wo_number), po_tracker_lines(*)")
        .order("created_at", { ascending: false });

      if (workOrderId) {
        q = q.eq("work_order_id", workOrderId);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data as any[]).map((row) => ({
        ...row,
        wo_number: row.work_orders?.wo_number ?? null,
        lines: row.po_tracker_lines ?? [],
        work_orders: undefined,
        po_tracker_lines: undefined,
      })) as POTrackerItem[];
    },
  });

  const allocateMutation = useMutation({
    mutationFn: async (payload: {
      work_order_id?: string | null;
      supplier: string;
      order_date?: string | null;
      eta?: string | null;
      status: string;
      confirmed_on_site: boolean;
      date_received?: string | null;
      comments: string;
      lines: POLineItem[];
    }) => {
      // Get next PO number
      const { data: nextNum, error: nextErr } = await (supabase as any).rpc("next_po_number");
      if (nextErr) throw nextErr;

      const poNumber = nextNum as string;
      const { lines, ...header } = payload;

      const { data: po, error: insertErr } = await (supabase as any)
        .from("po_tracker")
        .insert({ ...header, po_number: poNumber })
        .select()
        .single();
      if (insertErr) throw insertErr;

      if (lines.length > 0) {
        const lineRows = lines.map((l) => ({ ...l, po_tracker_id: po.id }));
        const { error: lineErr } = await (supabase as any)
          .from("po_tracker_lines")
          .insert(lineRows);
        if (lineErr) throw lineErr;
      }

      return po as POTrackerItem;
    },
    onSuccess: (po) => {
      queryClient.invalidateQueries({ queryKey: ["po_tracker"] });
      toast.success(`${po.po_number} created`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      work_order_id?: string | null;
      supplier: string;
      order_date?: string | null;
      eta?: string | null;
      status: string;
      confirmed_on_site: boolean;
      date_received?: string | null;
      comments: string;
      lines: POLineItem[];
    }) => {
      const { lines, id, ...header } = payload;
      const { error } = await (supabase as any)
        .from("po_tracker")
        .update(header)
        .eq("id", id);
      if (error) throw error;

      // Replace all lines
      await (supabase as any).from("po_tracker_lines").delete().eq("po_tracker_id", id);
      if (lines.length > 0) {
        const lineRows = lines.map((l) => ({
          part_description: l.part_description,
          part_number: l.part_number,
          quantity_ordered: l.quantity_ordered,
          unit_price: l.unit_price,
          received_qty: l.received_qty,
          notes: l.notes,
          po_tracker_id: id,
        }));
        const { error: lineErr } = await (supabase as any)
          .from("po_tracker_lines")
          .insert(lineRows);
        if (lineErr) throw lineErr;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["po_tracker"] });
      toast.success("PO updated");
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
    allocate: allocateMutation,
    update: updateMutation,
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
