import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { classifyCriticality } from "@/utils/criticalityClassification";
import { getContainerForCategory } from "@/utils/categoryContainerMapping";
import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";

interface SpareRow {
  id: string;
  part_number: string | null;
  description: string;
  category: string | null;
  image_urls: string[] | null;
  is_critical: boolean | null;
}

/**
 * Fetch a small thumbnail as base64 data URL.
 * Returns null on any failure so the PDF still generates.
 */
async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Determine container status:
 * If the category exists in the mapping → "Confirmed"
 * Otherwise → "Tentative"
 */
function getContainerStatus(category: string | null): { label: string; status: "Confirmed" | "Tentative" } {
  const mapping = getContainerForCategory(category);
  // If the category is explicitly mapped (not falling back to default), it's confirmed
  // Default is C03/ME for unmapped categories
  const MAPPED_CATEGORIES = [
    "Electrical Components", "Power Generation & Distribution",
    "Instrumentation",
    "Bearings", "Seals & Gaskets", "Pumps", "Valves", "Motors",
    "Conveying Components", "Structural & Mechanical", "Gearboxes / Reducers",
    "Air & Pneumatic Components", "Wear Parts", "OEM Assemblies / Packages", "Tanks & Vessels",
    "Filters", "Lubrication System Components",
    "Fasteners", "Consumables", "Safety Equipment", "Tooling",
    "Hoses & Pipework",
  ];
  const isConfirmed = category ? MAPPED_CATEGORIES.includes(category) : false;
  return {
    label: `${mapping.containerId} – ${mapping.containerLabel}`,
    status: isConfirmed ? "Confirmed" : "Tentative",
  };
}

export async function generateSparesPDF(onProgress?: (msg: string) => void) {
  onProgress?.("Fetching all spare parts...");

  // Paginate to get ALL items
  const allItems: SpareRow[] = [];
  let offset = 0;
  const batchSize = 500;

  while (true) {
    const { data, error } = await supabase
      .from("site_spares")
      .select("id, part_number, description, category, image_urls, is_critical")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, offset + batchSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;
    allItems.push(...(data as SpareRow[]));
    if (data.length < batchSize) break;
    offset += batchSize;
  }

  onProgress?.("Generating PDF...");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Title
  doc.setFontSize(16);
  doc.text("Site Spares Parts List", 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Total Items: ${allItems.length}`, 14, 21);
  doc.setTextColor(0);

  // Build table data
  const tableBody: any[][] = [];

  allItems.forEach((item, index) => {
    const criticality = classifyCriticality(item.description);
    const container = getContainerStatus(item.category);

    tableBody.push([
      index + 1,
      item.part_number || "—",
      item.image_urls?.[0] ? "Has image" : "—",
      item.description,
      criticality,
      item.category || "—",
      `${container.label}\n[${container.status}]`,
    ]);
  });

  const imgCellWidth = 18;

  autoTable(doc, {
    startY: 25,
    head: [["Sr.#", "Part Number", "Picture", "Description", "Criticality", "Category", "Container"]],
    body: tableBody,
    styles: { fontSize: 7, cellPadding: 2, overflow: "linebreak", valign: "middle" },
    headStyles: { fillColor: [41, 37, 36], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 22 },
      2: { cellWidth: imgCellWidth },
      3: { cellWidth: 70 },
      4: { cellWidth: 18, halign: "center" },
      5: { cellWidth: 35 },
      6: { cellWidth: 40 },
    },
    rowPageBreak: "avoid",
    didDrawCell: (data: any) => {

      // Color-code criticality column
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
          doc.text("MEDIUM", data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, { align: "center" });
          doc.setTextColor(0);
          doc.setFont("helvetica", "normal");
        }
      }

      // Tag Confirmed/Tentative in container column
      if (data.section === "body" && data.column.index === 6) {
        const raw = String(data.cell.raw || "");
        if (raw.includes("[Tentative]")) {
          // Draw a small orange tag
          const tagY = data.cell.y + data.cell.height - 5;
          doc.setFillColor(255, 237, 213);
          doc.roundedRect(data.cell.x + 1, tagY, 18, 4, 1, 1, "F");
          doc.setFontSize(5);
          doc.setTextColor(180, 83, 9);
          doc.text("Tentative", data.cell.x + 2, tagY + 3);
          doc.setTextColor(0);
          doc.setFontSize(7);
        }
      }
    },
    didParseCell: (data: any) => {
      // Clear the text for criticality (we draw it manually with color)
      if (data.section === "body" && data.column.index === 4) {
        const val = data.cell.raw;
        if (val === "HIGH" || val === "MEDIUM") {
          data.cell.text = [];
        }
      }
    },
  });

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 5);
    doc.text("TCMG Site Spares Register", 14, doc.internal.pageSize.getHeight() - 5);
  }

  const blob = doc.output("blob");
  const filename = "Site_Spares_Parts_List.pdf";
  const storagePath = `exports/${Date.now()}-${filename}`;
  const { error: uploadError } = await supabase.storage
    .from("temp-pdfs")
    .upload(storagePath, blob, { contentType: "application/pdf", upsert: true });
  if (!uploadError) {
    const { data: urlData } = supabase.storage.from("temp-pdfs").getPublicUrl(storagePath);
    if (urlData?.publicUrl) {
      const a = document.createElement("a");
      a.href = urlData.publicUrl;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } else { console.error("[PDF] Upload failed:", uploadError); }
  return allItems.length;
}
