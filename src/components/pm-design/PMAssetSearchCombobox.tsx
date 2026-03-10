import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, MapPin } from "lucide-react";
import { useRevBPlantAssets } from "@/hooks/useProcessingPlantAssets";
import { cn } from "@/lib/utils";

interface FlatAsset {
  assetId: string;
  assetName: string;
  area: string;
  areaCode: string;
  subArea: string;
  parentAsset: string;
  isSubArea?: boolean;
}

interface PMAssetSearchComboboxProps {
  value: string;
  onChange: (assetId: string, assetName: string, area?: string) => void;
  className?: string;
  compact?: boolean;
}

/** Parse comma-separated asset IDs into an array */
function parseValues(value: string): string[] {
  if (!value.trim()) return [];
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

export const PMAssetSearchCombobox = ({
  value,
  onChange,
  className,
  compact = false,
}: PMAssetSearchComboboxProps) => {
  const { data: areas } = useRevBPlantAssets();

  const assets = useMemo<FlatAsset[]>(() => {
    if (!areas) return [];
    const result: FlatAsset[] = [];
    const seenSubAreas = new Set<string>();
    const seenSystems = new Set<string>();
    for (const area of areas) {
      for (const subArea of area.subAreas) {
        // Add sub-area as a selectable entry
        const subAreaKey = `${area.code}-${subArea.label}`;
        if (!seenSubAreas.has(subAreaKey)) {
          seenSubAreas.add(subAreaKey);
          result.push({
            assetId: subArea.label,
            assetName: subArea.label,
            area: area.label,
            areaCode: area.code,
            subArea: subArea.label,
            parentAsset: "",
            isSubArea: true,
          });
        }
        for (const parent of subArea.parentAssets) {
          // Add parent asset (system header) as a selectable entry
          const sysKey = `${area.code}-${subArea.label}-${parent.label}`;
          if (!seenSystems.has(sysKey)) {
            seenSystems.add(sysKey);
            result.push({
              assetId: parent.label,
              assetName: parent.label,
              area: area.label,
              areaCode: area.code,
              subArea: subArea.label,
              parentAsset: "",
              isSubArea: true,
            });
          }
          for (const eq of parent.equipment) {
            result.push({
              assetId: eq.assetNumber,
              assetName: eq.name,
              area: area.label,
              subArea: subArea.label,
              parentAsset: parent.label,
            });
          }
        }
      }
    }
    return result;
  }, [areas]);

  const selectedIds = useMemo(() => parseValues(value), [value]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const selected = new Set(selectedIds);
    const pool = assets.filter((a) => !selected.has(a.assetId));
    if (!search.trim()) return pool.slice(0, 200);
    const q = search.toLowerCase();
    return pool.filter(
      (a) =>
        a.assetId.toLowerCase().includes(q) ||
        a.assetName.toLowerCase().includes(q) ||
        a.area.toLowerCase().includes(q) ||
        a.parentAsset.toLowerCase().includes(q)
    );
  }, [search, assets, selectedIds]);

  const addAsset = (asset: FlatAsset) => {
    const newIds = [...selectedIds, asset.assetId];
    onChange(newIds.join(", "), asset.assetName, asset.area);
    setSearch("");
  };

  const removeAsset = (assetId: string) => {
    const newIds = selectedIds.filter((id) => id !== assetId);
    if (newIds.length === 0) {
      onChange("", "");
    } else {
      const lastAsset = assets.find((a) => a.assetId === newIds[newIds.length - 1]);
      onChange(newIds.join(", "), lastAsset?.assetName || "", lastAsset?.area);
    }
  };

  const selectedAssets = selectedIds.map((id) => assets.find((a) => a.assetId === id)).filter(Boolean) as FlatAsset[];

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="flex items-center gap-1 flex-wrap">
        {selectedAssets.map((asset) => (
          <span
            key={asset.assetId}
            className={cn(
              "inline-flex items-center gap-0.5 bg-primary/10 text-primary rounded px-1.5 font-mono font-semibold flex-shrink-0",
              compact ? "text-[10px] py-0" : "text-xs py-0.5"
            )}
          >
            {asset.assetId}
            <button
              onClick={() => removeAsset(asset.assetId)}
              className="p-0 hover:bg-primary/20 rounded print-hide"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground print-hide" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={selectedIds.length > 0 ? "Add another asset..." : "Search asset tree..."}
            className={cn(
              "pl-7 pr-2 border-none shadow-none focus-visible:ring-0 bg-transparent print-hide",
              compact ? "h-auto text-xs py-0" : "h-8 text-sm"
            )}
          />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg min-w-[400px] max-h-72 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 h-72">
            {filtered.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground text-center">
                No assets found
              </div>
            ) : (
              <div className="py-1">
                {filtered.map((asset) => (
                  <button
                    key={`${asset.assetId}-${asset.area}-${asset.subArea}-${asset.isSubArea ? 'sub' : 'eq'}`}
                    className="w-full text-left px-3 py-2 hover:bg-muted/60 flex flex-col gap-0.5 transition-colors"
                    onClick={() => addAsset(asset)}
                  >
                    <div className="flex items-center gap-2">
                      {asset.isSubArea ? (
                        <>
                          <MapPin className="h-3 w-3 text-amber-600" />
                          <span className="font-semibold text-xs text-foreground">
                            {asset.assetName}
                          </span>
                          <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 rounded">
                            Sub-Area
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-mono font-semibold text-xs text-primary">
                            {asset.assetId}
                          </span>
                          <span className="text-xs text-foreground">
                            {asset.assetName}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5" />
                      <span className="truncate">
                        {asset.area}{asset.parentAsset ? ` › ${asset.parentAsset}` : ''}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
