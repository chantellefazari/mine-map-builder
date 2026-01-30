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
import { Button } from "@/components/ui/button";
import { History, Trash2, Eye, FileSpreadsheet } from "lucide-react";
import { POUpload } from "@/hooks/usePOImport";

interface UploadHistoryTableProps {
  uploads: POUpload[];
  selectedUploadId: string | null;
  onSelectUpload: (uploadId: string | null) => void;
  onDeleteUpload: (uploadId: string) => void;
}

export const UploadHistoryTable = ({
  uploads,
  selectedUploadId,
  onSelectUpload,
  onDeleteUpload,
}: UploadHistoryTableProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-700",
    processed: "bg-green-500/20 text-green-700",
    error: "bg-red-500/20 text-red-700",
  };

  const categoryColors: Record<string, string> = {
    Pumps: "bg-blue-500/20 text-blue-700",
    Valves: "bg-purple-500/20 text-purple-700",
    Gearboxes: "bg-orange-500/20 text-orange-700",
    Motors: "bg-red-500/20 text-red-700",
    "Bearings/Seals": "bg-teal-500/20 text-teal-700",
    Instruments: "bg-cyan-500/20 text-cyan-700",
    Electrical: "bg-indigo-500/20 text-indigo-700",
    Other: "bg-gray-500/20 text-gray-700",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Upload History
            <Badge variant="secondary" className="ml-2">
              {uploads.length} uploads
            </Badge>
          </CardTitle>
          {selectedUploadId && (
            <Button variant="ghost" size="sm" onClick={() => onSelectUpload(null)}>
              Clear Filter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No uploads yet. Upload a PO export file to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads.map((upload) => (
                <TableRow
                  key={upload.id}
                  className={selectedUploadId === upload.id ? "bg-muted/50" : ""}
                >
                  <TableCell className="font-medium">{upload.supplierName}</TableCell>
                  <TableCell>
                    <Badge className={categoryColors[upload.category] || categoryColors.Other}>
                      {upload.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {upload.dateRangeCovered || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[150px]">
                        {upload.fileName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(upload.uploadedAt)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[upload.status] || statusColors.pending}>
                      {upload.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onSelectUpload(selectedUploadId === upload.id ? null : upload.id)
                        }
                        title="View PO lines for this upload"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteUpload(upload.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete upload"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
