import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePOTracker } from "@/hooks/usePOTracker";
import { AddPODialog } from "@/components/po-tracker/AddPODialog";
import type { POTrackerItem } from "@/hooks/usePOTracker";

const statusColor: Record<string, string> = {
  Ordered: "bg-blue-100 text-blue-800 border-blue-200",
  "In Transit": "bg-amber-100 text-amber-800 border-amber-200",
  "On Site": "bg-green-100 text-green-800 border-green-200",
  "Partially Received": "bg-orange-100 text-orange-800 border-orange-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const POTracker = () => {
  const { poItems, isLoading, upsert, remove } = usePOTracker();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<POTrackerItem | null>(null);

  const handleSave = (item: Partial<POTrackerItem> & { po_number: string }) => {
    upsert.mutate(item);
  };

  const handleEdit = (item: POTrackerItem) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <PackageSearch className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">PO Tracker</h1>
                <p className="text-sm text-muted-foreground">Purchase order tracking linked to work orders</p>
              </div>
            </div>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add PO
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : poItems.length === 0 ? (
          <div className="text-center py-16">
            <PackageSearch className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No purchase orders yet. Click "Add PO" to get started.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Part Description</TableHead>
                  <TableHead>Part #</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">On Site</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poItems.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono font-medium">{po.po_number}</TableCell>
                    <TableCell className="font-mono text-xs">{po.wo_number ?? "—"}</TableCell>
                    <TableCell>{po.supplier || "—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{po.part_description || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{po.part_number || "—"}</TableCell>
                    <TableCell className="text-center">{po.quantity_ordered}</TableCell>
                    <TableCell className="text-xs">{po.order_date ?? "—"}</TableCell>
                    <TableCell className="text-xs">{po.eta ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor[po.status] ?? ""}>
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {po.confirmed_on_site ? (
                        <Badge className="bg-green-600 text-white">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{po.date_received ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(po)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove.mutate(po.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <AddPODialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editItem={editItem}
      />
    </div>
  );
};

export default POTracker;
