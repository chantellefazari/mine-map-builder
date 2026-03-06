import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface QuoteRequest {
  id: string;
  token: string;
  spare_id: string | null;
  part_description: string;
  part_number: string;
  image_url: string;
  quantity: number;
  specifications: string;
  supplier_name: string;
  supplier_email: string;
  supplier_id: string | null;
  status: string;
  notes: string;
  created_by: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteResponse {
  id: string;
  quote_request_id: string;
  unit_price: number;
  total_price: number;
  lead_time_days: number;
  validity_days: number;
  currency: string;
  supplier_reference: string;
  notes: string;
  responded_at: string;
  created_at: string;
}

const QR_KEY = ["quote-requests"];

export function useQuoteRequests(spareId?: string) {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [...QR_KEY, spareId],
    queryFn: async (): Promise<QuoteRequest[]> => {
      let q = supabase
        .from("quote_requests" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (spareId) q = q.eq("spare_id", spareId);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as QuoteRequest[];
    },
  });

  const getResponses = async (quoteRequestId: string): Promise<QuoteResponse[]> => {
    const { data, error } = await supabase
      .from("quote_responses" as any)
      .select("*")
      .eq("quote_request_id", quoteRequestId)
      .order("responded_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as QuoteResponse[];
  };

  const sendQuoteRequest = useMutation({
    mutationFn: async (payload: {
      spare_id?: string;
      part_description: string;
      part_number?: string;
      image_url?: string;
      quantity?: number;
      specifications?: string;
      supplier_name: string;
      supplier_email: string;
      supplier_id?: string;
      created_by?: string;
      notes?: string;
    }) => {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/send-quote-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send quote request");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QR_KEY });
      toast.success(`Quote request sent to ${data.message ? "supplier" : "supplier"}`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("quote_requests" as any)
        .update({ status } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QR_KEY }),
  });

  return { quoteRequests: listQuery.data ?? [], isLoading: listQuery.isLoading, sendQuoteRequest, getResponses, updateStatus };
}
