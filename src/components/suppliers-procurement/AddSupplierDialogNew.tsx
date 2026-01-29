import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Supplier } from "@/hooks/useSuppliers";
import { Checkbox } from "@/components/ui/checkbox";

interface AddSupplierDialogProps {
  onAddSupplier: (supplier: Omit<Supplier, "id">) => Promise<boolean>;
}

export const AddSupplierDialog = ({ onAddSupplier }: AddSupplierDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    workPhone: "",
    email: "",
    location: "",
    whatUsedFor: "",
    isPreferred: false,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSupplier: Omit<Supplier, "id"> = {
      code: "", // Auto-generated or left empty
      name: formData.name,
      contact: formData.contact,
      type: "Trade / General Supplier", // Default type
      workPhone: formData.workPhone,
      mobile: "",
      email: formData.email,
      whatUsedFor: formData.whatUsedFor,
      notes: formData.notes,
      location: formData.location,
      isPreferred: formData.isPreferred,
    };

    const success = await onAddSupplier(newSupplier);
    if (success) {
      setOpen(false);
      setFormData({
        name: "",
        contact: "",
        workPhone: "",
        email: "",
        location: "",
        whatUsedFor: "",
        isPreferred: false,
        notes: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Add a new supplier to the register. All fields are optional except name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Supplier Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. ABC Motors Pty Ltd"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact">Primary Contact Name</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="e.g. John Smith"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.workPhone}
                onChange={(e) => setFormData({ ...formData, workPhone: e.target.value })}
                placeholder="e.g. 08 1234 5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. sales@abc.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Perth, WA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatUsedFor">What They Supply (high-level)</Label>
            <Input
              id="whatUsedFor"
              value={formData.whatUsedFor}
              onChange={(e) => setFormData({ ...formData, whatUsedFor: e.target.value })}
              placeholder="e.g. motors, gearboxes, bearings"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPreferred"
              checked={formData.isPreferred}
              onCheckedChange={(checked) => setFormData({ ...formData, isPreferred: checked as boolean })}
            />
            <Label htmlFor="isPreferred" className="text-sm font-normal">
              Preferred / Approved Supplier
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Supplier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
