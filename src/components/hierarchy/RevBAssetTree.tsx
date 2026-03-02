import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Plus, Pencil, Minus, Check, AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RevBAsset {
  id: string;
  area_code: string;
  area_label: string;
  sub_area: string;
  parent_asset_label: string;
  asset_number: string;
  asset_name: string;
  change_type: string;
  rev_status: string;
  notes: string;
  sort_order: number;
}

interface ExtractionTag {
  id: string;
  tag_id: string;
  tag_type: string;
  description: string;
  area_clue: string;
  page_number: number;
  confidence: string;
  drawing_number: string;
}

const CHANGE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  Unchanged: { icon: <Check className="h-3 w-3" />, color: "bg-muted text-muted-foreground", label: "Unchanged" },
  New: { icon: <Plus className="h-3 w-3" />, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", label: "New" },
  Modified: { icon: <Pencil className="h-3 w-3" />, color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300", label: "Modified" },
  Removed: { icon: <Minus className="h-3 w-3" />, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", label: "Removed" },
};

function useRevBAssets() {
  return useQuery({
    queryKey: ["rev-b-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("id, area_code, area_label, sub_area, parent_asset_label, asset_number, asset_name, change_type, rev_status, notes, sort_order")
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

const DiffSummary: React.FC<{ assets: RevBAsset[] }> = ({ assets }) => {
  const counts = {
    Unchanged: assets.filter(a => a.change_type === "Unchanged").length,
    New: assets.filter(a => a.change_type === "New").length,
    Modified: assets.filter(a => a.change_type === "Modified").length,
    Removed: assets.filter(a => a.change_type === "Removed").length,
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {Object.entries(counts).map(([type, count]) => {
        const cfg = CHANGE_CONFIG[type];
        return (
          <div key={type} className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${cfg.color}`}>
              {cfg.icon} {cfg.label}
            </span>
            <span className="text-sm font-mono text-foreground">{count}</span>
          </div>
        );
      })}
      <span className="text-xs text-muted-foreground ml-auto">Total: {assets.length}</span>
    </div>
  );
};

const AssetTable: React.FC<{ assets: RevBAsset[]; filter: string }> = ({ assets, filter }) => {
  const filtered = filter
    ? assets.filter(a =>
        a.asset_number.toLowerCase().includes(filter.toLowerCase()) ||
        a.asset_name.toLowerCase().includes(filter.toLowerCase()) ||
        a.area_label.toLowerCase().includes(filter.toLowerCase()) ||
        a.parent_asset_label.toLowerCase().includes(filter.toLowerCase())
      )
    : assets;

  // Group by area
  const grouped = new Map<string, RevBAsset[]>();
  for (const a of filtered) {
    const key = `${a.area_code} – ${a.area_label}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(a);
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-auto">
      {Array.from(grouped.entries()).map(([areaKey, areaAssets]) => (
        <div key={areaKey}>
          <h4 className="text-sm font-semibold text-foreground sticky top-0 bg-card py-1 border-b border-border mb-1">
            {areaKey} <span className="text-muted-foreground font-normal">({areaAssets.length})</span>
          </h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left p-1.5 w-20">Status</th>
                <th className="text-left p-1.5 w-28">Asset #</th>
                <th className="text-left p-1.5">Name</th>
                <th className="text-left p-1.5 w-40">Parent</th>
                <th className="text-left p-1.5 w-32">Sub-Area</th>
              </tr>
            </thead>
            <tbody>
              {areaAssets.map(a => {
                const cfg = CHANGE_CONFIG[a.change_type] || CHANGE_CONFIG.Unchanged;
                return (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-1.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                    <td className="p-1.5 font-mono font-medium text-primary">{a.asset_number}</td>
                    <td className="p-1.5">{a.asset_name}</td>
                    <td className="p-1.5 text-muted-foreground">{a.parent_asset_label}</td>
                    <td className="p-1.5 text-muted-foreground">{a.sub_area}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No assets match the filter.</p>
      )}
    </div>
  );
};

const ExtractionTable: React.FC<{ tags: ExtractionTag[]; filter: string }> = ({ tags, filter }) => {
  const filtered = filter
    ? tags.filter(t =>
        t.tag_id.toLowerCase().includes(filter.toLowerCase()) ||
        t.description.toLowerCase().includes(filter.toLowerCase()) ||
        t.area_clue.toLowerCase().includes(filter.toLowerCase())
      )
    : tags;

  // Group by page
  const grouped = new Map<number, ExtractionTag[]>();
  for (const t of filtered) {
    if (!grouped.has(t.page_number)) grouped.set(t.page_number, []);
    grouped.get(t.page_number)!.push(t);
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-auto">
      {Array.from(grouped.entries()).sort(([a],[b]) => a - b).map(([page, pageTags]) => (
        <div key={page}>
          <h4 className="text-sm font-semibold text-foreground sticky top-0 bg-card py-1 border-b border-border mb-1">
            Page {page} — {pageTags[0]?.drawing_number} <span className="text-muted-foreground font-normal">({pageTags.length} tags)</span>
          </h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left p-1.5 w-20">Type</th>
                <th className="text-left p-1.5 w-28">Tag ID</th>
                <th className="text-left p-1.5">Description</th>
                <th className="text-left p-1.5 w-28">Area Clue</th>
                <th className="text-left p-1.5 w-16">Conf.</th>
              </tr>
            </thead>
            <tbody>
              {pageTags.map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-1.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {t.tag_type}
                    </Badge>
                  </td>
                  <td className="p-1.5 font-mono font-medium text-primary">{t.tag_id}</td>
                  <td className="p-1.5">{t.description}</td>
                  <td className="p-1.5 text-muted-foreground">{t.area_clue}</td>
                  <td className="p-1.5">
                    <span className={`text-[10px] font-medium ${
                      t.confidence === "High" ? "text-green-600" :
                      t.confidence === "Med" ? "text-amber-600" : "text-red-600"
                    }`}>{t.confidence}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

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

  const equipmentTags = tags?.filter(t => t.tag_type === "Equipment") || [];

  return (
    <div className="space-y-4">
      {/* Rev B Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-amber-800 dark:text-amber-300">Rev B — Draft (2026 P&ID Updates)</p>
          <p className="text-amber-700 dark:text-amber-400 mt-0.5">
            This revision is isolated from Rev A. {equipmentTags.length} equipment tags extracted from 14 P&ID pages.
            Changes are tracked but NOT yet applied to the live hierarchy.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search assets or tags..."
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

      {/* Summary */}
      {assets && <DiffSummary assets={assets} />}

      {/* Sub-tabs: Asset Diff vs Source Register */}
      <Tabs defaultValue="diff" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="diff" className="text-xs">Asset Diff ({assets?.length || 0})</TabsTrigger>
          <TabsTrigger value="source" className="text-xs">P&ID Source Index ({tags?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="diff" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            {assets && <AssetTable assets={assets} filter={searchTerm} />}
          </div>
        </TabsContent>

        <TabsContent value="source" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            {tags && <ExtractionTable tags={tags} filter={searchTerm} />}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
