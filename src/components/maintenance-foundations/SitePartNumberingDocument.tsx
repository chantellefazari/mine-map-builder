import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { exportSectionsToPdf } from "@/utils/sectionPdfExport";

const GOLD = "#C8960C";
const GOLD_LIGHT = "#f5ecd0";
const GOLD_BG = "#fdf8ea";
const DARK = "#1a1a1a";

const categoryData = [
  { code: "01", name: "Pump Component", examples: "Slurry pumps, centrifugal pumps, dosing pumps, impellers, volutes, pump casings, lantern rings, throat bushes, pump sleeves, wet end kits", container: "C04-MP / C03-ME / LD" },
  { code: "02", name: "Motor Component", examples: "Electric motors (all sizes), motor assemblies, motor couplings, motor fans, spare motors", container: "LD / C04-MP" },
  { code: "03", name: "Gearbox", examples: "Gear reducers, speed reducers, SEW-Eurodrive, Flender, Falk, helical & planetary gearboxes, worm drives", container: "LD" },
  { code: "04", name: "Bearing", examples: "Ball bearings, roller bearings, tapered, spherical, pillow blocks, plummer blocks, bearing housings, adapters", container: "C04-MP" },
  { code: "05", name: "Valve", examples: "Ball, knife gate, pinch, butterfly, check, solenoid, gate, globe, control, diaphragm, needle valves", container: "C02-IN / C03-ME / LD" },
  { code: "06", name: "Instrumentation", examples: "Flow meters, level sensors, pressure transmitters, temperature probes, RTDs, pH probes, encoders, analysers", container: "C02-IN" },
  { code: "07", name: "Electrical", examples: "VSDs, contactors, relays, PLC cards, circuit breakers, cables, terminals, cable glands, soft starters, enclosures", container: "C01-EL" },
  { code: "08", name: "Conveyor Component", examples: "Rollers, idlers, pulleys, belts, belt scrapers, belt cleaners, skirting, v-belts, sprockets, chains", container: "C03-ME / LD" },
  { code: "09", name: "Wear Parts", examples: "Crusher liners, cone liner concave/mantle, jaw plates, cyclone liners, chute liners, wear plates, screen panels", container: "LD / C03-ME" },
  { code: "10", name: "Mechanical", examples: "Flexible couplings, shaft couplings, brackets, clamps, mounts, frames, guards, supports, handrails", container: "C03-ME" },
  { code: "10b", name: "Structural Steel", examples: "SHS, RHS, C-channel, equal angle, flat bar, steel plate, star pickets, bollards", container: "LD" },
  { code: "11", name: "Pipe Fitting", examples: "Hoses (air, water, hydraulic), BSP fittings, flanges, couplings, camlock, PE/Plasson fittings, pipe spools", container: "C02-IN / C03-ME" },
  { code: "12", name: "Seal", examples: "Mechanical seals, o-rings, gaskets, gland packing, oil seals, lip seals, diaphragm seals, seal kits", container: "C04-MP" },
  { code: "13", name: "Filter", examples: "Engine & air filters, hydraulic filters, oil filters, fuel filters, fuel water separators, breathers, strainers", container: "C05-CS / C02-IN" },
  { code: "14", name: "Lubrication System", examples: "Lube pumps, lube coolers, grease pumps, divider valves, auto-lube systems, oil coolers, Graco equipment", container: "C04-MP / C05-CS" },
  { code: "15", name: "Air & Pneumatic", examples: "Air receivers, compressors, blowers, pneumatic actuators, cylinders, regulators, FRL units", container: "C02-IN / LD" },
  { code: "16", name: "Tanks & Vessels", examples: "Process tanks, CIP tanks, reagent tanks, sumps, hoppers, heat exchangers, storage vessels", container: "LD" },
  { code: "17", name: "Safety Equipment", examples: "Safety showers, eyewash stations, machine guards, pull-wire systems, e-stops, fire extinguishers, spill kits", container: "C05-CS" },
  { code: "18", name: "Power Generation", examples: "Generators, alternators, substations, distribution boards, busbar, capacitor banks", container: "LD / C01-EL" },
  { code: "19", name: "Tooling", examples: "Hand tools, power tools, torque tools, annular cutters, site boxes, fluid extractors", container: "C05-CS" },
  { code: "19b", name: "Rigging", examples: "Slings, chain blocks, lever hoists, shackles, wire rope, turnbuckles", container: "C03-ME" },
  { code: "19c", name: "PPE", examples: "Hard hats, safety glasses, respirators, earmuffs, gloves, hi-vis vests, harnesses", container: "C05-CS" },
  { code: "20", name: "OEM Assembly", examples: "Complete pump skids, lube skids, filter press packages, complete OEM assemblies", container: "LD" },
  { code: "21", name: "Fastener", examples: "Bolts, nuts, washers, studs, anchors, rivets, zinc plated hardware, grade 8 fasteners", container: "C05-CS" },
  { code: "22", name: "Consumables", examples: "Flap discs, cutting wheels, grinding discs, lubricants, grease, adhesives, sealants, paint", container: "C05-CS / Flam. Cab." },
];

