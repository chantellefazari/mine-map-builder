import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, PackageSearch, ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filtered = poItems.filter((po) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      po.po_number.toLowerCase().includes(term) ||
      (po.wo_number ?? "").toLowerCase().includes(term) ||
      po.supplier.toLowerCase().includes(term) ||
      (po.freight_company ?? "").toLowerCase().includes(term) ||
      po.status.toLowerCase().includes(term) ||
      po.lines?.some(
        (l) =>
          l.part_number.toLowerCase().includes(term) ||
          l.part_description.toLowerCase().includes(term)
      )
    );
  });

  const totalPOs = poItems.length;
  const totalLines = poItems.reduce((s, po) => s + (po.lines?.length ?? 0), 0);
  const onSiteCount = poItems.filter((po) => po.confirmed_on_site).length;

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
                <p className="text-sm text-muted-foreground">Purchase order register • Auto-numbered PO-8XXXX</p>
              </div>
            </div>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Create PO
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{totalPOs}</p><p className="text-xs text-muted-foreground">Total POs</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{totalLines}</p><p className="text-xs text-muted-foreground">Total Line Items</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{onSiteCount}</p><p className="text-xs text-muted-foreground">Confirmed On Site</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{poItems.length > 0 ? poItems[0].po_number : "PO-000001"}</p><p className="text-xs text-muted-foreground">Last PO Number</p></CardContent></Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search PO number, supplier, part, WO…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Loading purchase orders…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border rounded-lg bg-card">
            <PackageSearch className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">
              {searchTerm ? `No results for "${searchTerm}"` : 'No purchase orders yet. Click "Create PO" to get started.'}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-auto bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Freight</TableHead>
                  <TableHead className="text-center">Parts</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">On Site</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((po) => {
                  const isExpanded = expandedRows.has(po.id);
                  const lineCount = po.lines?.length ?? 0;
                  return (
                    <>
                      <TableRow
                        key={po.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => lineCount > 0 && toggleExpand(po.id)}
                      >
                        <TableCell className="px-2">
                          {lineCount > 0 ? (
                            isExpanded
                              ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          ) : null}
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-primary">{po.po_number}</TableCell>
                        <TableCell>
                          {po.wo_number ? (
                            <Badge variant="outline" className="font-mono text-xs">{po.wo_number}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{po.supplier || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{po.freight_company || "—"}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">{lineCount}</Badge>
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{po.order_date ?? "—"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{po.eta ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColor[po.status] ?? ""}>{po.status}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {po.confirmed_on_site ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">✓ Yes</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">No</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{po.date_received ?? "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(po)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => remove.mutate(po.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Line Items */}
                      {isExpanded && lineCount > 0 && (
                        <TableRow key={`${po.id}-detail`}>
                          <TableCell></TableCell>
                          <TableCell colSpan={11} className="p-0">
                            <div className="bg-muted/30 border-t border-b">
                              <div className="px-4 py-2 flex items-center gap-2 border-b bg-muted/50">
                                <span className="text-xs font-semibold text-foreground">
                                  Line Items for {po.po_number}
                                </span>
                                <Badge variant="secondary" className="text-[10px]">{lineCount} items</Badge>
                              </div>
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-left">
                                    <th className="px-4 py-2 font-semibold text-muted-foreground w-8">#</th>
                                    <th className="px-4 py-2 font-semibold text-muted-foreground">Part Number</th>
                                    <th className="px-4 py-2 font-semibold text-muted-foreground">Description</th>
                                    <th className="px-4 py-2 font-semibold text-muted-foreground text-center">Qty Ordered</th>
                                    <th className="px-4 py-2 font-semibold text-muted-foreground text-center">Unit Price</th>
                                    <th className="px-4 py-2 font-semibold text-muted-foreground text-center">Line Total</th>
                                    <th className="px-4 py-2 font-semibold text-muted-foreground text-center">Received</th>
                                    <th className="px-4 py-2 font-semibold text-muted-foreground">Notes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {po.lines!.map((line, idx) => (
                                    <tr key={line.id ?? idx} className="border-t hover:bg-muted/30">
                                      <td className="px-4 py-2 text-muted-foreground">{idx + 1}</td>
                                      <td className="px-4 py-2 font-mono">{line.part_number || "—"}</td>
                                      <td className="px-4 py-2">{line.part_description || "—"}</td>
                                      <td className="px-4 py-2 text-center font-medium">{line.quantity_ordered}</td>
                                      <td className="px-4 py-2 text-center">${Number(line.unit_price).toFixed(2)}</td>
                                      <td className="px-4 py-2 text-center font-medium">
                                        ${(Number(line.quantity_ordered) * Number(line.unit_price)).toFixed(2)}
                                      </td>
                                      <td className="px-4 py-2 text-center">
                                        {Number(line.received_qty) > 0 ? (
                                          <span className={Number(line.received_qty) >= Number(line.quantity_ordered) ? "text-green-700 font-medium" : "text-amber-700"}>
                                            {line.received_qty} / {line.quantity_ordered}
                                          </span>
                                        ) : (
                                          <span className="text-muted-foreground">0 / {line.quantity_ordered}</span>
                                        )}
                                      </td>
                                      <td className="px-4 py-2 text-muted-foreground">{line.notes || "—"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr className="border-t bg-muted/50 font-medium">
                                    <td colSpan={3} className="px-4 py-2 text-right text-muted-foreground">Totals:</td>
                                    <td className="px-4 py-2 text-center">
                                      {po.lines!.reduce((s, l) => s + Number(l.quantity_ordered), 0)}
                                    </td>
                                    <td className="px-4 py-2"></td>
                                    <td className="px-4 py-2 text-center text-primary font-semibold">
                                      ${po.lines!.reduce((s, l) => s + Number(l.quantity_ordered) * Number(l.unit_price), 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                      {po.lines!.reduce((s, l) => s + Number(l.received_qty), 0)}
                                    </td>
                                    <td></td>
                                  </tr>
                                </tfoot>
                              </table>
                              {po.comments && (
                                <div className="px-4 py-2 border-t text-xs">
                                  <span className="font-medium text-muted-foreground">Comments: </span>
                                  <span>{po.comments}</span>
                                </div>
                              )}
                            </div>
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

        {/* Record count */}
        {filtered.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {totalPOs} purchase orders
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
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
