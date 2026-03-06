import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Clock, Send, FileText, Loader2, ExternalLink } from "lucide-react";
import { useQuoteRequests, type QuoteRequest, type QuoteResponse } from "@/hooks/useQuoteRequests";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  Sent: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  Quoted: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
  Expired: "bg-muted text-muted-foreground",
  Accepted: "bg-primary/20 text-primary border-primary/30",
  "PO Issued": "bg-amber-500/20 text-amber-700 border-amber-500/30",
};

interface QuoteComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spareId?: string;
  partDescription?: string;
}

export const QuoteComparisonDialog = ({
  open,
  onOpenChange,
  spareId,
  partDescription,
}: QuoteComparisonDialogProps) => {
  const { quoteRequests, isLoading, getResponses, updateStatus } = useQuoteRequests(spareId);
  const [responses, setResponses] = useState<Record<string, QuoteResponse[]>>({});
  const [loadingResponses, setLoadingResponses] = useState<Set<string>>(new Set());

  const loadResponses = async (qrId: string) => {
    if (responses[qrId]) return;
    setLoadingResponses((prev) => new Set(prev).add(qrId));
    try {
      const data = await getResponses(qrId);
      setResponses((prev) => ({ ...prev, [qrId]: data }));
    } catch {
      toast.error("Failed to load responses");
    } finally {
      setLoadingResponses((prev) => {
        const next = new Set(prev);
        next.delete(qrId);
        return next;
      });
    }
  };

  useEffect(() => {
    if (open && quoteRequests.length > 0) {
      quoteRequests.forEach((qr) => {
        if (qr.status === "Quoted") loadResponses(qr.id);
      });
    }
  }, [open, quoteRequests]);

  const handleAcceptQuote = async (qr: QuoteRequest) => {
    try {
      await updateStatus.mutateAsync({ id: qr.id, status: "Accepted" });
      toast.success(`Quote from ${qr.supplier_name} accepted`);
    } catch {
      // handled
    }
  };

  // Find the best (lowest) price across all responses
  const allResponses = Object.values(responses).flat();
  const lowestPrice = allResponses.length > 0
    ? Math.min(...allResponses.map((r) => r.unit_price))
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">
            Quote Comparison — {partDescription || "Part"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : quoteRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>No quote requests sent for this part yet.</p>
            <p className="text-xs">Use the "Request Quote" button to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="border">
                <CardContent className="pt-3 pb-2 text-center">
                  <p className="text-2xl font-bold">{quoteRequests.length}</p>
                  <p className="text-[10px] text-muted-foreground">RFQs Sent</p>
                </CardContent>
              </Card>
              <Card className="border">
                <CardContent className="pt-3 pb-2 text-center">
                  <p className="text-2xl font-bold">
                    {quoteRequests.filter((q) => q.status === "Quoted").length}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Quotes Received</p>
                </CardContent>
              </Card>
              <Card className="border">
                <CardContent className="pt-3 pb-2 text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {lowestPrice !== null ? `$${lowestPrice.toFixed(2)}` : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Lowest Price</p>
                </CardContent>
              </Card>
            </div>

            {/* Quote requests table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Supplier</TableHead>
                  <TableHead className="text-xs">Email</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Unit Price</TableHead>
                  <TableHead className="text-xs">Lead Time</TableHead>
                  <TableHead className="text-xs">Validity</TableHead>
                  <TableHead className="text-xs">Sent</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quoteRequests.map((qr) => {
                  const qrResponses = responses[qr.id] || [];
                  const latestResponse = qrResponses[0];
                  const isLowest = latestResponse && lowestPrice !== null && latestResponse.unit_price === lowestPrice;

                  return (
                    <TableRow key={qr.id}>
                      <TableCell className="text-xs font-medium">{qr.supplier_name || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{qr.supplier_email}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${statusColors[qr.status] || ""}`}>
                          {qr.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {latestResponse ? (
                          <span className={isLowest ? "font-bold text-emerald-600" : ""}>
                            ${latestResponse.unit_price.toFixed(2)}
                            {isLowest && " ★"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {latestResponse ? `${latestResponse.lead_time_days}d` : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {latestResponse ? `${latestResponse.validity_days}d` : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(qr.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {qr.status === "Quoted" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-[10px] px-2"
                              onClick={() => handleAcceptQuote(qr)}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                          )}
                          {qr.status === "Sent" && (
                            <Badge variant="outline" className="text-[10px]">
                              <Clock className="h-3 w-3 mr-1" />
                              Awaiting
                            </Badge>
                          )}
                          {loadingResponses.has(qr.id) && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Audit note */}
            <p className="text-[10px] text-muted-foreground text-center pt-2">
              All quote requests and responses are stored in the audit history for transparency and compliance.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
