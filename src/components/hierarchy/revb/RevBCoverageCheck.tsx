import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function useCoverageData() {
  return useQuery({
    queryKey: ["rev-b-coverage"],
    queryFn: async () => {
      // Get all extraction tags
      const { data: tags, error: e1 } = await supabase
        .from("rev_b_pid_extraction_register")
        .select("id, tag_id, tag_type, description, area_clue, confidence")
        .order("page_number")
        .order("sort_order");
      if (e1) throw e1;

      // Get all Rev B tree asset numbers
      const { data: assets, error: e2 } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("asset_number, source_extraction_ids");
      if (e2) throw e2;

      return { tags: tags || [], assets: assets || [] };
    },
    staleTime: 2 * 60 * 1000,
  });
}

export const RevBCoverageCheck: React.FC = () => {
  const { data, isLoading } = useCoverageData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Checking coverage…</span>
      </div>
    );
  }

  if (!data) return null;

  const { tags, assets } = data;
  const treeTagIds = new Set(assets.map(a => a.asset_number));

  // Check each extraction tag
  const included: typeof tags = [];
  const missing: typeof tags = [];

  for (const tag of tags) {
    if (treeTagIds.has(tag.tag_id)) {
      included.push(tag);
    } else {
      missing.push(tag);
    }
  }

  const coveragePct = tags.length > 0 ? Math.round((included.length / tags.length) * 100) : 0;

  // Group missing by area
  const missingByArea = new Map<string, typeof tags>();
  for (const t of missing) {
    if (!missingByArea.has(t.area_clue)) missingByArea.set(t.area_clue, []);
    missingByArea.get(t.area_clue)!.push(t);
  }

  // Coverage by tag type
  const typeStats = new Map<string, { total: number; covered: number }>();
  for (const tag of tags) {
    if (!typeStats.has(tag.tag_type)) typeStats.set(tag.tag_type, { total: 0, covered: 0 });
    const s = typeStats.get(tag.tag_type)!;
    s.total++;
    if (treeTagIds.has(tag.tag_id)) s.covered++;
  }

  return (
    <div className="space-y-6">
      {/* Overall Coverage */}
      <div className={`rounded-lg p-4 border ${coveragePct === 100
        ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
        : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
      }`}>
        <div className="flex items-center gap-3">
          {coveragePct === 100
            ? <CheckCircle2 className="h-6 w-6 text-green-600" />
            : <AlertCircle className="h-6 w-6 text-amber-600" />
          }
          <div>
            <p className="text-sm font-bold text-foreground">
              Coverage: {included.length} / {tags.length} ({coveragePct}%)
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {coveragePct === 100
                ? "Every tag in the Extraction Register is included in the Rev B tree."
                : `${missing.length} tag(s) not yet mapped to the Rev B tree.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Coverage by Type */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-2">Coverage by Tag Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {Array.from(typeStats.entries()).map(([type, stats]) => (
            <div key={type} className="border border-border rounded p-2 text-center">
              <p className="text-xs font-medium text-muted-foreground">{type}</p>
              <p className="text-lg font-bold text-foreground">{stats.covered}/{stats.total}</p>
              <p className={`text-[10px] font-medium ${
                stats.covered === stats.total ? "text-green-600" : "text-amber-600"
              }`}>
                {Math.round((stats.covered / stats.total) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Tags (if any) */}
      {missing.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">
            Unmatched Tags ({missing.length})
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-auto">
            {Array.from(missingByArea.entries()).map(([area, areaTags]) => (
              <div key={area} className="border border-border rounded p-2">
                <h4 className="text-xs font-semibold mb-1">{area} ({areaTags.length})</h4>
                <div className="space-y-0.5">
                  {areaTags.map(t => (
                    <div key={t.id} className="flex items-center gap-2 text-[11px]">
                      <Badge variant="outline" className="text-[9px] px-1 py-0">{t.tag_type}</Badge>
                      <span className="font-mono text-primary">{t.tag_id}</span>
                      <span className="text-muted-foreground truncate">{t.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assumptions & Questions */}
      <div className="border border-border rounded-lg p-4">
        <h3 className="text-sm font-bold text-foreground mb-2">Assumptions & Questions</h3>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
          <li><strong>Site Infrastructure</strong> – No tags extracted from P&IDs. This area covers non-process assets (buildings, roads, fencing) not shown on process P&IDs.</li>
          <li><strong>Support Services</strong> – Only Reagents mapped from P&IDs. Mobile equipment, workshop, and camp assets are not on process P&IDs.</li>
          <li><strong>Valve nesting</strong> – Valves are grouped under area-level "Valves" parents. Detailed valve-to-equipment nesting requires manual review of each valve's service connection.</li>
          <li><strong>Instrument nesting</strong> – Same as valves. Instruments grouped at area level pending detailed loop-assignment review.</li>
          <li><strong>Line segments</strong> – Represented as "Line – [Area]" groups. Individual line routing requires isometric/layout cross-reference.</li>
          <li><strong>Motors/VSDs</strong> – Grouped under area-level "Motors & VSDs" pending confirmation of driven-equipment linkage from electrical drawings.</li>
        </ul>
      </div>
    </div>
  );
};
