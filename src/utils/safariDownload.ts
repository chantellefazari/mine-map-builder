import * as XLSX from "xlsx";

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

/** Safari-safe replacement for XLSX.writeFile() */
export function writeXlsxFile(wb: XLSX.WorkBook, filename: string) {
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, filename);
}

/** Safari-safe CSV download */
export function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, filename);
}
