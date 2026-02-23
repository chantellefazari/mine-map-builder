import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, PackageSearch, ChevronDown, ChevronRight, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePOTracker } from "@/hooks/usePOTracker";
import { AddPODialog } from "@/components/po-tracker/AddPODialog";
import type { POTrackerItem, POLineItem } from "@/hooks/usePOTracker";

const statusColor: Record<string, string> = {
  Ordered: "bg-blue-100 text-blue-800 border-blue-200",
  "In Transit": "bg-amber-100 text-amber-800 border-amber-200",
  "On Site": "bg-green-100 text-green-800 border-green-200",
  "Partially Received": "bg-orange-100 text-orange-800 border-orange-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const POTracker = () => {
  const { poItems, isLoading, allocate, update, remove } = usePOTracker();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<POTrackerItem | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = (header: any, lines: POLineItem[]) => {
    if (header.id) {
      update.mutate({ ...header, lines });
    } else {
      allocate.mutate({ ...header, lines });
    }
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
                <p className="text-sm text-muted-foreground">
                  Auto-generated PO numbers (PO-XXXXXX) • Multiple parts per PO
                </p>
              </div>
            </div>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Create PO
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Data Structure Reference */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-primary" />
              Data Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground">PO Header (po_tracker)</h4>
                <div className="bg-background border rounded-lg p-3 text-xs space-y-1 font-mono">
                  <p><span className="text-primary">po_number</span> — PO-XXXXXX (auto-generated, unique)</p>
                  <p><span className="text-primary">work_order_id</span> — FK → work_orders</p>
                  <p><span className="text-primary">supplier</span> — text</p>
                  <p><span className="text-primary">order_date</span> — date</p>
                  <p><span className="text-primary">eta</span> — date</p>
                  <p><span className="text-primary">status</span> — Ordered | In Transit | On Site | Partially Received | Cancelled</p>
                  <p><span className="text-primary">confirmed_on_site</span> — boolean</p>
                  <p><span className="text-primary">date_received</span> — date</p>
                  <p><span className="text-primary">comments</span> — text</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground">Line Items (po_tracker_lines)</h4>
                <div className="bg-background border rounded-lg p-3 text-xs space-y-1 font-mono">
                  <p><span className="text-primary">po_tracker_id</span> — FK → po_tracker (cascade delete)</p>
                  <p><span className="text-primary">part_number</span> — text</p>
                  <p><span className="text-primary">part_description</span> — text</p>
                  <p><span className="text-primary">quantity_ordered</span> — numeric</p>
                  <p><span className="text-primary">unit_price</span> — numeric</p>
                  <p><span className="text-primary">received_qty</span> — numeric</p>
                  <p><span className="text-primary">notes</span> — text</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  One PO → many line items. Delete a PO and lines cascade.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PO Table */}
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : poItems.length === 0 ? (
          <div className="text-center py-16">
            <PackageSearch className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No purchase orders yet. Click "Create PO" to get started.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-center">Lines</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">On Site</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poItems.map((po) => {
                  const isExpanded = expandedRows.has(po.id);
                  return (
                    <>
                      <TableRow key={po.id} className="cursor-pointer" onClick={() => toggleExpand(po.id)}>
                        <TableCell>
                          {(po.lines?.length ?? 0) > 0 && (
                            isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono font-medium text-primary">{po.po_number}</TableCell>
                        <TableCell className="font-mono text-xs">{po.wo_number ?? "—"}</TableCell>
                        <TableCell>{po.supplier || "—"}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">{po.lines?.length ?? 0}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{po.order_date ?? "—"}</TableCell>
                        <TableCell className="text-xs">{po.eta ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColor[po.status] ?? ""}>{po.status}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {po.confirmed_on_site ? (
                            <Badge className="bg-green-600 text-white text-xs">Yes</Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">No</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">{po.date_received ?? "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(po)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => remove.mutate(po.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (po.lines?.length ?? 0) > 0 && (
                        <TableRow key={`${po.id}-lines`}>
                          <TableCell></TableCell>
                          <TableCell colSpan={10} className="bg-muted/30 p-0">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-left border-b">
                                  <th className="p-2 font-medium text-muted-foreground">Part #</th>
                                  <th className="p-2 font-medium text-muted-foreground">Description</th>
                                  <th className="p-2 font-medium text-muted-foreground text-center">Qty Ordered</th>
                                  <th className="p-2 font-medium text-muted-foreground text-center">Unit Price</th>
                                  <th className="p-2 font-medium text-muted-foreground text-center">Received</th>
                                  <th className="p-2 font-medium text-muted-foreground">Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {po.lines!.map((line, idx) => (
                                  <tr key={line.id ?? idx} className="border-b last:border-0">
                                    <td className="p-2 font-mono">{line.part_number || "—"}</td>
                                    <td className="p-2">{line.part_description || "—"}</td>
                                    <td className="p-2 text-center">{line.quantity_ordered}</td>
                                    <td className="p-2 text-center">${Number(line.unit_price).toFixed(2)}</td>
                                    <td className="p-2 text-center">{line.received_qty}</td>
                                    <td className="p-2 text-muted-foreground">{line.notes || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
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
