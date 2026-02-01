import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ImageIcon, Upload, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const isMac =
    typeof navigator !== "undefined" && /mac/i.test(navigator.platform || "");
  const pasteShortcut = isMac ? "Cmd" : "Ctrl";

  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPasteArmed, setIsPasteArmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pasteCatcherRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const getImageFileFromDataTransfer = useCallback((dt: DataTransfer | null): File | null => {
    if (!dt) return null;

    // Most common case: dragging a file from the OS file browser.
    if (dt.files && dt.files.length > 0) {
      const f = dt.files[0];
      return f && f.type?.startsWith("image/") ? f : null;
    }

    // Fallback (some browsers/sources expose items only).
    const items = Array.from(dt.items ?? []);
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const f = item.getAsFile();
        if (f) return f;
      }
    }

    return null;
  }, []);

  const handleUpload = useCallback(async (file: File) => {
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

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop() || "png";
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

  const armPaste = useCallback(() => {
    setIsPasteArmed(true);
    // Focus an actual editable element so Cmd/Ctrl+V reliably fires a paste event.
    // This avoids browser behavior where paste won't fire if nothing editable is focused.
    pasteCatcherRef.current?.focus();
  }, []);

  const disarmPaste = useCallback(() => {
    setIsPasteArmed(false);
  }, []);

  const handlePasteFromCatcher = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (!isPasteArmed) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await handleUpload(file);
          }
          // Clear the catcher so it stays "empty".
          e.currentTarget.value = "";
          return;
        }
      }

      // If user pasted non-image content while armed, give a gentle hint.
      toast({
        title: "No image in clipboard",
        description: "Copy an image (not a file path/text), then paste again.",
        variant: "destructive",
      });
    },
    [handleUpload, isPasteArmed, toast],
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = getImageFileFromDataTransfer(e.dataTransfer);
    if (file) {
      void handleUpload(file);
      return;
    }

    toast({
      title: "No image file detected",
      description:
        "Please drag an image file from your computer (Explorer/Finder). Dragging from a webpage often doesn't provide a file.",
      variant: "destructive",
    });
  }, [getImageFileFromDataTransfer, handleUpload, toast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleBrowse = () => {
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
      ref={containerRef}
      className={`aspect-[4/3] bg-muted cursor-pointer transition-all relative group outline-none ${
        isDragOver ? "ring-2 ring-primary ring-inset bg-primary/10" : ""
      } ${isHovered ? "ring-2 ring-primary/50 ring-inset" : ""}`}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={armPaste}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        disarmPaste();
      }}
    >
      {/*
        Hidden paste catcher:
        Browsers typically only fire the paste event to a focused editable element.
        We focus this when the user clicks the photo area, then Cmd/Ctrl+V works.
      */}
      <textarea
        ref={pasteCatcherRef}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 opacity-0 pointer-events-none"
        defaultValue=""
        onChange={() => {
          // noop (we only use this element to capture paste events)
        }}
        onPaste={handlePasteFromCatcher}
      />

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
              <span className="text-xs">
                Click then {pasteShortcut}+V
              </span>
              <div className="mt-2 flex justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBrowse();
                  }}
                >
                  Browse file…
                </Button>
              </div>
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
          ) : isHovered ? (
            <>
              <Clipboard className="h-10 w-10 mb-2" />
              <span className="text-xs">
                Click then {pasteShortcut}+V
              </span>
              <div className="mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBrowse();
                  }}
                >
                  Browse file…
                </Button>
              </div>
            </>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 mb-2" />
              <span className="text-xs">Drag, paste, or click</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
