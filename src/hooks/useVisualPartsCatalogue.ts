import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VisualPart {
  id: string;
  site_part_number: string;
  part_name: string;
  category: string;
  associated_asset: string;
  criticality: string;
  notes: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export type NewVisualPart = Omit<VisualPart, "id" | "created_at" | "updated_at">;

export const useVisualPartsCatalogue = () => {
  const [parts, setParts] = useState<VisualPart[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("visual_parts_catalogue")
      .select("*")
      .order("site_part_number", { ascending: true });

    if (error) {
      console.error("Error fetching visual parts:", error);
      toast.error("Failed to load visual parts catalogue");
    } else {
      setParts((data as VisualPart[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  const addPart = async (part: NewVisualPart): Promise<VisualPart | null> => {
    const { data, error } = await supabase
      .from("visual_parts_catalogue")
      .insert(part)
      .select()
      .single();

    if (error) {
      console.error("Error adding part:", error);
      if (error.code === "23505") {
        toast.error("A part with this Site Part Number already exists");
      } else {
        toast.error("Failed to add part");
      }
      return null;
    }

    toast.success("Part added to Visual Catalogue");
    setParts((prev) => [...prev, data as VisualPart].sort((a, b) => 
      a.site_part_number.localeCompare(b.site_part_number)
    ));
    return data as VisualPart;
  };

  const updatePart = async (id: string, updates: Partial<VisualPart>) => {
    const { error } = await supabase
      .from("visual_parts_catalogue")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating part:", error);
      toast.error("Failed to update part");
      return;
    }

    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePart = async (id: string) => {
    const part = parts.find((p) => p.id === id);
    
    // Delete associated images from storage
    if (part && part.image_urls.length > 0) {
      for (const url of part.image_urls) {
        const path = url.split("/visual-parts-images/")[1];
        if (path) {
          await supabase.storage.from("visual-parts-images").remove([path]);
        }
      }
    }

    const { error } = await supabase
      .from("visual_parts_catalogue")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting part:", error);
      toast.error("Failed to delete part");
      return;
    }

    toast.success("Part removed from catalogue");
    setParts((prev) => prev.filter((p) => p.id !== id));
  };

  const uploadImage = async (partId: string, file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${partId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("visual-parts-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("visual-parts-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const addImageToPart = async (partId: string, file: File) => {
    const imageUrl = await uploadImage(partId, file);
    if (!imageUrl) return;

    // Fetch the current part from DB to get accurate image_urls (handles race condition with new parts)
    const { data: currentPart } = await supabase
      .from("visual_parts_catalogue")
      .select("image_urls")
      .eq("id", partId)
      .single();

    const existingUrls = currentPart?.image_urls || [];
    const newImageUrls = [...existingUrls, imageUrl];
    
    const { error } = await supabase
      .from("visual_parts_catalogue")
      .update({ image_urls: newImageUrls })
      .eq("id", partId);

    if (error) {
      console.error("Error updating image urls:", error);
      toast.error("Failed to save image");
      return;
    }

    // Update local state
    setParts((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, image_urls: newImageUrls } : p))
    );
    toast.success("Image added");
  };

  const removeImageFromPart = async (partId: string, imageUrl: string) => {
    const part = parts.find((p) => p.id === partId);
    if (!part) return;

    // Remove from storage
    const path = imageUrl.split("/visual-parts-images/")[1];
    if (path) {
      await supabase.storage.from("visual-parts-images").remove([path]);
    }

    // Update database
    const newImageUrls = part.image_urls.filter((url) => url !== imageUrl);
    await updatePart(partId, { image_urls: newImageUrls });
    toast.success("Image removed");
  };

  return {
    parts,
    loading,
    addPart,
    updatePart,
    deletePart,
    addImageToPart,
    removeImageFromPart,
    refetch: fetchParts,
  };
};
