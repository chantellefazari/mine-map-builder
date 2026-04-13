import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CriticalityRating = "A" | "B" | "C";

export interface AssetCriticality {
  asset_number: string;
  criticality: CriticalityRating;
}

const CRITICALITY_ORDER: Record<string, number> = { A: 0, B: 1, C: 2 };

export const CRITICALITY_CONFIG: Record<CriticalityRating, { label: string; description: string; color: string; bgColor: string; borderColor: string; sortOrder: number }> = {
  A: { label: "A — Critical", description: "Production-critical", color: "text-destructive", bgColor: "bg-destructive/10", borderColor: "border-destructive/30", sortOrder: 0 },
  B: { label: "B — Important", description: "Reliability impact", color: "text-amber-600", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", sortOrder: 1 },
  C: { label: "C — Standard", description: "Low impact", color: "text-muted-foreground", bgColor: "bg-muted", borderColor: "border-border", sortOrder: 2 },
};

export function useAssetCriticality() {
  const { data: ratings = [], isLoading } = useQuery({
    queryKey: ["asset-criticality-ratings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("asset_criticality_ratings")
        .select("asset_number, criticality");
      if (error) throw error;
      return (data || []) as AssetCriticality[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const criticalityMap = new Map<string, CriticalityRating>();
  for (const r of ratings) {
    criticalityMap.set(r.asset_number, r.criticality as CriticalityRating);
  }

  function getCriticality(assetNumber: string): CriticalityRating | null {
    return criticalityMap.get(assetNumber) || null;
  }

  function getCriticalitySortOrder(assetNumber: string): number {
    const c = criticalityMap.get(assetNumber);
    return c ? CRITICALITY_ORDER[c] : 3; // Unrated sorts last
  }

  return { ratings, criticalityMap, getCriticality, getCriticalitySortOrder, isLoading };
}
