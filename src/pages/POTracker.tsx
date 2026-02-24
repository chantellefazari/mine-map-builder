import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, PackageSearch, ChevronDown, ChevronRight, Search, X, DollarSign, Building2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePOTracker } from "@/hooks/usePOTracker";
import { AddPODialog } from "@/components/po-tracker/AddPODialog";
import type { POTrackerItem, POLineItem } from "@/hooks/usePOTracker";
import { format } from "date-fns";

const statusColor: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Issued: "bg-blue-100 text-blue-800 border-blue-200",
  "In Transit": "bg-amber-100 text-amber-800 border-amber-200",
  "Received Partial": "bg-orange-100 text-orange-800 border-orange-200",
  "Received Complete": "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
  // Legacy statuses
  Ordered: "bg-blue-100 text-blue-800 border-blue-200",
  "On Site": "bg-green-100 text-green-800 border-green-200",
  "Partially Received": "bg-orange-100 text-orange-800 border-orange-200",
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
      (po.pr_number ?? "").toLowerCase().includes(term) ||
      po.supplier.toLowerCase().includes(term) ||
      (po.description ?? "").toLowerCase().includes(term) ||
      (po.freight_company ?? "").toLowerCase().includes(term) ||
      po.status.toLowerCase().includes(term) ||
      po.lines?.some(
        (l) =>
          l.part_number.toLowerCase().includes(term) ||
          l.part_description.toLowerCase().includes(term)
      )
    );
  });

  // Spend summaries
  const spendBySupplier = useMemo(() => {
    const map = new Map<string, number>();
    poItems.forEach((po) => {
      if (po.status === "Cancelled") return;
      const supplier = po.supplier || "Unknown";
      map.set(supplier, (map.get(supplier) ?? 0) + Number(po.total_value));
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [poItems]);

  const spendByWO = useMemo(() => {
    const map = new Map<string, { total: number; woNumber: string }>();
    poItems.forEach((po) => {
      if (!po.work_order_id || po.status === "Cancelled") return;
      const key = po.work_order_id;
      const existing = map.get(key);
      map.set(key, {
        total: (existing?.total ?? 0) + Number(po.total_value),
        woNumber: po.wo_number || key,
      });
    });
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [poItems]);

  const totalPOs = poItems.length;
  const totalSpend = poItems.filter(p => p.status !== "Cancelled").reduce((s, po) => s + Number(po.total_value), 0);
  const onSiteCount = poItems.filter((po) => po.confirmed_on_site).length;
  const activeCount = poItems.filter((po) => ["Draft", "Issued", "In Transit", "Ordered"].includes(po.status)).length;

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
                <h1 className="text-2xl font-bold text-foreground">PO Register</h1>
                <p className="text-sm text-muted-foreground">Purchase order register • TCMG-YYYY-XXXX</p>
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
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">${totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p><p className="text-xs text-muted-foreground">Total Spend</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{activeCount}</p><p className="text-xs text-muted-foreground">Active Orders</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{onSiteCount}</p><p className="text-xs text-muted-foreground">Confirmed On Site</p></CardContent></Card>
        </div>

        <Tabs defaultValue="register" className="space-y-4">
          <TabsList>
            <TabsTrigger value="register">PO Register</TabsTrigger>
            <TabsTrigger value="supplier-spend">Spend by Supplier</TabsTrigger>
            <TabsTrigger value="wo-spend">Spend by Work Order</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PO, PR, supplier, WO, description…"
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
                  {searchTerm ? `No results for "${searchTerm}"` : 'No purchase orders yet.'}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-auto bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Linked PR</TableHead>
                      <TableHead>Work Order</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead className="text-center">Freight</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Last Updated</TableHead>
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
                              {po.pr_number ? (
                                <Badge variant="outline" className="font-mono text-xs">{po.pr_number}</Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {po.wo_number ? (
                                <Badge variant="outline" className="font-mono text-xs">{po.wo_number}</Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{po.supplier || "—"}</TableCell>
                            <TableCell className="text-right font-medium">
                              {Number(po.total_value) > 0
                                ? `$${Number(po.total_value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                                : "—"}
                            </TableCell>
                            <TableCell className="text-center">
                              {po.freight_required ? (
                                <div className="text-xs">
                                  <span className="font-medium">{po.freight_company || "Yes"}</span>
                                  {po.freight_tracking_number && (
                                    <p className="text-muted-foreground font-mono mt-0.5">{po.freight_tracking_number}</p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">Supplier</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs whitespace-nowrap">{po.eta ?? "—"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColor[po.status] ?? ""}>{po.status}</Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              {po.date_received ? (
                                <div>
                                  <span>{po.date_received}</span>
                                  {po.received_by && <p className="text-muted-foreground">{po.received_by}</p>}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {po.updated_at ? format(new Date(po.updated_at), "dd MMM HH:mm") : "—"}
                              {po.last_updated_by && <p className="truncate max-w-[100px]">{po.last_updated_by}</p>}
                            </TableCell>
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
                                  {po.description && (
                                    <div className="px-4 py-2 border-b text-xs">
                                      <span className="font-medium text-muted-foreground">Description: </span>
                                      <span>{po.description}</span>
                                    </div>
                                  )}
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
                                      <span className="font-medium text-muted-foreground">Notes: </span>
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

            {filtered.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {totalPOs} purchase orders
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            )}
          </TabsContent>

          {/* Spend by Supplier */}
          <TabsContent value="supplier-spend">
            <div className="border rounded-lg bg-card overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Total Spend</TableHead>
                    <TableHead className="text-center">PO Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spendBySupplier.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">No spend data</TableCell>
                    </TableRow>
                  ) : (
                    spendBySupplier.map(([supplier, total]) => (
                      <TableRow key={supplier}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {supplier}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {poItems.filter((po) => po.supplier === supplier && po.status !== "Cancelled").length}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Spend by Work Order */}
          <TabsContent value="wo-spend">
            <div className="border rounded-lg bg-card overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Work Order</TableHead>
                    <TableHead className="text-right">Total Spend</TableHead>
                    <TableHead className="text-center">PO Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spendByWO.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">No WO-linked spend data</TableCell>
                    </TableRow>
                  ) : (
                    spendByWO.map(([woId, { total, woNumber }]) => (
                      <TableRow key={woId}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono">{woNumber}</span>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {poItems.filter((po) => po.work_order_id === woId && po.status !== "Cancelled").length}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
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
