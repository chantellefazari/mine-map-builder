import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Loader2, CheckCircle2, XCircle, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { usePurchaseRequests, PurchaseRequest, PRLineItem } from "@/hooks/usePurchaseRequests";
import { useNotifications } from "@/hooks/useNotifications";
import { useSuppliers } from "@/hooks/useSuppliers";
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

export const PRDetailDialog: React.FC<Props> = ({ open, onOpenChange, prId }) => {
  const { isAdmin, user } = useAuth();
  const { getWithLines, updateStatus, updatePR, getLinkedPOs } = usePurchaseRequests();
  const { createNotification } = useNotifications(user?.email ?? undefined);
  const { suppliers } = useSuppliers();
  const [pr, setPr] = useState<(PurchaseRequest & { lines: PRLineItem[] }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [linkedPOs, setLinkedPOs] = useState<any[]>([]);

  // Admin fields (Section B)
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [freightToggle, setFreightToggle] = useState(false);
  const [freightCompany, setFreightCompany] = useState("");
  const [estimatedFreightCost, setEstimatedFreightCost] = useState(0);
  const [approvalAmount, setApprovalAmount] = useState(0);
  const [supplierAbn, setSupplierAbn] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [savingFields, setSavingFields] = useState(false);

  // Approval fields (Section C)
  const [approverEmail, setApproverEmail] = useState("");
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  useEffect(() => {
    if (open && prId) {
      setLoading(true);
      setShowReject(false);
      setRejectionReason("");
      setApprovalComment("");
      Promise.all([
        getWithLines(prId),
        getLinkedPOs(prId),
      ]).then(([data, pos]) => {
        setPr(data);
        setLinkedPOs(pos);
        setAdminNotes(data.admin_notes);
        setFreightToggle(data.supplier_organises_freight);
        setFreightCompany(data.freight_company);
        setDeliveryAddress(data.delivery_address);
        setSupplierAbn(data.supplier_abn);
        setPaymentTerms(data.payment_terms);
        setApproverEmail(data.assigned_approver);
        setEstimatedFreightCost(data.estimated_freight_cost ?? 0);
        setApprovalAmount(data.approval_amount ?? 0);
      }).finally(() => setLoading(false));
    }
  }, [open, prId]);

  const isAdminReview = pr?.status === "Admin Review" || pr?.status === "Submitted to Admin";
  const isPendingApproval = pr?.status === "Pending Approval";
  const total = pr?.lines.reduce((s, l) => s + l.quantity * l.estimated_cost, 0) ?? 0;
  const tier = getApprovalTier(approvalAmount || total);

  const preferredFreightOptions = suppliers
    ?.map((s) => s.preferredFreightCompany)
    .filter((v, i, arr) => v && arr.indexOf(v) === i) ?? [];

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
        estimated_freight_cost: estimatedFreightCost,
        approval_amount: approvalAmount,
        admin_reviewed_by: user?.email ?? "",
        admin_reviewed_at: new Date().toISOString(),
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

  const advanceToAdminReview = async () => {
    if (!pr) return;
    setAdvancing(true);
    try {
      await updateStatus.mutateAsync({ id: pr.id, status: "Admin Review" });
      toast.success("PR advanced to Admin Review");
      const updated = await getWithLines(prId);
      setPr(updated);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAdvancing(false);
    }
  };

  const sendForApproval = async () => {
    if (!pr || !approverEmail) {
      toast.error("Please enter the approver's email address");
      return;
    }
    setAdvancing(true);
    try {
      await saveAdminFields();
      const finalTier = getApprovalTier(approvalAmount || total);
      await updateStatus.mutateAsync({
        id: pr.id,
        status: "Pending Approval",
        extra: {
          admin_notes: adminNotes,
          approval_tier: finalTier.tier,
          assigned_approver: approverEmail,
          admin_reviewed_by: user?.email ?? "",
          admin_reviewed_at: new Date().toISOString(),
        },
      });
      await createNotification({
        user_email: approverEmail,
        title: `PR ${pr.pr_number} requires your approval`,
        message: `${pr.pr_number} — $${(approvalAmount || total).toFixed(2)} — ${finalTier.label} approval required.`,
        link: "/purchase-requests",
        pr_id: pr.id,
      });
      if (pr.supervisor_name) {
        await createNotification({
          user_email: pr.supervisor_name,
          title: `PR ${pr.pr_number} sent for approval`,
          message: `Your PR has been sent to ${finalTier.label} (${approverEmail}) for approval.`,
          link: "/purchase-requests",
          pr_id: pr.id,
        });
      }
      toast.success(`PR sent to ${finalTier.label} for approval`);
      const updated = await getWithLines(prId);
      setPr(updated);
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
      const { data: poNumber, error: poErr } = await supabase.rpc("next_po_number");
      if (poErr) throw poErr;

      const freightNeeded = !pr.supplier_organises_freight;
      const { data: createdPO, error: poInsertErr } = await (supabase as any)
        .from("po_tracker")
        .insert({
          po_number: poNumber,
          pr_id: pr.id,
          supplier: pr.supplier_name,
          supervisor: pr.supervisor_name || "",
          work_order_id: pr.work_order_id || null,
          total_value: approvalAmount || total,
          freight_required: freightNeeded,
          freight_company: freightNeeded ? (pr.freight_company || "") : "",
          status: "Issued",
          description: pr.description_scope || pr.request_title || "",
          last_updated_by: user?.email ?? "",
          comments: `Auto-generated from ${pr.pr_number}`,
        })
        .select()
        .single();
      if (poInsertErr) throw poInsertErr;

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
        const { error: lineErr } = await (supabase as any).from("po_tracker_lines").insert(poLines);
        if (lineErr) throw lineErr;
      }

      await updateStatus.mutateAsync({
        id: pr.id,
        status: "PO Raised",
        extra: {
          approved_by: user?.email ?? "",
          approved_at: new Date().toISOString(),
          approval_comment: approvalComment,
        },
      });

      if (pr.supervisor_name) {
        await createNotification({
          user_email: pr.supervisor_name,
          title: `PR ${pr.pr_number} Approved`,
          message: `Approved by ${user?.email}. PO ${poNumber} generated.`,
          link: "/po-tracker",
          pr_id: pr.id,
        });
      }

      toast.success(`PR approved — PO ${poNumber} generated`);
      const [updated, pos] = await Promise.all([getWithLines(prId), getLinkedPOs(prId)]);
      setPr(updated);
      setLinkedPOs(pos);
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
        extra: {
          rejection_reason: rejectionReason,
          approval_comment: rejectionReason,
          approved_by: user?.email ?? "",
          approved_at: new Date().toISOString(),
        },
      });
      if (pr.supervisor_name) {
        await createNotification({
          user_email: pr.supervisor_name,
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
          {/* ===== SECTION A: Supervisor Inputs (read-only) ===== */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">A) Supervisor Request</h3>
            {pr.request_title && (
              <p className="font-semibold text-lg mb-2">{pr.request_title}</p>
            )}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Submitted By</span>
                <p className="font-medium">{pr.supervisor_name || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Priority</span>
                <Badge variant="outline" className="ml-1">{pr.priority || "Routine"}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Supplier</span>
                <p className="font-medium">{pr.supplier_name || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Linked WO</span>
                <p className="font-medium">{pr.work_order_id ? "Linked" : "Standalone"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Required-by Date</span>
                <p className="font-medium">{pr.required_date ? format(new Date(pr.required_date), "dd MMM yyyy") : "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Submitted Date</span>
                <p className="font-medium">{pr.submitted_at ? format(new Date(pr.submitted_at), "dd MMM yyyy HH:mm") : "—"}</p>
              </div>
            </div>
            {pr.description_scope && (
              <div className="mt-3">
                <span className="text-muted-foreground text-xs">Description / Scope</span>
                <p className="text-sm bg-muted/30 rounded-lg p-3 mt-1">{pr.description_scope}</p>
              </div>
            )}
            {pr.quote_url && (
              <a href={pr.quote_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline mt-2">
                <ExternalLink className="h-3.5 w-3.5" /> View Attached Quote
              </a>
            )}
          </div>

          {/* Line items */}
          <PRLineItemsTable lines={pr.lines} onChange={() => {}} readOnly />

          {pr.comments && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <p className="text-sm bg-muted/30 rounded-lg p-3">{pr.comments}</p>
            </div>
          )}

          {/* Approval Tier Badge */}
          {total > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">Est. Total: <span className="font-bold text-foreground">${total.toFixed(2)}</span></span>
              <Badge variant="outline" className="font-medium">
                {tier.label}
              </Badge>
            </div>
          )}

          <Separator />

          {/* ===== SECTION B: Admin Inputs ===== */}
          {isAdmin && isAdminReview ? (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">B) Admin Inputs</h3>

              <div className="space-y-1.5">
                <Label className="text-xs">Delivery Address / Instructions</Label>
                <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="text-sm" placeholder="TCMG – Tennant Creek Gold Mine, NT 0861" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Freight Responsibility</Label>
                  <div className="flex items-center gap-2 pt-1">
                    <Switch checked={freightToggle} onCheckedChange={(v) => { setFreightToggle(v); if (v) setFreightCompany(""); }} />
                    <span className="text-sm text-muted-foreground">{freightToggle ? "Supplier Freight" : "Site Freight"}</span>
                  </div>
                </div>
                {!freightToggle && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Preferred Carrier</Label>
                    <Select value={freightCompany || "__manual__"} onValueChange={(v) => setFreightCompany(v === "__manual__" ? "" : v)}>
                      <SelectTrigger className="text-sm"><SelectValue placeholder="Select carrier" /></SelectTrigger>
                      <SelectContent>
                        {preferredFreightOptions.map((fc) => (
                          <SelectItem key={fc} value={fc!}>{fc}</SelectItem>
                        ))}
                        <SelectItem value="__manual__">Manual Entry</SelectItem>
                      </SelectContent>
                    </Select>
                    {(!preferredFreightOptions.includes(freightCompany) || !freightCompany) && (
                      <Input value={freightCompany} onChange={(e) => setFreightCompany(e.target.value)} placeholder="Enter carrier name" className="text-sm mt-1" />
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Estimated Freight Cost ($)</Label>
                  <Input type="number" value={estimatedFreightCost || ""} onChange={(e) => setEstimatedFreightCost(Number(e.target.value))} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Approval Amount (Total $)</Label>
                  <Input type="number" value={approvalAmount || ""} onChange={(e) => setApprovalAmount(Number(e.target.value))} placeholder={total.toFixed(2)} className="text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Supplier ABN</Label>
                  <Input value={supplierAbn} onChange={(e) => setSupplierAbn(e.target.value)} placeholder="XX XXX XXX XXX" className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Terms / Account Notes</Label>
                  <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="e.g. Net 30, COD" className="text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Admin Notes</Label>
                <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add review notes..." rows={2} className="text-sm" />
              </div>

              <div className="text-xs text-muted-foreground">
                Admin Reviewed By: <span className="font-medium">{user?.email}</span> (auto)
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={saveAdminFields} disabled={savingFields}>
                  {savingFields && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  Save Changes
                </Button>
                {pr.status === "Submitted to Admin" && (
                  <Button size="sm" onClick={advanceToAdminReview} disabled={advancing}>
                    {advancing && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    Advance to Admin Review
                  </Button>
                )}
              </div>

              {/* Send for Approval */}
              {pr.status === "Admin Review" && (
                <div className="border-t pt-3 space-y-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Approver Email ({tier.label})</Label>
                    <Input value={approverEmail} onChange={(e) => setApproverEmail(e.target.value)} placeholder={`Enter ${tier.label}'s email`} className="text-sm" />
                  </div>
                  <Button onClick={sendForApproval} disabled={advancing || !approverEmail} className="gap-1">
                    {advancing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Send for Approval
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Read-only admin fields when not in editable admin state */
            (pr.admin_reviewed_by || pr.delivery_address || pr.freight_company) && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">B) Admin Inputs</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Delivery Address</span>
                    <p className="font-medium">{pr.delivery_address || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Freight</span>
                    <p className="font-medium">{pr.supplier_organises_freight ? "Supplier Freight" : `Site Freight — ${pr.freight_company || "N/A"}`}</p>
                  </div>
                  {pr.supplier_abn && (
                    <div>
                      <span className="text-muted-foreground text-xs">Supplier ABN</span>
                      <p className="font-medium">{pr.supplier_abn}</p>
                    </div>
                  )}
                  {pr.payment_terms && (
                    <div>
                      <span className="text-muted-foreground text-xs">Terms</span>
                      <p className="font-medium">{pr.payment_terms}</p>
                    </div>
                  )}
                  {(pr.admin_reviewed_by) && (
                    <div>
                      <span className="text-muted-foreground text-xs">Admin Reviewed By</span>
                      <p className="font-medium">{pr.admin_reviewed_by}</p>
                      {pr.admin_reviewed_at && <p className="text-xs text-muted-foreground">{format(new Date(pr.admin_reviewed_at), "dd MMM yyyy HH:mm")}</p>}
                    </div>
                  )}
                </div>
                {pr.admin_notes && (
                  <div className="mt-2">
                    <span className="text-muted-foreground text-xs">Admin Notes</span>
                    <p className="text-sm bg-muted/30 rounded-lg p-3 mt-1">{pr.admin_notes}</p>
                  </div>
                )}
              </div>
            )
          )}

          <Separator />

          {/* ===== SECTION C: Approval ===== */}
          {/* Rejection banner */}
          {pr.status === "Rejected" && (
            <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                <XCircle className="h-4 w-4" /> Rejected
              </div>
              {pr.approved_by && <p className="text-xs text-muted-foreground">By: {pr.approved_by}</p>}
              {pr.approved_at && <p className="text-xs text-muted-foreground">At: {format(new Date(pr.approved_at), "dd MMM yyyy HH:mm")}</p>}
              <p className="text-sm text-muted-foreground">{pr.rejection_reason || pr.approval_comment}</p>
            </div>
          )}

          {/* Pending Approval — Approve / Reject actions */}
          {isPendingApproval && (
            <div className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">C) Approval Decision</h3>
              {pr.assigned_approver && (
                <p className="text-xs text-muted-foreground">
                  Assigned to: <span className="font-medium text-foreground">{pr.assigned_approver}</span>
                  {pr.approval_tier && <> • Tier: {APPROVAL_TIERS.find(t => t.tier === pr.approval_tier)?.label ?? pr.approval_tier}</>}
                </p>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">Approval Comment</Label>
                <Textarea value={approvalComment} onChange={(e) => setApprovalComment(e.target.value)} placeholder="Optional comment..." rows={2} className="text-sm" />
              </div>
              {!showReject ? (
                <div className="flex gap-2">
                  <Button onClick={handleApprove} disabled={advancing} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                    {advancing && <Loader2 className="h-4 w-4 animate-spin" />}
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" onClick={() => setShowReject(true)} disabled={advancing} className="gap-1">
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-xs">Rejection Reason (required)</Label>
                  <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Explain why..." rows={3} className="text-sm" />
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

          {/* Approved / PO Raised banner */}
          {(pr.status === "Approved" || pr.status === "PO Raised") && (
            <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> {pr.status}
              </div>
              {pr.approved_by && <p className="text-xs text-muted-foreground">Approver: {pr.approved_by}</p>}
              {pr.approved_at && <p className="text-xs text-muted-foreground">Date: {format(new Date(pr.approved_at), "dd MMM yyyy HH:mm")}</p>}
              {pr.approval_comment && <p className="text-xs text-muted-foreground">Comment: {pr.approval_comment}</p>}
            </div>
          )}

          {/* ===== Generated POs ===== */}
          {linkedPOs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Generated POs</h3>
              <div className="space-y-1.5">
                {linkedPOs.map((po: any) => (
                  <div key={po.id} className="flex items-center gap-3 border rounded-lg px-3 py-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-mono font-medium">{po.po_number}</span>
                    <Badge variant="outline">{po.status}</Badge>
                    <span className="text-muted-foreground">${Number(po.total_value).toFixed(2)}</span>
                    <span className="text-muted-foreground text-xs ml-auto">{format(new Date(po.created_at), "dd MMM yyyy")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status locked banner */}
          {!isAdmin && !isPendingApproval && pr.status !== "Draft" && pr.status !== "Approved" && pr.status !== "Rejected" && pr.status !== "PO Raised" && pr.status !== "Closed" && (
            <div className="bg-muted/50 border rounded-lg p-3 text-sm text-muted-foreground text-center">
              This PR is locked and under review. Contact admin for changes.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
