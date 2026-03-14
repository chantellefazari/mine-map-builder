import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Deliverable 8 — Governance & Data Standards Pack                          */
/*  TCMG-STD-GOV-001 · Professional document for site manager presentation   */
/* ─────────────────────────────────────────────────────────────────────────── */

// ── Locked Standards Registry ────────────────────────────────────────────────
interface LockedStandard {
  area: string;
  standard: string;
  reference: string;
  owner: string;
  status: "Locked" | "Controlled" | "Draft";
}

const LOCKED_STANDARDS: LockedStandard[] = [
  { area: "Asset Hierarchy", standard: "7-level hierarchy structure (Site → Facility → Main Area → Sub-Area → Parent Asset → Equipment → Component)", reference: "TCMG-STD-AH-001", owner: "Maintenance Engineering", status: "Locked" },
  { area: "Area Codes", standard: "6 approved Main Area codes: SITE, UTL, COM, REC, TAIL, SUP", reference: "TCMG-STD-AH-001", owner: "Maintenance Engineering", status: "Locked" },
  { area: "Functional Locations", standard: "FL code format: TCMG-PP-AREA-SUBAREA-SYSTEM (5 segments)", reference: "TCMG-STD-FL-001", owner: "Maintenance Engineering", status: "Locked" },
  { area: "Asset Numbering", standard: "Area-Prefix First format with sequential numbering per sub-area", reference: "TCMG-STD-FL-001", owner: "Maintenance Engineering", status: "Locked" },
  { area: "Asset Naming", standard: "Standardised naming convention with equipment type prefixes and component suffixes (MTR, GBX, VSD, SWT, TX)", reference: "TCMG-STD-NAM-001", owner: "Maintenance Engineering", status: "Locked" },
  { area: "P&ID Register", standard: "14-page verified P&ID set (PI-001 to PI-014) as sole source of truth for tag assignments", reference: "P&ID Drawing Set", owner: "Engineering", status: "Locked" },
  { area: "Parts Numbering", standard: "7-digit numeric SSCCNNN format (Site Code 10, Category Codes CC, Sequential NNN)", reference: "TCMG-STD-SPN-001", owner: "Stores / Procurement", status: "Locked" },
  { area: "Asset Tagging", standard: "TYPE A (Major Asset) and TYPE B (Equipment Position) tag standards with Gravotech LS100 production", reference: "TCMG-STD-TAG-002", owner: "Maintenance Engineering", status: "Locked" },
  { area: "PM Templates", standard: "88 approved PM templates across 3 disciplines (Mechanical, Electrical, Mobile Equipment)", reference: "PM Master List", owner: "Maintenance Planning", status: "Locked" },
  { area: "Electrical Identifiers", standard: "Generator series 17-GN-xxx, MCC series 18-MCC-xxx", reference: "TCMG-STD-FL-001", owner: "Electrical Engineering", status: "Locked" },
  { area: "Store Locations", standard: "Container coding C01-C05 with Zone-Position format (e.g. C01-EL-A1), Laydown Yard LD-A to LD-F", reference: "Store Layout Plan", owner: "Stores", status: "Locked" },
  { area: "Stock Control", standard: "9-section governance framework: receiving, issuing, nightshift rules, weekly revision cycle (Y26-WXX)", reference: "Stock Control Procedure", owner: "Stores", status: "Locked" },
  { area: "Work Order Numbering", standard: "WO-XXXXXX sequential format with mandatory work type classification", reference: "TCMG-STD-WO-001", owner: "Maintenance Planning", status: "Locked" },
  { area: "Data Mapping", standard: "Field-level mapping to Microsoft Dynamics 365 Asset Management entities", reference: "TCMG-STD-DM-001", owner: "Project Engineering", status: "Controlled" },
];

// ── Data Ownership Matrix ────────────────────────────────────────────────────
interface OwnershipRow {
  dataSet: string;
  sourceTable: string;
  owner: string;
  approver: string;
  changeFrequency: string;
}

