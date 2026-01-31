import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClipboardList, AlertTriangle, CheckCircle2, Info, ClipboardCheck, ArrowRight, FileText } from "lucide-react";

export const PMStandardsSection = () => {
  const designPrinciples = [
    { rule: "Equipment-Type First", desc: "PMs are designed for equipment categories (e.g. pumps, conveyors), not individual assets" },
    { rule: "Value-Adding Tasks Only", desc: "Every task must prevent or detect a specific failure mode" },
    { rule: "Inspection Before Intrusive", desc: "Non-intrusive inspections occur more frequently than invasive work" },
    { rule: "Risk-Based Frequency", desc: "Frequencies are set using criticality, failure history, and operating context — not habit" },
    { rule: "Explicit Isolation", desc: "Every PM must clearly state isolation and LOTO requirements" },
  ];

  const frequencyStandards = [
    {
      discipline: "Mechanical",
      frequencies: ["Daily", "1-Week", "2-Week", "6-Week", "12-Week"],
      color: "text-blue-600",
    },
    {
      discipline: "Electrical",
      frequencies: ["1-Week", "2-Week", "12-Week", "24-Week", "52-Week"],
      color: "text-amber-600",
    },
    {
      discipline: "Mobile Equipment",
      frequencies: ["Daily", "1-Week"],
      color: "text-green-600",
    },
  ];

  const statusWorkflow = ["Draft", "Reviewed", "Approved", "Ready for CMMS"];

  const mandatoryFields = [
    "PM title",
    "Equipment category",
    "Discipline",
    "Frequency",
    "Safety warnings & hazard identification",
    "Isolation / LOTO requirements",
    "Required tools and consumables",
    "Step-by-step procedure",
    "Inspection checklist with tick-off",
    "Findings / comments section",
    "Prepared by / Reviewed by / Approved by",
    "Revision and version control",
  ];

  const baselinePurposes = [
    "Document current PM coverage",
    "Identify gaps and duplication",
    "Support optimisation and CMMS migration",
    "Enable before/after comparison",
    "Track PM maturity over time",
  ];

  return (
    <div className="space-y-6">
      {/* Governance Warning */}
      <Alert className="border-amber-500/50 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>This section is governance and design reference only.</strong> It must NOT create schedules, link assets, modify PMs, or change any existing data.
        </AlertDescription>
      </Alert>

      {/* Purpose Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-xl">PM Template & Frequency Standards</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Approved preventive maintenance design standards for Tennant Creek Mine
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              This section defines the approved preventive maintenance (PM) design standards, including template structure, safety requirements, and frequency governance. It governs <strong>how PMs are designed</strong>, not how they are executed or scheduled.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* PM Design Principles */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">PM Design Principles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {designPrinciples.map((item, index) => (
              <div key={index} className="flex items-start gap-2 bg-muted/50 rounded-md p-3 border border-border">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.rule}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PM Status Workflow */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">PM Status Workflow</CardTitle>
          <p className="text-sm text-muted-foreground">Controlled lifecycle for PM approval</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {statusWorkflow.map((status, index) => (
              <div key={status} className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  status === "Approved" || status === "Ready for CMMS" 
                    ? "bg-green-500/10 text-green-700 border border-green-500/30" 
                    : "bg-muted text-muted-foreground border border-border"
                }`}>
                  {status}
                </span>
                {index < statusWorkflow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-md p-3">
            <Info className="w-4 h-4 inline mr-2 text-primary" />
            Only <strong>Approved</strong> PMs may be imported into the CMMS.
          </p>
        </CardContent>
      </Card>

      {/* Frequency Standards */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Frequency Standards by Discipline</CardTitle>
          <p className="text-sm text-muted-foreground">Design standards only, not schedules</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {frequencyStandards.map((item) => (
            <div key={item.discipline} className="bg-muted/50 rounded-md p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-medium text-sm ${item.color}`}>{item.discipline}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.frequencies.map((freq) => (
                  <span
                    key={freq}
                    className="text-xs bg-background px-2 py-1 rounded font-mono border border-border"
                  >
                    {freq}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-500/10 rounded-md p-3 border border-amber-500/30">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Frequencies are design standards only, not schedules.</span>
          </div>
        </CardContent>
      </Card>

      {/* Standard PM Template */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Standard PM Template (Mandatory Fields)</CardTitle>
              <p className="text-sm text-muted-foreground">All PMs must include these fields</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {mandatoryFields.map((field, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span>{field}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Constraints */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Constraints (Non-Negotiable)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✗</span>
                <span>Do NOT copy-paste generic OEM manuals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✗</span>
                <span>Do NOT create schedules here</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✗</span>
                <span>Do NOT link PMs to specific assets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✗</span>
                <span>Do NOT skip safety or isolation steps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✗</span>
                <span>This section is <strong>design only</strong>, not execution</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Baseline PM List */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Baseline PM List (Reference Only)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Snapshot of existing PMs for documentation purposes
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Purpose of the Baseline</h4>
            <div className="grid gap-2 md:grid-cols-2">
              {baselinePurposes.map((purpose, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{purpose}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-500/10 rounded-md p-3 border border-amber-500/30">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Baseline PMs are not scheduled, not asset-linked, and not approved by default.</span>
          </div>
        </CardContent>
      </Card>

      {/* Governance Statement */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <p className="text-sm text-center text-muted-foreground">
          <strong>Governance Statement:</strong> This section defines PM design standards only. It does not modify existing PMs, schedules, or asset data.
        </p>
      </div>
    </div>
  );
};