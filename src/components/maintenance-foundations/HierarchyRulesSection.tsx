import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDF_COLORS } from "@/utils/pdfExportStandard";

const { GOLD, GOLD_BG, GOLD_LIGHT, DARK } = PDF_COLORS;

const hierarchyLevels = [
  { level: "1", name: "Site", example: "TCMG", desc: "Top level site identifier", hasFL: "Yes" },
  { level: "2", name: "Facility", example: "Processing Plant / Crushing Plant", desc: "Major operational facility", hasFL: "Yes" },
  { level: "3", name: "Main Area", example: "SITE / UTL / COM / GR / TAIL / SUP", desc: "High level process grouping (not an asset)", hasFL: "Yes" },
  { level: "4", name: "Sub Area", example: "GRIND, CIP, FILT, ELEC, WTR", desc: "Logical process subdivision", hasFL: "Yes" },
  { level: "5", name: "Parent Asset (System)", example: "BM01 Ball Mill, FP01 Filter Press", desc: "Physical anchor asset. FL stops here", hasFL: "Yes" },
  { level: "6", name: "Equipment", example: "BM01-MTR01, FP01-GBX01", desc: "Maintainable equipment items", hasFL: "No" },
  { level: "7", name: "Component", example: "Bearings, seals, impellers, belts", desc: "OEM level parts. No asset number", hasFL: "No" },
];

const parentChildRules = [
  "Every level (except Site) must have exactly one parent",
  "Equipment (L6) must always sit under a Parent Asset (L5)",
  "Components (L7) inherit the Functional Location of their parent",
  "Electrical equipment sits under the equipment it powers",
  "No orphan assets are permitted. Every asset has a traceable path to Site",
  "Duty/Standby pairs share a single Parent FL",
];

const constraints = [
  "Do NOT merge hierarchy levels",
  "Do NOT skip levels in the structure",
  "Do NOT create duplicate Parent Assets",
  "Do NOT assign asset numbers to components (L7)",
  "Do NOT change hierarchy once assigned without formal MOC",
  "Do NOT create a Functional Location below Level 5",
];

const assetNumberingExamples = [
  { number: "APRN01-CV01", desc: "Transfer Conveyor 01 (Apron Feeder system)" },
  { number: "GRND01-BM01", desc: "Ball Mill 01 (Grinding system)" },
  { number: "FILT01-FP01", desc: "Filter Press 01 (Filtering system)" },
  { number: "CIP01-AGT01", desc: "Agitator 01 (CIP/Leaching system)" },
  { number: "THK01-DRV01", desc: "Drive 01 (Thickener system)" },
];

const equipmentAbbreviations = [
  { code: "CV", meaning: "Conveyor" },
  { code: "PP", meaning: "Pump" },
  { code: "MTR", meaning: "Motor" },
  { code: "GBX", meaning: "Gearbox" },
  { code: "AGT", meaning: "Agitator" },
  { code: "FDR", meaning: "Feeder" },
  { code: "BRG", meaning: "Bearing Assembly" },
  { code: "VLV", meaning: "Valve" },
  { code: "CYC", meaning: "Cyclone" },
  { code: "CP", meaning: "Coupling" },
  { code: "SCN", meaning: "Screen" },
  { code: "DRV", meaning: "Drive" },
];

