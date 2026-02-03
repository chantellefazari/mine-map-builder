import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { NewVisualPart, VisualPart } from "@/hooks/useVisualPartsCatalogue";

function normalizePart(row: any): VisualPart {
  return {
    ...(row as VisualPart),
    // Backend types allow null; UI expects array/string.
    image_urls: (row?.image_urls ?? []) as string[],
    supplier: (row?.supplier ?? "") as string,
    associated_asset: (row?.associated_asset ?? "") as string,
    notes: (row?.notes ?? "") as string,
  };
}

export const useVisualPartsCatalogueSafe = () => {
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
      setLoading(false);
      return;
    }

    setParts(((data ?? []) as any[]).map(normalizePart));
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
      if ((error as any).code === "23505") {
        toast.error("A part with this Site Part Number already exists");
      } else {
        toast.error("Failed to add part");
      }
      return null;
    }

    const created = normalizePart(data);
    toast.success("Part added to Visual Catalogue");
    setParts((prev) =>
      [...prev, created].sort((a, b) => a.site_part_number.localeCompare(b.site_part_number))
    );
    return created;
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
      prev.map((p) =>
        p.id === id
          ? normalizePart({
              ...p,
              ...updates,
              image_urls: (updates as any).image_urls ?? p.image_urls,
            })
          : p
      )
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

    const { error } = await supabase.from("visual_parts_catalogue").delete().eq("id", id);

    if (error) {
      console.error("Error deleting part:", error);
      toast.error("Failed to delete part");
      return;
    }

    toast.success("Part removed from catalogue");
    setParts((prev) => prev.filter((p) => p.id !== id));
  };

  const uploadImage = async (partId: string, file: File): Promise<string | null> => {
    const fileExt = (
      file.name?.split(".").pop() ||
      file.type?.split("/").pop() ||
      "png"
    ).toLowerCase();

    const fileName = `${partId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("visual-parts-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

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

    // Key fix: read/update by partId, not by local state (avoids race after creating a part)
    const { data: current, error: currentErr } = await supabase
      .from("visual_parts_catalogue")
      .select("image_urls")
      .eq("id", partId)
      .single();

    if (currentErr) {
      console.error("Error reading part for image update:", currentErr);
      toast.error("Failed to save image");
      return;
    }

    const existingUrls = (current?.image_urls ?? []) as string[];
    const newImageUrls = [...existingUrls, imageUrl];

    const { error: updateErr } = await supabase
      .from("visual_parts_catalogue")
      .update({ image_urls: newImageUrls })
      .eq("id", partId);

    if (updateErr) {
      console.error("Error updating image urls:", updateErr);
      toast.error("Failed to save image");
      return;
    }

    // Update local state if the part is already present; otherwise just refetch.
    let found = false;
    setParts((prev) =>
      prev.map((p) => {
        if (p.id !== partId) return p;
        found = true;
        return { ...p, image_urls: newImageUrls };
      })
    );

    if (!found) {
      // Avoid a flash of loading; just refresh in the background.
      void fetchParts();
    }

    toast.success("Image added");
  };

  const removeImageFromPart = async (partId: string, imageUrl: string) => {
    const part = parts.find((p) => p.id === partId);
    if (!part) return;

    const path = imageUrl.split("/visual-parts-images/")[1];
    if (path) {
      await supabase.storage.from("visual-parts-images").remove([path]);
    }

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
