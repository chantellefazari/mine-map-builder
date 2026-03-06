import React, { useState, useEffect } from "react";
import { Send, Clock, CheckCircle2, AlertCircle, Loader2, FileText, ChevronDown, ChevronRight, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useQuoteRequests, type QuoteRequest, type QuoteResponse } from "@/hooks/useQuoteRequests";
import { usePOTracker } from "@/hooks/usePOTracker";
import { supabase } from "@/integrations/supabase/client";
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
  const { allocate: allocatePO } = usePOTracker();
  const [search, setSearch] = useState("");
  const [responses, setResponses] = useState<Record<string, QuoteResponse[]>>({});
  const [expandedPart, setExpandedPart] = useState<string | null>(null);
  const [loadingResponses, setLoadingResponses] = useState<Set<string>>(new Set());
  const [emailPreview, setEmailPreview] = useState<QuoteRequest | null>(null);

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

  const [accepting, setAccepting] = useState<string | null>(null);

  const handleAccept = async (qr: QuoteRequest) => {
    // Ensure we have responses loaded
    const qrResponses = responses[qr.id] || [];
    const latestResponse = qrResponses[0];

    if (!latestResponse) {
      toast.error("No quote response found. Cannot accept without pricing data.");
      return;
    }

    setAccepting(qr.id);
    try {
      // 1. Update quote status to Accepted
      await updateStatus.mutateAsync({ id: qr.id, status: "Accepted" });

      // 2. Calculate ETA from lead time
      const etaDate = new Date();
      etaDate.setDate(etaDate.getDate() + latestResponse.lead_time_days);

      // 3. Auto-create Purchase Order
      const po = await allocatePO.mutateAsync({
        supplier: qr.supplier_name,
        description: qr.part_description,
        freight_company: "",
        status: "Draft",
        confirmed_on_site: false,
        order_date: new Date().toISOString().split("T")[0],
        eta: etaDate.toISOString().split("T")[0],
        comments: `Auto-generated from accepted quote. Supplier: ${qr.supplier_name}`,
        total_value: latestResponse.total_price,
        quote_request_id: qr.id,
        lines: [{
          part_description: qr.part_description,
          part_number: qr.part_number || "",
          quantity_ordered: qr.quantity,
          unit_price: latestResponse.unit_price,
          received_qty: 0,
          notes: `Lead time: ${latestResponse.lead_time_days} days | Validity: ${latestResponse.validity_days} days`,
        }],
      } as any);

      // 4. Send PO email (mocked) via edge function
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/send-purchase-order`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              po_id: po.id,
              supplier_email: qr.supplier_email,
            }),
          }
        );
        const emailResult = await res.json();
        if (res.ok) {
          // 5. Update quote status to PO Issued
          await updateStatus.mutateAsync({ id: qr.id, status: "PO Issued" });
          toast.success(`PO ${po.po_number} created and sent to ${qr.supplier_name}`);
        } else {
          toast.warning(`PO created but email failed: ${emailResult.error}`);
        }
      } catch (emailErr) {
        toast.warning("PO created but email sending failed");
        console.error("PO email error:", emailErr);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process acceptance");
      console.error("Accept flow error:", err);
    } finally {
      setAccepting(null);
    }
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
                    <div className="divide-y">
                      {group.requests.map((qr) => {
                        const qrResponses = responses[qr.id] || [];
                        const latestResponse = qrResponses[0];
                        const isLowest = latestResponse && lowestPrice !== null && latestResponse.unit_price === lowestPrice;
                        const isLoadingResp = loadingResponses.has(qr.id);
                        const respNotes = qrResponses.filter((r) => r.notes);

                        return (
                          <div key={qr.id} className="px-4 py-3 hover:bg-muted/20 transition-colors">
                            {/* Main row info */}
                            <div className="flex items-start gap-4 flex-wrap">
                              {/* Supplier info */}
                              <div className="min-w-[180px] flex-1">
                                <p className="text-sm font-medium">{qr.supplier_name || "—"}</p>
                                <p className="text-xs text-muted-foreground">{qr.supplier_email}</p>
                              </div>

                              {/* Status */}
                              <div className="shrink-0">
                                <Badge className={`text-[10px] gap-1 ${statusColors[qr.status] || ""}`}>
                                  {qr.status === "Sent" && <Clock className="h-3 w-3" />}
                                  {qr.status === "Quoted" && <FileText className="h-3 w-3" />}
                                  {qr.status === "Accepted" && <CheckCircle2 className="h-3 w-3" />}
                                  {qr.status}
                                </Badge>
                              </div>

                              {/* Pricing & details */}
                              {isLoadingResp ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              ) : latestResponse ? (
                                <div className="flex items-center gap-4 text-sm flex-wrap">
                                  <div>
                                    <p className="text-[10px] text-muted-foreground">Unit Price</p>
                                    <p className={isLowest ? "font-bold text-emerald-600" : "font-medium"}>
                                      ${latestResponse.unit_price.toFixed(2)}{isLowest && " ★"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground">Total</p>
                                    <p className="font-medium">${latestResponse.total_price.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground">Lead Time</p>
                                    <p>{latestResponse.lead_time_days} days</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground">Validity</p>
                                    <p>{latestResponse.validity_days} days</p>
                                  </div>
                                  {latestResponse.supplier_reference && (
                                    <div>
                                      <p className="text-[10px] text-muted-foreground">Supplier Ref</p>
                                      <p className="font-mono text-xs">{latestResponse.supplier_reference}</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">Awaiting response</span>
                              )}

                              {/* Sent date */}
                              <div className="shrink-0 text-right">
                                <p className="text-[10px] text-muted-foreground">Sent</p>
                                <p className="text-xs">{format(new Date(qr.created_at), "dd MMM yyyy")}</p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs gap-1 text-muted-foreground"
                                  onClick={() => setEmailPreview(qr)}
                                >
                                  <Mail className="h-3 w-3" /> Email
                                </Button>
                                {qr.status === "Quoted" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs gap-1"
                                    onClick={() => handleAccept(qr)}
                                    disabled={accepting === qr.id}
                                  >
                                    {accepting === qr.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="h-3 w-3" />
                                    )}
                                    {accepting === qr.id ? "Processing..." : "Accept & Create PO"}
                                  </Button>
                                )}
                                {qr.status === "Sent" && (
                                  <Badge variant="outline" className="text-xs gap-1">
                                    <Clock className="h-3 w-3" /> Awaiting
                                  </Badge>
                                )}
                                {(qr.status === "Accepted" || qr.status === "PO Issued") && (
                                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> {qr.status === "PO Issued" ? "PO Issued" : "Selected"}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Inline supplier conditions / notes */}
                            {(respNotes.length > 0 || qr.notes) && (
                              <div className="mt-2 space-y-1.5 ml-0">
                                {respNotes.map((r) => (
                                  <div key={r.id} className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                                    <p className="text-[10px] font-semibold text-emerald-700 mb-0.5">Supplier Conditions:</p>
                                    <p className="text-xs text-foreground">{r.notes}</p>
                                  </div>
                                ))}
                                {qr.notes && (
                                  <div className="rounded-md border bg-muted/30 px-3 py-2">
                                    <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">Our Notes:</p>
                                    <p className="text-xs text-muted-foreground">{qr.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

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

      {/* Email Preview Dialog */}
      <Dialog open={!!emailPreview} onOpenChange={() => setEmailPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Sent to Supplier
            </DialogTitle>
          </DialogHeader>
          {emailPreview && (
            <div className="space-y-4">
              {/* Email header */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold text-muted-foreground w-16">To:</span>
                  <span>{emailPreview.supplier_email}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-muted-foreground w-16">Subject:</span>
                  <span>Request for Quote — {emailPreview.part_description}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-muted-foreground w-16">Date:</span>
                  <span>{format(new Date(emailPreview.created_at), "dd MMM yyyy, HH:mm")}</span>
                </div>
              </div>

              <Separator />

              {/* Email body */}
              <div className="rounded-lg border p-5 space-y-4 bg-background">
                <p className="text-sm">Dear {emailPreview.supplier_name || "Supplier"},</p>
                <p className="text-sm">
                  We are requesting a quotation for the following part. Please review the details below and submit your pricing using the provided link.
                </p>

                {/* Part details card */}
                <div className="rounded-md border bg-muted/20 p-4 space-y-2">
                  <div className="flex gap-4">
                    {emailPreview.image_url && (
                      <img
                        src={emailPreview.image_url}
                        alt="Part"
                        className="h-20 w-20 rounded-md object-cover border shrink-0"
                      />
                    )}
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold">Part:</span> {emailPreview.part_description}</p>
                      {emailPreview.part_number && (
                        <p><span className="font-semibold">Part Number:</span> <span className="font-mono">{emailPreview.part_number}</span></p>
                      )}
                      <p><span className="font-semibold">Quantity Required:</span> {emailPreview.quantity}</p>
                      {emailPreview.specifications && (
                        <p><span className="font-semibold">Specifications:</span> {emailPreview.specifications}</p>
                      )}
                    </div>
                  </div>
                </div>

                {emailPreview.notes && (
                  <div className="text-sm">
                    <span className="font-semibold">Additional Notes:</span>
                    <p className="text-muted-foreground mt-1">{emailPreview.notes}</p>
                  </div>
                )}

                <p className="text-sm">
                  Please submit your quotation including unit price, lead time, and validity period using the secure link below:
                </p>

                <div className="rounded-md bg-primary/5 border border-primary/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Supplier Quote Submission Link</p>
                  <code className="text-xs text-primary break-all">
                    {window.location.origin}/supplier-portal?token={emailPreview.token}
                  </code>
                </div>

                <p className="text-sm">
                  If you have any questions regarding this request, please don't hesitate to contact us.
                </p>
                <p className="text-sm">Kind regards,<br /><span className="font-semibold">TCMG Procurement</span></p>
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Token: <code className="font-mono">{emailPreview.token.slice(0, 12)}...</code></span>
                <Badge className={`text-[10px] ${statusColors[emailPreview.status] || ""}`}>
                  {emailPreview.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
