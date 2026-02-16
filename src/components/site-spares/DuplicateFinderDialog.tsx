import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { extractCorePart, calculateCorePartSimilarity } from "@/utils/corePartExtractor";
import { DuplicateComparisonView } from "./DuplicateComparisonView";

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
  const [groupIndex, setGroupIndex] = useState<Record<string, number>>({ exact: 0, oem: 0, similar: 0 });

  useEffect(() => {
    if (!open) return;
    fetchAll();
  }, [open]);

  const fetchAll = async () => {
    setLoading(true);
    setSelectedForDeletion(new Set());
    setGroupIndex({ exact: 0, oem: 0, similar: 0 });
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
    const seen = new Set<string>();
    const deduped = all.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    setAllSpares(deduped);
    setLoading(false);
  };

  const { exactGroups, oemGroups, similarGroups } = useMemo(() => {
    if (allSpares.length === 0) return { exactGroups: [], oemGroups: [], similarGroups: [] };

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

    const catMap = new Map<string, SpareRow[]>();
    for (const s of allSpares) {
      const cat = (s.category || "Consumables").toLowerCase();
      if (!catMap.has(cat)) catMap.set(cat, []);
      catMap.get(cat)!.push(s);
    }

    const similarMap = new Map<string, SpareRow[]>();
    for (const [, catItems] of catMap) {
      if (catItems.length > 300) continue;
      for (let i = 0; i < catItems.length; i++) {
        for (let j = i + 1; j < catItems.length; j++) {
          const a = catItems[i];
          const b = catItems[j];
          const descA = (a.description || "").toLowerCase().trim();
          const descB = (b.description || "").toLowerCase().trim();
          if (descA === descB) continue;
          const sim = calculateCorePartSimilarity(a.description, b.description);
          if (sim >= 0.75) {
            const coreA = extractCorePart(a.description).toLowerCase();
            const groupKey = coreA || descA;
            if (!similarMap.has(groupKey)) similarMap.set(groupKey, []);
            const group = similarMap.get(groupKey)!;
            if (!group.find((x) => x.id === a.id)) group.push(a);
            if (!group.find((x) => x.id === b.id)) group.push(b);
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

  const handleDeleteAndNext = async () => {
    const currentGroups = activeTab === "exact" ? exactGroups : activeTab === "oem" ? oemGroups : similarGroups;
    const idx = groupIndex[activeTab] ?? 0;
    const group = currentGroups[idx];
    if (!group) return;

    const idsToDelete = group.items.filter((i) => selectedForDeletion.has(i.id)).map((i) => i.id);
    if (idsToDelete.length === 0) return;

    // Safety: don't allow deleting ALL items in a group
    if (idsToDelete.length === group.items.length) {
      toast.error("You must keep at least one item in this group!");
      return;
    }

    setDeleting(true);
    const { error } = await supabase.from("site_spares").delete().in("id", idsToDelete);

    if (error) {
      toast.error("Failed to delete items");
      setDeleting(false);
      return;
    }

    toast.success(`Removed ${idsToDelete.length} item(s)`);

    // Clear those from selection
    setSelectedForDeletion((prev) => {
      const next = new Set(prev);
      idsToDelete.forEach((id) => next.delete(id));
      return next;
    });

    // Refresh data
    await fetchAll();
    onResolved();
    setDeleting(false);
  };

  const totalDups = exactGroups.length + oemGroups.length + similarGroups.length;

  const currentGroups = activeTab === "exact" ? exactGroups : activeTab === "oem" ? oemGroups : similarGroups;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Duplicate Finder — Compare & Resolve
            {!loading && (
              <Badge variant="outline" className="ml-2">
                {totalDups} groups
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setSelectedForDeletion(new Set());
          }}
          className="flex-1 min-h-0 flex flex-col"
        >
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

          <div className="flex-1 mt-3 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Analyzing {allSpares.length} items...</span>
              </div>
            ) : (
              <>
                <TabsContent value="exact" className="mt-0">
                  <DuplicateComparisonView
                    groups={exactGroups}
                    currentIndex={groupIndex.exact ?? 0}
                    onNavigate={(i) => { setGroupIndex((p) => ({ ...p, exact: i })); setSelectedForDeletion(new Set()); }}
                    selectedForDeletion={selectedForDeletion}
                    onToggleDeletion={toggleDeletion}
                    onDeleteAndNext={handleDeleteAndNext}
                    deleting={deleting}
                  />
                </TabsContent>
                <TabsContent value="oem" className="mt-0">
                  <DuplicateComparisonView
                    groups={oemGroups}
                    currentIndex={groupIndex.oem ?? 0}
                    onNavigate={(i) => { setGroupIndex((p) => ({ ...p, oem: i })); setSelectedForDeletion(new Set()); }}
                    selectedForDeletion={selectedForDeletion}
                    onToggleDeletion={toggleDeletion}
                    onDeleteAndNext={handleDeleteAndNext}
                    deleting={deleting}
                  />
                </TabsContent>
                <TabsContent value="similar" className="mt-0">
                  <DuplicateComparisonView
                    groups={similarGroups}
                    currentIndex={groupIndex.similar ?? 0}
                    onNavigate={(i) => { setGroupIndex((p) => ({ ...p, similar: i })); setSelectedForDeletion(new Set()); }}
                    selectedForDeletion={selectedForDeletion}
                    onToggleDeletion={toggleDeletion}
                    onDeleteAndNext={handleDeleteAndNext}
                    deleting={deleting}
                  />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
