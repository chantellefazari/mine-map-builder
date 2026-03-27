import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRIORITIES, WR_PRIORITIES, WO_PRIORITIES } from "@/constants/priorities";

interface PriorityItem {
  value: string;
  label: string;
  timeframe: string;
}

interface PriorityConfig {
  priorities: PriorityItem[];
  wr_priorities: string[];
  wo_priorities: string[];
  default_priority: string;
  locked: boolean;
}

/**
 * Loads the hard-locked priority system from site_config (backend source of truth).
 * Falls back to code constants if DB is unreachable.
 */
export function usePriorityConfig() {
  const { data, isLoading } = useQuery({
    queryKey: ["site-config", "priority_system"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_config")
        .select("config_value")
        .eq("config_key", "priority_system")
        .maybeSingle();

      if (error || !data) return null;
      return data.config_value as unknown as PriorityConfig;
    },
    staleTime: 10 * 60 * 1000, // 10 min — config rarely changes
  });

  // DB-driven values with code fallback
  const allPriorities: PriorityItem[] = data?.priorities ?? PRIORITIES.map(p => ({ ...p }));
  const wrPriorityValues: string[] = data?.wr_priorities ?? WR_PRIORITIES.map(p => p.value);
  const woPriorityValues: string[] = data?.wo_priorities ?? WO_PRIORITIES.map(p => p.value);
  const defaultPriority: string = data?.default_priority ?? "P3 - Medium";

  // Filter full priority objects for WR and WO contexts
  const wrPriorities = allPriorities.filter(p => wrPriorityValues.includes(p.value));
  const woPriorities = allPriorities.filter(p => woPriorityValues.includes(p.value));

  return {
    allPriorities,
    wrPriorities,
    woPriorities,
    wrPriorityValues,
    woPriorityValues,
    defaultPriority,
    isLocked: data?.locked ?? true,
    isLoading,
  };
}
