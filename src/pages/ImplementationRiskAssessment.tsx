import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Printer, FileText, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";
import { toast } from "sonner";

type Level = "High" | "Medium" | "Low";

const RISKS: { title: string; description: string; level: Level }[] = [
  // High
  { title: "Poor User Adoption and Site Culture", description: "Workforce continues verbal requests and reactive habits. System is deployed but not used as the primary operating tool. Work remains untracked and maintenance history is lost.", level: "High" },
  { title: "Parallel Systems Continue", description: "Excel trackers, whiteboard schedules, and manual PO logs persist alongside the new system, creating two sources of truth. Users default to familiar tools and the system becomes a secondary record.", level: "High" },
  { title: "Immature Stores and Inventory Control", description: "No controlled stores environment, no receiving process, no bin locations mapped, no cycle counting. Parts cannot be issued or received through the system. Emergency purchasing continues unchecked.", level: "High" },
  { title: "Incomplete Parts Catalogue and BOM Linkage", description: "Many assets have no linked spare parts. Min/max stock levels are unpopulated, lead times are unknown, and unit costs are missing. Reorder logic does not function. PM work orders generate without parts lists.", level: "High" },
  { title: "Work Management Process Not Consistently Followed", description: "WR to WO to close workflow is built but not embedded. Some supervisors approve verbally, priority is not assessed, and work orders are closed without completion notes or parts usage recorded.", level: "High" },
  { title: "Lack of Leadership Enforcement", description: "Management does not consistently enforce system use. Supervisors are not held accountable for team compliance. Mixed signals to workforce cause adoption to stall and early adopters lose motivation.", level: "High" },
  { title: "Training Not Role Specific or Not Reinforced", description: "Generic training sessions delivered once with no follow up coaching, no competency checks, and no refresher schedule. Users forget processes within days and workarounds develop.", level: "High" },
  { title: "Asset Hierarchy Not Fully Stable", description: "Some parent child relationships are incorrect, functional locations have gaps, and component level detail is missing in secondary areas. Work orders raised against wrong assets and cost allocation is inaccurate.", level: "Medium" },
  { title: "PM Data Quality Becomes Inconsistent", description: "Task descriptions are vague, inspection results are not recorded, and completion notes default to generic entries. PM history is useless for failure analysis and compliance reporting is unreliable.", level: "Medium" },
  { title: "Premature Rollout Before Readiness Gates Met", description: "Pressure to show progress leads to go live without completing stores setup, training, or leadership alignment prerequisites. Early failures erode confidence and recovery is harder than getting it right first time.", level: "Medium" },
  { title: "Labour Time and Execution Behaviour Poorly Controlled", description: "Trades do not log actual hours, travel time is unaccounted, and job duration estimates are not validated. Cannot measure labour productivity or cost per work order.", level: "Medium" },
  { title: "Too Much Rollout Scope Attempted Too Early", description: "All modules activated simultaneously instead of a controlled staged approach. Users are overwhelmed, support capacity is exceeded, and multiple process failures occur at once.", level: "Medium" },
  { title: "Resistance to AI Supported Workflows", description: "Site personnel distrust automated suggestions for PM scheduling, parts reordering, or work prioritisation. AI features are ignored or overridden, losing the value of intelligent automation.", level: "Low" },
  { title: "Procurement Linkage Remains Immature", description: "PR to PO conversion is manual, supplier data is incomplete, no 3 way matching exists, and freight tracking is inconsistent. Procurement operates without financial controls and spend visibility is limited.", level: "Low" },
];

const levelStyle: Record<Level, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/30",
  Medium: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  Low: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
};

