import React from "react";
import { Plus, Pencil, Minus, Check } from "lucide-react";

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

export const AssetTable: React.FC<{ assets: RevBAsset[]; filter: string }> = ({ assets, filter }) => {
  const filtered = filter
    ? assets.filter(a =>
        a.asset_number.toLowerCase().includes(filter.toLowerCase()) ||
        a.asset_name.toLowerCase().includes(filter.toLowerCase()) ||
        a.area_label.toLowerCase().includes(filter.toLowerCase()) ||
        a.parent_asset_label.toLowerCase().includes(filter.toLowerCase()) ||
        a.sub_area.toLowerCase().includes(filter.toLowerCase())
      )
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
                {Array.from(parentGroups.entries()).map(([parent, items]) => (
                  <div key={parent} className="ml-3 mb-2">
                    <p className="text-[11px] font-medium text-muted-foreground mb-0.5">▸ {parent}</p>
                    <table className="w-full text-xs ml-2">
                      <tbody>
                        {items.map(a => {
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
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
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
