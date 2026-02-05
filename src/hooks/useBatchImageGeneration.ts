 import { useState, useCallback, useRef } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import type { SiteSpareItem } from "@/hooks/useSiteSpares";
 
 export interface BatchProgress {
   total: number;
   processed: number;
   generated: number;
   failed: number;
   skipped: number;
   currentItem: string | null;
   isRunning: boolean;
   isPaused: boolean;
   failedItems: Array<{ id: string; description: string; error: string }>;
 }
 
const DELAY_BETWEEN_REQUESTS_MS = 6000;
 
 export const useBatchImageGeneration = (
   spares: SiteSpareItem[],
  onImageGenerated: (id: string, imageUrl: string) => Promise<boolean>,
   refetch: () => Promise<void>
 ) => {
   const [progress, setProgress] = useState<BatchProgress>({
     total: 0,
     processed: 0,
     generated: 0,
     failed: 0,
     skipped: 0,
     currentItem: null,
     isRunning: false,
     isPaused: false,
     failedItems: [],
   });
 
   const abortRef = useRef(false);
   const pauseRef = useRef(false);
 
   const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
 
  // Check if a part already has images in the database (fresh check)
  const checkPartHasImage = async (partId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("site_spares")
      .select("image_urls")
      .eq("id", partId)
      .single();
    
    if (error || !data) return false;
    return data.image_urls && data.image_urls.length > 0;
  };

   const generateImageForPart = async (
    partId: string,
    description: string
   ): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
     try {
       const { data, error } = await supabase.functions.invoke("generate-part-image", {
        body: { partName: description, partId: partId },
       });
 
       if (error) {
         return { success: false, error: error.message };
       }
 
       if (data?.error) {
         return { success: false, error: data.error };
       }
 
       if (data?.imageUrl) {
         return { success: true, imageUrl: data.imageUrl };
       }
 
       return { success: false, error: "No image returned" };
     } catch (err) {
       return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
     }
   };
 
  const startBatch = useCallback(
    async (categoryFilter: string | null) => {
       abortRef.current = false;
       pauseRef.current = false;
 
      // Take a snapshot of parts without images at start time
      // We use IDs to track which parts to process so we can skip already-processed ones
      let queue = spares
        .filter((s) => !s.image_urls || s.image_urls.length === 0)
        .map((s) => ({ id: s.id, description: s.description, category: s.category }));
 
       // Apply category filter if specified
       if (categoryFilter && categoryFilter !== "all") {
         queue = queue.filter((s) => s.category === categoryFilter);
       }
 
       if (queue.length === 0) {
         setProgress((prev) => ({ ...prev, isRunning: false }));
         return;
       }
 
       setProgress({
         total: queue.length,
         processed: 0,
         generated: 0,
         failed: 0,
         skipped: 0,
         currentItem: null,
         isRunning: true,
         isPaused: false,
         failedItems: [],
       });
 
       for (let i = 0; i < queue.length; i++) {
         // Check for abort
         if (abortRef.current) {
           setProgress((prev) => ({ ...prev, isRunning: false, currentItem: null }));
           break;
         }
 
         // Check for pause
         while (pauseRef.current && !abortRef.current) {
           await sleep(500);
         }
 
         if (abortRef.current) {
           setProgress((prev) => ({ ...prev, isRunning: false, currentItem: null }));
           break;
         }
 
        const queueItem = queue[i];
        
       // Check database directly for fresh image status
       const hasImage = await checkPartHasImage(queueItem.id);
       
       // Skip if part already has an image
       if (hasImage) {
          setProgress((prev) => ({
            ...prev,
            skipped: prev.skipped + 1,
            processed: i + 1,
          }));
          continue;
        }
        
         setProgress((prev) => ({
           ...prev,
          currentItem: queueItem.description,
           processed: i,
         }));
 
        const result = await generateImageForPart(queueItem.id, queueItem.description);
 
         if (result.success && result.imageUrl) {
           // Save to database
          const saved = await onImageGenerated(queueItem.id, result.imageUrl);
           if (saved) {
             setProgress((prev) => ({
               ...prev,
               generated: prev.generated + 1,
               processed: i + 1,
             }));
           } else {
             setProgress((prev) => ({
               ...prev,
               failed: prev.failed + 1,
               processed: i + 1,
               failedItems: [
                 ...prev.failedItems,
                { id: queueItem.id, description: queueItem.description, error: "Failed to save" },
               ],
             }));
           }
         } else {
           setProgress((prev) => ({
             ...prev,
             failed: prev.failed + 1,
             processed: i + 1,
             failedItems: [
            ...prev.failedItems,
          { id: queueItem.id, description: queueItem.description, error: result.error || "Unknown" },
             ],
           }));
         }
 
         // Delay before next request (unless it's the last one)
         if (i < queue.length - 1 && !abortRef.current) {
           await sleep(DELAY_BETWEEN_REQUESTS_MS);
         }
       }
 
       // Complete
       setProgress((prev) => ({ ...prev, isRunning: false, currentItem: null }));
       await refetch();
     },
     [spares, onImageGenerated, refetch]
   );
 
   const pauseBatch = useCallback(() => {
     pauseRef.current = true;
     setProgress((prev) => ({ ...prev, isPaused: true }));
   }, []);
 
   const resumeBatch = useCallback(() => {
     pauseRef.current = false;
     setProgress((prev) => ({ ...prev, isPaused: false }));
   }, []);
 
   const stopBatch = useCallback(() => {
     abortRef.current = true;
     pauseRef.current = false;
     setProgress((prev) => ({ ...prev, isRunning: false, isPaused: false, currentItem: null }));
   }, []);
 
   const getPartsWithoutImages = useCallback(
     (categoryFilter: string | null) => {
       let queue = spares.filter((s) => !s.image_urls || s.image_urls.length === 0);
       if (categoryFilter && categoryFilter !== "all") {
         queue = queue.filter((s) => s.category === categoryFilter);
       }
       return queue.length;
     },
     [spares]
   );
 
   return {
     progress,
     startBatch,
     pauseBatch,
     resumeBatch,
     stopBatch,
     getPartsWithoutImages,
   };
 };