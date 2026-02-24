import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Supplier, SupplierType, supplierTypes } from "@/hooks/useSuppliers";

interface AddSupplierDialogProps {
  onAddSupplier: (supplier: Omit<Supplier, "id">) => void;
}

export const AddSupplierDialog = ({ onAddSupplier }: AddSupplierDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    contact: "",
    type: "" as SupplierType | "",
    workPhone: "",
    mobile: "",
    email: "",
    whatUsedFor: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type) return;

    onAddSupplier({
      code: formData.code,
      name: formData.name,
      contact: formData.contact,
      type: formData.type as SupplierType,
      workPhone: formData.workPhone,
      mobile: formData.mobile,
      email: formData.email,
      whatUsedFor: formData.whatUsedFor,
      notes: formData.notes,
      location: "",
      isPreferred: false,
      abn: "",
      paymentTerms: "",
      preferredFreightCompany: "",
      defaultDeliveryAddress: "",
      organisesFreight: false,
    });

    setFormData({
      code: "",
      name: "",
      contact: "",
      type: "",
      workPhone: "",
      mobile: "",
      email: "",
      whatUsedFor: "",
      notes: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Add a supplier to the register. This is a single source of truth for supplier information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="col-span-3"
                placeholder="Supplier code (e.g. SUP001)"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact
              </Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="col-span-3"
                placeholder="Primary contact name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as SupplierType })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select supplier type" />
                </SelectTrigger>
                <SelectContent>
                  {supplierTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workPhone" className="text-right">
                Work Phone
              </Label>
              <Input
                id="workPhone"
                value={formData.workPhone}
                onChange={(e) => setFormData({ ...formData, workPhone: e.target.value })}
                className="col-span-3"
                placeholder="+61 X XXXX XXXX"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">
                Mobile
              </Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="col-span-3"
                placeholder="+61 XXX XXX XXX"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                placeholder="email@supplier.com"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whatUsedFor" className="text-right">
                What Used For
              </Label>
              <Input
                id="whatUsedFor"
                value={formData.whatUsedFor}
                onChange={(e) => setFormData({ ...formData, whatUsedFor: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Motors, Gearboxes, Electrical"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="col-span-3"
                placeholder="Any additional notes or comments..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.type}>
              Add Supplier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
