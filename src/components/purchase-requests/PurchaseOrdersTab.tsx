import React, { useState } from "react";
import { Package, Loader2, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { usePOTracker } from "@/hooks/usePOTracker";
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
                <TableHead className="font-semibold">PO #</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Value</TableHead>
                <TableHead className="font-semibold">ETA</TableHead>
                <TableHead className="font-semibold">Supplier Confirmed</TableHead>
                <TableHead className="font-semibold">Ordered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No purchase orders found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((po: any) => (
                  <TableRow key={po.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-medium text-sm">{po.po_number}</TableCell>
                    <TableCell className="text-sm">{po.supplier || "—"}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{po.description || "—"}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${statusBadge(po.status)}`}>{po.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      ${Number(po.total_value || 0).toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {po.eta ? format(new Date(po.eta), "dd MMM yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {po.supplier_confirmed ? (
                        <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 text-[10px] gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <Clock className="h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {po.order_date ? format(new Date(po.order_date), "dd MMM yyyy") : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
