type PdfReadyCallback = (url: string, title: string) => void;

let _onPdfReady: PdfReadyCallback | null = null;

/** Register a listener for when a PDF is ready to view */
export function onPdfReady(cb: PdfReadyCallback) {
  _onPdfReady = cb;
}

/** Create a blob URL from the PDF and trigger the inline viewer */
export async function uploadAndShowPdf(blob: Blob, filename: string, title?: string) {
  const url = URL.createObjectURL(blob);
  console.log("[PDF] Blob URL created:", url, "size:", blob.size);
  if (_onPdfReady) {
    _onPdfReady(url, title || filename);
  }
}
