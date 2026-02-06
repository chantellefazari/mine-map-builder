import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export interface BatchQueueItem {
  id: string;
  description: string;
  category?: string;
  criticality?: string; // HIGH, MEDIUM, LOW
  hasImage?: boolean;
}

const DELAY_BETWEEN_REQUESTS_MS = 5000;
const RATE_LIMIT_RETRY_MS = 30000;

/**
 * Shared hook for batch AI image generation.
 * Supports both category-filtered and manually-selected items.
 * Works with visual_parts_catalogue and site_spares tables.
 */
export const useBatchImageGeneration = (
  items: BatchQueueItem[],
  onImageGenerated: (id: string, imageUrl: string) => Promise<boolean>,
  refetch: () => Promise<void> | void,
  tableName: "visual_parts_catalogue" | "site_spares" = "site_spares"
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

  const checkPartHasImage = async (partId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from(tableName)
      .select("image_urls")
      .eq("id", partId)
      .single();

    if (error || !data) return false;
    return data.image_urls && (data.image_urls as string[]).length > 0;
  };

  const generateImageForPart = async (
    partId: string,
    description: string
  ): Promise<{ success: boolean; imageUrl?: string; error?: string; isRateLimit?: boolean; isCreditsExhausted?: boolean }> => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-part-image", {
        body: { partName: description, partId: partId },
      });

      if (error) {
        const msg = error.message || "";
        if (msg.includes("402") || msg.includes("Payment")) {
          return { success: false, error: "AI credits exhausted", isCreditsExhausted: true };
        }
        if (msg.includes("429") || msg.includes("Rate")) {
          return { success: false, error: "Rate limited", isRateLimit: true };
        }
        return { success: false, error: msg || "Edge function error" };
      }

      if (data?.error) {
        if (data.error.includes("Rate limit") || data.error.includes("429")) {
          return { success: false, error: data.error, isRateLimit: true };
        }
        if (data.error.includes("credit") || data.error.includes("402")) {
          return { success: false, error: data.error, isCreditsExhausted: true };
        }
        return { success: false, error: data.error };
      }

      if (data?.imageUrl) {
        return { success: true, imageUrl: data.imageUrl };
      }

      return { success: false, error: "No image returned" };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      return { success: false, error: errMsg };
    }
  };

  /**
   * Start batch generation.
   * @param categoryFilter - If provided, filters items by category (legacy mode)
   * @param selectedIds - If provided, only generates for these specific IDs (selection mode)
   */
  const startBatch = useCallback(
    async (categoryFilter: string | null, selectedIds?: string[]) => {
      abortRef.current = false;
      pauseRef.current = false;

      let queue: BatchQueueItem[];

      if (selectedIds && selectedIds.length > 0) {
        // Selection mode: use only selected items, sorted by criticality
        const selectedSet = new Set(selectedIds);
        queue = items.filter((item) => selectedSet.has(item.id));
      } else {
        // Category filter mode (legacy)
        queue = items.filter((item) => !item.hasImage);
        if (categoryFilter && categoryFilter !== "all") {
          queue = queue.filter((item) => item.category === categoryFilter);
        }
      }

      // Sort by criticality: HIGH → MEDIUM → LOW
      const critOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      queue.sort((a, b) => (critOrder[a.criticality || "LOW"] ?? 2) - (critOrder[b.criticality || "LOW"] ?? 2));

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
        if (abortRef.current) {
          setProgress((prev) => ({ ...prev, isRunning: false, currentItem: null }));
          break;
        }

        while (pauseRef.current && !abortRef.current) {
          await sleep(500);
        }

        if (abortRef.current) {
          setProgress((prev) => ({ ...prev, isRunning: false, currentItem: null }));
          break;
        }

        const queueItem = queue[i];

        // Fresh check if part already has image
        const hasImage = await checkPartHasImage(queueItem.id);
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

        let result = await generateImageForPart(queueItem.id, queueItem.description);

        // Handle rate limit with auto-retry
        if (result.isRateLimit) {
          setProgress((prev) => ({
            ...prev,
            isPaused: true,
            currentItem: `Rate limited — retrying in 30s...`,
          }));
          await sleep(RATE_LIMIT_RETRY_MS);

          if (abortRef.current) {
            setProgress((prev) => ({ ...prev, isRunning: false, currentItem: null }));
            break;
          }

          setProgress((prev) => ({ ...prev, isPaused: false }));
          result = await generateImageForPart(queueItem.id, queueItem.description);
        }

        // Handle credits exhausted — stop completely
        if (result.isCreditsExhausted) {
          setProgress((prev) => ({
            ...prev,
            failed: prev.failed + 1,
            processed: i + 1,
            isRunning: false,
            currentItem: null,
            failedItems: [
              ...prev.failedItems,
              { id: queueItem.id, description: queueItem.description, error: result.error || "Credits exhausted" },
            ],
          }));
          break;
        }

        if (result.success && result.imageUrl) {
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

        // Delay before next request
        if (i < queue.length - 1 && !abortRef.current) {
          await sleep(DELAY_BETWEEN_REQUESTS_MS);
        }
      }

      setProgress((prev) => ({ ...prev, isRunning: false, currentItem: null }));
      await refetch();
    },
    [items, onImageGenerated, refetch, tableName]
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

  const resetProgress = useCallback(() => {
    setProgress({
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
  }, []);

  const getPartsWithoutImages = useCallback(
    (categoryFilter: string | null) => {
      let queue = items.filter((item) => !item.hasImage);
      if (categoryFilter && categoryFilter !== "all") {
        queue = queue.filter((item) => item.category === categoryFilter);
      }
      return queue.length;
    },
    [items]
  );

  return {
    progress,
    startBatch,
    pauseBatch,
    resumeBatch,
    stopBatch,
    resetProgress,
    getPartsWithoutImages,
  };
};
