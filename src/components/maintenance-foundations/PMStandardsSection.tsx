import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { exportSectionsToPdf } from "@/utils/sectionPdfExport";
import { PDF_EXPORT_OPTS } from "@/utils/pdfExportStandard";

const GOLD = "#C8960C";
const GOLD_LIGHT = "#f5ecd0";
const GOLD_BG = "#fdf8ea";
const DARK = "#1a1a1a";

const designPrinciples = [
  { rule: "Equipment Type First", desc: "PMs are designed for equipment categories (e.g. pumps, conveyors, generators), not individual assets. This ensures consistency and reduces duplication across the fleet." },
  { rule: "Value Adding Tasks Only", desc: "Every task must prevent or detect a specific failure mode. Tasks with no measurable outcome are removed during review." },
  { rule: "Inspection Before Intrusive", desc: "Non intrusive inspections (visual, thermal, vibration) occur more frequently than invasive work (disassembly, replacement)." },
  { rule: "Risk Based Frequency", desc: "Frequencies are determined by criticality rating, failure history, operating context, and OEM recommendations; never by habit or convenience." },
  { rule: "Explicit Isolation", desc: "Every PM must clearly state isolation and LOTO requirements. No PM is approved without documented energy isolation steps." },
  { rule: "Standardised Template", desc: "All PMs follow the TCMG standard template structure: Banner, Metadata, Safety, Inspection Table, Sign Off. No deviations permitted." },
  { rule: "Single Source of Truth", desc: "PM templates are maintained in the master PM register. All printed copies must match the current approved revision." },
];

const frequencyStandards = [
  { discipline: "Mechanical", frequencies: ["Daily", "1 Week"], scope: "Visual inspections, greasing, belt tension, guard checks, leak detection, vibration monitoring", examples: "Mill Daily, Pump Weekly, Conveyor Weekly, Thickener Weekly" },
  { discipline: "Electrical", frequencies: ["1 Week", "2 Week", "4 Week", "6 Week", "12 Week", "26 Week", "52 Week"], scope: "Thermography, MCC inspections, cable checks, RCD testing, motor inspections, switchboard audits, substation maintenance", examples: "Field MCC 1W, Motor Inspection 6W, RCD Push Button 12W, RCD Injection 26W, Full Test Sheet 52W" },
  { discipline: "Mobile Equipment", frequencies: ["Daily", "1 Week"], scope: "Pre start checks, fluid levels, tyre condition, safety systems, operating hours, service tracking", examples: "Dozer Daily, Excavator Daily, Loader Weekly, Forklift Weekly, Water Truck Weekly" },
  { discipline: "Facilities & Infrastructure", frequencies: ["4 Week", "12 Week", "26 Week", "52 Week"], scope: "Generator testing, safety shower inspections, potable water checks, emergency lighting, AC inspections", examples: "Generator Weekly, Safety Shower 4W, Emergency Light Test 12W, Generator Yearly Test 52W" },
];

const mandatoryFields = [
  { field: "PM Title", desc: "Unique descriptive name matching the equipment category and frequency" },
  { field: "Equipment Category", desc: "Equipment type the PM applies to (e.g. Centrifugal Pump, Belt Conveyor)" },
  { field: "Discipline", desc: "Mechanical, Electrical, or Mobile Equipment" },
  { field: "Frequency", desc: "Standardised interval from the approved frequency set" },
  { field: "Duty Type", desc: "Online (running equipment) or Offline (shutdown required)" },
  { field: "Estimated Duration", desc: "Expected time to complete, used for scheduling and resource planning" },
  { field: "Skill Level", desc: "Minimum competency required (Trades Assistant, Tradesperson, Specialist)" },
  { field: "Safety Warnings", desc: "Specific hazards identified for the task (pinch points, stored energy, chemical)" },
  { field: "Isolation / LOTO", desc: "Energy isolation requirements with lock out/tag out procedures" },
  { field: "Required PPE", desc: "Task specific PPE beyond minimum site requirements" },
  { field: "Required Tools", desc: "Specific tools and consumables needed to complete the PM" },
  { field: "Inspection Checklist", desc: "Step by step tasks with Serviceable/Defective tick off and comments column" },
  { field: "Sign Off Block", desc: "Performed By, Reviewed By, Approved By with date fields" },
  { field: "Revision Control", desc: "Document number, revision, and effective date for version tracking" },
];

