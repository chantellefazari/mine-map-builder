import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";

// Pre-load the Gravotech LS100 image as base64 for PDF embedding
let gravoImageBase64: string | null = null;

(async () => {
  try {
    const resp = await fetch("/images/gravotech-ls100.png");
    const blob = await resp.blob();
    const reader = new FileReader();
    reader.onloadend = () => { gravoImageBase64 = reader.result as string; };
    reader.readAsDataURL(blob);
  } catch { /* silent */ }
})();

interface TaggedAsset {
  asset_name: string;
  asset_number: string;
  parent_asset_label: string;
  pid_tags: string[];
  area_label: string;
  sub_area: string;
  functional_location: string | null;
}

interface ProductionTag {
  assetName: string;
  assetNumber: string;
  pidTag: string;
  parentSystem: string;
  tagType: "A" | "B";
  tagSize: string;
  mountingLocation: string;
  mountingMethod: string;
  areaLabel: string;
  subArea: string;
  functionalLocation: string;
  tagInstalled: boolean;
}

// ── Colours ──
const GOLD: [number, number, number] = [212, 160, 23];
const DARK: [number, number, number] = [17, 17, 17];
const MUTED: [number, number, number] = [100, 100, 100];
const HEADER_BG: [number, number, number] = [245, 240, 224];
const LIGHT_BG: [number, number, number] = [250, 250, 250];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_LEFT = MARGIN + 4; // consistent left edge for all body content
const CONTENT_W = PAGE_W - MARGIN - CONTENT_LEFT; // max text width
const BULLET_DOT = CONTENT_LEFT + 2;
const BULLET_TEXT = CONTENT_LEFT + 7;
const BULLET_TEXT_W = PAGE_W - MARGIN - BULLET_TEXT;
const BOTTOM_SAFE = PAGE_H - MARGIN - 8;

function inferAssetType(pidTag: string): string {
  const t = pidTag.toUpperCase();
  if (/PU-/.test(t)) return "Pump";
  if (/TK-/.test(t)) return "Tank";
  if (/CV-|BC-|FE-/.test(t)) return "Conveyor";
  if (/ML-/.test(t)) return "Mill";
  if (/AG-/.test(t)) return "Agitator";
  if (/PB-/.test(t)) return "Hopper";
  if (/CH-/.test(t)) return "Chute";
  if (/SS-/.test(t)) return "Screen";
  if (/CY-/.test(t)) return "Cyclone";
  if (/CP-/.test(t)) return "Compressor";
  if (/AR-/.test(t)) return "Air Receiver";
  if (/LS-/.test(t)) return "Lube System";
  if (/FA-/.test(t)) return "Fan";
  if (/FL-/.test(t)) return "Filter";
  if (/EW-/.test(t)) return "Electrowinning";
  return "Equipment";
}

/** Ensure y is within safe zone, else add page */
function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
  if (y + needed > BOTTOM_SAFE) {
    pdf.addPage();
    return MARGIN + 4;
  }
  return y;
}

/** Upload PDF to storage and show in inline viewer modal */
async function triggerPdfDownload(pdf: jsPDF, filename: string, title?: string) {
  const blob = pdf.output("blob");
  await uploadAndShowPdf(blob, filename, title || filename.replace(/_/g, " ").replace(".pdf", ""));
}

function addDocHeader(pdf: jsPDF, title: string, subtitle: string) {
  const w = pdf.internal.pageSize.getWidth();

  // Gold top bar
  pdf.setFillColor(...GOLD);
  pdf.rect(0, 0, w, 3, "F");

  // Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(...DARK);
  pdf.text(title, MARGIN, 18);

  // Subtitle
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...MUTED);
  pdf.text(subtitle, MARGIN, 24);

  // Doc ref line
  pdf.text(
    `TCMG-ROLLOUT-001  |  Rev 2.0  |  ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}`,
    MARGIN, 29
  );

  // Scope badge
  const badgeX = w - 65;
  const badgeY = 10;
  const badgeW = 50;
  const badgeH = 7;
  pdf.setFillColor(255, 193, 7);
  pdf.roundedRect(badgeX, badgeY, badgeW, badgeH, 1, 1, "F");
  pdf.setFontSize(7);
  pdf.setTextColor(80, 50, 0);
  pdf.text("Processing Plant Only", badgeX + badgeW / 2, badgeY + badgeH / 2 + 0.3, { align: "center" });

  // Divider
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, 33, w - MARGIN, 33);

  return 40;
}