const rules = [
  { rule: "Numbers Only", desc: "No letters or alphanumeric characters in the site part number. Purely numeric for barcode compatibility and CMMS search speed." },
  { rule: "One Part = One Number", desc: "Every unique physical part receives one number. Never reused, even if a part is obsoleted." },
  { rule: "Sequential Numbering", desc: "Sequential within each category (001, 002, 003...). The system auto-assigns the next available number." },
  { rule: "Leading Zeros Required", desc: "Always use 3-digit format: 001, 002, 003. This ensures consistent sorting and barcode formatting." },
  { rule: "Immutable Once Assigned", desc: "Do not change part numbers after assignment. If a part is superseded, create a new number and link the old one." },
  { rule: "Per-Category Sequence", desc: "Each category (CC) maintains its own independent NNN sequence starting at 001." },
];

const allocationSteps = [
  "Identify the physical part and confirm what it is (pump seal, bearing, valve, etc.).",
  "Match the part to the correct Part Category Code (CC) using the category table in Section 4.",
  "Open the Site Spares Catalogue and filter by that category code.",
  "Check the highest existing NNN sequence number already allocated in that category.",
  "Assign the next sequential number (e.g. if the last bearing was 1004087, the next is 1004088).",
  "Enter the full 7-digit number into the Site Spares Catalogue and the CMMS asset record.",
  "Record the OEM part number and supplier part number in the separate designated fields - never as the site number.",
];

