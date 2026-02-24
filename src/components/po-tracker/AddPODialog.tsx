import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Search, Loader2, LinkIcon } from "lucide-react";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { useSuppliers } from "@/hooks/useSuppliers";
import { usePurchaseRequests } from "@/hooks/usePurchaseRequests";
import { useAuth } from "@/context/AuthContext";
import { SparePartLookupDialog } from "./SparePartLookupDialog";
import type { POTrackerItem, POLineItem } from "@/hooks/usePOTracker";

interface AddPODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (header: any, lines: POLineItem[]) => void;
  editItem?: POTrackerItem | null;
  defaultWorkOrderId?: string;
}

const PO_STATUSES = ["Draft", "Issued", "In Transit", "Received Partial", "Received Complete", "Cancelled"];

const emptyLine = (): POLineItem => ({
  part_description: "",
  part_number: "",
  quantity_ordered: 0,
  unit_price: 0,
  received_qty: 0,
  notes: "",
});

export const AddPODialog = ({ open, onOpenChange, onSave, editItem, defaultWorkOrderId }: AddPODialogProps) => {
  const { workOrders } = useWorkOrders();
  const { suppliers } = useSuppliers();
  const { listQuery: prListQuery } = usePurchaseRequests();
  const { user } = useAuth();
  const [lookupLineIdx, setLookupLineIdx] = useState<number | null>(null);
  const [prSearch, setPrSearch] = useState("");

  const approvedPRs = (prListQuery.data ?? []).filter(
    (pr) => pr.status === "Approved" || pr.status === "PO Raised"
  );

  const filteredPRs = prSearch
    ? approvedPRs.filter(
        (pr) =>
          pr.pr_number.toLowerCase().includes(prSearch.toLowerCase()) ||
          (pr.request_title || "").toLowerCase().includes(prSearch.toLowerCase()) ||
          pr.supplier_name.toLowerCase().includes(prSearch.toLowerCase())
      )
    : approvedPRs;

  const freightOptions = (suppliers ?? [])
    .map((s) => s.preferredFreightCompany)
    .filter((v, i, arr): v is string => !!v && arr.indexOf(v) === i);

  const [form, setForm] = useState({
    work_order_id: defaultWorkOrderId ?? "",
    pr_id: "",
    supplier: "",
    description: "",
    freight_company: "",
    freight_company_hidden: false,
    freight_tracking_number: "",
    order_date: "",
    eta: "",
    status: "Draft",
    confirmed_on_site: false,
    date_received: "",
    received_by: "",
    comments: "",
    total_value: 0,
  });

  const [lines, setLines] = useState<POLineItem[]>([emptyLine()]);

  useEffect(() => {
    if (editItem) {
      setForm({
        work_order_id: editItem.work_order_id ?? "",
        pr_id: editItem.pr_id ?? "",
        supplier: editItem.supplier,
        description: editItem.description ?? "",
        freight_company: editItem.freight_company ?? "",
        freight_company_hidden: !editItem.freight_required,
        freight_tracking_number: editItem.freight_tracking_number ?? "",
        order_date: editItem.order_date ?? "",
        eta: editItem.eta ?? "",
        status: editItem.status,
        confirmed_on_site: editItem.confirmed_on_site,
        date_received: editItem.date_received ?? "",
        received_by: editItem.received_by ?? "",
        comments: editItem.comments,
        total_value: editItem.total_value ?? 0,
      });
      setLines(editItem.lines && editItem.lines.length > 0 ? editItem.lines : [emptyLine()]);
    } else {
      setForm({
        work_order_id: defaultWorkOrderId ?? "",
        pr_id: "",
        supplier: "",
        description: "",
        freight_company: "",
        freight_company_hidden: false,
        freight_tracking_number: "",
        order_date: "",
        eta: "",
        status: "Draft",
        confirmed_on_site: false,
        date_received: "",
        received_by: "",
        comments: "",
        total_value: 0,
      });
      setLines([emptyLine()]);
    }
  }, [editItem, open, defaultWorkOrderId]);

  const handlePRLink = (prId: string) => {
    if (prId === "__none__") {
      setForm((f) => ({ ...f, pr_id: "" }));
      return;
    }
    const pr = approvedPRs.find((p) => p.id === prId);
    if (!pr) return;
    setForm((f) => ({
      ...f,
      pr_id: prId,
      supplier: pr.supplier_name || f.supplier,
      description: pr.description_scope || pr.request_title || f.description,
      work_order_id: pr.work_order_id || f.work_order_id,
      total_value: pr.approval_amount || f.total_value,
      freight_company_hidden: pr.supplier_organises_freight,
      freight_company: pr.supplier_organises_freight ? "" : (pr.freight_company || f.freight_company),
    }));
  };

  const updateLine = (idx: number, field: keyof POLineItem, value: any) => {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };

  const computedTotal = lines.reduce((s, l) => s + l.quantity_ordered * l.unit_price, 0);

  const handleSubmit = () => {
    const validLines = lines.filter((l) => l.part_description.trim() || l.part_number.trim());
    const finalTotal = form.total_value || computedTotal;
    onSave(
      {
        ...(editItem ? { id: editItem.id } : {}),
        work_order_id: form.work_order_id || null,
        pr_id: form.pr_id || null,
        supplier: form.supplier,
        description: form.description,
        freight_company: form.freight_company,
        freight_tracking_number: form.freight_tracking_number,
        freight_required: !form.freight_company_hidden,
        order_date: form.order_date || null,
        eta: form.eta || null,
        status: form.status,
        confirmed_on_site: form.confirmed_on_site,
        date_received: form.date_received || null,
        received_by: form.received_by,
        created_by: editItem ? undefined : user?.email ?? "",
        last_updated_by: user?.email ?? "",
        comments: form.comments,
        total_value: finalTotal,
      },
      validLines
    );
    onOpenChange(false);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? `Edit ${editItem.po_number}` : "Create Purchase Order"}</DialogTitle>
        </DialogHeader>

        {/* PR Lookup */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs">
            <LinkIcon className="h-3.5 w-3.5" /> Linked Purchase Request
          </Label>
          <Select value={form.pr_id || "__none__"} onValueChange={handlePRLink}>
            <SelectTrigger><SelectValue placeholder="Search and link a PR…" /></SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Search PR#, title, supplier…"
                  value={prSearch}
                  onChange={(e) => setPrSearch(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <SelectItem value="__none__">None — Standalone PO</SelectItem>
              {filteredPRs.map((pr) => (
                <SelectItem key={pr.id} value={pr.id}>
                  {pr.pr_number} — {pr.request_title || pr.supplier_name} (${pr.approval_amount?.toFixed(2) ?? "0.00"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Header fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Linked Work Order</Label>
            <Select value={form.work_order_id || "__none__"} onValueChange={(v) => setForm({ ...form, work_order_id: v === "__none__" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="Select WO" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {workOrders.map((wo) => (
                  <SelectItem key={wo.id} value={wo.id}>{wo.wo_number}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Supplier</Label>
            <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          </div>
          <div className="space-y-2 col-span-2">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="text-sm" placeholder="PO description / scope..." />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Approval Amount / Total ($)</Label>
            <Input type="number" value={form.total_value || ""} onChange={(e) => setForm({ ...form, total_value: Number(e.target.value) })} placeholder={computedTotal.toFixed(2)} />
          </div>
          {!form.freight_company_hidden && (
            <div className="space-y-2">
              <Label className="text-xs">Freight / Transport Company</Label>
              <Select
                value={form.freight_company || "__manual__"}
                onValueChange={(v) => setForm({ ...form, freight_company: v === "__manual__" ? "" : v })}
              >
                <SelectTrigger><SelectValue placeholder="Select freight company" /></SelectTrigger>
                <SelectContent>
                  {freightOptions.map((fc) => (
                    <SelectItem key={fc} value={fc}>{fc}</SelectItem>
                  ))}
                  <SelectItem value="__manual__">Manual Entry</SelectItem>
                </SelectContent>
              </Select>
              {(!freightOptions.includes(form.freight_company) || !form.freight_company) && (
                <Input
                  value={form.freight_company}
                  onChange={(e) => setForm({ ...form, freight_company: e.target.value })}
                  placeholder="Enter freight company name"
                  className="mt-1 text-sm"
                />
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-xs">Freight Responsibility</Label>
            <div className="flex items-center gap-2 pt-1">
              <Switch checked={form.freight_company_hidden} onCheckedChange={(v) => { setForm({ ...form, freight_company_hidden: v }); if (v) setForm(f => ({ ...f, freight_company: "", freight_company_hidden: true })); }} />
              <span className="text-sm text-muted-foreground">{form.freight_company_hidden ? "Supplier Freight" : "Site Freight"}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PO_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Order Date</Label>
            <Input type="date" value={form.order_date} onChange={(e) => setForm({ ...form, order_date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">ETA</Label>
            <Input type="date" value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Actual Received Date</Label>
            <Input type="date" value={form.date_received} onChange={(e) => setForm({ ...form, date_received: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Received By</Label>
            <Input value={form.received_by} onChange={(e) => setForm({ ...form, received_by: e.target.value })} placeholder="Name of person receiving" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.confirmed_on_site} onCheckedChange={(v) => setForm({ ...form, confirmed_on_site: v })} />
            <Label className="text-xs">Confirmed On Site</Label>
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Line Items</Label>
            <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => setLines([...lines, emptyLine()])}>
              <Plus className="h-3 w-3" /> Add Line
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="p-2 font-medium">Part #</th>
                  <th className="p-2 font-medium">Description</th>
                  <th className="p-2 font-medium w-20">Qty</th>
                  <th className="p-2 font-medium w-24">Unit Price</th>
                  <th className="p-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-1">
                      <div className="flex gap-1">
                        <Input className="h-8 text-xs flex-1" value={line.part_number} onChange={(e) => updateLine(idx, "part_number", e.target.value)} placeholder="Type or search" />
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={() => setLookupLineIdx(idx)} title="Search Site Spares">
                          <Search className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-1"><Input className="h-8 text-xs" value={line.part_description} onChange={(e) => updateLine(idx, "part_description", e.target.value)} /></td>
                    <td className="p-1"><Input className="h-8 text-xs" type="number" value={line.quantity_ordered} onChange={(e) => updateLine(idx, "quantity_ordered", Number(e.target.value))} /></td>
                    <td className="p-1"><Input className="h-8 text-xs" type="number" value={line.unit_price} onChange={(e) => updateLine(idx, "unit_price", Number(e.target.value))} /></td>
                    <td className="p-1">
                      {lines.length > 1 && (
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setLines(lines.filter((_, i) => i !== idx))}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Freight Tracking Number */}
        {!form.freight_company_hidden && form.freight_company && (
          <div className="space-y-2 mt-2">
            <Label className="text-xs">Freight Tracking Number</Label>
            <Input
              value={form.freight_tracking_number}
              onChange={(e) => setForm({ ...form, freight_tracking_number: e.target.value })}
              placeholder="e.g. TOLL-12345678"
            />
          </div>
        )}

        {/* Comments / Notes */}
        <div className="space-y-2 mt-2">
          <Label className="text-xs">Notes</Label>
          <Textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} rows={2} className="text-sm" />
        </div>

        {/* Auto fields info */}
        <div className="text-xs text-muted-foreground mt-1">
          Last Updated By: <span className="font-medium">{user?.email ?? "—"}</span> (auto)
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {editItem ? "Update PO" : "Create PO"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <SparePartLookupDialog
      open={lookupLineIdx !== null}
      onOpenChange={(open) => { if (!open) setLookupLineIdx(null); }}
      onSelect={(spare) => {
        if (lookupLineIdx !== null) {
          setLines((prev) =>
            prev.map((l, i) =>
              i === lookupLineIdx
                ? {
                    ...l,
                    part_number: spare.part_number || "",
                    part_description: spare.description || "",
                    unit_price: spare.unit_cost ?? 0,
                  }
                : l
            )
          );
        }
      }}
    />
    </>
  );
};
