import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { usePurchaseRequests, PurchaseRequest, PRLineItem } from "@/hooks/usePurchaseRequests";
import { PRStatusBadge } from "./PRStatusBadge";
import { PRLineItemsTable } from "./PRLineItemsTable";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prId: string;
}

const STATUS_FLOW: Record<string, string> = {
  "Submitted to Admin": "Admin Review",
  "Admin Review": "Sent for Approval",
  "Sent for Approval": "Approved",
  Approved: "PO Generated",
};

export const PRDetailDialog: React.FC<Props> = ({ open, onOpenChange, prId }) => {
  const { isAdmin } = useAuth();
  const { getWithLines, updateStatus, updatePR } = usePurchaseRequests();
  const [pr, setPr] = useState<(PurchaseRequest & { lines: PRLineItem[] }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [advancing, setAdvancing] = useState(false);

  // Admin-editable fields during Admin Review
  const [freightToggle, setFreightToggle] = useState(false);
  const [freightCompany, setFreightCompany] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [supplierAbn, setSupplierAbn] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [savingFields, setSavingFields] = useState(false);

  useEffect(() => {
    if (open && prId) {
      setLoading(true);
      getWithLines(prId)
        .then((data) => {
          setPr(data);
          setAdminNotes(data.admin_notes);
          setFreightToggle(data.supplier_organises_freight);
          setFreightCompany(data.freight_company);
          setDeliveryAddress(data.delivery_address);
          setSupplierAbn(data.supplier_abn);
          setPaymentTerms(data.payment_terms);
        })
        .finally(() => setLoading(false));
    }
  }, [open, prId]);

  const isAdminReview = pr?.status === "Admin Review" || pr?.status === "Submitted to Admin";

  const saveAdminFields = async () => {
    if (!pr) return;
    setSavingFields(true);
    try {
      await updatePR.mutateAsync({
        id: pr.id,
        supplier_organises_freight: freightToggle,
        freight_company: freightCompany,
        delivery_address: deliveryAddress,
        supplier_abn: supplierAbn,
        payment_terms: paymentTerms,
        admin_notes: adminNotes,
      } as any);
      toast.success("PR details updated");
      const updated = await getWithLines(prId);
      setPr(updated);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSavingFields(false);
    }
  };

  const advanceStatus = async () => {
    if (!pr) return;
    const nextStatus = STATUS_FLOW[pr.status];
    if (!nextStatus) return;
    setAdvancing(true);
    try {
      // Save editable fields first if in admin review
      if (isAdminReview) {
        await updatePR.mutateAsync({
          id: pr.id,
          supplier_organises_freight: freightToggle,
          freight_company: freightCompany,
          delivery_address: deliveryAddress,
          supplier_abn: supplierAbn,
          payment_terms: paymentTerms,
          admin_notes: adminNotes,
        } as any);
      }
      await updateStatus.mutateAsync({ id: pr.id, status: nextStatus, extra: { admin_notes: adminNotes } });
      toast.success(`PR advanced to: ${nextStatus}`);
      const updated = await getWithLines(prId);
      setPr(updated);
      setAdminNotes(updated.admin_notes);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAdvancing(false);
    }
  };

  if (!pr) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">PR not found</p>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  const nextStatus = STATUS_FLOW[pr.status];
  const isEditable = pr.status === "Draft";
  const total = pr.lines.reduce((s, l) => s + l.quantity * l.estimated_cost, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono">{pr.pr_number}</span>
            <PRStatusBadge status={pr.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Summary grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Supervisor</span>
              <p className="font-medium">{pr.supervisor_name || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Department</span>
              <p className="font-medium">{pr.department || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Supplier</span>
              <p className="font-medium">{pr.supplier_name || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Total Estimated</span>
              <p className="font-bold text-primary">${total.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Linked WO</span>
              <p className="font-medium">{pr.work_order_id ? "Linked" : "Standalone"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Required Date</span>
              <p className="font-medium">{pr.required_date ? format(new Date(pr.required_date), "dd MMM yyyy") : "—"}</p>
            </div>
          </div>

          {/* Freight & Delivery — editable by admin during review */}
          {isAdmin && isAdminReview ? (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
              <h3 className="text-sm font-semibold">Freight & Delivery (Admin Editable)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Supplier Organises Freight?</Label>
                  <div className="flex items-center gap-2 pt-1">
                    <Switch checked={freightToggle} onCheckedChange={setFreightToggle} />
                    <span className="text-sm text-muted-foreground">{freightToggle ? "Yes" : "No"}</span>
                  </div>
                </div>
                {!freightToggle && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Freight Company</Label>
                    <Input value={freightCompany} onChange={(e) => setFreightCompany(e.target.value)} placeholder="e.g. TNT, Toll, StarTrack" className="text-sm" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Delivery Address</Label>
                <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Supplier ABN</Label>
                  <Input value={supplierAbn} onChange={(e) => setSupplierAbn(e.target.value)} placeholder="XX XXX XXX XXX" className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Payment Terms</Label>
                  <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="e.g. Net 30, COD" className="text-sm" />
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={saveAdminFields} disabled={savingFields}>
                {savingFields && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Supplier Organises Freight</span>
                <p className="font-medium">{pr.supplier_organises_freight ? "Yes" : "No"}</p>
              </div>
              {!pr.supplier_organises_freight && pr.freight_company && (
                <div>
                  <span className="text-muted-foreground text-xs">Freight Company</span>
                  <p className="font-medium">{pr.freight_company}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground text-xs">Delivery Address</span>
                <p className="font-medium">{pr.delivery_address || "—"}</p>
              </div>
              {pr.supplier_abn && (
                <div>
                  <span className="text-muted-foreground text-xs">Supplier ABN</span>
                  <p className="font-medium">{pr.supplier_abn}</p>
                </div>
              )}
              {pr.payment_terms && (
                <div>
                  <span className="text-muted-foreground text-xs">Payment Terms</span>
                  <p className="font-medium">{pr.payment_terms}</p>
                </div>
              )}
            </div>
          )}

          {/* Quote link */}
          {pr.quote_url && (
            <a href={pr.quote_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> View Attached Quote
            </a>
          )}

          {/* Line items */}
          <PRLineItemsTable lines={pr.lines} onChange={() => {}} readOnly />

          {/* Comments */}
          {pr.comments && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Comments</Label>
              <p className="text-sm bg-muted/30 rounded-lg p-3">{pr.comments}</p>
            </div>
          )}

          {/* Admin section */}
          {isAdmin && pr.status !== "Draft" && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold">Admin Review</h3>
              <div className="space-y-1.5">
                <Label className="text-xs">Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add review notes..."
                  rows={2}
                  className="text-sm"
                />
              </div>
              {nextStatus && (
                <Button onClick={advanceStatus} disabled={advancing} className="gap-1">
                  {advancing && <Loader2 className="h-4 w-4 animate-spin" />}
                  Advance to: {nextStatus}
                </Button>
              )}
            </div>
          )}

          {/* Status locked banner */}
          {!isEditable && !isAdmin && (
            <div className="bg-muted/50 border rounded-lg p-3 text-sm text-muted-foreground text-center">
              This PR is locked and under review. Contact admin for changes.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
