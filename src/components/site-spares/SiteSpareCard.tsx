import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ImageIcon, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SiteSpareItem } from "@/hooks/useSiteSpares";
import { classifyCriticality, type CriticalityLevel } from "@/utils/criticalityClassification";
import { getCategoryColor, type SpareCategory } from "@/utils/categoryClassification";

interface SiteSpareCardProps {
  spare: SiteSpareItem;
  onUpdate: (id: string, updates: Partial<SiteSpareItem>) => void;
  onDelete: (id: string) => void;
}

// Criticality badge colors
const criticalityColors: Record<CriticalityLevel, string> = {
  HIGH: "bg-destructive/20 text-destructive border-destructive/30",
  MEDIUM: "bg-warning/20 text-warning border-warning/30",
  LOW: "bg-success/20 text-success border-success/30",
};

// Status options
const statusOptions = [
  "Active",
  "Low Stock",
  "Out of Stock",
  "Pending Review",
  "Obsolete",
  "Require Repair",
];

export const SiteSpareCard = ({
  spare,
  onUpdate,
  onDelete,
}: SiteSpareCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for text inputs to prevent re-render glitches while typing
  const [localDescription, setLocalDescription] = useState(spare.description);
  const [localSpecs, setLocalSpecs] = useState(spare.specifications || "");
  const [localBin, setLocalBin] = useState(spare.bin_location || "");
  const [localManufacturer, setLocalManufacturer] = useState(spare.manufacturer || "");
  const [localOemPart, setLocalOemPart] = useState(spare.oem_part_number || "");

  const imageUrls = spare.image_urls || [];
  const criticality = classifyCriticality(localDescription);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = (file.name?.split(".").pop() || "png").toLowerCase();
      const fileName = `site-spares/${spare.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("visual-parts-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("visual-parts-images")
        .getPublicUrl(fileName);

      // Use current image_urls from spare prop to avoid stale closure
      const currentUrls = spare.image_urls || [];
      const newUrls = [...currentUrls, urlData.publicUrl];
      onUpdate(spare.id, { image_urls: newUrls });
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }, [spare.id, spare.image_urls, onUpdate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleRemoveImage = useCallback(async (urlToRemove: string) => {
    try {
      const path = urlToRemove.split("/visual-parts-images/")[1];
      if (path) {
        await supabase.storage.from("visual-parts-images").remove([path]);
      }
      // Use current image_urls from spare prop
      const currentUrls = spare.image_urls || [];
      const newUrls = currentUrls.filter((url) => url !== urlToRemove);
      onUpdate(spare.id, { image_urls: newUrls });
      setCurrentImageIndex(0);
      toast.success("Image removed");
    } catch (error) {
      console.error("Remove error:", error);
      const currentUrls = spare.image_urls || [];
      const newUrls = currentUrls.filter((url) => url !== urlToRemove);
      onUpdate(spare.id, { image_urls: newUrls });
    }
  }, [spare.id, spare.image_urls, onUpdate]);

  const nextImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }
  };

  const prevImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? imageUrls.length - 1 : prev - 1
      );
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Image Section - Compact */}
      <div
        className={`relative aspect-square bg-white cursor-pointer ${
          isDragOver ? "ring-2 ring-primary ring-inset bg-primary/10" : ""
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {imageUrls.length > 0 ? (
          <>
            <img
              src={imageUrls[currentImageIndex]}
              alt={spare.description}
              className="absolute inset-0 w-full h-full object-contain"
            />
            {imageUrls.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {imageUrls.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-5 w-5 opacity-80"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage(imageUrls[currentImageIndex]);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ImageIcon className="h-8 w-8 mb-1" />
            <span className="text-xs">Click to upload</span>
          </div>
        )}
      </div>

      <CardContent className="p-2 space-y-1.5">
        {/* Part Number + Criticality + Category Badges */}
        <div className="flex flex-wrap items-center gap-1">
          {spare.part_number && (
            <Badge variant="outline" className="font-mono text-[10px] px-1 py-0">
              {spare.part_number}
            </Badge>
          )}
          <Badge variant="outline" className={`text-[10px] px-1 py-0 ${criticalityColors[criticality]}`}>
            {criticality}
          </Badge>
          <Badge variant="secondary" className={`text-[10px] px-1 py-0 ${getCategoryColor(spare.category as SpareCategory)}`}>
            {spare.category}
          </Badge>
        </div>

        {/* Description */}
        <Textarea
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
          onBlur={() => {
            if (localDescription !== spare.description) {
              onUpdate(spare.id, { description: localDescription });
            }
          }}
          className="font-medium text-xs min-h-[44px] resize-none p-1.5"
          placeholder="Description"
        />

        {/* Specifications */}
        <Input
          value={localSpecs}
          onChange={(e) => setLocalSpecs(e.target.value)}
          onBlur={() => {
            if (localSpecs !== (spare.specifications || "")) {
              onUpdate(spare.id, { specifications: localSpecs });
            }
          }}
          placeholder="Size / Specs"
          className="text-[11px] h-6 px-1.5"
        />

        {/* Two-column layout for key fields */}
        <div className="grid grid-cols-2 gap-1">
          {/* Bin Location */}
          <Input
            value={localBin}
            onChange={(e) => setLocalBin(e.target.value)}
            onBlur={() => {
              if (localBin !== (spare.bin_location || "")) {
                onUpdate(spare.id, { bin_location: localBin });
              }
            }}
            placeholder="Bin"
            className="text-[11px] h-6 font-mono px-1.5"
          />
          {/* Qty */}
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] text-muted-foreground">Qty:</span>
            <Input
              type="number"
              min={0}
              value={spare.qty_on_hand}
              onChange={(e) => {
                const newQty = parseInt(e.target.value) || 0;
                const newStatus =
                  newQty === 0
                    ? "Out of Stock"
                    : newQty <= spare.min_qty
                    ? "Low Stock"
                    : "Active";
                onUpdate(spare.id, { qty_on_hand: newQty, status: newStatus });
              }}
              className="text-[11px] h-6 w-12 text-center px-1"
            />
          </div>
        </div>

        {/* Manufacturer / Supplier */}
        <Input
          value={localManufacturer}
          onChange={(e) => setLocalManufacturer(e.target.value)}
          onBlur={() => {
            if (localManufacturer !== (spare.manufacturer || "")) {
              onUpdate(spare.id, { manufacturer: localManufacturer });
            }
          }}
          placeholder="Supplier / Mfr"
          className="text-[11px] h-6 px-1.5"
        />

        {/* OEM Part Number */}
        <Input
          value={localOemPart}
          onChange={(e) => setLocalOemPart(e.target.value)}
          onBlur={() => {
            if (localOemPart !== (spare.oem_part_number || "")) {
              onUpdate(spare.id, { oem_part_number: localOemPart });
            }
          }}
          placeholder="OEM Part #"
          className="text-[11px] h-6 font-mono px-1.5"
        />

        {/* Status Select */}
        <Select
          value={spare.status}
          onValueChange={(val) => onUpdate(spare.id, { status: val })}
        >
          <SelectTrigger className="h-6 text-[11px] px-1.5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status} className="text-xs">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Min/Max/Lead Time row */}
        <div className="grid grid-cols-3 gap-1">
          <div>
            <span className="text-[9px] text-muted-foreground">Min</span>
            <Input
              type="number"
              min={0}
              value={spare.min_qty}
              onChange={(e) => onUpdate(spare.id, { min_qty: parseInt(e.target.value) || 0 })}
              className="text-[11px] h-5 text-center px-1"
            />
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground">Max</span>
            <Input
              type="number"
              min={0}
              value={spare.max_qty}
              onChange={(e) => onUpdate(spare.id, { max_qty: parseInt(e.target.value) || 0 })}
              className="text-[11px] h-5 text-center px-1"
            />
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground">Lead</span>
            <Input
              type="number"
              min={0}
              value={spare.lead_time_days || 0}
              onChange={(e) => onUpdate(spare.id, { lead_time_days: parseInt(e.target.value) || 0 })}
              className="text-[11px] h-5 text-center px-1"
            />
          </div>
        </div>

        {/* Unit Cost */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">$</span>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={spare.unit_cost || 0}
            onChange={(e) => onUpdate(spare.id, { unit_cost: parseFloat(e.target.value) || 0 })}
            className="text-[11px] h-6 flex-1 px-1.5"
          />
        </div>

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-6 text-[10px] text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this item?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove "{spare.description}" from the
                Site Spares Catalogue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => onDelete(spare.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
