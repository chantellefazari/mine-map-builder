import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Zap,
  Wrench,
  Calendar,
  Target,
  ArrowRight,
  Lightbulb,
  Shield,
  FileText,
  Layers
} from "lucide-react";

export const WorkDefinitionsSection = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-xl">Maintenance Work Definitions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Clear definitions for work types to ensure consistent classification across the site
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Introduction - Why This Matters */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-primary" />
            Why Work Definitions Matter
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Before we can manage maintenance effectively, everyone must speak the same language. 
            When a supervisor says "breakdown" and a planner says "corrective work", are they talking 
            about the same thing? Without clear definitions, we cannot:
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Accurately measure our performance</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Identify where to focus improvement efforts</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Report consistently to management</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Train new team members effectively</span>
            </div>
          </div>
        </div>

        {/* How This Connects to What We're Building */}
        <div className="bg-muted/50 border border-border rounded-lg p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-foreground" />
            How This Connects to What We're Building
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            These definitions are the foundation for everything else in this system:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 bg-background rounded-md p-3 border border-border">
              <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Work Order Templates</p>
                <p className="text-xs text-muted-foreground">Every work order is classified as Breakdown, Planned, or Shutdown — these definitions tell us which to use</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md p-3 border border-border">
              <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">PM Design</p>
                <p className="text-xs text-muted-foreground">All PMs are "Planned Maintenance" — they are scheduled tasks designed to prevent breakdowns</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md p-3 border border-border">
              <Layers className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Asset Hierarchy</p>
                <p className="text-xs text-muted-foreground">Work is always linked to an asset — the hierarchy tells us exactly what equipment we're working on</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md p-3 border border-border">
              <Wrench className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Spares Catalogue</p>
                <p className="text-xs text-muted-foreground">Critical spares are stocked to support both breakdown repairs and planned maintenance tasks</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* The Two Fundamental Categories */}
        <div>
          <h3 className="font-semibold text-foreground text-lg mb-3">The Two Fundamental Categories</h3>
          <p className="text-sm text-muted-foreground mb-4">
            All maintenance work falls into one of two categories: <strong>Reactive</strong> (we respond to a problem) 
            or <strong>Proactive</strong> (we prevent a problem). This is the most important distinction to understand.
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

        {/* Breakdown Work - Detailed */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-lg">
            <span className="w-3 h-3 rounded-full bg-destructive"></span>
            Breakdown Work (Reactive)
          </h3>
          
          <div className="space-y-4">
            {/* Definition */}
            <div className="bg-background rounded-lg p-4 border border-border">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-destructive" />
                What Is It?
              </h4>
              <p className="text-sm text-muted-foreground">
                Breakdown work is <strong>unplanned maintenance</strong> performed when equipment fails 
                or is about to fail. The equipment has stopped working, is working incorrectly, or poses an 
                immediate safety risk if not addressed. This is reactive — we are responding to a problem 
                that has already happened.
              </p>
            </div>

            {/* When It Happens */}
            <div className="bg-background rounded-lg p-4 border border-border">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-destructive" />
                When Does This Happen?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span>Equipment fails unexpectedly during operation (motor trips, pump stops, belt breaks)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span>Operator notices something wrong (unusual noise, vibration, smell, leak, alarm)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span>Safety system activates and requires investigation before restart</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span>Environmental incident requires immediate action (spill, release)</span>
                </li>
              </ul>
            </div>

            {/* Key Characteristics */}
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
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Parts may not be readily available</span>
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
                    <span>Instrument gives false readings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Gearbox makes grinding noise and stops</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* In Our System */}
            <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/30">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-destructive" />
                In Our System
              </h4>
              <p className="text-sm text-muted-foreground">
                When breakdown work occurs, we raise a <strong>Work Order</strong> with Work Type = "Breakdown". 
                This tells everyone the work was unplanned. We record what failed, what we did to fix it, 
                and what parts we used. This history helps us understand if we need to improve our PMs or 
                stock different spares.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Planned Maintenance - Detailed */}
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-lg">
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            Planned Maintenance (Proactive)
          </h3>
          
          <div className="space-y-4">
            {/* Definition */}
            <div className="bg-background rounded-lg p-4 border border-border">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                What Is It?
              </h4>
              <p className="text-sm text-muted-foreground">
                Planned maintenance is <strong>scheduled work</strong> designed to prevent equipment failure 
                and keep things running properly. We know this work is coming, we prepare the resources 
                (parts, tools, people), and we do it at a time that minimises disruption. This is proactive — 
                we are preventing problems before they happen.
              </p>
            </div>

            {/* Types of Planned Maintenance */}
            <div className="bg-background rounded-lg p-4 border border-border">
              <h4 className="font-medium text-foreground text-sm mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-green-600" />
                Types of Planned Maintenance
              </h4>
              <div className="grid gap-3">
                {/* Preventive Maintenance */}
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h5 className="font-medium text-sm text-foreground">Preventive Maintenance (PM)</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tasks done at <strong>fixed intervals</strong> — every week, every month, every 500 hours. 
                    We do them regardless of whether the equipment looks like it needs it. 
                    This is what our <strong>PM Design</strong> section builds.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Examples: Weekly greasing, monthly filter checks, annual overhauls
                  </p>
                </div>
                
                {/* Condition-Based Maintenance */}
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h5 className="font-medium text-sm text-foreground">Condition-Based Maintenance</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tasks done when <strong>equipment condition</strong> reaches a certain point. 
                    We monitor something (pressure, temperature, vibration) and act when it crosses a threshold.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Examples: Replace filter when pressure drop exceeds limit, change oil when analysis shows contamination
                  </p>
                </div>
                
                {/* Predictive Maintenance */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h5 className="font-medium text-sm text-foreground">Predictive Maintenance</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Uses <strong>monitoring technology</strong> to predict when equipment will fail, 
                    so we can fix it just before that happens. This is more advanced and requires specialist tools.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Examples: Vibration analysis, thermal imaging, oil analysis
                  </p>
                </div>
                
                {/* Shutdown Maintenance */}
                <div className="border-l-4 border-amber-500 pl-4 py-2">
                  <h5 className="font-medium text-sm text-foreground">Shutdown Maintenance</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Major planned events where we <strong>stop production</strong> to do comprehensive work 
                    that can't be done while running. These are planned months in advance.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Examples: Annual plant shutdown, crusher reline, mill reline
                  </p>
                </div>
              </div>
            </div>

            {/* Key Characteristics */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="bg-background rounded-md p-4 border border-border">
                <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Key Characteristics</h4>
                <ul className="text-sm space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Scheduled in advance (days, weeks, months)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Parts and tools are ready before we start</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Clear scope — we know what we're doing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Coordinated with operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Aims to prevent failures</span>
                  </li>
                </ul>
              </div>
              <div className="bg-background rounded-md p-4 border border-border">
                <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Real Examples</h4>
                <ul className="text-sm space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Weekly greasing of conveyor bearings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Monthly filter press cloth inspection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Quarterly RCD testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Annual generator load bank test</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Shutdown mill reline</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* In Our System */}
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                In Our System
              </h4>
              <p className="text-sm text-muted-foreground">
                Our <strong>PM Design</strong> section defines all the preventive maintenance tasks — what to check, 
                how often, what tools are needed. When these PMs are due, we raise a <strong>Work Order</strong> with 
                Work Type = "Planned". The PM templates in our system give clear step-by-step instructions so 
                anyone can complete the task correctly.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Other Work Types */}
        <div>
          <h3 className="font-semibold text-foreground text-lg mb-4">Other Terms You'll Hear</h3>
          <p className="text-sm text-muted-foreground mb-4">
            People use different words for maintenance work. Here's how the common terms fit into our two main categories:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Corrective Maintenance */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                Corrective Maintenance
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Work to fix something that's not right. This can be either:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><strong>Planned:</strong> We found a problem during a PM and scheduled a fix for later</li>
                <li><strong>Unplanned:</strong> Same as breakdown — needs fixing now</li>
              </ul>
            </div>

            {/* Modification Work */}
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Modification / Project Work
              </h4>
              <p className="text-sm text-muted-foreground">
                Changing or upgrading equipment — not maintenance. We're improving something, not restoring it. 
                This should be tracked separately from maintenance work.
              </p>
            </div>

            {/* Inspection Work */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Inspection Work
              </h4>
              <p className="text-sm text-muted-foreground">
                Checking equipment condition without doing repairs. Inspections are often part of PMs. 
                If we find a problem, we raise a separate work order to fix it.
              </p>
            </div>

            {/* Statutory / Regulatory */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Statutory Maintenance
              </h4>
              <p className="text-sm text-muted-foreground">
                Legally required inspections (pressure vessels, lifting equipment, electrical testing). 
                These are always planned and must be done on time to stay compliant.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Summary Table */}
        <div className="bg-muted/50 rounded-lg p-5">
          <h3 className="font-semibold text-foreground mb-4">Quick Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium">Work Type</th>
                  <th className="text-left py-2 px-3 font-medium">Category</th>
                  <th className="text-left py-2 px-3 font-medium">What Triggers It</th>
                  <th className="text-left py-2 px-3 font-medium">In Plain English</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-destructive">Breakdown</td>
                  <td className="py-2 px-3">Reactive</td>
                  <td className="py-2 px-3">Equipment failure</td>
                  <td className="py-2 px-3">It broke, fix it now</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-green-600">Preventive (PM)</td>
                  <td className="py-2 px-3">Proactive</td>
                  <td className="py-2 px-3">Calendar or hours</td>
                  <td className="py-2 px-3">Do it every X weeks/months</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-blue-600">Condition-Based</td>
                  <td className="py-2 px-3">Proactive</td>
                  <td className="py-2 px-3">Measurement threshold</td>
                  <td className="py-2 px-3">Do it when readings say so</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-purple-600">Predictive</td>
                  <td className="py-2 px-3">Proactive</td>
                  <td className="py-2 px-3">Monitoring data</td>
                  <td className="py-2 px-3">Do it before it fails</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-amber-600">Shutdown</td>
                  <td className="py-2 px-3">Proactive</td>
                  <td className="py-2 px-3">Planned event</td>
                  <td className="py-2 px-3">Big job, stop everything</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