export const HierarchyRulesSection = () => {
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
        "TCMG-STD-AH-001_Asset_Hierarchy_Parent_Child_Rules.pdf",
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
              <GitBranch className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Asset Hierarchy & Parent Child Rules</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Approved hierarchy structure and rules for maintenance, reporting, and future asset creation</p>
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
          <div data-pdf-section style={{ padding: "28px 32px" }}>
            {/* Header */}
            <div style={{ borderBottom: `3px solid ${GOLD}`, paddingBottom: 12, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "inline-block", backgroundColor: GOLD, color: "#fff", padding: "3px 12px", borderRadius: 3, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>TENNANT CREEK MINE</div>
                  <h1 style={{ fontSize: 20, fontWeight: 700, margin: "4px 0 0 0" }}>Asset Hierarchy & Parent Child Rules</h1>
                  <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0 0" }}>Gold Processing Plant | 7 Level Hierarchy Standard</p>
                </div>
                <div style={{ textAlign: "right", fontSize: 10, color: "#666", borderLeft: `3px solid ${GOLD}`, paddingLeft: 10 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: DARK }}>TCMG-STD-AH-001</p>
                  <p style={{ margin: "2px 0 0 0" }}>Rev A</p>
                  <p style={{ margin: "2px 0 0 0" }}>{today}</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <table style={{ width: "100%", fontSize: 10.5, borderCollapse: "collapse", marginBottom: 14 }}>
              <tbody>
                <tr>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontWeight: 600, backgroundColor: GOLD_LIGHT, width: "14%" }}>Prepared By</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", width: "36%" }}>TCMG Maintenance Team</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontWeight: 600, backgroundColor: GOLD_LIGHT, width: "14%" }}>Approved By</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", width: "36%" }}>Maintenance Superintendent</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontWeight: 600, backgroundColor: GOLD_LIGHT }}>Status</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd" }}>Controlled</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontWeight: 600, backgroundColor: GOLD_LIGHT }}>Effective Date</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd" }}>March 2026</td>
                </tr>
              </tbody>
            </table>

            {/* Purpose */}
            <h2 style={heading("Purpose")}>1. Purpose</h2>
            <p style={{ fontSize: 11.5, lineHeight: 1.45, color: "#333", margin: "0 0 4px 0" }}>
              This document defines the approved 7 level hierarchy structure and parent child rules used at Tennant Creek Mine for all maintenance activities, CMMS data entry, reporting, and future asset creation. This standard mirrors SAP / Maximo / D365 mature site practice, separating rules from data and protecting the integrity of the asset tree.
            </p>
            <p style={{ fontSize: 11.5, lineHeight: 1.45, color: "#333", margin: "0 0 10px 0" }}>
              This document is descriptive and instructional only. It does not modify, move, rename, or update any existing assets or hierarchy data. It governs all future asset creation and hierarchy management.
            </p>

            {/* 2. Hierarchy Levels */}
            <h2 style={heading("Hierarchy")}>2. Approved Asset Hierarchy (7 Levels)</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 45, textAlign: "center" }}>Level</th>
                  <th style={{ ...thGold, width: 120 }}>Name</th>
                  <th style={thGold}>Example</th>
                  <th style={thGold}>Description</th>
                  <th style={{ ...thGold, width: 35, textAlign: "center" }}>FL</th>
                </tr>
              </thead>
              <tbody>
                {hierarchyLevels.map((item, i) => (
                  <tr key={item.level} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, textAlign: "center", color: GOLD }}>{item.level}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{item.name}</td>
                    <td style={{ ...td, fontFamily: "monospace", fontSize: 10 }}>{item.example}</td>
                    <td style={{ ...td, color: "#444" }}>{item.desc}</td>
                    <td style={{ ...td, textAlign: "center" }}>{item.hasFL}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 3. Parent Child Rules */}
            <h2 style={heading("Rules")}>3. Parent Child Rules</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thDark, width: 40, textAlign: "center" }}>#</th>
                  <th style={thDark}>Rule</th>
                </tr>
              </thead>
              <tbody>
                {parentChildRules.map((rule, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontWeight: 700, textAlign: "center", color: GOLD }}>{i + 1}</td>
                    <td style={td}>{rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 4. Constraints */}
            <h2 style={heading("Constraints")}>4. Constraints (Non Negotiable)</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thDark, width: 40, textAlign: "center" }}>#</th>
                  <th style={thDark}>Constraint</th>
                </tr>
              </thead>
              <tbody>
                {constraints.map((c, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontWeight: 700, textAlign: "center", color: GOLD }}>{i + 1}</td>
                    <td style={td}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 5. FL Rules */}
            <h2 style={heading("FL Rules")}>5. Functional Location (FL) Rules</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thDark, width: 40, textAlign: "center" }}>#</th>
                  <th style={thDark}>Rule</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "FL format: TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]",
                  "Functional Locations stop at Parent Asset (L5) level. Never assigned to equipment or components",
                  "Equipment (L6) and Components (L7) inherit the FL of their parent system",
                  "Duty/Standby and identical grouped assets share one Parent FL",
                  "Each FL is unique across the entire site. No duplicates permitted",
                  "FL codes are immutable once assigned and may not be reused",
                ].map((rule, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontWeight: 700, textAlign: "center", color: GOLD }}>{i + 1}</td>
                    <td style={td}>{rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 6. Asset Numbering */}
            <h2 style={heading("Numbering")}>6. Asset Numbering Standard</h2>
            <div style={{ display: "inline-block", border: `2px solid ${GOLD}`, borderRadius: 5, padding: "6px 20px", marginBottom: 8, backgroundColor: GOLD_BG }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", letterSpacing: 2, color: DARK }}>[AREA][NN]-[TYPE][NN]</span>
            </div>
            <p style={{ fontSize: 11, color: "#555", margin: "4px 0 8px 0" }}>
              Parent assets use the Area prefix with a sequential number. Equipment uses the parent number followed by an equipment type abbreviation and sequence.
            </p>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>Asset Number Examples</p>
                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
                  <thead><tr><th style={thGold}>Asset Number</th><th style={thGold}>Description</th></tr></thead>
                  <tbody>
                    {assetNumberingExamples.map((ex, i) => (
                      <tr key={ex.number} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                        <td style={{ ...td, fontFamily: "monospace", fontWeight: 600 }}>{ex.number}</td>
                        <td style={{ ...td, color: "#444" }}>{ex.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>Equipment Type Abbreviations</p>
                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
                  <thead><tr><th style={{ ...thGold, width: 60 }}>Code</th><th style={thGold}>Meaning</th></tr></thead>
                  <tbody>
                    {equipmentAbbreviations.map((abbr, i) => (
                      <tr key={abbr.code} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                        <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, color: GOLD }}>{abbr.code}</td>
                        <td style={td}>{abbr.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 7. Numbering Rules */}
            <h2 style={heading("Numbering Rules")}>7. Asset Numbering Rules</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thDark, width: 120 }}>Rule</th>
                  <th style={thDark}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rule: "Sequential", desc: "Numbers allocated in order within each Area" },
                  { rule: "Unique", desc: "No duplicate asset numbers across the entire site" },
                  { rule: "Immutable", desc: "Once assigned, numbers are never reused or changed" },
                  { rule: "No Gaps", desc: "Unused numbers must be documented with a reason" },
                  { rule: "All Caps", desc: "Asset numbers and FL codes always use uppercase letters" },
                ].map((item, i) => (
                  <tr key={item.rule} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontWeight: 600 }}>{item.rule}</td>
                    <td style={{ ...td, color: "#444" }}>{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 8. Governance */}
            <h2 style={heading("Governance")}>8. Governance & Change Control</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thDark, width: 40, textAlign: "center" }}>#</th>
                  <th style={thDark}>Requirement</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "All hierarchy changes require a formal Management of Change (MOC) process",
                  "New assets must be reviewed and approved by the Maintenance Superintendent before CMMS entry",
                  "This document is the single source of truth. Any deviation must be documented and approved",
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
            <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 8, marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#888" }}>
              <span>TCMG-STD-AH-001 Rev A</span>
              <span>Tennant Creek Mine | Confidential</span>
              <span>{today}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
