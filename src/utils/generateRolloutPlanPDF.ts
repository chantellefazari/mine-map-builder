import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

// Pre-load the Gravotech LS100 image as base64 for PDF embedding
let gravoImageBase64: string | null = null;
const gravoImagePromise = (async () => {
  try {
    const resp = await fetch("/images/gravotech-ls100.png");
    const blob = await resp.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    }).then((d) => { gravoImageBase64 = d; });
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

const PAGE_H = 297;
const MARGIN = 15;
const BOTTOM_SAFE = PAGE_H - MARGIN - 5; // safe zone before footer

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
    return MARGIN;
  }
  return y;
}

/** Download PDF file using file-saver for sandbox compatibility */
function triggerPdfDownload(pdf: jsPDF, filename: string) {
  const blob = pdf.output("blob");
  saveAs(blob, filename);
}

function addDocHeader(pdf: jsPDF, title: string, subtitle: string) {
  const w = pdf.internal.pageSize.getWidth();
  pdf.setFillColor(...GOLD);
  pdf.rect(0, 0, w, 3, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(...DARK);
  pdf.text(title, MARGIN, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...MUTED);
  pdf.text(subtitle, MARGIN, 24);
  pdf.text(
    `TCMG-ROLLOUT-001  |  Rev 2.0  |  ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}`,
    MARGIN, 29
  );

  pdf.setFillColor(255, 193, 7);
  pdf.roundedRect(w - 65, 10, 50, 7, 1, 1, "F");
  pdf.setFontSize(7);
  pdf.setTextColor(80, 50, 0);
  pdf.text("Processing Plant Only", w - 63, 15);

  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, 33, w - MARGIN, 33);

  return 38;
}

function addSectionTitle(pdf: jsPDF, y: number, number: string, title: string): number {
  y = ensureSpace(pdf, y, 14);
  pdf.setFillColor(...GOLD);
  pdf.rect(MARGIN, y - 3, 2, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(...DARK);
  pdf.text(`${number}  ${title}`, MARGIN + 5, y + 2);
  return y + 10;
}

function addParagraph(pdf: jsPDF, y: number, text: string, maxW = 180): number {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...MUTED);
  const lines = pdf.splitTextToSize(text, maxW);
  for (const line of lines) {
    y = ensureSpace(pdf, y, 5);
    pdf.text(line, MARGIN, y);
    y += 4;
  }
  return y + 2;
}

function addBullets(pdf: jsPDF, y: number, items: string[]): number {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...DARK);
  for (const item of items) {
    const lines = pdf.splitTextToSize(item, 170);
    // Check if the entire bullet (all its lines) fits
    y = ensureSpace(pdf, y, lines.length * 4 + 2);
    pdf.text("•", MARGIN + 3, y);
    for (const line of lines) {
      pdf.text(line, MARGIN + 8, y);
      y += 4;
    }
    y += 1;
  }
  return y + 2;
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

const tblHead = { fillColor: HEADER_BG, textColor: DARK, fontStyle: "bold" as const, fontSize: 7 };
const tblBody = { fontSize: 7, textColor: DARK };
const tblAlt = { fillColor: LIGHT_BG };
const tblMargin = { left: MARGIN, right: MARGIN };