const ImplementationRiskAssessment = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [savingPdf, setSavingPdf] = useState(false);
  const [savingDocx, setSavingDocx] = useState(false);

  const handleSavePdf = async () => {
    const el = contentRef.current;
    if (!el) return;
    setSavingPdf(true);
    try {
      const A4_W = 210, A4_H = 297, MARGIN = 10;
      const contentW = A4_W - MARGIN * 2;
      const usableH = A4_H - MARGIN * 2;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // Get all direct children as sections using data-pdf-section or fallback to children
      const sections = Array.from(el.querySelectorAll("[data-pdf-section]")) as HTMLElement[];
      const elements = sections.length > 0 ? sections : (Array.from(el.children) as HTMLElement[]);

      let currentY = MARGIN;
      let firstImage = true;

      for (const section of elements) {
        if (section.classList.contains("print:hidden") || section.classList.contains("print-hidden")) continue;

        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const scaleFactor = contentW / canvas.width;
        const sectionH = canvas.height * scaleFactor;
        const imgData = canvas.toDataURL("image/png");

        // If section doesn't fit on current page, start a new one
        const remainingSpace = A4_H - MARGIN - currentY;
        if (sectionH > remainingSpace && currentY > MARGIN) {
          pdf.addPage();
          currentY = MARGIN;
        }

        if (!firstImage && currentY === MARGIN) {
          // Already added page above
        } else if (firstImage) {
          firstImage = false;
        }

        pdf.addImage(imgData, "PNG", MARGIN, currentY, contentW, sectionH);
        currentY += sectionH;
      }

      const blob = pdf.output("blob");
      await uploadAndShowPdf(blob, "TCMG-Implementation-Risk-Assessment.pdf", "Implementation Risk Assessment");
      toast.success("PDF saved successfully");
    } catch (err) {
      console.error("PDF save error:", err);
      toast.error("Failed to save PDF");
    } finally {
      setSavingPdf(false);
    }
  };

  const handleExportDocx = async () => {
    setSavingDocx(true);
    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType } = await import("docx");
      const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
      const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
      const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };
      const riskRows = RISKS.map(r => new TableRow({
        children: [
          new TableCell({ borders: cellBorders, width: { size: 3200, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: r.title, bold: true, size: 20, font: "Arial" })] })] }),
          new TableCell({ borders: cellBorders, width: { size: 4960, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: r.description, size: 20, font: "Arial" })] })] }),
          new TableCell({ borders: cellBorders, width: { size: 1200, type: WidthType.DXA }, margins: cellMargins, shading: { fill: r.level === "High" ? "FDE8E8" : r.level === "Medium" ? "FEF3CD" : "D4EDDA", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: r.level, bold: true, size: 20, font: "Arial", color: r.level === "High" ? "DC2626" : r.level === "Medium" ? "B45309" : "16A34A" })] })] }),
        ],
      }));
      const bullet = (t: string) => new Paragraph({ spacing: { after: 40 }, indent: { left: 360 }, children: [new TextRun({ text: `\u2022  ${t}`, size: 22, font: "Arial" })] });
      const doc = new Document({
        styles: { default: { document: { run: { font: "Arial", size: 24 } } } },
        sections: [{
          properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 } } },
          children: [
            new Paragraph({ children: [new TextRun({ text: "TENNANT CREEK GOLD MINE", size: 18, font: "Arial", color: "888888", bold: true })] }),
            new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "Implementation Risk Assessment", size: 36, bold: true, font: "Arial" })] }),
            new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Minesite.ai Work Management System \u2014 Prepared for site leadership and stakeholder review", size: 20, font: "Arial", color: "666666" })] }),
            new Paragraph({ spacing: { after: 300 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "C8960C", space: 1 } }, children: [] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 100 }, children: [new TextRun({ text: "1. Purpose", size: 26, bold: true, font: "Arial" })] }),
            new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "This assessment outlines the implementation risks associated with rolling out the new work management system at Tennant Creek Gold Mine. The focus is on ensuring the system is introduced in a controlled and sustainable way, recognising that success depends on site readiness across people, process, data, and operational discipline.", size: 22, font: "Arial" })] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 100 }, children: [new TextRun({ text: "2. Current Position", size: 26, bold: true, font: "Arial" })] }),
            new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Progress Made", size: 22, bold: true, font: "Arial" })] }),
            ...["Work Request and Work Order logic developed and being trialled on site", "Scheduling capability established", "Asset hierarchy rebuild in progress", "Parts catalogue development underway", "PM logic being developed", "System currently in active trial with site users creating live work orders"].map(bullet),
            new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "Areas Still Maturing", size: 22, bold: true, font: "Arial" })] }),
            ...["Stores and inventory controls still being established", "Stock visibility not yet reliable", "Parts and BOM linkage incomplete", "Work management behaviours still being embedded", "Site culture and buy-in remain the biggest challenge"].map(bullet),
            new Paragraph({ spacing: { before: 120, after: 200 }, indent: { left: 200 }, border: { left: { style: BorderStyle.SINGLE, size: 6, color: "C8960C", space: 4 } }, children: [new TextRun({ text: "The system is in active trial. Early adoption is encouraging, but embedding consistent use across the full workforce remains the key challenge.", size: 22, font: "Arial", italics: true })] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 100 }, children: [new TextRun({ text: "3. Key Implementation Risks", size: 26, bold: true, font: "Arial" })] }),
            new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [3200, 4960, 1200], rows: [
              new TableRow({ children: [
                new TableCell({ borders: cellBorders, width: { size: 3200, type: WidthType.DXA }, margins: cellMargins, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Risk", bold: true, size: 20, font: "Arial" })] })] }),
                new TableCell({ borders: cellBorders, width: { size: 4960, type: WidthType.DXA }, margins: cellMargins, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, size: 20, font: "Arial" })] })] }),
                new TableCell({ borders: cellBorders, width: { size: 1200, type: WidthType.DXA }, margins: cellMargins, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Level", bold: true, size: 20, font: "Arial" })] })] }),
              ] }),
              ...riskRows,
            ] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 100 }, children: [new TextRun({ text: "4. Recommended Approach", size: 26, bold: true, font: "Arial" })] }),
            new Paragraph({ spacing: { after: 80 }, indent: { left: 200 }, border: { left: { style: BorderStyle.SINGLE, size: 6, color: "C8960C", space: 4 } }, children: [new TextRun({ text: "Continue the current trial approach. Expand adoption gradually as site behaviours mature and confidence builds.", size: 22, font: "Arial", bold: true })] }),
            new Paragraph({ spacing: { before: 120, after: 40 }, children: [new TextRun({ text: "Phased Implementation:", size: 22, bold: true, font: "Arial" })] }),
            ...["Phase 1: Foundation Stabilisation", "Phase 2: Controlled Pilot", "Phase 3: Gradual Rollout"].map(bullet),
            new Paragraph({ spacing: { before: 120, after: 40 }, children: [new TextRun({ text: "Focus Areas:", size: 22, bold: true, font: "Arial" })] }),
            ...["Leadership enforcement of system use and process compliance", "User adoption through role-specific training and on-shift support", "Training delivered by role, reinforced through coaching and refreshers", "Removal of parallel systems (spreadsheets, manual trackers, whiteboards)"].map(bullet),
            new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 100 }, children: [new TextRun({ text: "5. Final Position", size: 26, bold: true, font: "Arial" })] }),
            new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "The system is strong and is already being trialled on site with real work orders.", size: 22, font: "Arial", bold: true })] }),
            new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "The biggest risk to successful rollout is not the software. It is site culture, user buy-in, and consistent leadership enforcement. Getting everyone on board, following the process every time, and removing reliance on old methods is what will determine whether this succeeds long-term.", size: 22, font: "Arial" })] }),
            new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "A controlled, phased approach, continuing the current trial and expanding as behaviours mature, gives the best chance of lasting adoption.", size: 22, font: "Arial", bold: true })] }),
            new Paragraph({ spacing: { before: 400 }, border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } }, children: [new TextRun({ text: "Tennant Creek Gold Mine \u2014 Implementation Risk Assessment \u2014 Prepared for leadership and stakeholder review", size: 16, font: "Arial", color: "999999" })] }),
          ],
        }],
      });
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer as unknown as ArrayBuffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "TCMG-Implementation-Risk-Assessment.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      toast.success("Word document exported");
    } catch (err) {
      console.error("DOCX export error:", err);
      toast.error("Failed to export Word document");
    } finally {
      setSavingDocx(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[860px] mx-auto">
      <div className="flex justify-end gap-2 mb-4 print:hidden">
        <Button variant="outline" size="sm" onClick={handleSavePdf} disabled={savingPdf} className="gap-2">
          {savingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
          {savingPdf ? "Saving\u2026" : "Save PDF"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportDocx} disabled={savingDocx} className="gap-2">
          {savingDocx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          {savingDocx ? "Exporting\u2026" : "Export Word"}
        </Button>
      </div>

      <div ref={contentRef}>
      {/* Header */}
      <div data-pdf-section className="mb-10">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Tennant Creek Gold Mine</p>
        <h1 className="text-2xl font-extrabold text-foreground mt-1 tracking-tight">Implementation Risk Assessment</h1>
        <p className="text-xs text-muted-foreground mt-1">Minesite.ai Work Management System — Prepared for site leadership and stakeholder review</p>
        <div className="h-[2px] bg-primary/30 mt-4 w-24" />
      </div>

    {/* 1. Purpose */}
    <section className="mb-10">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">1. Purpose</h2>
      <p className="text-[13px] text-muted-foreground leading-relaxed">
        This assessment outlines the implementation risks associated with rolling out the new work management system at Tennant Creek Gold Mine. The focus is on ensuring the system is introduced in a controlled and sustainable way, recognising that success depends on site readiness across people, process, data, and operational discipline.
      </p>
    </section>

    {/* 2. Current Position */}
    <section className="mb-10">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">2. Current Position</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Progress Made</p>
          <ul className="space-y-1.5">
            {[
              "Work Request and Work Order logic developed and being trialled on site",
              "Scheduling capability established",
              "Asset hierarchy rebuild in progress",
              "Parts catalogue development underway",
              "PM logic being developed",
              "System currently in active trial with site users creating live work orders",
            ].map(item => (
              <li key={item} className="text-[13px] text-muted-foreground flex gap-2">
                <span className="text-emerald-600 mt-0.5">•</span>{item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Areas Still Maturing</p>
          <ul className="space-y-1.5">
            {[
              "Stores and inventory controls still being established",
              "Stock visibility not yet reliable",
              "Parts and BOM linkage incomplete",
              "Work management behaviours still being embedded",
              "Site culture and buy-in remain the biggest challenge",
            ].map(item => (
              <li key={item} className="text-[13px] text-muted-foreground flex gap-2">
                <span className="text-amber-600 mt-0.5">•</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-[13px] text-muted-foreground font-semibold border-l-2 border-primary/40 pl-3">
        The system is in active trial. Early adoption is encouraging, but embedding consistent use across the full workforce remains the key challenge. Success depends on culture, leadership reinforcement, and getting everyone on board.
      </p>
    </section>

    {/* 3. Key Implementation Risks */}
    <section className="mb-10">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">3. Key Implementation Risks</h2>
      <div className="space-y-2.5">
        {RISKS.map((r, i) => (
          <div key={i} className="flex items-start gap-3 border border-border/60 rounded-lg px-4 py-3">
            <span className="text-xs font-mono font-semibold text-muted-foreground mt-0.5 w-5 shrink-0 text-right">{i + 1}.</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground">{r.title}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{r.description}</p>
            </div>
            <span className={cn("text-[10px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 mt-0.5", levelStyle[r.level])}>
              {r.level}
            </span>
          </div>
        ))}
      </div>
    </section>

    {/* 4. Recommended Approach */}
    <section className="mb-10">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">4. Recommended Approach</h2>
      <div className="space-y-4">
        <p className="text-[13px] text-muted-foreground font-semibold border-l-2 border-primary/40 pl-3">
          Continue the current trial approach. Expand adoption gradually as site behaviours mature and confidence builds.
        </p>
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Adopt Phased Implementation</p>
          <div className="flex gap-2 flex-wrap">
            {["Phase 1: Foundation Stabilisation", "Phase 2: Controlled Pilot", "Phase 3: Gradual Rollout"].map((p, i) => (
              <div key={p} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/40 text-xs">→</span>}
                <span className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-md border",
                  i === 0 ? "bg-blue-500/10 border-blue-500/30 text-blue-700" :
                  i === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-700" :
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-700"
                )}>{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Focus Areas</p>
          <ul className="space-y-1.5">
            {[
              "Leadership enforcement of system use and process compliance",
              "User adoption through role-specific training and on-shift support",
              "Training delivered by role, reinforced through coaching and refreshers",
              "Removal of parallel systems (spreadsheets, manual trackers, whiteboards)",
            ].map(item => (
              <li key={item} className="text-[13px] text-muted-foreground flex gap-2">
                <span className="text-primary mt-0.5">•</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* 5. Final Position */}
    <section data-pdf-section className="mb-6">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">5. Final Position</h2>
      <div className="bg-muted/30 border border-border rounded-lg px-5 py-4 space-y-3">
        <p className="text-[13px] text-foreground font-semibold leading-relaxed">
          The system is strong and is already being trialled on site with real work orders.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The biggest risk to successful rollout is not the software. It is site culture, user buy-in, and consistent leadership enforcement. Getting everyone on board, following the process every time, and removing reliance on old methods is what will determine whether this succeeds long-term.
        </p>
        <p className="text-[13px] text-foreground font-semibold leading-relaxed">
          A controlled, phased approach, continuing the current trial and expanding as behaviours mature, gives the best chance of lasting adoption.
        </p>
      </div>
    </section>

    {/* Footer */}
    <div className="border-t border-border pt-4 mt-10">
      <p className="text-[10px] text-muted-foreground">Tennant Creek Gold Mine — Implementation Risk Assessment — Prepared for leadership and stakeholder review</p>
    </div>
    </div>
  </div>
  );
};

export default ImplementationRiskAssessment;
