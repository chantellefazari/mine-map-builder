import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ImageIcon, Upload } from "lucide-react";

interface CatalogueCardDropzoneProps {
  imageUrl: string;
  itemId: string;
  altText: string;
  onImageUpdate: (url: string) => void;
}

export const CatalogueCardDropzone = ({
  imageUrl,
  itemId,
  altText,
  onImageUpdate,
}: CatalogueCardDropzoneProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please drop an image file (JPG, PNG, etc.)",
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

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${itemId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("catalogue-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("catalogue-images")
        .getPublicUrl(fileName);

      onImageUpdate(urlData.publicUrl);

      toast({
        title: "Image uploaded",
        description: "Part photo updated successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [itemId, onImageUpdate, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleUpload(file);
    };
    input.click();
  };

  if (isUploading) {
    return (
      <div className="aspect-[4/3] bg-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={`aspect-[4/3] bg-muted cursor-pointer transition-all relative group ${
        isDragOver ? "ring-2 ring-primary ring-inset bg-primary/10" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-full object-cover"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-center">
              <Upload className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">Drop or click to replace</span>
            </div>
          </div>
        </>
      ) : (
        <div className={`w-full h-full flex flex-col items-center justify-center ${isDragOver ? "text-primary" : "text-muted-foreground/50"}`}>
          {isDragOver ? (
            <>
              <Upload className="h-10 w-10 mb-2" />
              <span className="text-xs">Drop image here</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 mb-2" />
              <span className="text-xs">Drag image or click</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
