import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface SparePartLookupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (spare: SpareResult) => void;
}

export const SparePartLookupDialog = ({ open, onOpenChange, onSelect }: SparePartLookupDialogProps) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SpareResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) {
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
  }, [search]);

  const handleSelect = (spare: SpareResult) => {
    onSelect(spare);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Site Spares Catalogue</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by part number, description, or OEM number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg">
          {loading && (
            <p className="text-sm text-muted-foreground text-center py-8">Searching…</p>
          )}

          {!loading && search.trim().length >= 2 && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No spares found for "{search}"</p>
          )}

          {!loading && search.trim().length < 2 && (
            <p className="text-sm text-muted-foreground text-center py-8">Type at least 2 characters to search</p>
          )}

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
                  <tr
                    key={spare.id}
                    className="border-t hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleSelect(spare)}
                  >
                    <td className="p-2 font-mono text-xs">{spare.part_number || "—"}</td>
                    <td className="p-2 text-xs max-w-[200px] truncate">{spare.description}</td>
                    <td className="p-2">
                      {spare.category && <Badge variant="secondary" className="text-[10px]">{spare.category}</Badge>}
                    </td>
                    <td className="p-2 text-center text-xs">{spare.qty_on_hand ?? 0}</td>
                    <td className="p-2 text-xs text-muted-foreground">{spare.bin_location || "—"}</td>
                    <td className="p-2">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground">
          Showing up to 20 results from Site Spares Catalogue
        </p>
      </DialogContent>
    </Dialog>
  );
};
