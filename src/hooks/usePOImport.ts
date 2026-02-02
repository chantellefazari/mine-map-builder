import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cleanDescription, isNoiseRow, extractPartNumbers } from "@/utils/descriptionCleaner";
import { generateSmartDuplicateKey, extractCorePart } from "@/utils/corePartExtractor";

export interface POUpload {
  id: string;
  supplierName: string;
  category: string;
  dateRangeCovered: string;
  notes: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  processedAt: string | null;
  status: string;
}

export interface POLineItem {
  id: string;
  uploadId: string;
  poNumber: string;
  poDate: string | null;
  supplier: string;
  itemDescription: string;
  manufacturer: string;
  model: string;
  partNumber: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  extraReferences: string;
  rowIndex: number;
}

export interface NormalizedComponent {
  id: string;
  uploadId: string | null;
  componentType: string;
  manufacturer: string;
  model: string;
  partNumber: string;
  descriptionCleaned: string;
  supplier: string;
  lastOrderedDate: string | null;
  lastOrderedPo: string;
  lastUnitPrice: number;
  totalOrdersInPeriod: number;
  totalQtyOrdered: number;
  totalSpend: number;
  notes: string;
  reviewFlag: boolean;
  aliasDescriptions: string;
  linkedAsset: string;
  duplicateKey: string;
  isMaster: boolean;
}

export const poCategories = [
  "Pumps",
  "Valves",
  "Gearboxes",
  "Motors",
  "Bearings/Seals",
  "Instruments",
  "Electrical",
  "Other",
];

export const componentTypes = [
  "Pump",
  "Motor",
  "Gearbox",
  "Valve",
  "Instrument",
  "Bearing",
  "Seal",
  "Electrical",
  "Filter",
  "Other",
];

