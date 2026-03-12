/**
 * TCMG Asset Tree PDF Export — Landscape, Full Specifications
 * Parses the authoritative CSV and renders every level + all Level 7 specs.
 */

import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";

// ── CSV row interface ──────────────────────────────────────────────
interface CsvRow {
  level: number;
  site: string;
  facility: string;
  areaCode: string;
  areaName: string;
  subArea: string;
  system: string;
  systemFL: string;
  assetNumber: string;
  equipmentName: string;
  equipFL: string;
  equipPidTags: string;
  compCode: string;
  compType: string;
  compName: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  compPidTags: string;
  oilType: string;
  oilVolume: string;
  inputSpeed: string;
  outputSpeed: string;
  weight: string;
  motorSpeed: string;
  protection: string;
  voltage: string;
  pumpFlow: string;
  operatingPressure: string;
  displacement: string;
  motorRef: string;
  pumpRef: string;
}

// ── Tree row for PDF rendering ─────────────────────────────────────
interface TreeRow {
  depth: number;
  label: string;
  type: "site" | "facility" | "area" | "subArea" | "system" | "equipment" | "component";
  badge?: string;
  fl?: string;
  pidTags?: string;
  specs?: { key: string; value: string }[];
}

// ── Parse CSV text into CsvRow[] ───────────────────────────────────
function parseCsvText(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    // Handle quoted fields with commas inside
    const cols: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { cols.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    cols.push(current.trim());

    const level = parseInt(cols[0] || "0", 10);
    if (isNaN(level) || level < 1) continue;

    rows.push({
      level,
      site: cols[1] || "",
      facility: cols[2] || "",
      areaCode: cols[3] || "",
      areaName: cols[4] || "",
      subArea: cols[5] || "",
      system: cols[6] || "",
      systemFL: cols[7] || "",
      assetNumber: cols[8] || "",
      equipmentName: cols[9] || "",
      equipFL: cols[10] || "",
      equipPidTags: cols[11] || "",
      compCode: cols[12] || "",
      compType: cols[13] || "",
      compName: cols[14] || "",
      manufacturer: cols[15] || "",
      model: cols[16] || "",
      serialNumber: cols[17] || "",
      compPidTags: cols[18] || "",
      oilType: cols[19] || "",
      oilVolume: cols[20] || "",
      inputSpeed: cols[21] || "",
      outputSpeed: cols[22] || "",
      weight: cols[23] || "",
      motorSpeed: cols[24] || "",
      protection: cols[25] || "",
      voltage: cols[26] || "",
      pumpFlow: cols[27] || "",
      operatingPressure: cols[28] || "",
      displacement: cols[29] || "",
      motorRef: cols[30] || "",
      pumpRef: cols[31] || "",
    });
  }
  return rows;
}

// ── Build spec list from a Level 7 row ────────────────────────────
function buildSpecs(r: CsvRow): { key: string; value: string }[] {
  const specs: { key: string; value: string }[] = [];
  const add = (k: string, v: string) => { if (v) specs.push({ key: k, value: v }); };
  add("Manufacturer", r.manufacturer);
  add("Model", r.model);
  add("Serial No", r.serialNumber);
  add("Oil Type", r.oilType);
  add("Oil Volume", r.oilVolume);
  add("Input Speed", r.inputSpeed);
  add("Output Speed", r.outputSpeed);
  add("Weight", r.weight);
  add("Motor Speed", r.motorSpeed);
  add("Protection", r.protection);
  add("Voltage", r.voltage);
  add("Pump Flow", r.pumpFlow);
  add("Operating Pressure", r.operatingPressure);
  add("Displacement", r.displacement);
  add("Motor Ref", r.motorRef);
  add("Pump Ref", r.pumpRef);
  return specs;
}

// ── Flatten CSV rows into tree rows ───────────────────────────────
function flattenCsvToTree(csvRows: CsvRow[]): TreeRow[] {
  const tree: TreeRow[] = [];

  for (const r of csvRows) {
    switch (r.level) {
      case 1:
        tree.push({ depth: 0, label: r.site, type: "site", badge: "Tennant Creek Gold Mine" });
        break;
      case 2:
        tree.push({ depth: 1, label: r.facility, type: "facility" });
        break;
      case 3:
        tree.push({ depth: 2, label: `${r.areaCode} - ${r.areaName}`, type: "area", badge: r.areaCode });
        break;
      case 4:
        tree.push({ depth: 3, label: r.subArea, type: "subArea" });
        break;
      case 5:
        tree.push({ depth: 4, label: r.system, type: "system", fl: r.systemFL || undefined });
        break;
      case 6:
        tree.push({
          depth: 5,
          label: `${r.assetNumber} - ${r.equipmentName}`,
          type: "equipment",
          fl: r.equipFL || undefined,
          pidTags: r.equipPidTags || undefined,
        });
        break;
      case 7: {
        const specs = buildSpecs(r);
        const compLabel = r.compCode
          ? `${r.compCode} - ${r.compName}`
          : r.compName;
        tree.push({
          depth: 6,
          label: compLabel,
          type: "component",
          badge: r.compType || undefined,
          pidTags: r.compPidTags || undefined,
          specs: specs.length > 0 ? specs : undefined,
        });
        break;
      }
    }
  }
  return tree;
}

