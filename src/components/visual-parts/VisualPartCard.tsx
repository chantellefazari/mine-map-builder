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
import { ImageIcon, Trash2, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { VisualPart } from "@/hooks/useVisualPartsCatalogue";
import { PART_CATEGORIES, CRITICALITY_LEVELS, getCriticalityColor } from "./visualPartsConstants";

interface VisualPartCardProps {
  part: VisualPart;
  onUpdate: (id: string, updates: Partial<VisualPart>) => void;
  onDelete: (id: string) => void;
  onAddImage: (partId: string, file: File) => void;
  onRemoveImage: (partId: string, imageUrl: string) => void;
}

export const VisualPartCard = ({
  part,
  onUpdate,
  onDelete,
  onAddImage,
  onRemoveImage,
}: VisualPartCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onAddImage(part.id, file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onAddImage(part.id, file);
      }
    },
    [part.id, onAddImage]
  );

  const nextImage = () => {
    if (part.image_urls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % part.image_urls.length);
    }
  };

  const prevImage = () => {
    if (part.image_urls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? part.image_urls.length - 1 : prev - 1
      );
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Image Section */}
      <div
        className={`relative aspect-[4/3] bg-white cursor-pointer ${
          isDragOver ? "ring-2 ring-primary ring-inset bg-primary/10" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
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
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Image navigation */}
            {part.image_urls.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {part.image_urls.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            {/* Remove current image button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 opacity-80"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveImage(part.id, part.image_urls[currentImageIndex]);
                setCurrentImageIndex(0);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2" />
            <span className="text-sm">Drop image or click to upload</span>
          </div>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Part Number + Criticality Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {part.site_part_number.startsWith("TMP-") ? "000000" : part.site_part_number}
          </Badge>
          <Badge className={getCriticalityColor(part.criticality)}>
            {part.criticality}
          </Badge>
        </div>

        {/* Part Name */}
        <Textarea
          value={part.part_name}
          onChange={(e) => onUpdate(part.id, { part_name: e.target.value })}
          className="font-semibold text-sm min-h-[60px] resize-none"
          placeholder="Part Name"
        />

        {/* Category */}
        <Select
          value={part.category}
          onValueChange={(val) => onUpdate(part.id, { category: val })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {PART_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Supplier */}
        <Input
          value={part.supplier || ""}
          onChange={(e) => onUpdate(part.id, { supplier: e.target.value })}
          placeholder="Supplier"
          className="text-xs h-8"
        />

        {/* Associated Asset */}
        <Input
          value={part.associated_asset}
          onChange={(e) => onUpdate(part.id, { associated_asset: e.target.value })}
          placeholder="Asset / System"
          className="text-xs h-8"
        />

        {/* Criticality */}
        <Select
          value={part.criticality}
          onValueChange={(val) => onUpdate(part.id, { criticality: val })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Criticality" />
          </SelectTrigger>
          <SelectContent>
            {CRITICALITY_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Notes */}
        <Textarea
          value={part.notes}
          onChange={(e) => onUpdate(part.id, { notes: e.target.value })}
          placeholder="Notes..."
          className="text-xs min-h-[50px]"
        />

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Part
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this part?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove "{part.part_name}" ({part.site_part_number}) 
                and all associated images from the Visual Parts Catalogue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => onDelete(part.id)}
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
