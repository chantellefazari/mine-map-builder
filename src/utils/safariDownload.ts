/**
 * Safari-safe file download helper.
 * Safari blocks programmatic anchor clicks when not in the direct user gesture
 * call stack, and XLSX.writeFile() uses an internal mechanism that fails in
 * Safari's sandboxed iframe context (e.g. Lovable preview).
 *
 * This helper manually creates a Blob, attaches an <a> to the DOM, clicks it,
 * then cleans up — which is the most reliable cross-browser approach.
 */

/** Download any Blob as a file */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  // Small delay before cleanup so Safari has time to start the download
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
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
