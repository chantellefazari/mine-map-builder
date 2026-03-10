import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
const GOLD = [212, 160, 23] as const;
const DARK = [17, 17, 17] as const;
const MUTED = [100, 100, 100] as const;
const HEADER_BG = [245, 240, 224] as const;
const LIGHT_BG = [250, 250, 250] as const;

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

function addHeader(pdf: jsPDF) {
  const w = pdf.internal.pageSize.getWidth();
  // Gold bar
  pdf.setFillColor(...GOLD);
  pdf.rect(0, 0, w, 3, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(...DARK);
  pdf.text("Asset Tag Rollout Plan", 15, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...MUTED);
  pdf.text("Processing Plant — Tennant Mines Gold", 15, 24);
  pdf.text(`TCMG-ROLLOUT-001  |  Rev 2.0  |  ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}`, 15, 29);

  // Scope badge
  pdf.setFillColor(255, 193, 7);
  pdf.roundedRect(w - 65, 10, 50, 7, 1, 1, "F");
  pdf.setFontSize(7);
  pdf.setTextColor(80, 50, 0);
  pdf.text("Processing Plant Only", w - 63, 15);

  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.5);
  pdf.line(15, 33, w - 15, 33);

  return 38;
}

function addSectionTitle(pdf: jsPDF, y: number, number: string, title: string): number {
  const pageH = pdf.internal.pageSize.getHeight();
  if (y > pageH - 30) {
    pdf.addPage();
    y = 15;
  }
  // Gold left bar
  pdf.setFillColor(...GOLD);
  pdf.rect(15, y - 3, 2, 8, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(...DARK);
  pdf.text(`${number}  ${title}`, 20, y + 2);
  return y + 10;
}

function addParagraph(pdf: jsPDF, y: number, text: string, maxW = 180): number {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...MUTED);
  const lines = pdf.splitTextToSize(text, maxW);
  const pageH = pdf.internal.pageSize.getHeight();
  for (const line of lines) {
    if (y > pageH - 15) { pdf.addPage(); y = 15; }
    pdf.text(line, 15, y);
    y += 4;
  }
  return y + 2;
}

function addBullets(pdf: jsPDF, y: number, items: string[]): number {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...DARK);
  const pageH = pdf.internal.pageSize.getHeight();
  for (const item of items) {
    if (y > pageH - 15) { pdf.addPage(); y = 15; }
    pdf.text("•", 18, y);
    const lines = pdf.splitTextToSize(item, 170);
    for (const line of lines) {
      if (y > pageH - 15) { pdf.addPage(); y = 15; }
      pdf.text(line, 23, y);
      y += 4;
    }
    y += 1;
  }
  return y + 2;
}

function addPageNumbers(pdf: jsPDF) {
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(7);
    pdf.setTextColor(...MUTED);
    pdf.text(`TCMG Asset Tag Rollout Plan  |  Page ${i} of ${totalPages}`, w / 2, h - 8, { align: "center" });
    // Bottom gold bar
    pdf.setFillColor(...GOLD);
    pdf.rect(0, h - 3, w, 3, "F");
  }
}