const OWNERSHIP_MATRIX: OwnershipRow[] = [
  { dataSet: "Asset Register", sourceTable: "processing_plant_assets_rev_b", owner: "Maintenance Engineer", approver: "Site Manager", changeFrequency: "Per engineering change" },
  { dataSet: "Functional Locations", sourceTable: "processing_functional_locations", owner: "Maintenance Engineer", approver: "Site Manager", changeFrequency: "Per engineering change" },
  { dataSet: "PM Templates", sourceTable: "pm_master_list", owner: "Maintenance Planner", approver: "Maintenance Superintendent", changeFrequency: "Per PM review cycle" },
  { dataSet: "Spare Parts Catalogue", sourceTable: "site_spares", owner: "Stores Coordinator", approver: "Maintenance Superintendent", changeFrequency: "As parts are added/obsoleted" },
  { dataSet: "Supplier Register", sourceTable: "practice_suppliers", owner: "Procurement Officer", approver: "Site Manager", changeFrequency: "Per vendor onboarding/review" },
  { dataSet: "Naming Conventions", sourceTable: "processing_naming_conventions", owner: "Maintenance Engineer", approver: "Site Manager", changeFrequency: "Per standard revision" },
  { dataSet: "P&ID Tag Register", sourceTable: "processing_pid_tags", owner: "Engineering", approver: "Maintenance Engineer", changeFrequency: "Per P&ID revision only" },
  { dataSet: "Asset Criticality", sourceTable: "asset_criticality_ratings", owner: "Reliability Engineer", approver: "Maintenance Superintendent", changeFrequency: "Annual review" },
  { dataSet: "Work Orders", sourceTable: "work_orders", owner: "Maintenance Planner", approver: "Supervisor", changeFrequency: "Ongoing operational" },
  { dataSet: "Purchase Requests", sourceTable: "purchase_requests", owner: "Requester", approver: "Approver (tiered)", changeFrequency: "Ongoing operational" },
];

// ── Data Integrity Rules ─────────────────────────────────────────────────────
const INTEGRITY_RULES = [
  { rule: "No Fabrication", desc: "P&ID tags, asset numbers, FL codes, and part numbers are never invented, assumed, or synthesised. If data is unknown, it is marked 'TBC'." },
  { rule: "Verified Sources Only", desc: "All equipment data must originate from verified P&IDs (PI-001 to PI-014), OEM manuals, or physical walkdown records." },
  { rule: "Immutable Identifiers", desc: "Once assigned, asset numbers, FL codes, and site part numbers are never reused, changed, or retired to a different item." },
  { rule: "One Part = One Number", desc: "Each physical spare part receives exactly one SSCCNNN identifier with leading zeros (001, 002). No aliases or duplicates permitted." },
  { rule: "Hierarchy Compliance", desc: "No level skipping in the 7-level hierarchy. Electrical equipment sits under the equipment it powers. Components inherit parent FL codes." },
  { rule: "Tag Source of Truth", desc: "P&ID tags are exclusively sourced from the verified extraction register. Untagged assets remain untagged until verified evidence is obtained." },
];

// ── Editable (Controlled) Data ───────────────────────────────────────────────
const EDITABLE_DATA = [
  "Component OEM details and engineering specifications",
  "Spare parts criticality classification (Critical / Insurance / Non-Critical)",
  "Draft PM templates (before approval and locking)",
  "Stock levels, min/max quantities, and supplier linkages",
  "PM-to-Asset linking (staging table — requires commit approval)",
  "Asset tag rollout installation status and dates",
  "Unit pricing, lead times, and reorder points (partial data)",
  "Work order descriptions and labour hour estimates",
];

