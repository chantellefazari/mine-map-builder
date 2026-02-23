import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, MapPin } from "lucide-react";
import { flattenAssetTree, FlatAsset } from "@/utils/flattenAssetTree";
import { cn } from "@/lib/utils";

interface PMAssetSearchComboboxProps {
  value: string;
  onChange: (assetId: string, assetName: string, area?: string) => void;
  className?: string;
  compact?: boolean;
}

export const PMAssetSearchCombobox = ({
  value,
  onChange,
  className,
  compact = false,
}: PMAssetSearchComboboxProps) => {
  const assets = useMemo(() => flattenAssetTree(), []);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
    if (!search.trim()) return assets.slice(0, 50);
    const q = search.toLowerCase();
    return assets.filter(
      (a) =>
        a.assetId.toLowerCase().includes(q) ||
        a.assetName.toLowerCase().includes(q) ||
        a.area.toLowerCase().includes(q) ||
        a.parentAsset.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [search, assets]);

  const selectedAsset = assets.find((a) => a.assetId === value);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="flex items-center gap-1">
        {value ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <span className={cn("truncate", compact ? "text-xs" : "text-sm")}>
              {value}
            </span>
            {selectedAsset && !compact && (
              <span className="text-muted-foreground text-xs truncate">
                ({selectedAsset.assetName})
              </span>
            )}
            <button
              onClick={() => {
                onChange("", "");
                setSearch("");
              }}
              className="ml-1 p-0.5 hover:bg-muted rounded flex-shrink-0 print-hide"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search asset tree..."
              className={cn(
                "pl-7 pr-2 border-none shadow-none focus-visible:ring-0 bg-transparent",
                compact ? "h-auto text-xs py-0" : "h-8 text-sm"
              )}
            />
          </div>
        )}
      </div>

      {open && !value && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg">
          <ScrollArea className="max-h-64">
            {filtered.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground text-center">
                No assets found
              </div>
            ) : (
              <div className="py-1">
                {filtered.map((asset) => (
                  <button
                    key={asset.assetId}
                    className="w-full text-left px-3 py-2 hover:bg-muted/60 flex flex-col gap-0.5 transition-colors"
                    onClick={() => {
                      onChange(asset.assetId, asset.assetName, asset.area);
                      setSearch("");
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-xs text-primary">
                        {asset.assetId}
                      </span>
                      <span className="text-xs text-foreground truncate">
                        {asset.assetName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5" />
                      <span className="truncate">
                        {asset.area} › {asset.parentAsset}
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
