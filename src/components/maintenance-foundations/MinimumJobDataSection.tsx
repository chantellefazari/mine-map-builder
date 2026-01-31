import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2 } from "lucide-react";

export const MinimumJobDataSection = () => {
  const jobFields = [
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
  ];

  return (
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
  );
};
