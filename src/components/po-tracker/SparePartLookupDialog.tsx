import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Check, Package, GitBranch } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRevBPlantAssets } from "@/hooks/useProcessingPlantAssets";

interface SpareResult {
  id: string;
  part_number: string;
  description: string;
  category: string | null;
  bin_location: string | null;
  qty_on_hand: number | null;
  unit_cost: number | null;
  preferred_supplier: string | null;
}

interface FlatComponent {
  componentCode: string;
  componentType: string;
  componentName: string;
  manufacturer: string;
  parentAsset: string;
  assetNumber: string;
  area: string;
}

interface SparePartLookupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (spare: SpareResult) => void;
}

export const SparePartLookupDialog = ({ open, onOpenChange, onSelect }: SparePartLookupDialogProps) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SpareResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("catalogue");
  const { data: revBData } = useRevBPlantAssets();

  // Flatten asset tree components from Rev B
  const flatComponents = useMemo(() => {
    const items: FlatComponent[] = [];
    (revBData || []).forEach((area) => {
      area.subAreas.forEach((sub) => {
        sub.parentAssets.forEach((parent) => {
          parent.equipment.forEach((equip) => {
            equip.components?.forEach((comp) => {
              items.push({
                componentCode: comp.componentCode,
                componentType: comp.componentType,
                componentName: comp.componentName,
                manufacturer: comp.manufacturer,
                parentAsset: parent.label,
                assetNumber: equip.assetNumber,
                area: area.label,
              });
            });
          });
        });
      });
    });
    return items;
  }, [revBData]);

  // Filter components by search
  const filteredComponents = useMemo(() => {
    if (!search.trim() || search.trim().length < 2) return [];
    const term = search.toLowerCase();
    return flatComponents.filter(
      (c) =>
        c.componentName.toLowerCase().includes(term) ||
        c.componentCode.toLowerCase().includes(term) ||
        c.componentType.toLowerCase().includes(term) ||
        c.manufacturer.toLowerCase().includes(term) ||
        c.parentAsset.toLowerCase().includes(term) ||
        c.assetNumber.toLowerCase().includes(term)
    ).slice(0, 30);
  }, [search, flatComponents]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setResults([]);
      setTab("catalogue");
    }
  }, [open]);

  // Catalogue search
  useEffect(() => {
    if (tab !== "catalogue" || !search.trim() || search.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const term = `%${search.trim()}%`;
      const { data, error } = await (supabase as any)
        .from("site_spares")
        .select("id, part_number, description, category, bin_location, qty_on_hand, unit_cost, preferred_supplier")
        .or(`description.ilike.${term},part_number.ilike.${term},oem_part_number.ilike.${term}`)
        .limit(20);

      if (!error && data) {
        setResults(data as SpareResult[]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, tab]);

  const handleSelect = (spare: SpareResult) => {
    onSelect(spare);
    onOpenChange(false);
  };

  const handleSelectComponent = (comp: FlatComponent) => {
    onSelect({
      id: comp.componentCode,
      part_number: comp.componentCode,
      description: `${comp.componentName} (${comp.componentType})`,
      category: comp.componentType,
      bin_location: null,
      qty_on_hand: null,
      unit_cost: null,
      preferred_supplier: comp.manufacturer || null,
    });
    onOpenChange(false);
  };

  const emptyState = (
    <p className="text-sm text-muted-foreground text-center py-8">
      {search.trim().length < 2 ? "Type at least 2 characters to search" : "No results found"}
    </p>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Parts</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="catalogue" className="gap-1.5 text-xs">
              <Package className="h-3.5 w-3.5" /> Site Spares Catalogue
            </TabsTrigger>
            <TabsTrigger value="asset-tree" className="gap-1.5 text-xs">
              <GitBranch className="h-3.5 w-3.5" /> Asset Tree Components
            </TabsTrigger>
          </TabsList>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tab === "catalogue" ? "Search by part number, description, or OEM number…" : "Search by component name, code, asset, or manufacturer…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          <TabsContent value="catalogue" className="flex-1 overflow-y-auto min-h-0 border rounded-lg mt-3 data-[state=inactive]:hidden">
            {loading && <p className="text-sm text-muted-foreground text-center py-8">Searching…</p>}
            {!loading && (search.trim().length < 2 || results.length === 0) && emptyState}
            {results.length > 0 && (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted">
                  <tr className="text-left">
                    <th className="p-2 font-medium">Part #</th>
                    <th className="p-2 font-medium">Description</th>
                    <th className="p-2 font-medium">Category</th>
                    <th className="p-2 font-medium text-center">Stock</th>
                    <th className="p-2 font-medium">Bin</th>
                    <th className="p-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((spare) => (
                    <tr key={spare.id} className="border-t hover:bg-muted/50 cursor-pointer" onClick={() => handleSelect(spare)}>
                      <td className="p-2 font-mono text-xs">{spare.part_number || "—"}</td>
                      <td className="p-2 text-xs max-w-[200px] truncate">{spare.description}</td>
                      <td className="p-2">{spare.category && <Badge variant="secondary" className="text-[10px]">{spare.category}</Badge>}</td>
                      <td className="p-2 text-center text-xs">{spare.qty_on_hand ?? 0}</td>
                      <td className="p-2 text-xs text-muted-foreground">{spare.bin_location || "—"}</td>
                      <td className="p-2">
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Check className="h-3.5 w-3.5 text-primary" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </TabsContent>

          <TabsContent value="asset-tree" className="flex-1 overflow-y-auto min-h-0 border rounded-lg mt-3 data-[state=inactive]:hidden">
            {search.trim().length < 2 || filteredComponents.length === 0 ? emptyState : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted">
                  <tr className="text-left">
                    <th className="p-2 font-medium">Code</th>
                    <th className="p-2 font-medium">Component</th>
                    <th className="p-2 font-medium">Type</th>
                    <th className="p-2 font-medium">Manufacturer</th>
                    <th className="p-2 font-medium">Parent Asset</th>
                    <th className="p-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComponents.map((comp, i) => (
                    <tr key={`${comp.componentCode}-${i}`} className="border-t hover:bg-muted/50 cursor-pointer" onClick={() => handleSelectComponent(comp)}>
                      <td className="p-2 font-mono text-xs">{comp.componentCode}</td>
                      <td className="p-2 text-xs max-w-[180px] truncate">{comp.componentName}</td>
                      <td className="p-2"><Badge variant="secondary" className="text-[10px]">{comp.componentType}</Badge></td>
                      <td className="p-2 text-xs text-muted-foreground">{comp.manufacturer || "—"}</td>
                      <td className="p-2 text-xs">{comp.parentAsset} <span className="text-muted-foreground">({comp.assetNumber})</span></td>
                      <td className="p-2">
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Check className="h-3.5 w-3.5 text-primary" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </TabsContent>
        </Tabs>

        <p className="text-[11px] text-muted-foreground">
          {tab === "catalogue" ? "Showing up to 20 results from Site Spares Catalogue" : `Showing up to 30 results from Asset Tree (${flatComponents.length} components indexed)`}
        </p>
      </DialogContent>
    </Dialog>
  );
};
