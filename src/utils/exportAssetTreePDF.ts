/**
 * TCMG Asset Tree PDF Export
 * Renders the full asset hierarchy (Processing Plant + Crushing Plant)
 * in an expanded indented format matching the professional site standard.
 */

import { supabase } from "@/integrations/supabase/client";
import { buildAreasFromRows } from "@/hooks/useProcessingPlantAssets";
import { crushingPlantAreas } from "@/components/hierarchy/crushingPlantData";
import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";
import type { Area, Equipment, Component } from "@/components/hierarchy/assetData";

const GOLD = "#C8960C";
const DARK = "#1a1a1a";
const LIGHT_GOLD = "#fdf8ea";
const GRAY = "#666666";

interface TreeRow {
  depth: number;
  label: string;
  code?: string;
  type: "site" | "facility" | "area" | "subArea" | "parentAsset" | "equipment" | "component";
  badgeText?: string;
}

function flattenHierarchy(proAreas: Area[]): TreeRow[] {
  const rows: TreeRow[] = [];

  // Root
  rows.push({ depth: 0, label: "TCMG", type: "site", badgeText: "Tennant Creek Gold Mine - Full Asset Hierarchy" });

  // --- Processing Plant ---
  const proEquipCount = proAreas.reduce((sum, a) => sum + a.subAreas.reduce((s2, sa) => s2 + sa.parentAssets.reduce((s3, pa) => s3 + pa.equipment.length, 0), 0), 0);
  rows.push({ depth: 1, label: "Processing Plant", type: "facility", badgeText: `${proAreas.length} areas` });

  for (const area of proAreas) {
    const areaEquipCount = area.subAreas.reduce((s, sa) => s + sa.parentAssets.reduce((s2, pa) => s2 + pa.equipment.length, 0), 0);
    rows.push({ depth: 2, label: area.label, code: area.code, type: "area", badgeText: `${area.subAreas.length} sub-areas | ${areaEquipCount} equipment` });

    for (const sub of area.subAreas) {
      rows.push({ depth: 3, label: sub.label, type: "subArea", badgeText: `${sub.parentAssets.length} systems` });

      for (const pa of sub.parentAssets) {
        rows.push({ depth: 4, label: pa.label, type: "parentAsset", badgeText: `${pa.equipment.length} items` });

        for (const equip of pa.equipment) {
          rows.push({ depth: 5, label: `${equip.assetNumber} - ${equip.name}`, type: "equipment" });

          if (equip.components) {
            for (const comp of equip.components) {
              const compLabel = comp.componentCode
                ? `${comp.componentCode} - ${comp.componentName}`
                : comp.componentName;
              rows.push({ depth: 6, label: compLabel, code: comp.componentType, type: "component" });
            }
          }
        }
      }
    }
  }

  // --- Crushing Plant ---
  rows.push({ depth: 1, label: "Crushing Plant", type: "facility", badgeText: `${crushingPlantAreas.length} areas` });

  for (const cruArea of crushingPlantAreas) {
    const cruEquipCount = cruArea.parentAssets.reduce((s, pa) => s + pa.equipment.length, 0);
    rows.push({ depth: 2, label: cruArea.label, code: cruArea.areaCode, type: "area", badgeText: `${cruEquipCount} equipment` });

    for (const pa of cruArea.parentAssets) {
      rows.push({ depth: 3, label: pa.label, type: "parentAsset", badgeText: `${pa.equipment.length} items` });

      for (const equip of pa.equipment) {
        rows.push({ depth: 5, label: `${equip.assetNumber} - ${equip.name}`, type: "equipment" });

        if (equip.components) {
          for (const comp of equip.components) {
            const compLabel = comp.componentCode
              ? `${comp.componentCode} - ${comp.componentName}`
              : comp.componentName;
            rows.push({ depth: 6, label: compLabel, code: comp.componentType, type: "component" });
          }
        }
      }
    }
  }

  return rows;
}

