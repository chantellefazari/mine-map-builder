import React, { useState, useEffect } from "react";
import { Send, Clock, CheckCircle2, AlertCircle, Loader2, FileText, ChevronDown, ChevronRight, Package } from "lucide-react";
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

interface PartGroup {
  partDescription: string;
  partNumber: string;
  imageUrl: string;
  quantity: number;
  requests: QuoteRequest[];
}

const groupByPart = (requests: QuoteRequest[]): PartGroup[] => {
  const map = new Map<string, PartGroup>();
  for (const qr of requests) {
    // Group key: normalize description + part number
    const key = `${qr.part_description.trim().toLowerCase()}||${(qr.part_number || "").trim().toLowerCase()}`;
    if (!map.has(key)) {
      map.set(key, {
        partDescription: qr.part_description,
        partNumber: qr.part_number,
        imageUrl: qr.image_url,
        quantity: qr.quantity,
        requests: [],
      });
    }
    map.get(key)!.requests.push(qr);
  }
  return Array.from(map.values());
};

export const QuoteRequestsTab: React.FC = () => {
  const { quoteRequests, isLoading, getResponses, updateStatus } = useQuoteRequests();
  const [search, setSearch] = useState("");
  const [responses, setResponses] = useState<Record<string, QuoteResponse[]>>({});
  const [expandedPart, setExpandedPart] = useState<string | null>(null);
  const [loadingResponses, setLoadingResponses] = useState<Set<string>>(new Set());

  const loadResponsesForGroup = async (group: PartGroup) => {
    for (const qr of group.requests) {
      if (responses[qr.id]) continue;
      setLoadingResponses((prev) => new Set(prev).add(qr.id));
      try {
        const data = await getResponses(qr.id);
        setResponses((prev) => ({ ...prev, [qr.id]: data }));
      } catch { /* ignore */ }
      finally {
        setLoadingResponses((prev) => {
          const next = new Set(prev);
          next.delete(qr.id);
          return next;
        });
      }
    }
  };

  const allGroups = groupByPart(quoteRequests);

  const filtered = allGroups.filter((g) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      g.partDescription.toLowerCase().includes(s) ||
      g.partNumber.toLowerCase().includes(s) ||
      g.requests.some((r) => r.supplier_name.toLowerCase().includes(s) || r.supplier_email.toLowerCase().includes(s))
    );
  });

  const stats = {
    totalParts: allGroups.length,
    totalRfqs: quoteRequests.length,
    quoted: quoteRequests.filter((q) => q.status === "Quoted").length,
    accepted: quoteRequests.filter((q) => q.status === "Accepted").length,
  };

  const handleAccept = async (qr: QuoteRequest) => {
    try {
      await updateStatus.mutateAsync({ id: qr.id, status: "Accepted" });
      toast.success(`Quote from ${qr.supplier_name} accepted`);
    } catch { /* handled */ }
  };

  const toggleGroup = (key: string, group: PartGroup) => {
    if (expandedPart === key) {
      setExpandedPart(null);
    } else {
      setExpandedPart(key);
      loadResponsesForGroup(group);
    }
  };

  // Find lowest price per group for highlighting
  const getLowestPriceForGroup = (group: PartGroup): number | null => {
    const allPrices: number[] = [];
    for (const qr of group.requests) {
      const qrResp = responses[qr.id] || [];
      for (const r of qrResp) {
        allPrices.push(r.unit_price);
      }
    }
    return allPrices.length > 0 ? Math.min(...allPrices) : null;
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold">{stats.totalParts}</p>
          <p className="text-xs text-muted-foreground">Parts Quoted</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.totalRfqs}</p>
          <p className="text-xs text-muted-foreground">Total RFQs Sent</p>
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
        placeholder="Search by part, supplier, email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs"
      />

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Send className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p>No quote requests found</p>
          <p className="text-xs mt-1">Send quote requests from the Site Spares catalogue</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((group) => {
            const key = `${group.partDescription}||${group.partNumber}`;
            const isExpanded = expandedPart === key;
            const lowestPrice = getLowestPriceForGroup(group);
            const sentCount = group.requests.filter((r) => r.status === "Sent").length;
            const quotedCount = group.requests.filter((r) => r.status === "Quoted").length;
            const acceptedCount = group.requests.filter((r) => r.status === "Accepted").length;

            return (
              <div key={key} className="rounded-lg border overflow-hidden">
                {/* Part header row — clickable to expand */}
                <div
                  className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => toggleGroup(key, group)}
                >
                  <div className="shrink-0 text-muted-foreground">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                  {group.imageUrl ? (
                    <img src={group.imageUrl} alt="" className="h-10 w-10 rounded object-cover border shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{group.partDescription}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {group.partNumber && (
                        <span className="text-xs text-muted-foreground font-mono">P/N: {group.partNumber}</span>
                      )}
                      <span className="text-xs text-muted-foreground">Qty: {group.quantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <Send className="h-3 w-3" />
                      {group.requests.length} supplier{group.requests.length !== 1 ? "s" : ""}
                    </Badge>
                    {sentCount > 0 && (
                      <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30 text-[10px]">
                        {sentCount} awaiting
                      </Badge>
                    )}
                    {quotedCount > 0 && (
                      <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 text-[10px]">
                        {quotedCount} quoted
                      </Badge>
                    )}
                    {acceptedCount > 0 && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                        {acceptedCount} accepted
                      </Badge>
                    )}
                    {lowestPrice !== null && (
                      <span className="text-xs font-semibold text-emerald-600">
                        Best: ${lowestPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded: supplier comparison table */}
                {isExpanded && (
                  <div className="border-t">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="text-xs font-semibold">Supplier</TableHead>
                          <TableHead className="text-xs font-semibold">Email</TableHead>
                          <TableHead className="text-xs font-semibold">Status</TableHead>
                          <TableHead className="text-xs font-semibold">Unit Price</TableHead>
                          <TableHead className="text-xs font-semibold">Total Price</TableHead>
                          <TableHead className="text-xs font-semibold">Lead Time</TableHead>
                          <TableHead className="text-xs font-semibold">Validity</TableHead>
                          <TableHead className="text-xs font-semibold">Sent</TableHead>
                          <TableHead className="text-xs font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.requests.map((qr) => {
                          const qrResponses = responses[qr.id] || [];
                          const latestResponse = qrResponses[0];
                          const isLowest = latestResponse && lowestPrice !== null && latestResponse.unit_price === lowestPrice;
                          const isLoadingResp = loadingResponses.has(qr.id);

                          return (
                            <TableRow key={qr.id} className="hover:bg-muted/20">
                              <TableCell className="text-sm font-medium">{qr.supplier_name || "—"}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{qr.supplier_email}</TableCell>
                              <TableCell>
                                <Badge className={`text-[10px] gap-1 ${statusColors[qr.status] || ""}`}>
                                  {qr.status === "Sent" && <Clock className="h-3 w-3" />}
                                  {qr.status === "Quoted" && <FileText className="h-3 w-3" />}
                                  {qr.status === "Accepted" && <CheckCircle2 className="h-3 w-3" />}
                                  {qr.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {isLoadingResp ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : latestResponse ? (
                                  <span className={isLowest ? "font-bold text-emerald-600" : ""}>
                                    ${latestResponse.unit_price.toFixed(2)}
                                    {isLowest && " ★"}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-sm">
                                {latestResponse ? `$${latestResponse.total_price.toFixed(2)}` : "—"}
                              </TableCell>
                              <TableCell className="text-sm">
                                {latestResponse ? `${latestResponse.lead_time_days} days` : "—"}
                              </TableCell>
                              <TableCell className="text-sm">
                                {latestResponse ? `${latestResponse.validity_days} days` : "—"}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {format(new Date(qr.created_at), "dd MMM yyyy")}
                              </TableCell>
                              <TableCell>
                                {qr.status === "Quoted" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs gap-1"
                                    onClick={() => handleAccept(qr)}
                                  >
                                    <CheckCircle2 className="h-3 w-3" /> Accept
                                  </Button>
                                )}
                                {qr.status === "Sent" && (
                                  <Badge variant="outline" className="text-xs gap-1">
                                    <Clock className="h-3 w-3" /> Awaiting
                                  </Badge>
                                )}
                                {qr.status === "Accepted" && (
                                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> Selected
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

                    {/* Notes section */}
                    {group.requests.some((qr) => qr.notes) && (
                      <div className="px-4 py-2 border-t bg-muted/20">
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1">Notes:</p>
                        {group.requests.filter((qr) => qr.notes).map((qr) => (
                          <p key={qr.id} className="text-[11px] text-muted-foreground">
                            <span className="font-medium">{qr.supplier_name}:</span> {qr.notes}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="px-4 py-2 border-t bg-muted/10">
                      <p className="text-[10px] text-muted-foreground text-center">
                        All quote requests and responses are stored in the audit history for transparency.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
