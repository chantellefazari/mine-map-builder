import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Loader2 } from "lucide-react";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  History,
  FileText,
  Database,
  Layers,
  MapPin,
  Package,
  Wrench,
  Tag,
  BookOpen,
} from "lucide-react";

/* Deliverable 8: Governance & Data Standards Pack                            */
/* TCMG-STD-GOV-001 Rev 2.0                                                  */

const GOLD = "#C8960C";
const GOLD_BG = "#fdf8ea";
const DARK = "#1a1a1a";

interface LockedStandard {
  area: string;
  standard: string;
  reference: string;
  owner: string;
  status: "Locked" | "Controlled";
}

const LOCKED_STANDARDS: LockedStandard[] = [
  { area: "Asset Hierarchy", standard: "7 level hierarchy structure (Site, Facility, Main Area, Sub Area, Parent Asset, Equipment, Component)", reference: "TCMG-STD-AH-001", owner: "Engineering", status: "Locked" },
  { area: "Area Codes", standard: "6 approved Main Area codes: SITE, UTL, COM, REC, TAIL, SUP", reference: "TCMG-STD-AH-001", owner: "Engineering", status: "Locked" },
  { area: "Functional Locations", standard: "FL code format: TCMG-PP-AREA-SUBAREA-SYSTEM (5 segments)", reference: "TCMG-STD-FL-001", owner: "Engineering", status: "Locked" },
  { area: "Asset Numbering", standard: "Area Prefix First format with sequential numbering per sub area", reference: "TCMG-STD-FL-001", owner: "Engineering", status: "Locked" },
  { area: "Asset Naming", standard: "Standardised naming convention with equipment type prefixes and component suffixes (MTR, GBX, VSD, SWT, TX)", reference: "TCMG-STD-NAM-001", owner: "Engineering", status: "Locked" },
  { area: "P&ID Register", standard: "14 page verified P&ID set (PI-001 to PI-014) as sole source of truth for tag assignments", reference: "P&ID Drawing Set", owner: "Engineering", status: "Locked" },
  { area: "Parts Numbering", standard: "7 digit numeric SSCCNNN format (Site Code 10, Category Codes CC, Sequential NNN)", reference: "TCMG-STD-SPN-001", owner: "Stores", status: "Locked" },
  { area: "Asset Tagging", standard: "TYPE A (Major Asset) and TYPE B (Equipment Position) tag standards with Gravotech LS100 production", reference: "TCMG-STD-TAG-002", owner: "Maintenance Supervisor", status: "Locked" },
  { area: "PM Templates", standard: "88 approved PM templates across 3 disciplines (Mechanical, Electrical, Mobile Equipment)", reference: "PM Master List", owner: "Maintenance Supervisor", status: "Locked" },
  { area: "Electrical Identifiers", standard: "Generator series 17-GN-xxx, MCC series 18-MCC-xxx", reference: "TCMG-STD-FL-001", owner: "Engineering", status: "Locked" },
  { area: "Store Locations", standard: "Container coding C01 to C05 with Zone Position format (e.g. C01-EL-A1), Laydown Yard LD-A to LD-F", reference: "Store Layout Plan", owner: "Stores", status: "Locked" },
  { area: "Stock Control", standard: "9 section governance framework: receiving, issuing, nightshift rules, weekly revision cycle (Y26-WXX)", reference: "Stock Control Procedure", owner: "Stores", status: "Locked" },
  { area: "Work Order Numbering", standard: "WO-XXXXXX sequential format with mandatory work type classification", reference: "TCMG-STD-WO-001", owner: "Maintenance Supervisor", status: "Locked" },
  { area: "Data Mapping", standard: "Field level mapping to Microsoft Dynamics 365 Asset Management entities", reference: "TCMG-STD-DM-001", owner: "Engineering", status: "Controlled" },
];

interface OwnershipRow {
  dataSet: string;
  description: string;
  owner: string;
  approver: string;
  changeFrequency: string;
}

