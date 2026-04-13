import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FailureRecord {
  id: string;
  work_order_id: string | null;
  asset_number: string;
  asset_name: string;
  area: string;
  failure_date: string;
  failure_mode: string;
  failure_cause: string;
  failure_remedy: string;
  failure_class: string;
  severity: string;
  downtime_hours: number;
  component_failed: string;
  detected_by: string;
  detection_method: string;
  root_cause_category: string;
  corrective_action: string;
  preventive_action: string;
  is_recurring: boolean;
  notes: string;
  reported_by: string;
  created_at: string;
  updated_at: string;
}

export const FAILURE_MODES = [
  "Wear", "Fatigue", "Corrosion", "Erosion", "Overheating", "Vibration",
  "Leaking", "Blockage", "Electrical Fault", "Instrument Drift",
  "Bearing Failure", "Seal Failure", "Misalignment", "Contamination",
  "Material Defect", "Other",
];

export const FAILURE_CAUSES = [
  "Normal Wear", "Lack of Lubrication", "Overloading", "Poor Maintenance",
  "Design Deficiency", "Incorrect Installation", "Operator Error",
  "Environmental", "Age/Deterioration", "Foreign Object Damage",
  "Electrical Supply", "Vibration Damage", "Chemical Attack", "Unknown",
];

export const FAILURE_REMEDIES = [
  "Replace Component", "Repair In-Situ", "Overhaul", "Realignment",
  "Relubricate", "Clean/Flush", "Recalibrate", "Rewire/Reconnect",
  "Adjust Settings", "Full Replacement", "Temporary Repair", "No Action Required",
];

export const SEVERITY_LEVELS = ["Critical", "Major", "Minor", "Negligible"];

export const DETECTION_METHODS = [
  "Visual Inspection", "Vibration Analysis", "Thermography", "Oil Analysis",
  "Ultrasonic", "Operator Report", "Alarm/Trip", "Routine PM", "Breakdown",
];

export const ROOT_CAUSE_CATEGORIES = [
  "Mechanical", "Electrical", "Instrumentation", "Process",
  "Human Error", "Design", "External/Environmental", "Unknown",
];

export function useFailureRecords() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["failure_records"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("failure_records")
        .select("*")
        .order("failure_date", { ascending: false });
      if (error) throw error;
      return data as FailureRecord[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (record: Partial<FailureRecord>) => {
      const { data, error } = await (supabase as any)
        .from("failure_records")
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      return data as FailureRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["failure_records"] });
      toast.success("Failure record created");
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FailureRecord> }) => {
      const { error } = await (supabase as any)
        .from("failure_records")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["failure_records"] });
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("failure_records")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["failure_records"] });
      toast.success("Failure record deleted");
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  return {
    records: query.data ?? [],
    isLoading: query.isLoading,
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
}
