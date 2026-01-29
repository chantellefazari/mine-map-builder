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
import { CatalogueItem, componentTypes, priorityTags, PriorityTag } from "@/hooks/useSupplierCatalogue";
import { Supplier } from "@/hooks/useSuppliers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCatalogueItemDialogProps {
  suppliers: Supplier[];
  onAddItem: (item: Omit<CatalogueItem, "id" | "createdAt" | "updatedAt">) => Promise<boolean>;
}

export const AddCatalogueItemDialog = ({ suppliers, onAddItem }: AddCatalogueItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    supplierName: "",
    oemBrand: "",
    componentType: "",
    componentDescription: "",
    oemPartNumber: "",
    alternatePartNumbers: "",
    notes: "",
    priorityTag: "Medium" as PriorityTag,
  });

  const handleSupplierChange = (supplierId: string) => {
    if (supplierId === "manual") {
      setFormData({ ...formData, supplierId: "", supplierName: "" });
    } else {
      const supplier = suppliers.find((s) => s.id === supplierId);
      setFormData({
        ...formData,
        supplierId: supplierId,
        supplierName: supplier?.name || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: Omit<CatalogueItem, "id" | "createdAt" | "updatedAt"> = {
      supplierId: formData.supplierId || null,
      supplierName: formData.supplierName,
      oemBrand: formData.oemBrand,
      componentType: formData.componentType,
      componentDescription: formData.componentDescription,
      oemPartNumber: formData.oemPartNumber,
      alternatePartNumbers: formData.alternatePartNumbers,
      notes: formData.notes,
      priorityTag: formData.priorityTag,
    };

    const success = await onAddItem(newItem);
    if (success) {
      setOpen(false);
      setFormData({
        supplierId: "",
        supplierName: "",
        oemBrand: "",
        componentType: "",
        componentDescription: "",
        oemPartNumber: "",
        alternatePartNumbers: "",
        notes: "",
        priorityTag: "Medium",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Catalogue Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Catalogue Item</DialogTitle>
          <DialogDescription>
            Add a new part or component to the supplier catalogue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier (from register)</Label>
            <Select value={formData.supplierId || "manual"} onValueChange={handleSupplierChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier or enter manually" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Enter manually</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(!formData.supplierId || formData.supplierId === "") && (
            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name (manual)</Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                placeholder="e.g. ABC Motors"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oemBrand">OEM / Brand</Label>
              <Input
                id="oemBrand"
                value={formData.oemBrand}
                onChange={(e) => setFormData({ ...formData, oemBrand: e.target.value })}
                placeholder="e.g. SEW, WEG, SKF"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="componentType">Component Type *</Label>
              <Select 
                value={formData.componentType} 
                onValueChange={(value) => setFormData({ ...formData, componentType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {componentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="componentDescription">Component Description *</Label>
            <Input
              id="componentDescription"
              value={formData.componentDescription}
              onChange={(e) => setFormData({ ...formData, componentDescription: e.target.value })}
              placeholder="e.g. 7.5kW 4-Pole Foot Mount Motor"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oemPartNumber">OEM Part Number</Label>
              <Input
                id="oemPartNumber"
                value={formData.oemPartNumber}
                onChange={(e) => setFormData({ ...formData, oemPartNumber: e.target.value })}
                placeholder="e.g. W22-132S-4P"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priorityTag">Priority Tag</Label>
              <Select 
                value={formData.priorityTag} 
                onValueChange={(value) => setFormData({ ...formData, priorityTag: value as PriorityTag })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePartNumbers">Alternate / Equivalent Part Numbers</Label>
            <Input
              id="alternatePartNumbers"
              value={formData.alternatePartNumbers}
              onChange={(e) => setFormData({ ...formData, alternatePartNumbers: e.target.value })}
              placeholder="e.g. MTR-750-4P, 132S-7.5kW"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (lead time, substitutions, known issues)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. 6-8 week lead time from Perth. Can substitute with Siemens equivalent."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