// ════════════════════════════════════════════════
// 1. MAIN ROLLOUT PLAN PDF (Sections 01–13, no data tables)
// ════════════════════════════════════════════════
export async function generateRolloutPlanPDF(
  taggedAssetCount: number,
  productionTagCount: number,
  typeACount: number,
  typeBCount: number
) {
  console.log("[PDF] Step 0: awaiting gravoImagePromise");
  await gravoImagePromise;
  console.log("[PDF] Step 1: creating jsPDF instance");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  console.log("[PDF] Step 2: adding doc header");
  let y = addDocHeader(pdf, "Asset Tag Rollout Plan", "Processing Plant - Tennant Mines Gold");

  // 01
  y = addSectionTitle(pdf, y, "01", "TAGGING CRITERIA");
  y = addParagraph(pdf, y, "Physical asset tags are issued exclusively to equipment that has a linked P&ID equipment tag.");
  y = addBullets(pdf, y, [
    "Only assets with a linked P&ID tag number will receive a physical asset tag",
    "Assets without P&ID references are excluded from the tagging program",
    "Tag numbers must match the asset number used in the asset register and P&ID",
    "The P&ID Tagged Asset Register is the sole source of truth for the tagging scope",
    "System headers, functional locations, and Level 7 sub-components without their own P&ID tag are excluded",
  ]);

  // 02
  y = addSectionTitle(pdf, y, "02", "TAG MOUNTING PHILOSOPHY");
  y = addParagraph(pdf, y, "Asset tags represent the P&ID equipment POSITION, not the removable equipment itself. Tags must be mounted on the fixed structure at the equipment connection point so they remain correct when pumps, motors, gearboxes or instruments are replaced.");
  y = addParagraph(pdf, y, "MOUNT ON: Equipment frames, baseplates, pipe supports, skids, handrails, structural steel, tank shells, conveyor stringers.");
  y = addParagraph(pdf, y, "NEVER ON: Pumps, motors, gearboxes, instruments, valves, or any equipment that may be removed for repair or replacement.");

  // 03
  y = addSectionTitle(pdf, y, "03", "TAG CATEGORIES");
  autoTable(pdf, {
    startY: y,
    headStyles: tblHead, bodyStyles: tblBody, alternateRowStyles: tblAlt, theme: "grid", margin: tblMargin,
    head: [["", "Type A - Major Asset Plates", "Type B - Equipment Position Tags"]],
    body: [
      ["Plate Style", "Flat plate, no hole", "Smaller tag, single hole"],
      ["Mounting", "Adhesive or rivet to asset shell/frame", "Bolt or cable tie to nearby structure"],
      ["Examples", "Tanks, Conveyors, Crushers, Mills, Thickeners, Hoppers, Chutes, Cyclones, Filter Presses", "Pumps, Valves, Motors, Instruments, Agitators, Compressors, Screens, Generators"],
    ],
  });
  y = (pdf as any).lastAutoTable.finalY + 6;

  // 04
  y = addSectionTitle(pdf, y, "04", "TAG MATERIAL OPTIONS");
  autoTable(pdf, {
    startY: y,
    headStyles: tblHead, bodyStyles: tblBody, alternateRowStyles: tblAlt, theme: "grid", margin: tblMargin,
    head: [["Specification", "Option 1 - 316 Stainless Steel", "Option 2 - DuraBlack"]],
    body: [
      ["Type A Size", "100mm x 50mm x 1.5mm", "100mm x 40mm x 0.5mm"],
      ["Type B Size", "70mm x 25mm x 1.5mm", "80mm x 30mm x 0.5mm"],
      ["Material", "316 Stainless Steel - engraved", "DuraBlack - laser etched"],
      ["Price Estimate", "$7.20 per tag (500+ order)", "$4.65 per tag (500+ order)"],
      ["Durability", "Excellent - 10+ year lifespan, chemical resistant", "Very Good - UV/oil resistant, 5-8 years outdoor"],
      ["Best For", "Chemical areas, heavy wear zones", "General plant areas, cost-effective bulk orders"],
    ],
  });
  y = (pdf as any).lastAutoTable.finalY + 4;
  y = addParagraph(pdf, y, "Supplier: Trophy Central Alice Springs - quote provided for both options at 500+ quantity pricing.");
  y = addParagraph(pdf, y, "Recommendation: Use 316 Stainless Steel for chemical/reagent areas (Gold Room, CIL, Reagents). Use DuraBlack for general plant areas (Water, Compressed Air, Comminution) to reduce cost while maintaining durability.");

  // 05 — Force onto new page so it stays together
  pdf.addPage();
  y = MARGIN;
  y = addSectionTitle(pdf, y, "05", "ASSET TAG PRODUCTION OPTIONS");
  y = addParagraph(pdf, y, "Management may choose between outsourcing tag production to a specialist supplier or purchasing equipment for internal on-demand production. Both approaches are viable. The decision should be based on budget, volume, and long-term operational flexibility.");

  // Option 1 sub-heading
  y = ensureSpace(pdf, y, 8);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  pdf.text("Option 1 - Outsource Tag Production", MARGIN + 3, y);
  y += 5;

  autoTable(pdf, {
    startY: y,
    headStyles: tblHead, bodyStyles: tblBody, alternateRowStyles: tblAlt, theme: "grid", margin: tblMargin,
    head: [["Specification", "Detail"]],
    body: [
      ["Supplier", "Trophy Central - Alice Springs"],
      ["Materials", "316 Stainless Steel (engraved) / DuraBlack (laser etched)"],
      ["Pricing (500+ qty)", "Stainless Steel: $7.20 per tag  |  DuraBlack: $4.65 per tag"],
    ],
  });
  y = (pdf as any).lastAutoTable.finalY + 3;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(34, 120, 60);
  pdf.text("Pros:", MARGIN + 3, y); y += 4;
  y = addBullets(pdf, y, [
    "No capital equipment required",
    "Professional engraving quality",
    "Quick production turnaround",
  ]);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(180, 50, 50);
  pdf.text("Cons:", MARGIN + 3, y); y += 4;
  y = addBullets(pdf, y, [
    "Ongoing cost per tag for every order",
    "Lead time for additional or replacement tags",
  ]);

  // Option 2 sub-heading
  y = ensureSpace(pdf, y, 8);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  pdf.text("Option 2 - In-House Tag Production", MARGIN + 3, y);
  y += 5;

  autoTable(pdf, {
    startY: y,
    headStyles: tblHead, bodyStyles: tblBody, alternateRowStyles: tblAlt, theme: "grid", margin: tblMargin,
    head: [["Specification", "Detail"]],
    body: [
      ["Equipment", "Gravotech LS100 Laser Engraver"],
      ["Website", "https://www.gravotech.com.au/products/laser-engravers-laser-cutters/ls100"],
      ["Capability", "CO2 laser engraver and cutter. Suitable for asset tags, industrial signage, stainless plates and laminates."],
      ["Investment", "Capital equipment purchase + consumables (plates, laminates)"],
    ],
  });
  y = (pdf as any).lastAutoTable.finalY + 3;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(34, 120, 60);
  pdf.text("Pros:", MARGIN + 3, y); y += 4;
  y = addBullets(pdf, y, [
    "Immediate production of tags with no supplier lead time",
    "Ability to create tags when new assets are installed",
    "Can produce additional labels and signage for site",
  ]);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(180, 50, 50);
  pdf.text("Cons:", MARGIN + 3, y); y += 4;
  y = addBullets(pdf, y, [
    "Initial capital equipment purchase required",
    "Operator training required",
  ]);

  // Gravotech LS100 image
  if (gravoImageBase64) {
    y = ensureSpace(pdf, y, 55);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(...MUTED);
    pdf.text("Gravotech LS100 Laser Engraver", MARGIN + 3, y); y += 2;
    try {
      pdf.addImage(gravoImageBase64, "PNG", MARGIN + 3, y, 80, 50);
      y += 54;
    } catch { /* image embed failed silently */ }
  }

  y = addParagraph(pdf, y, "Recommendation: Outsource the first batch (lowest risk). Evaluate in-house production for ongoing requirements. A hybrid approach - outsource the first batch, then transition to in-house - is also viable.");


  // 06
  y = addSectionTitle(pdf, y, "06", "TAG NUMBERING");
  y = addParagraph(pdf, y, "Tag numbers are derived directly from the asset register. No independent numbering systems are permitted.");
  y = addBullets(pdf, y, [
    "Tag number = Asset Number from the approved asset register (e.g. BM01, CFP01-PA01, THYD01-PMP01)",
    "The P&ID tag is shown as a secondary reference where space permits",
    "No site-local numbering, ad-hoc labels, or sequential tag numbers permitted",
    "If an asset is renumbered in the register, the physical tag must be replaced",
  ]);

  // Tag layout mockups
  y = ensureSpace(pdf, y, 32);
  const tagBoxW = 78;
  const tagBoxH = 24;
  const tagBoxGap = 10;
  const tagStartX = MARGIN + 3;

  // Type A mockup
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  pdf.text("TYPE A TAG LAYOUT", tagStartX, y); y += 3;
  pdf.setDrawColor(60, 60, 60);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(tagStartX, y, tagBoxW, tagBoxH, 2, 2, "S");
  pdf.setDrawColor(120, 120, 120);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(tagStartX + 3, y + 2, tagBoxW - 6, tagBoxH - 4, 1, 1, "S");
  pdf.setFont("courier", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(...DARK);
  pdf.text("BM01", tagStartX + tagBoxW / 2, y + 10, { align: "center" });
  pdf.setFont("courier", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...MUTED);
  pdf.text("Primary Ball Mill", tagStartX + tagBoxW / 2, y + 17, { align: "center" });

  // Type B mockup
  const tagBX = tagStartX + tagBoxW + tagBoxGap;
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

  y += tagBoxH + 6;

  // 07
  y = addSectionTitle(pdf, y, "07", "TAG INSTALLATION WORKFLOW");
  y = addBullets(pdf, y, [
    "Step 1 - Generate P&ID Asset Register from the database (see Attachment A)",
    "Step 2 - Produce Tag Production List with Type A/B classification and mounting details (see Attachment B)",
    "Step 3 - Manufacture tags: submit production list to supplier or produce in-house per Section 05",
    "Step 4 - Install tags during field verification. Photograph each installed tag showing Asset ID and context.",
    "Step 5 - Update asset record with 'Tag Installed' status and upload confirmation photo",
  ]);
  y = addParagraph(pdf, y, "CRITICAL RULE: No tag shall be applied without a matching system record and confirmed P&ID reference. If the asset is not in the register or has no P&ID tag - STOP, do not tag.");

  // 08
  y = addSectionTitle(pdf, y, "08", "PRE-ROLLOUT REQUIREMENTS - GATE 1");
  y = addParagraph(pdf, y, "All items below must be confirmed and signed off before any physical tagging commences.");
  y = addBullets(pdf, y, [
    "Final approved Processing Plant asset tree exported and locked",
    "P&IDs reviewed and validated against asset tree (14-page set verified)",
    "Asset IDs frozen - no renumbering permitted during rollout",
    "Tag material option selected and supplier confirmed",
    "Tag production list generated with Type A/B classification",
    "Manufacturing order placed and delivery date confirmed",
    "Rollout sequence agreed with maintenance supervisor",
    "Field tagging crew briefed on mounting philosophy and QC requirements",
  ]);
  y = addParagraph(pdf, y, "Gate 1 Sign-off Required By: Maintenance Superintendent + Asset Owner");

  // 09
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

  // 10
  y = addSectionTitle(pdf, y, "10", "SAFETY CONSIDERATIONS");
  y = addBullets(pdf, y, [
    "Apply LOTO (Lockout/Tagout) before tagging any asset near rotating or energised equipment",
    "No tagging during active plant operation unless the asset and access point are confirmed safe",
    "PPE requirements: Safety glasses, gloves, steel cap boots, high-vis vest at all times",
    "Ladder use must comply with site ladder management procedure - two-person rule applies",
    "Do not tag hot surfaces - allow equipment to cool before working in proximity",
    "Chemical areas (reagents, cyanide) - wear chemical-resistant gloves and face shield",
  ]);

  // 11
  y = addSectionTitle(pdf, y, "11", "COMPLETION DELIVERABLES");
  y = addParagraph(pdf, y, "The following must be produced and filed upon rollout completion.");
  y = addBullets(pdf, y, [
    "Tagged Asset Register - full list of every tagged asset with ID, description, location, and photo reference",
    "Completion Report - summary of tag counts, discrepancies resolved, QC audit results",
    "Before/After photo archive - organised by area",
    "Updated asset tree status - all tagged assets marked as 'Tagged - Verified' in system",
    "Signed close-out sheets for each area",
    "Outstanding items list - any deferred assets with justification and target completion date",
  ]);

  // 12 — Attachments Reference
  y = addSectionTitle(pdf, y, "12", "ATTACHMENTS");
  y = addParagraph(pdf, y, "The following data registers are provided as separate PDF attachments to this rollout plan. These documents contain the full dataset required for tag manufacturing and field installation.");

  y = ensureSpace(pdf, y, 30);
  // Attachment A box
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(MARGIN, y - 2, 180, 20, 2, 2, "F");
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.4);
  pdf.roundedRect(MARGIN, y - 2, 180, 20, 2, 2, "S");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  pdf.text("Attachment A - P&ID Tagged Asset Register", MARGIN + 5, y + 4);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  pdf.text(`${taggedAssetCount} assets with linked P&ID references. Source of truth for tagging scope.`, MARGIN + 5, y + 10);
  pdf.text("File: TCMG_PID_Tagged_Asset_Register.pdf", MARGIN + 5, y + 14);
  y += 24;

  // Attachment B box
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(MARGIN, y - 2, 180, 20, 2, 2, "F");
  pdf.setDrawColor(...GOLD);
  pdf.roundedRect(MARGIN, y - 2, 180, 20, 2, 2, "S");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  pdf.text("Attachment B - Asset Tag Production List", MARGIN + 5, y + 4);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  pdf.text(`${productionTagCount} tags  |  Type A: ${typeACount}  |  Type B: ${typeBCount}. Manufacturing batch list.`, MARGIN + 5, y + 10);
  pdf.text("File: TCMG_Asset_Tag_Production_List.pdf", MARGIN + 5, y + 14);
  y += 26;

  // System Alignment Note
  y = ensureSpace(pdf, y, 22);
  pdf.setFillColor(245, 240, 224);
  pdf.roundedRect(MARGIN, y - 2, 180, 18, 2, 2, "F");
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.4);
  pdf.roundedRect(MARGIN, y - 2, 180, 18, 2, 2, "S");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(...DARK);
  pdf.text("SYSTEM ALIGNMENT NOTE", MARGIN + 5, y + 3);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(...MUTED);
  const alignNote = "All asset hierarchy, functional locations, and system structure are stored within Minesite AI. The physical tag is for rapid visual identification only. Tag numbers match the asset register - no independent numbering systems exist. The tag rollout does not define or alter any system hierarchy.";
  const alignLines = pdf.splitTextToSize(alignNote, 170);
  let alignY = y + 7;
  for (const line of alignLines) { pdf.text(line, MARGIN + 5, alignY); alignY += 3.5; }
  y += 22;

  // Scope reminder
  y = ensureSpace(pdf, y, 14);
  pdf.setFillColor(255, 248, 230);
  pdf.roundedRect(MARGIN, y - 2, 180, 10, 2, 2, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(120, 80, 0);
  pdf.text("⚠  Scope: Processing Plant ONLY. Crushing Plant excluded until P&IDs are finalised. Do not apply this rollout plan to crushing or mining equipment.", MARGIN + 4, y + 4);

  console.log("[PDF] Step 3: adding page numbers");
  addPageNumbers(pdf, "TCMG Asset Tag Rollout Plan");
  console.log("[PDF] Step 4: triggering download");
  triggerPdfDownload(pdf, "TCMG_Asset_Tag_Rollout_Plan.pdf");
  console.log("[PDF] Step 5: download triggered successfully");
}

// ════════════════════════════════════════════════
// 2. ATTACHMENT A — P&ID TAGGED ASSET REGISTER PDF
// ════════════════════════════════════════════════
export function generateAssetRegisterPDF(taggedAssets: TaggedAsset[]) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  let y = addDocHeader(pdf, "P&ID Tagged Asset Register", "Attachment A - Tennant Mines Gold");

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

  addPageNumbers(pdf, "TCMG P&ID Tagged Asset Register - Attachment A");
  triggerPdfDownload(pdf, "TCMG_PID_Tagged_Asset_Register.pdf");
}

// ════════════════════════════════════════════════
// 3. ATTACHMENT B — ASSET TAG PRODUCTION LIST PDF
// ════════════════════════════════════════════════
export function generateProductionListPDF(productionTags: ProductionTag[]) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const typeA = productionTags.filter(t => t.tagType === "A").length;
  const typeB = productionTags.filter(t => t.tagType === "B").length;

  let y = addDocHeader(pdf, "Asset Tag Production List", "Attachment B - Tennant Mines Gold");

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

  addPageNumbers(pdf, "TCMG Asset Tag Production List - Attachment B");
  triggerPdfDownload(pdf, "TCMG_Asset_Tag_Production_List.pdf");
}
