import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

const principles = [
  {
    title: "Equipment Type First",
    description:
      "PMs are created by equipment type (Pump, Conveyor, Screen, etc.), not by specific asset. This ensures consistency and reusability across similar equipment.",
    icon: CheckCircle,
    type: "rule",
  },
  {
    title: "No Asset Linking Here",
    description:
      "PMs in this workspace are NOT linked to specific assets. Asset-to-PM mapping happens externally in the CMMS/D365 system.",
    icon: AlertCircle,
    type: "warning",
  },
  {
    title: "Standby Equipment Consideration",
    description:
      "Standby equipment may require different PM strategies. Consider reduced frequency or condition-based triggers for equipment that runs infrequently.",
    icon: Info,
    type: "info",
  },
  {
    title: "Value-Adding PMs Only",
    description:
      "Every PM must prevent a specific failure mode or add measurable value. No OEM copy-paste junk. If a task doesn't prevent failure, question its inclusion.",
    icon: CheckCircle,
    type: "rule",
  },
  {
    title: "Trigger Type Selection",
    description:
      "Choose the right trigger: Time-based for predictable wear, Runtime-based for operating hour dependent items, Condition-based for items where monitoring is practical.",
    icon: Info,
    type: "info",
  },
  {
    title: "Skill Level Matching",
    description:
      "Assign appropriate skill levels. Operators can perform visual inspections. Fitters/Electricians for technical tasks. Specialists for complex diagnostics.",
    icon: CheckCircle,
    type: "rule",
  },
  {
    title: "Draft → Reviewed → Final",
    description:
      "All PMs progress through status stages. Only 'Final' status PMs should be considered for CMMS import. Draft and Reviewed are for iteration.",
    icon: Info,
    type: "info",
  },
  {
    title: "Isolation Requirements",
    description:
      "Every PM template must clearly state isolation and LOTO requirements. No ambiguity on safety-critical steps.",
    icon: AlertCircle,
    type: "warning",
  },
];

const iconStyles = {
  rule: "text-green-600 bg-green-500/10",
  warning: "text-amber-600 bg-amber-500/10",
  info: "text-primary bg-primary/10",
};

export const PMPrinciples = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          PM Design Principles
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          These principles guide PM creation to ensure quality, consistency, and maintainability.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {principles.map((principle, index) => (
            <Card key={index} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconStyles[principle.type]}`}
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
    </div>
  );
};
