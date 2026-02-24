import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PRLineItem {
  id?: string;
  purchase_request_id?: string;
  part_description: string;
  quantity: number;
  estimated_cost: number;
  gl_code: string;
  sort_order: number;
}

export interface PurchaseRequest {
  id: string;
  pr_number: string;
  work_order_id: string | null;
  status: string;
  supervisor_name: string;
  supervisor_user_id: string | null;
  department: string;
  supplier_id: string | null;
  supplier_name: string;
  supplier_organises_freight: boolean;
  delivery_address: string;
  required_date: string | null;
  quote_url: string;
  comments: string;
  submitted_at: string | null;
  approved_at: string | null;
  approved_by: string;
  admin_notes: string;
  freight_company: string;
  supplier_abn: string;
  payment_terms: string;
  created_at: string;
  updated_at: string;
  lines?: PRLineItem[];
}

const QUERY_KEY = ["purchase-requests"];

export function usePurchaseRequests() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<PurchaseRequest[]> => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as PurchaseRequest[];
    },
  });

  const getWithLines = async (prId: string): Promise<PurchaseRequest & { lines: PRLineItem[] }> => {
    const [prRes, linesRes] = await Promise.all([
      supabase.from("purchase_requests").select("*").eq("id", prId).single(),
      supabase.from("purchase_request_lines").select("*").eq("purchase_request_id", prId).order("sort_order"),
    ]);
    if (prRes.error) throw prRes.error;
    if (linesRes.error) throw linesRes.error;
    return { ...(prRes.data as unknown as PurchaseRequest), lines: (linesRes.data ?? []) as unknown as PRLineItem[] };
  };

  const generatePRNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc("next_pr_number");
    if (error) throw error;
    return data as string;
  };

  const createPR = useMutation({
    mutationFn: async (pr: Partial<PurchaseRequest> & { lines: PRLineItem[] }) => {
      const { lines, ...header } = pr;
      const { data, error } = await supabase
        .from("purchase_requests")
        .insert(header as any)
        .select("id")
        .single();
      if (error) throw error;
      const prId = (data as any).id;

      if (lines.length > 0) {
        const lineRows = lines.map((l, i) => ({
          purchase_request_id: prId,
          part_description: l.part_description,
          quantity: l.quantity,
          estimated_cost: l.estimated_cost,
          gl_code: l.gl_code,
          sort_order: i,
        }));
        const { error: lineErr } = await supabase.from("purchase_request_lines").insert(lineRows as any);
        if (lineErr) throw lineErr;
      }
      return prId as string;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const updatePR = useMutation({
    mutationFn: async ({ id, lines, ...fields }: Partial<PurchaseRequest> & { id: string; lines?: PRLineItem[] }) => {
      const { error } = await supabase.from("purchase_requests").update(fields as any).eq("id", id);
      if (error) throw error;

      if (lines) {
        // Delete old lines and re-insert
        await supabase.from("purchase_request_lines").delete().eq("purchase_request_id", id);
        if (lines.length > 0) {
          const lineRows = lines.map((l, i) => ({
            purchase_request_id: id,
            part_description: l.part_description,
            quantity: l.quantity,
            estimated_cost: l.estimated_cost,
            gl_code: l.gl_code,
            sort_order: i,
          }));
          const { error: lineErr } = await supabase.from("purchase_request_lines").insert(lineRows as any);
          if (lineErr) throw lineErr;
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, extra }: { id: string; status: string; extra?: Record<string, any> }) => {
      const update: any = { status, ...extra };
      if (status === "Submitted to Admin") update.submitted_at = new Date().toISOString();
      if (status === "Approved") update.approved_at = new Date().toISOString();
      const { error } = await supabase.from("purchase_requests").update(update).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const deletePR = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("purchase_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { listQuery, getWithLines, generatePRNumber, createPR, updatePR, updateStatus, deletePR };
}
