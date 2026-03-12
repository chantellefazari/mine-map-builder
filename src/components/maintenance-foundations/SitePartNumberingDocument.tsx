import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { exportSectionsToPdf } from "@/utils/sectionPdfExport";

const categoryData = [
  { code: "01", name: "Pump Component", examples: "Slurry pumps, centrifugal pumps, dosing pumps, impellers, volutes, pump casings, lantern rings, throat bushes, pump sleeves, wet end kits", container: "C04-MP / C03-ME / LD" },
  { code: "02", name: "Motor Component", examples: "Electric motors (all sizes), motor assemblies, motor couplings, motor fans, spare motors", container: "LD / C04-MP" },
  { code: "03", name: "Gearbox", examples: "Gear reducers, speed reducers, SEW-Eurodrive, Flender, Falk, helical & planetary gearboxes, worm drives", container: "LD" },
  { code: "04", name: "Bearing", examples: "Ball bearings, roller bearings, tapered, spherical, pillow blocks, plummer blocks, bearing housings, adapters", container: "C04-MP" },
  { code: "05", name: "Valve", examples: "Ball, knife gate, pinch, butterfly, check, solenoid, gate, globe, control, diaphragm, needle valves", container: "C02-IN / C03-ME / LD" },
  { code: "06", name: "Instrumentation", examples: "Flow meters, level sensors, pressure transmitters, temperature probes, RTDs, pH probes, encoders, analysers, conductivity sensors", container: "C02-IN" },
  { code: "07", name: "Electrical", examples: "VSDs, contactors, relays, PLC cards, circuit breakers, cables, terminals, cable glands, soft starters, enclosures, conduit, heat shrink, cable ties", container: "C01-EL" },
  { code: "08", name: "Conveyor Component", examples: "Rollers, idlers, pulleys, belts, belt scrapers, belt cleaners, skirting, v-belts, sprockets, chains, fenner pulleys, misalignment switches", container: "C03-ME / LD" },
  { code: "09", name: "Wear Parts", examples: "Crusher liners, cone liner concave/mantle, jaw plates, cyclone liners, chute liners, wear plates, screen panels, rubber liner, mill liners", container: "LD / C03-ME" },
  { code: "10", name: "Mechanical", examples: "Flexible couplings, shaft couplings, brackets, clamps, mounts, frames, guards, supports, handrails, flexseal couplings, durasleeve carriers", container: "C03-ME" },
  { code: "10b", name: "Structural Steel", examples: "SHS, RHS, square & rectangular hollow sections, C-channel, equal angle, flat bar, steel plate, star pickets, bollards", container: "LD" },
  { code: "11", name: "Pipe Fitting", examples: "Hoses (air, water, hydraulic, drag), nylon tubing, BSP fittings (nipples, elbows, reducers, tees, bushes), flanges, couplings, camlock, hosetails, PE/Plasson fittings, saddle clamps, pipe spools, repair clamps", container: "C02-IN / C03-ME" },
  { code: "12", name: "Seal", examples: "Mechanical seals, o-rings, gaskets, gland packing, oil seals, lip seals, diaphragm seals, PTFE sheet, seal kits, gasket sets", container: "C04-MP" },
  { code: "13", name: "Filter", examples: "CAT/Donaldson/Fleetguard engine & air filters, hydraulic filters, oil filters, fuel filters, fuel water separators, breathers, filter elements, strainers", container: "C05-CS / C02-IN" },
  { code: "14", name: "Lubrication System", examples: "Lube pumps, lube coolers, lube injectors, grease pumps, divider valves, auto-lube systems, oil coolers, Graco equipment", container: "C04-MP / C05-CS" },
  { code: "15", name: "Air & Pneumatic", examples: "Air receivers, compressors, side channel blowers, pneumatic actuators, pneumatic cylinders, air regulators, FRL units, pneumatic fittings, Norgren components", container: "C02-IN / LD" },
  { code: "16", name: "Tanks & Vessels", examples: "Process tanks, CIP tanks, reagent tanks, sumps, hoppers, heat exchangers (Dynacool), storage vessels", container: "LD" },
  { code: "17", name: "Safety Equipment", examples: "Safety showers, eyewash stations, machine guards, pull-wire systems, e-stops, fire extinguishers, fire blankets, spill kits, safety signage", container: "C05-CS" },
  { code: "18", name: "Power Generation", examples: "Generators, alternators, substations, distribution boards, busbar, capacitor banks, power factor correction equipment", container: "LD / C01-EL" },
  { code: "19", name: "Tooling", examples: "Hand tools (wrenches, spanners, drill bits), power tools (Milwaukee, Makita, DeWalt), torque tools, annular cutters, site boxes, fluid extractors, gravity tables, Sydney Tools items", container: "C05-CS" },
  { code: "19b", name: "Rigging", examples: "Slings (round, flat, web), chain blocks, lever hoists, shackles (dee, bow), wire rope, turnbuckles, hook and eye sets, jack chain, ear-lokt buckles, garrick equipment", container: "C03-ME" },
  { code: "19c", name: "PPE", examples: "Hard hats, safety glasses, face shields, respirators, earmuffs, earplugs, nitrile gloves, riggers gloves, hi-vis vests, safety harnesses, fall arrest lanyards", container: "C05-CS" },
  { code: "20", name: "OEM Assembly", examples: "Complete pump skids, lube skids, filter press packages, complete OEM assemblies, skid-mounted packages", container: "LD" },
  { code: "21", name: "Fastener", examples: "Bolts (hex, cap, set), nuts (hex, nyloc, lock), washers (flat, spring), studs, anchors, rivets, zinc plated hardware, grade 8 fasteners", container: "C05-CS" },
  { code: "22", name: "Consumables", examples: "Flap discs, cutting wheels, grinding discs, abrasives, lubricants, grease, degreaser, adhesives, sealants, paint, batteries, anti-corrosion products", container: "C05-CS / Flammable Cabinet" },
];