const templateStructure = [
  { component: "PM Banner Header", purpose: "Gold themed header with PM title, document number, revision, and site branding" },
  { component: "Metadata Grid", purpose: "Equipment type, frequency, discipline, duration, skill level, duty type, asset linkage" },
  { component: "Safety Precautions", purpose: "Mandatory safety warnings, isolation requirements, PPE, required tools, and hazard identification" },
  { component: "Dynamic Inspection Table", purpose: "Task by task checklist with Serviceable/Defective checkboxes and Comments column, grouped by equipment section" },
  { component: "Sign Off Block", purpose: "Performed By, Reviewed By, Approved By with signature lines and date fields" },
];

const statusWorkflow = [
  { status: "Draft", desc: "Initial creation. Tasks and metadata being defined. Not for field use.", color: "#6b7280" },
  { status: "Reviewed", desc: "Technical review completed by discipline lead. Tasks validated against failure modes.", color: "#2563eb" },
  { status: "Approved", desc: "Approved by Maintenance Superintendent. Ready for scheduling and field deployment.", color: "#16a34a" },
  { status: "Ready for Issue", desc: "All metadata, asset links, and frequencies confirmed. Cleared for field issue and scheduling.", color: GOLD },
];

const constraints = [
  "Do NOT copy paste generic OEM manuals. All tasks must be site specific and relevant to actual operating conditions.",
  "Do NOT create schedules in PM design. This section defines what and how; scheduling is a separate function.",
  "Do NOT design PMs for individual assets. Templates target equipment categories and are linked to assets separately.",
  "Do NOT skip safety or isolation steps. Every PM must document energy isolation even if the task is online.",
  "Do NOT invent frequencies. Use the approved frequency set based on risk analysis and failure history.",
  "Do NOT duplicate tasks across PMs. Each failure mode should be addressed by one PM only.",
  "Do NOT leave fields blank. Every mandatory field must be populated before a PM can progress past Draft status.",
];

const coverageSummary = [
  { discipline: "Mechanical", count: 28, examples: "Mill Daily/Weekly, Pump Weekly, Conveyor Weekly, Thickener Weekly, Top/Bottom of Tanks" },
  { discipline: "Electrical", count: 42, examples: "Field MCC Inspections, Motor Inspections, RCD Testing, Switchboard Audits, Cable Testing, Substation Inspections" },
  { discipline: "Mobile Equipment", count: 18, examples: "Dozer/Excavator/Loader Daily, Dozer/Excavator/Loader/Forklift/Moxy Weekly, Service Truck, Water Truck, EWP, Telehandler" },
];

const inspectionDataShapes = [
  { shape: "Sectioned Tasks", desc: "Tasks grouped by equipment section with section headers (e.g. Mill Daily: Trunnion, Pinion, Discharge)", jsonKey: "sections[]", usage: "Most mechanical PMs" },
  { shape: "MCC Sections", desc: "Standard tasks repeated across multiple MCC panels (e.g. Field MCC Inspections)", jsonKey: "mccSections[]", usage: "Electrical field inspections" },
  { shape: "Flat Task List", desc: "Simple sequential checklist without grouping (e.g. Safety Shower Inspection)", jsonKey: "string[] or {task}[]", usage: "Simple inspections" },
  { shape: "Temperature / Pressure", desc: "Tasks with inline measurement fields for recording readings", jsonKey: "hasTemp, hasPressure", usage: "Motor inspections, bearing checks" },
];


