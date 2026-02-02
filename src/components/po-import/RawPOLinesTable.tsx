import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText, Copy, AlertTriangle, Layers } from "lucide-react";
import { POLineItem, NormalizedComponent } from "@/hooks/usePOImport";
import { isNoiseRow } from "@/utils/descriptionCleaner";

interface RawPOLinesTableProps {
  lineItems: POLineItem[];
  selectedUploadId: string | null;
  normalizedComponents?: NormalizedComponent[];
}

// Color palette for duplicate groups
const groupColors = [
  "bg-amber-50 border-l-4 border-l-amber-400",
  "bg-blue-50 border-l-4 border-l-blue-400",
  "bg-green-50 border-l-4 border-l-green-400",
  "bg-purple-50 border-l-4 border-l-purple-400",
  "bg-pink-50 border-l-4 border-l-pink-400",
  "bg-cyan-50 border-l-4 border-l-cyan-400",
  "bg-orange-50 border-l-4 border-l-orange-400",
];

export const RawPOLinesTable = ({ 
  lineItems, 
  selectedUploadId,
  normalizedComponents = [],
}: RawPOLinesTableProps) => {
  const [groupDuplicates, setGroupDuplicates] = useState(false);

  const filteredItems = selectedUploadId
    ? lineItems.filter((item) => item.uploadId === selectedUploadId)
    : lineItems;

  // Create a lookup of descriptions that made it to normalized components
  const normalizedDescriptions = useMemo(() => {
    const set = new Set<string>();
    normalizedComponents.forEach((c) => {
      set.add(c.descriptionCleaned.toLowerCase().trim());
      // Also add alias descriptions
      if (c.aliasDescriptions) {
        c.aliasDescriptions.split("\n").forEach((alias) => {
          set.add(alias.toLowerCase().trim());
        });
      }
    });
    return set;
  }, [normalizedComponents]);

  // Identify which lines are noise, duplicates, or new, and group key
  const { lineStatus, duplicateGroups, groupColorMap } = useMemo(() => {
    const seen = new Map<string, number>(); // description -> first index
    const descCount = new Map<string, number>(); // description -> count
    const statuses: { status: "noise" | "duplicate" | "new"; groupKey: string }[] = [];
    
    // First pass: count occurrences
    filteredItems.forEach((item) => {
      const desc = item.itemDescription?.trim() || "";
      const descLower = desc.toLowerCase();
      if (!isNoiseRow(desc)) {
        descCount.set(descLower, (descCount.get(descLower) || 0) + 1);
      }
    });

    // Second pass: assign statuses
    filteredItems.forEach((item, idx) => {
      const desc = item.itemDescription?.trim() || "";
      const descLower = desc.toLowerCase();
      
      if (isNoiseRow(desc)) {
        statuses[idx] = { status: "noise", groupKey: "" };
      } else if (seen.has(descLower)) {
        statuses[idx] = { status: "duplicate", groupKey: descLower };
      } else {
        seen.set(descLower, idx);
        // Mark as "new" but if it has duplicates later, still assign groupKey
        statuses[idx] = { 
          status: (descCount.get(descLower) || 0) > 1 ? "duplicate" : "new", 
          groupKey: (descCount.get(descLower) || 0) > 1 ? descLower : "" 
        };
      }
    });

    // Find all groups with duplicates
    const groups = new Set<string>();
    statuses.forEach((s) => {
      if (s.groupKey) groups.add(s.groupKey);
    });

    // Assign colors to groups
    const colorMap = new Map<string, string>();
    let colorIdx = 0;
    groups.forEach((key) => {
      colorMap.set(key, groupColors[colorIdx % groupColors.length]);
      colorIdx++;
    });
    
    return { lineStatus: statuses, duplicateGroups: groups, groupColorMap: colorMap };
  }, [filteredItems]);

  // Sort items to group duplicates together when enabled
  const displayItems = useMemo(() => {
    if (!groupDuplicates) {
      return filteredItems.map((item, idx) => ({ item, originalIdx: idx }));
    }

    // Sort by groupKey to cluster duplicates
    const itemsWithIdx = filteredItems.map((item, idx) => ({ item, originalIdx: idx }));
    return itemsWithIdx.sort((a, b) => {
      const groupA = lineStatus[a.originalIdx]?.groupKey || "";
      const groupB = lineStatus[b.originalIdx]?.groupKey || "";
      
      // Put items with groups first, sorted by group
      if (groupA && !groupB) return -1;
      if (!groupA && groupB) return 1;
      if (groupA && groupB) return groupA.localeCompare(groupB);
      return 0;
    });
  }, [filteredItems, groupDuplicates, lineStatus]);

  // Count stats
  const noiseCount = lineStatus.filter((s) => s?.status === "noise").length;
  const duplicateGroupCount = duplicateGroups.size;
  const duplicateLineCount = lineStatus.filter((s) => s?.status === "duplicate").length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Raw PO Lines
            <Badge variant="secondary" className="ml-2">
              {filteredItems.length} items
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            {duplicateGroupCount > 0 && (
              <Button
                variant={groupDuplicates ? "default" : "outline"}
                size="sm"
                onClick={() => setGroupDuplicates(!groupDuplicates)}
                className="gap-1"
              >
                <Layers className="h-3 w-3" />
                {groupDuplicates ? "Grouped" : "Group Duplicates"}
              </Button>
            )}
            {noiseCount > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {noiseCount} filtered
              </Badge>
            )}
            {duplicateGroupCount > 0 && (
              <Badge variant="outline" className="border-amber-400 bg-amber-50">
                <Copy className="h-3 w-3 mr-1" />
                {duplicateLineCount} lines in {duplicateGroupCount} groups
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No PO lines to display. Upload a PO export file to get started.
          </div>
        ) : (
          <ScrollArea className="h-[400px] w-full">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Status</TableHead>
                    <TableHead className="w-[100px]">PO Number</TableHead>
                    <TableHead className="w-[90px]">PO Date</TableHead>
                    <TableHead className="min-w-[300px]">Description</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Part Number</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayItems.map(({ item, originalIdx }) => {
                    const statusInfo = lineStatus[originalIdx];
                    const status = statusInfo?.status;
                    const groupKey = statusInfo?.groupKey || "";
                    const groupColor = groupKey ? groupColorMap.get(groupKey) : "";
                    
                    const rowClass = status === "noise" 
                      ? "bg-muted/50 text-muted-foreground line-through" 
                      : groupDuplicates && groupColor
                        ? groupColor
                        : status === "duplicate" 
                          ? "bg-amber-50 border-l-4 border-l-amber-400" 
                          : "";
                    
                    return (
                      <TableRow key={item.id} className={rowClass}>
                        <TableCell>
                          {status === "noise" && (
                            <Badge variant="secondary" className="text-xs">
                              Filtered
                            </Badge>
                          )}
                          {status === "duplicate" && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                              <Copy className="h-3 w-3 mr-1" />
                              Dup
                            </Badge>
                          )}
                          {status === "new" && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                              New
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.poNumber || "-"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDate(item.poDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.itemDescription}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.manufacturer || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.model || "-"}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.partNumber || "Missing Part"}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium">
                          {formatCurrency(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
