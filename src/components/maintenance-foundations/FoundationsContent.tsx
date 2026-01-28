import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  FileText, 
  Hash, 
  History, 
  ClipboardCheck,
  Info,
  CheckCircle2
} from "lucide-react";
import { WorkDefinitionsSection } from "./WorkDefinitionsSection";

export const FoundationsContent = () => {
  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="h-3 w-3 text-primary" />
        </div>
        <div className="text-sm">
          <p className="text-foreground font-medium">
            This section defines how maintenance should work — not how it is built in a system.
          </p>
          <p className="text-muted-foreground mt-1">
            These foundations establish the rules, standards, and structures that all future PMs, work orders, and reporting will follow.
          </p>
        </div>
      </div>

      {/* Section 1: Maintenance Work Definitions */}
      <WorkDefinitionsSection />

      <Separator />

      {/* Section 2: Minimum Job Data Standards */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Minimum Job Data Standards</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Mandatory fields required for every maintenance job to ensure quality and traceability
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-5">
            <p className="text-sm text-muted-foreground mb-4">
              Every maintenance job — whether breakdown or planned — must capture these fields as a minimum standard:
            </p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[
                { field: "Job Number", desc: "Unique identifier for traceability" },
                { field: "Work Type", desc: "Breakdown, Planned, Shutdown, etc." },
                { field: "Priority", desc: "Critical, High, Medium, Low" },
                { field: "Asset/Equipment ID", desc: "What is being worked on" },
                { field: "Functional Location", desc: "Where in the hierarchy" },
                { field: "Short Description", desc: "Clear summary of the work" },
                { field: "Long Description", desc: "Detailed scope and findings" },
                { field: "Reported Date/Time", desc: "When issue was raised" },
                { field: "Completed Date/Time", desc: "When work was finished" },
                { field: "Assigned Trade", desc: "Responsible discipline" },
                { field: "Performed By", desc: "Who completed the work" },
                { field: "Parts Used", desc: "Materials consumed (if any)" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2 bg-background rounded-md p-3 border border-border">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.field}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Section 3: Job Numbering Rules */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Job Numbering Rules</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Standards for unique job numbering and traceability
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-5 space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Numbering Format</h4>
              <p className="text-sm text-muted-foreground mb-3">
                All work orders use a standardised 6-digit sequential numbering system:
              </p>
              <div className="inline-block bg-background border border-border rounded-lg px-4 py-2">
                <code className="text-lg font-mono font-bold text-primary">WO-XXXXXX</code>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Example: WO-000001, WO-000150, WO-001234
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-foreground mb-2">Numbering Rules</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">1.</span>
                  <span><strong>Unique:</strong> Each job number must be unique and never reused</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <span><strong>Sequential:</strong> Numbers are allocated in sequence from a central register</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <span><strong>Controlled:</strong> Numbers are reserved before work begins, not after</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">4.</span>
                  <span><strong>Traceable:</strong> Every number links to documented work and history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">5.</span>
                  <span><strong>No Gaps:</strong> Unused numbers should be recorded with a reason</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Section 4: Maintenance History Structure */}
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
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-600 text-xs font-bold flex items-center justify-center">1</span>
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
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-600 text-xs font-bold flex items-center justify-center">3</span>
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

      <Separator />

      {/* Section 5: Baseline PM List */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Baseline PM List</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                What PMs currently exist and how this baseline will be used
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The baseline PM list captures all currently defined preventive maintenance activities. 
            This serves as the foundation for future optimisation, scheduling, and CMMS configuration.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Purpose of the Baseline</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Document what PMs exist today</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Identify gaps in current coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Provide starting point for optimisation</span>
                </li>
              </ul>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Enable before/after comparison</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Support CMMS migration planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Track PM maturity over time</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Important Note
            </h4>
            <p className="text-sm text-muted-foreground">
              The baseline is a snapshot, not a schedule. PMs in the baseline are not yet linked to specific assets 
              or scheduled for execution. Asset linking and scheduling happen in the CMMS after PM design is approved.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Constraints Footer */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          This Section Does NOT
        </h3>
        <ul className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold">✕</span>
            Link directly to specific assets
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold">✕</span>
            Create schedules or work orders
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold">✕</span>
            Configure system settings
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold">✕</span>
            Define technical PM task steps
          </li>
        </ul>
      </div>
    </div>
  );
};
