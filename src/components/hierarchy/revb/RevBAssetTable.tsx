import React from "react";
import { Plus, Pencil, Minus, Check, Tag, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComponentSpec {
  componentCode?: string;
  componentType?: string;
  componentName?: string;
  manufacturer?: string;
}

export interface RevBAsset {
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
  pid_tags: string[] | null;
  components?: ComponentSpec[] | null;
}

export const CHANGE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  Unchanged: { icon: <Check className="h-3 w-3" />, color: "bg-muted text-muted-foreground", label: "Unchanged" },
  New: { icon: <Plus className="h-3 w-3" />, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", label: "New" },
  Modified: { icon: <Pencil className="h-3 w-3" />, color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300", label: "Modified" },
  Removed: { icon: <Minus className="h-3 w-3" />, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", label: "Removed" },
};

export const DiffSummary: React.FC<{ assets: RevBAsset[] }> = ({ assets }) => {
  const counts = {
    Unchanged: assets.filter(a => a.change_type === "Unchanged").length,
    New: assets.filter(a => a.change_type === "New").length,
    Modified: assets.filter(a => a.change_type === "Modified").length,
    Removed: assets.filter(a => a.change_type === "Removed").length,
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {Object.entries(counts).map(([type, count]) => {
        if (count === 0) return null;
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

// Component suffixes that indicate Level 7 sub-equipment
const COMPONENT_SUFFIXES = ["-LCS", "-MCC", "-MTR", "-VSD", "-BRG", "-GBX", "-CPL", "-EXA-LCS", "-EXB-LCS", "-EXA", "-EXB", "-PIP"];

function getParentAssetNumber(assetNumber: string): string | null {
  // Try longest suffixes first
  for (const suffix of COMPONENT_SUFFIXES.sort((a, b) => b.length - a.length)) {
    if (assetNumber.endsWith(suffix)) {
      return assetNumber.slice(0, -suffix.length);
    }
  }
  return null;
}

interface EquipmentGroup {
  equipment: RevBAsset;
  components: RevBAsset[];
}

function groupEquipmentAndComponents(items: RevBAsset[]): (EquipmentGroup | RevBAsset)[] {
  // Separate items into equipment and components
  const componentMap = new Map<string, RevBAsset[]>();
  const equipmentList: RevBAsset[] = [];

  for (const item of items) {
    const parentId = getParentAssetNumber(item.asset_number);
    if (parentId) {
      if (!componentMap.has(parentId)) componentMap.set(parentId, []);
      componentMap.get(parentId)!.push(item);
    } else {
      equipmentList.push(item);
    }
  }

  const result: (EquipmentGroup | RevBAsset)[] = [];

  // Match components to their parent equipment
  const usedComponentKeys = new Set<string>();
  for (const equip of equipmentList) {
    const comps = componentMap.get(equip.asset_number);
    if (comps && comps.length > 0) {
      result.push({ equipment: equip, components: comps });
      usedComponentKeys.add(equip.asset_number);
    } else {
      result.push(equip);
    }
  }

  // Orphaned components (parent equipment row doesn't exist) — create virtual parent
  for (const [parentId, comps] of componentMap.entries()) {
    if (!usedComponentKeys.has(parentId)) {
      // Derive a name from the first component
      const firstName = comps[0].asset_name;
      // Strip the component type suffix from the name (e.g. "Elution Pump 1 LCS" -> "Elution Pump 1")
      const cleanName = firstName
        .replace(/\s+(LCS|MCC Cell|MCC|Motor|VSD|Bearing|Gearbox|Coupling|Exciter [AB]|Pipework)$/i, "")
        .trim();
      const virtualParent: RevBAsset = {
        id: `virtual-${parentId}`,
        area_code: comps[0].area_code,
        area_label: comps[0].area_label,
        sub_area: comps[0].sub_area,
        parent_asset_label: comps[0].parent_asset_label,
        asset_number: parentId,
        asset_name: cleanName,
        change_type: comps[0].change_type,
        rev_status: comps[0].rev_status,
        notes: "",
        sort_order: comps[0].sort_order,
        pid_tags: null,
      };
      result.push({ equipment: virtualParent, components: comps });
    }
  }

  return result;
}

const ComponentRow: React.FC<{ asset: RevBAsset }> = ({ asset }) => {
  const cfg = CHANGE_CONFIG[asset.change_type] || CHANGE_CONFIG.New;
  // Extract just the component type from the name
  const parentId = getParentAssetNumber(asset.asset_number);
  const suffix = parentId ? asset.asset_number.slice(parentId.length + 1) : asset.asset_number;
  
  return (
    <tr className="border-b border-border/20 hover:bg-muted/20">
      <td className="p-1 w-16">
        <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium ${cfg.color}`}>
          {cfg.icon}
        </span>
      </td>
      <td className="p-1 pl-6 font-mono text-[11px] text-muted-foreground w-32">
        └ {suffix}
      </td>
      <td className="p-1 text-[11px] text-muted-foreground">{asset.asset_name}</td>
      <td className="p-1 w-8">
        {asset.pid_tags && asset.pid_tags.length > 0 && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Tag className="h-3 w-3 text-blue-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-[10px] font-semibold mb-0.5">P&ID Tag(s)</p>
                {asset.pid_tags.map((tag, i) => (
                  <p key={i} className="text-xs font-mono">{tag}</p>
                ))}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </td>
    </tr>
  );
};

export const AssetTable: React.FC<{ assets: RevBAsset[]; filter: string }> = ({ assets, filter }) => {
  // Normalize P&ID tags by stripping leading zeros (04-FE-100 → 4-FE-100)
  const normalizeTag = (t: string) => t.toLowerCase().replace(/^0+(?=\d)/, "");
  const filtered = filter
    ? (() => {
        const q = filter.toLowerCase();
        const nq = normalizeTag(q);
        return assets.filter(a => {
          return (
            a.asset_number.toLowerCase().includes(q) ||
            a.asset_name.toLowerCase().includes(q) ||
            a.area_label.toLowerCase().includes(q) ||
            a.parent_asset_label.toLowerCase().includes(q) ||
            a.sub_area.toLowerCase().includes(q) ||
            (a.pid_tags && a.pid_tags.some(tag => tag.toLowerCase().includes(q) || normalizeTag(tag).includes(nq)))
          );
        });
      })()
    : assets;

  // Group by area → sub-area → parent
  const grouped = new Map<string, Map<string, RevBAsset[]>>();
  for (const a of filtered) {
    const areaKey = `${a.area_code} – ${a.area_label}`;
    if (!grouped.has(areaKey)) grouped.set(areaKey, new Map());
    const subMap = grouped.get(areaKey)!;
    const subKey = a.sub_area;
    if (!subMap.has(subKey)) subMap.set(subKey, []);
    subMap.get(subKey)!.push(a);
  }

  return (
    <div className="space-y-6 max-h-[600px] overflow-auto">
      {Array.from(grouped.entries()).map(([areaKey, subAreas]) => (
        <div key={areaKey}>
          <h3 className="text-sm font-bold text-foreground sticky top-0 bg-card py-1.5 border-b-2 border-primary/30 mb-2 z-10">
            {areaKey}
          </h3>
          {Array.from(subAreas.entries()).map(([subArea, subAssets]) => {
            // Group by parent_asset_label within sub-area
            const parentGroups = new Map<string, RevBAsset[]>();
            for (const a of subAssets) {
              if (!parentGroups.has(a.parent_asset_label)) parentGroups.set(a.parent_asset_label, []);
              parentGroups.get(a.parent_asset_label)!.push(a);
            }
            return (
              <div key={subArea} className="ml-2 mb-4">
                <h4 className="text-xs font-semibold text-primary sticky top-8 bg-card py-1 border-b border-border mb-1 z-[5]">
                  {subArea} <span className="text-muted-foreground font-normal">({subAssets.length})</span>
                </h4>
                {Array.from(parentGroups.entries()).map(([parent, items]) => {
                  const groupedItems = groupEquipmentAndComponents(items);
                  return (
                    <div key={parent} className="ml-3 mb-2">
                      <p className="text-[11px] font-medium text-muted-foreground mb-0.5">▸ {parent}</p>
                      <table className="w-full text-xs ml-2">
                        <tbody>
                          {groupedItems.map(item => {
                            if ('equipment' in item && 'components' in item) {
                              const group = item as EquipmentGroup;
                              const cfg = CHANGE_CONFIG[group.equipment.change_type] || CHANGE_CONFIG.New;
                              const isVirtual = group.equipment.id.startsWith("virtual-");
                              return (
                                <React.Fragment key={group.equipment.id}>
                                  <tr className="border-b border-border/30 hover:bg-muted/30">
                                    <td className="p-1 w-16">
                                      <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium ${cfg.color}`}>
                                        {cfg.icon}
                                      </span>
                                    </td>
                                    <td className="p-1 font-mono font-medium text-primary w-32">
                                      {group.equipment.asset_number}
                                    </td>
                                    <td className="p-1">{group.equipment.asset_name}</td>
                                    <td className="p-1 w-8">
                                      {group.equipment.pid_tags && group.equipment.pid_tags.length > 0 && (
                                        <TooltipProvider delayDuration={200}>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Tag className="h-3.5 w-3.5 text-blue-500 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent side="left" className="max-w-xs">
                                              <p className="text-[10px] font-semibold mb-0.5">P&ID Tag(s)</p>
                                              {group.equipment.pid_tags.map((tag, i) => (
                                                <p key={i} className="text-xs font-mono">{tag}</p>
                                              ))}
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </td>
                                  </tr>
                                  {group.components.map(comp => (
                                    <ComponentRow key={comp.id} asset={comp} />
                                  ))}
                                </React.Fragment>
                              );
                            } else {
                              const a = item as RevBAsset;
                              const cfg = CHANGE_CONFIG[a.change_type] || CHANGE_CONFIG.New;
                              return (
                                <tr key={a.id} className="border-b border-border/30 hover:bg-muted/30">
                                  <td className="p-1 w-16">
                                    <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium ${cfg.color}`}>
                                      {cfg.icon}
                                    </span>
                                  </td>
                                  <td className="p-1 font-mono font-medium text-primary w-32">{a.asset_number}</td>
                                  <td className="p-1">{a.asset_name}</td>
                                  <td className="p-1 w-8">
                                    {a.pid_tags && a.pid_tags.length > 0 && (
                                      <TooltipProvider delayDuration={200}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Tag className="h-3.5 w-3.5 text-blue-500 cursor-help" />
                                          </TooltipTrigger>
                                          <TooltipContent side="left" className="max-w-xs">
                                            <p className="text-[10px] font-semibold mb-0.5">P&ID Tag(s)</p>
                                            {a.pid_tags.map((tag, i) => (
                                              <p key={i} className="text-xs font-mono">{tag}</p>
                                            ))}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No assets match the filter.</p>
      )}
    </div>
  );
};
