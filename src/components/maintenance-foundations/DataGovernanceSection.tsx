import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle2, Lock, History, FileText, Package, MapPin, Wrench, Database, BookOpen, ClipboardCheck } from "lucide-react";

type DeliverableStatus = "Complete" | "In Progress" | "Gap";

interface Deliverable {
  number: number;
  title: string;
  description: string;
  status: DeliverableStatus;
  icon: React.ReactNode;
  notes?: string;
}

const DELIVERABLES: Deliverable[] = [
  {
    number: 1,
    title: "Centralised Phase 1 Project Workbook",
    description: "Consolidated Excel-based source of truth for assets, locations, parts, and maintenance data.",
    status: "Gap",
    icon: <FileText className="w-5 h-5" />,
    notes: "Requires merging Asset, FL, Naming, PM, and Spares data into one consolidated .xlsx",
  },
  {
    number: 2,
    title: "Clean Master Asset Register",
    description: "Standardised asset hierarchy, naming, numbering, and criticality classification.",
    status: "Complete",
    icon: <Database className="w-5 h-5" />,
    notes: "processing_plant_assets_rev_b is active and synchronised with criticality ratings",
  },
  {
    number: 3,
    title: "Asset Hierarchy & Tagging Standards Document",
    description: "Defined site asset structure and asset tagging rules, including an execution-ready tagging plan.",
    status: "Complete",
    icon: <BookOpen className="w-5 h-5" />,
    notes: "TCMG-STD-AH-001 and rollout plans established",
  },
  {
    number: 4,
    title: "Stores & Inventory Layout Plan",
    description: "Documented stores model including container layout, location structure, labelling standards, and stock movement rules.",
    status: "Complete",
    icon: <MapPin className="w-5 h-5" />,
    notes: "3D compound layouts and Stock Control Procedures defined",
  },
  {
    number: 5,
    title: "Site Parts Catalogue",
    description: "Cleaned and standardised parts list aligned to store locations and future procurement usage.",
    status: "Complete",
    icon: <Package className="w-5 h-5" />,
    notes: "Site Spares Catalogue UI and database active",
  },
  {
    number: 6,
    title: "Maintenance Data Foundation Pack",
    description: "Structured maintenance history, baseline preventive maintenance list, and minimum job data standards.",
    status: "Complete",
    icon: <Wrench className="w-5 h-5" />,
    notes: "PM Standards and Job Data standards established; Maintenance History requires structured data to replace placeholders",
  },
  {
    number: 7,
    title: "Data Mapping & Readiness Documentation",
    description: "Mapped datasets prepared for future D365 or equivalent system loading.",
    status: "Complete",
    icon: <ClipboardCheck className="w-5 h-5" />,
    notes: "Field-level mapping to D365 entities and readiness dashboard established",
  },
  {
    number: 8,
    title: "Governance & Data Standards Pack",
    description: "Locked rules for assets, parts, locations, and data ownership to prevent future drift.",
    status: "Complete",
    icon: <Shield className="w-5 h-5" />,
    notes: "Rules for assets, parts, and locations locked in database",
  },
];

const StatusBadge = ({ status }: { status: DeliverableStatus }) => {
  const config = {
    Complete: { variant: "default" as const, className: "bg-emerald-600 hover:bg-emerald-700 text-white" },
    "In Progress": { variant: "secondary" as const, className: "bg-amber-500/20 text-amber-700 border-amber-500/30" },
    Gap: { variant: "destructive" as const, className: "" },
  };
  const c = config[status];
  return (
    <Badge variant={c.variant} className={`gap-1 text-[10px] ${c.className}`}>
      {status === "Complete" && <CheckCircle2 className="w-3 h-3" />}
      {status === "In Progress" && <AlertTriangle className="w-3 h-3" />}
      {status === "Gap" && <AlertTriangle className="w-3 h-3" />}
      {status}
    </Badge>
  );
};

