import { useState, useRef, useCallback } from "react";
 import { supabase } from "@/integrations/supabase/client";
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
import { getEdgeFunctionErrorMessage } from "@/utils/getEdgeFunctionErrorMessage";
 import { ImageIcon, X, Sparkles, Loader2, Check } from "lucide-react";
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
 const [isGenerating, setIsGenerating] = useState(false);
 const [generatedImages, setGeneratedImages] = useState<{ url: string; tempId: string }[]>([]);
 const [selectedGeneratedUrl, setSelectedGeneratedUrl] = useState<string | null>(null);

  const resetForm = () => {
    setPartName("");
    setNotes("");
    setIsDragOver(false);
    setPreviewImage(null);
    setPreviewUrl(null);
     setIsGenerating(false);
     setGeneratedImages([]);
     setSelectedGeneratedUrl(null);
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
     setSelectedGeneratedUrl(null);
  };
 
 const handleGenerateImage = async () => {
   if (!partName.trim()) {
     toast({
       title: "Description required",
       description: "Enter a part description before generating an image",
       variant: "destructive",
     });
     return;
   }
 
   setIsGenerating(true);
   const tempId = `temp-${Date.now()}`;
 
   try {
      const { data, error, response } = await supabase.functions.invoke("generate-part-image", {
       body: { partName: partName.trim(), partId: tempId },
     });
 
     if (error) {
       console.error("Generation error:", error);
        const msg = await getEdgeFunctionErrorMessage({ error, response: response as any });
       toast({
         title: "Generation failed",
          description: msg,
         variant: "destructive",
       });
       return;
     }
 
     if (data?.error) {
       toast({
         title: "Generation failed",
         description: data.error,
         variant: "destructive",
       });
       return;
     }
 
     if (data?.imageUrl) {
       setGeneratedImages((prev) => [...prev, { url: data.imageUrl, tempId }]);
       // Auto-select if first image
       if (generatedImages.length === 0 && !previewUrl) {
         setSelectedGeneratedUrl(data.imageUrl);
       }
       toast({
         title: "Image generated!",
         description: "Click on an image to select it",
       });
     }
   } catch (err) {
     console.error("Generate image error:", err);
     toast({
       title: "Generation failed",
       description: "Failed to generate image",
       variant: "destructive",
     });
   } finally {
     setIsGenerating(false);
   }
 };
 
 const handleSelectGeneratedImage = (url: string) => {
   setSelectedGeneratedUrl(url);
   // Clear any manually uploaded preview
   if (previewUrl) {
     URL.revokeObjectURL(previewUrl);
     setPreviewUrl(null);
     setPreviewImage(null);
   }
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
       image_urls: selectedGeneratedUrl ? [selectedGeneratedUrl] : [],
    });

     if (result && previewImage && onAddImage && !selectedGeneratedUrl) {
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
            
             {previewUrl || selectedGeneratedUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                <img
                   src={previewUrl || selectedGeneratedUrl || ""}
                  alt="Preview"
                   className="w-full h-full object-contain bg-background p-2"
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
                 {selectedGeneratedUrl && (
                   <span className="absolute bottom-2 left-2 text-xs bg-primary/80 text-primary-foreground px-2 py-0.5 rounded">
                     AI Generated
                   </span>
                 )}
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
 
             {/* Generate Button */}
             <Button
               type="button"
               variant="outline"
               size="sm"
               className="w-full"
               onClick={handleGenerateImage}
               disabled={isGenerating || !partName.trim()}
             >
               {isGenerating ? (
                 <>
                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                   Generating...
                 </>
               ) : (
                 <>
                   <Sparkles className="h-4 w-4 mr-2" />
                   {generatedImages.length > 0 ? "Generate Another" : "Generate with AI"}
                 </>
               )}
             </Button>
 
             {/* Generated Images Gallery */}
             {generatedImages.length > 0 && (
               <div className="space-y-2">
                 <Label className="text-xs">Generated Images (click to select)</Label>
                 <div className="grid grid-cols-3 gap-2">
                   {generatedImages.map((img, idx) => {
                     const isSelected = selectedGeneratedUrl === img.url;
                     return (
                       <div
                         key={img.tempId}
                         className={`relative aspect-square border rounded-lg overflow-hidden cursor-pointer transition-all ${
                           isSelected
                             ? "ring-2 ring-primary border-primary"
                             : "hover:ring-2 hover:ring-primary/50"
                         }`}
                         onClick={() => handleSelectGeneratedImage(img.url)}
                       >
                         <img
                           src={img.url}
                           alt={`Generated ${idx + 1}`}
                           className="w-full h-full object-contain bg-background p-1"
                         />
                         {isSelected && (
                           <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                             <Check className="h-5 w-5 text-primary" />
                           </div>
                         )}
                         <span className="absolute bottom-1 left-1 text-[10px] bg-background/80 px-1 rounded">
                           #{idx + 1}
                         </span>
                       </div>
                     );
                   })}
                 </div>
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
