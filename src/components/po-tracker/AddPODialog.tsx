import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import type { POTrackerItem, POLineItem } from "@/hooks/usePOTracker";

interface AddPODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (header: any, lines: POLineItem[]) => void;
  editItem?: POTrackerItem | null;
  defaultWorkOrderId?: string;
}

const PO_STATUSES = ["Ordered", "In Transit", "On Site", "Partially Received", "Cancelled"];

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

  const [form, setForm] = useState({
    work_order_id: defaultWorkOrderId ?? "",
    supplier: "",
    freight_company: "",
    order_date: "",
    eta: "",
    status: "Ordered",
    confirmed_on_site: false,
    date_received: "",
    comments: "",
  });

  const [lines, setLines] = useState<POLineItem[]>([emptyLine()]);

  useEffect(() => {
    if (editItem) {
      setForm({
        work_order_id: editItem.work_order_id ?? "",
        supplier: editItem.supplier,
        freight_company: editItem.freight_company ?? "",
        order_date: editItem.order_date ?? "",
        eta: editItem.eta ?? "",
        status: editItem.status,
        confirmed_on_site: editItem.confirmed_on_site,
        date_received: editItem.date_received ?? "",
        comments: editItem.comments,
      });
      setLines(editItem.lines && editItem.lines.length > 0 ? editItem.lines : [emptyLine()]);
    } else {
      setForm({
        work_order_id: defaultWorkOrderId ?? "",
        supplier: "",
        freight_company: "",
        order_date: "",
        eta: "",
        status: "Ordered",
        confirmed_on_site: false,
        date_received: "",
        comments: "",
      });
      setLines([emptyLine()]);
    }
  }, [editItem, open, defaultWorkOrderId]);

  const updateLine = (idx: number, field: keyof POLineItem, value: any) => {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };

  const handleSubmit = () => {
    const validLines = lines.filter((l) => l.part_description.trim() || l.part_number.trim());
    onSave(
      {
        ...(editItem ? { id: editItem.id } : {}),
        work_order_id: form.work_order_id || null,
        supplier: form.supplier,
        freight_company: form.freight_company,
        order_date: form.order_date || null,
        eta: form.eta || null,
        status: form.status,
        confirmed_on_site: form.confirmed_on_site,
        date_received: form.date_received || null,
        comments: form.comments,
      },
      validLines
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? `Edit ${editItem.po_number}` : "Create Purchase Order"}</DialogTitle>
        </DialogHeader>

        {/* Header fields */}
        <div className="grid grid-cols-2 gap-4">
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
            <Label>Freight Company</Label>
            <Input value={form.freight_company} onChange={(e) => setForm({ ...form, freight_company: e.target.value })} placeholder="e.g. TNT, Toll, StarTrack" />
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
                    <td className="p-1"><Input className="h-8 text-xs" value={line.part_number} onChange={(e) => updateLine(idx, "part_number", e.target.value)} /></td>
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

        {/* Comments */}
        <div className="space-y-2 mt-2">
          <Label>Comments</Label>
          <Textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} rows={2} />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {editItem ? "Update PO" : "Create PO"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
