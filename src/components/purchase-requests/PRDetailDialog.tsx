import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { usePurchaseRequests, PurchaseRequest, PRLineItem } from "@/hooks/usePurchaseRequests";
import { useNotifications } from "@/hooks/useNotifications";
import { PRStatusBadge } from "./PRStatusBadge";
import { PRLineItemsTable } from "./PRLineItemsTable";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prId: string;
}

const APPROVAL_TIERS = [
  { max: 5000, label: "Operations Manager", tier: "ops_manager" },
  { max: 20000, label: "Site Manager", tier: "site_manager" },
  { max: Infinity, label: "General Manager", tier: "gm" },
];

function getApprovalTier(total: number) {
  return APPROVAL_TIERS.find((t) => total < t.max) ?? APPROVAL_TIERS[2];
}

const STATUS_FLOW: Record<string, string> = {
  "Submitted to Admin": "Admin Review",
  "Admin Review": "Sent for Approval",
  Approved: "PO Generated",
};

export const PRDetailDialog: React.FC<Props> = ({ open, onOpenChange, prId }) => {
  const { isAdmin, user } = useAuth();
  const { getWithLines, updateStatus, updatePR } = usePurchaseRequests();
  const { createNotification } = useNotifications(user?.email ?? undefined);
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

  // Approval fields
  const [approverEmail, setApproverEmail] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  useEffect(() => {
    if (open && prId) {
      setLoading(true);
      setShowReject(false);
      setRejectionReason("");
      getWithLines(prId)
        .then((data) => {
          setPr(data);
          setAdminNotes(data.admin_notes);
          setFreightToggle(data.supplier_organises_freight);
          setFreightCompany(data.freight_company);
          setDeliveryAddress(data.delivery_address);
          setSupplierAbn(data.supplier_abn);
          setPaymentTerms(data.payment_terms);
          setApproverEmail(data.assigned_approver);
        })
        .finally(() => setLoading(false));
    }
  }, [open, prId]);

  const isAdminReview = pr?.status === "Admin Review" || pr?.status === "Submitted to Admin";
  const isSentForApproval = pr?.status === "Sent for Approval";

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

  const total = pr?.lines.reduce((s, l) => s + l.quantity * l.estimated_cost, 0) ?? 0;

  const sendForApproval = async () => {
    if (!pr || !approverEmail) {
      toast.error("Please enter the approver's email address");
      return;
    }
    setAdvancing(true);
    try {
      // Save admin fields first
      await updatePR.mutateAsync({
        id: pr.id,
        supplier_organises_freight: freightToggle,
        freight_company: freightCompany,
        delivery_address: deliveryAddress,
        supplier_abn: supplierAbn,
        payment_terms: paymentTerms,
        admin_notes: adminNotes,
      } as any);

      const tier = getApprovalTier(total);
      await updateStatus.mutateAsync({
        id: pr.id,
        status: "Sent for Approval",
        extra: {
          admin_notes: adminNotes,
          approval_tier: tier.tier,
          assigned_approver: approverEmail,
        },
      });

      // Create notification for approver
      await createNotification({
        user_email: approverEmail,
        title: `PR ${pr.pr_number} requires your approval`,
        message: `${pr.pr_number} — $${total.toFixed(2)} — ${tier.label} approval required. Supplier: ${pr.supplier_name || "N/A"}`,
        link: "/purchase-requests",
        pr_id: pr.id,
      });

      // Notify supervisor
      if (pr.supervisor_name) {
        await createNotification({
          user_email: pr.supervisor_name,
          title: `PR ${pr.pr_number} sent for approval`,
          message: `Your PR has been sent to ${tier.label} (${approverEmail}) for approval.`,
          link: "/purchase-requests",
          pr_id: pr.id,
        });
      }

      toast.success(`PR sent to ${tier.label} for approval`);
      const updated = await getWithLines(prId);
      setPr(updated);
      setAdminNotes(updated.admin_notes);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAdvancing(false);
    }
  };

  const handleApprove = async () => {
    if (!pr) return;
    setAdvancing(true);
    try {
      // Generate PO number (TCMG-YYYY-XXXX format)
      const { data: poNumber, error: poErr } = await supabase.rpc("next_po_number");
      if (poErr) throw poErr;

      // Create PO in po_tracker with full PR data
      const freightNeeded = !pr.supplier_organises_freight;
      const { data: createdPO, error: poInsertErr } = await (supabase as any)
        .from("po_tracker")
        .insert({
          po_number: poNumber,
          pr_id: pr.id,
          supplier: pr.supplier_name,
          supervisor: pr.supervisor_name || "",
          work_order_id: pr.work_order_id || null,
          total_value: total,
          freight_required: freightNeeded,
          freight_company: freightNeeded ? (pr.freight_company || "") : "",
          status: "Ordered",
          comments: `Auto-generated from ${pr.pr_number}`,
        })
        .select()
        .single();
      if (poInsertErr) throw poInsertErr;

      // Copy PR line items to PO line items
      if (pr.lines.length > 0) {
        const poLines = pr.lines.map((l) => ({
          po_tracker_id: createdPO.id,
          part_description: l.part_description,
          part_number: "",
          quantity_ordered: l.quantity,
          unit_price: l.estimated_cost,
          received_qty: 0,
          notes: l.gl_code ? `GL: ${l.gl_code}` : "",
        }));
        const { error: lineErr } = await (supabase as any)
          .from("po_tracker_lines")
          .insert(poLines);
        if (lineErr) throw lineErr;
      }

      // Update PR status
      await updateStatus.mutateAsync({
        id: pr.id,
        status: "Approved",
        extra: {
          approved_by: user?.email ?? "",
          approved_at: new Date().toISOString(),
        },
      });

      // Notify supervisor
      const notifyEmails = [pr.supervisor_name];
      for (const email of notifyEmails.filter(Boolean)) {
        await createNotification({
          user_email: email,
          title: `PR ${pr.pr_number} Approved`,
          message: `Approved by ${user?.email}. PO ${poNumber} has been generated automatically.`,
          link: "/po-tracker",
          pr_id: pr.id,
        });
      }

      toast.success(`PR approved — PO ${poNumber} generated`);
      const updated = await getWithLines(prId);
      setPr(updated);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAdvancing(false);
    }
  };

  const handleReject = async () => {
    if (!pr || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setAdvancing(true);
    try {
      await updateStatus.mutateAsync({
        id: pr.id,
        status: "Rejected",
        extra: { rejection_reason: rejectionReason },
      });

      // Notify supervisor and admin
      const notifyEmails = [pr.supervisor_name];
      for (const email of notifyEmails.filter(Boolean)) {
        await createNotification({
          user_email: email,
          title: `PR ${pr.pr_number} Rejected`,
          message: `Rejected by ${user?.email}. Reason: ${rejectionReason}`,
          link: "/purchase-requests",
          pr_id: pr.id,
        });
      }

      toast.success("PR rejected");
      const updated = await getWithLines(prId);
      setPr(updated);
      setShowReject(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAdvancing(false);
    }
  };

  const advanceStatus = async () => {
    if (!pr) return;
    const nextStatus = STATUS_FLOW[pr.status];
    if (!nextStatus) return;

    // For "Admin Review" → use sendForApproval instead
    if (pr.status === "Admin Review") {
      await sendForApproval();
      return;
    }

    setAdvancing(true);
    try {
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
  const tier = getApprovalTier(total);

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

          {/* Approval Tier Badge */}
          {total > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">Approval tier:</span>
              <Badge variant="outline" className="font-medium">
                {tier.label} (${tier.max === Infinity ? "20,000+" : `< $${tier.max.toLocaleString()}`})
              </Badge>
            </div>
          )}

          {/* Rejection reason banner */}
          {pr.status === "Rejected" && pr.rejection_reason && (
            <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                <XCircle className="h-4 w-4" /> Rejected
              </div>
              <p className="text-sm text-muted-foreground">{pr.rejection_reason}</p>
            </div>
          )}

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
                    <Select value={freightCompany} onValueChange={(v) => setFreightCompany(v === "__manual__" ? "" : v)}>
                      <SelectTrigger className="text-sm"><SelectValue placeholder="Select freight company" /></SelectTrigger>
                      <SelectContent>
                        {/* Will be populated dynamically - for now allow manual */}
                        <SelectItem value="__manual__">Manual Entry</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input value={freightCompany} onChange={(e) => setFreightCompany(e.target.value)} placeholder="Enter freight company name" className="text-sm mt-1" />
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

          {/* Admin section — Send for Approval */}
          {isAdmin && isAdminReview && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold">Send for Approval</h3>
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
              <div className="space-y-1.5">
                <Label className="text-xs">Approver Email ({tier.label})</Label>
                <Input
                  value={approverEmail}
                  onChange={(e) => setApproverEmail(e.target.value)}
                  placeholder={`Enter ${tier.label}'s email`}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2">
                {pr.status === "Submitted to Admin" && (
                  <Button variant="secondary" onClick={advanceStatus} disabled={advancing} className="gap-1">
                    {advancing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Advance to Admin Review
                  </Button>
                )}
                {pr.status === "Admin Review" && (
                  <Button onClick={sendForApproval} disabled={advancing || !approverEmail} className="gap-1">
                    {advancing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Send for Approval
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Approver section — Approve / Reject */}
          {isSentForApproval && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold">Approval Decision</h3>
              {pr.assigned_approver && (
                <p className="text-xs text-muted-foreground">
                  Assigned to: <span className="font-medium text-foreground">{pr.assigned_approver}</span>
                  {pr.approval_tier && <> • Tier: {APPROVAL_TIERS.find(t => t.tier === pr.approval_tier)?.label ?? pr.approval_tier}</>}
                </p>
              )}

              {!showReject ? (
                <div className="flex gap-2">
                  <Button onClick={handleApprove} disabled={advancing} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                    {advancing && <Loader2 className="h-4 w-4 animate-spin" />}
                    <CheckCircle2 className="h-4 w-4" /> Approve & Generate PO
                  </Button>
                  <Button variant="destructive" onClick={() => setShowReject(true)} disabled={advancing} className="gap-1">
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-xs">Rejection Reason (required)</Label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this PR is being rejected..."
                    rows={3}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleReject} disabled={advancing || !rejectionReason.trim()} className="gap-1">
                      {advancing && <Loader2 className="h-4 w-4 animate-spin" />}
                      Confirm Rejection
                    </Button>
                    <Button variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Approved banner */}
          {pr.status === "Approved" && (
            <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Approved
              </div>
              {pr.approved_by && <p className="text-xs text-muted-foreground">By: {pr.approved_by}</p>}
              {pr.approved_at && <p className="text-xs text-muted-foreground">At: {format(new Date(pr.approved_at), "dd MMM yyyy HH:mm")}</p>}
            </div>
          )}

          {/* Status locked banner */}
          {!isEditable && !isAdmin && !isSentForApproval && pr.status !== "Approved" && pr.status !== "Rejected" && (
            <div className="bg-muted/50 border rounded-lg p-3 text-sm text-muted-foreground text-center">
              This PR is locked and under review. Contact admin for changes.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
