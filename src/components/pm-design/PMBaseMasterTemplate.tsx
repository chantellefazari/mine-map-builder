import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Shield, 
  HardHat, 
  Wrench, 
  Eye, 
  MessageSquare,
  Info
} from "lucide-react";

export const PMBaseMasterTemplate = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">MASTER</Badge>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">Template</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Base PM Template</h1>
          <p className="text-muted-foreground">
            This is the master template structure. All PMs will inherit from this template.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Template Structure Only</p>
            <p className="text-muted-foreground">
              This template defines the sections and structure for all PMs. Individual tasks and criteria 
              will be defined when creating specific PMs for each equipment type.
            </p>
          </div>
        </div>

        {/* Template Sections */}
        <div className="space-y-4">
          
          {/* Section 1: PM Header */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-foreground/10 flex items-center justify-center text-sm font-bold text-foreground">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground">PM Header</h3>
                <p className="text-xs text-muted-foreground">Title, Equipment Type, Frequency, Discipline</p>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-muted/30 rounded p-3">
                  <p className="text-xs text-muted-foreground mb-1">PM Title</p>
                  <p className="text-muted-foreground italic">[To be defined]</p>
                </div>
                <div className="bg-muted/30 rounded p-3">
                  <p className="text-xs text-muted-foreground mb-1">Equipment Type</p>
                  <p className="text-muted-foreground italic">[To be defined]</p>
                </div>
                <div className="bg-muted/30 rounded p-3">
                  <p className="text-xs text-muted-foreground mb-1">Frequency</p>
                  <p className="text-muted-foreground italic">[1/2/6/12 Week]</p>
                </div>
                <div className="bg-muted/30 rounded p-3">
                  <p className="text-xs text-muted-foreground mb-1">Discipline</p>
                  <p className="text-muted-foreground italic">[Mech/Elec/Ops]</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Safety & Isolation */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-destructive/10 px-4 py-3 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Safety & Isolation</h3>
                <p className="text-xs text-muted-foreground">LOTO, Hazards, Permits, E-Stops</p>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-muted-foreground">Required Isolations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-muted-foreground">Lock-Out / Tag-Out</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-muted-foreground">Stored Energy Hazards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-muted-foreground">Environmental Hazards</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Specific hazards and isolation requirements defined per PM
              </p>
            </div>
          </div>

          {/* Section 3: Tools & PPE */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-primary/10 px-4 py-3 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Tools & PPE</h3>
                <p className="text-xs text-muted-foreground">Required equipment and personal protection</p>
              </div>
            </div>
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm text-foreground">Required Tools</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Standard Tool Kit</li>
                    <li>• Torque Wrench (if required)</li>
                    <li>• Grease Gun</li>
                    <li>• Multimeter</li>
                    <li className="italic">+ PM-specific tools</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <HardHat className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm text-foreground">Required PPE</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Hard Hat</li>
                    <li>• Safety Glasses</li>
                    <li>• Gloves</li>
                    <li>• Steel Cap Boots</li>
                    <li className="italic">+ PM-specific PPE</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Inspection Tasks */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-foreground/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Inspection Tasks</h3>
                <p className="text-xs text-muted-foreground">Visual checks, measurements, operational tests</p>
              </div>
            </div>
            <div className="p-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Eye className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Inspection tasks will be defined for each specific PM
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes: Pre-start checks, Visual inspections, Mechanical tasks, Electrical tasks
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Comments & Notes */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-foreground/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Comments & Notes</h3>
                <p className="text-xs text-muted-foreground">Findings, issues, follow-up actions</p>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-muted/30 rounded-lg p-4 min-h-[80px]">
                <p className="text-sm text-muted-foreground italic">
                  Space for technician notes, recorded findings, and follow-up items
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <Separator className="my-8" />
        <div className="text-center text-sm text-muted-foreground">
          <p>This template is the foundation for all PM work instructions.</p>
          <p className="mt-1">Create specific PMs by selecting a frequency group from the sidebar.</p>
        </div>
      </div>
    </div>
  );
};
