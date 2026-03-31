import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ShutdownPersonnel {
  id: string;
  vendor_id: string;
  shutdown_id: string;
  name: string;
  trade: string;
  role: string;
  phone: string;
  notes: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export const TRADES = [
  "Mechanical Fitter",
  "Boilermaker",
  "Welder",
  "Electrician",
  "Instrument Tech",
  "Rigger",
  "Crane Operator",
  "Scaffolder",
  "Plumber",
  "Millwright",
  "Supervisor",
  "General Hand",
] as const;

export function useShutdownPersonnel(shutdownId: string | null) {
  const queryClient = useQueryClient();

  const personnel = useQuery({
    queryKey: ["shutdown_personnel", shutdownId],
    enabled: !!shutdownId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shutdown_personnel")
        .select("*")
        .eq("shutdown_id", shutdownId)
        .order("name");
      if (error) throw error;
      return data as ShutdownPersonnel[];
    },
  });

  const addPerson = useMutation({
    mutationFn: async (values: Partial<ShutdownPersonnel> & { vendor_id: string; shutdown_id: string; name: string; trade: string }) => {
      const { data, error } = await (supabase as any)
        .from("shutdown_personnel")
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shutdown_personnel", shutdownId] });
      toast.success("Personnel added");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updatePerson = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ShutdownPersonnel> }) => {
      const { error } = await (supabase as any)
        .from("shutdown_personnel")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shutdown_personnel", shutdownId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const removePerson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("shutdown_personnel")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shutdown_personnel", shutdownId] });
      toast.success("Personnel removed");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return {
    personnel: personnel.data ?? [],
    isLoading: personnel.isLoading,
    addPerson,
    updatePerson,
    removePerson,
  };
}
