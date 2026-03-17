import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PlantRule {
  id: string;
  rule_id: string;
  title: string;
  area: string;
  asset: string;
  related_asset: string;
  rule_type: string;
  impact_level: string;
  applies_to: string;
  if_condition: string;
  then_action: string;
  because_reason: string;
  description: string;
  requires_isolation: boolean;
  requires_permit: boolean;
  requires_shutdown: boolean;
  requires_scaffold: boolean;
  requires_crane: boolean;
  status: string;
  added_by: string;
  voice_transcript: string;
  created_at: string;
  updated_at: string;
}

export type PlantRuleInsert = Omit<PlantRule, "id" | "created_at" | "updated_at">;

export const RULE_TYPES = [
  "Dependency", "Interaction", "Access Constraint", "Isolation Rule",
  "Safety Constraint", "Sequence Rule", "Shutdown Logic",
  "Operational Note", "Lessons Learned", "Area Specific Rule", "Asset Specific Rule",
] as const;

export const IMPACT_LEVELS = ["Low", "Medium", "High", "Critical"] as const;
export const STATUSES = ["Draft", "Pending Review", "Approved", "Archived"] as const;

export function usePlantIntelligence() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const rulesQuery = useQuery({
    queryKey: ["plant-intelligence-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plant_intelligence_rules")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PlantRule[];
    },
  });

  const addRule = useMutation({
    mutationFn: async (rule: Partial<PlantRuleInsert>) => {
      const { error } = await supabase
        .from("plant_intelligence_rules")
        .insert(rule as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plant-intelligence-rules"] });
      toast({ title: "Rule saved" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateRule = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<PlantRule>) => {
      const { error } = await supabase
        .from("plant_intelligence_rules")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plant-intelligence-rules"] });
      toast({ title: "Rule updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return { rules: rulesQuery.data ?? [], isLoading: rulesQuery.isLoading, addRule, updateRule };
}
