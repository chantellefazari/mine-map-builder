import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { type SpareItem, sparesData } from "./sparesData";

interface AddSpareDialogProps {
  onAddSpare: (spare: SpareItem) => void;
  existingCount: number;
}

export const AddSpareDialog = ({ onAddSpare, existingCount }: AddSpareDialogProps) => {
  const [open, setOpen] = useState(false);
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
    assetManufacturer: "",
    assetModel: "",
    spareCriticality: "High" as "High" | "Medium" | "Low" | "",
    criticalitySource: "Assumed" as "Confirmed" | "Assumed" | "",
    reasonCritical: "",
    minQty: "TBC",
    maxQty: "TBC",
    qtyOnHand: "TBC",
    qtyPerSystem: "1",
    unitPrice: "",
    uom: "EA",
    leadTimeDays: "TBC",
    notes: "",
    confidence: "Low" as "Low" | "Medium" | "High",
    status: "Provisional" as "Provisional" | "Confirmed" | "TBC",
  });

  // Build hierarchy options from existing spares data
  const areaOptions = useMemo(() => {
    const uniqueAreas = new Map<string, string>();
    sparesData.forEach((s) => {
      if (s.area && !uniqueAreas.has(s.area)) {
        uniqueAreas.set(s.area, s.areaLabel);
      }
    });
    return Array.from(uniqueAreas.entries()).map(([code, label]) => ({ code, label }));
  }, []);

  const subAreaOptions = useMemo(() => {
    if (!formData.area) return [];
    const uniqueSubAreas = new Set<string>();
    sparesData.forEach((s) => {
      if (s.area === formData.area && s.subArea) {
        uniqueSubAreas.add(s.subArea);
      }
    });
    return Array.from(uniqueSubAreas).sort();
  }, [formData.area]);

  const systemOptions = useMemo(() => {
    if (!formData.area || !formData.subArea) return [];
    const uniqueSystems = new Set<string>();
    sparesData.forEach((s) => {
      if (s.area === formData.area && s.subArea === formData.subArea && s.system) {
        uniqueSystems.add(s.system);
      }
    });
    return Array.from(uniqueSystems).sort();
  }, [formData.area, formData.subArea]);

  const handleSubmit = () => {
    const newSpare: SpareItem = {
      id: `CS-${String(existingCount + 1).padStart(3, "0")}`,
      ...formData,
    };
    onAddSpare(newSpare);
    setOpen(false);
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
      assetManufacturer: "",
      assetModel: "",
      spareCriticality: "High",
      criticalitySource: "Assumed",
      reasonCritical: "",
      minQty: "TBC",
      maxQty: "TBC",
      qtyOnHand: "TBC",
      qtyPerSystem: "1",
      unitPrice: "",
      uom: "EA",
      leadTimeDays: "TBC",
      notes: "",
      confidence: "Low",
      status: "Provisional",
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Spare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto overflow-x-visible">
        <DialogHeader>
          <DialogTitle>Add New Critical Spare</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Location Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Location & Hierarchy</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="area">Area</Label>
                <Select
                  value={formData.area}
                  onValueChange={(value) => {
                    const selected = areaOptions.find((a) => a.code === value);
                    updateField("area", value);
                    updateField("areaLabel", selected?.label || "");
                    updateField("subArea", "");
                    updateField("system", "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    {areaOptions.map((area) => (
                      <SelectItem key={area.code} value={area.code}>
                        {area.code} - {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subArea">Sub-Area</Label>
                <Select
                  value={formData.subArea}
                  onValueChange={(value) => {
                    updateField("subArea", value);
                    updateField("system", "");
                  }}
                  disabled={!formData.area || subAreaOptions.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.area ? "Select sub-area..." : "Select area first..."} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    {subAreaOptions.length > 0 ? (
                      subAreaOptions.map((subArea) => (
                        <SelectItem key={subArea} value={subArea}>
                          {subArea}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">No sub-areas available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="system">System</Label>
                <Select
                  value={formData.system}
                  onValueChange={(value) => updateField("system", value)}
                  disabled={!formData.subArea || systemOptions.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.subArea ? "Select system..." : "Select sub-area first..."} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    {systemOptions.length > 0 ? (
                      systemOptions.map((system) => (
                        <SelectItem key={system} value={system}>
                          {system}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">No systems available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="assetNumber">Asset Number</Label>
                <Input
                  id="assetNumber"
                  value={formData.assetNumber}
                  onChange={(e) => updateField("assetNumber", e.target.value)}
                  placeholder="e.g., APN01-GMR01"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="parentAsset">Parent Asset (P&ID)</Label>
                <Input
                  id="parentAsset"
                  value={formData.parentAsset}
                  onChange={(e) => updateField("parentAsset", e.target.value)}
                  placeholder="e.g., 4-FE-100"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pidTag">P&ID Tag</Label>
                <Input
                  id="pidTag"
                  value={formData.pidTag}
                  onChange={(e) => updateField("pidTag", e.target.value)}
                  placeholder="e.g., 04-FE-100"
                />
              </div>
            </div>
          </div>

          {/* Component Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Component Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="componentName">Component Name</Label>
                <Input
                  id="componentName"
                  value={formData.componentName}
                  onChange={(e) => updateField("componentName", e.target.value)}
                  placeholder="e.g., Motor"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="componentType">Component Type</Label>
                <Input
                  id="componentType"
                  value={formData.componentType}
                  onChange={(e) => updateField("componentType", e.target.value)}
                  placeholder="e.g., Motor"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="sparePartDescription">Spare Part Description</Label>
                <Input
                  id="sparePartDescription"
                  value={formData.sparePartDescription}
                  onChange={(e) => updateField("sparePartDescription", e.target.value)}
                  placeholder="e.g., Apron Feeder Gearmotor"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="oemPartNumber">OEM Part Number</Label>
                <Input
                  id="oemPartNumber"
                  value={formData.oemPartNumber}
                  onChange={(e) => updateField("oemPartNumber", e.target.value)}
                  placeholder="e.g., SEW-EURODRIVE KA107R77"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => updateField("manufacturer", e.target.value)}
                  placeholder="e.g., SEW"
                />
              </div>
            </div>
          </div>

          {/* Criticality Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Criticality & Status</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Criticality</Label>
                <Select
                  value={formData.spareCriticality}
                  onValueChange={(value) => updateField("spareCriticality", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <Select
                  value={formData.criticalitySource}
                  onValueChange={(value) => updateField("criticalitySource", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Assumed">Assumed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="reasonCritical">Reason Critical</Label>
                <Input
                  id="reasonCritical"
                  value={formData.reasonCritical}
                  onChange={(e) => updateField("reasonCritical", e.target.value)}
                  placeholder="e.g., Motor - plant stoppage risk"
                />
              </div>
            </div>
          </div>

          {/* Quantities & Procurement Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Quantities & Procurement</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label>Min Qty</Label>
                <Select
                  value={formData.minQty}
                  onValueChange={(value) => updateField("minQty", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    <SelectItem value="TBC">TBC</SelectItem>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Max Qty</Label>
                <Select
                  value={formData.maxQty}
                  onValueChange={(value) => updateField("maxQty", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    <SelectItem value="TBC">TBC</SelectItem>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Qty On Hand</Label>
                <Select
                  value={formData.qtyOnHand}
                  onValueChange={(value) => updateField("qtyOnHand", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    <SelectItem value="TBC">TBC</SelectItem>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Lead Time (Days)</Label>
                <Select
                  value={formData.leadTimeDays}
                  onValueChange={(value) => updateField("leadTimeDays", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    <SelectItem value="TBC">TBC</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="21">21</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="45">45</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="90">90</SelectItem>
                    <SelectItem value="120">120</SelectItem>
                    <SelectItem value="180">180</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="unitPrice">Unit Price</Label>
                <Input
                  id="unitPrice"
                  value={formData.unitPrice}
                  onChange={(e) => updateField("unitPrice", e.target.value)}
                  placeholder="e.g., $16,450.00"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Confidence</Label>
                <Select
                  value={formData.confidence}
                  onValueChange={(value) => updateField("confidence", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-[200]" position="popper" sideOffset={4}>
                    <SelectItem value="Provisional">Provisional</SelectItem>
                    <SelectItem value="TBC">TBC</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.componentName}>
            Add Spare
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
