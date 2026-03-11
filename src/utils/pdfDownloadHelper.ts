/** Open PDF in a new browser tab for viewing / Save as PDF, with direct download fallback */
export async function uploadAndShowPdf(blob: Blob, filename: string, _title?: string) {
  const url = URL.createObjectURL(blob);

  // Try opening in a new tab (native browser PDF viewer)
  const win = window.open(url, "_blank");
  if (win) {
    // Revoke after a delay so the tab has time to load
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } else {
    // Popup blocked — fall back to direct download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
