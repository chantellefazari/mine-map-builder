import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { areasData, type Area } from "@/components/hierarchy/assetData";

interface AssetLookupResult {
  assetNumber: string;
  name: string;
  area: string;
  subArea: string;
  parentAsset: string;
  functionalLocation: string;
}

interface AssetLookupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: AssetLookupResult) => void;
}

function flattenAssets(areas: Area[]): AssetLookupResult[] {
  const results: AssetLookupResult[] = [];
  areas.forEach((area) => {
    area.subAreas.forEach((subArea) => {
      subArea.parentAssets.forEach((parent) => {
        parent.equipment.forEach((equip) => {
          results.push({
            assetNumber: equip.assetNumber,
            name: equip.name,
            area: `${area.code} – ${area.label}`,
            subArea: subArea.label,
            parentAsset: parent.label,
            functionalLocation: `${parent.label} > ${equip.name}`,
          });
        });
      });
    });
  });
  return results;
}

const allAssets = flattenAssets(areasData);

export const AssetLookupDialog = ({ open, onOpenChange, onSelect }: AssetLookupDialogProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return allAssets.slice(0, 50);
    const q = query.toLowerCase();
    return allAssets.filter(
      (a) =>
        a.assetNumber.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.parentAsset.toLowerCase().includes(q) ||
        a.subArea.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [query]);

  const handleSelect = (asset: AssetLookupResult) => {
    onSelect(asset);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setQuery(""); }}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Asset Hierarchy</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by asset number, name, or area (e.g. apron feeder, CV01)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <ScrollArea className="flex-1 max-h-[55vh]">
          <div className="space-y-1 pr-3">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No assets found</p>
            ) : (
              filtered.map((asset) => (
                <button
                  key={asset.assetNumber}
                  onClick={() => handleSelect(asset)}
                  className="w-full text-left p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-primary">{asset.assetNumber}</span>
                        <span className="text-sm text-foreground truncate">{asset.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {asset.area} › {asset.subArea} › {asset.parentAsset}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 ml-2">Select</Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
        <p className="text-xs text-muted-foreground text-center">
          Showing {filtered.length} of {allAssets.length} assets
        </p>
      </DialogContent>
    </Dialog>
  );
};
