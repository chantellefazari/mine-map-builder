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
import { Supplier, SupplierType, supplierTypes, supplyCategories } from "./supplierData";

interface AddSupplierDialogProps {
  onAddSupplier: (supplier: Omit<Supplier, "id">) => void;
}

export const AddSupplierDialog = ({ onAddSupplier }: AddSupplierDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: "",
    supplierType: "" as SupplierType | "",
    whatTheySupply: "",
    primaryContactName: "",
    phoneNumber: "",
    email: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierName || !formData.supplierType) return;

    onAddSupplier({
      supplierName: formData.supplierName,
      supplierType: formData.supplierType as SupplierType,
      whatTheySupply: formData.whatTheySupply,
      primaryContactName: formData.primaryContactName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      notes: formData.notes,
    });

    setFormData({
      supplierName: "",
      supplierType: "",
      whatTheySupply: "",
      primaryContactName: "",
      phoneNumber: "",
      email: "",
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Add a supplier to the register. This is a single source of truth for supplier information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierName" className="text-right">
                Supplier Name *
              </Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                className="col-span-3"
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierType" className="text-right">
                Supplier Type *
              </Label>
              <Select
                value={formData.supplierType}
                onValueChange={(value) => setFormData({ ...formData, supplierType: value as SupplierType })}
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
              <Label htmlFor="whatTheySupply" className="text-right">
                What They Supply
              </Label>
              <Input
                id="whatTheySupply"
                value={formData.whatTheySupply}
                onChange={(e) => setFormData({ ...formData, whatTheySupply: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Motors, Gearboxes, Electrical"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="primaryContactName" className="text-right">
                Primary Contact
              </Label>
              <Input
                id="primaryContactName"
                value={formData.primaryContactName}
                onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                className="col-span-3"
                placeholder="Contact name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="col-span-3"
                placeholder="+61 XXX XXX XXX"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email Address
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
            <Button type="submit" disabled={!formData.supplierName || !formData.supplierType}>
              Add Supplier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
