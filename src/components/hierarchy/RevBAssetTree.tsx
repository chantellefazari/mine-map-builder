import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevBAsset, DiffSummary, AssetTable } from "./revb/RevBAssetTable";
import { ExtractionTag, ExtractionTable } from "./revb/RevBExtractionTable";
import { RevBFlowMap } from "./revb/RevBFlowMap";
import { RevBCoverageCheck } from "./revb/RevBCoverageCheck";
import { RevBDeltaReport } from "./revb/RevBDeltaReport";
import { RevBPidAudit } from "./revb/RevBPidAudit";
import { BulkComponentImportDialog } from "./revb/BulkComponentImportDialog";

function useRevBAssets() {
  return useQuery({
    queryKey: ["rev-b-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("id, area_code, area_label, sub_area, parent_asset_label, asset_number, asset_name, change_type, rev_status, notes, sort_order, pid_tags, components")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as RevBAsset[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

function useExtractionRegister() {
  return useQuery({
    queryKey: ["rev-b-extraction"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rev_b_pid_extraction_register")
        .select("id, tag_id, tag_type, description, area_clue, page_number, confidence, drawing_number")
        .order("page_number", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ExtractionTag[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export const RevBAssetTree: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: assets, isLoading: assetsLoading } = useRevBAssets();
  const { data: tags, isLoading: tagsLoading } = useExtractionRegister();

  if (assetsLoading || tagsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading Rev B data…</span>
      </div>
    );
  }

  const equipmentCount = tags?.filter(t => t.tag_type === "Equipment").length || 0;

  return (
    <div className="space-y-4">
      {/* Rev B Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-amber-800 dark:text-amber-300">Rev B — Draft (2026 P&ID Updates)</p>
          <p className="text-amber-700 dark:text-amber-400 mt-0.5">
            Built from extraction register only. {assets?.length || 0} assets mapped from {equipmentCount} equipment + {(tags?.length || 0) - equipmentCount} valves/instruments/lines/motors across 14 P&ID pages.
            Changes are tracked but NOT yet applied to the live hierarchy.
          </p>
        </div>
      </div>

      {/* Search + Import */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assets, tags, or areas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 h-9 text-sm"
          />
          {searchTerm && (
            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => setSearchTerm("")}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <BulkComponentImportDialog />
      </div>

      {/* Summary */}
      {assets && <DiffSummary assets={assets} />}

      {/* Tabs */}
      <Tabs defaultValue="tree" className="w-full">
        <TabsList className="w-full max-w-2xl grid grid-cols-5">
          <TabsTrigger value="tree" className="text-xs">Asset Tree ({assets?.length || 0})</TabsTrigger>
          <TabsTrigger value="source" className="text-xs">Source Index ({tags?.length || 0})</TabsTrigger>
          <TabsTrigger value="flow" className="text-xs">Flow Map</TabsTrigger>
          <TabsTrigger value="coverage" className="text-xs">Coverage Check</TabsTrigger>
          <TabsTrigger value="delta" className="text-xs">Delta Report</TabsTrigger>
        </TabsList>

        <TabsContent value="tree" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            {assets && <AssetTable assets={assets} filter={searchTerm} />}
          </div>
        </TabsContent>

        <TabsContent value="source" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            {tags && <ExtractionTable tags={tags} filter={searchTerm} />}
          </div>
        </TabsContent>

        <TabsContent value="flow" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <RevBFlowMap />
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <RevBCoverageCheck />
          </div>
        </TabsContent>

        <TabsContent value="delta" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <RevBDeltaReport />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
