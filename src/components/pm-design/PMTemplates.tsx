import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText } from "lucide-react";

interface PMTemplate {
  id: string;
  name: string;
  equipmentType: string;
  purpose: string;
  preStartChecks: string[];
  isolationRequirements: string;
  tasks: string[];
  inspectionPoints: string[];
  lubricationNotes: string;
  failureSigns: string[];
  closeOutRequirements: string;
}

const initialTemplates: PMTemplate[] = [
  {
    id: "1",
    name: "Centrifugal Pump Inspection",
    equipmentType: "Centrifugal Pump",
    purpose: "Prevent bearing failure and seal leaks through early detection",
    preStartChecks: ["Check lockout status", "Verify pump is isolated", "Check for visible leaks"],
    isolationRequirements: "Electrical isolation required. Drain pump if intrusive work needed.",
    tasks: [
      "Check bearing temperature",
      "Listen for unusual noise",
      "Check seal area for leaks",
      "Inspect coupling alignment",
      "Check foundation bolts",
    ],
    inspectionPoints: ["Bearing housing <70°C", "No visible leaks", "Vibration within limits"],
    lubricationNotes: "Grease bearings per OEM schedule if fitted with grease nipples",
    failureSigns: ["High temperature", "Excessive vibration", "Seal weepage", "Unusual noise"],
    closeOutRequirements: "Record all readings. Report any abnormalities immediately.",
  },
  {
    id: "2",
    name: "Conveyor Belt Inspection",
    equipmentType: "Belt Conveyor",
    purpose: "Prevent belt damage, tracking issues, and spillage",
    preStartChecks: ["Confirm conveyor is stopped", "Verify E-stops are functional", "Wear PPE"],
    isolationRequirements: "Electrical isolation required for all under-belt work.",
    tasks: [
      "Inspect belt surface for damage",
      "Check belt tracking",
      "Inspect idlers for wear and spin",
      "Check pulley lagging",
      "Inspect scrapers and skirts",
    ],
    inspectionPoints: ["No belt damage >50mm", "Belt tracking centered", "All idlers spinning freely"],
    lubricationNotes: "Lubricate take-up bearings if applicable",
    failureSigns: ["Belt mistracking", "Idler seizure", "Material spillage", "Belt edge fraying"],
    closeOutRequirements: "Document all defects with photos. Raise work requests for repairs.",
  },
];

export const PMTemplates = () => {
  const [templates] = useState<PMTemplate[]>(initialTemplates);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Reusable PM templates by equipment type. Not linked to specific assets.
        </p>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Equipment Type: {template.equipmentType}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Purpose</h4>
                <p className="text-sm text-muted-foreground">{template.purpose}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Pre-Start Checks</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {template.preStartChecks.map((check, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span> {check}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Tasks</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {template.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">{i + 1}.</span> {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Isolation / LOTO</h4>
                <p className="text-sm text-muted-foreground">{template.isolationRequirements}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Signs of Failure</h4>
                <div className="flex flex-wrap gap-2">
                  {template.failureSigns.map((sign, i) => (
                    <span
                      key={i}
                      className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded"
                    >
                      {sign}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
