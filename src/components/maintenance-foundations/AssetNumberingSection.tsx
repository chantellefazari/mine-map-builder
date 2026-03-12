import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, CheckCircle2, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PDF_COLORS } from "@/utils/pdfExportStandard";

const { GOLD, GOLD_BG, GOLD_LIGHT, DARK } = PDF_COLORS;

const areaCodeTable = [
  { code: "SITE", label: "Site Infrastructure", subAreas: "INFRA" },
  { code: "UTL", label: "Utilities & Power", subAreas: "COMP, ELEC, REAG, WTR" },
  { code: "COM", label: "Comminution / Process", subAreas: "FEED, GRIND, CLASS" },
  { code: "GR", label: "Gold Recovery", subAreas: "CIP, ELUT, GOLD, GRAV, REGEN" },
  { code: "TAIL", label: "Tailings", subAreas: "FILT, THK" },
  { code: "SUP", label: "Support Services", subAreas: "MOBILE" },
];

const subAreaCodeTable = [
  { area: "COM", code: "FEED", meaning: "Feed / Reclaim", example: "TCMG-PP-COM-FEED-RCFD01" },
  { area: "COM", code: "GRIND", meaning: "Grinding", example: "TCMG-PP-COM-GRIND-BM01" },
  { area: "COM", code: "CLASS", meaning: "Classification", example: "TCMG-PP-COM-CLASS-CYC01" },
  { area: "GR", code: "CIP", meaning: "CIP / Leaching", example: "TCMG-PP-GR-CIP-LCH01" },
  { area: "GR", code: "ELUT", meaning: "Elution", example: "TCMG-PP-GR-ELUT-ELU01" },
  { area: "GR", code: "GOLD", meaning: "Gold Room", example: "TCMG-PP-GR-GOLD-EW01" },
  { area: "GR", code: "GRAV", meaning: "Gravity Circuit", example: "TCMG-PP-GR-GRAV-KNL01" },
  { area: "GR", code: "REGEN", meaning: "Carbon Regeneration", example: "TCMG-PP-GR-REGEN-KLN01" },
  { area: "TAIL", code: "FILT", meaning: "Filtering", example: "TCMG-PP-TAIL-FILT-FP01" },
  { area: "TAIL", code: "THK", meaning: "Thickening", example: "TCMG-PP-TAIL-THK-THK01" },
  { area: "UTL", code: "COMP", meaning: "Compressed Air", example: "TCMG-PP-UTL-COMP-COMP01" },
  { area: "UTL", code: "ELEC", meaning: "Electrical / Controls", example: "TCMG-PP-UTL-ELEC-GEN01" },
  { area: "UTL", code: "REAG", meaning: "Reagents", example: "TCMG-PP-UTL-REAG-LIME01" },
  { area: "UTL", code: "WTR", meaning: "Water", example: "TCMG-PP-UTL-WTR-RO01" },
  { area: "SITE", code: "INFRA", meaning: "Site Infrastructure", example: "TCMG-PP-SITE-INFRA-BLDG01" },
  { area: "SUP", code: "MOBILE", meaning: "Mobile Equipment", example: "TCMG-PP-SUP-MOBILE-MOB01" },
];

const flExamples = [
  { fl: "TCMG-PP-COM-GRIND-BM01", system: "BM01 Primary Ball Mill", children: "BM01-MTR01, BM01-GBX01, BM01-BRG01" },
  { fl: "TCMG-PP-COM-CLASS-CYC01", system: "CYC01 Primary Cyclones", children: "CYC01-PMP01, CYC01-FDR01" },
  { fl: "TCMG-PP-GR-CIP-LCH01", system: "LCH01 Leach Tanks", children: "LCH01-AGT01, LCH01-PMP01" },
  { fl: "TCMG-PP-GR-GRAV-KNL01", system: "KNL01 Knelson Concentrator", children: "KNL01-PMP01, KNL01-PNL01" },
  { fl: "TCMG-PP-TAIL-THK-THK01", system: "THK01 Tails Thickener", children: "THK01-DRV01, THK01-PMP01" },
  { fl: "TCMG-PP-UTL-ELEC-GEN01", system: "GEN01 Generation", children: "PGEN01, PGEN02, PGEN03" },
];