export const SitePartNumberingDocument: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setGenerating(true);
    try {
      await exportSectionsToPdf(contentRef.current, "TCMG-STD-SPN-001_Site_Parts_Numbering_Standard.pdf", {
        margin: 10,
        renderWidth: 780,
        fontSize: "12px",
        lineHeight: "1.4",
        scale: 1.5,
        addBorder: true,
      });
    } finally {
      setGenerating(false);
    }
  };

  const today = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });

  const headingStyle = (num: string, title: string): React.CSSProperties => ({
    fontSize: 14, fontWeight: 700, margin: "14px 0 6px 0", borderBottom: `2px solid ${GOLD}`, paddingBottom: 3, color: DARK,
  });

  const thStyle: React.CSSProperties = { padding: "4px 6px", textAlign: "left" as const, backgroundColor: DARK, color: "#fff", fontSize: 11 };
  const thGoldStyle: React.CSSProperties = { ...thStyle, backgroundColor: GOLD, color: "#fff" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Site Parts Numbering Standard - PDF Preview</h3>
        <Button onClick={handleDownload} disabled={generating} className="gap-2">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {generating ? "Generating..." : "Download PDF"}
        </Button>
      </div>

      <div
        ref={contentRef}
        className="bg-white text-black rounded-lg border shadow-sm overflow-auto max-h-[70vh]"
        style={{ fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif" }}
      >
        <div data-pdf-section style={{ padding: "28px 32px" }}>
          {/* Header with gold accent */}
          <div style={{ borderBottom: `3px solid ${GOLD}`, paddingBottom: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "inline-block", backgroundColor: GOLD, color: "#fff", padding: "3px 12px", borderRadius: 3, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                  TENNANT CREEK MINE
                </div>
                <h1 style={{ fontSize: 20, fontWeight: 700, margin: "4px 0 0 0", letterSpacing: "-0.3px" }}>
                  Site Parts Numbering Standard
                </h1>
                <p style={{ fontSize: 12, color: "#666", margin: "2px 0 0 0" }}>
                  Gold Processing Plant - Internal Part Number Convention
                </p>
              </div>
              <div style={{ textAlign: "right", fontSize: 10, color: "#666", borderLeft: `3px solid ${GOLD}`, paddingLeft: 10 }}>
                <p style={{ margin: 0, fontWeight: 700, color: DARK }}>TCMG-STD-SPN-001</p>
                <p style={{ margin: "2px 0 0 0" }}>Rev 1.0</p>
                <p style={{ margin: "2px 0 0 0" }}>{today}</p>
              </div>
            </div>
          </div>

          {/* Metadata row with gold labels */}
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
                <td style={{ padding: "3px 6px", border: "1px solid #ddd" }}>Approved</td>
                <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontWeight: 600, backgroundColor: GOLD_LIGHT }}>Effective Date</td>
                <td style={{ padding: "3px 6px", border: "1px solid #ddd" }}>{today}</td>
              </tr>
            </tbody>
          </table>

          {/* 1. Purpose */}
          <h2 style={headingStyle("1", "Purpose")}>1. Purpose</h2>
          <p style={{ fontSize: 11.5, lineHeight: 1.45, color: "#333", margin: "0 0 4px 0" }}>
            This standard defines the site-based internal part number used at Tennant Creek Mine for searching, cataloguing, and inventory control. This is not a supplier or OEM part number. OEM and supplier numbers must be stored in a separate field.
          </p>

          {/* 2. Approved Format */}
          <h2 style={headingStyle("2", "Format")}>2. Approved Format (7 Digits, Numbers Only)</h2>
          <div style={{ display: "inline-block", border: `2px solid ${GOLD}`, borderRadius: 5, padding: "6px 20px", marginBottom: 8, backgroundColor: GOLD_BG }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", letterSpacing: 4, color: DARK }}>SSCCNNN</span>
          </div>

          <table style={{ width: "100%", fontSize: 11.5, borderCollapse: "collapse", marginBottom: 8 }}>
            <thead>
              <tr>
                <th style={{ ...thGoldStyle, width: 70 }}>Code</th>
                <th style={thGoldStyle}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: "4px 6px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>SS</td><td style={{ padding: "4px 6px", border: "1px solid #ddd" }}>Site Code - always 10 for Tennant Creek</td></tr>
              <tr style={{ backgroundColor: GOLD_BG }}><td style={{ padding: "4px 6px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>CC</td><td style={{ padding: "4px 6px", border: "1px solid #ddd" }}>Part Category Code (2 digits, e.g. 01 = Pump Component)</td></tr>
              <tr><td style={{ padding: "4px 6px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>NNN</td><td style={{ padding: "4px 6px", border: "1px solid #ddd" }}>Sequential Identifier within that category (001 to 999)</td></tr>
            </tbody>
          </table>

          {/* Examples inline */}
          <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
            {[
              { n: "1001001", d: "Site 10 | Pump (CC01) | Part 001" },
              { n: "1004015", d: "Site 10 | Bearing (CC04) | Part 015" },
              { n: "1021099", d: "Site 10 | Fastener (CC21) | Part 099" },
            ].map((ex) => (
              <div key={ex.n} style={{ flex: 1, border: `1px solid ${GOLD}`, borderRadius: 4, padding: "4px 8px", backgroundColor: GOLD_BG, textAlign: "center" }}>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14, color: DARK }}>{ex.n}</span>
                <p style={{ fontSize: 9.5, color: "#666", margin: "2px 0 0 0" }}>{ex.d}</p>
              </div>
            ))}
          </div>

          {/* 3. Rules */}
          <h2 style={headingStyle("3", "Rules")}>3. Rules (Non-Negotiable)</h2>
          <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "28%" }}>Rule</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontWeight: 600 }}>{r.rule}</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd" }}>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 4. Part Category Codes */}
          <h2 style={headingStyle("4", "Categories")}>4. Part Category Codes (CC) - Live Inventory Aligned</h2>
          <table style={{ width: "100%", fontSize: 10.5, borderCollapse: "collapse", marginBottom: 4 }}>
            <thead>
              <tr>
                <th style={{ ...thGoldStyle, width: 36, fontSize: 10 }}>CC</th>
                <th style={{ ...thGoldStyle, width: 110, fontSize: 10 }}>Category</th>
                <th style={{ ...thGoldStyle, fontSize: 10 }}>What It Covers / Examples</th>
                <th style={{ ...thGoldStyle, width: 95, fontSize: 10 }}>Storage</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((cat, i) => (
                <tr key={cat.code} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                  <td style={{ padding: "2px 4px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700, fontSize: 10, color: GOLD }}>{cat.code}</td>
                  <td style={{ padding: "2px 4px", border: "1px solid #ddd", fontWeight: 600, fontSize: 10 }}>{cat.name}</td>
                  <td style={{ padding: "2px 4px", border: "1px solid #ddd", fontSize: 9.5, color: "#444" }}>{cat.examples}</td>
                  <td style={{ padding: "2px 4px", border: "1px solid #ddd", fontFamily: "monospace", fontSize: 9.5 }}>{cat.container}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 9, color: "#888", fontStyle: "italic", margin: "0 0 10px 0" }}>
            * CC 10b, 19b, 19c are sub-categories sharing the parent CC code for part numbering sequences.
          </p>

          {/* 5. Allocation Process */}
          <h2 style={headingStyle("5", "Allocation")}>5. Part Number Allocation Process</h2>
          <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 10 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 40, textAlign: "center" as const }}>Step</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allocationSteps.map((step, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 1 ? GOLD_BG : "transparent" }}>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontWeight: 700, textAlign: "center", color: GOLD }}>{i + 1}</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd" }}>{step}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 6. Notes */}
          <h2 style={headingStyle("6", "Notes")}>6. Notes</h2>
          <ul style={{ fontSize: 11, lineHeight: 1.5, paddingLeft: 18, margin: "0 0 10px 0", color: "#333" }}>
            <li>OEM and supplier numbers must be stored in a separate field, never as the site part number.</li>
            <li>This site part number is the primary identifier for stores, cataloguing, barcode scanning, and CMMS.</li>
            <li>All 25 categories are live and aligned with the site spares inventory system.</li>
            <li>Auto-numbering is available in the Site Spares Catalogue module.</li>
          </ul>

          {/* 7. Notice */}
          <div style={{ border: `2px solid ${GOLD}`, backgroundColor: GOLD_BG, borderRadius: 4, padding: "8px 12px", marginBottom: 12 }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, margin: "0 0 3px 0", color: GOLD }}>Important Notice</p>
            <p style={{ fontSize: 11, color: "#444", margin: 0 }}>
              This document does not alter any existing part numbers. It defines the approved numbering standard for future part creation at Tennant Creek Mine.
            </p>
          </div>

          {/* Footer */}
          <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 8, marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#888" }}>
            <span>TCMG-STD-SPN-001 Rev 1.0</span>
            <span>Tennant Creek Mine - Confidential</span>
            <span>{today}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
