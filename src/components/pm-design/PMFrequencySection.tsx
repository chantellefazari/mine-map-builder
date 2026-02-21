import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, ChevronUp, FileText, Clock, Wrench, Shield } from "lucide-react";
import { PMDetailView } from "./PMDetailView";

export interface PMTask {
  id: string;
  step: number;
  description: string;
}

export interface PMInspectionPoint {
  item: string;
  checkPoints: string[];
}

export interface PMData {
  id: string;
  pmName: string;
  equipmentType: string;
  frequency: "Daily" | "1 Week" | "2 Week" | "6 Week" | "12 Week";
  purpose: string;
  discipline: "Mechanical" | "Electrical" | "Ops";
  dutyType: "Duty" | "Standby" | "Both";
  estimatedDuration: string;
  skillLevel: string;
  requiredTools: string[];
  requiredPPE: string[];
  isolationRequirements: string;
  safetyNotes: string[];
  tasks: PMTask[];
  inspectionPoints: PMInspectionPoint[];
  acceptableCriteria: string[];
  signsOfFailure: string[];
  lubricationNotes: string;
  oemReferences: string;
  status: "Draft" | "Reviewed" | "Approved";
}

interface PMFrequencySectionProps {
  frequency: "Daily" | "1 Week" | "2 Week" | "6 Week" | "12 Week";
  frequencyLabel: string;
  pms: PMData[];
  onAddPM: () => void;
}

const statusColors = {
  Draft: "bg-muted text-muted-foreground",
  Reviewed: "bg-primary/20 text-primary",
  Approved: "bg-green-500/20 text-green-700",
};

const disciplineColors = {
  Mechanical: "bg-blue-500/20 text-blue-700",
  Electrical: "bg-amber-500/20 text-amber-700",
  Ops: "bg-purple-500/20 text-purple-700",
};

export const PMFrequencySection = ({
  frequency,
  frequencyLabel,
  pms,
  onAddPM,
}: PMFrequencySectionProps) => {
  const [expandedPM, setExpandedPM] = useState<string | null>(null);
  const [selectedPM, setSelectedPM] = useState<PMData | null>(null);

  const toggleExpand = (pmId: string) => {
    setExpandedPM(expandedPM === pmId ? null : pmId);
  };

  return (
    <>
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{frequencyLabel}</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {pms.length} PM{pms.length !== 1 ? "s" : ""} defined
                </p>
              </div>
            </div>
            <Button size="sm" className="gap-2" onClick={onAddPM}>
              <Plus className="h-4 w-4" />
              Add PM
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {pms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
              No PMs defined for this frequency yet.
            </div>
          ) : (
            pms.map((pm) => (
              <div
                key={pm.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 bg-card hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedPM(pm)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-foreground">
                          {pm.pmName}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={statusColors[pm.status]}
                        >
                          {pm.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pm.equipmentType} • {pm.discipline}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {pm.purpose}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={disciplineColors[pm.discipline]}
                      >
                        {pm.discipline}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(pm.id);
                        }}
                      >
                        {expandedPM === pm.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Quick Info Row */}
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {pm.estimatedDuration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      {pm.skillLevel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {pm.dutyType}
                    </span>
                  </div>
                </div>

                {/* Expanded Preview */}
                {expandedPM === pm.id && (
                  <div className="border-t border-border p-4 bg-muted/20 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          Key Tasks
                        </h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {pm.tasks.slice(0, 3).map((task) => (
                            <li key={task.id} className="flex items-start gap-2">
                              <span className="text-primary font-medium">
                                {task.step}.
                              </span>
                              <span className="line-clamp-1">
                                {task.description}
                              </span>
                            </li>
                          ))}
                          {pm.tasks.length > 3 && (
                            <li className="text-primary text-xs">
                              +{pm.tasks.length - 3} more tasks...
                            </li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-foreground mb-2">
                          Required Tools
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {pm.requiredTools.join(", ")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedPM(pm)}
                    >
                      View Full PM Details
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* PM Detail Modal */}
      {selectedPM && (
        <PMDetailView pm={selectedPM} onClose={() => setSelectedPM(null)} />
      )}
    </>
  );
};
