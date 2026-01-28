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
import { type SiteSpareItem } from "./siteSparesData";

interface AddSpareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSpare: (spare: SiteSpareItem) => void;
  existingCount: number;
}

const areaOptions = [
  { code: "COM", label: "Comminution / Process" },
  { code: "REC", label: "Gold Recovery" },
  { code: "TAIL", label: "Tailings" },
  { code: "UTL", label: "Utilities" },
  { code: "SUP", label: "Support Services" },
];

const priorities: Array<"HIGH" | "MEDIUM" | "LOW"> = ["HIGH", "MEDIUM", "LOW"];
const statuses: Array<"Provisional" | "Confirmed" | "TBC"> = ["Provisional", "Confirmed", "TBC"];
const confidenceLevels: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"];
const criticalitySources: Array<"Confirmed" | "Assumed"> = ["Confirmed", "Assumed"];

export const AddSpareDialog = ({
  open,
  onOpenChange,
  onAddSpare,
  existingCount,
}: AddSpareDialogProps) => {
  const [formData, setFormData] = useState({
    area: "",
    areaLabel: "",
    subArea: "",
    system: "",
    parentAsset: "",
    assetNumber: "",
    pidTag: "",
    componentName: "",
    componentType: "",
    sparePartDescription: "",
    oemPartNumber: "",
    manufacturer: "",
    vendor: "",
    priority: "MEDIUM" as "HIGH" | "MEDIUM" | "LOW",
    priorityReason: "",
    spareCriticality: "" as "High" | "Medium" | "Low" | "",
    criticalitySource: "" as "Confirmed" | "Assumed" | "",
    minQty: "",
    maxQty: "",
    confidence: "Low" as "Low" | "Medium" | "High",
    status: "Provisional" as "Provisional" | "Confirmed" | "TBC",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAreaChange = (areaCode: string) => {
    const selectedArea = areaOptions.find(a => a.code === areaCode);
    setFormData(prev => ({
      ...prev,
      area: areaCode,
      areaLabel: selectedArea?.label || "",
    }));
  };

  const handleSubmit = () => {
    // Determine spareCriticality based on priority
    let spareCrit: "High" | "Medium" | "Low" | "" = "";
    if (formData.priority === "HIGH") spareCrit = "High";
    else if (formData.priority === "MEDIUM") spareCrit = "Medium";
    else if (formData.priority === "LOW") spareCrit = "Low";

    const newSpare: SiteSpareItem = {
      id: `SS-${String(existingCount + 1).padStart(3, "0")}`,
      area: formData.area,
      areaLabel: formData.areaLabel,
      subArea: formData.subArea,
      system: formData.system,
      parentAsset: formData.parentAsset,
      assetNumber: formData.assetNumber,
      pidTag: formData.pidTag,
      componentName: formData.componentName,
      componentType: formData.componentType,
      sparePartDescription: formData.sparePartDescription,
      oemPartNumber: formData.oemPartNumber,
      manufacturer: formData.manufacturer,
      vendor: formData.vendor,
      assetManufacturer: "",
      assetModel: "",
      priority: formData.priority,
      priorityReason: formData.priorityReason,
      reviewFlag: false,
      spareCriticality: spareCrit,
      criticalitySource: formData.criticalitySource || "Assumed",
      reasonCritical: formData.priorityReason,
      minQty: formData.minQty,
      maxQty: formData.maxQty,
      qtyPerSystem: "",
      unitPrice: "",
      uom: "EA",
      leadTime: "",
      storageRequirement: "",
      notes: "",
      confidence: formData.confidence,
      status: formData.status,
    };

    onAddSpare(newSpare);
    
    // Reset form
    setFormData({
      area: "",
      areaLabel: "",
      subArea: "",
      system: "",
      parentAsset: "",
      assetNumber: "",
      pidTag: "",
      componentName: "",
      componentType: "",
      sparePartDescription: "",
      oemPartNumber: "",
      manufacturer: "",
      vendor: "",
      priority: "MEDIUM",
      priorityReason: "",
      spareCriticality: "",
      criticalitySource: "",
      minQty: "",
      maxQty: "",
      confidence: "Low",
      status: "Provisional",
    });
    
    onOpenChange(false);
  };

  const isValid = formData.area && formData.componentName && formData.sparePartDescription;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Spare</DialogTitle>
          <DialogDescription>
            Manually add a spare part to the site catalogue. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Row 1: Area & Sub-Area */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Area *</Label>
              <Select value={formData.area} onValueChange={handleAreaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areaOptions.map((area) => (
                    <SelectItem key={area.code} value={area.code}>
                      {area.code} - {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subArea">Sub-Area</Label>
              <Input
                id="subArea"
                value={formData.subArea}
                onChange={(e) => handleChange("subArea", e.target.value)}
                placeholder="e.g., Feed / Reclaim, Grinding"
              />
            </div>
          </div>

          {/* Row 2: System & Asset Numbers */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="system">System</Label>
              <Input
                id="system"
                value={formData.system}
                onChange={(e) => handleChange("system", e.target.value)}
                placeholder="e.g., APN01 Apron Feeder"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetNumber">Asset Number</Label>
              <Input
                id="assetNumber"
                value={formData.assetNumber}
                onChange={(e) => handleChange("assetNumber", e.target.value)}
                placeholder="e.g., APN01-GMR01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentAsset">Legacy P&ID Ref</Label>
              <Input
                id="parentAsset"
                value={formData.parentAsset}
                onChange={(e) => handleChange("parentAsset", e.target.value)}
                placeholder="e.g., 4-FE-100"
              />
            </div>
          </div>

          {/* Row 3: Component Name & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="componentName">Component Name *</Label>
              <Input
                id="componentName"
                value={formData.componentName}
                onChange={(e) => handleChange("componentName", e.target.value)}
                placeholder="e.g., Motor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="componentType">Component Type</Label>
              <Input
                id="componentType"
                value={formData.componentType}
                onChange={(e) => handleChange("componentType", e.target.value)}
                placeholder="e.g., Motor, Gearbox, Pump"
              />
            </div>
          </div>

          {/* Row 4: Description */}
          <div className="space-y-2">
            <Label htmlFor="sparePartDescription">Spare Part Description *</Label>
            <Input
              id="sparePartDescription"
              value={formData.sparePartDescription}
              onChange={(e) => handleChange("sparePartDescription", e.target.value)}
              placeholder="e.g., Primary Ball Mill Motor 1000kW"
            />
          </div>

          {/* Row 5: OEM Part Number & Manufacturer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oemPartNumber">OEM Part Number</Label>
              <Input
                id="oemPartNumber"
                value={formData.oemPartNumber}
                onChange={(e) => handleChange("oemPartNumber", e.target.value)}
                placeholder="e.g., SEW-EURODRIVE KA107"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleChange("manufacturer", e.target.value)}
                placeholder="e.g., Siemens, Weg, SEW"
              />
            </div>
          </div>

          {/* Row 6: Vendor & P&ID Tag */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => handleChange("vendor", e.target.value)}
                placeholder="e.g., NEWMAN, CBC"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pidTag">P&ID Tag</Label>
              <Input
                id="pidTag"
                value={formData.pidTag}
                onChange={(e) => handleChange("pidTag", e.target.value)}
                placeholder="e.g., 04-ML-100"
              />
            </div>
          </div>

          {/* Row 7: Priority & Reason */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) => handleChange("priority", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priorityReason">Priority Reason</Label>
              <Input
                id="priorityReason"
                value={formData.priorityReason}
                onChange={(e) => handleChange("priorityReason", e.target.value)}
                placeholder="e.g., Motor - plant stoppage risk"
              />
            </div>
          </div>

          {/* Row 8: Quantities */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minQty">Min Qty</Label>
              <Input
                id="minQty"
                value={formData.minQty}
                onChange={(e) => handleChange("minQty", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxQty">Max Qty</Label>
              <Input
                id="maxQty"
                value={formData.maxQty}
                onChange={(e) => handleChange("maxQty", e.target.value)}
                placeholder="1"
              />
            </div>
          </div>

          {/* Row 9: Source, Confidence & Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="criticalitySource">Criticality Source</Label>
              <Select
                value={formData.criticalitySource}
                onValueChange={(v) => handleChange("criticalitySource", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {criticalitySources.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence</Label>
              <Select
                value={formData.confidence}
                onValueChange={(v) => handleChange("confidence", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select confidence" />
                </SelectTrigger>
                <SelectContent>
                  {confidenceLevels.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Add Spare
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
