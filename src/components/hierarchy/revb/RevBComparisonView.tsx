import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, X, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

/* ── types ── */
interface AssetRow {
  asset_number: string;
  asset_name: string;
  area_code: string;
  area_label: string;
  sub_area: string;
  parent_asset_label: string;
}

interface RevBRow extends AssetRow {
  change_type: string;
  notes: string | null;
}

interface AreaGroup {
  code: string;
  label: string;
  subAreas: Map<string, ParentGroup[]>;
}

interface ParentGroup {
  label: string;
  assets: AssetRow[];
}

/* ── Known renames from delta report ── */
const KNOWN_RENAMES: Record<string, string> = {
  "BM01": "04-GR-100",
  "RHOP01": "04-FB-099",
  "APN01": "04-FE-100",
  "MFC01": "04-BE-100",
  "FHOP01": "04-CH-102",
  "FP01": "04-FL-400",
  "THK01": "04-TH-200",
  "PWT01": "11-TK-202",
  "HCMP01": "05-CP-132",
  "HCMP02": "05-CP-133",
  "EWCL01": "04-EC-600",
  "CY01": "04-CY-106",
  "GRT01": "04-SC-100",
};

const REVERSE_RENAMES: Record<string, string> = {};
Object.entries(KNOWN_RENAMES).forEach(([a, b]) => { REVERSE_RENAMES[b] = a; });

