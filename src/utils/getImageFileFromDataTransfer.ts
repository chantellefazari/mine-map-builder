export function getImageFileFromDataTransfer(dt: DataTransfer | null): File | null {
  if (!dt) return null;

  // Most common case: dragging a file from the OS file browser.
  if (dt.files && dt.files.length > 0) {
    const f = dt.files[0];
    return f && f.type?.startsWith("image/") ? f : null;
  }

  // Fallback: some browsers/sources expose items only.
  const items = Array.from(dt.items ?? []);
  for (const item of items) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      const f = item.getAsFile();
      if (f) return f;
    }
  }

  return null;
}
