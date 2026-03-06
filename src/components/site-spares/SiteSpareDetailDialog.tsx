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
import { ChevronLeft, ChevronRight, Trash2, Upload, X, ImageIcon, FileText, FlaskConical } from "lucide-react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SiteSpareItem } from "@/hooks/useSiteSpares";
import { classifyCriticality, type CriticalityLevel } from "@/utils/criticalityClassification";
import { getEdgeFunctionErrorMessage } from "@/utils/getEdgeFunctionErrorMessage";
import { SupplierSelector } from "@/components/shared/SupplierSelector";
import { Switch } from "@/components/ui/switch";
import { QuoteComparisonDialog } from "@/components/shared/QuoteComparisonDialog";
import { classifyCategory, getAllCategories, getCategoryColor, type SpareCategory } from "@/utils/categoryClassification";


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

// Warehouse location codes — strict list
const WAREHOUSE_LOCATIONS = [
  { value: "C01-EL", label: "C01-EL — Electrical" },
  { value: "C02-IN", label: "C02-IN — Instrumentation, Pneumatics & Process Fittings" },
  { value: "C03-ME", label: "C03-ME — Mechanical" },
  { value: "C04-MP", label: "C04-MP — Mechanical Precision" },
  { value: "C05-CS", label: "C05-CS — Consumables & Supplies" },
  { value: "LD", label: "LD — Laydown Yard" },
] as const;

interface SiteSpareDetailDialogProps {
  spare: SiteSpareItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<SiteSpareItem>) => void;
  onDelete: (id: string) => void;
}