/* ── hooks ── */
function useRevAAssets() {
  return useQuery({
    queryKey: ["comparison-rev-a"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processing_plant_assets")
        .select("asset_number, asset_name, area_code, area_label, sub_area, parent_asset_label")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as AssetRow[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

function useRevBAssets() {
  return useQuery({
    queryKey: ["comparison-rev-b"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("asset_number, asset_name, area_code, area_label, sub_area, parent_asset_label, change_type, notes")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as RevBRow[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ── helpers ── */
function groupByArea(assets: AssetRow[]): AreaGroup[] {
  const map = new Map<string, AreaGroup>();
  for (const a of assets) {
    if (!map.has(a.area_code)) {
      map.set(a.area_code, { code: a.area_code, label: a.area_label, subAreas: new Map() });
    }
    const area = map.get(a.area_code)!;
    if (!area.subAreas.has(a.sub_area)) {
      area.subAreas.set(a.sub_area, []);
    }
    const parents = area.subAreas.get(a.sub_area)!;
    let parent = parents.find(p => p.label === a.parent_asset_label);
    if (!parent) {
      parent = { label: a.parent_asset_label, assets: [] };
      parents.push(parent);
    }
    parent.assets.push(a);
  }
  const ORDER = ["SITE", "UTL", "COM", "REC", "TAIL", "SUP"];
  return Array.from(map.values()).sort((a, b) => {
    const ia = ORDER.indexOf(a.code);
    const ib = ORDER.indexOf(b.code);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}

function classifyAsset(name: string, parent: string): "equipment" | "valve" | "instrument" | "line" | "motor" {
  const n = (name + " " + parent).toLowerCase();
  if (n.includes("valve") || n.includes("gate") || n.includes("butterfly") || n.includes("check valve") || n.includes("ball valve")) return "valve";
  if (n.includes("motor") || n.includes("vsd") || n.includes("drive")) return "motor";
  if (n.includes("transmitter") || n.includes("switch") || n.includes("sensor") || n.includes("indicator") || n.includes("gauge") || n.includes("probe") || n.includes("instrument")) return "instrument";
  if (n.includes("line") || n.includes("pipe")) return "line";
  return "equipment";
}

/* ── Metric card ── */
const MetricCard: React.FC<{ label: string; revA: number; revB: number }> = ({ label, revA, revB }) => {
  const diff = revB - revA;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-center min-w-[120px]">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-semibold text-foreground">{revA}</span>
        <span className="text-xs text-muted-foreground">vs</span>
        <span className="text-sm font-semibold text-foreground">{revB}</span>
      </div>
      {diff !== 0 && (
        <p className={`text-xs mt-0.5 ${diff > 0 ? "text-green-600" : "text-red-600"}`}>
          {diff > 0 ? "+" : ""}{diff}
        </p>
      )}
    </div>
  );
};

/* ── Color-coded asset row (leaf level) ── */
type DiffStatus = "new" | "missing" | "renamed" | "moved" | "unchanged";

const statusColors: Record<DiffStatus, string> = {
  new: "bg-green-50 dark:bg-green-950/30 border-l-2 border-l-green-500",
  missing: "bg-red-50 dark:bg-red-950/30 border-l-2 border-l-red-500",
  renamed: "bg-blue-50 dark:bg-blue-950/30 border-l-2 border-l-blue-500",
  moved: "bg-amber-50 dark:bg-amber-950/30 border-l-2 border-l-amber-500",
  unchanged: "",
};

const statusBadge: Record<DiffStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "NEW", variant: "default" },
  missing: { label: "MISSING", variant: "destructive" },
  renamed: { label: "RENAMED", variant: "secondary" },
  moved: { label: "MOVED", variant: "outline" },
  unchanged: { label: "", variant: "secondary" },
};

const AssetLine: React.FC<{ asset: AssetRow; status: DiffStatus; renamedTo?: string }> = ({ asset, status, renamedTo }) => (
  <div className={`flex items-center gap-2 py-1 px-2 rounded text-xs ${statusColors[status]}`}>
    <span className="font-mono font-medium w-[120px] flex-shrink-0 truncate" title={asset.asset_number}>
      {asset.asset_number}
    </span>
    <span className="flex-1 truncate" title={asset.asset_name}>{asset.asset_name}</span>
    {status !== "unchanged" && (
      <Badge variant={statusBadge[status].variant} className="text-[10px] px-1.5 py-0 h-4 flex-shrink-0">
        {statusBadge[status].label}
      </Badge>
    )}
    {renamedTo && (
      <span className="text-[10px] text-blue-600 dark:text-blue-400 flex-shrink-0">→ {renamedTo}</span>
    )}
  </div>
);

/* ── Tree panel (one side) ── */
const TreePanel: React.FC<{
  title: string;
  areas: AreaGroup[];
  diffMap: Map<string, DiffStatus>;
  renameMap: Record<string, string>;
  filter: string;
  side: "left" | "right";
}> = ({ title, areas, diffMap, renameMap, filter, side }) => {
  const filterLower = filter.toLowerCase();

  return (
    <div className="flex-1 min-w-0">
      <div className={`sticky top-0 z-10 bg-card border-b border-border px-4 py-2 ${side === "left" ? "rounded-tl-lg" : "rounded-tr-lg"}`}>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <ScrollArea className="h-[calc(100vh-380px)] min-h-[400px]">
        <div className="p-3 space-y-2">
          {areas.map(area => {
            const subEntries = Array.from(area.subAreas.entries());
            const hasMatch = !filter || subEntries.some(([, parents]) =>
              parents.some(p => p.assets.some(a =>
                a.asset_number.toLowerCase().includes(filterLower) ||
                a.asset_name.toLowerCase().includes(filterLower)
              ))
            );
            if (!hasMatch) return null;

            return (
              <Collapsible key={area.code} defaultOpen>
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded hover:bg-muted/50 transition-colors">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {area.code}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{area.label}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 border-l border-border/50 pl-3 space-y-1">
                  {subEntries.map(([subLabel, parents]) => {
                    const subHasMatch = !filter || parents.some(p =>
                      p.assets.some(a =>
                        a.asset_number.toLowerCase().includes(filterLower) ||
                        a.asset_name.toLowerCase().includes(filterLower)
                      )
                    );
                    if (!subHasMatch) return null;

                    return (
                      <Collapsible key={subLabel} defaultOpen={!!filter}>
                        <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-1 px-2 rounded hover:bg-muted/30 text-xs">
                          <span className="font-medium text-muted-foreground">{subLabel}</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-3 border-l border-border/30 pl-2 space-y-0.5">
                          {parents.map(parent => {
                            const filteredAssets = filter
                              ? parent.assets.filter(a =>
                                  a.asset_number.toLowerCase().includes(filterLower) ||
                                  a.asset_name.toLowerCase().includes(filterLower)
                                )
                              : parent.assets;
                            if (filteredAssets.length === 0) return null;

                            return (
                              <div key={parent.label} className="mb-1">
                                <p className="text-[11px] font-semibold text-foreground/70 px-2 py-0.5">{parent.label}</p>
                                {filteredAssets.map(a => (
                                  <AssetLine
                                    key={a.asset_number}
                                    asset={a}
                                    status={diffMap.get(a.asset_number) || "unchanged"}
                                    renamedTo={renameMap[a.asset_number]}
                                  />
                                ))}
                              </div>
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

/* ── Main comparison view ── */
export const RevBComparisonView: React.FC = () => {
  const [filter, setFilter] = useState("");
  const { data: revA, isLoading: loadA } = useRevAAssets();
  const { data: revB, isLoading: loadB } = useRevBAssets();

  const { revAGroups, revBGroups, revADiff, revBDiff, metrics } = useMemo(() => {
    if (!revA || !revB) return { revAGroups: [], revBGroups: [], revADiff: new Map(), revBDiff: new Map(), metrics: null };

    const revAIds = new Set(revA.map(a => a.asset_number));
    const revBIds = new Set(revB.map(b => b.asset_number));

    // Build diff maps
    const aDiff = new Map<string, DiffStatus>();
    const bDiff = new Map<string, DiffStatus>();

    // Rev A items: mark as missing if not in Rev B (and not a known rename)
    for (const a of revA) {
      if (KNOWN_RENAMES[a.asset_number]) {
        aDiff.set(a.asset_number, "renamed");
      } else if (!revBIds.has(a.asset_number)) {
        aDiff.set(a.asset_number, "missing");
      }
    }

    // Rev B items: mark as new if not in Rev A (and not a known rename target)
    for (const b of revB) {
      if (REVERSE_RENAMES[b.asset_number]) {
        bDiff.set(b.asset_number, "renamed");
      } else if (!revAIds.has(b.asset_number)) {
        bDiff.set(b.asset_number, "new");
      }
    }

    // Metrics
    const countBy = (items: AssetRow[], type: ReturnType<typeof classifyAsset>) =>
      items.filter(a => classifyAsset(a.asset_name, a.parent_asset_label) === type).length;

    const m = {
      totalA: revA.length,
      totalB: revB.length,
      equipA: countBy(revA, "equipment"),
      equipB: countBy(revB, "equipment"),
      valveA: countBy(revA, "valve"),
      valveB: countBy(revB, "valve"),
      instrA: countBy(revA, "instrument"),
      instrB: countBy(revB, "instrument"),
      lineA: countBy(revA, "line"),
      lineB: countBy(revB, "line"),
      motorA: countBy(revA, "motor"),
      motorB: countBy(revB, "motor"),
      nodesA: new Set(revA.map(a => a.parent_asset_label)).size,
      nodesB: new Set(revB.map(b => b.parent_asset_label)).size,
    };

    return {
      revAGroups: groupByArea(revA),
      revBGroups: groupByArea(revB),
      revADiff: aDiff,
      revBDiff: bDiff,
      metrics: m,
    };
  }, [revA, revB]);

  if (loadA || loadB) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading comparison data…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Audit mode banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-3">
        <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold text-foreground">READ-ONLY Audit Comparison</p>
          <p className="text-muted-foreground">No changes applied. Rev A is locked. This is a visual diff only.</p>
        </div>
      </div>

      {/* Summary metrics */}
      {metrics && (
        <div className="flex flex-wrap gap-2">
          <MetricCard label="Total Assets" revA={metrics.totalA} revB={metrics.totalB} />
          <MetricCard label="Equipment" revA={metrics.equipA} revB={metrics.equipB} />
          <MetricCard label="Valves" revA={metrics.valveA} revB={metrics.valveB} />
          <MetricCard label="Instruments" revA={metrics.instrA} revB={metrics.instrB} />
          <MetricCard label="Lines" revA={metrics.lineA} revB={metrics.lineB} />
          <MetricCard label="Motors/VSDs" revA={metrics.motorA} revB={metrics.motorB} />
          <MetricCard label="Hierarchy Nodes" revA={metrics.nodesA} revB={metrics.nodesB} />
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-500" /> New in Rev B</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500" /> Missing from Rev B</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500" /> Moved</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500" /> Renamed</span>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search across both trees..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="pl-10 pr-10 h-9 text-sm"
        />
        {filter && (
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => setFilter("")}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Side-by-side panels */}
      <div className="flex gap-0 border border-border rounded-lg overflow-hidden bg-card">
        <TreePanel
          title="Processing Plant – Rev A (Original Build)"
          areas={revAGroups}
          diffMap={revADiff}
          renameMap={KNOWN_RENAMES}
          filter={filter}
          side="left"
        />
        <div className="w-px bg-border flex-shrink-0" />
        <TreePanel
          title="Processing Plant – Rev B (2026 P&ID Extract)"
          areas={revBGroups}
          diffMap={revBDiff}
          renameMap={REVERSE_RENAMES}
          filter={filter}
          side="right"
        />
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-center py-2">
        Comparison based on Phase 3 Delta Report • {Object.keys(KNOWN_RENAMES).length} confirmed renames mapped • No data modified
      </div>
    </div>
  );
};
