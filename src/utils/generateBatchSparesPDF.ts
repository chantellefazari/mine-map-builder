import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { classifyCriticality } from "@/utils/criticalityClassification";
import { getContainerForCategory } from "@/utils/categoryContainerMapping";
import { supabase } from "@/integrations/supabase/client";

interface SpareRow {
  id: string;
  part_number: string | null;
  description: string;
  category: string | null;
  image_urls: string[] | null;
  is_critical: boolean | null;
  warehouse_area: string | null;
  bin_location: string | null;
}

const BATCH_SIZE = 100;

/** Fetch image, draw to small canvas for compression, return base64 */
async function fetchThumbnail(url: string, maxSize = 60): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(maxSize / bitmap.width, maxSize / bitmap.height, 1);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const outBlob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.6 });
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(outBlob);
    });
  } catch {
    return null;
  }
}

/** Count total spare items in the database */
export async function countAllSpares(): Promise<number> {
  const { count, error } = await supabase
    .from("site_spares")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

/** Get the total number of batches */
export function getBatchCount(totalItems: number): number {
  return Math.ceil(totalItems / BATCH_SIZE);
}

/** Get batch range label e.g. "001–100" */
export function getBatchLabel(batchIndex: number, totalItems: number): string {
  const start = batchIndex * BATCH_SIZE + 1;
  const end = Math.min((batchIndex + 1) * BATCH_SIZE, totalItems);
  return `${String(start).padStart(4, "0")}-${String(end).padStart(4, "0")}`;
}

/** Get storage path for a batch PDF */
function getStoragePath(batchIndex: number, totalItems: number): string {
  const label = getBatchLabel(batchIndex, totalItems);
  return `spares-batches/Parts_List_${label}.pdf`;
}

/** Check which batches already exist in storage */
export async function getExistingBatches(totalItems: number): Promise<Set<number>> {
  const { data, error } = await supabase.storage
    .from("temp-pdfs")
    .list("spares-batches", { limit: 500 });
  if (error || !data) return new Set();

  const existing = new Set<number>();
  const batchCount = getBatchCount(totalItems);
  for (let i = 0; i < batchCount; i++) {
    const path = getStoragePath(i, totalItems);
    const fileName = path.split("/").pop()!;
    if (data.some((f) => f.name === fileName)) {
      existing.add(i);
    }
  }
  return existing;
}

/** Generate a single batch PDF with embedded images and upload to storage */
export async function generateBatchPDF(
  batchIndex: number,
  totalItems: number,
  onProgress?: (msg: string) => void
): Promise<string> {
  const offset = batchIndex * BATCH_SIZE;

  onProgress?.(`Fetching parts ${offset + 1}–${Math.min(offset + BATCH_SIZE, totalItems)}...`);

  const { data, error } = await supabase
    .from("site_spares")
    .select("id, part_number, description, category, image_urls, is_critical, warehouse_area, bin_location")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .range(offset, offset + BATCH_SIZE - 1);

  if (error) throw error;
  const items = (data || []) as SpareRow[];

  // Pre-fetch all thumbnails in parallel (max 10 concurrent)
  onProgress?.(`Downloading ${items.filter((i) => i.image_urls?.length).length} images...`);
  const imageMap = new Map<string, string>();

  const withImages = items.filter((i) => i.image_urls && i.image_urls.length > 0);
  const concurrency = 10;
  for (let c = 0; c < withImages.length; c += concurrency) {
    const chunk = withImages.slice(c, c + concurrency);
    const results = await Promise.all(
      chunk.map(async (item) => {
        const url = item.image_urls![0];
        const b64 = await fetchThumbnail(url);
        return { id: item.id, b64 };
      })
    );
    for (const r of results) {
      if (r.b64) imageMap.set(r.id, r.b64);
    }
    onProgress?.(`Downloaded ${Math.min(c + concurrency, withImages.length)}/${withImages.length} images...`);
  }

  onProgress?.("Building PDF...");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const label = getBatchLabel(batchIndex, totalItems);

  // Title
  doc.setFontSize(14);
  doc.text(`Site Spares Parts List — Items ${label}`, 14, 15);
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Batch ${batchIndex + 1} of ${getBatchCount(totalItems)} | ${items.length} items`, 14, 20);
  doc.setTextColor(0);

  const imgCellW = 20;
  const imgCellH = 16;

  // Track image positions for didDrawCell
  const imagePositions: { row: number; b64: string }[] = [];

  const tableBody: any[][] = items.map((item, idx) => {
    const criticality = classifyCriticality(item.description);
    const b64 = imageMap.get(item.id);
    if (b64) imagePositions.push({ row: idx, b64 });

    return [
      offset + idx + 1,
      item.part_number || "—",
      b64 ? "" : "No image",
      item.description,
      criticality,
      item.category || "—",
      item.warehouse_area || "—",
      item.bin_location || "—",
    ];
  });

  autoTable(doc, {
    startY: 24,
    head: [["#", "Part No.", "Image", "Description", "Crit.", "Category", "Area", "Bin"]],
    body: tableBody,
    styles: { fontSize: 6.5, cellPadding: 1.5, overflow: "linebreak", valign: "middle", minCellHeight: imgCellH },
    headStyles: { fillColor: [41, 37, 36], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 9, halign: "center" },
      1: { cellWidth: 20 },
      2: { cellWidth: imgCellW },
      3: { cellWidth: 75 },
      4: { cellWidth: 12, halign: "center" },
      5: { cellWidth: 30 },
      6: { cellWidth: 18 },
      7: { cellWidth: 18 },
    },
    rowPageBreak: "avoid",
    didDrawCell: (data: any) => {
      // Draw image in the image column
      if (data.section === "body" && data.column.index === 2) {
        const imgEntry = imagePositions.find((p) => p.row === data.row.index);
        if (imgEntry) {
          try {
            const pad = 1;
            doc.addImage(
              imgEntry.b64,
              "JPEG",
              data.cell.x + pad,
              data.cell.y + pad,
              imgCellW - pad * 2,
              imgCellH - pad * 2
            );
          } catch {
            // Skip broken image
          }
        }
      }
      // Color-code criticality
      if (data.section === "body" && data.column.index === 4) {
        const val = data.cell.raw;
        if (val === "HIGH") {
          doc.setTextColor(220, 38, 38);
          doc.setFont("helvetica", "bold");
          doc.text("HIGH", data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, { align: "center" });
          doc.setTextColor(0);
          doc.setFont("helvetica", "normal");
        } else if (val === "MEDIUM") {
          doc.setTextColor(234, 138, 0);
          doc.setFont("helvetica", "bold");
          doc.text("MED", data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, { align: "center" });
          doc.setTextColor(0);
          doc.setFont("helvetica", "normal");
        }
      }
    },
    didParseCell: (data: any) => {
      if (data.section === "body" && data.column.index === 4) {
        const val = data.cell.raw;
        if (val === "HIGH" || val === "MEDIUM") {
          data.cell.text = [];
        }
      }
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 5);
    doc.text(`TCMG Site Spares — Batch ${batchIndex + 1}`, 14, doc.internal.pageSize.getHeight() - 5);
  }

  // Upload to storage
  onProgress?.("Uploading PDF...");
  const blob = doc.output("blob");
  const storagePath = getStoragePath(batchIndex, totalItems);

  // Remove existing file first (upsert)
  await supabase.storage.from("temp-pdfs").remove([storagePath]);

  const { error: uploadErr } = await supabase.storage
    .from("temp-pdfs")
    .upload(storagePath, blob, { contentType: "application/pdf", upsert: true });

  if (uploadErr) throw uploadErr;

  const { data: urlData } = supabase.storage.from("temp-pdfs").getPublicUrl(storagePath);
  return urlData.publicUrl;
}

/** Download a previously generated batch PDF */
export function downloadBatchPDF(batchIndex: number, totalItems: number): string {
  const storagePath = getStoragePath(batchIndex, totalItems);
  const { data } = supabase.storage.from("temp-pdfs").getPublicUrl(storagePath);
  return data.publicUrl;
}

/** Delete all batch PDFs from storage */
export async function clearAllBatchPDFs(totalItems: number) {
  const batchCount = getBatchCount(totalItems);
  const paths: string[] = [];
  for (let i = 0; i < batchCount; i++) {
    paths.push(getStoragePath(i, totalItems));
  }
  if (paths.length > 0) {
    await supabase.storage.from("temp-pdfs").remove(paths);
  }
}