export const SiteSpareDetailDialog = ({
  spare,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: SiteSpareDetailDialogProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localSpare, setLocalSpare] = useState<SiteSpareItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedGeneratedIndex, setSelectedGeneratedIndex] = useState<number | null>(null);
  const [showQuoteComparison, setShowQuoteComparison] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  useEffect(() => {
    if (spare) {
      setLocalSpare(spare);
      setCurrentImageIndex(0);
    }
  }, [spare]);

  // Reset generated images when spare changes
  useEffect(() => {
    setGeneratedImages([]);
    setSelectedGeneratedIndex(null);
  }, [spare?.id]);

  if (!localSpare) return null;

  const imageUrls = localSpare.image_urls || [];
  const criticality = classifyCriticality(localSpare.description);

  const handleFieldChange = (field: keyof SiteSpareItem, value: any) => {
    setLocalSpare((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleFieldBlur = (field: keyof SiteSpareItem) => {
    if (localSpare && spare) {
      const value = localSpare[field];
      if (value !== spare[field]) {
        onUpdate(spare.id, { [field]: value });
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !spare) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
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

      const currentUrls = spare.image_urls || [];
      const newUrls = [...currentUrls, urlData.publicUrl];
      onUpdate(spare.id, { image_urls: newUrls });
      setLocalSpare((prev) => prev ? { ...prev, image_urls: newUrls } : null);
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (urlToRemove: string) => {
    if (!spare) return;
    try {
      const path = urlToRemove.split("/visual-parts-images/")[1];
      if (path) {
        await supabase.storage.from("visual-parts-images").remove([path]);
      }
      const currentUrls = localSpare.image_urls || [];
      const newUrls = currentUrls.filter((url) => url !== urlToRemove);
      onUpdate(spare.id, { image_urls: newUrls });
      setLocalSpare((prev) => prev ? { ...prev, image_urls: newUrls } : null);
      setCurrentImageIndex(0);
      toast.success("Image removed");
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

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

  const handleDelete = () => {
    if (spare) {
      onDelete(spare.id);
      onOpenChange(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!spare) return;
    
    setIsGenerating(true);
    try {
      const { data, error, response } = await supabase.functions.invoke("generate-part-image", {
        body: { partName: localSpare.description, partId: spare.id },
      });

      if (error) {
        console.error("Generation error:", error);
        const msg = await getEdgeFunctionErrorMessage({ error, response: response as any });
        toast.error(msg);
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
    if (!spare) return;
    
    setSelectedGeneratedIndex(index);
    
    const currentUrls = localSpare.image_urls || [];
    const newImageUrls = [...currentUrls, imageUrl];
    
    const { error } = await supabase
      .from("site_spares")
      .update({ image_urls: newImageUrls })
      .eq("id", spare.id);
    
    if (error) {
      console.error("Error saving image:", error);
      toast.error("Failed to save image to part");
      setSelectedGeneratedIndex(null);
      return;
    }
    
    setLocalSpare((prev) => prev ? { ...prev, image_urls: newImageUrls } : null);
    onUpdate(spare.id, { image_urls: newImageUrls });
    
    toast.success("Image added to part!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {localSpare.part_number && (
              <Badge variant="outline" className="font-mono text-xs">
                {localSpare.part_number}
              </Badge>
            )}
            <Badge className={`text-[10px] ${criticalityColors[criticality]}`}>
              {criticality}
            </Badge>
            <span className="truncate">{localSpare.description.slice(0, 50)}{localSpare.description.length > 50 ? "..." : ""}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Section */}
          <div className="space-y-2">
            <Label className="text-xs">Images</Label>
            <div className={`relative aspect-[4/3] bg-background border rounded-lg overflow-hidden ${isUploading ? "opacity-50" : ""}`}>
              {imageUrls.length > 0 ? (
                <>
                  <img
                    src={imageUrls[currentImageIndex]}
                    alt={localSpare.description}
                    className="absolute inset-0 w-full h-full object-contain p-2"
                  />
                  {imageUrls.length > 1 && (
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
                        {imageUrls.map((_, idx) => (
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
                    onClick={() => handleRemoveImage(imageUrls[currentImageIndex])}
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
                id="spare-detail-image-upload"
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => document.getElementById("spare-detail-image-upload")?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Image"}
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

            {/* Practice Mode Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-1.5">
                <FlaskConical className="h-4 w-4 text-amber-500" />
                <div>
                  <span className="text-xs font-medium">Practice Mode</span>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {practiceMode ? "Using demo suppliers" : "Using real suppliers"}
                  </p>
                </div>
              </div>
              <Switch
                checked={practiceMode}
                onCheckedChange={setPracticeMode}
              />
            </div>

            {/* Practice Supplier Selector — shown on left when practice mode is active */}
            {practiceMode && (
              <div className="space-y-1 border border-amber-500/30 rounded-lg p-3 bg-amber-500/5">
                <SupplierSelector
                  category={localSpare.category}
                  currentPreferredSupplier={localSpare.preferred_supplier}
                  onSelectSupplier={(name) => {
                    handleFieldChange("preferred_supplier", name);
                    if (spare) onUpdate(spare.id, { preferred_supplier: name });
                  }}
                  spareId={spare?.id}
                  partDescription={localSpare.description}
                  partNumber={localSpare.part_number || undefined}
                  imageUrl={localSpare.image_urls?.[0] || undefined}
                  quantity={localSpare.qty_on_hand ?? undefined}
                  specifications={localSpare.specifications || undefined}
                  practiceMode={true}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs mt-1"
                  onClick={() => setShowQuoteComparison(true)}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  View Quote History
                </Button>
              </div>
            )}

            {/* Generated Images Gallery */}
            {generatedImages.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs">Generated Images (click to add)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {generatedImages.map((url, idx) => {
                    const isSelected = selectedGeneratedIndex === idx;
                    const currentUrls = localSpare.image_urls || [];
                    const isAlreadyAdded = currentUrls.includes(url);
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
            {/* Description */}
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={localSpare.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                onBlur={() => handleFieldBlur("description")}
                className="min-h-[60px] text-sm"
              />
            </div>

            {/* Auto-Assigned Category Section */}
            <div className="space-y-1.5 border border-primary/20 bg-primary/5 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Auto-Assigned Category</Label>
                {(() => {
                  const suggested = classifyCategory(localSpare.description);
                  const current = localSpare.category || "";
                  const match = current === suggested;
                  return (
                    <Badge variant="outline" className={`text-[10px] ${match ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"}`}>
                      {match ? "✓ Confirmed" : "⚠ Review"}
                    </Badge>
                  );
                })()}
              </div>
              {(() => {
                const suggested = classifyCategory(localSpare.description);
                const current = localSpare.category || "";
                return (
                  <>
                    {current !== suggested && (
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-muted-foreground">Suggested:</span>
                        <Badge variant="outline" className={`text-[10px] cursor-pointer hover:opacity-80 ${getCategoryColor(suggested)}`}
                          onClick={() => {
                            handleFieldChange("category", suggested);
                            if (spare) onUpdate(spare.id, { category: suggested });
                          }}
                        >
                          {suggested} — click to apply
                        </Badge>
                      </div>
                    )}
                    <Select
                      value={current}
                      onValueChange={(val) => {
                        handleFieldChange("category", val);
                        if (spare) onUpdate(spare.id, { category: val });
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {getAllCategories().map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            <span className="flex items-center gap-2">
                              <span className={`inline-block w-2 h-2 rounded-full ${getCategoryColor(cat).split(" ")[0]}`} />
                              {cat}
                              {cat === suggested && " ★"}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                );
              })()}
            </div>

            {/* Supplier / Mfr */}
            <div className="space-y-1">
              <Label className="text-xs">Supplier / Mfr</Label>
              <Input
                value={localSpare.manufacturer || ""}
                onChange={(e) => handleFieldChange("manufacturer", e.target.value)}
                onBlur={() => handleFieldBlur("manufacturer")}
                className="h-8 text-sm"
              />
            </div>

            {/* Asset Tag */}
            <div className="space-y-1">
              <Label className="text-xs">Asset / System</Label>
              <Input
                value={localSpare.asset_tag || ""}
                onChange={(e) => handleFieldChange("asset_tag", e.target.value)}
                onBlur={() => handleFieldBlur("asset_tag")}
                className="h-8 text-sm"
              />
            </div>

            {/* Supplier Matching Section — dimmed when practice mode is on */}
            <div className={`border-t pt-3 mt-3 transition-all ${practiceMode ? "opacity-30 pointer-events-none select-none" : ""}`}>
              {practiceMode && (
                <p className="text-[10px] text-muted-foreground italic mb-2">
                  Disabled — practice mode is active on the left panel.
                </p>
              )}
              <SupplierSelector
                category={localSpare.category}
                currentPreferredSupplier={localSpare.preferred_supplier}
                onSelectSupplier={(name) => {
                  handleFieldChange("preferred_supplier", name);
                  if (spare) onUpdate(spare.id, { preferred_supplier: name });
                }}
                spareId={spare?.id}
                partDescription={localSpare.description}
                partNumber={localSpare.part_number || undefined}
                imageUrl={localSpare.image_urls?.[0] || undefined}
                quantity={localSpare.qty_on_hand ?? undefined}
                specifications={localSpare.specifications || undefined}
              />
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs mt-1"
                onClick={() => setShowQuoteComparison(true)}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                View Quote History
              </Button>
              <QuoteComparisonDialog
                open={showQuoteComparison}
                onOpenChange={setShowQuoteComparison}
                spareId={spare?.id}
                partDescription={localSpare.description}
              />
            </div>

            {/* Specifications & OEM */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Size / Specs</Label>
                <Input
                  value={localSpare.specifications || ""}
                  onChange={(e) => handleFieldChange("specifications", e.target.value)}
                  onBlur={() => handleFieldBlur("specifications")}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">OEM Part #</Label>
                <Input
                  value={localSpare.oem_part_number || ""}
                  onChange={(e) => handleFieldChange("oem_part_number", e.target.value)}
                  onBlur={() => handleFieldBlur("oem_part_number")}
                  className="h-8 text-sm font-mono"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Warehouse Area</Label>
                <Select
                  value={localSpare.warehouse_area || ""}
                  onValueChange={(val) => {
                    handleFieldChange("warehouse_area", val);
                    if (spare) onUpdate(spare.id, { warehouse_area: val });
                  }}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {WAREHOUSE_LOCATIONS.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Bin Location</Label>
                <Input
                  value={localSpare.bin_location || ""}
                  onChange={(e) => handleFieldChange("bin_location", e.target.value)}
                  onBlur={() => handleFieldBlur("bin_location")}
                  className="h-8 text-sm font-mono"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select
                value={localSpare.status || "Active"}
                onValueChange={(val) => {
                  handleFieldChange("status", val);
                  if (spare) onUpdate(spare.id, { status: val });
                }}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Inventory Section */}
            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium text-sm mb-2">Inventory & Pricing</h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Qty</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localSpare.qty_on_hand ?? 0}
                    onChange={(e) => handleFieldChange("qty_on_hand", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("qty_on_hand")}
                    className="h-7 text-sm text-center"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Min</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localSpare.min_qty ?? 0}
                    onChange={(e) => handleFieldChange("min_qty", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("min_qty")}
                    className="h-7 text-sm text-center"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Max</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localSpare.max_qty ?? 0}
                    onChange={(e) => handleFieldChange("max_qty", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("max_qty")}
                    className="h-7 text-sm text-center"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Lead (days)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localSpare.lead_time_days ?? 0}
                    onChange={(e) => handleFieldChange("lead_time_days", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("lead_time_days")}
                    className="h-7 text-sm text-center"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Unit Cost ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={localSpare.unit_cost ?? 0}
                    onChange={(e) => handleFieldChange("unit_cost", parseFloat(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("unit_cost")}
                    className="h-7 text-sm"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[10px]">Reorder Point</Label>
                  <Input
                    type="number"
                    min="0"
                    value={localSpare.reorder_point ?? 0}
                    onChange={(e) => handleFieldChange("reorder_point", parseInt(e.target.value) || 0)}
                    onBlur={() => handleFieldBlur("reorder_point")}
                    className="h-7 text-sm text-center"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Textarea
                value={localSpare.notes || ""}
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
                  Delete Item
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove "{localSpare.description}" from the inventory.
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
