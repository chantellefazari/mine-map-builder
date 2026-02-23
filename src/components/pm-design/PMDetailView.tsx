import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Wrench,
  Shield,
  AlertTriangle,
  CheckCircle2,
  FileText,
  HardHat,
  Cog,
  Eye,
  Droplets,
  BookOpen,
} from "lucide-react";
import { PMData } from "./PMFrequencySection";

interface PMDetailViewProps {
  pm: PMData;
  onClose: () => void;
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

export const PMDetailView = ({ pm, onClose }: PMDetailViewProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl">{pm.pmName}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {pm.equipmentType} • {pm.frequency}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={disciplineColors[pm.discipline]}>
                {pm.discipline}
              </Badge>
              <Badge variant="secondary" className={statusColors[pm.status]}>
                {pm.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Purpose & Overview */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                PM Purpose & Scope
              </h3>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                {pm.purpose}
              </p>
            </section>

            <Separator />

            {/* Quick Info Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Duration
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {pm.estimatedDuration}
                </p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  Skill Level
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {pm.skillLevel}
                </p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Cog className="h-3 w-3" />
                  Duty Type
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {pm.dutyType}
                </p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Frequency
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {pm.frequency}
                </p>
              </div>
            </section>

            <Separator />

            {/* Safety Section */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-destructive" />
                Safety & Isolation
              </h3>
              <div className="space-y-3">
                <div className="bg-destructive/5 border border-destructive/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Isolation / LOTO Requirements
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {pm.isolationRequirements}
                  </p>
                </div>
                {pm.safetyNotes.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Safety Notes:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {pm.safetyNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Tools & PPE */}
            <section className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" />
                  Required Tools
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {pm.requiredTools.map((tool, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <HardHat className="h-4 w-4 text-primary" />
                  Required PPE
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {pm.requiredPPE.map((ppe, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      {ppe}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <Separator />

            {/* Task List */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Step-by-Step Tasks
              </h3>
              <div className="space-y-2">
                {pm.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center flex-shrink-0">
                      {task.step}
                    </span>
                    <p className="text-sm text-foreground">{task.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Inspection Points */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Inspection Points
              </h3>
              <div className="space-y-3">
                {pm.inspectionPoints.map((point, i) => (
                  <div key={i} className="border border-border rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-2">
                      {point.item}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {point.checkPoints.map((check, j) => (
                        <span
                          key={j}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {check}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Acceptable Criteria */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Acceptable Condition Criteria
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {pm.acceptableCriteria.map((criteria, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {criteria}
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Signs of Failure */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Signs of Failure
              </h3>
              <div className="flex flex-wrap gap-2">
                {pm.signsOfFailure.map((sign, i) => (
                  <span
                    key={i}
                    className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded"
                  >
                    {sign}
                  </span>
                ))}
              </div>
            </section>

            <Separator />

            {/* Lubrication & OEM */}
            <section className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-primary" />
                  Lubrication / Adjustment
                </h3>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  {pm.lubricationNotes || "N/A - Visual inspection only"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  OEM References / Notes
                </h3>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  {pm.oemReferences || "No OEM references specified"}
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