const baselinePurposes = [
  "Document the current state of all preventive maintenance activities on site",
  "Identify gaps in coverage across equipment types and disciplines",
  "Highlight duplication where multiple PMs address the same failure mode",
  "Support PM optimisation by comparing current vs. ideal state",
  "Provide the foundation for maintenance system setup, ensuring no PM is lost in transition",
  "Enable before/after comparison to measure improvement over time",
  "Track PM maturity as the site progresses through implementation phases",
];

export const PMStandardsSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setGenerating(true);
    try {
      await exportSectionsToPdf(contentRef.current, "TCMG-STD-PM-001_PM_Template_Frequency_Standards.pdf", PDF_EXPORT_OPTS);
    } finally {
      setGenerating(false);
    }
  };

  const today = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });

  const thStyle: React.CSSProperties = { padding: "6px 10px", textAlign: "left", backgroundColor: DARK, color: "#fff", fontSize: 13 };
  const thGoldStyle: React.CSSProperties = { ...thStyle, backgroundColor: GOLD };
  const tdStyle: React.CSSProperties = { padding: "6px 10px", fontSize: 13, borderBottom: `1px solid #e5e5e5` };
  const tdAlt: React.CSSProperties = { ...tdStyle, backgroundColor: GOLD_BG };
  const sectionHeading = (num: string, title: string) => (
    <h2 style={{ fontSize: 16, fontWeight: 700, margin: "22px 0 8px 0", borderBottom: `2px solid ${GOLD}`, paddingBottom: 4, color: DARK }}>
      {num}. {title}
    </h2>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">PM Template & Frequency Standards</h3>
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
        {/* Single continuous section for PDF export */}
        <div data-pdf-section style={{ padding: "28px 36px" }}>
          {/* Document Header */}
          <div style={{ borderBottom: `3px solid ${GOLD}`, paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "inline-block", backgroundColor: GOLD, color: "#fff", padding: "4px 14px", borderRadius: 4, fontWeight: 700, fontSize: 13, marginBottom: 8, letterSpacing: 0.5 }}>
                  TENNANT CREEK MINE
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: DARK, margin: "6px 0 2px 0" }}>
                  PM Template & Frequency Standards
                </h1>
                <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
                  Preventive Maintenance Design Standards
                </p>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "#666" }}>
                <div><strong>Doc:</strong> TCMG-STD-PM-001</div>
                <div><strong>Rev:</strong> 1.0</div>
                <div><strong>Date:</strong> {today}</div>
                <div><strong>Status:</strong> Approved</div>
              </div>
            </div>
          </div>


          {/* 1. Purpose & Scope */}
          {sectionHeading("1", "Purpose & Scope")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            This document defines the approved preventive maintenance (PM) design standards for Tennant Creek Mine. It governs how PMs are designed, structured, reviewed, and approved before deployment to the field. This standard applies to all disciplines: Mechanical, Electrical, and Mobile Equipment.
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            The objective is to ensure every PM template is consistent, value adding, safety compliant, and traceable. PMs that do not conform to this standard will not be approved for field use.
          </p>
          <div style={{ backgroundColor: GOLD_BG, border: `1px solid ${GOLD_LIGHT}`, borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 4 }}>Key Distinction:</p>
            <p style={{ fontSize: 13, color: "#333" }}>
              This standard defines <strong>what</strong> a PM contains and <strong>how</strong> it is designed. It does not define scheduling, resource allocation, or work execution procedures, which are covered by separate operational standards.
            </p>
          </div>

          {/* 2. PM Design Principles */}
          {sectionHeading("2", "PM Design Principles")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            All PM templates at Tennant Creek Mine must adhere to the following non negotiable design principles:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ ...thGoldStyle, width: "25%" }}>Principle</th>
                <th style={thGoldStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {designPrinciples.map((p, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}><strong>{p.rule}</strong></td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>


          {/* 3. Standard PM Template Structure */}
          {sectionHeading("3", "Standard PM Template Structure")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            Every PM template follows a standardised five component structure. This ensures consistency across all 88+ templates. The component sequence is non negotiable and must not be reordered.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "5%" }}>#</th>
                <th style={{ ...thStyle, width: "28%" }}>Component</th>
                <th style={thStyle}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {templateStructure.map((t, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}><strong>{i + 1}</strong></td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}><strong>{t.component}</strong></td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{t.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 4. Mandatory PM Fields */}
          {sectionHeading("4", "Mandatory PM Fields")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            All PMs must include the following fields as a minimum. No PM may progress past Draft status without all fields populated. These fields ensure traceability and safety compliance.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ ...thGoldStyle, width: "5%" }}>#</th>
                <th style={{ ...thGoldStyle, width: "22%" }}>Field</th>
                <th style={thGoldStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {mandatoryFields.map((f, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{i + 1}</td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}><strong>{f.field}</strong></td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>


          {/* 5. Frequency Standards */}
          {sectionHeading("5", "Frequency Standards by Discipline")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            PM frequencies are standardised across the site. Only approved frequency intervals may be used. Custom or ad hoc frequencies are not permitted without written approval from the Maintenance Superintendent.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "15%" }}>Discipline</th>
                <th style={{ ...thStyle, width: "25%" }}>Approved Frequencies</th>
                <th style={{ ...thStyle, width: "30%" }}>Scope of Coverage</th>
                <th style={thStyle}>Example PMs</th>
              </tr>
            </thead>
            <tbody>
              {frequencyStandards.map((f, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}><strong>{f.discipline}</strong></td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{f.frequencies.join(", ")}</td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{f.scope}</td>
                  <td style={i % 2 === 0 ? { ...tdAlt, fontSize: 12 } : { ...tdStyle, fontSize: 12 }}>{f.examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ backgroundColor: GOLD_BG, border: `1px solid ${GOLD_LIGHT}`, borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "#333" }}>
              <strong>Important:</strong> Frequencies listed above are design standards only, not schedules. Scheduling (start dates, crew assignments, calendar alignment) is managed separately during the scheduling phase.
            </p>
          </div>

          {/* 6. PM Status Workflow */}
          {sectionHeading("6", "PM Approval Workflow")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            Every PM follows a controlled lifecycle from creation to CMMS import. PMs may only be deployed to the field or imported into the CMMS once they reach "Approved" status.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ ...thGoldStyle, width: "18%" }}>Status</th>
                <th style={thGoldStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {statusWorkflow.map((s, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 4, backgroundColor: s.color, color: "#fff", fontWeight: 600, fontSize: 12 }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{s.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ backgroundColor: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "#1e40af" }}>
              <strong>Rule:</strong> Only PMs with "Approved" or "Ready for Issue" status may be issued to field crews. Draft and Reviewed PMs must not be used for operational maintenance.
            </p>
          </div>


          {/* 7. Inspection Task Data Architecture */}
          {sectionHeading("7", "Inspection Task Data Architecture")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            PM inspection tasks are stored as structured JSON data to support flexible rendering across different equipment types. The system supports four data shapes to accommodate varying inspection complexity:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "20%" }}>Data Shape</th>
                <th style={{ ...thStyle, width: "35%" }}>Description</th>
                <th style={{ ...thStyle, width: "20%" }}>JSON Structure</th>
                <th style={thStyle}>Typical Usage</th>
              </tr>
            </thead>
            <tbody>
              {inspectionDataShapes.map((d, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}><strong>{d.shape}</strong></td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{d.desc}</td>
                  <td style={i % 2 === 0 ? { ...tdAlt, fontFamily: "monospace", fontSize: 11 } : { ...tdStyle, fontFamily: "monospace", fontSize: 11 }}>{d.jsonKey}</td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{d.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 8. Current PM Coverage Summary */}
          {sectionHeading("8", "Current PM Coverage Summary")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            The following table summarises the current PM template coverage by discipline. This represents the approved baseline of 88 PM templates across the site.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ ...thGoldStyle, width: "18%" }}>Discipline</th>
                <th style={{ ...thGoldStyle, width: "12%", textAlign: "center" }}>Template Count</th>
                <th style={thGoldStyle}>Example Templates</th>
              </tr>
            </thead>
            <tbody>
              {coverageSummary.map((c, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}><strong>{c.discipline}</strong></td>
                  <td style={{ ...(i % 2 === 0 ? tdAlt : tdStyle), textAlign: "center", fontWeight: 700, fontSize: 16 }}>{c.count}</td>
                  <td style={i % 2 === 0 ? { ...tdAlt, fontSize: 12 } : { ...tdStyle, fontSize: 12 }}>{c.examples}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: GOLD_LIGHT }}>
                <td style={{ ...tdStyle, fontWeight: 700 }}>Total</td>
                <td style={{ ...tdStyle, textAlign: "center", fontWeight: 700, fontSize: 16 }}>{coverageSummary.reduce((a, c) => a + c.count, 0)}</td>
                <td style={tdStyle}></td>
              </tr>
            </tbody>
          </table>


          {/* 9. Constraints (Non-Negotiable) */}
          {sectionHeading("9", "Constraints (Non-Negotiable)")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            The following constraints are mandatory and must not be overridden. Violation of any constraint will result in the PM being rejected during review.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "5%", backgroundColor: "#dc2626" }}>#</th>
                <th style={{ ...thStyle, backgroundColor: "#dc2626" }}>Constraint</th>
              </tr>
            </thead>
            <tbody>
              {constraints.map((c, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, textAlign: "center", fontWeight: 700, color: "#dc2626" }}>{i + 1}</td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 10. Baseline PM List */}
          {sectionHeading("10", "Baseline PM List (Reference)")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            The baseline PM list captures all currently defined preventive maintenance activities. This serves as the foundation for future optimisation, scheduling, and CMMS configuration. The baseline is maintained in the digital PM register and is not a static document.
          </p>
          <div style={{ backgroundColor: GOLD_BG, border: `1px solid ${GOLD_LIGHT}`, borderRadius: 6, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6 }}>Purpose of the Baseline:</p>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {baselinePurposes.map((p, i) => (
                <li key={i} style={{ fontSize: 13, color: "#333", marginBottom: 3, lineHeight: 1.5 }}>{p}</li>
              ))}
            </ul>
          </div>
          <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "#92400e" }}>
              <strong>Note:</strong> Baseline PMs are not scheduled, not asset-linked, and not approved by default. They represent the starting point for the PM optimisation process.
            </p>
          </div>

          {/* 11. Governance & Review */}
          {sectionHeading("11", "Governance & Review Schedule")}
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
            PM templates are living documents and must be reviewed on a regular cycle to ensure they remain relevant, effective, and aligned with changing site conditions.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr>
                <th style={{ ...thGoldStyle, width: "30%" }}>Review Activity</th>
                <th style={{ ...thGoldStyle, width: "15%" }}>Frequency</th>
                <th style={thGoldStyle}>Responsibility</th>
              </tr>
            </thead>
            <tbody>
              {[
                { activity: "Task relevance review", freq: "6-Monthly", resp: "Discipline Lead (Mechanical/Electrical)" },
                { activity: "Frequency validation", freq: "Annually", resp: "Reliability Engineer or Maintenance Superintendent" },
                { activity: "Safety & isolation audit", freq: "Annually", resp: "Site Safety Advisor and Maintenance Superintendent" },
                { activity: "CMMS alignment check", freq: "Post-migration", resp: "CMMS Administrator and Planning Team" },
                { activity: "Full PM optimisation review", freq: "Annually", resp: "Maintenance Superintendent with discipline leads" },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}><strong>{r.activity}</strong></td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{r.freq}</td>
                  <td style={i % 2 === 0 ? tdAlt : tdStyle}>{r.resp}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: 10, marginTop: 20, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#999" }}>
            <span>TCMG-STD-PM-001 | Rev 1.0</span>
            <span>Tennant Creek Mine | PM Template & Frequency Standards</span>
            <span>{today}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
