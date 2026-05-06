import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ALL_FREQS, effectiveRegime, type Regime } from "@/utils/pmRequirementRules";

/**
 * Pulls the PM Requirements Matrix (pm_requirement_recommendations) and rolls
 * it up into "how many assets actually NEED each PM type". This becomes the
 * denominator for PM Coverage in the Foundation audit — so a gap means
 * "required but not built", not "total assets minus built".
 */
export interface PMRequirementsSummary {
  totalRecommended: number;        // assets in matrix
  requireAny: number;              // any enabled freq
  requireOnline: number;           // any enabled Online freq
  requireOffline: number;          // any enabled Offline freq (non-shutdown)
  requireShutdown: number;         // 52W or 26W Offline = shutdown class
  classified: number;              // equipment_class !== 'Other'
  approved: number;
  loading: boolean;
}

const SHUTDOWN_FREQS = new Set(["26W", "52W"]);

export function usePMRequirementsSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ["pm-requirements-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pm_requirement_recommendations")
        .select("equipment_class, recommended_regime, overrides, approved");
      if (error) throw error;
      return data || [];
    },
  });

  let totalRecommended = 0, requireAny = 0, requireOnline = 0,
      requireOffline = 0, requireShutdown = 0, classified = 0, approved = 0;

  for (const row of data || []) {
    totalRecommended++;
    if ((row as any).equipment_class && (row as any).equipment_class !== "Other") classified++;
    if ((row as any).approved) approved++;
    const regime = effectiveRegime(
      (row as any).recommended_regime as Regime,
      (row as any).overrides as Partial<Regime> | null
    );
    let any = false, online = false, offline = false, shutdown = false;
    for (const f of ALL_FREQS) {
      const e = regime[f];
      if (!e?.enabled) continue;
      any = true;
      if (e.duty === "Online") online = true;
      else {
        if (SHUTDOWN_FREQS.has(f)) shutdown = true;
        else offline = true;
      }
    }
    if (any) requireAny++;
    if (online) requireOnline++;
    if (offline) requireOffline++;
    if (shutdown) requireShutdown++;
  }

  return {
    totalRecommended, requireAny, requireOnline,
    requireOffline, requireShutdown, classified, approved,
    loading: isLoading,
  } as PMRequirementsSummary;
}
