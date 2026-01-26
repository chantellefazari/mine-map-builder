import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle, Lightbulb, Target, Shield, Info } from "lucide-react";

const principles = [
  {
    icon: Target,
    title: "PMs are created by EQUIPMENT TYPE first",
    description:
      "Design PMs for equipment categories (e.g., Centrifugal Pumps, Belt Conveyors) before linking to specific assets. This ensures consistency and scalability.",
    type: "rule" as const,
  },
  {
    icon: XCircle,
    title: "PMs are NOT linked to specific assets here",
    description:
      "This workspace is for PM design only. Asset linking happens externally in the CMMS (D365/SAP). Keep design separate from execution.",
    type: "constraint" as const,
  },
  {
    icon: AlertCircle,
    title: "Standby equipment may require different PMs",
    description:
      "Duty equipment runs continuously; standby equipment may need readiness checks rather than wear-based inspections. Consider duty type when designing PMs.",
    type: "warning" as const,
  },
  {
    icon: CheckCircle,
    title: "PMs must add value (no OEM copy-paste junk)",
    description:
      "Every PM task should prevent a specific failure mode. Generic OEM recommendations should be tailored to site conditions and actual risk.",
    type: "rule" as const,
  },
  {
    icon: Lightbulb,
    title: "Inspections before intrusive maintenance",
    description:
      "Non-intrusive checks (visual, thermal, vibration) should be scheduled more frequently than intrusive work. Find problems before they cause failures.",
    type: "principle" as const,
  },
  {
    icon: Shield,
    title: "PM frequency must be justified by risk, not habit",
    description:
      "Use failure history, OEM recommendations, and criticality to determine frequency. Weekly is not always better than monthly.",
    type: "principle" as const,
  },
  {
    icon: Info,
    title: "Draft → Reviewed → Approved workflow",
    description:
      "All PMs progress through status stages. Only 'Approved' status PMs should be considered for CMMS import. Draft and Reviewed are for iteration and supervisor review.",
    type: "info" as const,
  },
  {
    icon: AlertCircle,
    title: "Isolation requirements must be explicit",
    description:
      "Every PM template must clearly state isolation and LOTO requirements. No ambiguity on safety-critical steps. If no isolation required, state it explicitly.",
    type: "warning" as const,
  },
];

const typeStyles = {
  rule: "border-l-4 border-l-primary bg-primary/5",
  constraint: "border-l-4 border-l-destructive bg-destructive/5",
  warning: "border-l-4 border-l-amber-500 bg-amber-500/5",
  principle: "border-l-4 border-l-green-600 bg-green-600/5",
  info: "border-l-4 border-l-blue-500 bg-blue-500/5",
};

const iconStyles = {
  rule: "text-primary bg-primary/10",
  constraint: "text-destructive bg-destructive/10",
  warning: "text-amber-600 bg-amber-500/10",
  principle: "text-green-600 bg-green-500/10",
  info: "text-blue-600 bg-blue-500/10",
};

export const PMPrinciples = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          PM Design Principles & Rules
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          These principles guide PM creation to ensure quality, consistency, and value-adding maintenance.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {principles.map((principle, index) => (
            <Card key={index} className={`border-0 ${typeStyles[principle.type]}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconStyles[principle.type]}`}
                  >
                    <principle.icon className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base">{principle.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Constraints Section */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <XCircle className="h-5 w-5 text-destructive" />
          Important Constraints
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold">✕</span>
            Do NOT create schedules in this workspace
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold">✕</span>
            Do NOT create work orders in this workspace
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold">✕</span>
            Do NOT auto-link PMs to specific assets
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive font-bold">✕</span>
            This is a design and planning workspace only
          </li>
        </ul>
      </div>
    </div>
  );
};
