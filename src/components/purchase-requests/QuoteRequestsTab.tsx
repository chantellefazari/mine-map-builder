import React, { useState, useEffect } from "react";
import { Send, Clock, CheckCircle2, AlertCircle, Loader2, FileText, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useQuoteRequests, type QuoteRequest, type QuoteResponse } from "@/hooks/useQuoteRequests";
import { toast } from "sonner";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  Sent: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  Quoted: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
  Expired: "bg-muted text-muted-foreground",
  Accepted: "bg-primary/20 text-primary border-primary/30",
  "PO Issued": "bg-amber-500/20 text-amber-700 border-amber-500/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  Sent: <Clock className="h-3 w-3" />,
  Quoted: <FileText className="h-3 w-3" />,
  Accepted: <CheckCircle2 className="h-3 w-3" />,
  Expired: <AlertCircle className="h-3 w-3" />,
};

export const QuoteRequestsTab: React.FC = () => {
  const { quoteRequests, isLoading, getResponses, updateStatus } = useQuoteRequests();
  const [search, setSearch] = useState("");
  const [responses, setResponses] = useState<Record<string, QuoteResponse[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadResponses = async (qrId: string) => {
    if (responses[qrId]) return;
    try {
      const data = await getResponses(qrId);
      setResponses((prev) => ({ ...prev, [qrId]: data }));
    } catch {
      toast.error("Failed to load responses");
    }
  };

  const filtered = quoteRequests.filter((qr) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      qr.part_description.toLowerCase().includes(s) ||
      qr.supplier_name.toLowerCase().includes(s) ||
      qr.supplier_email.toLowerCase().includes(s) ||
      qr.status.toLowerCase().includes(s)
    );
  });

  const stats = {
    total: quoteRequests.length,
    sent: quoteRequests.filter((q) => q.status === "Sent").length,
    quoted: quoteRequests.filter((q) => q.status === "Quoted").length,
    accepted: quoteRequests.filter((q) => q.status === "Accepted").length,
  };

  const handleAccept = async (qr: QuoteRequest) => {
    try {
      await updateStatus.mutateAsync({ id: qr.id, status: "Accepted" });
      toast.success(`Quote from ${qr.supplier_name} accepted`);
    } catch { /* handled */ }
  };

  const toggleExpand = (qrId: string) => {
    if (expandedId === qrId) {
      setExpandedId(null);
    } else {
      setExpandedId(qrId);
      loadResponses(qrId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total RFQs</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
          <p className="text-xs text-muted-foreground">Awaiting Response</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.quoted}</p>
          <p className="text-xs text-muted-foreground">Quotes Received</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-primary">{stats.accepted}</p>
          <p className="text-xs text-muted-foreground">Accepted</p>
        </CardContent></Card>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by part, supplier, email, status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs"
      />

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
                <TableHead className="font-semibold">Part Description</TableHead>
                <TableHead className="font-semibold">Part #</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Qty</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Sent</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    <Send className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No quote requests found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((qr) => {
                  const qrResponses = responses[qr.id] || [];
                  const isExpanded = expandedId === qr.id;
                  return (
                    <React.Fragment key={qr.id}>
                      <TableRow
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => toggleExpand(qr.id)}
                      >
                        <TableCell className="text-sm max-w-[200px] truncate">{qr.part_description}</TableCell>
                        <TableCell className="text-sm font-mono">{qr.part_number || "—"}</TableCell>
                        <TableCell className="text-sm">{qr.supplier_name || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{qr.supplier_email}</TableCell>
                        <TableCell className="text-sm">{qr.quantity}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] gap-1 ${statusColors[qr.status] || ""}`}>
                            {statusIcons[qr.status]}
                            {qr.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(qr.created_at), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          {qr.status === "Quoted" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={(e) => { e.stopPropagation(); handleAccept(qr); }}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Accept
                            </Button>
                          )}
                          {qr.status === "Sent" && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" /> Awaiting
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/20 p-4">
                            {qrResponses.length === 0 ? (
                              <p className="text-xs text-muted-foreground italic">No responses received yet.</p>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-xs font-semibold">Supplier Response(s):</p>
                                {qrResponses.map((r) => (
                                  <div key={r.id} className="grid grid-cols-5 gap-3 text-xs bg-background rounded-md p-3 border">
                                    <div><span className="text-muted-foreground">Unit Price:</span> <span className="font-medium">${r.unit_price.toFixed(2)}</span></div>
                                    <div><span className="text-muted-foreground">Total:</span> <span className="font-medium">${r.total_price.toFixed(2)}</span></div>
                                    <div><span className="text-muted-foreground">Lead Time:</span> <span className="font-medium">{r.lead_time_days} days</span></div>
                                    <div><span className="text-muted-foreground">Valid For:</span> <span className="font-medium">{r.validity_days} days</span></div>
                                    <div><span className="text-muted-foreground">Ref:</span> <span className="font-medium">{r.supplier_reference || "—"}</span></div>
                                    {r.notes && (
                                      <div className="col-span-5 text-muted-foreground">Notes: {r.notes}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
