import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

type PortalMode = "quote" | "confirm";

interface QuoteDetails {
  id: string;
  part_description: string;
  part_number: string;
  image_url: string;
  quantity: number;
  specifications: string;
  notes: string;
  supplier_name: string;
  status: string;
  expires_at: string | null;
  already_responded: boolean;
}

interface PODetails {
  id: string;
  po_number: string;
  supplier: string;
  description: string;
  total_value: number;
  status: string;
  supplier_confirmed: boolean;
  eta: string | null;
  image_url?: string | null;
  lines: Array<{
    part_description: string;
    part_number: string;
    quantity_ordered: number;
    unit_price: number;
  }>;
}

const SupplierPortal = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const mode: PortalMode = searchParams.get("mode") === "confirm" ? "confirm" : "quote";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Quote state
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null);
  const [unitPrice, setUnitPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState("");
  const [validityDays, setValidityDays] = useState("30");
  const [supplierRef, setSupplierRef] = useState("");
  const [responseNotes, setResponseNotes] = useState("");

  // PO confirm state
  const [poDetails, setPODetails] = useState<PODetails | null>(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [etaUpdate, setEtaUpdate] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

  useEffect(() => {
    if (!token) {
      setError("No access token provided");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        if (mode === "confirm") {
          // PO confirmation mode
          const res = await fetch(
            `https://${projectId}.supabase.co/functions/v1/confirm-purchase-order?token=${token}`
          );
          const data = await res.json();
          if (res.ok) {
            setPODetails(data);
            if (data.supplier_confirmed) setSubmitted(true);
            return;
          }
        }

        // Try quote response mode first
        const quoteRes = await fetch(
          `https://${projectId}.supabase.co/functions/v1/submit-quote-response?token=${token}`
        );
        const quoteData = await quoteRes.json();

        if (quoteRes.ok) {
          setQuoteDetails(quoteData);
          if (quoteData.already_responded) setSubmitted(true);
          return;
        }

        // If quote mode failed and we haven't tried confirm yet, try PO confirm
        if (mode !== "confirm") {
          const poRes = await fetch(
            `https://${projectId}.supabase.co/functions/v1/confirm-purchase-order?token=${token}`
          );
          const poData = await poRes.json();

          if (poRes.ok) {
            setPODetails(poData);
            if (poData.supplier_confirmed) setSubmitted(true);
            return;
          }
        }

        setError("Invalid or expired token");
      } catch {
        setError("Failed to load details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [token, mode, projectId]);

  const handleSubmitQuote = async () => {
    if (!unitPrice || !leadTimeDays) {
      toast.error("Price and lead time are required");
      return;
    }
    setSubmitting(true);
    try {
      const qty = quoteDetails?.quantity || 1;
      const up = parseFloat(unitPrice);
      const tp = totalPrice ? parseFloat(totalPrice) : up * qty;

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/submit-quote-response`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            unit_price: up,
            total_price: tp,
            lead_time_days: parseInt(leadTimeDays),
            validity_days: parseInt(validityDays) || 30,
            supplier_reference: supplierRef,
            notes: responseNotes,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
      toast.success("Quote submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit quote");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPO = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/confirm-purchase-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            estimated_delivery_date: estimatedDelivery || null,
            supplier_eta_update: etaUpdate,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
      toast.success("Purchase order confirmed!");
    } catch (err: any) {
      toast.error(err.message || "Failed to confirm");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-3">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-lg font-semibold">Access Error</h2>
            <p className="text-muted-foreground text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-semibold">
              {mode === "confirm" ? "Purchase Order Confirmed" : "Quote Submitted"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {mode === "confirm"
                ? "Thank you for confirming receipt of this purchase order."
                : "Thank you for your quotation. We will review and respond shortly."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quote submission form
  if (mode === "quote" && quoteDetails) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-lg bg-primary mx-auto flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">TC</span>
            </div>
            <h1 className="text-xl font-bold">Request for Quotation</h1>
            <p className="text-muted-foreground text-sm">TCMG – Tennant Creek Gold Mine</p>
          </div>

          {/* Part Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Part Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Description:</span>
                  <p className="font-medium">{quoteDetails.part_description}</p>
                </div>
                {quoteDetails.part_number && (
                  <div>
                    <span className="text-muted-foreground">Part Number:</span>
                    <p className="font-medium">{quoteDetails.part_number}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <p className="font-medium">{quoteDetails.quantity}</p>
                </div>
                {quoteDetails.expires_at && (
                  <div>
                    <span className="text-muted-foreground">Expires:</span>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(quoteDetails.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              {quoteDetails.specifications && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Specifications:</span>
                  <p>{quoteDetails.specifications}</p>
                </div>
              )}
              {quoteDetails.image_url && (
                <img
                  src={quoteDetails.image_url}
                  alt="Part"
                  className="rounded-md max-h-48 object-contain border"
                />
              )}
              {quoteDetails.notes && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Notes:</span>
                  <p>{quoteDetails.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quote Response Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Your Quotation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Unit Price (AUD) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => {
                      setUnitPrice(e.target.value);
                      const qty = quoteDetails.quantity || 1;
                      const up = parseFloat(e.target.value) || 0;
                      setTotalPrice((up * qty).toFixed(2));
                    }}
                    placeholder="0.00"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Total Price (AUD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    placeholder="Auto-calculated"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Lead Time (days) *</Label>
                  <Input
                    type="number"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(e.target.value)}
                    placeholder="e.g. 14"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Quote Validity (days)</Label>
                  <Input
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    placeholder="30"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Your Reference Number</Label>
                <Input
                  value={supplierRef}
                  onChange={(e) => setSupplierRef(e.target.value)}
                  placeholder="e.g. QUO-12345"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Notes / Conditions</Label>
                <Textarea
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Any conditions, availability notes..."
                  className="min-h-[60px] text-sm"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSubmitQuote}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Submit Quotation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // PO Confirmation form
  if (mode === "confirm" && poDetails) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-lg bg-primary mx-auto flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">TC</span>
            </div>
            <h1 className="text-xl font-bold">Purchase Order Confirmation</h1>
            <p className="text-muted-foreground text-sm">TCMG – Tennant Creek Gold Mine</p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{poDetails.po_number}</span>
                <Badge variant="secondary">{poDetails.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Supplier:</span> {poDetails.supplier}</p>
                <p><span className="text-muted-foreground">Description:</span> {poDetails.description}</p>
                <p><span className="text-muted-foreground">Total Value:</span> ${Number(poDetails.total_value || 0).toFixed(2)}</p>
              </div>

              {poDetails.image_url && (
                <div className="flex justify-center py-2">
                  <img
                    src={poDetails.image_url}
                    alt="Part reference"
                    className="rounded-md border max-h-48 object-contain bg-white"
                  />
                </div>
              )}

              {poDetails.lines.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Part</th>
                        <th className="p-2 text-left">P/N</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {poDetails.lines.map((l, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">{l.part_description}</td>
                          <td className="p-2">{l.part_number}</td>
                          <td className="p-2 text-right">{l.quantity_ordered}</td>
                          <td className="p-2 text-right">${l.unit_price?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="pt-3 border-t space-y-3">
                <div>
                  <Label className="text-xs">Estimated Delivery Date</Label>
                  <Input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Delivery Notes / ETA Comments</Label>
                  <Textarea
                    value={etaUpdate}
                    onChange={(e) => setEtaUpdate(e.target.value)}
                    placeholder="Any delivery notes..."
                    className="min-h-[50px] text-sm"
                  />
                </div>
                <Button className="w-full" onClick={handleConfirmPO} disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Confirm Purchase Order Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default SupplierPortal;
