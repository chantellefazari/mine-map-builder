import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { VENDOR_FORM_OPTIONS, VendorVisitInsert } from "@/hooks/useVendorVisits";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (visit: VendorVisitInsert) => void;
}

const INITIAL: VendorVisitInsert = {
  vendor_name: "",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  visit_date: "",
  visit_end_date: null,
  purpose: "",
  forms_required: [],
  notes: "",
  status: "Scheduled",
};

export function AddVendorVisitDialog({ open, onOpenChange, onSubmit }: Props) {
  const [form, setForm] = useState<VendorVisitInsert>({ ...INITIAL });

  const toggleForm = (f: string) => {
    setForm((prev) => ({
      ...prev,
      forms_required: prev.forms_required.includes(f)
        ? prev.forms_required.filter((x) => x !== f)
        : [...prev.forms_required, f],
    }));
  };

  const handleSubmit = () => {
    if (!form.vendor_name.trim() || !form.visit_date) return;
    onSubmit(form);
    setForm({ ...INITIAL });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Schedule Vendor Visit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Vendor / Company Name *</Label>
              <Input value={form.vendor_name} onChange={(e) => setForm({ ...form, vendor_name: e.target.value })} placeholder="e.g. Wilson Diesel" className="h-8 text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs">Contact Name</Label>
              <Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className="h-8 text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs">Contact Phone</Label>
              <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="h-8 text-sm mt-1" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Contact Email</Label>
              <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="h-8 text-sm mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Visit Date *</Label>
              <Input type="date" value={form.visit_date} onChange={(e) => setForm({ ...form, visit_date: e.target.value })} className="h-8 text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs">End Date (if multi-day)</Label>
              <Input type="date" value={form.visit_end_date || ""} onChange={(e) => setForm({ ...form, visit_end_date: e.target.value || null })} className="h-8 text-sm mt-1" />
            </div>
          </div>

          <div>
            <Label className="text-xs">Purpose / Scope of Visit *</Label>
            <Textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. 500hr service on CAT 740 haul truck" className="text-sm mt-1 min-h-[60px]" />
          </div>

          <div>
            <Label className="text-xs mb-2 block">Forms Required</Label>
            <div className="grid grid-cols-2 gap-2">
              {VENDOR_FORM_OPTIONS.map((f) => (
                <label key={f} className="flex items-center gap-2 text-xs cursor-pointer">
                  <Checkbox checked={form.forms_required.includes(f)} onCheckedChange={() => toggleForm(f)} />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="text-sm mt-1 min-h-[40px]" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} disabled={!form.vendor_name.trim() || !form.visit_date}>Schedule Visit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
