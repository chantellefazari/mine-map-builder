import { useMemo } from "react";
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
import { FileText, Copy, AlertTriangle } from "lucide-react";
import { POLineItem, NormalizedComponent } from "@/hooks/usePOImport";
import { isNoiseRow } from "@/utils/descriptionCleaner";

interface RawPOLinesTableProps {
  lineItems: POLineItem[];
  selectedUploadId: string | null;
  normalizedComponents?: NormalizedComponent[];
}

export const RawPOLinesTable = ({ 
  lineItems, 
  selectedUploadId,
  normalizedComponents = [],
}: RawPOLinesTableProps) => {
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

  // Identify which lines are noise, duplicates, or new
  const lineStatus = useMemo(() => {
    const seen = new Map<string, number>(); // description -> first index
    const statuses: Map<string, "noise" | "duplicate" | "new">[] = [];
    
    filteredItems.forEach((item, idx) => {
      const desc = item.itemDescription?.trim() || "";
      const descLower = desc.toLowerCase();
      
      if (isNoiseRow(desc)) {
        statuses[idx] = new Map([["status", "noise"]]);
      } else if (seen.has(descLower)) {
        statuses[idx] = new Map([["status", "duplicate"]]);
      } else {
        seen.set(descLower, idx);
        statuses[idx] = new Map([["status", "new"]]);
      }
    });
    
    return statuses;
  }, [filteredItems]);

  // Count stats
  const noiseCount = lineStatus.filter((s) => s?.get("status") === "noise").length;
  const duplicateCount = lineStatus.filter((s) => s?.get("status") === "duplicate").length;

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
          {(noiseCount > 0 || duplicateCount > 0) && (
            <div className="flex gap-2 text-sm">
              {noiseCount > 0 && (
                <Badge variant="outline" className="text-muted-foreground">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {noiseCount} filtered
                </Badge>
              )}
              {duplicateCount > 0 && (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  <Copy className="h-3 w-3 mr-1" />
                  {duplicateCount} duplicates
                </Badge>
              )}
            </div>
          )}
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
                  {filteredItems.map((item, idx) => {
                    const status = lineStatus[idx]?.get("status");
                    const rowClass = status === "noise" 
                      ? "bg-muted/50 text-muted-foreground line-through" 
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
                        <TableCell className="font-mono text-xs">
                          {item.partNumber || (
                            <Badge variant="outline" className="text-orange-600 border-orange-300">
                              Missing
                            </Badge>
                          )}
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
