import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  TrendingUp,
  Zap,
  Wrench,
  Calendar,
  Target,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Shield
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
              <span className="text-sm">Compare ourselves to industry benchmarks</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Identify where to focus improvement efforts</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Report consistently to management</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 italic">
            These definitions are the foundation of everything that follows in this system.
          </p>
        </div>

        <Separator />

        {/* The Two Fundamental Categories */}
        <div>
          <h3 className="font-semibold text-foreground text-lg mb-3">The Two Fundamental Categories</h3>
          <p className="text-sm text-muted-foreground mb-4">
            All maintenance work falls into one of two categories: <strong>Reactive</strong> (we respond to a problem) 
            or <strong>Proactive</strong> (we prevent a problem). Understanding this distinction is critical.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 text-destructive mx-auto mb-2" />
              <h4 className="font-semibold text-foreground">Reactive Maintenance</h4>
              <p className="text-xs text-muted-foreground mt-1">Responding to failures after they occur</p>
              <p className="text-xs text-destructive mt-2 font-medium">Goal: Minimise this</p>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-foreground">Proactive Maintenance</h4>
              <p className="text-xs text-muted-foreground mt-1">Preventing failures before they occur</p>
              <p className="text-xs text-green-600 mt-2 font-medium">Goal: Maximise this</p>
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
                Definition
              </h4>
              <p className="text-sm text-muted-foreground">
                Breakdown work is <strong>unplanned maintenance</strong> performed in response to equipment failure 
                or imminent failure. The equipment has stopped working, is working incorrectly, or poses an 
                immediate safety or environmental risk if not addressed.
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
                  <span>Equipment fails unexpectedly during operation</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span>Operator notices abnormal behaviour (noise, vibration, leaks, alarms)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span>Safety system trips and requires investigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span>Environmental incident requires immediate action</span>
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
                    <span>Unscheduled and urgent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Equipment has already failed or is failing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Requires immediate or priority response</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Often disrupts production schedules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Parts may not be readily available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>May require overtime or call-outs</span>
                  </li>
                </ul>
              </div>
              <div className="bg-background rounded-md p-4 border border-border">
                <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Real Examples</h4>
                <ul className="text-sm space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Pump seal failure causing product leak</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Motor trip due to overload protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Conveyor belt tear stopping material flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Instrument malfunction giving false readings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Gearbox failure with visible damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Electrical fault causing power loss</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Impact */}
            <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/30">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-destructive" />
                Why Breakdown Work is Costly
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Industry studies consistently show that breakdown maintenance costs <strong>3-5 times more</strong> than 
                planned maintenance for the same repair. This is because:
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                <ul className="text-sm space-y-1">
                  <li>• Production is lost during unplanned downtime</li>
                  <li>• Overtime and call-out costs increase</li>
                  <li>• Emergency freight for parts is expensive</li>
                </ul>
                <ul className="text-sm space-y-1">
                  <li>• Secondary damage often occurs</li>
                  <li>• Safety risks are higher in rushed repairs</li>
                  <li>• Quality of repair may be compromised</li>
                </ul>
              </div>
            </div>

            {/* Target */}
            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-600" />
                Industry Target
              </h4>
              <p className="text-sm text-muted-foreground">
                Best-practice sites target <strong>less than 20%</strong> of total maintenance work hours on breakdowns. 
                World-class operations achieve <strong>less than 10%</strong>. If your breakdown percentage is higher, 
                it indicates opportunities to improve preventive maintenance or address chronic equipment issues.
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
                Definition
              </h4>
              <p className="text-sm text-muted-foreground">
                Planned maintenance is <strong>scheduled work</strong> designed to prevent equipment failure, 
                maintain optimal performance, and extend asset life. The work is identified in advance, 
                resources are pre-arranged, and it is executed at a time that minimises operational impact.
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
                    Time-based or usage-based tasks performed at fixed intervals regardless of equipment condition. 
                    Examples: oil changes every 500 hours, belt inspections every week, filter replacements every month.
                  </p>
                </div>
                
                {/* Condition-Based Maintenance */}
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h5 className="font-medium text-sm text-foreground">Condition-Based Maintenance (CBM)</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tasks triggered when equipment condition reaches a defined threshold. 
                    Examples: replace bearings when vibration exceeds limits, clean filters when differential pressure rises.
                  </p>
                </div>
                
                {/* Predictive Maintenance */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h5 className="font-medium text-sm text-foreground">Predictive Maintenance (PdM)</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Uses monitoring technology to predict when failure will occur and schedule intervention before it happens. 
                    Examples: vibration analysis, thermography, oil analysis, ultrasonic testing.
                  </p>
                </div>
                
                {/* Shutdown Maintenance */}
                <div className="border-l-4 border-amber-500 pl-4 py-2">
                  <h5 className="font-medium text-sm text-foreground">Shutdown / Turnaround Maintenance</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    Major planned events where equipment is taken offline for comprehensive maintenance, inspections, 
                    or modifications. These are planned months in advance with detailed scopes.
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
                    <span>Scheduled in advance (days, weeks, or months)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Resources pre-arranged (parts, tools, labour)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Clear scope and procedures defined</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Coordinated with operations for minimal disruption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Safety planning completed before work starts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Aims to prevent failures, not react to them</span>
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
                    <span>Quarterly vibration analysis on critical pumps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Annual generator load bank testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Shutdown overhaul of crushing circuit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Calibration of safety instruments</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Benefits of Planned Maintenance
              </h4>
              <div className="grid gap-2 md:grid-cols-2">
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Reduced unplanned downtime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Lower overall maintenance costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Extended equipment life</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Improved safety performance</span>
                  </li>
                </ul>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Better spare parts management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>More predictable resource requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Higher equipment reliability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Better quality of repairs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Target */}
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Industry Target
              </h4>
              <p className="text-sm text-muted-foreground">
                Best-practice sites aim for <strong>80% or more</strong> of maintenance work hours to be planned. 
                This includes preventive, predictive, and scheduled corrective work. The remaining time covers 
                unavoidable breakdowns and urgent work.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Other Work Types */}
        <div>
          <h3 className="font-semibold text-foreground text-lg mb-4">Other Work Types You May Encounter</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Beyond breakdown and planned maintenance, you will see these terms used on site. Understanding 
            how they relate to the two fundamental categories helps with consistent classification.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Corrective Maintenance */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                Corrective Maintenance
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Work to restore equipment to proper operating condition. This can be either:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><strong>Planned Corrective:</strong> Defect found during PM, scheduled for later</li>
                <li><strong>Unplanned Corrective:</strong> Same as breakdown (immediate response)</li>
              </ul>
            </div>

            {/* Modification Work */}
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Modification / Project Work
              </h4>
              <p className="text-sm text-muted-foreground">
                Changes to equipment design, capacity, or configuration. This is not maintenance 
                (restoring to original condition) but improvement work. Should be tracked separately from 
                maintenance metrics.
              </p>
            </div>

            {/* Inspection Work */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Inspection Work
              </h4>
              <p className="text-sm text-muted-foreground">
                Checking equipment condition without making repairs. Inspections may be part of a PM 
                or standalone tasks. They often identify defects that become planned corrective work.
              </p>
            </div>

            {/* Statutory / Regulatory */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Statutory / Regulatory Maintenance
              </h4>
              <p className="text-sm text-muted-foreground">
                Legally required inspections and maintenance (e.g., pressure vessel inspections, 
                lifting equipment certifications). These are always planned and must be completed on time.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Summary Table */}
        <div className="bg-muted/50 rounded-lg p-5">
          <h3 className="font-semibold text-foreground mb-4">Quick Reference Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium">Work Type</th>
                  <th className="text-left py-2 px-3 font-medium">Category</th>
                  <th className="text-left py-2 px-3 font-medium">Trigger</th>
                  <th className="text-left py-2 px-3 font-medium">Goal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-destructive">Breakdown</td>
                  <td className="py-2 px-3">Reactive</td>
                  <td className="py-2 px-3">Equipment failure</td>
                  <td className="py-2 px-3">Restore operation ASAP</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-green-600">Preventive (PM)</td>
                  <td className="py-2 px-3">Proactive</td>
                  <td className="py-2 px-3">Time/usage interval</td>
                  <td className="py-2 px-3">Prevent failures</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-blue-600">Condition-Based</td>
                  <td className="py-2 px-3">Proactive</td>
                  <td className="py-2 px-3">Condition threshold</td>
                  <td className="py-2 px-3">Optimise timing</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-purple-600">Predictive</td>
                  <td className="py-2 px-3">Proactive</td>
                  <td className="py-2 px-3">Monitoring data</td>
                  <td className="py-2 px-3">Predict failures</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-amber-600">Shutdown</td>
                  <td className="py-2 px-3">Proactive</td>
                  <td className="py-2 px-3">Planned event</td>
                  <td className="py-2 px-3">Major overhauls</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
