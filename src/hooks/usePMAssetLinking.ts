import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePMasterList } from "./usePMData";
import { flattenAssetTree, FlatAsset } from "@/utils/flattenAssetTree";
import { matchPMToAsset } from "@/utils/pmAssetMatching";
import { useMemo } from "react";

export interface StagingRow {
  id: string;
  pm_template_id: string;
  pm_template_name: string;
  pm_frequency: string;
  pm_equipment_ref: string;
  current_linked_asset: string;
  asset_match_key: string;
  matched_asset_id: string;
  matched_asset_name: string;
  matched_asset_area: string;
  matched_asset_parent: string;
  match_confidence: "Exact" | "Keyword" | "Multiple" | "None";
  validation_status: "Pending" | "Confirmed" | "Manual Review Required";
  committed: boolean;
  committed_at: string | null;
  committed_by: string | null;
  created_at: string;
  updated_at: string;
}

const QUERY_KEY = ["pm-asset-link-staging"];

export function usePMAssetLinking() {
  const queryClient = useQueryClient();
  const { pms } = usePMasterList();
  const assets = useMemo(() => flattenAssetTree(), []);

  // Fetch staging rows
  const stagingQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<StagingRow[]> => {
      const { data, error } = await supabase
        .from("pm_asset_link_staging" as any)
        .select("*")
        .order("pm_template_name");
      if (error) throw error;
      return (data ?? []) as unknown as StagingRow[];
    },
  });

  // Populate staging table from PM master list + asset tree
  const populateMutation = useMutation({
    mutationFn: async () => {
      // Clear existing uncommitted rows
      await supabase
        .from("pm_asset_link_staging" as any)
        .delete()
        .eq("committed", false);

      const rows = pms.map((pm) => {
        const result = matchPMToAsset(pm.equipmentType, assets);
        return {
          pm_template_id: pm.id,
          pm_template_name: pm.pmName,
          pm_frequency: pm.frequency,
          pm_equipment_ref: pm.equipmentType,
          current_linked_asset: "",
          asset_match_key: result.assetMatchKey,
          matched_asset_id: result.matchedAssetId,
          matched_asset_name: result.matchedAssetName,
          matched_asset_area: result.matchedAssetArea,
          matched_asset_parent: result.matchedAssetParent,
          match_confidence: result.matchConfidence,
          validation_status: result.validationStatus,
          committed: false,
        };
      });

      if (rows.length > 0) {
        const { error } = await supabase
          .from("pm_asset_link_staging" as any)
          .insert(rows as any);
        if (error) throw error;
      }

      return rows.length;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  // Update validation status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      validation_status,
      matched_asset_id,
      matched_asset_name,
    }: {
      id: string;
      validation_status: string;
      matched_asset_id?: string;
      matched_asset_name?: string;
    }) => {
      const update: Record<string, any> = { validation_status };
      if (matched_asset_id !== undefined) update.matched_asset_id = matched_asset_id;
      if (matched_asset_name !== undefined) update.matched_asset_name = matched_asset_name;
      const { error } = await supabase
        .from("pm_asset_link_staging" as any)
        .update(update as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  // Commit confirmed links
  const commitMutation = useMutation({
    mutationFn: async () => {
      const staging = stagingQuery.data ?? [];
      const confirmed = staging.filter(
        (r) => r.validation_status === "Confirmed" && !r.committed
      );

      if (confirmed.length === 0) throw new Error("No confirmed rows to commit.");

      const now = new Date().toISOString();

      // Write asset numbers to pm_master_list
      for (const row of confirmed) {
        if (row.matched_asset_id) {
          await supabase
            .from("pm_master_list")
            .update({ asset_number: row.matched_asset_id } as any)
            .eq("id", row.pm_template_id);
        }
      }

      // Mark as committed in staging
      const ids = confirmed.map((r) => r.id);
      await supabase
        .from("pm_asset_link_staging" as any)
        .update({
          committed: true,
          committed_at: now,
          committed_by: "system",
        } as any)
        .in("id", ids);

      return confirmed.length;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  // Summary stats
  const staging = stagingQuery.data ?? [];
  const summary = {
    total: staging.length,
    exact: staging.filter((r) => r.match_confidence === "Exact").length,
    keyword: staging.filter((r) => r.match_confidence === "Keyword").length,
    multiple: staging.filter((r) => r.match_confidence === "Multiple").length,
    none: staging.filter((r) => r.match_confidence === "None").length,
    confirmed: staging.filter((r) => r.validation_status === "Confirmed").length,
    manualReview: staging.filter((r) => r.validation_status === "Manual Review Required").length,
    pending: staging.filter((r) => r.validation_status === "Pending").length,
    committed: staging.filter((r) => r.committed).length,
  };

  return {
    staging,
    assets,
    summary,
    isLoading: stagingQuery.isLoading,
    populate: populateMutation.mutateAsync,
    isPopulating: populateMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    commitLinks: commitMutation.mutateAsync,
    isCommitting: commitMutation.isPending,
  };
}
