import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, Plus, Trash2, Loader2, X, Upload } from "lucide-react";
import { toast } from "sonner";

interface SpareImageCellProps {
  spareId: string;
  imageUrls: string[];
  spareName: string;
  onImagesChange: (urls: string[]) => void;
}

export const SpareImageCell = ({
  spareId,
  imageUrls,
  spareName,
  onImagesChange,
}: SpareImageCellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image under 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = (
        file.name?.split(".").pop() ||
        file.type?.split("/").pop() ||
        "png"
      ).toLowerCase();

      const fileName = `site-spares/${spareId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("visual-parts-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("visual-parts-images")
        .getPublicUrl(fileName);

      const newUrls = [...imageUrls, urlData.publicUrl];
      onImagesChange(newUrls);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async (urlToRemove: string) => {
    try {
      const path = urlToRemove.split("/visual-parts-images/")[1];
      if (path) {
        await supabase.storage.from("visual-parts-images").remove([path]);
      }

      const newUrls = imageUrls.filter((url) => url !== urlToRemove);
      onImagesChange(newUrls);
      toast.success("Image removed");
    } catch (error) {
      console.error("Remove error:", error);
      // Still update URLs even if storage delete fails
      const newUrls = imageUrls.filter((url) => url !== urlToRemove);
      onImagesChange(newUrls);
    }
  };

  const imageCount = imageUrls.length;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 relative"
        onClick={() => setIsOpen(true)}
      >
        {imageCount > 0 ? (
          <div className="relative">
            <img
              src={imageUrls[0]}
              alt=""
              className="h-6 w-6 object-cover rounded"
            />
            {imageCount > 1 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-3.5 w-3.5 flex items-center justify-center">
                {imageCount}
              </span>
            )}
          </div>
        ) : (
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Photos - {spareName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Grid */}
            {imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative group border rounded-lg overflow-hidden bg-muted"
                  >
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={url}
                        alt={`${spareName} photo ${index + 1}`}
                        className="object-contain w-full h-full"
                      />
                    </AspectRatio>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(url)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No photos attached yet</p>
              </div>
            )}

            {/* Upload Button */}
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload photo (JPG, PNG up to 5MB)
                  </span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
