import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SiteSpareItem } from "@/hooks/useSiteSpares";
import { classifyCriticality, type CriticalityLevel } from "@/utils/criticalityClassification";

// Criticality badge colors
const criticalityColors: Record<CriticalityLevel, string> = {
  HIGH: "bg-destructive/20 text-destructive border-destructive/30",
  MEDIUM: "bg-warning/20 text-warning border-warning/30",
  LOW: "bg-success/20 text-success border-success/30",
};

interface SiteSpareCardProps {
  spare: SiteSpareItem;
  onClick: () => void;
  onUpdate: (id: string, updates: Partial<SiteSpareItem>) => void;
}

export const SiteSpareCard = ({
  spare,
  onClick,
  onUpdate,
}: SiteSpareCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageUrls = spare.image_urls || [];
  const criticality = classifyCriticality(spare.description);

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
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? imageUrls.length - 1 : prev - 1
      );
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
      onClick={onClick}
    >
      {/* Image Section */}
      <div
        className={`relative aspect-[4/3] bg-background ${
          isDragOver ? "ring-2 ring-primary ring-inset bg-primary/10" : ""
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
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
              className="absolute inset-0 w-full h-full object-contain p-1"
            />
            {imageUrls.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-80"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-80"
                  onClick={nextImage}
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
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full text-muted-foreground cursor-pointer"
            onClick={handleUploadClick}
          >
            <ImageIcon className="h-10 w-10 mb-1" />
            <span className="text-xs">Click or drop image</span>
          </div>
        )}
      </div>

      <CardContent className="p-2.5 space-y-1.5">
        {/* Part Number + Criticality Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="font-mono text-[10px] h-5">
            {spare.part_number || "000000"}
          </Badge>
          <Badge className={`text-[9px] h-4 px-1.5 ${criticalityColors[criticality]}`}>
            {criticality}
          </Badge>
        </div>

        {/* Description (truncated) */}
        <p className="font-medium text-xs line-clamp-2 leading-tight min-h-[2rem]">
          {spare.description}
        </p>

        {/* Category, Supplier & Asset */}
        <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
          <span className="truncate">{spare.category || "—"}</span>
          <span className="truncate">Supplier: {spare.manufacturer || "—"}</span>
          <span className="truncate">Asset/System: {spare.asset_tag || "—"}</span>
        </div>
      </CardContent>
    </Card>
  );
};
