import { useCallback, useEffect, useState } from "react";
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
  supplier: string;
  warehouse_area: string;
  bin_location: string;
  image_urls: string[];
  min_qty: number;
  max_qty: number;
  qty_in_stock: number;
  lead_time_days: number | null;
  unit_price: number | null;
  created_at: string;
  updated_at: string;
}

export type NewVisualPart = Omit<VisualPart, "id" | "created_at" | "updated_at">;

function normalizePart(row: any): VisualPart {
  return {
    id: row.id,
    site_part_number: row.site_part_number,
    part_name: row.part_name,
    category: row.category ?? "General",
    criticality: row.criticality ?? "Non-Critical",
    image_urls: (row.image_urls ?? []) as string[],
    supplier: (row.supplier ?? "") as string,
    warehouse_area: (row.warehouse_area ?? "") as string,
    bin_location: (row.bin_location ?? "") as string,
    associated_asset: (row.associated_asset ?? "") as string,
    notes: (row.notes ?? "") as string,
    min_qty: row.min_qty ?? 0,
    max_qty: row.max_qty ?? 0,
    qty_in_stock: row.qty_in_stock ?? 0,
    lead_time_days: row.lead_time_days ?? null,
    unit_price: row.unit_price ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
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

  const addPart = async (part: Partial<NewVisualPart>): Promise<VisualPart | null> => {
    const insertData = {
      site_part_number: part.site_part_number || `TMP-${Date.now()}`,
      part_name: part.part_name || "",
      category: part.category || "General",
      criticality: part.criticality || "Non-Critical",
      supplier: part.supplier || "",
      warehouse_area: part.warehouse_area || "",
      bin_location: part.bin_location || "",
      associated_asset: part.associated_asset || "",
      notes: part.notes || "",
      image_urls: part.image_urls || [],
      min_qty: part.min_qty ?? 0,
      max_qty: part.max_qty ?? 0,
      qty_in_stock: part.qty_in_stock ?? 0,
      lead_time_days: part.lead_time_days ?? null,
      unit_price: part.unit_price ?? null,
    };

    const { data, error } = await supabase
      .from("visual_parts_catalogue")
      .insert(insertData)
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
        p.id === id ? normalizePart({ ...p, ...updates }) : p
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

    let found = false;
    setParts((prev) =>
      prev.map((p) => {
        if (p.id !== partId) return p;
        found = true;
        return { ...p, image_urls: newImageUrls };
      })
    );

    if (!found) {
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