export const DataGovernanceSection = () => {
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
            <Badge variant="outline" className="text-xs shrink-0">
              Deliverable 8
            </Badge>
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
              All standards referenced in this pack are enforced through database-level constraints, automated validation triggers,
              and role-based access controls. No standard listed as "Locked" can be modified without formal engineering change approval.
            </p>
          </div>
        </CardContent>
      </Card>

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
                All standards below are finalised and read-only — {LOCKED_STANDARDS.filter(s => s.status === "Locked").length} locked, {LOCKED_STANDARDS.filter(s => s.status === "Controlled").length} controlled
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
                Every dataset has a defined owner, approver, and change frequency
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] font-semibold w-[18%]">Dataset</TableHead>
                <TableHead className="text-[10px] font-semibold w-[22%]">Source Table</TableHead>
                <TableHead className="text-[10px] font-semibold w-[18%]">Data Owner</TableHead>
                <TableHead className="text-[10px] font-semibold w-[18%]">Approver</TableHead>
                <TableHead className="text-[10px] font-semibold w-[24%]">Change Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OWNERSHIP_MATRIX.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-[10px] font-medium">{row.dataSet}</TableCell>
                  <TableCell className="text-[10px] font-mono text-muted-foreground">{row.sourceTable}</TableCell>
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
                Non-negotiable rules that apply to all maintenance data across the site
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
                All modifications to locked or controlled data must follow this 3-step workflow
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
                Document the proposed change with justification, affected datasets, and impact assessment
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">2</div>
              <h5 className="font-medium text-sm">Review & Approve</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Data owner and approver review impact on hierarchy, PMs, spares, and downstream systems
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">3</div>
              <h5 className="font-medium text-sm">Implement & Audit</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Execute change, update all affected registers, and verify audit log entry is captured
              </p>
            </div>
          </div>

          {/* What requires change control */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                Locked (Read-Only) — Requires Engineering Change
              </h4>
              <ul className="text-sm space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> Asset Hierarchy structure (7-level model)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> 6 Approved Main Area codes and FL code format</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> Assigned asset numbers and naming conventions</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> P&ID extraction register (14-page verified set)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> 88 approved PM templates across 3 disciplines</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> Electrical identifier series (17-GN-xxx, 18-MCC-xxx)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> Site part numbering format (SSCCNNN)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> Store location coding (C01-C05, LD-A to LD-F)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> Stock control procedure and receiving/issuing rules</li>
              </ul>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Editable (With Approval)
              </h4>
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
                100% traceability for all modifications to governed data
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              All changes to critical data are logged automatically via the <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">audit_log</span> table.
              Each entry captures the timestamp, user, table name, operation type, and full before/after values.
              This ensures compliance traceability and supports future CMMS migration validation.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Tables Tracked", items: ["Processing plant assets", "PM master list", "Work orders", "Purchase requests", "Asset criticality ratings"] },
              { label: "Captured Fields", items: ["Timestamp (UTC)", "Changed by (user ID)", "Operation (INSERT/UPDATE/DELETE)", "Record ID", "Before/after JSON"] },
              { label: "Retention", items: ["All audit records retained indefinitely", "No purge policy", "Available for export"] },
              { label: "Access", items: ["Read-only for all users", "Admin-only for exports", "Automated — no manual entry"] },
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
            {[
              { icon: <Layers className="w-5 h-5" />, title: "Asset Hierarchy", ref: "TCMG-STD-AH-001", items: ["7-level structure", "6 area codes", "Parent-child rules", "No level skipping"] },
              { icon: <MapPin className="w-5 h-5" />, title: "Functional Locations", ref: "TCMG-STD-FL-001", items: ["5-segment FL codes", "Area + Sub-area coding", "System-level grouping", "Database-governed"] },
              { icon: <Tag className="w-5 h-5" />, title: "Naming Conventions", ref: "TCMG-STD-NAM-001", items: ["Equipment type prefixes", "Component suffixes", "Instrumentation codes", "Database-driven"] },
              { icon: <Package className="w-5 h-5" />, title: "Parts Numbering", ref: "TCMG-STD-SPN-001", items: ["SSCCNNN format", "Barcode compatible", "One part = one number", "Leading zeros enforced"] },
              { icon: <Wrench className="w-5 h-5" />, title: "PM Standards", ref: "PM Master List", items: ["88 approved templates", "3 disciplines", "Task-level checklists", "Frequency governance"] },
              { icon: <Database className="w-5 h-5" />, title: "Data Mapping", ref: "TCMG-STD-DM-001", items: ["D365 field mapping", "ETL transformation rules", "Readiness scoring", "6 entity categories"] },
            ].map((domain, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-primary">{domain.icon}</div>
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
            ))}
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
            {[
              { step: "1", label: "Clean", color: "bg-destructive/20 text-destructive", items: ["Remove duplicates", "Standardise descriptions", "Correct asset linkages", "Fill missing fields", "Validate dates/times"] },
              { step: "2", label: "Structure", color: "bg-amber-500/20 text-amber-600", items: ["Link to asset hierarchy", "Categorise by work type", "Tag failure modes", "Associate parts used", "Record labour hours"] },
              { step: "3", label: "Use", color: "bg-emerald-500/20 text-emerald-600", items: ["Analyse failure patterns", "Justify PM frequencies", "Identify bad actors", "Support defect elimination", "Inform spare stocking"] },
            ].map((phase, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${phase.color} text-xs font-bold flex items-center justify-center`}>{phase.step}</span>
                  {phase.label}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {phase.items.map((item, j) => (
                    <li key={j}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
