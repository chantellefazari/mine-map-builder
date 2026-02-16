import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// ScrollArea removed — using native overflow-y-auto for reliable scrolling
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2, Shield, Copy, Search as SearchIcon, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { extractCorePart, calculateCorePartSimilarity } from "@/utils/corePartExtractor";

interface SpareRow {
  id: string;
  part_number: string | null;
  description: string;
  category: string | null;
  manufacturer: string | null;
  oem_part_number: string | null;
  bin_location: string | null;
  image_urls: string[] | null;
  specifications: string | null;
  qty_on_hand: number | null;
  preferred_supplier: string | null;
}

export interface DuplicateGroup {
  matchType: "exact" | "oem" | "similar";
  matchKey: string;
  items: SpareRow[];
}

/** Score a record's "completeness" — higher = richer data, should be kept */
const completenessScore = (r: SpareRow): number => {
  let score = 0;
  if (r.oem_part_number && r.oem_part_number.trim()) score += 3;
  if (r.manufacturer && r.manufacturer.trim()) score += 2;
  if (r.image_urls && r.image_urls.length > 0) score += 4;
  if (r.bin_location && r.bin_location.trim()) score += 1;
  if (r.specifications && r.specifications.trim()) score += 1;
  if (r.preferred_supplier && r.preferred_supplier.trim()) score += 1;
  if ((r.qty_on_hand ?? 0) > 0) score += 1;
  return score;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolved: () => void;
}

