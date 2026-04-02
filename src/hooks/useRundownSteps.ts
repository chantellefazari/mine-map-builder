import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RundownStep {
  id: string;
  shutdown_id: string;
  phase: "run-down" | "run-up";
  step_description: string;
  sort_order: number;
  duration_hours: number;
  responsible: string;
  status: string;
  notes: string;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export function useRundownSteps(shutdownId: string | null) {
  const queryClient = useQueryClient();
  const qk = ["shutdown_rundown_steps", shutdownId];

  const { data, isLoading } = useQuery({
    queryKey: qk,
    enabled: !!shutdownId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shutdown_rundown_steps")
        .select("*")
        .eq("shutdown_id", shutdownId)
        .order("phase")
        .order("sort_order");
      if (error) throw error;
      return data as RundownStep[];
    },
  });

  const rundownSteps = (data || []).filter(s => s.phase === "run-down");
  const runupSteps = (data || []).filter(s => s.phase === "run-up");

  const addStep = useMutation({
    mutationFn: async (values: { shutdown_id: string; phase: string; step_description: string; sort_order?: number; duration_hours?: number; responsible?: string }) => {
      const { data, error } = await (supabase as any)
        .from("shutdown_rundown_steps")
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
    onError: (e: any) => toast.error(e.message),
  });

  const updateStep = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RundownStep> }) => {
      const { error } = await (supabase as any)
        .from("shutdown_rundown_steps")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
    onError: (e: any) => toast.error(e.message),
  });

  const removeStep = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("shutdown_rundown_steps")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
    onError: (e: any) => toast.error(e.message),
  });

  return { rundownSteps, runupSteps, allSteps: data || [], isLoading, addStep, updateStep, removeStep };
}
