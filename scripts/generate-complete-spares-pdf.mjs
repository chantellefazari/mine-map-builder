/**
 * Standalone Node.js script to generate complete Site Spares PDF with images.
 * 
 * SETUP (run once):
 *   npm install jspdf jspdf-autotable @supabase/supabase-js
 * 
 * RUN:
 *   node --max-old-space-size=4096 generate-complete-spares-pdf.mjs
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

// ── Config ──
const CONCURRENCY = 5;         // low concurrency to avoid connection drops
const IMAGE_TIMEOUT = 20000;   // 20s per image
const MAX_IMAGE_BYTES = 2000000; // 2MB max per image (larger ones are likely not photos)
const CHUNK_SIZE = 100;        // process & embed images in chunks of 100

// ── Helpers ──
function classifyCrit(desc) {
  const d = (desc || "").toUpperCase();
  const high = ["PUMP", "MOTOR", "BEARING", "VALVE", "CRUSHER", "MILL", "CYCLONE", "THICKENER", "AGITATOR", "SCREEN", "CONVEYOR", "GEARBOX"];
  const med = ["BELT", "FILTER", "SEAL", "GASKET", "COUPLING", "IMPELLER", "LINER", "HOSE", "SPROCKET", "CHAIN"];
  if (high.some((k) => d.includes(k))) return "HIGH";
  if (med.some((k) => d.includes(k))) return "MEDIUM";
  return "LOW";
}

function bufferToBase64(buffer) {
  // Node.js Buffer has native base64 — much faster and no stack overflow
  return Buffer.from(buffer).toString("base64");
}

async function fetchImageAsBase64(url) {
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), IMAGE_TIMEOUT);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(tid);
    if (!res.ok) return null;

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      return null; // skip oversized
    }
    if (buffer.byteLength < 200) {
      return null; // skip tiny/broken
    }

    const ct = (res.headers.get("content-type") || "").toLowerCase();
    const fmt = ct.includes("png") ? "PNG" : "JPEG";
    const b64 = bufferToBase64(buffer);
    return { b64, fmt };
  } catch {
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

  // ── Download images in chunks, storing only base64 strings (not buffers) ──
  const imageMap = new Map(); // id -> { b64, fmt }
  const withImages = allSpares.filter((s) => s.image_urls && s.image_urls.length > 0);
  console.log(`🖼️  Downloading ${withImages.length} images in chunks of ${CONCURRENCY}...`);

  let okCount = 0;
  let failCount = 0;

  for (let i = 0; i < withImages.length; i += CONCURRENCY) {
    const batch = withImages.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (item) => {
        const img = await fetchImageAsBase64(item.image_urls[0]);
        return { id: item.id, img };
      })
    );
    for (const r of results) {
      if (r.img) {
        imageMap.set(r.id, r.img);
        okCount++;
      } else {
        failCount++;
      }
    }
    const done = Math.min(i + CONCURRENCY, withImages.length);
    if (done % 100 === 0 || done === withImages.length) {
      console.log(`   Progress: ${done}/${withImages.length} (${okCount} ok, ${failCount} failed)`);
    }

    // Force garbage collection hint every 500 images
    if (done % 500 === 0 && global.gc) {
      global.gc();
    }
  }

  console.log(`✅ Images downloaded: ${okCount} ok, ${failCount} failed, ${allSpares.length - withImages.length} had no URL`);

  // ── Build PDF in row chunks to reduce peak memory ──
  console.log("📄 Building PDF...");
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(14);
  doc.text("Site Spares - Complete Parts List", 14, 15);
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    `Generated: ${new Date().toISOString().split("T")[0]} | ${allSpares.length} items | ${okCount} images embedded`,
    14, 20
  );
  doc.setTextColor(0);

  const imgCellW = 18;
  const imgCellH = 14;

  // Process in chunks to avoid holding all image position refs at once
  const ROWS_PER_CHUNK = CHUNK_SIZE;
  let globalRow = 0;

  for (let chunkStart = 0; chunkStart < allSpares.length; chunkStart += ROWS_PER_CHUNK) {
    const chunkEnd = Math.min(chunkStart + ROWS_PER_CHUNK, allSpares.length);
    const chunk = allSpares.slice(chunkStart, chunkEnd);
    const chunkImagePositions = [];

    const tableBody = chunk.map((item, localIdx) => {
      const crit = classifyCrit(item.description);
      const img = imageMap.get(item.id);
      if (img) chunkImagePositions.push({ row: localIdx, b64: img.b64, fmt: img.fmt });

      return [
        globalRow + localIdx + 1,
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
      startY: chunkStart === 0 ? 24 : doc.lastAutoTable?.finalY ?? undefined,
      head: chunkStart === 0 ? [["#", "Part No.", "Image", "Description", "Crit.", "Category", "Area", "Bin"]] : undefined,
      showHead: chunkStart === 0 ? "firstPage" : false,
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
          const entry = chunkImagePositions.find((p) => p.row === data.row.index);
          if (entry) {
            try {
              const pad = 1;
              doc.addImage(
                entry.b64, entry.fmt,
                data.cell.x + pad, data.cell.y + pad,
                imgCellW - pad * 2, imgCellH - pad * 2
              );
            } catch { /* skip broken image */ }
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

    globalRow += chunk.length;

    // Free chunk image data from map after embedding
    for (const item of chunk) {
      imageMap.delete(item.id);
    }

    if (chunkEnd % 500 === 0) {
      console.log(`   Built rows ${chunkStart + 1}–${chunkEnd}...`);
    }
  }

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
