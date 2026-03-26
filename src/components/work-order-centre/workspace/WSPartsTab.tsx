import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Search, Download, Package } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { WorkOrderPart } from "@/hooks/useWorkOrderParts";

interface Props {
  woId: string;
  assetId: string;
  parts: WorkOrderPart[];
  addPart: any;
  updatePart: any;
  deletePart: any;
}

interface AssetComponent {
  componentName: string;
  componentType: string;
  model: string;
  manufacturer: string | null;
  serialNumber?: string;
  oilType?: string;
  oilVolume?: string;
  voltage?: string;
  motorSpeed?: string;
  protection?: string;
  pumpFlow?: string;
  operatingPressure?: string;
  inputSpeed?: string;
  outputSpeed?: string;
  weight?: string;
  displacement?: string;
  motorRef?: string;
  pumpRef?: string;
}

export function WSPartsTab({ woId, assetId, parts, addPart, updatePart, deletePart }: Props) {
  const [adding, setAdding] = useState(false);
  const [showCatalogue, setShowCatalogue] = useState(false);
  const [catalogueSearch, setCatalogueSearch] = useState("");
  const [newPart, setNewPart] = useState({ part_number: "", part_description: "", quantity_required: 1 });
  const [loadingComponents, setLoadingComponents] = useState(false);

  // Fetch site_spares for catalogue search
  const { data: spares } = useQuery({
    queryKey: ["site-spares-catalogue"],
    queryFn: async () => {
      let allRows: any[] = [];
      let from = 0;
      const pageSize = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("site_spares")
          .select("id, part_number, description, manufacturer, qty_on_hand, bin_location, category")
          .order("description")
          .range(from, from + pageSize - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        allRows = allRows.concat(data);
        if (data.length < pageSize) break;
        from += pageSize;
      }
      return allRows;
    },
    staleTime: 60_000,
  });

  const filteredSpares = useMemo(() => {
    if (!spares || !catalogueSearch.trim()) return (spares ?? []).slice(0, 50);
    const q = catalogueSearch.toLowerCase();
    return spares.filter(
      (s) =>
        s.description?.toLowerCase().includes(q) ||
        s.part_number?.toLowerCase().includes(q) ||
        s.manufacturer?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [spares, catalogueSearch]);

  const handleAdd = async () => {
    if (!newPart.part_description.trim()) return;
    await addPart.mutateAsync({
      work_order_id: woId,
      part_number: newPart.part_number,
      part_description: newPart.part_description,
      quantity_required: newPart.quantity_required,
    });
    setNewPart({ part_number: "", part_description: "", quantity_required: 1 });
    setAdding(false);
  };

  const handleLoadComponents = async () => {
    if (!assetId?.trim()) {
      toast.error("No asset selected on the Overview tab");
      return;
    }
    setLoadingComponents(true);
    try {
      // Fetch the asset row to get its components
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("asset_number, asset_name, components")
        .eq("asset_number", assetId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error(`Asset "${assetId}" not found in the asset tree`);
        return;
      }

      const raw = data.components;
      let comps: AssetComponent[] = [];
      if (raw) {
        const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (Array.isArray(arr)) {
          comps = arr.map((c: any) => ({
            componentName: c.componentName || "",
            componentType: c.componentType || "",
            model: c.model || "",
            manufacturer: c.manufacturer || null,
          }));
        }
      }

      if (comps.length === 0) {
        toast.info(`${data.asset_name} has no components listed in the asset tree`);
        return;
      }

      // Add each component as a part (skip duplicates already in parts list)
      const existingDescs = new Set(parts.map((p) => p.part_description.toLowerCase()));
      let added = 0;
      for (const comp of comps) {
        const model = comp.model && comp.model.toLowerCase() !== comp.componentName.toLowerCase() ? comp.model : "";
        const desc = model ? `${comp.componentName} – ${model}` : comp.componentName;
        if (existingDescs.has(desc.toLowerCase())) continue;
        await addPart.mutateAsync({
          work_order_id: woId,
          part_number: "",
          part_description: desc,
          quantity_required: 1,
        });
        added++;
      }

      if (added > 0) {
        toast.success(`Added ${added} component(s) from ${data.asset_name}`);
      } else {
        toast.info("All components are already in the parts list");
      }
    } catch (err: any) {
      toast.error("Failed to load components");
    } finally {
      setLoadingComponents(false);
    }
  };

  const handleAddFromCatalogue = async (spare: any) => {
    await addPart.mutateAsync({
      work_order_id: woId,
      part_number: spare.part_number || "",
      part_description: spare.description,
      quantity_required: 1,
    });
    toast.success("Part added from catalogue");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">Parts & Materials</h2>
          <p className="text-xs text-muted-foreground">{parts.length} part(s) linked to this work order</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleLoadComponents}
            size="sm"
            variant="outline"
            className="text-xs gap-1"
            disabled={loadingComponents || !assetId}
          >
            <Download className="w-3 h-3" /> {loadingComponents ? "Loading..." : "Load from Asset"}
          </Button>
          <Button
            onClick={() => setShowCatalogue(!showCatalogue)}
            size="sm"
            variant="outline"
            className="text-xs gap-1"
          >
            <Search className="w-3 h-3" /> Search Catalogue
          </Button>
          <Button onClick={() => setAdding(true)} size="sm" className="text-xs gap-1">
            <Plus className="w-3 h-3" /> Manual Entry
          </Button>
        </div>
      </div>

      {/* Catalogue search panel */}
      {showCatalogue && (
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={catalogueSearch}
                onChange={(e) => setCatalogueSearch(e.target.value)}
                placeholder="Search spare parts catalogue..."
                className="h-8 text-xs pl-8"
                autoFocus
              />
            </div>
          </div>
          <ScrollArea className="h-52">
            {filteredSpares.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">No parts found</div>
            ) : (
              <div className="divide-y divide-border">
                {filteredSpares.map((spare) => (
                  <button
                    key={spare.id}
                    onClick={() => handleAddFromCatalogue(spare)}
                    className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors flex items-center gap-3"
                  >
                    <Package className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {spare.part_number && (
                          <span className="font-mono text-[10px] text-primary font-semibold">{spare.part_number}</span>
                        )}
                        <span className="text-xs text-foreground truncate">{spare.description}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        {spare.manufacturer && <span>{spare.manufacturer}</span>}
                        {spare.category && <span className="bg-muted px-1 rounded">{spare.category}</span>}
                        <span>Stock: {spare.qty_on_hand ?? 0}</span>
                        {spare.bin_location && <span>Bin: {spare.bin_location}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* Manual add */}
      {adding && (
        <div className="border border-primary/30 rounded-lg p-3 bg-primary/5 space-y-2">
          <p className="text-xs font-semibold text-foreground">Manual Entry</p>
          <div className="grid grid-cols-4 gap-2">
            <Input value={newPart.part_number} onChange={(e) => setNewPart((p) => ({ ...p, part_number: e.target.value }))} placeholder="Part number" className="h-8 text-xs" />
            <Input value={newPart.part_description} onChange={(e) => setNewPart((p) => ({ ...p, part_description: e.target.value }))} placeholder="Description" className="h-8 text-xs col-span-2" />
            <Input type="number" value={newPart.quantity_required} onChange={(e) => setNewPart((p) => ({ ...p, quantity_required: parseInt(e.target.value) || 1 }))} className="h-8 text-xs" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="text-xs h-7" onClick={handleAdd} disabled={addPart.isPending}>Add</Button>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Parts table */}
      {parts.length === 0 && !adding && !showCatalogue ? (
        <div className="border border-dashed border-border rounded-lg p-8 text-center text-sm text-muted-foreground">
          No parts added. Use "Load from Asset" to pull components, search the catalogue, or add manually.
        </div>
      ) : parts.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">Part #</th>
                <th className="text-left px-3 py-2 font-semibold">Description</th>
                <th className="text-left px-3 py-2 font-semibold">Qty</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
                <th className="text-left px-3 py-2 font-semibold">Location</th>
                <th className="text-left px-3 py-2 font-semibold">Comment</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 font-mono">{p.part_number || "-"}</td>
                  <td className="px-3 py-2">{p.part_description}</td>
                  <td className="px-3 py-1.5">
                    <Input
                      type="number"
                      min={1}
                      value={p.quantity_required}
                      onChange={(e) => updatePart.mutate({ id: p.id, updates: { quantity_required: parseInt(e.target.value) || 1 } })}
                      className="h-7 w-16 text-xs"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Select value={p.status} onValueChange={(v) => updatePart.mutate({ id: p.id, updates: { status: v } })}>
                      <SelectTrigger className="h-7 text-[10px] w-[110px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Not Ordered", "Ordered", "In Transit", "Received", "Issued"].map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-1.5">
                    <Input
                      value={p.location || ""}
                      onChange={(e) => updatePart.mutate({ id: p.id, updates: { location: e.target.value } })}
                      placeholder="Location"
                      className="h-7 w-24 text-xs"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input
                      value={p.comment || ""}
                      onChange={(e) => updatePart.mutate({ id: p.id, updates: { comment: e.target.value } })}
                      placeholder="Comment"
                      className="h-7 text-xs"
                    />
                  </td>
                  <td className="px-1 py-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deletePart.mutate(p.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
