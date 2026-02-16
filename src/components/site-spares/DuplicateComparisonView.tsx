import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Shield, ChevronLeft, ChevronRight, ImageIcon, Check } from "lucide-react";
import { DuplicateGroup } from "./DuplicateFinderDialog";

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

const completenessScore = (r: SpareRow): number => {
  let score = 0;
  if (r.oem_part_number?.trim()) score += 3;
  if (r.manufacturer?.trim()) score += 2;
  if (r.image_urls && r.image_urls.length > 0) score += 4;
  if (r.bin_location?.trim()) score += 1;
  if (r.specifications?.trim()) score += 1;
  if (r.preferred_supplier?.trim()) score += 1;
  if ((r.qty_on_hand ?? 0) > 0) score += 1;
  return score;
};

/** Fields to compare */
const FIELDS: { key: keyof SpareRow; label: string }[] = [
  { key: "part_number", label: "Part Number" },
  { key: "description", label: "Description" },
  { key: "oem_part_number", label: "OEM Part #" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "category", label: "Category" },
  { key: "bin_location", label: "Bin Location" },
  { key: "preferred_supplier", label: "Supplier" },
  { key: "qty_on_hand", label: "Qty On Hand" },
  { key: "specifications", label: "Specifications" },
  { key: "image_urls", label: "Images" },
];

interface Props {
  groups: DuplicateGroup[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  selectedForDeletion: Set<string>;
  onToggleDeletion: (id: string) => void;
  onDeleteAndNext: () => void;
  deleting: boolean;
}

export const DuplicateComparisonView = ({
  groups,
  currentIndex,
  onNavigate,
  selectedForDeletion,
  onToggleDeletion,
  onDeleteAndNext,
  deleting,
}: Props) => {
  if (groups.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Shield className="h-10 w-10 mx-auto mb-3 text-green-500" />
        <p className="font-medium text-base">No duplicates found ✓</p>
        <p className="text-sm mt-1">Your inventory is clean for this match type.</p>
      </div>
    );
  }

  const group = groups[currentIndex];
  if (!group) return null;

  const items = [...group.items].sort((a, b) => completenessScore(b) - completenessScore(a));
  const bestId = items[0].id;

  /** Check if a field value is the same across all items */
  const getFieldValues = (key: keyof SpareRow) => {
    return items.map((item) => {
      const val = item[key];
      if (key === "image_urls") {
        const urls = val as string[] | null;
        return urls && urls.length > 0 ? `${urls.length} image(s)` : "—";
      }
      if (val === null || val === undefined || (typeof val === "string" && !val.trim())) return "—";
      return String(val);
    });
  };

  const allSame = (values: string[]) => {
    const normalized = values.map((v) => v.toLowerCase().trim());
    return normalized.every((v) => v === normalized[0]);
  };

  const anySelected = items.some((i) => selectedForDeletion.has(i.id));

  return (
    <div className="space-y-4">
      {/* Navigation bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={currentIndex === 0}
          onClick={() => onNavigate(currentIndex - 1)}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Group {currentIndex + 1} of {groups.length}
          </span>
          <Badge variant="outline" className="text-xs">
            {group.items.length} items
          </Badge>
          {group.matchType === "exact" && <Badge className="bg-destructive/20 text-destructive text-xs">Exact</Badge>}
          {group.matchType === "oem" && <Badge className="bg-orange-500/20 text-orange-600 text-xs">Same OEM#</Badge>}
          {group.matchType === "similar" && <Badge className="bg-primary/20 text-primary text-xs">Similar</Badge>}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={currentIndex >= groups.length - 1}
          onClick={() => onNavigate(currentIndex + 1)}
          className="gap-1"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-2 font-medium text-muted-foreground w-28 sticky left-0 bg-muted/50">Field</th>
              {items.map((item) => {
                const isBest = item.id === bestId;
                const isMarked = selectedForDeletion.has(item.id);
                return (
                  <th
                    key={item.id}
                    className={`p-2 text-center min-w-[180px] ${
                      isMarked
                        ? "bg-destructive/10"
                        : isBest
                        ? "bg-green-500/10"
                        : "bg-background"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono font-bold text-sm">{item.part_number || "—"}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">score {completenessScore(item)}</span>
                        {isBest && (
                          <Badge variant="outline" className="text-[9px] bg-green-500/20 text-green-600 border-green-500/30 px-1 py-0">
                            BEST
                          </Badge>
                        )}
                      </div>
                      {/* Action button */}
                      <Button
                        variant={isMarked ? "destructive" : "outline"}
                        size="sm"
                        className="h-7 text-[11px] mt-1 w-full"
                        onClick={() => onToggleDeletion(item.id)}
                      >
                        {isMarked ? (
                          <>
                            <Trash2 className="h-3 w-3 mr-1" /> Marked for Delete
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3 mr-1" /> Keep
                          </>
                        )}
                      </Button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((field) => {
              const values = getFieldValues(field.key);
              const same = allSame(values);

              return (
                <tr key={field.key} className="border-b border-border last:border-0">
                  <td className="p-2 font-medium text-muted-foreground sticky left-0 bg-background border-r border-border">
                    {field.label}
                  </td>
                  {values.map((val, i) => {
                    const isMarked = selectedForDeletion.has(items[i].id);
                    return (
                      <td
                        key={items[i].id}
                        className={`p-2 text-center break-words max-w-[220px] ${
                          isMarked ? "bg-destructive/5 text-muted-foreground line-through" : ""
                        } ${
                          !same && val !== "—"
                            ? "bg-amber-500/10 font-medium"
                            : same && val !== "—"
                            ? "bg-green-500/5"
                            : ""
                        }`}
                      >
                        {field.key === "image_urls" && val !== "—" ? (
                          <span className="inline-flex items-center gap-1">
                            <ImageIcon className="h-3 w-3 text-primary" /> {val}
                          </span>
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom action */}
      {anySelected && (
        <div className="flex items-center justify-between bg-destructive/10 rounded-lg p-3">
          <span className="text-sm font-medium text-destructive">
            {items.filter((i) => selectedForDeletion.has(i.id)).length} item(s) marked for deletion in this group
          </span>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={onDeleteAndNext}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
            Delete & Next
          </Button>
        </div>
      )}
    </div>
  );
};
