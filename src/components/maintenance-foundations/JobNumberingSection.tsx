import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDF_COLORS } from "@/utils/pdfExportStandard";

const { GOLD, GOLD_BG, GOLD_LIGHT, DARK } = PDF_COLORS;

const numberingRules = [
  { rule: "Unique", desc: "Each work order number must be unique and never reused" },
  { rule: "Sequential", desc: "Numbers are allocated strictly in numerical order from a central register" },
  { rule: "Controlled", desc: "Work order numbers are reserved before work begins, not after completion" },
  { rule: "Traceable", desc: "Every work order number links to documented maintenance history" },
  { rule: "No Gaps", desc: "Unused or cancelled numbers must be recorded with a reason" },
  { rule: "Single Source", desc: "Work order numbers are generated from one controlled system only" },
];

const mandatoryFields = [
  { field: "Work Order Number", desc: "Unique identifier for traceability" },
  { field: "Work Type", desc: "Breakdown, Planned, Shutdown" },
  { field: "Priority", desc: "Critical, High, Medium, Low" },
  { field: "Asset / Equipment ID", desc: "What is being worked on" },
  { field: "Functional Location", desc: "Where in the hierarchy" },
  { field: "Short Description", desc: "Clear summary of the work" },
  { field: "Long Description", desc: "Detailed scope and findings" },
  { field: "Reported Date & Time", desc: "When issue was raised" },
  { field: "Completed Date & Time", desc: "When work was finished" },
  { field: "Assigned Trade", desc: "Responsible discipline" },
  { field: "Performed By", desc: "Who completed the work" },
  { field: "Parts Used", desc: "Materials consumed (if applicable)" },
];

const workTypes = [
  { type: "Breakdown", category: "Reactive", desc: "Unplanned maintenance performed when equipment has failed, is failing, or poses an immediate safety or production risk", examples: "Pump seal failure, motor tripping on overload, conveyor belt tear, gearbox failure" },
  { type: "Preventive", category: "Proactive", desc: "Fixed interval tasks performed on a scheduled basis to prevent failure and maintain reliability", examples: "Weekly inspections, monthly greasing, annual overhauls, filter changes" },
  { type: "Condition Based", category: "Proactive", desc: "Maintenance triggered by condition monitoring thresholds rather than fixed intervals", examples: "Vibration analysis, oil sampling, thermography, bearing temperature trends" },
  { type: "Shutdown", category: "Proactive", desc: "Planned major maintenance events requiring full or partial plant shutdown", examples: "Mill reline, thickener internal inspection, major electrical shutdowns" },
];