export const usePOImport = () => {
  const [uploads, setUploads] = useState<POUpload[]>([]);
  const [lineItems, setLineItems] = useState<POLineItem[]>([]);
  const [normalizedComponents, setNormalizedComponents] = useState<NormalizedComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUploads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("po_uploads")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((row: any) => ({
        id: row.id,
        supplierName: row.supplier_name,
        category: row.category,
        dateRangeCovered: row.date_range_covered,
        notes: row.notes,
        fileName: row.file_name,
        fileType: row.file_type,
        uploadedAt: row.uploaded_at,
        processedAt: row.processed_at,
        status: row.status,
      }));
      setUploads(mapped);
    } catch (error) {
      console.error("Error fetching uploads:", error);
      toast({
        title: "Error",
        description: "Failed to load PO uploads",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchLineItems = useCallback(async (uploadId?: string) => {
    try {
      let query = supabase
        .from("po_line_items")
        .select("*")
        .order("row_index", { ascending: true });

      if (uploadId) {
        query = query.eq("upload_id", uploadId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const mapped = (data || []).map((row: any) => ({
        id: row.id,
        uploadId: row.upload_id,
        poNumber: row.po_number,
        poDate: row.po_date,
        supplier: row.supplier,
        itemDescription: row.item_description,
        manufacturer: row.manufacturer,
        model: row.model,
        partNumber: row.part_number,
        qty: Number(row.qty) || 0,
        unitPrice: Number(row.unit_price) || 0,
        totalPrice: Number(row.total_price) || 0,
        extraReferences: row.extra_references,
        rowIndex: row.row_index,
      }));
      setLineItems(mapped);
    } catch (error) {
      console.error("Error fetching line items:", error);
    }
  }, []);

  const fetchNormalizedComponents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("normalized_components")
        .select("*")
        .eq("is_master", true)
        .order("last_ordered_date", { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((row: any) => ({
        id: row.id,
        uploadId: row.upload_id,
        componentType: row.component_type,
        manufacturer: row.manufacturer,
        model: row.model,
        partNumber: row.part_number,
        descriptionCleaned: row.description_cleaned,
        supplier: row.supplier,
        lastOrderedDate: row.last_ordered_date,
        lastOrderedPo: row.last_ordered_po,
        lastUnitPrice: Number(row.last_unit_price) || 0,
        totalOrdersInPeriod: row.total_orders_in_period,
        totalQtyOrdered: Number(row.total_qty_ordered) || 0,
        totalSpend: Number(row.total_spend) || 0,
        notes: row.notes,
        reviewFlag: row.review_flag,
        aliasDescriptions: row.alias_descriptions,
        linkedAsset: row.linked_asset,
        duplicateKey: row.duplicate_key,
        isMaster: row.is_master,
      }));
      setNormalizedComponents(mapped);
    } catch (error) {
      console.error("Error fetching normalized components:", error);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchUploads(), fetchLineItems(), fetchNormalizedComponents()]);
    setIsLoading(false);
  }, [fetchUploads, fetchLineItems, fetchNormalizedComponents]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createUpload = async (upload: Omit<POUpload, "id" | "uploadedAt" | "processedAt" | "status">): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from("po_uploads")
        .insert({
          supplier_name: upload.supplierName,
          category: upload.category,
          date_range_covered: upload.dateRangeCovered,
          notes: upload.notes,
          file_name: upload.fileName,
          file_type: upload.fileType,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      await fetchUploads();
      return data.id;
    } catch (error) {
      console.error("Error creating upload:", error);
      toast({
        title: "Error",
        description: "Failed to create upload record",
        variant: "destructive",
      });
      return null;
    }
  };

  const addLineItems = async (uploadId: string, items: Omit<POLineItem, "id" | "uploadId">[]): Promise<boolean> => {
    try {
      const insertData = items.map((item, index) => ({
        upload_id: uploadId,
        po_number: item.poNumber,
        po_date: item.poDate || null,
        supplier: item.supplier,
        item_description: item.itemDescription,
        manufacturer: item.manufacturer,
        model: item.model,
        part_number: item.partNumber,
        qty: item.qty,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        extra_references: item.extraReferences,
        row_index: index,
      }));

      const { error } = await supabase.from("po_line_items").insert(insertData);

      if (error) throw error;

      await fetchLineItems(uploadId);
      return true;
    } catch (error) {
      console.error("Error adding line items:", error);
      toast({
        title: "Error",
        description: "Failed to add PO line items",
        variant: "destructive",
      });
      return false;
    }
  };

  const normalizeAndDeduplicate = async (uploadId: string, supplierName: string): Promise<{ success: boolean; newCount: number; duplicateCount: number; totalLines: number }> => {
    try {
      // Fetch line items for this upload
      const { data: lineItemsData, error: lineError } = await supabase
        .from("po_line_items")
        .select("*")
        .eq("upload_id", uploadId);

      if (lineError) throw lineError;

      // Fetch existing normalized components
      const { data: existingComponents, error: existingError } = await supabase
        .from("normalized_components")
        .select("*")
        .eq("is_master", true);

      if (existingError) throw existingError;

      const newComponents: any[] = [];
      let duplicateCount = 0;

      for (const item of lineItemsData || []) {
        const rawDescription = item.item_description?.trim() || "";
        
        // Skip noise rows (headers, totals, etc.)
        if (isNoiseRow(rawDescription)) {
          continue;
        }
        
        // Clean the description to remove lead times, pricing notes, etc.
        const description = cleanDescription(rawDescription);
        
        // Try to extract part number from description if not provided
        let partNumber = item.part_number?.trim() || "";
        if (!partNumber) {
          const extractedPNs = extractPartNumbers(rawDescription);
          if (extractedPNs.length > 0) {
            partNumber = extractedPNs[0];
          }
        }
        
        const manufacturer = item.manufacturer?.trim() || "";
        const model = item.model?.trim() || "";

        // Generate smart duplicate key using core part extraction
        // This strips asset-specific suffixes and focuses on model numbers/specs
        const duplicateKey = generateSmartDuplicateKey(partNumber, manufacturer, model, description);

        // Check for existing component with same key
        const existingMatch = existingComponents?.find(
          (c: any) => c.duplicate_key === duplicateKey
        );

        if (existingMatch) {
          duplicateCount++;
          // Update existing component
          const newTotalOrders = existingMatch.total_orders_in_period + 1;
          const newTotalQty = Number(existingMatch.total_qty_ordered) + Number(item.qty || 0);
          const newTotalSpend = Number(existingMatch.total_spend) + Number(item.total_price || 0);
          
          const itemDate = item.po_date ? new Date(item.po_date) : null;
          const existingDate = existingMatch.last_ordered_date ? new Date(existingMatch.last_ordered_date) : null;
          
          const isNewer = itemDate && (!existingDate || itemDate > existingDate);

          const updateData: any = {
            total_orders_in_period: newTotalOrders,
            total_qty_ordered: newTotalQty,
            total_spend: newTotalSpend,
          };

          if (isNewer) {
            updateData.last_ordered_date = item.po_date;
            updateData.last_ordered_po = item.po_number || "";
            updateData.last_unit_price = item.unit_price || 0;
          }

          // Append alias description
          if (description && !existingMatch.alias_descriptions?.includes(description)) {
            updateData.alias_descriptions = existingMatch.alias_descriptions 
              ? `${existingMatch.alias_descriptions}\n${description}`
              : description;
          }

          await supabase
            .from("normalized_components")
            .update(updateData)
            .eq("id", existingMatch.id);

          // Update local array for subsequent iterations
          Object.assign(existingMatch, updateData);
        } else {
          // Check if this is a duplicate within the current batch
          const batchDuplicate = newComponents.find(c => c.duplicate_key === duplicateKey);
          if (batchDuplicate) {
            duplicateCount++;
            // Update the batch component
            batchDuplicate.total_orders_in_period += 1;
            batchDuplicate.total_qty_ordered += Number(item.qty || 0);
            batchDuplicate.total_spend += Number(item.total_price || 0);
            
            const itemDate = item.po_date ? new Date(item.po_date) : null;
            const existingDate = batchDuplicate.last_ordered_date ? new Date(batchDuplicate.last_ordered_date) : null;
            
            if (itemDate && (!existingDate || itemDate > existingDate)) {
              batchDuplicate.last_ordered_date = item.po_date;
              batchDuplicate.last_ordered_po = item.po_number || "";
              batchDuplicate.last_unit_price = item.unit_price || 0;
            }
            
            if (description && !batchDuplicate.alias_descriptions?.includes(description)) {
              batchDuplicate.alias_descriptions = batchDuplicate.alias_descriptions 
                ? `${batchDuplicate.alias_descriptions}\n${description}`
                : description;
            }
            continue;
          }

          // Determine component type from description
          const componentType = inferComponentType(description);

          const newComponent = {
            upload_id: uploadId,
            component_type: componentType,
            manufacturer: manufacturer,
            model: model,
            part_number: partNumber,
            description_cleaned: description,
            supplier: supplierName,
            last_ordered_date: item.po_date || null,
            last_ordered_po: item.po_number || "",
            last_unit_price: item.unit_price || 0,
            total_orders_in_period: 1,
            total_qty_ordered: item.qty || 0,
            total_spend: item.total_price || 0,
            notes: "",
            review_flag: !partNumber || !manufacturer,
            alias_descriptions: "",
            linked_asset: "",
            duplicate_key: duplicateKey,
            is_master: true,
          };

          newComponents.push(newComponent);
          existingComponents?.push({ 
            ...newComponent, 
            id: "temp",
            image_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }

      if (newComponents.length > 0) {
        const { error: insertError } = await supabase
          .from("normalized_components")
          .insert(newComponents);

        if (insertError) throw insertError;
      }

      // Update upload status
      await supabase
        .from("po_uploads")
        .update({ status: "processed", processed_at: new Date().toISOString() })
        .eq("id", uploadId);

      await fetchAll();
      
      const result = {
        success: true,
        newCount: newComponents.length,
        duplicateCount,
        totalLines: lineItemsData?.length || 0,
      };
      
      toast({
        title: "Processing Complete",
        description: `${result.totalLines} lines processed: ${result.newCount} new components, ${result.duplicateCount} duplicates merged`,
      });
      
      return result;
    } catch (error) {
      console.error("Error normalizing components:", error);
      toast({
        title: "Error",
        description: "Failed to normalize components",
        variant: "destructive",
      });
      return { success: false, newCount: 0, duplicateCount: 0, totalLines: 0 };
    }
  };

  const updateComponent = async (id: string, updates: Partial<NormalizedComponent>): Promise<boolean> => {
    try {
      const dbUpdates: any = {};
      if (updates.componentType !== undefined) dbUpdates.component_type = updates.componentType;
      if (updates.manufacturer !== undefined) dbUpdates.manufacturer = updates.manufacturer;
      if (updates.model !== undefined) dbUpdates.model = updates.model;
      if (updates.partNumber !== undefined) dbUpdates.part_number = updates.partNumber;
      if (updates.descriptionCleaned !== undefined) dbUpdates.description_cleaned = updates.descriptionCleaned;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.reviewFlag !== undefined) dbUpdates.review_flag = updates.reviewFlag;
      if (updates.linkedAsset !== undefined) dbUpdates.linked_asset = updates.linkedAsset;

      const { error } = await supabase
        .from("normalized_components")
        .update(dbUpdates)
        .eq("id", id);

      if (error) throw error;

      await fetchNormalizedComponents();
      return true;
    } catch (error) {
      console.error("Error updating component:", error);
      toast({
        title: "Error",
        description: "Failed to update component",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteUpload = async (uploadId: string): Promise<boolean> => {
    try {
      // Delete associated normalized_components first
      const { error: ncError } = await supabase
        .from("normalized_components")
        .delete()
        .eq("upload_id", uploadId);
      if (ncError) throw ncError;

      // Delete associated po_line_items
      const { error: liError } = await supabase
        .from("po_line_items")
        .delete()
        .eq("upload_id", uploadId);
      if (liError) throw liError;

      // Finally delete the upload itself
      const { error } = await supabase.from("po_uploads").delete().eq("id", uploadId);
      if (error) throw error;

      await fetchAll();
      toast({
        title: "Success",
        description: "Upload and all associated components deleted",
      });
      return true;
    } catch (error) {
      console.error("Error deleting upload:", error);
      toast({
        title: "Error",
        description: "Failed to delete upload",
        variant: "destructive",
      });
      return false;
    }
  };

  const clearAllData = async (): Promise<boolean> => {
    try {
      // Delete in order: normalized_components, po_line_items, po_uploads
      const { error: ncError } = await supabase.from("normalized_components").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (ncError) throw ncError;

      const { error: liError } = await supabase.from("po_line_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (liError) throw liError;

      const { error: upError } = await supabase.from("po_uploads").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (upError) throw upError;

      await fetchAll();
      toast({
        title: "Success",
        description: "All PO Import data has been cleared",
      });
      return true;
    } catch (error) {
      console.error("Error clearing all data:", error);
      toast({
        title: "Error",
        description: "Failed to clear all data",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploads,
    lineItems,
    normalizedComponents,
    isLoading,
    selectedUploadId,
    setSelectedUploadId,
    createUpload,
    addLineItems,
    normalizeAndDeduplicate,
    updateComponent,
    deleteUpload,
    clearAllData,
    refetch: fetchAll,
    fetchLineItems,
  };
};

function inferComponentType(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes("pump") || desc.includes("impeller")) return "Pump";
  if (desc.includes("motor")) return "Motor";
  if (desc.includes("gearbox") || desc.includes("gear box") || desc.includes("reducer")) return "Gearbox";
  if (desc.includes("valve") || desc.includes("actuator")) return "Valve";
  if (desc.includes("bearing") || desc.includes("brg")) return "Bearing";
  if (desc.includes("seal") || desc.includes("o-ring") || desc.includes("gasket")) return "Seal";
  if (desc.includes("sensor") || desc.includes("transmitter") || desc.includes("gauge") || desc.includes("meter")) return "Instrument";
  if (desc.includes("switch") || desc.includes("relay") || desc.includes("contactor") || desc.includes("cable")) return "Electrical";
  if (desc.includes("filter") || desc.includes("element") || desc.includes("strainer")) return "Filter";
  return "Other";
}
