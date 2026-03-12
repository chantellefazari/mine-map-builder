import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle2, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  areaCodes,
  equipmentPrefixes,
  componentSuffixes,
  instrumentationSuffixes,
  specialPatterns,
} from "@/components/hierarchy/namingConventionData";
import { PDF_COLORS } from "@/utils/pdfExportStandard";

const { GOLD, GOLD_BG, GOLD_LIGHT, DARK } = PDF_COLORS;

const crusherPrefixes = [
  { prefix: "ROM", meaning: "ROM Bin", example: "ROM01" },
  { prefix: "FDR", meaning: "Vibrating Feeder", example: "FDR01" },
  { prefix: "CRS", meaning: "Crusher (Jaw / Cone)", example: "CRS01 (Jaw), CRS02 (Sec Cone), CRS03 (Tert Cone)" },
  { prefix: "MAG", meaning: "Overband Magnet", example: "MAG01" },
  { prefix: "GFB", meaning: "Ground Feed Bin", example: "GFB01" },
  { prefix: "SCN", meaning: "Vibrating Screen", example: "SCN01" },
  { prefix: "CV", meaning: "Conveyor (shared prefix)", example: "CV01, CV02, CV04 to CV15" },
  { prefix: "CFB", meaning: "Cone Feed Bin", example: "CFB01" },
  { prefix: "DUST", meaning: "Dust Suppression System", example: "DUST01" },
  { prefix: "WS", meaning: "Water Supply System", example: "WS01" },
];