export function generateRolloutPlanPDF(
  taggedAssets: TaggedAsset[],
  productionTags: ProductionTag[]
) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = addHeader(pdf);

  // ── 01. Tagging Criteria ──
  y = addSectionTitle(pdf, y, "01", "TAGGING CRITERIA");
  y = addParagraph(pdf, y, "Physical asset tags are issued exclusively to equipment that has a linked P&ID equipment tag.");
  y = addBullets(pdf, y, [
    "Only assets with a linked P&ID tag number will receive a physical asset tag",
    "Assets without P&ID references are excluded from the tagging program",
    "Tag numbers must match the asset number used in the asset register and P&ID",
    "The P&ID Tagged Asset Register is the sole source of truth for the tagging scope",
    "System headers, functional locations, and Level 7 sub-components without their own P&ID tag are excluded",
  ]);

  // ── 02. Tag Mounting Philosophy ──
  y = addSectionTitle(pdf, y, "02", "TAG MOUNTING PHILOSOPHY");
  y = addParagraph(pdf, y, "Asset tags represent the P&ID equipment POSITION, not the removable equipment itself. Tags must be mounted on the fixed structure at the equipment connection point.");
  y = addParagraph(pdf, y, "MOUNT ON: Equipment frames, pipe supports, skids, handrails, structural steel, tank shells, conveyor stringers.");
  y = addParagraph(pdf, y, "NEVER ON: Pumps, motors, gearboxes, instruments, valves, or any equipment that may be removed for repair or replacement.");

  // ── 03. Tag Categories ──
  y = addSectionTitle(pdf, y, "03", "TAG CATEGORIES");
  autoTable(pdf, {
    startY: y,
    margin: { left: 15, right: 15 },
    head: [["", "Type A — Major Asset Plates", "Type B — Equipment Position Tags"]],
    body: [
      ["Plate Style", "Flat plate, no hole", "Smaller tag, single hole"],
      ["Mounting", "Adhesive or rivet to asset shell/frame", "Bolt or cable tie to nearby structure"],
      ["Examples", "Tanks, Conveyors, Crushers, Mills, Thickeners, Hoppers", "Pumps, Valves, Motors, Instruments, Agitators, Compressors"],
    ],
    headStyles: { fillColor: [...HEADER_BG], textColor: [...DARK], fontStyle: "bold", fontSize: 7 },
    bodyStyles: { fontSize: 7, textColor: [...DARK] },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
  });
  y = (pdf as any).lastAutoTable.finalY + 6;

  // ── 04. Tag Material Options ──
  y = addSectionTitle(pdf, y, "04", "TAG MATERIAL OPTIONS");
  autoTable(pdf, {
    startY: y,
    margin: { left: 15, right: 15 },
    head: [["Specification", "Option 1 — 316 Stainless Steel", "Option 2 — DuraBlack"]],
    body: [
      ["Type A Size", "100mm × 50mm × 1.5mm", "100mm × 40mm × 0.5mm"],
      ["Type B Size", "70mm × 25mm × 1.5mm", "80mm × 30mm × 0.5mm"],
      ["Material", "316 Stainless Steel — engraved", "DuraBlack — laser etched"],
      ["Price Estimate", "$7.20 per tag (500+ order)", "$4.65 per tag (500+ order)"],
      ["Durability", "Excellent — 10+ year lifespan", "Very Good — 5–8 years outdoor"],
      ["Best For", "Chemical areas, heavy wear", "General plant, cost-effective bulk"],
    ],
    headStyles: { fillColor: [...HEADER_BG], textColor: [...DARK], fontStyle: "bold", fontSize: 7 },
    bodyStyles: { fontSize: 7, textColor: [...DARK] },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
  });
  y = (pdf as any).lastAutoTable.finalY + 4;
  y = addParagraph(pdf, y, "Supplier: Trophy Central Alice Springs — quote provided for both options at 500+ quantity pricing.");

  // ── 05. Asset Tag Production Options ──
  y = addSectionTitle(pdf, y, "05", "ASSET TAG PRODUCTION OPTIONS");
  y = addParagraph(pdf, y, "Management may choose between outsourcing or in-house production.");
  autoTable(pdf, {
    startY: y,
    margin: { left: 15, right: 15 },
    head: [["", "Option 1 — Outsource", "Option 2 — In-House"]],
    body: [
      ["Provider", "Trophy Central – Alice Springs", "Gravotech LS100 Laser Engraver"],
      ["Materials", "Stainless Steel / DuraBlack", "Stainless plates / laminates"],
      ["Pricing", "$7.20 / $4.65 per tag (500+)", "Capital purchase + consumables"],
      ["Pros", "No capital outlay, professional quality, fast", "Immediate production, on-demand, additional signage"],
      ["Cons", "Ongoing cost per tag, lead time", "Capital purchase, operator training"],
    ],
    headStyles: { fillColor: [...HEADER_BG], textColor: [...DARK], fontStyle: "bold", fontSize: 7 },
    bodyStyles: { fontSize: 7, textColor: [...DARK] },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    theme: "grid",
  });
  y = (pdf as any).lastAutoTable.finalY + 4;
  y = addParagraph(pdf, y, "Recommendation: Outsource the first batch (lowest risk), then evaluate in-house production for ongoing requirements.");

  // ── 06. Tag Numbering ──
  y = addSectionTitle(pdf, y, "06", "TAG NUMBERING");
  y = addBullets(pdf, y, [
    "Tag number = Asset Number from the approved asset register (e.g. BM01, CFP01-PA01)",
    "P&ID tag shown as secondary reference where space permits",
    "No site-local numbering, ad-hoc labels, or sequential tag numbers",
    "If an asset is renumbered, the physical tag must be replaced",
  ]);

  // ── 07. Tag Installation Workflow ──
  y = addSectionTitle(pdf, y, "07", "TAG INSTALLATION WORKFLOW");
  y = addBullets(pdf, y, [
    "Step 1 — Generate P&ID Asset Register from the database",
    "Step 2 — Produce Tag Production List with Type A/B classification and mounting details",
    "Step 3 — Manufacture tags (submit production list to supplier or produce in-house)",
    "Step 4 — Install tags during field verification. Photograph each installed tag.",
    "Step 5 — Update asset record with 'Tag Installed' status and confirmation photo",
  ]);
  y = addParagraph(pdf, y, "CRITICAL: No tag shall be applied without a matching system record and confirmed P&ID reference.");

  // ── 08. Pre-Rollout Gate ──
  y = addSectionTitle(pdf, y, "08", "PRE-ROLLOUT REQUIREMENTS — GATE 1");
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
  y = addParagraph(pdf, y, "Gate 1 Sign-off: Maintenance Superintendent + Asset Owner");

  // ── 09. Quality Control ──
  y = addSectionTitle(pdf, y, "09", "QUALITY CONTROL");
  y = addBullets(pdf, y, [
    "Maintenance supervisor sign-off required per area before proceeding",
    "Random audit of minimum 10% of tagged assets per area",
    "Cross-check all installed tags against the P&ID Tagged Asset Register",
    "Confirm zero duplicated Asset IDs across all tagged positions",
    "Photo evidence reviewed and linked to system record",
    "Verify tags are mounted on fixed structure — not on replaceable equipment",
  ]);

  // ── 10. Safety ──
  y = addSectionTitle(pdf, y, "10", "SAFETY CONSIDERATIONS");
  y = addBullets(pdf, y, [
    "Apply LOTO before tagging near rotating or energised equipment",
    "No tagging during active plant operation unless confirmed safe",
    "PPE: Safety glasses, gloves, steel caps, high-vis vest",
    "Chemical areas — chemical-resistant gloves and face shield required",
  ]);

  // ── 11. Deliverables ──
  y = addSectionTitle(pdf, y, "11", "COMPLETION DELIVERABLES");
  y = addBullets(pdf, y, [
    "Tagged Asset Register — full list with ID, description, location, photo reference",
    "Completion Report — tag counts, discrepancies resolved, QC audit results",
    "Before/After photo archive organised by area",
    "Updated asset tree with all tagged assets marked 'Tagged – Verified'",
    "Signed close-out sheets for each area",
    "Outstanding items list with justification and target completion date",
  ]);

  // ── 12. P&ID Tagged Asset Register (Table) ──
  pdf.addPage();
  y = 15;
  y = addSectionTitle(pdf, y, "12", "P&ID TAGGED ASSET REGISTER — TENNANT CREEK");
  y = addParagraph(pdf, y, `${taggedAssets.length} assets with linked P&ID references. This register is the sole source of truth for the tagging scope.`);

  const registerRows = taggedAssets.map((a, i) => [
    i + 1,
    a.asset_number,
    a.asset_name,
    a.parent_asset_label,
    a.pid_tags.join("; "),
    inferAssetType(a.pid_tags[0] || ""),
    a.area_label,
    a.functional_location || "",
  ]);

  autoTable(pdf, {
    startY: y,
    margin: { left: 10, right: 10 },
    head: [["#", "Asset No.", "Asset Name", "Parent System", "P&ID Tag", "Type", "Area", "Location"]],
    body: registerRows,
    headStyles: { fillColor: [...HEADER_BG], textColor: [...DARK], fontStyle: "bold", fontSize: 6, cellPadding: 1.5 },
    bodyStyles: { fontSize: 6, textColor: [...DARK], cellPadding: 1.2 },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 22, font: "courier" },
      4: { cellWidth: 22, font: "courier" },
      5: { cellWidth: 18 },
      6: { cellWidth: 22 },
      7: { cellWidth: 20, font: "courier" },
    },
    theme: "grid",
  });

  // ── 13. Asset Tag Production List (Table) ──
  pdf.addPage();
  y = 15;
  const typeA = productionTags.filter(t => t.tagType === "A").length;
  const typeB = productionTags.filter(t => t.tagType === "B").length;
  y = addSectionTitle(pdf, y, "13", "ASSET TAG PRODUCTION LIST — TENNANT CREEK");
  y = addParagraph(pdf, y, `${productionTags.length} tags total  |  Type A: ${typeA}  |  Type B: ${typeB}  |  Manufacturing batch list for tag production.`);

  const prodRows = productionTags.map((t, i) => [
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
    head: [["#", "Asset No.", "Asset Name", "P&ID Tag", "Type", "Tag Size", "Mounting Location", "Method", "Parent System", "Location", "Installed"]],
    body: prodRows,
    headStyles: { fillColor: [...HEADER_BG], textColor: [...DARK], fontStyle: "bold", fontSize: 5.5, cellPadding: 1.2 },
    bodyStyles: { fontSize: 5.5, textColor: [...DARK], cellPadding: 1 },
    alternateRowStyles: { fillColor: [...LIGHT_BG] },
    columnStyles: {
      0: { cellWidth: 7 },
      1: { cellWidth: 18, font: "courier" },
      3: { cellWidth: 16, font: "courier" },
      4: { cellWidth: 12 },
      10: { cellWidth: 12, halign: "center" },
    },
    theme: "grid",
  });

  // Summary row after table
  y = (pdf as any).lastAutoTable.finalY + 6;
  const pageH = pdf.internal.pageSize.getHeight();
  if (y > pageH - 25) { pdf.addPage(); y = 15; }
  pdf.setFillColor(...HEADER_BG);
  pdf.rect(15, y - 3, 180, 16, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(...DARK);
  pdf.text(`PRODUCTION SUMMARY`, 20, y + 1);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.text(`Type A (Major Asset Plates): ${typeA}  |  Type B (Position Tags): ${typeB}  |  TOTAL TAGS: ${productionTags.length}`, 20, y + 6);
  pdf.text(`Scope: Processing Plant ONLY — Crushing Plant excluded until P&IDs are finalised.`, 20, y + 10);

  // ── Page Numbers ──
  addPageNumbers(pdf);

  pdf.save("TCMG_Asset_Tag_Rollout_Plan.pdf");
}
