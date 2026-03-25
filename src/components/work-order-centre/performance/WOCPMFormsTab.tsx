import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, FileText, AlertTriangle, Camera } from "lucide-react";

export function WOCPMFormsTab() {
  const placeholders = [
    {
      icon: ClipboardCheck,
      label: "PM Templates",
      desc: "Standardised inspection checklists linked to assets",
    },
    {
      icon: FileText,
      label: "Completed PM Records",
      desc: "Historical checklist results and condition data",
    },
    {
      icon: AlertTriangle,
      label: "Defects Identified",
      desc: "Issues found during PMs with linked follow-up WOs",
    },
    {
      icon: Camera,
      label: "Photos & Notes",
      desc: "Field evidence attached to inspection records",
    },
  ];

  return (
    <div className="space-y-4 mt-2">
      <p className="text-xs text-muted-foreground">
        PM inspection data storage and review. Field crews complete checklists
        and condition readings here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {placeholders.map((p) => (
          <Card key={p.label} className="border-border">
            <CardContent className="p-5 flex flex-col items-center text-center gap-2">
              <p.icon className="w-8 h-8 text-muted-foreground" />
              <p className="text-xs font-semibold text-foreground">{p.label}</p>
              <p className="text-[10px] text-muted-foreground leading-snug">{p.desc}</p>
              <Badge variant="secondary" className="text-[9px] mt-1">
                Coming Soon
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