export const DataGovernanceSection = () => {
  const complete = DELIVERABLES.filter((d) => d.status === "Complete").length;
  const total = DELIVERABLES.length;

  return (
    <div className="space-y-6">
      {/* TCMG Site Deliverables Tracker */}
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                TCMG Phase 1 Deliverables Tracker
              </p>
              <CardTitle className="text-xl mt-1">Site Deliverables</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                8 core deliverables required for Phase 1 completion and future CMMS migration
              </p>
            </div>
            <Badge variant="outline" className="text-xs shrink-0 gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {complete}/{total} Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {DELIVERABLES.map((d) => (
              <div
                key={d.number}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  d.status === "Complete"
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : d.status === "Gap"
                    ? "border-destructive/20 bg-destructive/5"
                    : "border-amber-500/20 bg-amber-500/5"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    d.status === "Complete"
                      ? "bg-emerald-500/20 text-emerald-600"
                      : d.status === "Gap"
                      ? "bg-destructive/20 text-destructive"
                      : "bg-amber-500/20 text-amber-600"
                  }`}
                >
                  {d.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-muted-foreground">{d.number}.</span>
                    <span className="text-sm font-medium">{d.title}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.description}</p>
                  {d.notes && (
                    <p className="text-[10px] text-muted-foreground/70 mt-1 italic">{d.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Governance Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Maintenance Data Governance & Change Control</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Rules for data integrity, approvals, and change management
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Integrity Rules */}
          <div className="bg-muted/50 rounded-lg p-5 space-y-4">
            <h4 className="font-medium text-foreground">Data Integrity Rules</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { rule: "No Invention", desc: "Do NOT invent, assume, or estimate OEM details — mark as 'TBC' if unknown" },
                { rule: "Document Source Only", desc: "Only use information from verified P&IDs, OEM manuals, or walkdown records" },
                { rule: "6 Approved Area Codes Only", desc: "SITE, UTL, COM, REC, TAIL, SUP — no other area codes permitted" },
                { rule: "P&ID Verification", desc: "All equipment mappings sourced from the 14-page P&ID set (PI-001 to PI-014)" },
                { rule: "Immutable Identifiers", desc: "Asset numbers, FL codes, and part numbers are never reused or changed once assigned" },
                { rule: "No Fabrication", desc: "P&ID tags, asset numbers, and FL codes are never invented or synthesised" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2 bg-background rounded-md p-3 border border-border">
                  <Lock className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.rule}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Change Control Process */}
          <div className="bg-muted/50 rounded-lg p-5 space-y-4">
            <h4 className="font-medium text-foreground">Change Control Process</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-background rounded-lg p-4 border border-border text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">
                  1
                </div>
                <h5 className="font-medium text-sm">Request</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Document the proposed change with justification
                </p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border text-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">
                  2
                </div>
                <h5 className="font-medium text-sm">Review</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Engineering/Supervisor reviews impact and approves
                </p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border text-center">
                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">
                  3
                </div>
                <h5 className="font-medium text-sm">Implement</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Execute change and update all affected registers
                </p>
              </div>
            </div>
          </div>

          {/* Locked Data */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Locked (Read-Only)
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Asset Hierarchy structure (7-level model)</li>
                <li>• 6 Approved Main Area codes (SITE, UTL, COM, REC, TAIL, SUP)</li>
                <li>• Functional Location codes (TCMG-PP-AREA-SUBAREA-SYSTEM)</li>
                <li>• Assigned Asset Numbers (Area-Prefix First format)</li>
                <li>• P&ID extraction register (14-page verified set)</li>
                <li>• Approved PM Templates (88 templates across 3 disciplines)</li>
                <li>• Electrical asset identifiers (17-GN-xxx, 18-MCC-xxx series)</li>
              </ul>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Editable (With Approval)
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Component OEM details and specifications</li>
                <li>• Spare parts criticality classification</li>
                <li>• Draft PM Templates (before approval)</li>
                <li>• Stock levels, min/max, and supplier linkages</li>
                <li>• PM-to-Asset linking (staging table only)</li>
                <li>• Asset tag rollout installation status</li>
              </ul>
            </div>
          </div>

          {/* Audit Trail Note */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Audit Trail</h4>
            <p className="text-sm text-muted-foreground">
              All changes to critical data (hierarchy, FLs, approved PMs, asset numbers) are logged automatically 
              with timestamp, user, before/after values, and justification. The audit log (audit_log table) ensures 
              traceability for compliance and future CMMS migration. Key tables tracked include processing plant 
              assets, PM templates, work orders, and purchase requests.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance History Structure Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Maintenance History Structure</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                How maintenance history should be cleaned, structured, and used
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
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-destructive/20 text-destructive text-xs font-bold flex items-center justify-center">1</span>
                Clean
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Remove duplicates</li>
                <li>• Standardise descriptions</li>
                <li>• Correct asset linkages</li>
                <li>• Fill missing fields</li>
                <li>• Validate dates/times</li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 text-xs font-bold flex items-center justify-center">2</span>
                Structure
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Link to asset hierarchy</li>
                <li>• Categorise by work type</li>
                <li>• Tag failure modes</li>
                <li>• Associate parts used</li>
                <li>• Record labour hours</li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center justify-center">3</span>
                Use
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Analyse failure patterns</li>
                <li>• Justify PM frequencies</li>
                <li>• Identify bad actors</li>
                <li>• Support defect elimination</li>
                <li>• Inform spare stocking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
