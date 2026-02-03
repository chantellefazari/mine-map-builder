import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Trash2, Upload, X, ImageIcon } from "lucide-react";
import type { VisualPart } from "@/hooks/useVisualPartsCatalogueSafe";
import { PART_CATEGORIES, CRITICALITY_LEVELS, getCriticalityColor } from "./visualPartsConstants";

interface VisualPartDetailDialogProps {
  part: VisualPart | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<VisualPart>) => void;
  onDelete: (id: string) => void;
  onAddImage: (partId: string, file: File) => void;
  onRemoveImage: (partId: string, imageUrl: string) => void;
}

export const VisualPartDetailDialog = ({
  part,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  onAddImage,
  onRemoveImage,
}: VisualPartDetailDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localPart, setLocalPart] = useState<VisualPart | null>(null);

  useEffect(() => {
    if (part) {
      setLocalPart(part);
      setCurrentImageIndex(0);
    }
  }, [part]);

  if (!localPart) return null;

  const handleFieldChange = (field: keyof VisualPart, value: any) => {
    setLocalPart((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleFieldBlur = (field: keyof VisualPart) => {
    if (localPart && part) {
      const value = localPart[field];
      if (value !== part[field]) {
        onUpdate(part.id, { [field]: value });
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/") && part) {
      onAddImage(part.id, file);
    }
  };

  const nextImage = () => {
    if (localPart.image_urls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % localPart.image_urls.length);
    }
  };

  const prevImage = () => {
    if (localPart.image_urls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? localPart.image_urls.length - 1 : prev - 1
      );
    }
  };

  const handleDelete = () => {
    if (part) {
      onDelete(part.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono">
              {localPart.site_part_number.startsWith("TMP-") ? "000000" : localPart.site_part_number}
            </Badge>
            <span>{localPart.part_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-3">
            <Label>Images</Label>
            <div className="relative aspect-square bg-background border rounded-lg overflow-hidden">
              {localPart.image_urls.length > 0 ? (
                <>
                  <img
                    src={localPart.image_urls[currentImageIndex]}
                    alt={localPart.part_name}
                    className="absolute inset-0 w-full h-full object-contain p-2"
                  />
                  {localPart.image_urls.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {localPart.image_urls.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === currentImageIndex ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => {
                      if (part) {
                        onRemoveImage(part.id, localPart.image_urls[currentImageIndex]);
                        setCurrentImageIndex(0);
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mb-3" />
                  <span className="text-sm">No images uploaded</span>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="detail-image-upload"
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("detail-image-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            {/* Part Name */}
            <div className="space-y-1.5">
              <Label>Part Name / Description</Label>
              <Textarea
                value={localPart.part_name}
                onChange={(e) => handleFieldChange("part_name", e.target.value)}
                onBlur={() => handleFieldBlur("part_name")}
                className="min-h-[80px]"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label>Component Type</Label>
              <Select
                value={localPart.category}
                onValueChange={(val) => {
                  handleFieldChange("category", val);
                  if (part) onUpdate(part.id, { category: val });
                }}
              >
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

            {/* Supplier */}
            <div className="space-y-1.5">
              <Label>Supplier</Label>
              <Input
                value={localPart.supplier || ""}
                onChange={(e) => handleFieldChange("supplier", e.target.value)}
                onBlur={() => handleFieldBlur("supplier")}
              />
            </div>

            {/* Associated Asset */}
            <div className="space-y-1.5">
              <Label>Asset / System</Label>
              <Input
                value={localPart.associated_asset || ""}
                onChange={(e) => handleFieldChange("associated_asset", e.target.value)}
                onBlur={() => handleFieldBlur("associated_asset")}
              />
            </div>

            {/* Criticality */}
            <div className="space-y-1.5">
              <Label>Criticality</Label>
              <Select
                value={localPart.criticality}
                onValueChange={(val) => {
                  handleFieldChange("criticality", val);
                  if (part) onUpdate(part.id, { criticality: val });
                }}
              >
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

            {/* Inventory Section */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Inventory & Pricing</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Min Qty</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localPart.min_qty ?? 0}
                    onChange={(e) => handleFieldChange("min_qty", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("min_qty")}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Max Qty</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localPart.max_qty ?? 0}
                    onChange={(e) => handleFieldChange("max_qty", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("max_qty")}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Qty in Stock</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localPart.qty_in_stock ?? 0}
                    onChange={(e) => handleFieldChange("qty_in_stock", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("qty_in_stock")}
                    className="h-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Lead Time (days)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localPart.lead_time_days ?? ""}
                    onChange={(e) => handleFieldChange("lead_time_days", e.target.value ? parseInt(e.target.value) : null)}
                    onBlur={() => handleFieldBlur("lead_time_days")}
                    className="h-8"
                    placeholder="—"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Unit Price ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={localPart.unit_price ?? ""}
                    onChange={(e) => handleFieldChange("unit_price", e.target.value ? parseFloat(e.target.value) : null)}
                    onBlur={() => handleFieldBlur("unit_price")}
                    className="h-8"
                    placeholder="—"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={localPart.notes || ""}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                onBlur={() => handleFieldBlur("notes")}
                placeholder="Additional notes..."
                className="min-h-[80px]"
              />
            </div>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive mt-4">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Part
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this part?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove "{localPart.part_name}" and all associated images.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
