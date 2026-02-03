import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Check, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type SiteSpareItem } from "@/hooks/useSiteSpares";

interface OrphanedImage {
  name: string;
  url: string;
  created_at: string;
}

interface OrphanedImageRecoveryProps {
  spares: SiteSpareItem[];
  onImageAssigned: () => void;
}

export const OrphanedImageRecovery = ({ spares, onImageAssigned }: OrphanedImageRecoveryProps) => {
  const [orphanedImages, setOrphanedImages] = useState<OrphanedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<OrphanedImage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [assigning, setAssigning] = useState(false);
  const { toast } = useToast();

  // Get the set of image URLs already assigned to site_spares
  const assignedUrls = new Set(
    spares.flatMap(s => s.image_urls || [])
  );

  useEffect(() => {
    fetchOrphanedImages();
  }, []);

  const fetchOrphanedImages = async () => {
    setLoading(true);
    try {
      // List all files in the visual-parts-images bucket
      const { data: allFiles, error } = await supabase.storage
        .from("visual-parts-images")
        .list("", { limit: 500, sortBy: { column: "created_at", order: "desc" } });

      if (error) throw error;

      // Get files from subfolders (each image is in a UUID folder)
      const images: OrphanedImage[] = [];
      
      for (const folder of allFiles || []) {
        if (folder.id === null) {
          // This is a folder, list its contents
          const { data: files } = await supabase.storage
            .from("visual-parts-images")
            .list(folder.name, { limit: 10 });
          
          for (const file of files || []) {
            if (file.name && !file.name.startsWith('.')) {
              const path = `${folder.name}/${file.name}`;
              const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/visual-parts-images/${path}`;
              
              // Only include if NOT already assigned to a site spare
              if (!assignedUrls.has(url)) {
                images.push({
                  name: path,
                  url,
                  created_at: file.created_at || "",
                });
              }
            }
          }
        }
      }

      setOrphanedImages(images);
    } catch (err) {
      console.error("Error fetching orphaned images:", err);
      toast({
        title: "Error",
        description: "Failed to load orphaned images.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSpares = spares.filter(spare => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      spare.description.toLowerCase().includes(query) ||
      spare.part_number?.toLowerCase().includes(query) ||
      spare.manufacturer?.toLowerCase().includes(query) ||
      spare.oem_part_number?.toLowerCase().includes(query)
    );
  });

  const handleAssignImage = async (spare: SiteSpareItem) => {
    if (!selectedImage) return;
    
    setAssigning(true);
    try {
      const newImageUrls = [...(spare.image_urls || []), selectedImage.url];
      
      const { error } = await supabase
        .from("site_spares")
        .update({ image_urls: newImageUrls })
        .eq("id", spare.id);

      if (error) throw error;

      toast({
        title: "Image Assigned",
        description: `Image linked to "${spare.description.substring(0, 40)}..."`,
      });

      // Remove from orphaned list
      setOrphanedImages(prev => prev.filter(img => img.url !== selectedImage.url));
      setSelectedImage(null);
      onImageAssigned();
    } catch (err) {
      console.error("Error assigning image:", err);
      toast({
        title: "Error",
        description: "Failed to assign image.",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleSkipImage = () => {
    if (!selectedImage) return;
    // Move to next image
    const currentIndex = orphanedImages.findIndex(img => img.url === selectedImage.url);
    if (currentIndex < orphanedImages.length - 1) {
      setSelectedImage(orphanedImages[currentIndex + 1]);
    } else {
      setSelectedImage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading orphaned images...</span>
      </div>
    );
  }

  if (orphanedImages.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Orphaned Images</h3>
        <p className="text-muted-foreground">All storage images are already assigned to parts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-medium text-amber-900 flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Recovery Tool
        </h3>
        <p className="text-sm text-amber-700 mt-1">
          Found <strong>{orphanedImages.length}</strong> orphaned images in storage.
          Select an image, then search for and assign it to the correct site spare.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Orphaned Images */}
        <div className="space-y-4">
          <h4 className="font-medium">Orphaned Images ({orphanedImages.length})</h4>
          <ScrollArea className="h-[500px] border rounded-lg p-2">
            <div className="grid grid-cols-3 gap-2">
              {orphanedImages.map((img) => (
                <div
                  key={img.url}
                  onClick={() => setSelectedImage(img)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage?.url === img.url
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/30"
                  }`}
                >
                  <img
                    src={img.url}
                    alt="Orphaned part"
                    className="w-full h-20 object-contain bg-white p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Selected Image + Search */}
        <div className="space-y-4">
          {selectedImage ? (
            <>
              {/* Selected Image Preview */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={selectedImage.url}
                      alt="Selected part"
                      className="w-32 h-32 object-contain bg-white border rounded-lg p-2"
                    />
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">Selected Image</Badge>
                      <p className="text-xs text-muted-foreground break-all">
                        {selectedImage.name}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSkipImage}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Skip
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search & Assign */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search parts by description, part number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <ScrollArea className="h-[350px] border rounded-lg">
                  <div className="p-2 space-y-2">
                    {filteredSpares.slice(0, 50).map((spare) => (
                      <div
                        key={spare.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group"
                      >
                        {/* Existing image or placeholder */}
                        <div className="w-12 h-12 bg-muted rounded border flex-shrink-0 overflow-hidden">
                          {spare.image_urls?.[0] ? (
                            <img
                              src={spare.image_urls[0]}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {spare.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {spare.category} • {spare.manufacturer || "No manufacturer"}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleAssignImage(spare)}
                          disabled={assigning}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {assigning ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Assign
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                    
                    {filteredSpares.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No matching parts found
                      </p>
                    )}
                    
                    {filteredSpares.length > 50 && (
                      <p className="text-center text-muted-foreground text-sm py-2">
                        Showing first 50 results. Refine your search.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[450px] border rounded-lg bg-muted/20">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Select an image from the left to assign it
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
