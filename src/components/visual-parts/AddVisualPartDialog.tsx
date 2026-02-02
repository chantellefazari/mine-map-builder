import { useState, useRef, useCallback } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { getImageFileFromDataTransfer } from "@/utils/getImageFileFromDataTransfer";
import { ImageIcon, X } from "lucide-react";
import type { NewVisualPart } from "@/hooks/useVisualPartsCatalogue";

interface AddVisualPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (part: NewVisualPart) => Promise<any>;
  onAddImage?: (partId: string, file: File) => Promise<void>;
}

export const AddVisualPartDialog = ({
  open,
  onOpenChange,
  onAdd,
  onAddImage,
}: AddVisualPartDialogProps) => {
  const [partName, setPartName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setPartName("");
    setNotes("");
    setIsDragOver(false);
    setPreviewImage(null);
    setPreviewUrl(null);
  };

  const setPreviewFromFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please use an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please use an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [previewUrl, toast]
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewFromFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = getImageFileFromDataTransfer(e.dataTransfer);
      if (file) {
        setPreviewFromFile(file);
        return;
      }

      toast({
        title: "No image file detected",
        description:
          "Please drag an image file from your computer (Explorer/Finder). Dragging from a webpage often doesn't include a file.",
        variant: "destructive",
      });
    },
    [setPreviewFromFile, toast]
  );

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName.trim()) return;

    setSaving(true);
    
    // Auto-generate site part number (timestamp-based for now)
    const autoPartNumber = `TMP-${Date.now().toString(36).toUpperCase()}`;
    
    const result = await onAdd({
      site_part_number: autoPartNumber,
      part_name: partName.trim(),
      category: "General",
      associated_asset: "",
      criticality: "Non-Critical",
      notes: notes.trim(),
      supplier: "",
      image_urls: [],
    });

    if (result && previewImage && onAddImage) {
      await onAddImage(result.id, previewImage);
    }

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
            Add a description and photo. You can fill in other details later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            
            {previewUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className={`aspect-video rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors ${
                  isDragOver ? "ring-2 ring-primary ring-inset bg-primary/10" : ""
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
              >
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Drag & drop or click to add photo
                </span>
              </div>
            )}
          </div>

          {/* Part Description */}
          <div className="space-y-2">
            <Label htmlFor="partName">Description *</Label>
            <Input
              id="partName"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              placeholder="e.g. Mill Discharge Pump Impeller"
              required
            />
          </div>

          {/* Notes (optional) */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional info..."
              className="min-h-[60px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !partName.trim()}>
              {saving ? "Adding..." : "Add Part"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
