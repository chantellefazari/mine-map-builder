import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ConditionTrigger {
  id: string;
  trigger_name: string;
  asset_number: string;
  asset_name: string;
  area: string;
  trigger_type: string;
  parameter_name: string;
  threshold_value: number;
  threshold_unit: string;
  warning_threshold: number | null;
  critical_threshold: number | null;
  current_value: number;
  last_reading_date: string | null;
  reading_source: string;
  pm_template_id: string | null;
  linked_wo_id: string | null;
  frequency_hours: number | null;
  last_triggered_at: string | null;
  auto_generate_wo: boolean;
  status: string;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const TRIGGER_TYPES = ["Meter-Based", "Condition-Based", "Calendar"];
export const READING_SOURCES = ["Manual", "SCADA", "IoT Sensor", "Operator Round", "Oil Analysis Lab", "Vibration Analyser"];
export const PARAMETER_UNITS = ["hours", "km", "mm/s", "°C", "bar", "ppm", "μm", "mg/L", "cycles", "%"];

export function useConditionTriggers() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["condition_triggers"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("condition_triggers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ConditionTrigger[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (trigger: Partial<ConditionTrigger>) => {
      const { data, error } = await (supabase as any)
        .from("condition_triggers")
        .insert(trigger)
        .select()
        .single();
      if (error) throw error;
      return data as ConditionTrigger;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["condition_triggers"] });
      toast.success("Trigger created");
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ConditionTrigger> }) => {
      const { error } = await (supabase as any)
        .from("condition_triggers")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["condition_triggers"] });
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("condition_triggers")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["condition_triggers"] });
      toast.success("Trigger deleted");
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  return {
    triggers: query.data ?? [],
    isLoading: query.isLoading,
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
}
