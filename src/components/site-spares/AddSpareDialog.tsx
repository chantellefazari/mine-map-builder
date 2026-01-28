import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  type SiteSpareItem,
  categories,
  warehouseAreas,
  unitsOfMeasure,
} from "./siteSparesData";

interface AddSpareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSpare: (spare: SiteSpareItem) => void;
  existingCount: number;
}

const statuses: Array<SiteSpareItem["status"]> = ["Active", "Low Stock", "Out of Stock", "Pending Review", "Obsolete"];

export const AddSpareDialog = ({
  open,
  onOpenChange,
  onAddSpare,
  existingCount,
}: AddSpareDialogProps) => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    subcategory: "",
    manufacturer: "",
    oemPartNumber: "",
    alternatePartNumber: "",
    specifications: "",
    warehouseArea: "",
    aisle: "",
    rack: "",
    binLocation: "",
    qtyOnHand: 0,
    minQty: 0,
    maxQty: 0,
    reorderPoint: 0,
    uom: "EA",
    unitCost: 0,
    preferredSupplier: "",
    leadTimeDays: 0,
    status: "Active" as SiteSpareItem["status"],
    isCritical: false,
    notes: "",
  });

  const categoryList = Object.keys(categories).sort();
  const subcategoryList = formData.category ? categories[formData.category] || [] : [];

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: "", // Reset subcategory when category changes
    }));
  };

  // Part number will be assigned later - not auto-generated
  const generatePartNumber = (): string => {
    return "";  // Empty - numbering logic not yet defined
  };

  const generateBinLocation = (): string => {
    if (formData.warehouseArea && formData.aisle && formData.rack) {
      return `${formData.warehouseArea}-${formData.aisle}-${formData.rack}`;
    }
    return "";
  };

  const handleSubmit = () => {
    const newSpare: SiteSpareItem = {
      id: `STK-${String(existingCount + 1).padStart(4, "0")}`,
      partNumber: generatePartNumber(),
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      manufacturer: formData.manufacturer,
      oemPartNumber: formData.oemPartNumber,
      alternatePartNumber: formData.alternatePartNumber,
      specifications: formData.specifications,
      warehouseArea: formData.warehouseArea,
      aisle: formData.aisle,
      rack: formData.rack,
      binLocation: generateBinLocation() || formData.binLocation,
      qtyOnHand: formData.qtyOnHand,
      minQty: formData.minQty,
      maxQty: formData.maxQty,
      reorderPoint: formData.reorderPoint || formData.minQty,
      uom: formData.uom,
      unitCost: formData.unitCost,
      preferredSupplier: formData.preferredSupplier,
      leadTimeDays: formData.leadTimeDays,
      lastPurchaseDate: "",
      status: formData.status,
      isCritical: formData.isCritical,
      notes: formData.notes,
    };

    onAddSpare(newSpare);
    
    // Reset form
    setFormData({
      description: "",
      category: "",
      subcategory: "",
      manufacturer: "",
      oemPartNumber: "",
      alternatePartNumber: "",
      specifications: "",
      warehouseArea: "",
      aisle: "",
      rack: "",
      binLocation: "",
      qtyOnHand: 0,
      minQty: 0,
      maxQty: 0,
      reorderPoint: 0,
      uom: "EA",
      unitCost: 0,
      preferredSupplier: "",
      leadTimeDays: 0,
      status: "Active",
      isCritical: false,
      notes: "",
    });
    
    onOpenChange(false);
  };

  const isValid = formData.description && formData.category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new item to the stock catalogue. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g., Deep Groove Ball Bearing 6205 2RS"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select 
                value={formData.subcategory} 
                onValueChange={(v) => handleChange("subcategory", v)}
                disabled={!formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.category ? "Select subcategory" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  {subcategoryList.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Manufacturer & OEM Part Number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleChange("manufacturer", e.target.value)}
                placeholder="e.g., SKF, Siemens"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oemPartNumber">OEM Part Number</Label>
              <Input
                id="oemPartNumber"
                value={formData.oemPartNumber}
                onChange={(e) => handleChange("oemPartNumber", e.target.value)}
                placeholder="e.g., 6205-2RS1"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-2">
            <Label htmlFor="specifications">Specifications</Label>
            <Input
              id="specifications"
              value={formData.specifications}
              onChange={(e) => handleChange("specifications", e.target.value)}
              placeholder="e.g., 25x52x15mm, 1000kW, 316 SS"
            />
          </div>

          {/* Warehouse Location */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warehouseArea">Warehouse Area</Label>
              <Select value={formData.warehouseArea} onValueChange={(v) => handleChange("warehouseArea", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent>
                  {warehouseAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aisle">Aisle</Label>
              <Input
                id="aisle"
                value={formData.aisle}
                onChange={(e) => handleChange("aisle", e.target.value)}
                placeholder="01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rack">Rack/Shelf</Label>
              <Input
                id="rack"
                value={formData.rack}
                onChange={(e) => handleChange("rack", e.target.value)}
                placeholder="A1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="binLocation">Bin Location</Label>
              <Input
                id="binLocation"
                value={generateBinLocation() || formData.binLocation}
                onChange={(e) => handleChange("binLocation", e.target.value)}
                placeholder="A-01-A1"
                className="font-mono"
              />
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qtyOnHand">Qty On Hand</Label>
              <Input
                id="qtyOnHand"
                type="number"
                min={0}
                value={formData.qtyOnHand}
                onChange={(e) => handleChange("qtyOnHand", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQty">Min Qty</Label>
              <Input
                id="minQty"
                type="number"
                min={0}
                value={formData.minQty}
                onChange={(e) => handleChange("minQty", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxQty">Max Qty</Label>
              <Input
                id="maxQty"
                type="number"
                min={0}
                value={formData.maxQty}
                onChange={(e) => handleChange("maxQty", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderPoint">Reorder Point</Label>
              <Input
                id="reorderPoint"
                type="number"
                min={0}
                value={formData.reorderPoint}
                onChange={(e) => handleChange("reorderPoint", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uom">UOM</Label>
              <Select value={formData.uom} onValueChange={(v) => handleChange("uom", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitsOfMeasure.map((uom) => (
                    <SelectItem key={uom} value={uom}>
                      {uom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Supplier & Cost */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredSupplier">Preferred Supplier</Label>
              <Input
                id="preferredSupplier"
                value={formData.preferredSupplier}
                onChange={(e) => handleChange("preferredSupplier", e.target.value)}
                placeholder="e.g., CBC Bearings"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitCost">Unit Cost ($)</Label>
              <Input
                id="unitCost"
                type="number"
                min={0}
                step={0.01}
                value={formData.unitCost}
                onChange={(e) => handleChange("unitCost", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadTimeDays">Lead Time (days)</Label>
              <Input
                id="leadTimeDays"
                type="number"
                min={0}
                value={formData.leadTimeDays}
                onChange={(e) => handleChange("leadTimeDays", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Status & Critical Flag */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Critical Item</Label>
              <div className="flex items-center space-x-2 h-10">
                <Checkbox
                  id="isCritical"
                  checked={formData.isCritical}
                  onCheckedChange={(checked) => handleChange("isCritical", !!checked)}
                />
                <label
                  htmlFor="isCritical"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Flag as critical spare
                </label>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
