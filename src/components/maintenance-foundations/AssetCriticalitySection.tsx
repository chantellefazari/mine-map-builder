import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, X, Printer, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type CriticalityRating = "A" | "B" | "C";

interface RatingRecord {
  id: string;
  asset_number: string;
  asset_name: string;
  area_label: string;
  sub_area: string;
  criticality: CriticalityRating;
  justification: string;
  assessed_by: string;
  assessed_at: string;
}

interface ParentAsset {
  asset_number: string;
  asset_name: string;
  area_label: string;
  sub_area: string;
}

const RATING_CONFIG: Record<CriticalityRating, { label: string; color: string; description: string }> = {
  A: { label: "A — Critical", color: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800", description: "Failure causes immediate plant shutdown or safety risk" },
  B: { label: "B — Important", color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800", description: "Failure causes significant production impact within 24h" },
  C: { label: "C — General", color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800", description: "Failure has minimal or no production impact" },
};

function useParentAssets() {
  return useQuery({
    queryKey: ["criticality-parent-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("asset_number, asset_name, area_label, sub_area, parent_asset_label")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      // Parent assets = those whose asset_number appears as a parent_asset_label for other rows
      // OR level 5/6 assets (systems and major equipment)
      const parentLabels = new Set(data.map(d => d.parent_asset_label));
      const parents: ParentAsset[] = data
        .filter(d => parentLabels.has(d.asset_name) || !data.some(c => c.asset_name === d.parent_asset_label && c.asset_number !== d.asset_number))
        .reduce((acc, d) => {
          if (!acc.find(a => a.asset_number === d.asset_number)) {
            acc.push({ asset_number: d.asset_number, asset_name: d.asset_name, area_label: d.area_label, sub_area: d.sub_area });
          }
          return acc;
        }, [] as ParentAsset[]);
      return parents;
    },
    staleTime: 5 * 60 * 1000,
  });
}

function useCriticalityRatings() {
  return useQuery({
    queryKey: ["asset-criticality-ratings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("asset_criticality_ratings")
        .select("*")
        .order("area_label", { ascending: true });
      if (error) throw error;
      return data as RatingRecord[];
    },
    staleTime: 60 * 1000,
  });
}

export const AssetCriticalitySection = () => {
  const queryClient = useQueryClient();
  const { data: assets, isLoading: assetsLoading } = useParentAssets();
  const { data: ratings, isLoading: ratingsLoading } = useCriticalityRatings();
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | CriticalityRating>("all");
  const [pendingChanges, setPendingChanges] = useState<Record<string, { criticality: CriticalityRating; justification: string }>>({});

  const saveMutation = useMutation({
    mutationFn: async (changes: { asset_number: string; asset_name: string; area_label: string; sub_area: string; criticality: CriticalityRating; justification: string }[]) => {
      for (const change of changes) {
        const { error } = await supabase
          .from("asset_criticality_ratings")
          .upsert({
            asset_number: change.asset_number,
            asset_name: change.asset_name,
            area_label: change.area_label,
            sub_area: change.sub_area,
            criticality: change.criticality,
            justification: change.justification,
            assessed_at: new Date().toISOString(),
          }, { onConflict: "asset_number" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-criticality-ratings"] });
      setPendingChanges({});
      toast.success("Criticality ratings saved");
    },
    onError: () => toast.error("Failed to save ratings"),
  });

  const ratingsMap = useMemo(() => {
    const map: Record<string, RatingRecord> = {};
    ratings?.forEach(r => { map[r.asset_number] = r; });
    return map;
  }, [ratings]);

  const areas = useMemo(() => {
    const set = new Set(assets?.map(a => a.area_label) || []);
    return Array.from(set).sort();
  }, [assets]);

  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    return assets.filter(a => {
      if (areaFilter !== "all" && a.area_label !== areaFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return a.asset_number.toLowerCase().includes(s) || a.asset_name.toLowerCase().includes(s);
      }
      return true;
    });
  }, [assets, search, areaFilter]);

  const getRating = (assetNumber: string): CriticalityRating => {
    return pendingChanges[assetNumber]?.criticality || (ratingsMap[assetNumber]?.criticality as CriticalityRating) || "C";
  };

  const getJustification = (assetNumber: string): string => {
    return pendingChanges[assetNumber]?.justification ?? ratingsMap[assetNumber]?.justification ?? "";
  };

  const handleRatingChange = (asset: ParentAsset, rating: CriticalityRating) => {
    setPendingChanges(prev => ({
      ...prev,
      [asset.asset_number]: { criticality: rating, justification: prev[asset.asset_number]?.justification ?? ratingsMap[asset.asset_number]?.justification ?? "" },
    }));
  };

  const handleJustificationChange = (asset: ParentAsset, justification: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [asset.asset_number]: { criticality: prev[asset.asset_number]?.criticality ?? (ratingsMap[asset.asset_number]?.criticality as CriticalityRating) ?? "C", justification },
    }));
  };

  const handleSaveAll = () => {
    const changes = Object.entries(pendingChanges).map(([assetNumber, vals]) => {
      const asset = assets?.find(a => a.asset_number === assetNumber);
      return {
        asset_number: assetNumber,
        asset_name: asset?.asset_name || "",
        area_label: asset?.area_label || "",
        sub_area: asset?.sub_area || "",
        ...vals,
      };
    });
    if (changes.length === 0) { toast.info("No changes to save"); return; }
    saveMutation.mutate(changes);
  };

  const handlePrint = () => {
    const allAssets = assets || [];
    const rows = allAssets.map(a => {
      const r = getRating(a.asset_number);
      const j = getJustification(a.asset_number);
      return `<tr><td>${a.area_label}</td><td>${a.sub_area}</td><td>${a.asset_number}</td><td>${a.asset_name}</td><td class="rating-${r}">${r}</td><td>${j}</td></tr>`;
    }).join("");

    const summary = { A: 0, B: 0, C: 0 };
    allAssets.forEach(a => { summary[getRating(a.asset_number)]++; });

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>Asset Criticality Assessment — TCMG</title>
      <style>
        @page { size: A4 landscape; margin: 12mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 9px; line-height: 1.4; color: #111; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .doc-header { border-bottom: 3px solid #d4a017; margin-bottom: 6mm; padding-bottom: 3mm; }
        .doc-header h1 { font-size: 16px; font-weight: 700; }
        .doc-header p { font-size: 9px; color: #666; margin-top: 2px; }
        .summary { display: flex; gap: 12px; margin-bottom: 6mm; }
        .summary-card { border: 1px solid #ddd; border-radius: 4px; padding: 6px 12px; text-align: center; }
        .summary-card .count { font-size: 18px; font-weight: 700; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 3px 6px; text-align: left; font-size: 8px; }
        th { background-color: #f5f0e0; font-weight: 600; }
        .rating-A { background: #fee2e2; color: #991b1b; font-weight: 700; text-align: center; }
        .rating-B { background: #fef3c7; color: #92400e; font-weight: 700; text-align: center; }
        .rating-C { background: #d1fae5; color: #065f46; font-weight: 700; text-align: center; }
        .legend { margin-top: 6mm; font-size: 8px; }
        .legend td { padding: 2px 6px; }
      </style>
    </head><body>
      <div class="doc-header">
        <h1>Asset Criticality Assessment</h1>
        <p>Tennant Mines Gold — Processing Plant | ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}</p>
      </div>
      <div class="summary">
        <div class="summary-card"><div class="count" style="color:#991b1b">${summary.A}</div><div>Critical (A)</div></div>
        <div class="summary-card"><div class="count" style="color:#92400e">${summary.B}</div><div>Important (B)</div></div>
        <div class="summary-card"><div class="count" style="color:#065f46">${summary.C}</div><div>General (C)</div></div>
      </div>
      <table><thead><tr><th>Area</th><th>Sub-Area</th><th>Asset #</th><th>Asset Name</th><th style="width:40px">Rating</th><th>Justification</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <table class="legend"><tr><td class="rating-A">A</td><td>Critical — Failure causes immediate plant shutdown or safety risk</td></tr>
      <tr><td class="rating-B">B</td><td>Important — Failure causes significant production impact within 24h</td></tr>
      <tr><td class="rating-C">C</td><td>General — Failure has minimal or no production impact</td></tr></table>
    </body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  if (assetsLoading || ratingsLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /><span className="ml-2 text-sm text-muted-foreground">Loading assets…</span></div>;
  }

  const pendingCount = Object.keys(pendingChanges).length;
  const summary = { A: 0, B: 0, C: 0 };
  assets?.forEach(a => { summary[getRating(a.asset_number)]++; });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Asset Criticality Assessment</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manually assign A / B / C criticality ratings to each parent asset. Changes are saved to the database.
          </p>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(RATING_CONFIG) as [CriticalityRating, typeof RATING_CONFIG.A][]).map(([key, cfg]) => (
              <div key={key} className={`rounded-md border px-3 py-2 text-xs ${cfg.color}`}>
                <span className="font-semibold">{cfg.label}</span>
                <p className="mt-0.5 opacity-80">{cfg.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary + Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3">
          <Badge variant="outline" className="text-xs">Total: {assets?.length || 0}</Badge>
          <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">A: {summary.A}</Badge>
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">B: {summary.B}</Badge>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">C: {summary.C}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </Button>
          <Button size="sm" onClick={handleSaveAll} disabled={pendingCount === 0 || saveMutation.isPending} className="gap-2">
            {saveMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save {pendingCount > 0 ? `(${pendingCount})` : ""}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search assets…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-8 h-9 text-sm" />
          {search && <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => setSearch("")}><X className="w-4 h-4" /></Button>}
        </div>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-48 h-9 text-sm"><SelectValue placeholder="All Areas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px] text-xs">Area</TableHead>
              <TableHead className="w-[160px] text-xs">Sub-Area</TableHead>
              <TableHead className="w-[100px] text-xs">Asset #</TableHead>
              <TableHead className="text-xs">Asset Name</TableHead>
              <TableHead className="w-[130px] text-xs">Rating</TableHead>
              <TableHead className="text-xs">Justification / Notes</TableHead>
              <TableHead className="w-[40px] text-xs"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map(asset => {
              const rating = getRating(asset.asset_number);
              const justification = getJustification(asset.asset_number);
              const hasChange = !!pendingChanges[asset.asset_number];
              const isSaved = !!ratingsMap[asset.asset_number] && !hasChange;

              return (
                <TableRow key={asset.asset_number} className={hasChange ? "bg-yellow-50/50 dark:bg-yellow-950/20" : ""}>
                  <TableCell className="text-xs py-1.5">{asset.area_label}</TableCell>
                  <TableCell className="text-xs py-1.5">{asset.sub_area}</TableCell>
                  <TableCell className="text-xs py-1.5 font-mono">{asset.asset_number}</TableCell>
                  <TableCell className="text-xs py-1.5">{asset.asset_name}</TableCell>
                  <TableCell className="py-1.5">
                    <Select value={rating} onValueChange={(v) => handleRatingChange(asset, v as CriticalityRating)}>
                      <SelectTrigger className={`h-7 text-xs font-semibold ${RATING_CONFIG[rating].color}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A" className="text-xs font-semibold text-red-700">A — Critical</SelectItem>
                        <SelectItem value="B" className="text-xs font-semibold text-amber-700">B — Important</SelectItem>
                        <SelectItem value="C" className="text-xs font-semibold text-emerald-700">C — General</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-1.5">
                    <Input
                      value={justification}
                      onChange={e => handleJustificationChange(asset, e.target.value)}
                      placeholder="Optional justification…"
                      className="h-7 text-xs"
                    />
                  </TableCell>
                  <TableCell className="py-1.5 text-center">
                    {isSaved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredAssets.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">No assets match your filter.</p>
      )}
    </div>
  );
};