function addSectionTitle(pdf: jsPDF, y: number, number: string, title: string): number {
  y = ensureSpace(pdf, y, 14);

  // Gold accent bar
  pdf.setFillColor(...GOLD);
  pdf.rect(MARGIN, y - 3, 2, 8, "F");

  // Section number + title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(...DARK);
  pdf.text(`${number}  ${title}`, CONTENT_LEFT, y + 2);

  return y + 12;
}

function addParagraph(pdf: jsPDF, y: number, text: string, maxW?: number): number {
  const textWidth = maxW || CONTENT_W;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...MUTED);
  const lines = pdf.splitTextToSize(text, textWidth);
  for (const line of lines) {
    y = ensureSpace(pdf, y, 5);
    pdf.text(line, CONTENT_LEFT, y);
    y += 4;
  }
  return y + 3;
}

function addBullets(pdf: jsPDF, y: number, items: string[]): number {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...DARK);
  for (const item of items) {
    const lines = pdf.splitTextToSize(item, BULLET_TEXT_W);
    y = ensureSpace(pdf, y, lines.length * 4 + 2);
    pdf.text("•", BULLET_DOT, y);
    for (let j = 0; j < lines.length; j++) {
      pdf.text(lines[j], BULLET_TEXT, y);
      y += 4;
    }
    y += 1;
  }
  return y + 2;
}

function addSubHeading(pdf: jsPDF, y: number, text: string): number {
  y = ensureSpace(pdf, y, 10);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  pdf.text(text, CONTENT_LEFT, y);
  return y + 6;
}

function addProConLabel(pdf: jsPDF, y: number, label: string, color: [number, number, number]): number {
  y = ensureSpace(pdf, y, 6);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...color);
  pdf.text(label, CONTENT_LEFT, y);
  return y + 4;
}

function addPageNumbers(pdf: jsPDF, label: string) {
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(7);
    pdf.setTextColor(...MUTED);
    pdf.text(`${label}  |  Page ${i} of ${totalPages}`, w / 2, h - 8, { align: "center" });
    pdf.setFillColor(...GOLD);
    pdf.rect(0, h - 3, w, 3, "F");
  }
}

const tblHead = { fillColor: HEADER_BG, textColor: DARK, fontStyle: "bold" as const, fontSize: 7, cellPadding: 2.5 };
const tblBody = { fontSize: 7, textColor: DARK, cellPadding: 2 };
const tblAlt = { fillColor: LIGHT_BG };
const tblMargin = { left: CONTENT_LEFT, right: MARGIN };

