import { createClient } from "npm:@supabase/supabase-js@2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";
import autoTable from "https://esm.sh/jspdf-autotable@3.8.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    for (let j = 0; j < slice.length; j++) {
      binary += String.fromCharCode(slice[j]);
    }
  }
  return btoa(binary);
}

function classifyCrit(desc: string): string {
  const d = (desc || "").toUpperCase();
  const high = ["PUMP", "MOTOR", "BEARING", "VALVE", "CRUSHER", "MILL", "CYCLONE", "THICKENER", "AGITATOR", "SCREEN", "CONVEYOR", "GEARBOX"];
  const med = ["BELT", "FILTER", "SEAL", "GASKET", "COUPLING", "IMPELLER", "LINER", "HOSE", "SPROCKET", "CHAIN"];
  if (high.some((k) => d.includes(k))) return "HIGH";
  if (med.some((k) => d.includes(k))) return "MEDIUM";
  return "LOW";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Fetch all spares (handle >1000 rows)
    const allSpares: any[] = [];
    let offset = 0;
    while (true) {
      const { data, error } = await supabase
        .from("site_spares")
        .select("id, part_number, description, category, image_urls, is_critical, warehouse_area, bin_location")
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(offset, offset + 999);
      if (error) throw new Error(`DB error: ${error.message}`);
      if (!data || data.length === 0) break;
      allSpares.push(...data);
      if (data.length < 1000) break;
      offset += 1000;
    }

    if (allSpares.length === 0) {
      return new Response(JSON.stringify({ error: "No spares found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Fetch images concurrently (50 at a time, 3s timeout, skip >150KB)
    const imageMap = new Map<string, { b64: string; fmt: string }>();
    const withImages = allSpares.filter((s) => s.image_urls && s.image_urls.length > 0);

    const fetchImage = async (item: any) => {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(item.image_urls[0], { signal: controller.signal });
        clearTimeout(tid);
        if (!res.ok) return;
        const buf = await res.arrayBuffer();
        if (buf.byteLength > 150000) return; // skip images > 150KB
        const ct = (res.headers.get("content-type") || "").toLowerCase();
        const fmt = ct.includes("png") ? "PNG" : "JPEG";
        const b64 = arrayBufferToBase64(buf);
        imageMap.set(item.id, { b64, fmt });
      } catch {
        // skip failed images
      }
    };

    const concurrency = 50;
    for (let i = 0; i < withImages.length; i += concurrency) {
      const batch = withImages.slice(i, i + concurrency);
      await Promise.all(batch.map(fetchImage));
    }

    // 3. Build PDF
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFontSize(14);
    doc.text("Site Spares - Complete Parts List", 14, 15);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Generated: ${new Date().toISOString().split("T")[0]} | ${allSpares.length} items | ${imageMap.size} images embedded`,
      14,
      20
    );
    doc.setTextColor(0);

    const imgCellW = 18;
    const imgCellH = 14;

    const imagePositions: { row: number; b64: string; fmt: string }[] = [];

    const tableBody = allSpares.map((item: any, idx: number) => {
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
      styles: {
        fontSize: 6,
        cellPadding: 1.5,
        overflow: "linebreak",
        valign: "middle",
        minCellHeight: imgCellH,
      },
      headStyles: {
        fillColor: [41, 37, 36],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 6.5,
      },
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
      didDrawCell: (data: any) => {
        // Draw image
        if (data.section === "body" && data.column.index === 2) {
          const entry = imagePositions.find((p) => p.row === data.row.index);
          if (entry) {
            try {
              const pad = 1;
              doc.addImage(
                entry.b64,
                entry.fmt,
                data.cell.x + pad,
                data.cell.y + pad,
                imgCellW - pad * 2,
                imgCellH - pad * 2
              );
            } catch {
              // skip broken image
            }
          }
        }
        // Color-code criticality
        if (data.section === "body" && data.column.index === 4) {
          const val = data.cell.raw;
          if (val === "HIGH") {
            doc.setTextColor(220, 38, 38);
            doc.setFont("helvetica", "bold");
            doc.text("HIGH", data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, {
              align: "center",
            });
            doc.setTextColor(0);
            doc.setFont("helvetica", "normal");
          } else if (val === "MEDIUM") {
            doc.setTextColor(234, 138, 0);
            doc.setFont("helvetica", "bold");
            doc.text("MED", data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, {
              align: "center",
            });
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
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 5
      );
      doc.text("TCMG Site Spares - Complete Parts List", 14, doc.internal.pageSize.getHeight() - 5);
    }

    // 4. Output and upload
    const pdfOutput = doc.output("arraybuffer");
    const pdfBlob = new Blob([pdfOutput], { type: "application/pdf" });

    await supabase.storage.from("temp-pdfs").remove(["Complete_Parts_List_All.pdf"]);

    const { error: uploadErr } = await supabase.storage
      .from("temp-pdfs")
      .upload("Complete_Parts_List_All.pdf", pdfBlob, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

    return new Response(
      JSON.stringify({
        success: true,
        totalItems: allSpares.length,
        imagesEmbedded: imageMap.size,
        pages: pageCount,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