const OWNERSHIP_MATRIX: OwnershipRow[] = [
  { dataSet: "Asset Register", description: "All registered equipment, parent/child relationships, and component details", owner: "Engineering", approver: "Site Manager", changeFrequency: "Per engineering change" },
  { dataSet: "Functional Locations", description: "FL codes that define where assets sit within the site structure", owner: "Engineering", approver: "Site Manager", changeFrequency: "Per engineering change" },
  { dataSet: "PM Templates", description: "Approved preventive maintenance task lists, frequencies, and checklists", owner: "Maintenance Supervisor", approver: "Maintenance Superintendent", changeFrequency: "Per PM review cycle" },
  { dataSet: "Spare Parts Catalogue", description: "Site parts register including part numbers, descriptions, and images", owner: "Stores", approver: "Maintenance Superintendent", changeFrequency: "As parts are added or obsoleted" },
  { dataSet: "Supplier Register", description: "Approved supplier details, contacts, payment terms, and freight preferences", owner: "Procurement Officer", approver: "Site Manager", changeFrequency: "Per vendor onboarding or review" },
  { dataSet: "Naming Conventions", description: "Equipment prefixes, component suffixes, and area codes", owner: "Engineering", approver: "Site Manager", changeFrequency: "Per standard revision" },
  { dataSet: "P&ID Tag Register", description: "Verified P&ID tags mapped to asset numbers from the drawing set", owner: "Engineering", approver: "Engineering Manager", changeFrequency: "Per P&ID revision only" },
  { dataSet: "Asset Criticality", description: "Criticality ratings and justifications for each registered asset", owner: "Maintenance Supervisor", approver: "Maintenance Superintendent", changeFrequency: "Annual review" },
  { dataSet: "Work Orders", description: "Planned and reactive work instructions linked to assets and parts", owner: "Maintenance Supervisor", approver: "Maintenance Superintendent", changeFrequency: "Ongoing operational" },
  { dataSet: "Purchase Requests", description: "Procurement requests raised against work orders or stock replenishment", owner: "Requester", approver: "Approver (tiered)", changeFrequency: "Ongoing operational" },
];

const INTEGRITY_RULES = [
  { rule: "No Fabrication", desc: "P&ID tags, asset numbers, FL codes, and part numbers are never invented, assumed, or guessed. If data is unknown, it is marked TBC until verified." },
  { rule: "Verified Sources Only", desc: "All equipment data must originate from verified P&IDs (PI-001 to PI-014), OEM manuals, or physical walkdown records. No data is accepted from memory alone." },
  { rule: "Immutable Identifiers", desc: "Once assigned, asset numbers, FL codes, and site part numbers are never reused, changed, or transferred to a different item." },
  { rule: "One Part, One Number", desc: "Each physical spare part receives exactly one SSCCNNN identifier with leading zeros (001, 002). No aliases or duplicates are permitted." },
  { rule: "Hierarchy Compliance", desc: "No level skipping is allowed in the 7 level hierarchy. Electrical equipment sits under the equipment it powers. Components inherit their parent FL codes." },
  { rule: "Tag Source of Truth", desc: "P&ID tags are exclusively sourced from the verified extraction register. Untagged assets remain untagged until verified evidence is obtained from drawings." },
];

const EDITABLE_DATA = [
  "Component OEM details and engineering specifications",
  "Spare parts criticality classification (Critical, Insurance, Non Critical)",
  "Draft PM templates (before approval and locking)",
  "Stock levels, min/max quantities, and supplier linkages",
  "PM to Asset linking (requires commit approval from supervisor)",
  "Asset tag rollout installation status and dates",
  "Unit pricing, lead times, and reorder points",
  "Work order descriptions and labour hour estimates",
];