export const NamingConventionDocument = () => {
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
        "TCMG-STD-NAM-001_Site_Naming_Convention.pdf",
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
              <CardTitle className="text-xl">Site Asset Naming Convention</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">TCMG-STD-NAM-001 Rev 1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="gap-2" disabled={downloading}>
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {downloading ? "Generating..." : "Download PDF"}
            </Button>
            <span className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <CheckCircle2 className="w-3 h-3" /> Defined and Stable
            </span>
          </div>
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
                  <h1 style={{ fontSize: 20, fontWeight: 700, margin: "4px 0 0 0" }}>Site Asset Naming Convention</h1>
                  <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0 0" }}>Gold Processing Plant | Asset Naming Standard</p>
                </div>
                <div style={{ textAlign: "right", fontSize: 10, color: "#666", borderLeft: `3px solid ${GOLD}`, paddingLeft: 10 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: DARK }}>TCMG-STD-NAM-001</p>
                  <p style={{ margin: "2px 0 0 0" }}>Rev 1.0</p>
                  <p style={{ margin: "2px 0 0 0" }}>{today}</p>
                </div>
              </div>
            </div>




            {/* 1. Purpose */}
            <h2 style={heading("Purpose")}>1. Purpose</h2>
            <p style={{ fontSize: 11.5, lineHeight: 1.45, color: "#333", margin: "0 0 4px 0" }}>
              This document outlines the complete asset numbering logic used across the Tennant Creek Mining Group (TCMG) Processing Plant. It is designed to be shared with contractors and OEM suppliers to ensure consistent naming, avoid prefix collisions, and maintain a unified site standard across all facilities.
            </p>
            <div style={{ display: "inline-block", border: `2px solid ${GOLD}`, borderRadius: 5, padding: "6px 20px", marginBottom: 8, backgroundColor: GOLD_BG }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", letterSpacing: 2, color: DARK }}>[PREFIX][NUMBER]-[SUFFIX][NUMBER]</span>
            </div>
            <p style={{ fontSize: 11, color: "#555", margin: "4px 0 10px 0" }}>
              <strong>Example:</strong> <span style={{ fontFamily: "monospace" }}>BM01-MTR01</span> = Ball Mill 01, Motor 01
            </p>

            {/* 2. Area Codes */}
            <h2 style={heading("Area Codes")}>2. Area Codes (Level 3 of Hierarchy)</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 70 }}>Code</th>
                  <th style={{ ...thGold, width: 140 }}>Meaning</th>
                  <th style={thGold}>Description</th>
                </tr>
              </thead>
              <tbody>
                {areaCodes.map((a, i) => (
                  <tr key={a.code} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, color: GOLD }}>{a.code}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{a.meaning}</td>
                    <td style={{ ...td, color: "#444" }}>{a.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 3. Equipment Prefixes */}
            <h2 style={heading("Equipment Prefixes")}>3. Equipment Type Prefixes (Reserved)</h2>
            <p style={{ fontSize: 11, lineHeight: 1.45, color: "#333", margin: "0 0 6px 0" }}>
              These prefixes are <strong>reserved</strong> across the Processing Plant. Crusher assets must not duplicate these unless the same equipment type is genuinely being used.
            </p>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 70 }}>Prefix</th>
                  <th style={{ ...thGold, width: 160 }}>Equipment Type</th>
                  <th style={thGold}>Example</th>
                </tr>
              </thead>
              <tbody>
                {equipmentPrefixes.map((e, i) => (
                  <tr key={e.prefix} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, color: GOLD }}>{e.prefix}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{e.meaning}</td>
                    <td style={{ ...td, fontFamily: "monospace", color: "#555" }}>{e.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 4. Component Suffixes */}
            <h2 style={heading("Component Suffixes")}>4. Component Suffixes (After Hyphen)</h2>
            <p style={{ fontSize: 11, lineHeight: 1.45, color: "#333", margin: "0 0 6px 0" }}>
              When a child component sits under a parent asset, it uses these standardised suffixes.
            </p>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 70 }}>Suffix</th>
                  <th style={{ ...thGold, width: 160 }}>Component Type</th>
                  <th style={thGold}>Example</th>
                </tr>
              </thead>
              <tbody>
                {componentSuffixes.map((c, i) => (
                  <tr key={c.suffix} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, color: GOLD }}>{c.suffix}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{c.meaning}</td>
                    <td style={{ ...td, fontFamily: "monospace", color: "#555" }}>{c.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 5. Instrumentation Suffixes */}
            <h2 style={heading("Instrumentation")}>5. Instrumentation Suffixes</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 70 }}>Suffix</th>
                  <th style={{ ...thGold, width: 160 }}>Instrument Type</th>
                  <th style={thGold}>Example</th>
                </tr>
              </thead>
              <tbody>
                {instrumentationSuffixes.map((inst, i) => (
                  <tr key={inst.suffix} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, color: GOLD }}>{inst.suffix}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{inst.meaning}</td>
                    <td style={{ ...td, fontFamily: "monospace", color: "#555" }}>{inst.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 6. Special Patterns */}
            <h2 style={heading("Special Patterns")}>6. Special Naming Patterns</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 100 }}>Pattern</th>
                  <th style={{ ...thGold, width: 180 }}>Meaning</th>
                  <th style={thGold}>Example</th>
                </tr>
              </thead>
              <tbody>
                {specialPatterns.map((p, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, color: GOLD }}>{p.pattern}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{p.meaning}</td>
                    <td style={{ ...td, fontFamily: "monospace", color: "#555" }}>{p.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 7. Crusher Prefixes */}
            <h2 style={heading("Crusher Prefixes")}>7. Suggested Crusher (CRU) Equipment Prefixes</h2>
            <p style={{ fontSize: 11, lineHeight: 1.45, color: "#333", margin: "0 0 6px 0" }}>
              The following prefixes are <strong>suggested</strong> for Crushing Plant equipment. They have been checked against the existing Processing Plant prefixes above to avoid collisions.
            </p>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 70 }}>Prefix</th>
                  <th style={{ ...thGold, width: 160 }}>Equipment Type</th>
                  <th style={thGold}>Suggested Example</th>
                </tr>
              </thead>
              <tbody>
                {crusherPrefixes.map((c, i) => (
                  <tr key={c.prefix} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, color: GOLD }}>{c.prefix}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{c.meaning}</td>
                    <td style={{ ...td, fontFamily: "monospace", color: "#555" }}>{c.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 8, marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#888" }}>
              <span>TCMG-STD-NAM-001 Rev 1.0</span>
              <span>Tennant Creek Mine | Confidential</span>
              <span>{today}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