const rules = [
  { rule: "Numbers Only", desc: "No letters or alphanumeric characters in the site part number." },
  { rule: "One Part = One Number", desc: "One unique part number per item. Never reused." },
  { rule: "Sequential Numbering", desc: "Sequential within each category (001, 002, 003...)." },
  { rule: "Leading Zeros Required", desc: "Always use 3-digit format: 001, 002, 003." },
  { rule: "Immutable Once Assigned", desc: "Do not change part numbers after assignment." },
  { rule: "Per-Category Sequence", desc: "Each category maintains its own independent NNN sequence." },
];

const allocationSteps = [
  "Confirm the correct Part Category Code (CC) by matching the physical part to the category table.",
  "Identify the highest existing NNN in that category from the Site Parts Catalogue.",
  "Assign the next available sequential number.",
  "Record the number in the Site Parts Catalogue and update the CMMS.",
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
        fontSize: "13px",
        lineHeight: "1.45",
        scale: 1.5,
        addBorder: true,
      });
    } finally {
      setGenerating(false);
    }
  };

  const today = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Site Parts Numbering Standard - PDF Preview</h3>
        <Button onClick={handleDownload} disabled={generating} className="gap-2">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {generating ? "Generating..." : "Download PDF"}
        </Button>
      </div>

      {/* Document content */}
      <div
        ref={contentRef}
        className="bg-white text-black rounded-lg border shadow-sm overflow-auto max-h-[70vh]"
        style={{ fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif" }}
      >
        <div data-pdf-section style={{ padding: "32px 36px" }}>
          {/* Header */}
          <div style={{ borderBottom: "3px solid #1a1a1a", paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                  Site Parts Numbering Standard
                </h1>
                <p style={{ fontSize: 13, color: "#555", margin: "4px 0 0 0" }}>
                  Tennant Creek Mine Gold Processing Plant
                </p>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "#666" }}>
                <p style={{ margin: 0, fontWeight: 600 }}>TCMG-STD-SPN-001</p>
                <p style={{ margin: "2px 0 0 0" }}>Rev 1.0 | {today}</p>
              </div>
            </div>
          </div>

          {/* Metadata row */}
          <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 18 }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: 600, backgroundColor: "#f5f5f5", width: "15%" }}>Prepared By</td>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", width: "35%" }}>TCMG Maintenance Team</td>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: 600, backgroundColor: "#f5f5f5", width: "15%" }}>Approved By</td>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", width: "35%" }}>Maintenance Superintendent</td>
              </tr>
              <tr>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: 600, backgroundColor: "#f5f5f5" }}>Status</td>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd" }}>Approved</td>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: 600, backgroundColor: "#f5f5f5" }}>Effective Date</td>
                <td style={{ padding: "4px 8px", border: "1px solid #ddd" }}>{today}</td>
              </tr>
            </tbody>
          </table>

          {/* 1. Purpose */}
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "18px 0 8px 0", borderBottom: "1px solid #ccc", paddingBottom: 4 }}>
            1. Purpose
          </h2>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "#333", margin: "0 0 6px 0" }}>
            This standard defines the site-based internal part number used at Tennant Creek Mine for searching, cataloguing, and inventory control. This is not a supplier or OEM part number. OEM and supplier numbers must be stored in a separate field.
          </p>

          {/* 2. Approved Format */}
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "18px 0 8px 0", borderBottom: "1px solid #ccc", paddingBottom: 4 }}>
            2. Approved Format (7 Digits, Numbers Only)
          </h2>
          <div style={{ display: "inline-block", border: "2px solid #1a1a1a", borderRadius: 6, padding: "8px 24px", marginBottom: 12, backgroundColor: "#fafafa" }}>
            <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace", letterSpacing: 4 }}>SSCCNNN</span>
          </div>

          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginBottom: 12 }}>
            <thead>
              <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
                <th style={{ padding: "6px 8px", textAlign: "left", width: 80 }}>Code</th>
                <th style={{ padding: "6px 8px", textAlign: "left" }}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: "5px 8px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>SS</td><td style={{ padding: "5px 8px", border: "1px solid #ddd" }}>Site Code - always 10 for Tennant Creek</td></tr>
              <tr style={{ backgroundColor: "#fafafa" }}><td style={{ padding: "5px 8px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>CC</td><td style={{ padding: "5px 8px", border: "1px solid #ddd" }}>Part Category Code (2 digits, e.g. 01 = Pump Component)</td></tr>
              <tr><td style={{ padding: "5px 8px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>NNN</td><td style={{ padding: "5px 8px", border: "1px solid #ddd" }}>Sequential Identifier within that category (001 to 999)</td></tr>
            </tbody>
          </table>

          {/* Examples */}
          <h3 style={{ fontSize: 13, fontWeight: 600, margin: "14px 0 6px 0" }}>Examples</h3>
          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginBottom: 14 }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: "5px 8px", textAlign: "left", border: "1px solid #ddd", width: 120 }}>Part Number</th>
                <th style={{ padding: "5px 8px", textAlign: "left", border: "1px solid #ddd" }}>Breakdown</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: "4px 8px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>1001001</td><td style={{ padding: "4px 8px", border: "1px solid #ddd" }}>Site 10 | Pump Component (CC 01) | Part 001</td></tr>
              <tr style={{ backgroundColor: "#fafafa" }}><td style={{ padding: "4px 8px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>1004015</td><td style={{ padding: "4px 8px", border: "1px solid #ddd" }}>Site 10 | Bearing (CC 04) | Part 015</td></tr>
              <tr><td style={{ padding: "4px 8px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>1021099</td><td style={{ padding: "4px 8px", border: "1px solid #ddd" }}>Site 10 | Fastener (CC 21) | Part 099</td></tr>
            </tbody>
          </table>

          {/* 3. Rules */}
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "18px 0 8px 0", borderBottom: "1px solid #ccc", paddingBottom: 4 }}>
            3. Rules (Non-Negotiable)
          </h2>
          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginBottom: 14 }}>
            <thead>
              <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
                <th style={{ padding: "5px 8px", textAlign: "left", width: "30%" }}>Rule</th>
                <th style={{ padding: "5px 8px", textAlign: "left" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 1 ? "#fafafa" : "transparent" }}>
                  <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: 600 }}>{r.rule}</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #ddd" }}>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 4. Part Category Codes */}
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "18px 0 8px 0", borderBottom: "1px solid #ccc", paddingBottom: 4 }}>
            4. Part Category Codes (CC) - Live Inventory Aligned
          </h2>
          <p style={{ fontSize: 11.5, color: "#555", margin: "0 0 8px 0" }}>
            Each part is assigned a 2-digit category code based on what it physically is. The Default Storage column shows the standard container zone.
          </p>

          <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 8 }}>
            <thead>
              <tr style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
                <th style={{ padding: "4px 6px", textAlign: "left", width: 40 }}>CC</th>
                <th style={{ padding: "4px 6px", textAlign: "left", width: 130 }}>Category</th>
                <th style={{ padding: "4px 6px", textAlign: "left" }}>What It Covers / Examples</th>
                <th style={{ padding: "4px 6px", textAlign: "left", width: 110 }}>Default Storage</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((cat, i) => (
                <tr key={cat.code} style={{ backgroundColor: i % 2 === 1 ? "#fafafa" : "transparent" }}>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontFamily: "monospace", fontWeight: 700 }}>{cat.code}</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontWeight: 600, fontSize: 11 }}>{cat.name}</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontSize: 10.5, color: "#444" }}>{cat.examples}</td>
                  <td style={{ padding: "3px 6px", border: "1px solid #ddd", fontFamily: "monospace", fontSize: 10.5 }}>{cat.container}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 10, color: "#888", fontStyle: "italic", margin: "0 0 14px 0" }}>
            * CC 10b (Structural Steel), CC 19b (Rigging), and CC 19c (PPE) are sub-categories sharing the parent CC code for part numbering sequences.
          </p>

          {/* 5. Allocation Process */}
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "18px 0 8px 0", borderBottom: "1px solid #ccc", paddingBottom: 4 }}>
            5. Part Number Allocation Process
          </h2>
          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginBottom: 14 }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: "5px 8px", textAlign: "left", width: 50 }}>Step</th>
                <th style={{ padding: "5px 8px", textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allocationSteps.map((step, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 1 ? "#fafafa" : "transparent" }}>
                  <td style={{ padding: "4px 8px", border: "1px solid #ddd", fontWeight: 700, textAlign: "center" }}>{i + 1}</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #ddd" }}>{step}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 6. Notes */}
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "18px 0 8px 0", borderBottom: "1px solid #ccc", paddingBottom: 4 }}>
            6. Notes
          </h2>
          <ul style={{ fontSize: 12, lineHeight: 1.6, paddingLeft: 20, margin: "0 0 14px 0", color: "#333" }}>
            <li>OEM and supplier numbers must be stored in a separate field, never as the site part number.</li>
            <li>This site part number is the primary identifier used for stores, cataloguing, barcode scanning, and CMMS.</li>
            <li>All 25 categories are live and aligned with the site spares inventory system.</li>
            <li>Auto-numbering is available in the Site Spares Catalogue module.</li>
          </ul>

          {/* 7. Notice */}
          <div style={{ border: "1px solid #c0a030", backgroundColor: "#fffbe6", borderRadius: 4, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, margin: "0 0 4px 0", color: "#7a6200" }}>Important Notice</p>
            <p style={{ fontSize: 11.5, color: "#555", margin: 0 }}>
              This document does not alter any existing part numbers. It defines the approved numbering standard for future part creation at Tennant Creek Mine.
            </p>
          </div>

          {/* Footer */}
          <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: 10, marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 10, color: "#888" }}>
            <span>TCMG-STD-SPN-001 Rev 1.0</span>
            <span>Tennant Creek Mine - Confidential</span>
            <span>{today}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