const RESPONSIBILITY_MAP = [
  { role: "Engineering", items: ["P&ID drawing updates and tag assignments", "Asset naming conventions and numbering rules", "Hierarchy structure changes (adding or removing levels)", "Functional location codes and area code definitions", "Electrical identifier series (generators, MCCs)", "Data mapping for future CMMS migration"] },
  { role: "Maintenance Supervisors", items: ["PM template content, frequencies, and task lists", "Work order creation, classification, and closure", "Asset criticality ratings and justifications", "Asset tag rollout installation and verification", "Component OEM details and specification updates", "Labour hour estimates and resource allocation"] },
  { role: "Stores", items: ["Part number allocation using the SSCCNNN format", "Store location coding and bin assignments", "Stock control procedure compliance", "Receiving, issuing, and nightshift withdrawal rules", "Stock levels, min/max quantities, and reorder points"] },
  { role: "Procurement Officer", items: ["Supplier register and vendor onboarding", "Purchase request processing and approvals", "Unit pricing, lead times, and supplier linkages", "Quote management and supplier evaluation"] },
];

const LOCKED_ITEMS = [
  "Asset Hierarchy structure (7 level model)",
  "6 Approved Main Area codes and FL code format",
  "Assigned asset numbers and naming conventions",
  "P&ID extraction register (14 page verified set)",
  "88 approved PM templates across 3 disciplines",
  "Electrical identifier series (17-GN-xxx, 18-MCC-xxx)",
  "Stock code format (SSCCNNN)",
  "Store location coding (C01 to C05, LD-A to LD-F)",
  "Stock control procedure and receiving/issuing rules",
];

const HISTORY_PHASES = [
  { step: "1", label: "Clean", items: ["Remove duplicates", "Standardise descriptions", "Correct asset linkages", "Fill missing fields", "Validate dates and times"] },
  { step: "2", label: "Structure", items: ["Link to asset hierarchy", "Categorise by work type", "Tag failure modes", "Associate parts used", "Record labour hours"] },
  { step: "3", label: "Use", items: ["Analyse failure patterns", "Justify PM frequencies", "Identify bad actors", "Support defect elimination", "Inform spare stocking"] },
];

const DOMAIN_SUMMARY = [
  { title: "Asset Hierarchy", ref: "TCMG-STD-AH-001", items: ["7 level structure", "6 area codes", "Parent child rules", "No level skipping"] },
  { title: "Functional Locations", ref: "TCMG-STD-FL-001", items: ["5 segment FL codes", "Area and Sub Area coding", "System level grouping", "Verified against registers"] },
  { title: "Naming Conventions", ref: "TCMG-STD-NAM-001", items: ["Equipment type prefixes", "Component suffixes", "Mobile equipment codes", "Aligned to registers"] },
  { title: "Parts Numbering", ref: "TCMG-STD-SPN-001", items: ["SSCCNNN format", "Barcode compatible", "One part, one number", "Leading zeros enforced"] },
  { title: "PM Standards", ref: "PM Master List", items: ["88 approved templates", "3 disciplines", "Task level checklists", "Frequency governance"] },
  { title: "Data Mapping", ref: "TCMG-STD-DM-001", items: ["D365 field mapping", "Transformation rules", "Readiness scoring", "6 entity categories"] },
];

/* ── PDF Document (gold themed A4 layout) ───────────────────────────────── */

