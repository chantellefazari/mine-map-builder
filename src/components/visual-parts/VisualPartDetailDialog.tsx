import { useState, useEffect } from "react";
 import { supabase } from "@/integrations/supabase/client";
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
 import { ChevronLeft, ChevronRight, Trash2, Upload, X, ImageIcon, Sparkles, Loader2, Check } from "lucide-react";
 import { toast } from "sonner";
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
 onImageGenerated?: (partId: string, imageUrl: string) => void;
}

export const VisualPartDetailDialog = ({
  part,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  onAddImage,
  onRemoveImage,
 onImageGenerated,
}: VisualPartDetailDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localPart, setLocalPart] = useState<VisualPart | null>(null);
 const [isGenerating, setIsGenerating] = useState(false);
 const [generatedImages, setGeneratedImages] = useState<string[]>([]);
 const [selectedGeneratedIndex, setSelectedGeneratedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (part) {
      setLocalPart(part);
      setCurrentImageIndex(0);
    }
  }, [part]);
 
 // Reset generated images when part changes
 useEffect(() => {
   setGeneratedImages([]);
   setSelectedGeneratedIndex(null);
 }, [part?.id]);

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

 const handleGenerateImage = async () => {
   if (!part) return;
   
   setIsGenerating(true);
   try {
     const { data, error } = await supabase.functions.invoke("generate-part-image", {
       body: { partName: localPart.part_name, partId: part.id },
     });
 
     if (error) {
       console.error("Generation error:", error);
       toast.error(error.message || "Failed to generate image");
       return;
     }
 
     if (data?.error) {
       toast.error(data.error);
       return;
     }
 
     if (data?.imageUrl) {
       setGeneratedImages((prev) => [...prev, data.imageUrl]);
       toast.success("Image generated! Click to select it.");
     }
   } catch (err) {
     console.error("Generate image error:", err);
     toast.error("Failed to generate image");
   } finally {
     setIsGenerating(false);
   }
 };
 
 const handleSelectGeneratedImage = async (imageUrl: string, index: number) => {
   if (!part) return;
   
   setSelectedGeneratedIndex(index);
   
   // Add to part's image_urls in database
   const newImageUrls = [...localPart.image_urls, imageUrl];
   
   const { error } = await supabase
     .from("visual_parts_catalogue")
     .update({ image_urls: newImageUrls })
     .eq("id", part.id);
   
   if (error) {
     console.error("Error saving image:", error);
     toast.error("Failed to save image to part");
     setSelectedGeneratedIndex(null);
     return;
   }
   
   // Update local state
   setLocalPart((prev) => prev ? { ...prev, image_urls: newImageUrls } : null);
   
   // Notify parent
   if (onImageGenerated) {
     onImageGenerated(part.id, imageUrl);
   }
   
   toast.success("Image added to part!");
 };
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Badge variant="outline" className="font-mono text-xs">
              {localPart.site_part_number.startsWith("TMP-") ? "000000" : localPart.site_part_number}
            </Badge>
            <span>{localPart.part_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Section */}
          <div className="space-y-2">
            <Label className="text-xs">Images</Label>
            <div className="relative aspect-[4/3] bg-background border rounded-lg overflow-hidden">
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
                size="sm"
                className="w-full"
                onClick={() => document.getElementById("detail-image-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
             <Button
               variant="outline"
               size="sm"
               className="w-full"
               onClick={handleGenerateImage}
               disabled={isGenerating}
             >
               {isGenerating ? (
                 <>
                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                   Generating...
                 </>
               ) : (
                 <>
                   <Sparkles className="h-4 w-4 mr-2" />
                   {generatedImages.length > 0 ? "Generate Another" : "Generate Image"}
                 </>
               )}
             </Button>
            </div>
 
           {/* Generated Images Gallery */}
           {generatedImages.length > 0 && (
             <div className="space-y-2">
               <Label className="text-xs">Generated Images (click to add)</Label>
               <div className="grid grid-cols-3 gap-2">
                 {generatedImages.map((url, idx) => {
                   const isSelected = selectedGeneratedIndex === idx;
                   const isAlreadyAdded = localPart.image_urls.includes(url);
                   return (
                     <div
                       key={idx}
                       className={`relative aspect-square border rounded-lg overflow-hidden cursor-pointer transition-all ${
                         isSelected || isAlreadyAdded
                           ? "ring-2 ring-primary border-primary"
                           : "hover:ring-2 hover:ring-primary/50"
                       }`}
                       onClick={() => !isAlreadyAdded && handleSelectGeneratedImage(url, idx)}
                     >
                       <img
                         src={url}
                         alt={`Generated ${idx + 1}`}
                         className="w-full h-full object-contain bg-background p-1"
                       />
                       {isAlreadyAdded && (
                         <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                           <Check className="h-6 w-6 text-primary" />
                         </div>
                       )}
                       <span className="absolute bottom-1 left-1 text-[10px] bg-background/80 px-1 rounded">
                         #{idx + 1}
                       </span>
                     </div>
                   );
                 })}
               </div>
               <p className="text-[10px] text-muted-foreground">
                 Click an image to add it to the part. Generate more to compare options.
               </p>
             </div>
           )}
          </div>

          {/* Details Section */}
          <div className="space-y-3">
            {/* Part Name */}
            <div className="space-y-1">
              <Label className="text-xs">Part Name / Description</Label>
              <Textarea
                value={localPart.part_name}
                onChange={(e) => handleFieldChange("part_name", e.target.value)}
                onBlur={() => handleFieldBlur("part_name")}
                className="min-h-[60px] text-sm"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <Label className="text-xs">Component Type</Label>
              <Select
                value={localPart.category}
                onValueChange={(val) => {
                  handleFieldChange("category", val);
                  if (part) onUpdate(part.id, { category: val });
                }}
              >
                <SelectTrigger className="h-8 text-sm">
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

            {/* Warehouse & Bin in row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Warehouse Area</Label>
                <Input
                  value={localPart.warehouse_area || ""}
                  onChange={(e) => handleFieldChange("warehouse_area", e.target.value)}
                  onBlur={() => handleFieldBlur("warehouse_area")}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Bin Location</Label>
                <Input
                  value={localPart.bin_location || ""}
                  onChange={(e) => handleFieldChange("bin_location", e.target.value)}
                  onBlur={() => handleFieldBlur("bin_location")}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Supplier & Asset in row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Supplier</Label>
                <Input
                  value={localPart.supplier || ""}
                  onChange={(e) => handleFieldChange("supplier", e.target.value)}
                  onBlur={() => handleFieldBlur("supplier")}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Asset / System</Label>
                <Input
                  value={localPart.associated_asset || ""}
                  onChange={(e) => handleFieldChange("associated_asset", e.target.value)}
                  onBlur={() => handleFieldBlur("associated_asset")}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Criticality */}
            <div className="space-y-1">
              <Label className="text-xs">Criticality</Label>
              <Select
                value={localPart.criticality}
                onValueChange={(val) => {
                  handleFieldChange("criticality", val);
                  if (part) onUpdate(part.id, { criticality: val });
                }}
              >
                <SelectTrigger className="h-8 text-sm">
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
            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium text-sm mb-2">Inventory & Pricing</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Min Qty</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localPart.min_qty ?? 0}
                    onChange={(e) => handleFieldChange("min_qty", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("min_qty")}
                    className="h-7 text-sm"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Max Qty</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localPart.max_qty ?? 0}
                    onChange={(e) => handleFieldChange("max_qty", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("max_qty")}
                    className="h-7 text-sm"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Qty in Stock</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localPart.qty_in_stock ?? 0}
                    onChange={(e) => handleFieldChange("qty_in_stock", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("qty_in_stock")}
                    className="h-7 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Lead Time (days)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localPart.lead_time_days ?? ""}
                    onChange={(e) => handleFieldChange("lead_time_days", e.target.value ? parseInt(e.target.value) : null)}
                    onBlur={() => handleFieldBlur("lead_time_days")}
                    className="h-7 text-sm"
                    placeholder="—"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Unit Price ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={localPart.unit_price ?? ""}
                    onChange={(e) => handleFieldChange("unit_price", e.target.value ? parseFloat(e.target.value) : null)}
                    onBlur={() => handleFieldBlur("unit_price")}
                    className="h-7 text-sm"
                    placeholder="—"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Textarea
                value={localPart.notes || ""}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                onBlur={() => handleFieldBlur("notes")}
                placeholder="Additional notes..."
                className="min-h-[50px] text-sm"
              />
            </div>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive mt-2">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
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