export const JobNumberingSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    setDownloading(true);
    try {
      const { exportSectionsToPdf } = await import("@/utils/sectionPdfExport");
      const { PDF_EXPORT_OPTS } = await import("@/utils/pdfExportStandard");
      await exportSectionsToPdf(
        contentRef.current,
        "TCMG-STD-WO-001_Work_Order_Numbering_Standard.pdf",
        PDF_EXPORT_OPTS
      );
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
  const thGold: React.CSSProperties = { padding: "6px 10px", textAlign: "left", backgroundColor: GOLD, color: "#fff", fontSize: 13, fontWeight: 700 };
  const thDark: React.CSSProperties = { ...thGold, backgroundColor: DARK };
  const td: React.CSSProperties = { padding: "5px 10px", border: "1px solid #ddd", fontSize: 13 };
  const heading = (text: string): React.CSSProperties => ({ fontSize: 16, fontWeight: 700, margin: "18px 0 8px 0", borderBottom: `2px solid ${GOLD}`, paddingBottom: 4, color: DARK });

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Maintenance WO Numbering Standards</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">TCMG-STD-WO-001 Rev 1.0</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={downloading} className="gap-2 shrink-0">
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={contentRef} className="bg-white text-black rounded-lg border shadow-sm overflow-auto max-h-[70vh]" style={{ fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif" }}>
          <div data-pdf-section style={{ padding: "28px 36px" }}>
            {/* Header */}
            <div style={{ borderBottom: `3px solid ${GOLD}`, paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "inline-block", backgroundColor: GOLD, color: "#fff", padding: "4px 14px", borderRadius: 3, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>TENNANT CREEK MINE</div>
                  <h1 style={{ fontSize: 22, fontWeight: 700, margin: "4px 0 0 0" }}>Work Order Numbering & Job Standards</h1>
                  <p style={{ fontSize: 13, color: "#666", margin: "2px 0 0 0" }}>Gold Processing Plant | WO Governance Standard</p>
                </div>
                <div style={{ textAlign: "right", fontSize: 11, color: "#666", borderLeft: `3px solid ${GOLD}`, paddingLeft: 10 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: DARK }}>TCMG-STD-WO-001</p>
                  <p style={{ margin: "2px 0 0 0" }}>Rev 1.0</p>
                  <p style={{ margin: "2px 0 0 0" }}>{today}</p>
                </div>
              </div>
            </div>

            {/* 1. Purpose */}
            <h2 style={heading("Purpose")}>1. Purpose</h2>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: "#333", margin: "0 0 6px 0" }}>
              This document defines how work orders are uniquely numbered, controlled, and traced across Tennant Creek Mine. It establishes the approved numbering format, mandatory data fields, and work type definitions to ensure consistent classification and complete maintenance history.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: "#333", margin: "0 0 12px 0" }}>
              All maintenance work, whether reactive or proactive, must be captured under a formally allocated work order number before any work commences on site.
            </p>

            {/* 2. Numbering Format */}
            <h2 style={heading("Format")}>2. Work Order Numbering Format</h2>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: "#333", margin: "0 0 8px 0" }}>
              All work orders use a standardised 6 digit sequential format generated from the central register. Numbers are auto allocated and cannot be manually assigned or overridden.
            </p>
            <div style={{ display: "inline-block", border: `2px solid ${GOLD}`, borderRadius: 5, padding: "8px 24px", marginBottom: 10, backgroundColor: GOLD_BG }}>
              <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", letterSpacing: 4, color: DARK }}>WO-XXXXXX</span>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              {[
                { n: "WO-000001", d: "First work order" },
                { n: "WO-000150", d: "Sequential allocation" },
                { n: "WO-001234", d: "Current range" },
              ].map((ex) => (
                <div key={ex.n} style={{ flex: 1, border: `1px solid ${GOLD}`, borderRadius: 4, padding: "6px 10px", backgroundColor: GOLD_BG, textAlign: "center" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: DARK }}>{ex.n}</span>
                  <p style={{ fontSize: 11, color: "#666", margin: "2px 0 0 0" }}>{ex.d}</p>
                </div>
              ))}
            </div>

            {/* 3. Numbering Rules */}
            <h2 style={heading("Rules")}>3. Numbering Rules</h2>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", marginBottom: 12 }}>
              <thead>
                <tr>
                  <th style={{ ...thDark, width: "22%" }}>Rule</th>
                  <th style={thDark}>Description</th>
                </tr>
              </thead>
              <tbody>
                {numberingRules.map((r, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontWeight: 600 }}>{r.rule}</td>
                    <td style={td}>{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 4. Mandatory Fields */}
            <h2 style={heading("Fields")}>4. Minimum Job Data Standards</h2>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: "#333", margin: "0 0 8px 0" }}>
              Every work order must contain the following mandatory fields to ensure complete traceability and maintenance history integrity.
            </p>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", marginBottom: 12 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 40, textAlign: "center" }}>#</th>
                  <th style={{ ...thGold, width: "30%" }}>Field</th>
                  <th style={thGold}>Description</th>
                </tr>
              </thead>
              <tbody>
                {mandatoryFields.map((item, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontWeight: 700, textAlign: "center", color: GOLD }}>{i + 1}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{item.field}</td>
                    <td style={{ ...td, color: "#444" }}>{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 5. Work Type Definitions */}
            <h2 style={heading("Work Types")}>5. Work Type Definitions</h2>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: "#333", margin: "0 0 8px 0" }}>
              All maintenance work falls into one of two categories: Reactive (responding to a problem) or Proactive (preventing a problem). Every work order must be classified under one of these types.
            </p>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", marginBottom: 12 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: "16%" }}>Type</th>
                  <th style={{ ...thGold, width: "12%" }}>Category</th>
                  <th style={thGold}>Definition</th>
                  <th style={{ ...thGold, width: "28%" }}>Examples</th>
                </tr>
              </thead>
              <tbody>
                {workTypes.map((wt, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontWeight: 600 }}>{wt.type}</td>
                    <td style={{ ...td, fontWeight: 600, color: wt.category === "Reactive" ? "#c53030" : "#2f855a" }}>{wt.category}</td>
                    <td style={{ ...td, color: "#444" }}>{wt.desc}</td>
                    <td style={{ ...td, fontSize: 12, color: "#555" }}>{wt.examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 6. Governance */}
            <h2 style={heading("Governance")}>6. Governance</h2>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", marginBottom: 12 }}>
              <thead>
                <tr>
                  <th style={{ ...thDark, width: 40, textAlign: "center" }}>#</th>
                  <th style={thDark}>Requirement</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "No work may commence without a formally allocated work order number",
                  "Work orders must be closed within 48 hours of work completion",
                  "Cancelled work orders must include a documented reason",
                  "The Send for Approval workflow transitions the WO to Pending Approval status before execution",
                  "Optional fields (Failure Cause, Follow Up Required) are captured where practical",
                  "Annual review required. Next review date: March 2027",
                ].map((req, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontWeight: 700, textAlign: "center", color: GOLD }}>{i + 1}</td>
                    <td style={td}>{req}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 10, color: "#888" }}>
              <span>TCMG-STD-WO-001 Rev 1.0</span>
              <span>Tennant Creek Mine | Confidential</span>
              <span>{today}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
