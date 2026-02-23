import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import type { POTrackerItem } from "@/hooks/usePOTracker";

interface AddPODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Partial<POTrackerItem> & { po_number: string }) => void;
  editItem?: POTrackerItem | null;
  defaultWorkOrderId?: string;
}

const PO_STATUSES = ["Ordered", "In Transit", "On Site", "Partially Received", "Cancelled"];

export const AddPODialog = ({ open, onOpenChange, onSave, editItem, defaultWorkOrderId }: AddPODialogProps) => {
  const { workOrders } = useWorkOrders();

  const [form, setForm] = useState({
    po_number: "",
    work_order_id: defaultWorkOrderId ?? "",
    supplier: "",
    part_description: "",
    part_number: "",
    quantity_ordered: 0,
    order_date: "",
    eta: "",
    status: "Ordered",
    confirmed_on_site: false,
    date_received: "",
    comments: "",
  });

  useEffect(() => {
    if (editItem) {
      setForm({
        po_number: editItem.po_number,
        work_order_id: editItem.work_order_id ?? "",
        supplier: editItem.supplier,
        part_description: editItem.part_description,
        part_number: editItem.part_number,
        quantity_ordered: editItem.quantity_ordered,
        order_date: editItem.order_date ?? "",
        eta: editItem.eta ?? "",
        status: editItem.status,
        confirmed_on_site: editItem.confirmed_on_site,
        date_received: editItem.date_received ?? "",
        comments: editItem.comments,
      });
    } else {
      setForm({
        po_number: "",
        work_order_id: defaultWorkOrderId ?? "",
        supplier: "",
        part_description: "",
        part_number: "",
        quantity_ordered: 0,
        order_date: "",
        eta: "",
        status: "Ordered",
        confirmed_on_site: false,
        date_received: "",
        comments: "",
      });
    }
  }, [editItem, open, defaultWorkOrderId]);

  const handleSubmit = () => {
    if (!form.po_number.trim()) return;
    onSave({
      ...(editItem ? { id: editItem.id } : {}),
      po_number: form.po_number,
      work_order_id: form.work_order_id || null,
      supplier: form.supplier,
      part_description: form.part_description,
      part_number: form.part_number,
      quantity_ordered: form.quantity_ordered,
      order_date: form.order_date || null,
      eta: form.eta || null,
      status: form.status,
      confirmed_on_site: form.confirmed_on_site,
      date_received: form.date_received || null,
      comments: form.comments,
    } as any);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit PO" : "Add Purchase Order"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>PO Number *</Label>
            <Input value={form.po_number} onChange={(e) => setForm({ ...form, po_number: e.target.value })} placeholder="PO-001" />
          </div>
          <div className="space-y-2">
            <Label>Linked Work Order</Label>
            <Select value={form.work_order_id} onValueChange={(v) => setForm({ ...form, work_order_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select WO" /></SelectTrigger>
              <SelectContent>
                {workOrders.map((wo) => (
                  <SelectItem key={wo.id} value={wo.id}>{wo.wo_number}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Part Number</Label>
            <Input value={form.part_number} onChange={(e) => setForm({ ...form, part_number: e.target.value })} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Part Description</Label>
            <Input value={form.part_description} onChange={(e) => setForm({ ...form, part_description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Quantity Ordered</Label>
            <Input type="number" value={form.quantity_ordered} onChange={(e) => setForm({ ...form, quantity_ordered: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PO_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Order Date</Label>
            <Input type="date" value={form.order_date} onChange={(e) => setForm({ ...form, order_date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>ETA</Label>
            <Input type="date" value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Date Received</Label>
            <Input type="date" value={form.date_received} onChange={(e) => setForm({ ...form, date_received: e.target.value })} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.confirmed_on_site} onCheckedChange={(v) => setForm({ ...form, confirmed_on_site: v })} />
            <Label>Confirmed On Site</Label>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Comments</Label>
            <Textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} rows={3} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.po_number.trim()}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