export const DuplicateFinderDialog = ({ open, onOpenChange, onResolved }: Props) => {
  const [loading, setLoading] = useState(false);
  const [allSpares, setAllSpares] = useState<SpareRow[]>([]);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("exact");

  // Fetch all spares when dialog opens
  useEffect(() => {
    if (!open) return;
    fetchAll();
  }, [open]);

  const fetchAll = async () => {
    setLoading(true);
    setSelectedForDeletion(new Set());
    const pageSize = 1000;
    let from = 0;
    const all: SpareRow[] = [];
    while (true) {
      const { data, error } = await supabase
        .from("site_spares")
        .select("id, part_number, description, category, manufacturer, oem_part_number, bin_location, image_urls, specifications, qty_on_hand, preferred_supplier")
        .order("created_at", { ascending: true })
        .range(from, from + pageSize - 1);
      if (error) break;
      all.push(...(data || []));
      if ((data || []).length < pageSize) break;
      from += pageSize;
    }
    // Deduplicate by ID to prevent phantom duplicates from React StrictMode double-effects
    const seen = new Set<string>();
    const deduped = all.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    setAllSpares(deduped);
    setLoading(false);
  };

  // ── Duplicate detection ──
  const { exactGroups, oemGroups, similarGroups } = useMemo(() => {
    if (allSpares.length === 0) return { exactGroups: [], oemGroups: [], similarGroups: [] };

    // 1) Exact description match (case-insensitive, trimmed)
    const descMap = new Map<string, SpareRow[]>();
    for (const s of allSpares) {
      const key = (s.description || "").toLowerCase().trim();
      if (!key) continue;
      if (!descMap.has(key)) descMap.set(key, []);
      descMap.get(key)!.push(s);
    }
    const exact: DuplicateGroup[] = [];
    for (const [key, items] of descMap) {
      if (items.length > 1) exact.push({ matchType: "exact", matchKey: key, items });
    }

    // 2) Same OEM part number (non-empty)
    const oemMap = new Map<string, SpareRow[]>();
    for (const s of allSpares) {
      const oem = (s.oem_part_number || "").trim().toUpperCase();
      if (!oem) continue;
      if (!oemMap.has(oem)) oemMap.set(oem, []);
      oemMap.get(oem)!.push(s);
    }
    const oem: DuplicateGroup[] = [];
    for (const [key, items] of oemMap) {
      if (items.length > 1) oem.push({ matchType: "oem", matchKey: key, items });
    }

    // 3) Fuzzy similarity via core-part extraction (≥ 0.75 similarity, different descriptions)
    // To keep it performant, only compare within the same category
    const exactIds = new Set(exact.flatMap(g => g.items.map(i => i.id)));
    const catMap = new Map<string, SpareRow[]>();
    for (const s of allSpares) {
      const cat = (s.category || "Consumables").toLowerCase();
      if (!catMap.has(cat)) catMap.set(cat, []);
      catMap.get(cat)!.push(s);
    }

    const similarMap = new Map<string, SpareRow[]>();
    const processed = new Set<string>();

    for (const [, catItems] of catMap) {
      if (catItems.length > 300) continue; // skip huge categories for perf
      for (let i = 0; i < catItems.length; i++) {
        for (let j = i + 1; j < catItems.length; j++) {
          const a = catItems[i];
          const b = catItems[j];
          const descA = (a.description || "").toLowerCase().trim();
          const descB = (b.description || "").toLowerCase().trim();
          if (descA === descB) continue; // already in exact
          
          const sim = calculateCorePartSimilarity(a.description, b.description);
          if (sim >= 0.75) {
            const coreA = extractCorePart(a.description).toLowerCase();
            const groupKey = coreA || descA;
            if (!similarMap.has(groupKey)) similarMap.set(groupKey, []);
            const group = similarMap.get(groupKey)!;
            if (!group.find(x => x.id === a.id)) group.push(a);
            if (!group.find(x => x.id === b.id)) group.push(b);
          }
        }
      }
    }

    const similar: DuplicateGroup[] = [];
    for (const [key, items] of similarMap) {
      if (items.length > 1) similar.push({ matchType: "similar", matchKey: key, items });
    }

    return { exactGroups: exact, oemGroups: oem, similarGroups: similar };
  }, [allSpares]);

  const toggleDeletion = (id: string) => {
    setSelectedForDeletion((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** Auto-select inferior records in a group (keep highest completeness score) */
  const autoSelectGroup = (group: DuplicateGroup) => {
    const sorted = [...group.items].sort((a, b) => completenessScore(b) - completenessScore(a));
    // Keep the best, select the rest for deletion
    setSelectedForDeletion((prev) => {
      const next = new Set(prev);
      sorted.slice(1).forEach((item) => next.add(item.id));
      // Ensure best is NOT selected
      next.delete(sorted[0].id);
      return next;
    });
  };

  const autoSelectAll = (groups: DuplicateGroup[]) => {
    setSelectedForDeletion((prev) => {
      const next = new Set(prev);
      for (const group of groups) {
        const sorted = [...group.items].sort((a, b) => completenessScore(b) - completenessScore(a));
        sorted.slice(1).forEach((item) => next.add(item.id));
        next.delete(sorted[0].id);
      }
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedForDeletion.size === 0) return;
    setDeleting(true);
    const ids = Array.from(selectedForDeletion);
    const batchSize = 50;
    let deleted = 0;

    toast.loading(`Deleting ${ids.length} duplicates...`, { id: "dup-delete" });

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const { error } = await supabase
        .from("site_spares")
        .delete()
        .in("id", batch);
      if (!error) deleted += batch.length;
    }

    toast.dismiss("dup-delete");
    toast.success(`Removed ${deleted} duplicate records`);
    setSelectedForDeletion(new Set());
    await fetchAll();
    onResolved();
    setDeleting(false);
  };

  const totalDups = exactGroups.length + oemGroups.length + similarGroups.length;

  const renderGroup = (group: DuplicateGroup, index: number) => {
    const sorted = [...group.items].sort((a, b) => completenessScore(b) - completenessScore(a));
    const bestId = sorted[0].id;

    return (
      <div key={`${group.matchType}-${index}`} className="border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {group.items.length} items
            </Badge>
            {group.matchType === "exact" && <Badge className="bg-destructive/20 text-destructive text-xs">Exact</Badge>}
            {group.matchType === "oem" && <Badge className="bg-warning/20 text-warning text-xs">Same OEM#</Badge>}
            {group.matchType === "similar" && <Badge className="bg-primary/20 text-primary text-xs">Similar</Badge>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => autoSelectGroup(group)}
          >
            <Shield className="h-3 w-3 mr-1" />
            Auto-select inferior
          </Button>
        </div>

        {sorted.map((item) => {
          const isSelected = selectedForDeletion.has(item.id);
          const isBest = item.id === bestId;
          const score = completenessScore(item);

          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-2 rounded-md text-xs transition-colors ${
                isSelected ? "bg-destructive/10 border border-destructive/30" : isBest ? "bg-success/10 border border-success/30" : "bg-muted/30"
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleDeletion(item.id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-medium">{item.part_number || "—"}</span>
                  {isBest && (
                    <Badge variant="outline" className="text-[10px] bg-success/20 text-success border-success/30">
                      KEEP (score {score})
                    </Badge>
                  )}
                  {!isBest && (
                    <span className="text-muted-foreground text-[10px]">score {score}</span>
                  )}
                  {item.image_urls && item.image_urls.length > 0 && (
                    <ImageIcon className="h-3 w-3 text-primary" />
                  )}
                </div>
                <p className="text-foreground truncate">{item.description}</p>
                <div className="flex gap-3 text-muted-foreground flex-wrap">
                  {item.manufacturer && <span>Mfr: {item.manufacturer}</span>}
                  {item.oem_part_number && <span>OEM: {item.oem_part_number}</span>}
                  {item.category && <span>Cat: {item.category}</span>}
                  {item.bin_location && <span>Bin: {item.bin_location}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTabContent = (groups: DuplicateGroup[], label: string) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Analyzing {allSpares.length} items...</span>
        </div>
      );
    }

    if (groups.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-medium">No {label} duplicates found ✓</p>
          <p className="text-sm mt-1">Your inventory is clean for this match type.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {groups.length} groups · {groups.reduce((s, g) => s + g.items.length, 0)} total items
          </p>
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => autoSelectAll(groups)}>
            Auto-select all inferior
          </Button>
        </div>
        {groups.map((g, i) => renderGroup(g, i))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Duplicate Finder
            {!loading && (
              <Badge variant="outline" className="ml-2">
                {totalDups} groups found
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Actions bar */}
        {selectedForDeletion.size > 0 && (
          <div className="flex items-center justify-between bg-destructive/10 rounded-lg p-3">
            <span className="text-sm font-medium text-destructive">
              {selectedForDeletion.size} items selected for removal
            </span>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleDeleteSelected}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Selected
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exact" className="text-xs">
              Exact Match ({exactGroups.length})
            </TabsTrigger>
            <TabsTrigger value="oem" className="text-xs">
              Same OEM# ({oemGroups.length})
            </TabsTrigger>
            <TabsTrigger value="similar" className="text-xs">
              Similar ({similarGroups.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-3 pr-1 overflow-y-auto" style={{ maxHeight: "calc(85vh - 240px)" }}>
            <TabsContent value="exact" className="mt-0">
              {renderTabContent(exactGroups, "exact")}
            </TabsContent>
            <TabsContent value="oem" className="mt-0">
              {renderTabContent(oemGroups, "OEM part number")}
            </TabsContent>
            <TabsContent value="similar" className="mt-0">
              {renderTabContent(similarGroups, "similar")}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