export const AssetNumberingSection = () => {
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
        "TCMG-STD-FL-001_Functional_Location_Codes.pdf",
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
              <CardTitle className="text-xl">Functional Location Codes</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">TCMG-STD-FL-001 Rev 2.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="gap-2" disabled={downloading}>
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {downloading ? "Generating..." : "Download PDF"}
            </Button>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Defined & Stable
            </Badge>
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
                  <h1 style={{ fontSize: 20, fontWeight: 700, margin: "4px 0 0 0" }}>Functional Location Codes</h1>
                  <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0 0" }}>Gold Processing Plant | FL Code Standard</p>
                </div>
                <div style={{ textAlign: "right", fontSize: 10, color: "#666", borderLeft: `3px solid ${GOLD}`, paddingLeft: 10 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: DARK }}>TCMG-STD-FL-001</p>
                  <p style={{ margin: "2px 0 0 0" }}>Rev 2.0</p>
                  <p style={{ margin: "2px 0 0 0" }}>{today}</p>
                </div>
              </div>
            </div>




            {/* 1. Purpose */}
            <h2 style={heading("Purpose")}>1. Purpose</h2>
            <p style={{ fontSize: 11.5, lineHeight: 1.45, color: "#333", margin: "0 0 4px 0" }}>
              FL codes define where assets physically and functionally exist within the plant. They answer: <strong>"Where in the plant does this equipment belong?"</strong> Used for asset hierarchy, maintenance planning, work history, PM alignment, and D365 integration.
            </p>

            {/* FL Format */}
            <h2 style={heading("Format")}>2. FL Code Format</h2>
            <div style={{ display: "inline-block", border: `2px solid ${GOLD}`, borderRadius: 5, padding: "6px 20px", marginBottom: 8, backgroundColor: GOLD_BG }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", letterSpacing: 2, color: DARK }}>TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]</span>
            </div>
            <table style={{ width: "100%", fontSize: 11.5, borderCollapse: "collapse", marginBottom: 8 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 100 }}>Segment</th>
                  <th style={thGold}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...td, fontFamily: "monospace", fontWeight: 700 }}>TCMG</td><td style={td}>Tennant Creek Gold Mine</td></tr>
                <tr style={{ backgroundColor: GOLD_BG }}><td style={{ ...td, fontFamily: "monospace", fontWeight: 700 }}>PP</td><td style={td}>Processing Plant</td></tr>
                <tr><td style={{ ...td, fontFamily: "monospace", fontWeight: 700 }}>AREA</td><td style={td}>Major plant area (6 approved codes)</td></tr>
                <tr style={{ backgroundColor: GOLD_BG }}><td style={{ ...td, fontFamily: "monospace", fontWeight: 700 }}>SUBAREA</td><td style={td}>Functional sub area within the area</td></tr>
                <tr><td style={{ ...td, fontFamily: "monospace", fontWeight: 700 }}>SYSTEM</td><td style={td}>Parent Asset / System (lowest FL level)</td></tr>
              </tbody>
            </table>

            {/* Hierarchy visual */}
            <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.6, marginBottom: 12, padding: "8px 12px", backgroundColor: GOLD_BG, border: `1px solid ${GOLD}`, borderRadius: 4 }}>
              <p style={{ margin: 0, fontWeight: 700 }}>TCMG</p>
              <p style={{ margin: 0, paddingLeft: 16, color: "#555" }}>└── PP (Processing Plant)</p>
              <p style={{ margin: 0, paddingLeft: 32, color: "#555" }}>└── COM (Comminution / Process)</p>
              <p style={{ margin: 0, paddingLeft: 48, color: "#555" }}>└── GRIND (Grinding)</p>
              <p style={{ margin: 0, paddingLeft: 64, fontWeight: 700, color: GOLD }}>└── BM01 (Primary Ball Mill) ← FL stops here</p>
              <p style={{ margin: 0, paddingLeft: 80, color: "#888" }}>└── BM01-MTR01 (inherits parent FL)</p>
            </div>

            {/* 3. Area Codes */}
            <h2 style={heading("Area Codes")}>3. Area Codes (6 Approved)</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 70 }}>Code</th>
                  <th style={{ ...thGold, width: 160 }}>Area</th>
                  <th style={thGold}>Sub Area Codes</th>
                </tr>
              </thead>
              <tbody>
                {areaCodeTable.map((a, i) => (
                  <tr key={a.code} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, color: GOLD }}>{a.code}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{a.label}</td>
                    <td style={{ ...td, fontFamily: "monospace", color: "#555" }}>{a.subAreas}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 4. Sub Area Codes */}
            <h2 style={heading("Sub Areas")}>4. Sub Area Codes & Live Examples</h2>
            <table style={{ width: "100%", fontSize: 10.5, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thGold, width: 55 }}>Area</th>
                  <th style={{ ...thGold, width: 65 }}>Code</th>
                  <th style={{ ...thGold, width: 130 }}>Sub Area</th>
                  <th style={thGold}>Example FL</th>
                </tr>
              </thead>
              <tbody>
                {subAreaCodeTable.map((s, i) => (
                  <tr key={s.code} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", color: "#888" }}>{s.area}</td>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 700, color: GOLD }}>{s.code}</td>
                    <td style={td}>{s.meaning}</td>
                    <td style={{ ...td, fontFamily: "monospace", fontSize: 10, color: "#555" }}>{s.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 5. Rules */}
            <h2 style={heading("Rules")}>5. Rules & Constraints</h2>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={{ ...thDark, width: 40, textAlign: "center" }}>#</th>
                  <th style={thDark}>Rule</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "FLs stop at System Level. Assets and components do NOT receive their own FL codes",
                  "Equipment and components inherit the FL of their parent system",
                  "Hierarchy must be followed exactly. No levels skipped, no shortcuts",
                  "FL codes are immutable once assigned. Never renamed, reused, or changed",
                  "Each FL is unique across the entire site. No duplicates permitted",
                  "Duty/Standby and identical grouped assets share one Parent FL",
                ].map((rule, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontWeight: 700, textAlign: "center", color: GOLD }}>{i + 1}</td>
                    <td style={td}>{rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 6. Inheritance Examples */}
            <h2 style={heading("Inheritance")}>6. Inheritance Examples (Live Data)</h2>
            <p style={{ fontSize: 11, color: "#333", margin: "0 0 6px 0" }}>
              Assets and components do NOT receive new FL codes. They inherit the FL code of their parent System.
            </p>
            <table style={{ width: "100%", fontSize: 10.5, borderCollapse: "collapse", marginBottom: 10 }}>
              <thead>
                <tr>
                  <th style={thGold}>Functional Location</th>
                  <th style={thGold}>System</th>
                  <th style={thGold}>Inheriting Assets</th>
                </tr>
              </thead>
              <tbody>
                {flExamples.map((ex, i) => (
                  <tr key={ex.fl} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                    <td style={{ ...td, fontFamily: "monospace", fontWeight: 600, color: GOLD, fontSize: 10 }}>{ex.fl}</td>
                    <td style={td}>{ex.system}</td>
                    <td style={{ ...td, fontFamily: "monospace", fontSize: 10, color: "#555" }}>{ex.children}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 7. When New FLs Can Be Created */}
            <h2 style={heading("New FLs")}>7. When New FLs Can Be Created</h2>
            <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
              <div style={{ flex: 1, border: `1px solid ${GOLD}`, borderRadius: 4, padding: "8px 12px", backgroundColor: GOLD_BG }}>
                <p style={{ fontWeight: 700, fontSize: 11, marginBottom: 4, color: GOLD }}>Allowed</p>
                <ul style={{ fontSize: 11, lineHeight: 1.5, paddingLeft: 16, margin: 0, color: "#333" }}>
                  <li>A new system boundary is introduced</li>
                  <li>A new process line or major modification is installed</li>
                  <li>Approved changes to P&IDs define a new system</li>
                </ul>
              </div>
              <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: 4, padding: "8px 12px" }}>
                <p style={{ fontWeight: 700, fontSize: 11, marginBottom: 4, color: DARK }}>Not Allowed</p>
                <ul style={{ fontSize: 11, lineHeight: 1.5, paddingLeft: 16, margin: 0, color: "#333" }}>
                  <li>Component replacement</li>
                  <li>Equipment upgrades</li>
                  <li>Temporary equipment</li>
                  <li>Maintenance workarounds</li>
                </ul>
              </div>
            </div>

            {/* 8. Relationship */}
            <h2 style={heading("Relationship")}>8. Relationship to Asset & Parts Numbering</h2>
            <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
              {[
                { label: "FL Codes", desc: "Define WHERE an asset sits in the plant" },
                { label: "Asset Numbers", desc: "Define WHAT the equipment is" },
                { label: "Parts Numbers", desc: "Define what is STOCKED in stores" },
              ].map((item) => (
                <div key={item.label} style={{ flex: 1, border: `1px solid ${GOLD}`, borderRadius: 4, padding: "6px 10px", backgroundColor: GOLD_BG, textAlign: "center" }}>
                  <p style={{ fontWeight: 700, fontSize: 12, margin: "0 0 2px 0", color: DARK }}>{item.label}</p>
                  <p style={{ fontSize: 10, color: "#555", margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "monospace", fontSize: 11, color: "#555", margin: "0 0 10px 0" }}>
              FL → Asset → Component → Part (all three systems are independent but linked)
            </p>

            {/* Footer */}
            <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 8, marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#888" }}>
              <span>TCMG-STD-FL-001 Rev 2.0</span>
              <span>Tennant Creek Mine | Confidential</span>
              <span>{today}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
