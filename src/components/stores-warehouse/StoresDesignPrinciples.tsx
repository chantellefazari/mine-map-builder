import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Weight, Layers, Wind, Tag, Zap, ArrowRightLeft, AlertTriangle } from "lucide-react";

export const StoresDesignPrinciples = () => {
  const principles = [
    {
      title: "Manual Handling Limit",
      icon: Weight,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      description: "All container-stored items must be ≤15 kg and safely handled by one person without mechanical assistance."
    },
    {
      title: "Electrical / Mechanical Separation",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      description: "Electrical components must be stored separately from mechanical parts to prevent contamination and ensure clean storage conditions."
    },
    {
      title: "Dust Control & Airflow",
      icon: Wind,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
      description: "Electrical and instrumentation containers require dust-controlled environments with adequate ventilation and airflow."
    },
    {
      title: "Clear Labelling & Visibility",
      icon: Tag,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      description: "All storage locations, bins, and shelves must have clear, standardised labels visible from access aisles."
    },
    {
      title: "Fast vs Slow-Moving Separation",
      icon: ArrowRightLeft,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      description: "High-frequency items placed at accessible heights and near entry points. Slow-moving items stored in less accessible areas."
    },
    {
      title: "Safety, Access & Housekeeping",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      description: "Clear walkways, emergency egress, proper lighting, and regular housekeeping schedules. No floor storage blocking access."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Governance Document</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            These rules apply to all future store design decisions. This section does not modify existing data.
          </p>
        </div>
      </div>

      {/* Header Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Stores Design Principles</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Governing rules for TCMG store design and use
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Principles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {principles.map((principle, index) => (
          <Card key={index} className={`border-border ${principle.bgColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <principle.icon className={`w-5 h-5 ${principle.color}`} />
                <h4 className="font-medium text-sm">{principle.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{principle.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Note */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Application of Principles</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All new container setups must comply with these principles</li>
              <li>• Deviations require documented justification and approval</li>
              <li>• Principles inform physical layout, not replace engineering design</li>
              <li>• Regular audits to ensure ongoing compliance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
