import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { POTrackerItem } from "@/hooks/usePOTracker";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

interface WOLinkedPOsTabProps {
  linkedPOs: POTrackerItem[];
  isLoading: boolean;
}

export const WOLinkedPOsTab = ({ linkedPOs, isLoading }: WOLinkedPOsTabProps) => {
  if (isLoading) return <p className="text-xs text-muted-foreground p-4">Loading linked POs…</p>;

  if (linkedPOs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No purchase orders linked to this work order.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">PO Number</TableHead>
            <TableHead className="text-xs">Supplier</TableHead>
            <TableHead className="text-xs">ETA</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Confirmed On Site</TableHead>
            <TableHead className="text-xs">Date Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linkedPOs.map((po) => (
            <TableRow key={po.id}>
              <TableCell className="font-mono text-xs font-medium">{po.po_number}</TableCell>
              <TableCell className="text-xs">{po.supplier || "—"}</TableCell>
              <TableCell className="text-xs">{po.eta ? format(new Date(po.eta), "dd/MM/yyyy") : "—"}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px]">{po.status}</Badge>
              </TableCell>
              <TableCell>
                {po.confirmed_on_site ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell className="text-xs">{po.date_received ? format(new Date(po.date_received), "dd/MM/yyyy") : "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
