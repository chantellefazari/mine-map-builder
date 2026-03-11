import { jsPDF } from "npm:jspdf@2.5.2";
import autoTable from "npm:jspdf-autotable@3.8.4";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Colours ──
const GOLD: [number, number, number] = [212, 160, 23];
const DARK: [number, number, number] = [17, 17, 17];
const MUTED: [number, number, number] = [100, 100, 100];
const HEADER_BG: [number, number, number] = [245, 240, 224];
const LIGHT_BG: [number, number, number] = [250, 250, 250];
const PAGE_H = 297;
const MARGIN = 15;
const BOTTOM_SAFE = PAGE_H - MARGIN - 5;

function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
  if (y + needed > BOTTOM_SAFE) { pdf.addPage(); return MARGIN; }
  return y;
}

function addDocHeader(pdf: jsPDF, title: string, subtitle: string): number {
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
    `TCMG-STD-TAG-002  |  Rev 2.0  |  ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}`,
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
  for (const line of lines) { y = ensureSpace(pdf, y, 5); pdf.text(line, MARGIN, y); y += 4; }
  return y + 2;
}

function addBullets(pdf: jsPDF, y: number, items: string[]): number {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...DARK);
  for (const item of items) {
    const lines = pdf.splitTextToSize(item, 170);
    y = ensureSpace(pdf, y, lines.length * 4 + 2);
    pdf.text("•", MARGIN + 3, y);
    for (const line of lines) { pdf.text(line, MARGIN + 8, y); y += 4; }
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

function buildRolloutPdf(taggedAssetCount: number, productionTagCount: number, typeACount: number, typeBCount: number): Uint8Array {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
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
      ["Size", "100mm x 50mm x 1.5mm", "70mm x 25mm x 1.5mm"],
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

  // 05
  pdf.addPage();
  y = MARGIN;
  y = addSectionTitle(pdf, y, "05", "ASSET TAG PRODUCTION OPTIONS");
  y = addParagraph(pdf, y, "Management may choose between outsourcing tag production to a specialist supplier or purchasing equipment for internal on-demand production. Both approaches are viable.");

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

  pdf.setFont("helvetica", "bold"); pdf.setFontSize(7.5); pdf.setTextColor(34, 120, 60);
  pdf.text("Pros:", MARGIN + 3, y); y += 4;
  y = addBullets(pdf, y, ["No capital equipment required", "Professional engraving quality", "Quick production turnaround"]);

  pdf.setFont("helvetica", "bold"); pdf.setFontSize(7.5); pdf.setTextColor(180, 50, 50);
  pdf.text("Cons:", MARGIN + 3, y); y += 4;
  y = addBullets(pdf, y, ["Ongoing cost per tag for every order", "Lead time for additional or replacement tags"]);

  y = ensureSpace(pdf, y, 8);
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(...DARK);
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

  pdf.setFont("helvetica", "bold"); pdf.setFontSize(7.5); pdf.setTextColor(34, 120, 60);
  pdf.text("Pros:", MARGIN + 3, y); y += 4;
  y = addBullets(pdf, y, ["Immediate production of tags with no supplier lead time", "Ability to create tags when new assets are installed", "Can produce additional labels and signage for site"]);

  pdf.setFont("helvetica", "bold"); pdf.setFontSize(7.5); pdf.setTextColor(180, 50, 50);
  pdf.text("Cons:", MARGIN + 3, y); y += 4;
  y = addBullets(pdf, y, ["Initial capital equipment purchase required", "Operator training required"]);

  y = addParagraph(pdf, y, "Recommendation: Outsource the first batch (lowest risk). Evaluate in-house production for ongoing requirements.");

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
  const tagBoxW = 78, tagBoxH = 24, tagBoxGap = 10, tagStartX = MARGIN + 3;

  pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...MUTED);
  pdf.text("TYPE A TAG LAYOUT", tagStartX, y); y += 3;
  pdf.setDrawColor(60, 60, 60); pdf.setLineWidth(0.6);
  pdf.roundedRect(tagStartX, y, tagBoxW, tagBoxH, 2, 2, "S");
  pdf.setDrawColor(120, 120, 120); pdf.setLineWidth(0.3);
  pdf.roundedRect(tagStartX + 3, y + 2, tagBoxW - 6, tagBoxH - 4, 1, 1, "S");
  pdf.setFont("courier", "bold"); pdf.setFontSize(14); pdf.setTextColor(...DARK);
  pdf.text("BM01", tagStartX + tagBoxW / 2, y + 10, { align: "center" });
  pdf.setFont("courier", "normal"); pdf.setFontSize(8); pdf.setTextColor(...MUTED);
  pdf.text("Primary Ball Mill", tagStartX + tagBoxW / 2, y + 17, { align: "center" });

  const tagBX = tagStartX + tagBoxW + tagBoxGap;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...MUTED);
  pdf.text("TYPE B TAG LAYOUT", tagBX, y - 3);
  pdf.setDrawColor(60, 60, 60); pdf.setLineWidth(0.6);
  pdf.roundedRect(tagBX, y, tagBoxW, tagBoxH, 2, 2, "S");
  pdf.setDrawColor(120, 120, 120); pdf.setLineWidth(0.3);
  pdf.roundedRect(tagBX + 3, y + 2, tagBoxW - 6, tagBoxH - 4, 1, 1, "S");
  pdf.setFont("courier", "bold"); pdf.setFontSize(12); pdf.setTextColor(...DARK);
  pdf.text("CFP01-PA01", tagBX + tagBoxW / 2, y + 10, { align: "center" });
  pdf.setFont("courier", "normal"); pdf.setFontSize(7); pdf.setTextColor(...MUTED);
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
  y = addParagraph(pdf, y, "CRITICAL RULE: No tag shall be applied without a matching system record and confirmed P&ID reference.");

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

  // 12
  y = addSectionTitle(pdf, y, "12", "ATTACHMENTS");
  y = addParagraph(pdf, y, "The following data registers are provided as separate PDF attachments.");

  y = ensureSpace(pdf, y, 30);
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(MARGIN, y - 2, 180, 20, 2, 2, "F");
  pdf.setDrawColor(...GOLD); pdf.setLineWidth(0.4);
  pdf.roundedRect(MARGIN, y - 2, 180, 20, 2, 2, "S");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(...DARK);
  pdf.text("Attachment A - P&ID Tagged Asset Register", MARGIN + 5, y + 4);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...MUTED);
  pdf.text(`${taggedAssetCount} assets with linked P&ID references. Source of truth for tagging scope.`, MARGIN + 5, y + 10);
  pdf.text("File: TCMG_PID_Tagged_Asset_Register.pdf", MARGIN + 5, y + 14);
  y += 24;

  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(MARGIN, y - 2, 180, 20, 2, 2, "F");
  pdf.setDrawColor(...GOLD);
  pdf.roundedRect(MARGIN, y - 2, 180, 20, 2, 2, "S");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(...DARK);
  pdf.text("Attachment B - Asset Tag Production List", MARGIN + 5, y + 4);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...MUTED);
  pdf.text(`${productionTagCount} tags  |  Type A: ${typeACount}  |  Type B: ${typeBCount}. Manufacturing batch list.`, MARGIN + 5, y + 10);
  pdf.text("File: TCMG_Asset_Tag_Production_List.pdf", MARGIN + 5, y + 14);
  y += 26;

  // System Alignment Note
  y = ensureSpace(pdf, y, 22);
  pdf.setFillColor(245, 240, 224);
  pdf.roundedRect(MARGIN, y - 2, 180, 18, 2, 2, "F");
  pdf.setDrawColor(...GOLD); pdf.setLineWidth(0.4);
  pdf.roundedRect(MARGIN, y - 2, 180, 18, 2, 2, "S");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(7); pdf.setTextColor(...DARK);
  pdf.text("SYSTEM ALIGNMENT NOTE", MARGIN + 5, y + 3);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...MUTED);
  const alignNote = "All asset hierarchy, functional locations, and system structure are stored within Minesite AI. The physical tag is for rapid visual identification only. Tag numbers match the asset register - no independent numbering systems exist.";
  const alignLines = pdf.splitTextToSize(alignNote, 170);
  let alignY = y + 7;
  for (const line of alignLines) { pdf.text(line, MARGIN + 5, alignY); alignY += 3.5; }
  y += 22;

  // Scope reminder
  y = ensureSpace(pdf, y, 14);
  pdf.setFillColor(255, 248, 230);
  pdf.roundedRect(MARGIN, y - 2, 180, 10, 2, 2, "F");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(7); pdf.setTextColor(120, 80, 0);
  pdf.text("Scope: Processing Plant ONLY. Crushing Plant excluded until P&IDs are finalised.", MARGIN + 4, y + 4);

  addPageNumbers(pdf, "TCMG Asset Tag Rollout Plan");

  return pdf.output("arraybuffer") as unknown as Uint8Array;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get asset counts from the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Count tagged assets
    const { count: taggedAssetCount } = await supabase
      .from("processing_plant_assets_rev_b")
      .select("id", { count: "exact", head: true })
      .not("pid_tags", "is", null)
      .not("pid_tags", "eq", "{}");

    const totalAssets = taggedAssetCount || 0;

    // Get body params if provided, otherwise use defaults
    let typeACount = 0;
    let typeBCount = 0;
    try {
      const body = await req.json();
      typeACount = body.typeACount || 0;
      typeBCount = body.typeBCount || 0;
    } catch {
      // Use defaults if no body
    }

    const productionTagCount = typeACount + typeBCount || totalAssets;

    const pdfBytes = buildRolloutPdf(totalAssets, productionTagCount, typeACount, typeBCount);

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="TCMG_Asset_Tag_Rollout_Plan.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
