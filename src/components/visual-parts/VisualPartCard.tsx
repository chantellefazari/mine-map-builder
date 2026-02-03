import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VisualPart } from "@/hooks/useVisualPartsCatalogueSafe";
import { getCriticalityColor } from "./visualPartsConstants";

interface VisualPartCardProps {
  part: VisualPart;
  onClick: () => void;
  onAddImage: (partId: string, file: File) => void;
}

export const VisualPartCard = ({
  part,
  onClick,
  onAddImage,
}: VisualPartCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onAddImage(part.id, file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onAddImage(part.id, file);
      }
    },
    [part.id, onAddImage]
  );

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (part.image_urls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % part.image_urls.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (part.image_urls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? part.image_urls.length - 1 : prev - 1
      );
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid opening if clicking on image navigation
    onClick();
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div
        className={`relative aspect-[4/3] bg-background ${
          isDragOver ? "ring-2 ring-primary ring-inset bg-primary/10" : ""
        }`}
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
          onChange={handleImageUpload}
        />

        {part.image_urls.length > 0 ? (
          <>
            <img
              src={part.image_urls[currentImageIndex]}
              alt={part.part_name}
              className="absolute inset-0 w-full h-full object-contain p-1"
            />
            {/* Image navigation */}
            {part.image_urls.length > 1 && (
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
                  {part.image_urls.map((_, idx) => (
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
            {part.site_part_number.startsWith("TMP-") ? "000000" : part.site_part_number}
          </Badge>
          <Badge className={`text-[9px] h-4 px-1.5 ${getCriticalityColor(part.criticality)}`}>
            {part.criticality === "Non-Critical" ? "Low" : part.criticality}
          </Badge>
        </div>

        {/* Part Name (truncated) */}
        <p className="font-medium text-xs line-clamp-2 leading-tight min-h-[2rem]">
          {part.part_name}
        </p>

        {/* Category, Supplier & Asset */}
        <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
          <span className="truncate">{part.category}</span>
          <span className="truncate">Supplier: {part.supplier || "—"}</span>
          <span className="truncate">Asset/System: {part.associated_asset || "—"}</span>
        </div>
      </CardContent>
    </Card>
  );
};
