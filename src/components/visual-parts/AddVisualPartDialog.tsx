import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { PART_CATEGORIES, CRITICALITY_LEVELS } from "./visualPartsConstants";
import type { NewVisualPart } from "@/hooks/useVisualPartsCatalogue";

interface AddVisualPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (part: NewVisualPart) => Promise<any>;
}

export const AddVisualPartDialog = ({
  open,
  onOpenChange,
  onAdd,
}: AddVisualPartDialogProps) => {
  const [sitePartNumber, setSitePartNumber] = useState("");
  const [partName, setPartName] = useState("");
  const [category, setCategory] = useState("General");
  const [associatedAsset, setAssociatedAsset] = useState("");
  const [criticality, setCriticality] = useState("Non-Critical");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setSitePartNumber("");
    setPartName("");
    setCategory("General");
    setAssociatedAsset("");
    setCriticality("Non-Critical");
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sitePartNumber.trim() || !partName.trim()) return;

    setSaving(true);
    const result = await onAdd({
      site_part_number: sitePartNumber.trim(),
      part_name: partName.trim(),
      category,
      associated_asset: associatedAsset.trim(),
      criticality,
      notes: notes.trim(),
      image_urls: [],
    });

    setSaving(false);
    if (result) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Part to Visual Catalogue</DialogTitle>
          <DialogDescription>
            Create a new entry in the site's visual parts catalogue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sitePartNumber">Site Part Number *</Label>
            <Input
              id="sitePartNumber"
              value={sitePartNumber}
              onChange={(e) => setSitePartNumber(e.target.value)}
              placeholder="e.g. 100101"
              required
            />
            <p className="text-xs text-muted-foreground">
              Site-defined numeric code (SSCCNN format)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partName">Part Name *</Label>
            <Input
              id="partName"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              placeholder="e.g. Mill Discharge Pump Impeller"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PART_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="associatedAsset">Associated Asset / System</Label>
            <Input
              id="associatedAsset"
              value={associatedAsset}
              onChange={(e) => setAssociatedAsset(e.target.value)}
              placeholder="e.g. PP-04 Mill Discharge Pump"
            />
          </div>

          <div className="space-y-2">
            <Label>Criticality</Label>
            <Select value={criticality} onValueChange={setCriticality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CRITICALITY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Install location, handling notes, common failure info..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !sitePartNumber.trim() || !partName.trim()}>
              {saving ? "Adding..." : "Add Part"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