export async function exportAssetTreePDF() {
  // Fetch processing plant data from database
  const { data, error } = await supabase
    .from("processing_plant_assets_rev_b")
    .select("id, area_code, area_label, sub_area, parent_asset_label, asset_number, asset_name, pid_tags, components, functional_location, sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw new Error("Failed to load asset data: " + error.message);

  const proAreas = buildAreasFromRows(data as any);
  const treeRows = flattenHierarchy(proAreas);

  const jsPDF = (await import("jspdf")).default;

  const A4_W = 210;
  const A4_H = 297;
  const MARGIN = 10;
  const CONTENT_W = A4_W - MARGIN * 2;
  const LINE_H = 5.5;
  const INDENT = 6;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let currentY = MARGIN;
  let pageNum = 1;

  const addPageBorder = (p: number) => {
    pdf.setPage(p);
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.4);
    pdf.rect(MARGIN - 2, MARGIN - 2, CONTENT_W + 4, A4_H - MARGIN * 2 + 4);
  };

  const ensureSpace = (needed: number) => {
    if (currentY + needed > A4_H - MARGIN) {
      pdf.addPage();
      pageNum++;
      currentY = MARGIN;
    }
  };

  // === HEADER ===
  // Gold header bar
  pdf.setFillColor(200, 150, 12); // GOLD
  pdf.rect(MARGIN, MARGIN, CONTENT_W, 18, "F");

  // Icon box
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(MARGIN + 4, MARGIN + 3, 12, 12, 2, 2, "F");
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(200, 150, 12);
  pdf.text("TC", MARGIN + 6.5, MARGIN + 10.5);

  // Title text
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("TCMG", MARGIN + 20, MARGIN + 8);

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(255, 255, 240);
  pdf.text("Tennant Creek Gold Mine - Full Asset Hierarchy", MARGIN + 20, MARGIN + 14);

  currentY = MARGIN + 22;

  // Type-based styling
  const typeStyles: Record<string, { fontSize: number; fontStyle: string; textColor: number[]; bgColor?: number[]; showBullet?: boolean; codeColor?: number[] }> = {
    site: { fontSize: 0, fontStyle: "bold", textColor: [26, 26, 26] }, // rendered as header
    facility: { fontSize: 11, fontStyle: "bold", textColor: [26, 26, 26], bgColor: [253, 248, 234] },
    area: { fontSize: 10, fontStyle: "bold", textColor: [26, 26, 26], codeColor: [200, 150, 12] },
    subArea: { fontSize: 9.5, fontStyle: "bold", textColor: [80, 80, 80] },
    parentAsset: { fontSize: 9, fontStyle: "bold", textColor: [60, 60, 60] },
    equipment: { fontSize: 8.5, fontStyle: "normal", textColor: [40, 40, 40], showBullet: true, codeColor: [120, 120, 120] },
    component: { fontSize: 8, fontStyle: "normal", textColor: [100, 100, 100], showBullet: true, codeColor: [150, 150, 150] },
  };

  // === RENDER ROWS ===
  for (const row of treeRows) {
    if (row.type === "site") continue; // already in header

    const style = typeStyles[row.type] || typeStyles.equipment;
    const indent = MARGIN + row.depth * INDENT;
    const rowHeight = row.type === "facility" ? LINE_H + 3 : LINE_H;

    ensureSpace(rowHeight + 1);

    // Background for facility rows
    if (style.bgColor) {
      pdf.setFillColor(style.bgColor[0], style.bgColor[1], style.bgColor[2]);
      pdf.rect(MARGIN, currentY - 1, CONTENT_W, rowHeight + 1, "F");
    }

    // Vertical tree line
    if (row.depth > 1) {
      pdf.setDrawColor(210, 210, 210);
      pdf.setLineWidth(0.3);
      const lineX = indent - 3;
      pdf.line(lineX, currentY - 0.5, lineX, currentY + rowHeight - 1);
      pdf.line(lineX, currentY + rowHeight / 2, indent - 0.5, currentY + rowHeight / 2);
    }

    // Bullet for equipment/component
    if (style.showBullet) {
      pdf.setFillColor(180, 180, 180);
      pdf.circle(indent - 1, currentY + rowHeight / 2, 0.6, "F");
    }

    let textX = indent + (style.showBullet ? 1.5 : 0);

    // Code badge
    if (row.code && style.codeColor && row.type === "area") {
      const codeWidth = pdf.getStringUnitWidth(row.code) * 7 / pdf.internal.scaleFactor + 4;
      pdf.setFillColor(200, 150, 12);
      pdf.roundedRect(textX, currentY - 0.5, codeWidth, rowHeight, 1, 1, "F");
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text(row.code, textX + 2, currentY + rowHeight / 2 + 0.5);
      textX += codeWidth + 2;
    } else if (row.code && row.type === "component") {
      const codeWidth = pdf.getStringUnitWidth(row.code) * 6 / pdf.internal.scaleFactor + 3;
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(textX, currentY, codeWidth, rowHeight - 1, 0.8, 0.8, "F");
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 120, 120);
      pdf.text(row.code, textX + 1.5, currentY + rowHeight / 2 + 0.3);
      textX += codeWidth + 1.5;
    }

    // Main label
    pdf.setFontSize(style.fontSize);
    pdf.setFont("helvetica", style.fontStyle as any);
    pdf.setTextColor(style.textColor[0], style.textColor[1], style.textColor[2]);

    // Truncate if too long
    const maxWidth = MARGIN + CONTENT_W - textX - (row.badgeText ? 30 : 2);
    let label = row.label;
    while (pdf.getStringUnitWidth(label) * style.fontSize / pdf.internal.scaleFactor > maxWidth && label.length > 10) {
      label = label.slice(0, -4) + "...";
    }
    pdf.text(label, textX, currentY + rowHeight / 2 + 1);

    // Badge (right-aligned)
    if (row.badgeText) {
      const badgeWidth = pdf.getStringUnitWidth(row.badgeText) * 6.5 / pdf.internal.scaleFactor + 5;
      const badgeX = MARGIN + CONTENT_W - badgeWidth - 1;
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(248, 248, 248);
      pdf.roundedRect(badgeX, currentY + 0.3, badgeWidth, rowHeight - 1, 1, 1, "FD");
      pdf.setFontSize(6.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(row.badgeText, badgeX + 2.5, currentY + rowHeight / 2 + 0.5);
    }

    currentY += rowHeight + 0.5;
  }

  // === Footer on every page ===
  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    addPageBorder(p);
    pdf.setPage(p);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(150, 150, 150);
    pdf.text(`TCMG Asset Hierarchy | Page ${p} of ${totalPages}`, MARGIN, A4_H - MARGIN + 5);
    const date = new Date().toLocaleDateString("en-AU");
    pdf.text(`Generated: ${date}`, MARGIN + CONTENT_W - 30, A4_H - MARGIN + 5);
  }

  const blob = pdf.output("blob");
  await uploadAndShowPdf(blob, "TCMG_Asset_Tree_Hierarchy.pdf");
  return blob;
}
