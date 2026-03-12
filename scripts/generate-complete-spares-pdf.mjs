/**
 * Standalone Node.js script to generate complete Site Spares PDF with images.
 * 
 * SETUP (run once):
 *   npm install jspdf jspdf-autotable @supabase/supabase-js
 * 
 * RUN:
 *   node scripts/generate-complete-spares-pdf.mjs
 * 
 * OUTPUT: Complete_Parts_List_All.pdf in the current directory
 */

import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";

// ── Supabase config ──
const SUPABASE_URL = "https://szbnqeydhhlpyevqkydr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6Ym5xZXlkaGhscHlldnFreWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Mzk4NzMsImV4cCI6MjA4NTIxNTg3M30.UIuPNjGckV0NuS9t9a4o_6xTNFvygpzrOsG7wNXN3Ng";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Helpers ──
function classifyCrit(desc) {
  const d = (desc || "").toUpperCase();
  const high = ["PUMP", "MOTOR", "BEARING", "VALVE", "CRUSHER", "MILL", "CYCLONE", "THICKENER", "AGITATOR", "SCREEN", "CONVEYOR", "GEARBOX"];
  const med = ["BELT", "FILTER", "SEAL", "GASKET", "COUPLING", "IMPELLER", "LINER", "HOSE", "SPROCKET", "CHAIN"];
  if (high.some((k) => d.includes(k))) return "HIGH";
  if (med.some((k) => d.includes(k))) return "MEDIUM";
  return "LOW";
}

async function fetchImageAsBase64(url, timeoutMs = 15000) {
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(tid);
    if (!res.ok) {
      return null;
    }
    const buffer = await res.arrayBuffer();
    // Allow up to 5MB per image — they compress well in the PDF
    if (buffer.byteLength > 5000000) return null;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    const fmt = ct.includes("png") ? "PNG" : "JPEG";
    // Chunk-based base64 conversion to avoid stack overflow on large buffers
    const bytes = new Uint8Array(buffer);
    const CHUNK_SIZE = 8192;
    let binary = "";
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.subarray(i, i + CHUNK_SIZE);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const b64 = btoa(binary);
    return { b64, fmt };
  } catch (err) {
    return null;
  }
}

// ── Main ──
async function main() {
  console.log("📦 Fetching all spares from database...");

  const allSpares = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("site_spares")
      .select("id, part_number, description, category, image_urls, is_critical, warehouse_area, bin_location")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, offset + 999);
    if (error) {
      console.error("❌ DB error:", error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    allSpares.push(...data);
    console.log(`   Fetched ${allSpares.length} rows...`);
    if (data.length < 1000) break;
    offset += 1000;
  }

  console.log(`✅ Total parts: ${allSpares.length}`);

  // Fetch images
  const withImages = allSpares.filter((s) => s.image_urls && s.image_urls.length > 0);
  console.log(`🖼️  Downloading ${withImages.length} images (concurrency: 30)...`);

  const imageMap = new Map();
  const concurrency = 10;
  let failedCount = 0;
  for (let i = 0; i < withImages.length; i += concurrency) {
    const batch = withImages.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (item) => {
        const img = await fetchImageAsBase64(item.image_urls[0]);
        return { id: item.id, img, desc: item.description };
      })
    );
    for (const r of results) {
      if (r.img) {
        imageMap.set(r.id, r.img);
      } else {
        failedCount++;
      }
    }
    const done = Math.min(i + concurrency, withImages.length);
    process.stdout.write(`\r   Downloaded ${done}/${withImages.length} images (${imageMap.size} ok, ${failedCount} failed)...`);
  }
  console.log(`\n✅ Images embedded: ${imageMap.size} | Failed: ${failedCount}`);

  // Build PDF
  console.log("📄 Building PDF...");
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(14);
  doc.text("Site Spares - Complete Parts List", 14, 15);
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    `Generated: ${new Date().toISOString().split("T")[0]} | ${allSpares.length} items | ${imageMap.size} images embedded`,
    14, 20
  );
  doc.setTextColor(0);

  const imgCellW = 18;
  const imgCellH = 14;
  const imagePositions = [];

  const tableBody = allSpares.map((item, idx) => {
    const crit = classifyCrit(item.description);
    const img = imageMap.get(item.id);
    if (img) imagePositions.push({ row: idx, b64: img.b64, fmt: img.fmt });

    return [
      idx + 1,
      item.part_number || "—",
      img ? "" : "No img",
      item.description || "",
      crit,
      item.category || "—",
      item.warehouse_area || "—",
      item.bin_location || "—",
    ];
  });

  autoTable(doc, {
    startY: 24,
    head: [["#", "Part No.", "Image", "Description", "Crit.", "Category", "Area", "Bin"]],
    body: tableBody,
    styles: { fontSize: 6, cellPadding: 1.5, overflow: "linebreak", valign: "middle", minCellHeight: imgCellH },
    headStyles: { fillColor: [41, 37, 36], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 6.5 },
    columnStyles: {
      0: { cellWidth: 9, halign: "center" },
      1: { cellWidth: 20 },
      2: { cellWidth: imgCellW },
      3: { cellWidth: 75 },
      4: { cellWidth: 12, halign: "center" },
      5: { cellWidth: 28 },
      6: { cellWidth: 18 },
      7: { cellWidth: 18 },
    },
    rowPageBreak: "avoid",
    didDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 2) {
        const entry = imagePositions.find((p) => p.row === data.row.index);
        if (entry) {
          try {
            const pad = 1;
            doc.addImage(
              entry.b64, entry.fmt,
              data.cell.x + pad, data.cell.y + pad,
              imgCellW - pad * 2, imgCellH - pad * 2
            );
          } catch { /* skip */ }
        }
      }
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
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        if (data.cell.raw === "HIGH" || data.cell.raw === "MEDIUM") {
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
    doc.text("TCMG Site Spares - Complete Parts List", 14, doc.internal.pageSize.getHeight() - 5);
  }

  // Save to file
  const outputPath = "Complete_Parts_List_All.pdf";
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`\n🎉 Done! PDF saved to: ${outputPath}`);
  console.log(`   Pages: ${pageCount}`);
  console.log(`   File size: ${(pdfBuffer.byteLength / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