// ── Colours ────────────────────────────────────────────────────────
const GOLD = [200, 150, 12] as const;
const WHITE = [255, 255, 255] as const;
const DARK = [26, 26, 26] as const;
const LIGHT_GOLD_BG = [253, 248, 234] as const;

// ── Export function ────────────────────────────────────────────────
export async function exportAssetTreePDF() {
  // Fetch live data from database (single source of truth)
  const { generateProcessingPlantCSVContent } = await import("@/utils/exportProcessingPlantCSV");
  const csvText = await generateProcessingPlantCSVContent();
  const csvRows = parseCsvText(csvText);
  const treeRows = flattenCsvToTree(csvRows);

  const jsPDF = (await import("jspdf")).default;

  // Landscape A4
  const PAGE_W = 297;
  const PAGE_H = 210;
  const MARGIN = 10;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const INDENT_STEP = 7;
  const LINE_H = 4.8;
  const SPEC_LINE_H = 3.8;

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  let y = MARGIN;
  let pageNum = 1;

  const addPageBorder = (p: number) => {
    pdf.setPage(p);
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.35);
    pdf.rect(MARGIN - 2, MARGIN - 2, CONTENT_W + 4, PAGE_H - MARGIN * 2 + 4);
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      pdf.addPage();
      pageNum++;
      y = MARGIN;
    }
  };

  // === HEADER BAR ===
  pdf.setFillColor(...GOLD);
  pdf.rect(MARGIN, MARGIN, CONTENT_W, 16, "F");

  // Icon box
  pdf.setFillColor(...WHITE);
  pdf.roundedRect(MARGIN + 4, MARGIN + 2.5, 11, 11, 2, 2, "F");
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...GOLD);
  pdf.text("TC", MARGIN + 6.2, MARGIN + 9);

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...WHITE);
  pdf.text("TCMG Asset Hierarchy - Full Specification Register", MARGIN + 19, MARGIN + 7.5);

  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(255, 255, 230);
  pdf.text("Tennant Creek Gold Mine | Processing Plant | All 7 Levels | Landscape Format", MARGIN + 19, MARGIN + 12.5);

  // Generated date
  const dateStr = new Date().toLocaleDateString("en-AU");
  pdf.setFontSize(7);
  pdf.setTextColor(255, 255, 230);
  pdf.text(`Generated: ${dateStr}`, MARGIN + CONTENT_W - 35, MARGIN + 12.5);

  y = MARGIN + 19;

  // === TYPE STYLES ===
  interface TypeStyle {
    fontSize: number;
    fontStyle: string;
    color: readonly [number, number, number] | number[];
    bg?: readonly [number, number, number] | number[];
    bullet?: boolean;
  }

  const styles: Record<string, TypeStyle> = {
    site:      { fontSize: 0, fontStyle: "bold", color: DARK },
    facility:  { fontSize: 10, fontStyle: "bold", color: DARK, bg: LIGHT_GOLD_BG },
    area:      { fontSize: 9.5, fontStyle: "bold", color: DARK },
    subArea:   { fontSize: 9, fontStyle: "bold", color: [80, 80, 80] },
    system:    { fontSize: 8.5, fontStyle: "bold", color: [60, 60, 60] },
    equipment: { fontSize: 8, fontStyle: "normal", color: [40, 40, 40], bullet: true },
    component: { fontSize: 7.5, fontStyle: "normal", color: [100, 100, 100], bullet: true },
  };

  // === RENDER ROWS ===
  for (const row of treeRows) {
    if (row.type === "site") continue; // rendered in header

    const style = styles[row.type] || styles.equipment;
    const indent = MARGIN + row.depth * INDENT_STEP;

    // Calculate needed height: base + FL line + PID line + specs
    let neededH = LINE_H + 1;
    if (row.fl) neededH += SPEC_LINE_H;
    if (row.pidTags) neededH += SPEC_LINE_H;
    if (row.specs) neededH += row.specs.length * SPEC_LINE_H;

    const rowH = style.bg ? LINE_H + 2 : LINE_H;
    ensureSpace(neededH);

    // Background
    if (style.bg) {
      pdf.setFillColor(style.bg[0], style.bg[1], style.bg[2]);
      pdf.rect(MARGIN, y - 1, CONTENT_W, rowH + 1, "F");
    }

    // Tree connector lines
    if (row.depth > 1) {
      pdf.setDrawColor(210, 210, 210);
      pdf.setLineWidth(0.25);
      const lineX = indent - 3;
      pdf.line(lineX, y - 0.5, lineX, y + rowH - 1);
      pdf.line(lineX, y + rowH / 2, indent - 0.5, y + rowH / 2);
    }

    // Bullet
    if (style.bullet) {
      pdf.setFillColor(180, 180, 180);
      pdf.circle(indent - 1, y + rowH / 2, 0.5, "F");
    }

    let textX = indent + (style.bullet ? 1.5 : 0);

    // Area code badge
    if (row.type === "area" && row.badge) {
      const bw = pdf.getStringUnitWidth(row.badge) * 7 / pdf.internal.scaleFactor + 4;
      pdf.setFillColor(...GOLD);
      pdf.roundedRect(textX, y - 0.3, bw, rowH, 1, 1, "F");
      pdf.setFontSize(6.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...WHITE);
      pdf.text(row.badge, textX + 2, y + rowH / 2 + 0.5);
      textX += bw + 2;
    }

    // Component type badge
    if (row.type === "component" && row.badge) {
      const bw = pdf.getStringUnitWidth(row.badge) * 5.5 / pdf.internal.scaleFactor + 3;
      pdf.setFillColor(235, 235, 235);
      pdf.roundedRect(textX, y + 0.2, bw, rowH - 1, 0.7, 0.7, "F");
      pdf.setFontSize(5.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 120, 120);
      pdf.text(row.badge, textX + 1.5, y + rowH / 2 + 0.3);
      textX += bw + 1.5;
    }

    // Main label
    pdf.setFontSize(style.fontSize);
    pdf.setFont("helvetica", style.fontStyle as any);
    pdf.setTextColor(style.color[0], style.color[1], style.color[2]);

    // Truncate if too long
    const maxLabelW = MARGIN + CONTENT_W - textX - 2;
    let label = row.label;
    while (pdf.getStringUnitWidth(label) * style.fontSize / pdf.internal.scaleFactor > maxLabelW && label.length > 10) {
      label = label.slice(0, -4) + "...";
    }
    pdf.text(label, textX, y + rowH / 2 + 1);

    y += rowH + 0.3;

    // FL code (smaller, indented further)
    if (row.fl) {
      ensureSpace(SPEC_LINE_H + 1);
      const flX = indent + (style.bullet ? 3 : 2);
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(130, 130, 130);
      pdf.text(`FL: ${row.fl}`, flX, y + SPEC_LINE_H / 2 + 0.5);
      y += SPEC_LINE_H;
    }

    // P&ID tags
    if (row.pidTags) {
      ensureSpace(SPEC_LINE_H + 1);
      const tagX = indent + (style.bullet ? 3 : 2);
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(50, 100, 180);
      pdf.text(`P&ID: ${row.pidTags}`, tagX, y + SPEC_LINE_H / 2 + 0.5);
      y += SPEC_LINE_H;
    }

    // Level 7 specifications
    if (row.specs && row.specs.length > 0) {
      const specX = indent + (style.bullet ? 3 : 2);
      for (const spec of row.specs) {
        ensureSpace(SPEC_LINE_H + 1);
        pdf.setFontSize(5.8);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(140, 140, 140);
        pdf.text(`${spec.key}: `, specX, y + SPEC_LINE_H / 2 + 0.5);
        const keyWidth = pdf.getStringUnitWidth(`${spec.key}: `) * 5.8 / pdf.internal.scaleFactor;
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80, 80, 80);
        pdf.text(spec.value, specX + keyWidth, y + SPEC_LINE_H / 2 + 0.5);
        y += SPEC_LINE_H;
      }
    }
  }

  // === FOOTER on every page ===
  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    addPageBorder(p);
    pdf.setPage(p);
    pdf.setFontSize(6.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(150, 150, 150);
    pdf.text(`TCMG Asset Hierarchy - Full Specification Register | Page ${p} of ${totalPages}`, MARGIN, PAGE_H - MARGIN + 5);
    pdf.text(`Generated: ${dateStr}`, MARGIN + CONTENT_W - 30, PAGE_H - MARGIN + 5);
  }

  const blob = pdf.output("blob");
  await uploadAndShowPdf(blob, "TCMG_Asset_Tree_Full_Hierarchy.pdf");
  return blob;
}
