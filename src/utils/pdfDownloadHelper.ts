import { supabase } from "@/integrations/supabase/client";

type PdfReadyCallback = (url: string, title: string) => void;

let _onPdfReady: PdfReadyCallback | null = null;

/** Register a listener for when a PDF is ready to view */
export function onPdfReady(cb: PdfReadyCallback) {
  _onPdfReady = cb;
}

/** Upload a PDF blob to temp storage and trigger the viewer */
export async function uploadAndShowPdf(blob: Blob, filename: string, title?: string) {
  const storagePath = `exports/${Date.now()}-${filename}`;
  console.log("[PDF] Uploading to storage...", storagePath);

  const { error: uploadError } = await supabase.storage
    .from("temp-pdfs")
    .upload(storagePath, blob, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    console.error("[PDF] Upload failed:", uploadError);
    // Last resort fallback — try blob URL
    const url = URL.createObjectURL(blob);
    if (_onPdfReady) {
      _onPdfReady(url, title || filename);
    }
    return;
  }

  const { data: urlData } = supabase.storage
    .from("temp-pdfs")
    .getPublicUrl(storagePath);

  if (urlData?.publicUrl) {
    console.log("[PDF] Ready:", urlData.publicUrl);
    if (_onPdfReady) {
      _onPdfReady(urlData.publicUrl, title || filename);
    }
  }
}
