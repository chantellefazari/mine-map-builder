import { useState, useEffect } from "react";
import { generateNextSparePartNumber } from "@/utils/autoPartNumbering";
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
import { type SiteSpareItem } from "@/hooks/useSiteSpares";
import { isCriticalItem, classifyCriticality, getCriticalityColor, type CriticalityLevel } from "@/utils/criticalityClassification";
import { classifyCategory, getAllCategories, type SpareCategory } from "@/utils/categoryClassification";
import { Badge } from "@/components/ui/badge";

// Approved Part Category Codes (TCMG) with subcategory hints
const categorySubcategories: Record<string, string[]> = {
  "Pumps": ["Slurry", "Submersible", "Centrifugal", "Diaphragm", "Impeller"],
  "Motors": ["Electric Motor", "Hydraulic Motor", "Vibrator"],
  "Gearboxes / Reducers": ["Helical", "Planetary", "Worm Gear"],
  "Bearings": ["Pillow Block", "Spherical Roller", "Ball Bearing", "Tapered Roller"],
  "Valves": ["Butterfly", "Knife Gate", "Ball", "Check", "Solenoid"],
  "Instrumentation": ["Transmitter", "Gauge", "Sensor", "Flow Meter"],
  "Electrical Components": ["Switch", "Cable", "Connector", "Contactor"],
  "Conveying Components": ["Idler", "Roller", "Belt Scraper", "Pulley"],
  "Wear Parts": ["Liner", "Screen Panel", "Crusher Liner", "Wear Plate"],
  "Structural & Mechanical": ["Coupling", "Sprocket", "Chain", "Bracket"],
  "Hoses & Pipework": ["Elbow", "Tee", "Nipple", "Flange", "Hose"],
  "Seals & Gaskets": ["O-Ring", "Gasket", "Mechanical Seal", "Oil Seal"],
  "Filters": ["Air Filter", "Oil Filter", "Fuel Filter", "Filter Press"],
  "Lubrication System Components": ["Lube Pump", "Oil Cooler", "Injector"],
  "Air & Pneumatic Components": ["Air Cylinder", "Compressor", "Regulator"],
  "Tanks & Vessels": ["Process Tank", "Sump", "Heat Exchanger"],
  "Safety Equipment": ["Safety Shower", "Eyewash", "Fire Extinguisher"],
  "Power Generation & Distribution": ["Generator", "Transformer", "Substation"],
  "Tools & Workshop Equipment": ["Lifting Gear", "Sling", "Power Tool", "Wrench"],
  "OEM Assemblies / Packages": ["Pump Skid", "Lube Skid"],
  "Fasteners": ["Bolt", "Nut", "Washer", "Screw", "Stud"],
  "Consumables": ["Gloves", "PPE", "Lubricant", "Tape", "Battery"],
};

const WAREHOUSE_LOCATIONS = [
  { value: "C01-EL", label: "C01-EL — Electrical" },
  { value: "C02-IN", label: "C02-IN — Instrumentation" },
  { value: "C03-ME", label: "C03-ME — Mechanical" },
  { value: "C04-LU", label: "C04-LU — Lubrication" },
  { value: "C05-FA", label: "C05-FA — Fasteners & Consumables" },
  { value: "LD", label: "LD — Laydown Yard" },
] as const;

const unitsOfMeasure = ["EA", "BOX", "PKT", "M", "L", "KG", "SET", "PAIR", "ROLL", "PK"];

const statuses = ["Active", "Low Stock", "Out of Stock", "Pending Review", "Obsolete", "Require Repair"];

interface AddSpareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSpare: (spare: Omit<SiteSpareItem, "id">) => void;
}

