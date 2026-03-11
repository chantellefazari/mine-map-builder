type PdfReadyCallback = (url: string, title: string) => void;

let _onPdfReady: PdfReadyCallback | null = null;

/** Register a listener for when a PDF is ready to view */
export function onPdfReady(cb: PdfReadyCallback) {
  _onPdfReady = cb;
}

/** Convert blob to base64 data URL and trigger the inline viewer */
export async function uploadAndShowPdf(blob: Blob, filename: string, title?: string) {
  console.log("[PDF] Converting to data URL, size:", blob.size);
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
  console.log("[PDF] Data URL ready, length:", dataUrl.length);
  if (_onPdfReady) {
    _onPdfReady(dataUrl, title || filename);
  }
}