// ════════════════════════════════════════════════
// 1. MAIN ROLLOUT PLAN PDF (Sections 01–12)
// ════════════════════════════════════════════════
export async function generateRolloutPlanPDF(
  taggedAssetCount: number,
  productionTagCount: number,
  typeACount: number,
  typeBCount: number
) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = addDocHeader(pdf, "Asset Tag Rollout Plan", "Processing Plant — Tennant Mines Gold");

  // ── 01 TAGGING CRITERIA ──
  y = addSectionTitle(pdf, y, "01", "TAGGING CRITERIA");
  y = addParagraph(pdf, y, "Physical asset tags are issued exclusively to equipment that has a linked P&ID equipment tag.");
  y = addBullets(pdf, y, [
    "Only assets with a linked P&ID tag number will receive a physical asset tag",
    "Assets without P&ID references are excluded from the tagging program",
    "Tag numbers must match the asset number used in the asset register and P&ID",
    "The P&ID Tagged Asset Register is the sole source of truth for the tagging scope",
    "System headers, functional locations, and Level 7 sub-components without their own P&ID tag are excluded",
  ]);

  // ── 02 TAG MOUNTING PHILOSOPHY ──
  y = addSectionTitle(pdf, y, "02", "TAG MOUNTING PHILOSOPHY");
  y = addParagraph(pdf, y, "Asset tags represent the P&ID equipment POSITION, not the removable equipment itself. Tags must be mounted on the fixed structure at the equipment connection point so they remain correct when pumps, motors, gearboxes or instruments are replaced.");
  y = addParagraph(pdf, y, "MOUNT ON: Equipment frames, baseplates, pipe supports, skids, handrails, structural steel, tank shells, conveyor stringers.");
  y = addParagraph(pdf, y, "NEVER ON: Pumps, motors, gearboxes, instruments, valves, or any equipment that may be removed for repair or replacement.");

  // ── 03 TAG CATEGORIES ──
  y = addSectionTitle(pdf, y, "03", "TAG CATEGORIES");
  autoTable(pdf, {
    startY: y,
    headStyles: tblHead, bodyStyles: tblBody, alternateRowStyles: tblAlt, theme: "grid", margin: tblMargin,
    head: [["", "Type A — Major Asset Plates", "Type B — Equipment Position Tags"]],
    body: [
      ["Plate Style", "Flat plate, no hole", "Smaller tag, single hole"],
      ["Mounting", "Adhesive or rivet to asset shell/frame", "Bolt or cable tie to nearby structure"],
      ["Examples", "Tanks, Conveyors, Crushers, Mills, Thickeners, Hoppers, Chutes, Cyclones, Filter Presses", "Pumps, Valves, Motors, Instruments, Agitators, Compressors, Screens, Generators"],
    ],
  });
  y = (pdf as any).lastAutoTable.finalY + 8;

  // ── 04 TAG MATERIAL OPTIONS ──
  y = addSectionTitle(pdf, y, "04", "TAG MATERIAL OPTIONS");
  autoTable(pdf, {
    startY: y,
    headStyles: tblHead, bodyStyles: tblBody, alternateRowStyles: tblAlt, theme: "grid", margin: tblMargin,
    head: [["Specification", "Option 1 — 316 Stainless Steel", "Option 2 — DuraBlack"]],
    body: [
      ["Type A Size", "100mm × 50mm × 1.5mm", "100mm × 40mm × 0.5mm"],
      ["Type B Size", "70mm × 25mm × 1.5mm", "80mm × 30mm × 0.5mm"],
      ["Material", "316 Stainless Steel — engraved", "DuraBlack — laser etched"],
      ["Price Estimate", "$7.20 per tag (500+ order)", "$4.65 per tag (500+ order)"],
      ["Durability", "Excellent — 10+ year lifespan, chemical resistant", "Very Good — UV/oil resistant, 5–8 years outdoor"],
      ["Best For", "Chemical areas, heavy wear zones", "General plant areas, cost-effective bulk orders"],
    ],
  });
  y = (pdf as any).lastAutoTable.finalY + 5;
  y = addParagraph(pdf, y, "Supplier: Trophy Central Alice Springs — quote provided for both options at 500+ quantity pricing.");
  y = addParagraph(pdf, y, "Recommendation: Use 316 Stainless Steel for chemical/reagent areas (Gold Room, CIL, Reagents). Use DuraBlack for general plant areas (Water, Compressed Air, Comminution) to reduce cost while maintaining durability.");

  // ── 05 ASSET TAG PRODUCTION OPTIONS ── (force new page)
  pdf.addPage();
  y = MARGIN + 4;
  y = addSectionTitle(pdf, y, "05", "ASSET TAG PRODUCTION OPTIONS");
  y = addParagraph(pdf, y, "Management may choose between outsourcing tag production to a specialist supplier or purchasing equipment for internal on-demand production. Both approaches are viable.");

  // Option 1
  y = addSubHeading(pdf, y, "Option 1 — Outsource Tag Production");
  autoTable(pdf, {
    startY: y,
    headStyles: tblHead, bodyStyles: tblBody, alternateRowStyles: tblAlt, theme: "grid", margin: tblMargin,
    head: [["Specification", "Detail"]],
    body: [
      ["Supplier", "Trophy Central — Alice Springs"],
      ["Materials", "316 Stainless Steel (engraved) / DuraBlack (laser etched)"],
      ["Pricing (500+ qty)", "Stainless Steel: $7.20 per tag  |  DuraBlack: $4.65 per tag"],
    ],
  });
  y = (pdf as any).lastAutoTable.finalY + 5;

  y = addProConLabel(pdf, y, "Pros:", [34, 120, 60]);
  y = addBullets(pdf, y, [
    "No capital equipment required",
    "Professional engraving quality",
    "Quick production turnaround",
  ]);

  y = addProConLabel(pdf, y, "Cons:", [180, 50, 50]);
  y = addBullets(pdf, y, [
    "Ongoing cost per tag for every order",
    "Lead time for additional or replacement tags",
  ]);

  // Option 2
  y = addSubHeading(pdf, y, "Option 2 — In-House Tag Production");
  autoTable(pdf, {
    startY: y,
    headStyles: tblHead, bodyStyles: tblBody, alternateRowStyles: tblAlt, theme: "grid", margin: tblMargin,
    head: [["Specification", "Detail"]],
    body: [
      ["Equipment", "Gravotech LS100 Laser Engraver"],
      ["Website", "https://www.gravotech.com.au/products/laser-engravers-laser-cutters/ls100"],
      ["Capability", "CO₂ laser engraver and cutter. Suitable for asset tags, industrial signage, stainless plates and laminates."],
      ["Investment", "Capital equipment purchase + consumables (plates, laminates)"],
    ],
  });
  y = (pdf as any).lastAutoTable.finalY + 5;

  y = addProConLabel(pdf, y, "Pros:", [34, 120, 60]);
  y = addBullets(pdf, y, [
    "Immediate production of tags with no supplier lead time",
    "Ability to create tags when new assets are installed",
    "Can produce additional labels and signage for site",
  ]);

  y = addProConLabel(pdf, y, "Cons:", [180, 50, 50]);
  y = addBullets(pdf, y, [
    "Initial capital equipment purchase required",
    "Operator training required",
  ]);

  // Gravotech LS100 image
  if (gravoImageBase64) {
    y = ensureSpace(pdf, y, 58);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(...MUTED);
    pdf.text("Gravotech LS100 Laser Engraver", CONTENT_LEFT, y);
    y += 3;
    try {
      pdf.addImage(gravoImageBase64, "PNG", CONTENT_LEFT, y, 80, 50);
      y += 54;
    } catch { /* image embed failed silently */ }
  }

  y = addParagraph(pdf, y, "Recommendation: Outsource the first batch (lowest risk). Evaluate in-house production for ongoing requirements. A hybrid approach — outsource the first batch, then transition to in-house — is also viable.");

  // ── 06 TAG NUMBERING ──
  y = addSectionTitle(pdf, y, "06", "TAG NUMBERING");
  y = addParagraph(pdf, y, "Tag numbers are derived directly from the asset register. No independent numbering systems are permitted.");
  y = addBullets(pdf, y, [
    "Tag number = Asset Number from the approved asset register (e.g. BM01, CFP01-PA01, THYD01-PMP01)",
    "The P&ID tag is shown as a secondary reference where space permits",
    "No site-local numbering, ad-hoc labels, or sequential tag numbers permitted",
    "If an asset is renumbered in the register, the physical tag must be replaced",
  ]);

  // Tag layout mockups
  y = ensureSpace(pdf, y, 34);
  const tagBoxW = 78;
  const tagBoxH = 24;
  const tagBoxGap = 10;

  // Type A mockup
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  pdf.text("TYPE A TAG LAYOUT", CONTENT_LEFT, y);
  y += 3;
  pdf.setDrawColor(60, 60, 60);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(CONTENT_LEFT, y, tagBoxW, tagBoxH, 2, 2, "S");
  pdf.setDrawColor(120, 120, 120);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(CONTENT_LEFT + 3, y + 2, tagBoxW - 6, tagBoxH - 4, 1, 1, "S");
  pdf.setFont("courier", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(...DARK);
  pdf.text("BM01", CONTENT_LEFT + tagBoxW / 2, y + 10, { align: "center" });
  pdf.setFont("courier", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...MUTED);
  pdf.text("Primary Ball Mill", CONTENT_LEFT + tagBoxW / 2, y + 17, { align: "center" });

  // Type B mockup
  const tagBX = CONTENT_LEFT + tagBoxW + tagBoxGap;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  pdf.text("TYPE B TAG LAYOUT", tagBX, y - 3);
  pdf.setDrawColor(60, 60, 60);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(tagBX, y, tagBoxW, tagBoxH, 2, 2, "S");
  pdf.setDrawColor(120, 120, 120);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(tagBX + 3, y + 2, tagBoxW - 6, tagBoxH - 4, 1, 1, "S");
  pdf.setFont("courier", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(...DARK);
  pdf.text("CFP01-PA01", tagBX + tagBoxW / 2, y + 10, { align: "center" });
  pdf.setFont("courier", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  pdf.text("Cyclone Feed Pump (Duty)", tagBX + tagBoxW / 2, y + 17, { align: "center" });

  y += tagBoxH + 8;

  // ── 07 TAG INSTALLATION WORKFLOW ──
  y = addSectionTitle(pdf, y, "07", "TAG INSTALLATION WORKFLOW");
  y = addBullets(pdf, y, [
    "Step 1 — Generate P&ID Asset Register from the database (see Attachment A)",
    "Step 2 — Produce Tag Production List with Type A/B classification and mounting details (see Attachment B)",
    "Step 3 — Manufacture tags: submit production list to supplier or produce in-house per Section 05",
    "Step 4 — Install tags during field verification. Photograph each installed tag showing Asset ID and context.",
    "Step 5 — Update asset record with 'Tag Installed' status and upload confirmation photo",
  ]);
  y = addParagraph(pdf, y, "CRITICAL RULE: No tag shall be applied without a matching system record and confirmed P&ID reference. If the asset is not in the register or has no P&ID tag — STOP, do not tag.");

  // ── 08 PRE-ROLLOUT REQUIREMENTS ──
  y = addSectionTitle(pdf, y, "08", "PRE-ROLLOUT REQUIREMENTS — GATE 1");
  y = addParagraph(pdf, y, "All items below must be confirmed and signed off before any physical tagging commences.");
  y = addBullets(pdf, y, [
    "Final approved Processing Plant asset tree exported and locked",
    "P&IDs reviewed and validated against asset tree (14-page set verified)",
    "Asset IDs frozen — no renumbering permitted during rollout",
    "Tag material option selected and supplier confirmed",
    "Tag production list generated with Type A/B classification",
    "Manufacturing order placed and delivery date confirmed",
    "Rollout sequence agreed with maintenance supervisor",
    "Field tagging crew briefed on mounting philosophy and QC requirements",
  ]);
  y = addParagraph(pdf, y, "Gate 1 Sign-off Required By: Maintenance Superintendent + Asset Owner");

  // ── 09 QUALITY CONTROL ──
  y = addSectionTitle(pdf, y, "09", "QUALITY CONTROL");
  y = addBullets(pdf, y, [
    "Maintenance supervisor sign-off required per area before proceeding to next zone",
    "Random audit of minimum 10% of tagged assets per area",
    "Cross-check all installed tags against the P&ID Tagged Asset Register",
    "Confirm zero duplicated Asset IDs across all tagged positions",
    "Confirm no assets on the production list are missing a physical tag",
    "Photo evidence reviewed and linked to system record for audited assets",
    "Verify tags are mounted on fixed structure, not on replaceable equipment",
    "Confirm tag text matches asset register exactly (no abbreviations or variations)",
  ]);

  // ── 10 SAFETY CONSIDERATIONS ──
  y = addSectionTitle(pdf, y, "10", "SAFETY CONSIDERATIONS");
  y = addBullets(pdf, y, [
    "Apply LOTO (Lockout/Tagout) before tagging any asset near rotating or energised equipment",
    "No tagging during active plant operation unless the asset and access point are confirmed safe",
    "PPE requirements: Safety glasses, gloves, steel cap boots, high-vis vest at all times",
    "Ladder use must comply with site ladder management procedure — two-person rule applies",
    "Do not tag hot surfaces — allow equipment to cool before working in proximity",
    "Chemical areas (reagents, cyanide) — wear chemical-resistant gloves and face shield",
  ]);

  // ── 11 COMPLETION DELIVERABLES ──
  y = addSectionTitle(pdf, y, "11", "COMPLETION DELIVERABLES");
  y = addParagraph(pdf, y, "The following must be produced and filed upon rollout completion.");
  y = addBullets(pdf, y, [
    "Tagged Asset Register — full list of every tagged asset with ID, description, location, and photo reference",
    "Completion Report — summary of tag counts, discrepancies resolved, QC audit results",
    "Before/After photo archive — organised by area",
    "Updated asset tree status — all tagged assets marked as 'Tagged — Verified' in system",
    "Signed close-out sheets for each area",
    "Outstanding items list — any deferred assets with justification and target completion date",
  ]);

  // ── 12 ATTACHMENTS ──
  y = addSectionTitle(pdf, y, "12", "ATTACHMENTS");
  y = addParagraph(pdf, y, "The following data registers are provided as separate PDF attachments to this rollout plan. These documents contain the full dataset required for tag manufacturing and field installation.");

  // Attachment A box
  const boxW = PAGE_W - MARGIN - CONTENT_LEFT;
  y = ensureSpace(pdf, y, 48);

  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(CONTENT_LEFT, y, boxW, 20, 2, 2, "F");
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.4);
  pdf.roundedRect(CONTENT_LEFT, y, boxW, 20, 2, 2, "S");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  pdf.text("Attachment A — P&ID Tagged Asset Register", CONTENT_LEFT + 5, y + 6);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  pdf.text(`${taggedAssetCount} assets with linked P&ID references. Source of truth for tagging scope.`, CONTENT_LEFT + 5, y + 12);
  pdf.text("File: TCMG_PID_Tagged_Asset_Register.pdf", CONTENT_LEFT + 5, y + 16);
  y += 24;

  // Attachment B box
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(CONTENT_LEFT, y, boxW, 20, 2, 2, "F");
  pdf.setDrawColor(...GOLD);
  pdf.roundedRect(CONTENT_LEFT, y, boxW, 20, 2, 2, "S");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  pdf.text("Attachment B — Asset Tag Production List", CONTENT_LEFT + 5, y + 6);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  pdf.text(`${productionTagCount} tags  |  Type A: ${typeACount}  |  Type B: ${typeBCount}. Manufacturing batch list.`, CONTENT_LEFT + 5, y + 12);
  pdf.text("File: TCMG_Asset_Tag_Production_List.pdf", CONTENT_LEFT + 5, y + 16);
  y += 26;

  // System Alignment Note
  y = ensureSpace(pdf, y, 24);
  pdf.setFillColor(245, 240, 224);
  pdf.roundedRect(CONTENT_LEFT, y, boxW, 20, 2, 2, "F");
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.4);
  pdf.roundedRect(CONTENT_LEFT, y, boxW, 20, 2, 2, "S");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(...DARK);
  pdf.text("SYSTEM ALIGNMENT NOTE", CONTENT_LEFT + 5, y + 5);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  const alignNote = "All asset hierarchy, functional locations, and system structure are stored within Minesite AI. The physical tag is for rapid visual identification only. Tag numbers match the asset register — no independent numbering systems exist. The tag rollout does not define or alter any system hierarchy.";
  const alignLines = pdf.splitTextToSize(alignNote, boxW - 10);
  let alignY = y + 9;
  for (const line of alignLines) { pdf.text(line, CONTENT_LEFT + 5, alignY); alignY += 3.5; }
  y += 24;

  // Scope reminder
  y = ensureSpace(pdf, y, 14);
  pdf.setFillColor(255, 248, 230);
  pdf.roundedRect(CONTENT_LEFT, y, boxW, 10, 2, 2, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(120, 80, 0);
  const scopeText = "⚠  Scope: Processing Plant ONLY. Crushing Plant excluded until P&IDs are finalised. Do not apply this rollout plan to crushing or mining equipment.";
  pdf.text(scopeText, CONTENT_LEFT + 4, y + 5);

  addPageNumbers(pdf, "TCMG Asset Tag Rollout Plan");
  await triggerPdfDownload(pdf, "TCMG_Asset_Tag_Rollout_Plan.pdf");
}

// ════════════════════════════════════════════════
// 2. ATTACHMENT A — P&ID TAGGED ASSET REGISTER PDF
// ════════════════════════════════════════════════
export async function generateAssetRegisterPDF(taggedAssets: TaggedAsset[]) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  let y = addDocHeader(pdf, "P&ID Tagged Asset Register", "Attachment A — Tennant Mines Gold");

  y = addParagraph(pdf, y, `${taggedAssets.length} assets with linked P&ID references. This register is the sole source of truth for the asset tag rollout scope. Only equipment listed here will receive a physical asset tag.`, 260);

  const rows = taggedAssets.map((a, i) => [
    i + 1,
    a.asset_number,
    a.asset_name,
    a.parent_asset_label,
    a.pid_tags.join("; "),
    inferAssetType(a.pid_tags[0] || ""),
    a.area_label,
    a.sub_area,
    a.functional_location || "",
  ]);

  autoTable(pdf, {
    startY: y,
    margin: { left: 10, right: 10 },
    head: [["#", "Asset Number", "Asset Name", "Parent System", "P&ID Tag", "Asset Type", "Area", "Sub-Area", "Location (FL)"]],
    body: rows,
    headStyles: { fillColor: [...HEADER_BG], textColor: [...DARK], fontStyle: "bold", fontSize: 7, cellPadding: 2 },
    bodyStyles: { fontSize: 6.5, textColor: [...DARK], cellPadding: 1.5 },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 24, font: "courier" },
      4: { cellWidth: 24, font: "courier" },
      5: { cellWidth: 22 },
      8: { cellWidth: 22, font: "courier" },
    },
    theme: "grid",
  });

  addPageNumbers(pdf, "TCMG P&ID Tagged Asset Register — Attachment A");
  await triggerPdfDownload(pdf, "TCMG_PID_Tagged_Asset_Register.pdf");
}

