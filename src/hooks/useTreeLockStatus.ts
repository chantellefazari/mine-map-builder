import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns whether the Processing Plant asset tree is hard-locked.
 * When locked, bulk imports, auto-rebuilds, and overwrite operations are blocked.
 */
export function useTreeLockStatus() {
  const { data: isLocked = false, isLoading } = useQuery({
    queryKey: ["tree-lock-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_config")
        .select("config_value")
        .eq("config_key", "processing_plant_tree_locked")
        .maybeSingle();
      if (error) return false;
      return data?.config_value === "true" || data?.config_value === true;
    },
    staleTime: 5 * 60 * 1000,
  });
  return { isLocked, isLoading };
}
