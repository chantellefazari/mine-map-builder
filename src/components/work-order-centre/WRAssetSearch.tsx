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
  subArea: string;
  parentAsset: string;
}

interface WRAssetSearchProps {
  value: string;
  onSelect: (assetId: string, assetName: string) => void;
  className?: string;
  showClear?: boolean;
}

export function WRAssetSearch({ value, onSelect, className, showClear = true }: WRAssetSearchProps) {
  const { data: areas } = useRevBPlantAssets();
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

  const assets = useMemo<FlatAsset[]>(() => {
    if (!areas) return [];
    const result: FlatAsset[] = [];
    for (const area of areas) {
      for (const subArea of area.subAreas) {
        for (const parent of subArea.parentAssets) {
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

  const filtered = useMemo(() => {
    if (!search.trim()) return assets.slice(0, 100);
    const q = search.toLowerCase();
    return assets.filter(
      (a) =>
        a.assetId.toLowerCase().includes(q) ||
        a.assetName.toLowerCase().includes(q) ||
        a.parentAsset.toLowerCase().includes(q)
    ).slice(0, 100);
  }, [search, assets]);

  const handleSelect = (asset: FlatAsset) => {
    onSelect(asset.assetId, asset.assetName);
    setSearch("");
    setOpen(false);
  };

  const handleClear = () => {
    onSelect("", "");
    setSearch("");
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={value || search}
          onChange={(e) => {
            if (value) handleClear();
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => { if (!value) setOpen(true); }}
          placeholder="Search asset tree..."
          className="h-9 text-sm pl-8 pr-8"
        />
        {value && showClear && (
          <button onClick={handleClear} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && !value && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg w-full min-w-[380px] max-h-64 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 h-64">
            {filtered.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground text-center">No assets found</div>
            ) : (
              <div className="py-1">
                {filtered.map((asset) => (
                  <button
                    key={`${asset.assetId}-${asset.parentAsset}`}
                    className="w-full text-left px-3 py-2 hover:bg-muted/60 flex flex-col gap-0.5 transition-colors"
                    onClick={() => handleSelect(asset)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-xs text-primary">{asset.assetId}</span>
                      <span className="text-xs text-foreground">{asset.assetName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5" />
                      <span className="truncate">{asset.area} › {asset.parentAsset}</span>
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
}