// ════════════════════════════════════════════════
// 3. ATTACHMENT B — ASSET TAG PRODUCTION LIST PDF
// ════════════════════════════════════════════════
export async function generateProductionListPDF(productionTags: ProductionTag[]) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const typeA = productionTags.filter(t => t.tagType === "A").length;
  const typeB = productionTags.filter(t => t.tagType === "B").length;

  let y = addDocHeader(pdf, "Asset Tag Production List", "Attachment B — Tennant Mines Gold");

  y = addParagraph(pdf, y, `${productionTags.length} tags total  |  Type A (Major Asset Plates): ${typeA}  |  Type B (Position Tags): ${typeB}`, 260);
  y = addParagraph(pdf, y, "Manufacturing batch list for tag production. Tags identify P&ID equipment positions — mount on fixed structure, never on replaceable equipment.", 260);

  const rows = productionTags.map((t, i) => [
    i + 1,
    t.assetNumber,
    t.assetName,
    t.pidTag,
    `Type ${t.tagType}`,
    t.tagSize,
    t.mountingLocation,
    t.mountingMethod,
    t.parentSystem,
    t.functionalLocation || `${t.areaLabel} > ${t.subArea}`,
    t.tagInstalled ? "Yes" : "No",
  ]);

  autoTable(pdf, {
    startY: y,
    margin: { left: 5, right: 5 },
    head: [["#", "Asset No.", "Asset Name", "P&ID Tag", "Type", "Tag Size", "Mounting Location", "Mounting Method", "Parent System", "Location", "Installed"]],
    body: rows,
    headStyles: { fillColor: [...HEADER_BG], textColor: [...DARK], fontStyle: "bold", fontSize: 6.5, cellPadding: 2 },
    bodyStyles: { fontSize: 6, textColor: [...DARK], cellPadding: 1.5 },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    columnStyles: {
      0: { cellWidth: 7 },
      1: { cellWidth: 20, font: "courier" },
      3: { cellWidth: 18, font: "courier" },
      4: { cellWidth: 14 },
      10: { cellWidth: 14, halign: "center" },
    },
    theme: "grid",
  });

  // Summary block
  y = (pdf as any).lastAutoTable.finalY + 8;
  const w = pdf.internal.pageSize.getWidth();
  if (y > pdf.internal.pageSize.getHeight() - 30) { pdf.addPage(); y = MARGIN; }
  pdf.setFillColor(...HEADER_BG);
  pdf.roundedRect(10, y - 3, w - 20, 18, 2, 2, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  pdf.text("PRODUCTION SUMMARY", 16, y + 2);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text(`Type A (Major Asset Plates): ${typeA}   |   Type B (Position Tags): ${typeB}   |   TOTAL TAGS: ${productionTags.length}`, 16, y + 8);
  pdf.text("Scope: Processing Plant ONLY — Crushing Plant excluded until P&IDs are finalised.", 16, y + 13);

  addPageNumbers(pdf, "TCMG Asset Tag Production List — Attachment B");
  await triggerPdfDownload(pdf, "TCMG_Asset_Tag_Production_List.pdf");
}
