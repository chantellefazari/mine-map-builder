import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export const PMStandardsSection = () => {
  const frequencyStandards = [
    {
      discipline: "Mechanical",
      frequencies: ["Daily", "1-week", "2-week", "6-week", "12-week"],
      color: "text-blue-600",
    },
    {
      discipline: "Electrical",
      frequencies: ["1-week", "2-week", "12-week", "24-week", "52-week"],
      color: "text-amber-600",
    },
    {
      discipline: "Mobile Equipment",
      frequencies: ["Daily", "1-week"],
      color: "text-green-600",
    },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-xl">PM Template & Frequency Standards</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Design principles and frequency intervals for preventive maintenance
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Design Principles */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">PM Design Principles</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { rule: "Equipment Type First", desc: "Design PMs for equipment categories, not specific assets" },
              { rule: "Value-Adding Tasks", desc: "Every task must prevent a specific failure mode" },
              { rule: "Inspections Before Intrusive", desc: "Non-intrusive checks more frequent than teardowns" },
              { rule: "Risk-Based Frequency", desc: "Use failure history and criticality, not habit" },
              { rule: "Explicit Isolation", desc: "LOTO requirements stated clearly on every PM" },
              { rule: "Status Workflow", desc: "Draft → Reviewed → Approved before CMMS import" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2 bg-background rounded-md p-3 border border-border">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.rule}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency Standards */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Frequency Standards by Discipline</h4>
          <div className="space-y-3">
            {frequencyStandards.map((item) => (
              <div key={item.discipline} className="bg-background rounded-md p-3 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-medium text-sm ${item.color}`}>{item.discipline}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.frequencies.map((freq) => (
                    <span
                      key={freq}
                      className="text-xs bg-muted px-2 py-1 rounded font-mono"
                    >
                      {freq}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Requirements */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Template Must Include
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Scope and equipment covered</li>
              <li>• Safety warnings and hazard ID</li>
              <li>• Isolation / LOTO requirements</li>
              <li>• Required tools and equipment</li>
              <li>• Step-by-step procedure</li>
              <li>• Inspection checklist with tick-off</li>
              <li>• Sign-off and approval section</li>
            </ul>
          </div>

          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Constraints
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Do NOT copy-paste generic OEM manuals</li>
              <li>• Do NOT create schedules in PM workspace</li>
              <li>• Do NOT link to specific assets here</li>
              <li>• Do NOT skip isolation requirements</li>
              <li>• This is design only, not execution</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
