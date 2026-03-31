import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SERVICE_FORM_OPTIONS, EquipmentServiceInsert } from "@/hooks/useEquipmentServices";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: EquipmentServiceInsert) => void;
}

const INITIAL: EquipmentServiceInsert = {
  equipment_name: "",
  asset_number: "",
  current_hours: 0,
  service_interval_hours: 500,
  last_service_hours: 0,
  last_service_date: null,
  next_service_due_hours: 500,
  service_vendor: "Wilson Diesel",
  forms_required: ["Service Report", "JSEA / SWMS", "Take 5"],
  notes: "",
  status: "OK",
};

export function AddEquipmentDialog({ open, onOpenChange, onSubmit }: Props) {
  const [form, setForm] = useState<EquipmentServiceInsert>({ ...INITIAL });

  const toggleForm = (f: string) => {
    setForm((prev) => ({
      ...prev,
      forms_required: prev.forms_required.includes(f)
        ? prev.forms_required.filter((x) => x !== f)
        : [...prev.forms_required, f],
    }));
  };

  const handleSubmit = () => {
    if (!form.equipment_name.trim()) return;
    const nextDue = form.last_service_hours + form.service_interval_hours;
    onSubmit({ ...form, next_service_due_hours: nextDue });
    setForm({ ...INITIAL });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Add Equipment for Service Tracking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Equipment Name *</Label>
              <Input value={form.equipment_name} onChange={(e) => setForm({ ...form, equipment_name: e.target.value })} placeholder="e.g. CAT 740 Haul Truck" className="h-8 text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs">Asset Number</Label>
              <Input value={form.asset_number} onChange={(e) => setForm({ ...form, asset_number: e.target.value })} placeholder="e.g. HT-001" className="h-8 text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs">Service Vendor</Label>
              <Input value={form.service_vendor} onChange={(e) => setForm({ ...form, service_vendor: e.target.value })} className="h-8 text-sm mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Current Hours</Label>
              <Input type="number" value={form.current_hours} onChange={(e) => setForm({ ...form, current_hours: Number(e.target.value) })} className="h-8 text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs">Service Interval (hrs)</Label>
              <Input type="number" value={form.service_interval_hours} onChange={(e) => setForm({ ...form, service_interval_hours: Number(e.target.value) })} className="h-8 text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs">Last Service Hours</Label>
              <Input type="number" value={form.last_service_hours} onChange={(e) => setForm({ ...form, last_service_hours: Number(e.target.value) })} className="h-8 text-sm mt-1" />
            </div>
          </div>

          <div>
            <Label className="text-xs mb-2 block">Forms Required for Wilson Diesel</Label>
            <div className="grid grid-cols-2 gap-2">
              {SERVICE_FORM_OPTIONS.map((f) => (
                <label key={f} className="flex items-center gap-2 text-xs cursor-pointer">
                  <Checkbox checked={form.forms_required.includes(f)} onCheckedChange={() => toggleForm(f)} />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. 500hr service — filters, oils, inspection" className="text-sm mt-1 min-h-[40px]" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} disabled={!form.equipment_name.trim()}>Add Equipment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
