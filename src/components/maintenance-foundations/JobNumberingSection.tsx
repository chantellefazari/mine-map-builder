import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Hash, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Target, 
  Clock, 
  ArrowRight,
  Wrench,
  Calendar,
  AlertTriangle
} from "lucide-react";

export const JobNumberingSection = () => {
  const jobFields = [
    { field: "Work Order Number", desc: "Unique identifier for traceability" },
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
  ];

  return (
    <div className="space-y-6">
      {/* Work Order Numbering Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Work Order Numbering Rules</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Standards for unique work order numbering and traceability
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
                  <span><strong>Unique:</strong> Each work order number must be unique and never reused</span>
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

      {/* Minimum Job Data Standards Card */}
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
              {jobFields.map((item, index) => (
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

      {/* Work Type Definitions Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl">Work Type Definitions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Clear definitions for work types to ensure consistent classification
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* The Two Fundamental Categories */}
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3">The Two Fundamental Categories</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All maintenance work falls into one of two categories: <strong>Reactive</strong> (we respond to a problem) 
              or <strong>Proactive</strong> (we prevent a problem).
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 text-center">
                <Zap className="w-8 h-8 text-destructive mx-auto mb-2" />
                <h4 className="font-semibold text-foreground">Reactive Maintenance</h4>
                <p className="text-xs text-muted-foreground mt-1">Responding to failures after they occur</p>
                <p className="text-xs text-muted-foreground mt-2">"Something broke — we need to fix it"</p>
              </div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-foreground">Proactive Maintenance</h4>
                <p className="text-xs text-muted-foreground mt-1">Preventing failures before they occur</p>
                <p className="text-xs text-muted-foreground mt-2">"We're doing this so it doesn't break"</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Breakdown Work */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-lg">
              <span className="w-3 h-3 rounded-full bg-destructive"></span>
              Breakdown Work (Reactive)
            </h3>
            
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 border border-border">
                <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" />
                  What Is It?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Breakdown work is <strong>unplanned maintenance</strong> performed when equipment fails 
                  or is about to fail. The equipment has stopped working, is working incorrectly, or poses an 
                  immediate safety risk if not addressed.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="bg-background rounded-md p-4 border border-border">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Key Characteristics</h4>
                  <ul className="text-sm space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>Unscheduled — we didn't plan for this</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>Equipment has already failed or is failing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>Usually urgent — needs attention now</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>Often disrupts production</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-background rounded-md p-4 border border-border">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Real Examples</h4>
                  <ul className="text-sm space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>Pump seal fails and causes a leak</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>Motor trips on overload protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>Conveyor belt tears and stops material flow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>Gearbox makes grinding noise and stops</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Planned Maintenance */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-lg">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              Planned Maintenance (Proactive)
            </h3>
            
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 border border-border">
                <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  What Is It?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Planned maintenance is <strong>scheduled work</strong> designed to prevent equipment failure 
                  and keep things running properly. We know this work is coming, we prepare the resources 
                  (parts, tools, people), and we do it at a time that minimises disruption.
                </p>
              </div>

              <div className="bg-background rounded-lg p-4 border border-border">
                <h4 className="font-medium text-foreground text-sm mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-green-600" />
                  Types of Planned Maintenance
                </h4>
                <div className="grid gap-3">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-medium text-sm text-foreground">Preventive Maintenance (PM)</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tasks done at <strong>fixed intervals</strong> — every week, every month, every 500 hours.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Examples: Weekly greasing, monthly filter checks, annual overhauls
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-medium text-sm text-foreground">Condition-Based Maintenance</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tasks done when <strong>equipment condition</strong> reaches a certain point.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Examples: Replace filter when pressure drop exceeds limit
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-amber-500 pl-4 py-2">
                    <h5 className="font-medium text-sm text-foreground">Shutdown Maintenance</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Major planned events where we <strong>stop production</strong> to do comprehensive work.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Examples: Annual plant shutdown, crusher reline, mill reline
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};