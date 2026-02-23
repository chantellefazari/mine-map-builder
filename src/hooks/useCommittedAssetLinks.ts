import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CommittedLink {
  pm_template_name: string;
  pm_equipment_ref: string;
  matched_asset_id: string;
  matched_asset_name: string;
}

/**
 * Fetches all committed PM-to-Asset links from the staging table.
 * Returns a lookup function to get asset number by equipment type.
 */
export function useCommittedAssetLinks() {
  const { data: links = [] } = useQuery({
    queryKey: ["committed-asset-links"],
    queryFn: async (): Promise<CommittedLink[]> => {
      const { data, error } = await supabase
        .from("pm_asset_link_staging")
        .select("pm_template_name, pm_equipment_ref, matched_asset_id, matched_asset_name")
        .eq("committed", true);
      if (error) throw error;
      return (data ?? []) as CommittedLink[];
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  /** Look up asset number by equipment type (case-insensitive) */
  const getAssetNumber = (equipmentType: string): string => {
    const match = links.find(
      (l) => l.pm_equipment_ref.toLowerCase() === equipmentType.toLowerCase()
    );
    return match?.matched_asset_id ?? "";
  };

  /** Look up by PM template name (case-insensitive) */
  const getAssetNumberByPMName = (pmName: string): string => {
    const match = links.find(
      (l) => l.pm_template_name.toLowerCase() === pmName.toLowerCase()
    );
    return match?.matched_asset_id ?? "";
  };

  return { links, getAssetNumber, getAssetNumberByPMName };
}
