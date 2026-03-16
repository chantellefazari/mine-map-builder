/**
 * Safari-safe file download helper.
 * Safari blocks programmatic anchor clicks when not in the direct user gesture
 * call stack, and XLSX.writeFile() uses an internal mechanism that fails in
 * Safari's sandboxed iframe context (e.g. Lovable preview).
 *
 * This helper manually creates a Blob, attaches an <a> to the DOM, clicks it,
 * then cleans up — which is the most reliable cross-browser approach.
 */

let primedDownloadAnchor: HTMLAnchorElement | null = null;

/** Prime an invisible anchor during the user click so async exports can reuse it. */
export function primeDownloadGesture() {
  if (primedDownloadAnchor && primedDownloadAnchor.isConnected) return;
  primedDownloadAnchor = document.createElement("a");
  primedDownloadAnchor.style.display = "none";
  primedDownloadAnchor.rel = "noopener noreferrer";
  document.body.appendChild(primedDownloadAnchor);
}

/** Clean up the primed anchor if export fails before download starts. */
export function cancelPrimedDownloadGesture() {
  if (primedDownloadAnchor?.isConnected) {
    primedDownloadAnchor.remove();
  }
  primedDownloadAnchor = null;
}

/** Triggers a file download using a hidden anchor element. */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = primedDownloadAnchor ?? document.createElement("a");
  primedDownloadAnchor = null;

  link.style.display = "none";
  link.href = url;
  link.download = filename;
  link.rel = "noopener noreferrer";

  if (!link.isConnected) {
    document.body.appendChild(link);
  }

  try {
    link.click();
  } finally {
    // Keep URL alive long enough for Safari/iframe download handoff.
    setTimeout(() => {
      if (link.isConnected) {
        link.remove();
      }
      URL.revokeObjectURL(url);
    }, 10000);
  }
}

/** Download any Blob as a file */
export function downloadBlob(blob: Blob, filename: string) {
  triggerDownload(blob, filename);
}

/** Safari-safe replacement for XLSX.writeFile(). Pass the dynamically-imported XLSX module. */
export function writeXlsxFile(wb: any, filename: string, XLSX?: any) {
  const xlsxMod = XLSX ?? (globalThis as any).__XLSX_CACHE;
  if (!xlsxMod) throw new Error("XLSX module not provided to writeXlsxFile");
  const wbout = xlsxMod.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, filename);
}

/** Helper to dynamically load xlsx and cache it */
export async function loadXLSX() {
  const mod = await import("xlsx");
  const XLSX = mod.default ?? mod;
  (globalThis as any).__XLSX_CACHE = XLSX;
  return XLSX;
}

/** Safari-safe CSV download */
export function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, filename);
}
