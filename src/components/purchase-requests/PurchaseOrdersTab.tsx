import React, { useState } from "react";
import { Package, Loader2, CheckCircle2, Clock, Mail, MessageSquare, Image as ImageIcon, MapPin, Truck, PackageCheck } from "lucide-react";
import { ReceivePODialog } from "./ReceivePODialog";
import { POPdfGenerator } from "./POPdfGenerator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { usePOTracker, type POTrackerItem } from "@/hooks/usePOTracker";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const PO_STATUSES = ["All", "Draft", "Issued", "In Transit", "Received Partial", "Received Complete", "Cancelled"];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Draft: "bg-muted text-muted-foreground",
    Ordered: "bg-blue-500/20 text-blue-700 border-blue-500/30",
    Issued: "bg-amber-500/20 text-amber-700 border-amber-500/30",
    "In Transit": "bg-violet-500/20 text-violet-700 border-violet-500/30",
    "Received Partial": "bg-orange-500/20 text-orange-700 border-orange-500/30",
    "Received Complete": "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
    Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
  };
  return map[status] || "";
};

export const PurchaseOrdersTab: React.FC = () => {
  const { poItems, isLoading } = usePOTracker();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [emailPreviewPO, setEmailPreviewPO] = useState<POTrackerItem | null>(null);
  const [trackingPO, setTrackingPO] = useState<POTrackerItem | null>(null);
  const [receivePO, setReceivePO] = useState<POTrackerItem | null>(null);

  const checkpointsQuery = useQuery({
    queryKey: ["po_transit_checkpoints", trackingPO?.id],
    enabled: !!trackingPO,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("po_transit_checkpoints")
        .select("*")
        .eq("po_tracker_id", trackingPO!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  const filtered = (poItems || []).filter((po: any) => {
    const matchSearch = !search ||
      po.po_number?.toLowerCase().includes(search.toLowerCase()) ||
      po.supplier?.toLowerCase().includes(search.toLowerCase()) ||
      po.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || po.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: (poItems || []).length,
    issued: (poItems || []).filter((p: any) => p.status === "Issued").length,
    inTransit: (poItems || []).filter((p: any) => p.status === "In Transit").length,
    received: (poItems || []).filter((p: any) => p.status === "Received Complete").length,
    confirmed: (poItems || []).filter((p: any) => p.supplier_confirmed).length,
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total POs</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.issued}</p>
          <p className="text-xs text-muted-foreground">Issued</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-violet-600">{stats.inTransit}</p>
          <p className="text-xs text-muted-foreground">In Transit</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.received}</p>
          <p className="text-xs text-muted-foreground">Received</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-primary">{stats.confirmed}</p>
          <p className="text-xs text-muted-foreground">Supplier Confirmed</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search PO#, supplier, description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PO_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-[50px]">Image</TableHead>
                <TableHead className="font-semibold">PO #</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Value</TableHead>
                <TableHead className="font-semibold">ETA</TableHead>
                <TableHead className="font-semibold">Supplier Confirmed</TableHead>
                <TableHead className="font-semibold">Ordered</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No purchase orders found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((po: any) => (
                  <TableRow key={po.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      {po.image_url ? (
                        <img
                          src={po.image_url}
                          alt="Part"
                          className="h-10 w-10 rounded border object-contain bg-white"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded border bg-muted/30 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono font-medium text-sm">{po.po_number}</TableCell>
                    <TableCell className="text-sm">{po.supplier || "—"}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{po.description || "—"}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${statusBadge(po.status)}`}>{po.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {(() => {
                        const headerVal = Number(po.total_value || 0);
                        const linesTotal = (po.lines || []).reduce((sum: number, l: any) => sum + (Number(l.unit_price || 0) * Number(l.quantity_ordered || 0)), 0);
                        const displayVal = headerVal > 0 ? headerVal : linesTotal;
                        return `$${displayVal.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;
                      })()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {po.eta ? format(new Date(po.eta), "dd MMM yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {po.supplier_confirmed ? (
                        <div className="space-y-1">
                          <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 text-[10px] gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Yes
                          </Badge>
                          {po.supplier_eta_update && (
                            <div className="flex items-start gap-1 text-[10px] text-muted-foreground max-w-[160px]">
                              <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                              <span className="line-clamp-2 italic">"{po.supplier_eta_update}"</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <Clock className="h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {po.order_date ? format(new Date(po.order_date), "dd MMM yyyy") : "—"}
                    </TableCell>
                    <TableCell className="flex gap-1">
                      <POPdfGenerator po={po} />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1 text-muted-foreground"
                        onClick={() => setEmailPreviewPO(po)}
                      >
                        <Mail className="h-3 w-3" /> Email
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1 text-muted-foreground"
                        onClick={() => setTrackingPO(po)}
                      >
                        <Truck className="h-3 w-3" /> Track
                      </Button>
                      {po.status !== "Received Complete" && po.status !== "Cancelled" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs gap-1 text-emerald-700"
                          onClick={() => setReceivePO(po)}
                        >
                          <PackageCheck className="h-3 w-3" /> Receive
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* PO Email Preview Dialog */}
      <Dialog open={!!emailPreviewPO} onOpenChange={() => setEmailPreviewPO(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" /> Purchase Order Email
            </DialogTitle>
          </DialogHeader>
          {emailPreviewPO && (
            <div className="space-y-4">
              {/* Email header */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold text-muted-foreground w-16">To:</span>
                  <span>{emailPreviewPO.supplier || "Supplier"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-muted-foreground w-16">Subject:</span>
                  <span>Purchase Order {emailPreviewPO.po_number}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-muted-foreground w-16">Date:</span>
                  <span>{emailPreviewPO.order_date ? format(new Date(emailPreviewPO.order_date), "dd MMM yyyy") : format(new Date(emailPreviewPO.created_at), "dd MMM yyyy")}</span>
                </div>
              </div>

              <Separator />

              {/* Email body */}
              <div className="rounded-lg border p-5 space-y-4 bg-background">
                <p className="text-sm">Dear {emailPreviewPO.supplier || "Supplier"},</p>
                <p className="text-sm">
                  Please find below the details of Purchase Order <span className="font-semibold font-mono">{emailPreviewPO.po_number}</span>. 
                  Please confirm receipt and provide delivery updates using the link below.
                </p>

                {/* Part image */}
                {emailPreviewPO.image_url && (
                  <div className="flex justify-center">
                    <img
                      src={emailPreviewPO.image_url}
                      alt="Part reference"
                      className="rounded-md border max-h-40 object-contain bg-white"
                    />
                  </div>
                )}

                {/* PO details */}
                <div className="rounded-md border bg-muted/20 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-semibold">PO Number:</span> <span className="font-mono">{emailPreviewPO.po_number}</span></div>
                    <div><span className="font-semibold">Total Value:</span> ${(() => {
                      const headerVal = Number(emailPreviewPO.total_value || 0);
                      const linesTotal = (emailPreviewPO.lines || []).reduce((sum: number, l: any) => sum + (Number(l.unit_price || 0) * Number(l.quantity_ordered || 0)), 0);
                      return (headerVal > 0 ? headerVal : linesTotal).toLocaleString("en-AU", { minimumFractionDigits: 2 });
                    })()}</div>
                    {emailPreviewPO.eta && (
                      <div><span className="font-semibold">Expected Delivery:</span> {format(new Date(emailPreviewPO.eta), "dd MMM yyyy")}</div>
                    )}
                    {emailPreviewPO.freight_company && (
                      <div><span className="font-semibold">Freight:</span> {emailPreviewPO.freight_company}</div>
                    )}
                  </div>

                  {/* Line items */}
                  {emailPreviewPO.lines && emailPreviewPO.lines.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold mb-1">Line Items:</p>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            <TableHead className="text-xs">#</TableHead>
                            <TableHead className="text-xs">Description</TableHead>
                            <TableHead className="text-xs">Part #</TableHead>
                            <TableHead className="text-xs">Qty</TableHead>
                            <TableHead className="text-xs">Unit Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {emailPreviewPO.lines.map((line: any, i: number) => (
                            <TableRow key={line.id || i}>
                              <TableCell className="text-xs">{i + 1}</TableCell>
                              <TableCell className="text-xs">{line.part_description}</TableCell>
                              <TableCell className="text-xs font-mono">{line.part_number || "—"}</TableCell>
                              <TableCell className="text-xs">{line.quantity_ordered}</TableCell>
                              <TableCell className="text-xs">${Number(line.unit_price || 0).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {emailPreviewPO.comments && (
                  <div className="text-sm">
                    <span className="font-semibold">Notes:</span>
                    <p className="text-muted-foreground mt-1">{emailPreviewPO.comments}</p>
                  </div>
                )}

                <p className="text-sm">
                  Please confirm receipt of this Purchase Order and provide your estimated delivery date using the secure link below:
                </p>

                <div className="rounded-md bg-primary/5 border border-primary/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Supplier Confirmation Link</p>
                  <code className="text-xs text-primary break-all">
                    {window.location.origin}/supplier-portal?mode=confirm&token={emailPreviewPO.confirmation_token || "pending"}
                  </code>
                </div>

                <div className="rounded-md bg-muted/50 border p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">📦 Shipment Tracking Link (QR on PDF)</p>
                  <code className="text-xs text-foreground break-all">
                    {window.location.origin}/track-shipment?po={emailPreviewPO.id}
                  </code>
                </div>

                <p className="text-sm">Kind regards,<br /><span className="font-semibold">TCMG Procurement</span></p>
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Confirmation: {emailPreviewPO.supplier_confirmed ? (
                    <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 text-[10px]">Confirmed</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">Pending</Badge>
                  )}
                </span>
                <Badge className={`text-[10px] ${statusBadge(emailPreviewPO.status)}`}>
                  {emailPreviewPO.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Shipment Tracking Dialog */}
      <Dialog open={!!trackingPO} onOpenChange={() => setTrackingPO(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4" /> Shipment Tracking — {trackingPO?.po_number}
            </DialogTitle>
          </DialogHeader>
          {trackingPO && (
            <div className="space-y-4">
              {/* PO Summary */}
              <div className="rounded-lg border bg-muted/30 p-3 grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-semibold">Supplier:</span> {trackingPO.supplier}</div>
                <div><span className="font-semibold">Status:</span> <Badge className={`text-[10px] ${statusBadge(trackingPO.status)}`}>{trackingPO.status}</Badge></div>
                <div><span className="font-semibold">ETA:</span> {trackingPO.eta ? format(new Date(trackingPO.eta), "dd MMM yyyy") : "—"}</div>
                {trackingPO.freight_tracking_number && (
                  <div><span className="font-semibold">Tracking #:</span> <span className="font-mono text-xs">{trackingPO.freight_tracking_number}</span></div>
                )}
              </div>

              {/* Part image */}
              {trackingPO.image_url && (
                <div className="flex justify-center">
                  <img src={trackingPO.image_url} alt="Part" className="rounded-md border max-h-32 object-contain bg-white" />
                </div>
              )}

              <Separator />

              {/* Checkpoints Timeline */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Transit Checkpoints
                </p>
                {checkpointsQuery.isLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : !checkpointsQuery.data || checkpointsQuery.data.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    <MapPin className="h-6 w-6 mx-auto mb-2 opacity-40" />
                    No checkpoints recorded yet
                  </div>
                ) : (
                  <div className="space-y-0 relative ml-3">
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                    {checkpointsQuery.data.map((cp: any, i: number) => (
                      <div key={cp.id} className="relative flex gap-3 pb-4 last:pb-0">
                        <div className={`relative z-10 mt-1.5 h-4 w-4 rounded-full border-2 shrink-0 ${
                          i === checkpointsQuery.data!.length - 1
                            ? "bg-primary border-primary"
                            : "bg-background border-muted-foreground/30"
                        }`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <p className="text-sm font-medium">{cp.location || "Unknown location"}</p>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {format(new Date(cp.created_at), "dd MMM yyyy, HH:mm")}
                            </span>
                          </div>
                          {cp.notes && <p className="text-xs text-muted-foreground mt-0.5">{cp.notes}</p>}
                          {cp.scanned_by && <p className="text-[10px] text-muted-foreground/70">by {cp.scanned_by}</p>}
                          {cp.latitude && cp.longitude && (
                            <p className="text-[10px] text-muted-foreground/50 font-mono">
                              📍 {Number(cp.latitude).toFixed(4)}, {Number(cp.longitude).toFixed(4)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Public tracking link */}
              <div className="rounded-md bg-muted/50 border p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">📦 Public Tracking Link</p>
                <code className="text-xs text-foreground break-all">
                  {window.location.origin}/track-shipment?po={trackingPO.id}
                </code>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receive PO Dialog */}
      <ReceivePODialog
        po={receivePO}
        open={!!receivePO}
        onOpenChange={(open) => { if (!open) setReceivePO(null); }}
      />
    </div>
  );
};
