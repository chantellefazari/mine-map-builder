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
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { POLineItem } from "@/hooks/usePOImport";

interface RawPOLinesTableProps {
  lineItems: POLineItem[];
  selectedUploadId: string | null;
}

export const RawPOLinesTable = ({ lineItems, selectedUploadId }: RawPOLinesTableProps) => {
  const filteredItems = selectedUploadId
    ? lineItems.filter((item) => item.uploadId === selectedUploadId)
    : lineItems;

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
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Raw PO Lines
          <Badge variant="secondary" className="ml-2">
            {filteredItems.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No PO lines to display. Upload a PO export file to get started.
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
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
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
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
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
