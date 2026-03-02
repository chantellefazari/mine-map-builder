import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, X, ChevronRight, ChevronDown, Eye, EyeOff, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/* ── types ── */
interface AssetRow {
  asset_number: string;
  asset_name: string;
  area_code: string;
  area_label: string;
  sub_area: string;
  parent_asset_label: string;
}

interface AreaNode {
  code: string;
  label: string;
  subAreas: SubAreaNode[];
}

interface SubAreaNode {
  label: string;
  parents: ParentNode[];
}

interface ParentNode {
  label: string;
  assets: AssetRow[];
}

/* ── hooks ── */
function useRevAAssets() {
  return useQuery({
    queryKey: ["dual-tree-rev-a"],
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
    queryKey: ["dual-tree-rev-b"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("asset_number, asset_name, area_code, area_label, sub_area, parent_asset_label")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as AssetRow[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ── helpers ── */
const AREA_ORDER = ["SITE", "UTL", "COM", "REC", "TAIL", "SUP"];

function buildTree(assets: AssetRow[]): AreaNode[] {
  const areaMap = new Map<string, { code: string; label: string; subMap: Map<string, Map<string, AssetRow[]>> }>();

  for (const a of assets) {
    if (!areaMap.has(a.area_code)) {
      areaMap.set(a.area_code, { code: a.area_code, label: a.area_label, subMap: new Map() });
    }
    const area = areaMap.get(a.area_code)!;
    if (!area.subMap.has(a.sub_area)) {
      area.subMap.set(a.sub_area, new Map());
    }
    const parentMap = area.subMap.get(a.sub_area)!;
    if (!parentMap.has(a.parent_asset_label)) {
      parentMap.set(a.parent_asset_label, []);
    }
    parentMap.get(a.parent_asset_label)!.push(a);
  }

  return Array.from(areaMap.values())
    .sort((a, b) => {
      const ia = AREA_ORDER.indexOf(a.code);
      const ib = AREA_ORDER.indexOf(b.code);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    })
    .map(area => ({
      code: area.code,
      label: area.label,
      subAreas: Array.from(area.subMap.entries()).map(([subLabel, parentMap]) => ({
        label: subLabel,
        parents: Array.from(parentMap.entries()).map(([pLabel, assets]) => ({
          label: pLabel,
          assets,
        })),
      })),
    }));
}

type HighlightStatus = "new" | "moved" | "missing" | null;

function buildHighlightMap(revA: AssetRow[], revB: AssetRow[]): Map<string, HighlightStatus> {
  const map = new Map<string, HighlightStatus>();
  const revANames = new Map<string, AssetRow>();
  for (const a of revA) {
    revANames.set(a.asset_name.trim().toLowerCase(), a);
  }
  const revANumbers = new Set(revA.map(a => a.asset_number));

  for (const b of revB) {
    const nameKey = b.asset_name.trim().toLowerCase();
    // Check by number first
    if (revANumbers.has(b.asset_number)) {
      const matchA = revA.find(a => a.asset_number === b.asset_number);
      if (matchA && (matchA.parent_asset_label !== b.parent_asset_label || matchA.area_code !== b.area_code)) {
        map.set(b.asset_number, "moved");
      }
      continue;
    }
    // Check by name
    const nameMatch = revANames.get(nameKey);
    if (nameMatch) {
      if (nameMatch.parent_asset_label !== b.parent_asset_label || nameMatch.area_code !== b.area_code) {
        map.set(b.asset_number, "moved");
      }
      continue;
    }
    // Not found — new
    map.set(b.asset_number, "new");
  }

  return map;
}

/* ── Collapsible tree node components ── */
const AreaBranch: React.FC<{
  area: AreaNode;
  filter: string;
  highlightMap?: Map<string, HighlightStatus>;
  showHighlights: boolean;
}> = ({ area, filter, highlightMap, showHighlights }) => {
  const [open, setOpen] = useState(true);
  const filterLower = filter.toLowerCase();

  const visibleSubs = area.subAreas.filter(sub =>
    !filter || sub.parents.some(p =>
      p.assets.some(a =>
        a.asset_number.toLowerCase().includes(filterLower) ||
        a.asset_name.toLowerCase().includes(filterLower)
      )
    )
  );
  if (visibleSubs.length === 0) return null;

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full text-left py-1.5 px-2 rounded hover:bg-muted/50 transition-colors"
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{area.code}</span>
        <span className="text-sm font-semibold text-foreground">{area.label}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{area.subAreas.reduce((s, sa) => s + sa.parents.reduce((ps, p) => ps + p.assets.length, 0), 0)}</span>
      </button>
      {open && (
        <div className="ml-5 border-l border-border/50 pl-3 space-y-0.5">
          {visibleSubs.map(sub => (
            <SubAreaBranch key={sub.label} sub={sub} filter={filter} highlightMap={highlightMap} showHighlights={showHighlights} />
          ))}
        </div>
      )}
    </div>
  );
};

const SubAreaBranch: React.FC<{
  sub: SubAreaNode;
  filter: string;
  highlightMap?: Map<string, HighlightStatus>;
  showHighlights: boolean;
}> = ({ sub, filter, highlightMap, showHighlights }) => {
  const [open, setOpen] = useState(!!filter);
  const filterLower = filter.toLowerCase();

  const visibleParents = sub.parents.filter(p =>
    !filter || p.assets.some(a =>
      a.asset_number.toLowerCase().includes(filterLower) ||
      a.asset_name.toLowerCase().includes(filterLower)
    )
  );
  if (visibleParents.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full text-left py-1 px-2 rounded hover:bg-muted/30 text-xs"
      >
        {open ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        <span className="font-medium text-muted-foreground">{sub.label}</span>
      </button>
      {open && (
        <div className="ml-4 border-l border-border/30 pl-2 space-y-0.5">
          {visibleParents.map(parent => (
            <ParentBranch key={parent.label} parent={parent} filter={filter} highlightMap={highlightMap} showHighlights={showHighlights} />
          ))}
        </div>
      )}
    </div>
  );
};

const ParentBranch: React.FC<{
  parent: ParentNode;
  filter: string;
  highlightMap?: Map<string, HighlightStatus>;
  showHighlights: boolean;
}> = ({ parent, filter, highlightMap, showHighlights }) => {
  const [open, setOpen] = useState(!!filter);
  const filterLower = filter.toLowerCase();

  const assets = filter
    ? parent.assets.filter(a =>
        a.asset_number.toLowerCase().includes(filterLower) ||
        a.asset_name.toLowerCase().includes(filterLower)
      )
    : parent.assets;
  if (assets.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full text-left py-0.5 px-2 rounded hover:bg-muted/20 text-[11px]"
      >
        {open ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        <span className="font-semibold text-foreground/70">{parent.label}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{assets.length}</span>
      </button>
      {open && (
        <div className="ml-4 pl-2 space-y-px">
          {assets.map(a => {
            const hl = showHighlights && highlightMap ? highlightMap.get(a.asset_number) : null;
            let bgClass = "";
            if (hl === "new") bgClass = "bg-green-50 dark:bg-green-950/30 border-l-2 border-l-green-500";
            else if (hl === "moved") bgClass = "bg-amber-50 dark:bg-amber-950/30 border-l-2 border-l-amber-500";
            else if (hl === "missing") bgClass = "bg-red-50 dark:bg-red-950/30 border-l-2 border-l-red-500";

            return (
              <div key={a.asset_number} className={`flex items-center gap-2 py-0.5 px-2 rounded text-xs ${bgClass}`}>
                <span className="font-mono font-medium w-[110px] flex-shrink-0 truncate text-foreground" title={a.asset_number}>{a.asset_number}</span>
                <span className="flex-1 truncate text-muted-foreground" title={a.asset_name}>{a.asset_name}</span>
                {hl === "new" && <Badge variant="default" className="text-[9px] px-1 py-0 h-3.5">NEW</Badge>}
                {hl === "moved" && <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">MOVED</Badge>}
                {hl === "missing" && <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 border-red-500 text-red-700 dark:text-red-400">REVIEW</Badge>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Independent tree panel ── */
const TreePanel: React.FC<{
  title: string;
  subtitle: string;
  tree: AreaNode[];
  totalAssets: number;
  filter: string;
  onFilterChange: (v: string) => void;
  highlightMap?: Map<string, HighlightStatus>;
  showHighlights: boolean;
  onToggleHighlights?: () => void;
  side: "left" | "right";
}> = ({ title, subtitle, tree, totalAssets, filter, onFilterChange, highlightMap, showHighlights, onToggleHighlights, side }) => {
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* Header */}
      <div className={`bg-card border-b border-border px-4 py-3 ${side === "left" ? "rounded-tl-lg" : "rounded-tr-lg"}`}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          </div>
          <Badge variant="secondary" className="text-[10px]">{totalAssets} assets</Badge>
        </div>

        {/* Search */}
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search this tree..."
            value={filter}
            onChange={e => onFilterChange(e.target.value)}
            className="pl-8 pr-8 h-8 text-xs"
          />
          {filter && (
            <Button variant="ghost" size="sm" className="absolute right-0.5 top-1/2 -translate-y-1/2 h-6 w-6 p-0" onClick={() => onFilterChange("")}>
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Highlight toggle (Rev B only) */}
        {onToggleHighlights && (
          <div className="flex items-center gap-2 mt-2">
            <Switch id="highlight-toggle" checked={showHighlights} onCheckedChange={onToggleHighlights} className="scale-75" />
            <Label htmlFor="highlight-toggle" className="text-[10px] text-muted-foreground cursor-pointer flex items-center gap-1">
              {showHighlights ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              Structural highlights
            </Label>
          </div>
        )}
      </div>

      {/* Tree body */}
      <ScrollArea className="h-[calc(100vh-340px)] min-h-[500px]">
        <div className="p-3 space-y-0.5">
          {tree.map(area => (
            <AreaBranch key={area.code} area={area} filter={filter} highlightMap={highlightMap} showHighlights={showHighlights} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

/* ── Main component ── */
export const RevBComparisonView: React.FC = () => {
  const [filterA, setFilterA] = useState("");
  const [filterB, setFilterB] = useState("");
  const [showHighlights, setShowHighlights] = useState(false);

  const { data: revA, isLoading: loadA } = useRevAAssets();
  const { data: revB, isLoading: loadB } = useRevBAssets();

  const treeA = useMemo(() => (revA ? buildTree(revA) : []), [revA]);
  const treeB = useMemo(() => (revB ? buildTree(revB) : []), [revB]);
  const highlightMap = useMemo(() => (revA && revB ? buildHighlightMap(revA, revB) : new Map<string, HighlightStatus>()), [revA, revB]);

  if (loadA || loadB) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading asset trees…</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-3">
        <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold text-foreground">Dual Tree View — READ-ONLY</p>
          <p className="text-muted-foreground">Two independent asset trees displayed side-by-side. Rev A is locked. Rev B is built from the 2026 P&ID set. No data is merged, synced, or modified.</p>
        </div>
      </div>

      {/* Optional legend with tooltip definitions (only when highlights enabled) */}
      {showHighlights && (
        <TooltipProvider delayDuration={200}>
          <div className="flex flex-wrap items-center gap-4 text-xs bg-muted/30 border border-border rounded-lg px-4 py-2.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1.5 cursor-help">
                  <span className="w-3 h-3 rounded-sm bg-green-500" />
                  <span className="font-medium">New in Rev B</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[260px] text-xs">
                <p className="font-semibold">Green — New Asset</p>
                <p className="text-muted-foreground mt-0.5">Asset exists only in Rev B. This is a new physical asset identified in the updated 2026 P&ID set that was not present in the original Rev A structure.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1.5 cursor-help">
                  <span className="w-3 h-3 rounded-sm bg-red-500" />
                  <span className="font-medium">Rev A Only</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[280px] text-xs">
                <p className="font-semibold">Red — Requires Engineering Review</p>
                <p className="text-muted-foreground mt-0.5">Asset exists only in Rev A and is not present in the updated P&ID. This does NOT mean automatic deletion. Red items require manual engineering approval before any removal action is taken.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1.5 cursor-help">
                  <span className="w-3 h-3 rounded-sm bg-amber-500" />
                  <span className="font-medium">Structural Move</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[280px] text-xs">
                <p className="font-semibold">Orange — Structural Reclassification</p>
                <p className="text-muted-foreground mt-0.5">Asset exists in both Rev A and Rev B but is located under a different parent header. This indicates a structural reclassification, not a deletion. The asset has been repositioned in the hierarchy based on the updated P&ID layout.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1.5 cursor-help">
                  <span className="w-3 h-3 rounded-sm border border-border bg-background" />
                  <span className="font-medium">Unchanged</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[220px] text-xs">
                <p className="font-semibold">No Highlight — Unchanged</p>
                <p className="text-muted-foreground mt-0.5">Asset exists in both revisions at the same location. No structural difference detected.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help ml-auto" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[300px] text-xs">
                <p className="font-semibold">Highlight Mode — Read Only</p>
                <p className="text-muted-foreground mt-0.5">No automatic deletion is permitted. Red items require manual engineering approval before removal. Orange items indicate reclassification only — no data is merged or synced.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}

      {/* Dual tree panels */}
      <div className="flex gap-0 border border-border rounded-lg overflow-hidden bg-card">
        <TreePanel
          title="Processing Plant – Rev A (Original Build)"
          subtitle="Locked baseline • No modifications"
          tree={treeA}
          totalAssets={revA?.length || 0}
          filter={filterA}
          onFilterChange={setFilterA}
          showHighlights={false}
          side="left"
        />
        <div className="w-px bg-border flex-shrink-0" />
        <TreePanel
          title="Processing Plant – Rev B (2026 P&ID Rebuild)"
          subtitle="Built from updated P&ID documents"
          tree={treeB}
          totalAssets={revB?.length || 0}
          filter={filterB}
          onFilterChange={setFilterB}
          highlightMap={highlightMap}
          showHighlights={showHighlights}
          onToggleHighlights={() => setShowHighlights(!showHighlights)}
          side="right"
        />
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-center py-1">
        Two independent hierarchical structures • No comparison logic applied to Rev A • No data modified
      </div>
    </div>
  );
};