const GovernanceDocument: React.FC = () => {
  const today = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });

  const thStyle: React.CSSProperties = { padding: "6px 10px", textAlign: "left", backgroundColor: GOLD, color: "#fff", fontSize: 12, fontWeight: 700 };
  const cellStyle = (alt: boolean): React.CSSProperties => ({ padding: "5px 10px", fontSize: 12, borderBottom: "1px solid #e5e0d0", background: alt ? GOLD_BG : "transparent" });

  const sectionHeading = (text: string): React.CSSProperties => ({
    fontSize: 16, fontWeight: 700, margin: "18px 0 8px 0", borderBottom: `2px solid ${GOLD}`, paddingBottom: 4, color: DARK,
  });

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", color: DARK, lineHeight: 1.5, fontSize: 13 }}>
      {/* Page 1: Banner + Purpose + Section 1 */}
      <div data-pdf-section>
        <div style={{ background: GOLD, color: "#fff", padding: "18px 28px", borderRadius: 6, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            TENNANT CREEK MINE
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Governance & Data Standards Pack</div>
          <div style={{ fontSize: 11, marginTop: 4, opacity: 0.9 }}>
            TCMG-STD-GOV-001 | Rev 2.0 | Deliverable 8 | {today}
          </div>
        </div>

        <p style={{ fontSize: 13, marginBottom: 10 }}>
          This document defines the governance framework that protects all maintenance data established during the Phase 1 foundation build.
          It identifies every locked standard, assigns data ownership, enforces change control rules, and establishes the audit trail
          requirements for ongoing compliance and future CMMS migration.
        </p>
        <p style={{ fontSize: 13, marginBottom: 16 }}>
          All standards referenced in this pack are enforced through validated registers and controlled documents.
          No standard listed as Locked can be modified without a formal change request submitted to the relevant data owner and approved
          by the designated approver listed in Section 2.
        </p>

        <div style={sectionHeading("x")}>1. Locked Standards Registry</div>
        <p style={{ fontSize: 12, marginBottom: 8 }}>
          All standards below are finalised and read only. {LOCKED_STANDARDS.filter(s => s.status === "Locked").length} locked, {LOCKED_STANDARDS.filter(s => s.status === "Controlled").length} controlled.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "14%" }}>Area</th>
              <th style={{ ...thStyle, width: "38%" }}>Standard</th>
              <th style={{ ...thStyle, width: "18%" }}>Reference Doc</th>
              <th style={{ ...thStyle, width: "18%" }}>Owner</th>
              <th style={{ ...thStyle, width: "12%", textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {LOCKED_STANDARDS.map((row, i) => (
              <tr key={i}>
                <td style={{ ...cellStyle(i % 2 === 1), fontWeight: 600 }}>{row.area}</td>
                <td style={cellStyle(i % 2 === 1)}>{row.standard}</td>
                <td style={{ ...cellStyle(i % 2 === 1), fontFamily: "monospace", fontSize: 11 }}>{row.reference}</td>
                <td style={cellStyle(i % 2 === 1)}>{row.owner}</td>
                <td style={{ ...cellStyle(i % 2 === 1), textAlign: "center", fontWeight: 600, color: row.status === "Locked" ? "#16a34a" : GOLD }}>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 2 + 3 together */}
      <div data-pdf-section>
        <div style={sectionHeading("x")}>2. Data Ownership & Accountability</div>
        <p style={{ fontSize: 12, marginBottom: 8 }}>Every dataset has a defined owner, approver, and expected change frequency.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "14%" }}>Dataset</th>
              <th style={{ ...thStyle, width: "28%" }}>Description</th>
              <th style={{ ...thStyle, width: "16%" }}>Data Owner</th>
              <th style={{ ...thStyle, width: "16%" }}>Approver</th>
              <th style={{ ...thStyle, width: "26%" }}>Change Frequency</th>
            </tr>
          </thead>
          <tbody>
            {OWNERSHIP_MATRIX.map((row, i) => (
              <tr key={i}>
                <td style={{ ...cellStyle(i % 2 === 1), fontWeight: 600 }}>{row.dataSet}</td>
                <td style={cellStyle(i % 2 === 1)}>{row.description}</td>
                <td style={cellStyle(i % 2 === 1)}>{row.owner}</td>
                <td style={cellStyle(i % 2 === 1)}>{row.approver}</td>
                <td style={cellStyle(i % 2 === 1)}>{row.changeFrequency}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={sectionHeading("x")}>3. Data Integrity Rules</div>
        <p style={{ fontSize: 12, marginBottom: 8 }}>Non negotiable rules that apply to all maintenance data across the site.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "22%" }}>Rule</th>
              <th style={{ ...thStyle, width: "78%" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {INTEGRITY_RULES.map((item, i) => (
              <tr key={i}>
                <td style={{ ...cellStyle(i % 2 === 1), fontWeight: 600 }}>{item.rule}</td>
                <td style={cellStyle(i % 2 === 1)}>{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 4 all together: Change Control + Responsibility + Locked vs Editable */}
      <div data-pdf-section>
        <div style={sectionHeading("x")}>4. Change Control Process</div>
        <p style={{ fontSize: 12, marginBottom: 8 }}>All modifications to locked or controlled data must follow this 3 step workflow.</p>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "8%", textAlign: "center" }}>Step</th>
              <th style={{ ...thStyle, width: "18%" }}>Action</th>
              <th style={{ ...thStyle, width: "74%" }}>Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...cellStyle(false), textAlign: "center", fontWeight: 700 }}>1</td>
              <td style={{ ...cellStyle(false), fontWeight: 600 }}>Request</td>
              <td style={cellStyle(false)}>The person requesting the change documents what needs to change, why it is needed, and which datasets or registers will be affected.</td>
            </tr>
            <tr>
              <td style={{ ...cellStyle(true), textAlign: "center", fontWeight: 700 }}>2</td>
              <td style={{ ...cellStyle(true), fontWeight: 600 }}>Review & Approve</td>
              <td style={cellStyle(true)}>The data owner and approver review the impact on the hierarchy, PMs, spares, and any downstream registers before signing off.</td>
            </tr>
            <tr>
              <td style={{ ...cellStyle(false), textAlign: "center", fontWeight: 700 }}>3</td>
              <td style={{ ...cellStyle(false), fontWeight: 600 }}>Implement & Record</td>
              <td style={cellStyle(false)}>The change is executed, all affected registers are updated, and the modification is recorded with a date and the name of who made the change.</td>
            </tr>
          </tbody>
        </table>

        <div style={{ ...sectionHeading("x"), fontSize: 14 }}>4.1 Responsibility Matrix</div>
        <p style={{ fontSize: 12, marginBottom: 8 }}>The table below defines which role is responsible for each type of data change on site.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "22%" }}>Role</th>
              <th style={{ ...thStyle, width: "78%" }}>Responsibilities</th>
            </tr>
          </thead>
          <tbody>
            {RESPONSIBILITY_MAP.map((r, i) => (
              <tr key={i}>
                <td style={{ ...cellStyle(i % 2 === 1), fontWeight: 600, verticalAlign: "top" }}>{r.role}</td>
                <td style={cellStyle(i % 2 === 1)}>
                  {r.items.map((item, j) => (
                    <div key={j} style={{ marginBottom: j < r.items.length - 1 ? 2 : 0 }}>• {item}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ ...sectionHeading("x"), fontSize: 14 }}>4.2 Locked vs Editable Data</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
          <div style={{ flex: 1, border: "1px solid #d4edda", borderRadius: 6, padding: 14, background: "#f0fdf4" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "#16a34a" }}>Locked (Read Only)</div>
            <p style={{ fontSize: 11, marginBottom: 6, color: "#555" }}>Cannot be changed without a formal change request submitted to Engineering or the Site Manager.</p>
            {LOCKED_ITEMS.map((item, i) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 2 }}>✓ {item}</div>
            ))}
          </div>
          <div style={{ flex: 1, border: "1px solid #fde68a", borderRadius: 6, padding: 14, background: "#fffbeb" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "#d97706" }}>Editable (With Approval)</div>
            <p style={{ fontSize: 11, marginBottom: 6, color: "#555" }}>Can be updated by the data owner but requires sign off from the designated approver before changes are finalised.</p>
            {EDITABLE_DATA.map((item, i) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 2 }}>△ {item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Sections 5 + 6 + 7 together */}
      <div data-pdf-section>
        <div style={sectionHeading("x")}>5. Audit Trail & Traceability</div>
        <p style={{ fontSize: 12, marginBottom: 8 }}>
          All changes to critical data are recorded in a change log. Each entry captures the date, the person who made the change,
          what was changed, and the before and after values. This ensures compliance traceability and supports future CMMS migration validation.
          Until a digital system is in place, changes should be recorded on the printed Change Log sheet maintained by the Maintenance Supervisor.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr>
              <th style={thStyle}>What Gets Tracked</th>
              <th style={thStyle}>What Gets Captured</th>
              <th style={thStyle}>Retention</th>
              <th style={thStyle}>Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...cellStyle(false), verticalAlign: "top" }}>
                {"Asset register changes\nPM template modifications\nWork order updates\nPurchase request approvals\nCriticality rating changes".split("\n").map((t, i) => <div key={i}>• {t}</div>)}
              </td>
              <td style={{ ...cellStyle(false), verticalAlign: "top" }}>
                {"Date and time\nWho made the change\nWhat was changed\nPrevious value\nNew value".split("\n").map((t, i) => <div key={i}>• {t}</div>)}
              </td>
              <td style={{ ...cellStyle(false), verticalAlign: "top" }}>
                {"All records retained indefinitely\nNo purge policy applies\nAvailable for export and review".split("\n").map((t, i) => <div key={i}>• {t}</div>)}
              </td>
              <td style={{ ...cellStyle(false), verticalAlign: "top" }}>
                {"Read only for all site personnel\nMaintenance Superintendent can export\nNo manual editing of the log".split("\n").map((t, i) => <div key={i}>• {t}</div>)}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={sectionHeading("x")}>6. Standards Summary by Domain</div>
        <p style={{ fontSize: 12, marginBottom: 8 }}>Quick reference of all governance documents established during Phase 1.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "22%" }}>Domain</th>
              <th style={{ ...thStyle, width: "22%" }}>Reference</th>
              <th style={{ ...thStyle, width: "56%" }}>Key Points</th>
            </tr>
          </thead>
          <tbody>
            {DOMAIN_SUMMARY.map((d, i) => (
              <tr key={i}>
                <td style={{ ...cellStyle(i % 2 === 1), fontWeight: 600 }}>{d.title}</td>
                <td style={{ ...cellStyle(i % 2 === 1), fontFamily: "monospace", fontSize: 11 }}>{d.ref}</td>
                <td style={cellStyle(i % 2 === 1)}>{d.items.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={sectionHeading("x")}>7. Maintenance History Standards</div>
        <p style={{ fontSize: 12, marginBottom: 8 }}>
          Quality maintenance history is critical for failure analysis, reliability improvement, and CMMS migration.
          History must be cleaned and structured before it can be used effectively.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "8%", textAlign: "center" }}>Step</th>
              <th style={{ ...thStyle, width: "14%" }}>Phase</th>
              <th style={{ ...thStyle, width: "78%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY_PHASES.map((p, i) => (
              <tr key={i}>
                <td style={{ ...cellStyle(i % 2 === 1), textAlign: "center", fontWeight: 700 }}>{p.step}</td>
                <td style={{ ...cellStyle(i % 2 === 1), fontWeight: 600 }}>{p.label}</td>
                <td style={cellStyle(i % 2 === 1)}>{p.items.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Main UI Section ──────────────────────────────────────────────────────── */

export const DataGovernanceSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setGenerating(true);
    try {
      const { exportSectionsToPdf } = await import("@/utils/sectionPdfExport");
      const { PDF_EXPORT_OPTS } = await import("@/utils/pdfExportStandard");
      await exportSectionsToPdf(contentRef.current, "TCMG-STD-GOV-001_Governance_Data_Standards_Pack.pdf", PDF_EXPORT_OPTS);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                TCMG-STD-GOV-001 · Rev 2.0
              </p>
              <CardTitle className="text-xl mt-1">Governance & Data Standards Pack</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Locked rules for assets, parts, locations, maintenance data, and data ownership to prevent future drift
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-xs">Deliverable 8</Badge>
              <Button onClick={handleDownload} disabled={generating} className="gap-2">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {generating ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
            <p>
              This document defines the governance framework that protects all maintenance data established during the Phase 1 foundation build.
              It identifies every locked standard, assigns data ownership, enforces change control rules, and establishes the audit trail
              requirements for ongoing compliance and future CMMS migration.
            </p>
            <p>
              All standards referenced in this pack are enforced through validated registers and controlled documents.
              No standard listed as "Locked" can be modified without a formal change request submitted to the relevant data owner and approved
              by the designated approver listed in Section 2.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hidden PDF Document */}
      <div ref={contentRef} style={{ position: "absolute", left: "-9999px", top: 0, width: 900 }}>
        <GovernanceDocument />
      </div>

      {/* Section 1: Locked Standards Registry */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg">1. Locked Standards Registry</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                All standards below are finalised and read only. {LOCKED_STANDARDS.filter(s => s.status === "Locked").length} locked, {LOCKED_STANDARDS.filter(s => s.status === "Controlled").length} controlled.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] font-semibold w-[15%]">Area</TableHead>
                <TableHead className="text-[10px] font-semibold w-[40%]">Standard</TableHead>
                <TableHead className="text-[10px] font-semibold w-[18%]">Reference Doc</TableHead>
                <TableHead className="text-[10px] font-semibold w-[17%]">Owner</TableHead>
                <TableHead className="text-[10px] font-semibold w-[10%] text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LOCKED_STANDARDS.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-[10px] font-medium">{row.area}</TableCell>
                  <TableCell className="text-[10px]">{row.standard}</TableCell>
                  <TableCell className="text-[10px] font-mono text-muted-foreground">{row.reference}</TableCell>
                  <TableCell className="text-[10px]">{row.owner}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={row.status === "Locked" ? "default" : "secondary"}
                      className={`text-[9px] gap-1 ${row.status === "Locked" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                    >
                      {row.status === "Locked" && <Lock className="w-3 h-3" />}
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 2: Data Ownership Matrix */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">2. Data Ownership & Accountability</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every dataset has a defined owner, approver, and expected change frequency
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] font-semibold w-[14%]">Dataset</TableHead>
                <TableHead className="text-[10px] font-semibold w-[30%]">Description</TableHead>
                <TableHead className="text-[10px] font-semibold w-[16%]">Data Owner</TableHead>
                <TableHead className="text-[10px] font-semibold w-[16%]">Approver</TableHead>
                <TableHead className="text-[10px] font-semibold w-[24%]">Change Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OWNERSHIP_MATRIX.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-[10px] font-medium">{row.dataSet}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">{row.description}</TableCell>
                  <TableCell className="text-[10px]">{row.owner}</TableCell>
                  <TableCell className="text-[10px]">{row.approver}</TableCell>
                  <TableCell className="text-[10px]">{row.changeFrequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 3: Data Integrity Rules */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <CardTitle className="text-lg">3. Data Integrity Rules</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Non negotiable rules that apply to all maintenance data across the site
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {INTEGRITY_RULES.map((item, index) => (
              <div key={index} className="flex items-start gap-2 bg-muted/50 rounded-md p-3 border border-border">
                <Lock className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.rule}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Change Control Process */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-lg">4. Change Control Process</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                All modifications to locked or controlled data must follow this 3 step workflow
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-muted/50 rounded-lg p-4 border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">1</div>
              <h5 className="font-medium text-sm">Request</h5>
              <p className="text-xs text-muted-foreground mt-1">
                The person requesting the change documents what needs to change, why it is needed, and which datasets or registers will be affected
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">2</div>
              <h5 className="font-medium text-sm">Review & Approve</h5>
              <p className="text-xs text-muted-foreground mt-1">
                The data owner and approver review the impact on the hierarchy, PMs, spares, and any downstream registers before signing off
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">3</div>
              <h5 className="font-medium text-sm">Implement & Record</h5>
              <p className="text-xs text-muted-foreground mt-1">
                The change is executed, all affected registers are updated, and the modification is recorded with a date and the name of who made the change
              </p>
            </div>
          </div>

          {/* Responsibility Summary */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-sm mb-3">Who is Responsible for What</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {RESPONSIBILITY_MAP.map((r, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-foreground mb-1.5">{r.role}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {r.items.map((item, j) => (
                      <li key={j}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Locked vs Editable */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                Locked (Read Only)
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                These items cannot be changed without a formal change request submitted to Engineering or the Site Manager.
              </p>
              <ul className="text-sm space-y-1.5 text-muted-foreground">
                {LOCKED_ITEMS.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Editable (With Approval)
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                These items can be updated by the data owner but require sign off from the designated approver before changes are finalised.
              </p>
              <ul className="text-sm space-y-1.5 text-muted-foreground">
                {EDITABLE_DATA.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Audit Trail */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">5. Audit Trail & Traceability</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                All modifications to governed data must be traceable
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              All changes to critical data are recorded in a change log. Each entry captures the date, the person who made the change,
              what was changed, and the before and after values. This ensures compliance traceability and supports future CMMS migration validation.
              Until a digital system is in place, changes should be recorded on the printed Change Log sheet maintained by the Maintenance Supervisor.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "What Gets Tracked", items: ["Asset register changes", "PM template modifications", "Work order updates", "Purchase request approvals", "Criticality rating changes"] },
              { label: "What Gets Captured", items: ["Date and time", "Who made the change", "What was changed", "Previous value", "New value"] },
              { label: "Retention", items: ["All records retained indefinitely", "No purge policy applies", "Available for export and review"] },
              { label: "Access", items: ["Read only for all site personnel", "Maintenance Superintendent can export", "No manual editing of the log"] },
            ].map((col, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3 border border-border">
                <h5 className="text-xs font-semibold mb-2">{col.label}</h5>
                <ul className="text-[10px] text-muted-foreground space-y-1">
                  {col.items.map((item, j) => (
                    <li key={j}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Standards Summary by Domain */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <CardTitle className="text-lg">6. Standards Summary by Domain</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quick reference of all governance documents established during Phase 1
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {DOMAIN_SUMMARY.map((domain, i) => {
              const icons = [<Layers className="w-5 h-5" />, <MapPin className="w-5 h-5" />, <Tag className="w-5 h-5" />, <Package className="w-5 h-5" />, <Wrench className="w-5 h-5" />, <Database className="w-5 h-5" />];
              return (
                <div key={i} className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-primary">{icons[i]}</div>
                    <div>
                      <h5 className="text-sm font-medium">{domain.title}</h5>
                      <p className="text-[10px] font-mono text-muted-foreground">{domain.ref}</p>
                    </div>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {domain.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Maintenance History Structure */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">7. Maintenance History Standards</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                How maintenance history should be cleaned, structured, and used for reliability improvement
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Quality maintenance history is critical for failure analysis, reliability improvement, and CMMS migration.
            History must be cleaned and structured before it can be used effectively.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {HISTORY_PHASES.map((phase, i) => {
              const colors = ["bg-destructive/20 text-destructive", "bg-amber-500/20 text-amber-600", "bg-emerald-500/20 text-emerald-600"];
              return (
                <div key={i} className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full ${colors[i]} text-xs font-bold flex items-center justify-center`}>{phase.step}</span>
                    {phase.label}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {phase.items.map((item, j) => (
                      <li key={j}>• {item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