export const AddSpareDialog = ({
  open,
  onOpenChange,
  onAddSpare,
}: AddSpareDialogProps) => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    subcategory: "",
    manufacturer: "",
    oem_part_number: "",
    alternate_part_number: "",
    specifications: "",
    warehouse_area: "C03-ME",
    aisle: "",
    rack: "",
    bin_location: "",
    qty_on_hand: 0,
    min_qty: 0,
    max_qty: 0,
    reorder_point: 0,
    uom: "EA",
    unit_cost: 0,
    preferred_supplier: "",
    lead_time_days: 0,
    status: "Active",
    is_critical: false,
    notes: "",
  });
  
  // Track the auto-detected criticality level
  const [detectedCriticality, setDetectedCriticality] = useState<CriticalityLevel>("LOW");
  
  // Auto-classify criticality when description changes
  useEffect(() => {
    if (formData.description) {
      const level = classifyCriticality(formData.description);
      setDetectedCriticality(level);
      // Auto-set is_critical for HIGH items (user can override)
      if (level === "HIGH" && !formData.is_critical) {
        setFormData(prev => ({ ...prev, is_critical: true }));
      }
    } else {
      setDetectedCriticality("LOW");
    }
  }, [formData.description]);

  const categoryList = Object.keys(categorySubcategories).sort();
  const subcategoryList = formData.category ? categorySubcategories[formData.category] || [] : [];

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: "",
    }));
  };

  const generateBinLocation = (): string => {
    if (formData.warehouse_area && formData.aisle && formData.rack) {
      return `${formData.warehouse_area}-${formData.aisle}-${formData.rack}`;
    }
    return "";
  };

  const handleSubmit = async () => {
    // Auto-generate SSCCXX part number based on category
    const autoPartNumber = await generateNextSparePartNumber(formData.category);
    
    const newSpare: Omit<SiteSpareItem, "id"> = {
      part_number: autoPartNumber || "",
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      manufacturer: formData.manufacturer,
      oem_part_number: formData.oem_part_number,
      alternate_part_number: formData.alternate_part_number,
      specifications: formData.specifications,
      warehouse_area: formData.warehouse_area,
      aisle: formData.aisle,
      rack: formData.rack,
      bin_location: generateBinLocation() || formData.bin_location,
      storage_type: "Shelved",
      qty_on_hand: formData.qty_on_hand,
      min_qty: formData.min_qty,
      max_qty: formData.max_qty,
      reorder_point: formData.reorder_point || formData.min_qty,
      uom: formData.uom,
      unit_cost: formData.unit_cost,
      preferred_supplier: formData.preferred_supplier,
      lead_time_days: formData.lead_time_days,
      last_purchase_date: null,
      status: formData.status,
      condition: "Serviceable",
      is_critical: formData.is_critical,
      critical_spare_id: "",
      asset_tag: "",
      notes: formData.notes,
      image_urls: [],
    };

    onAddSpare(newSpare);
    
    // Reset form
    setFormData({
      description: "",
      category: "",
      subcategory: "",
      manufacturer: "",
      oem_part_number: "",
      alternate_part_number: "",
      specifications: "",
      warehouse_area: "",
      aisle: "",
      rack: "",
      bin_location: "",
      qty_on_hand: 0,
      min_qty: 0,
      max_qty: 0,
      reorder_point: 0,
      uom: "EA",
      unit_cost: 0,
      preferred_supplier: "",
      lead_time_days: 0,
      status: "Active",
      is_critical: false,
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
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description *</Label>
              {formData.description && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getCriticalityColor(detectedCriticality)}`}
                >
                  {detectedCriticality === "HIGH" ? "🔴 HIGH Criticality" : 
                   detectedCriticality === "MEDIUM" ? "🟠 MEDIUM Criticality" : 
                   "🟢 LOW Criticality"}
                </Badge>
              )}
            </div>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g., Deep Groove Ball Bearing 6205 2RS"
            />
            {formData.description && detectedCriticality === "HIGH" && (
              <p className="text-xs text-destructive">
                Auto-flagged as critical spare (production/safety critical)
              </p>
            )}
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
              <Label htmlFor="oem_part_number">OEM Part Number</Label>
              <Input
                id="oem_part_number"
                value={formData.oem_part_number}
                onChange={(e) => handleChange("oem_part_number", e.target.value)}
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
              <Label htmlFor="warehouse_area">Warehouse Area</Label>
              <Select value={formData.warehouse_area} onValueChange={(v) => handleChange("warehouse_area", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent>
                  {WAREHOUSE_LOCATIONS.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
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
              <Label htmlFor="bin_location">Bin Location</Label>
              <Input
                id="bin_location"
                value={generateBinLocation() || formData.bin_location}
                onChange={(e) => handleChange("bin_location", e.target.value)}
                placeholder="A-01-A1"
                className="font-mono"
              />
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qty_on_hand">Qty On Hand</Label>
              <Input
                id="qty_on_hand"
                type="number"
                min={0}
                value={formData.qty_on_hand}
                onChange={(e) => handleChange("qty_on_hand", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_qty">Min Qty</Label>
              <Input
                id="min_qty"
                type="number"
                min={0}
                value={formData.min_qty}
                onChange={(e) => handleChange("min_qty", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_qty">Max Qty</Label>
              <Input
                id="max_qty"
                type="number"
                min={0}
                value={formData.max_qty}
                onChange={(e) => handleChange("max_qty", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorder_point">Reorder Point</Label>
              <Input
                id="reorder_point"
                type="number"
                min={0}
                value={formData.reorder_point}
                onChange={(e) => handleChange("reorder_point", parseInt(e.target.value) || 0)}
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
              <Label htmlFor="preferred_supplier">Preferred Supplier</Label>
              <Input
                id="preferred_supplier"
                value={formData.preferred_supplier}
                onChange={(e) => handleChange("preferred_supplier", e.target.value)}
                placeholder="e.g., CBC Bearings"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_cost">Unit Cost ($)</Label>
              <Input
                id="unit_cost"
                type="number"
                min={0}
                step={0.01}
                value={formData.unit_cost}
                onChange={(e) => handleChange("unit_cost", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead_time_days">Lead Time (days)</Label>
              <Input
                id="lead_time_days"
                type="number"
                min={0}
                value={formData.lead_time_days}
                onChange={(e) => handleChange("lead_time_days", parseInt(e.target.value) || 0)}
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
                  id="is_critical"
                  checked={formData.is_critical}
                  onCheckedChange={(checked) => handleChange("is_critical", !!checked)}
                />
                <label
                  htmlFor="is_critical"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Flag as critical spare
                </label>
                {detectedCriticality === "HIGH" && formData.is_critical && (
                  <span className="text-xs text-muted-foreground">(auto-detected)</span>
                )}
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
