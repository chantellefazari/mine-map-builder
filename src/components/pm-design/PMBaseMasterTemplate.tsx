import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { 
  AlertTriangle, 
  Shield, 
  HardHat, 
  Wrench, 
  Eye, 
  MessageSquare,
  Info,
  FileText,
  User,
  Calendar,
  Zap,
  Droplets,
  Wind,
  Thermometer,
  Lock,
  AlertCircle,
  CheckCircle2,
  Skull,
  Cog,
  Volume2,
  Flame,
  Weight,
  CircleDot,
  MoveHorizontal,
  Hand,
  Car
} from "lucide-react";

interface Hazard {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const hazardsList: Hazard[] = [
  { id: "electrical", icon: <Zap className="w-4 h-4" />, label: "Electrical" },
  { id: "hydraulic", icon: <Droplets className="w-4 h-4" />, label: "Hydraulic" },
  { id: "pneumatic", icon: <Wind className="w-4 h-4" />, label: "Pneumatic" },
  { id: "thermal", icon: <Thermometer className="w-4 h-4" />, label: "Thermal" },
  { id: "cyanide", icon: <Skull className="w-4 h-4" />, label: "Cyanide" },
  { id: "mechanical", icon: <Cog className="w-4 h-4" />, label: "Mechanical" },
  { id: "noise", icon: <Volume2 className="w-4 h-4" />, label: "Noise" },
  { id: "fire", icon: <Flame className="w-4 h-4" />, label: "Fire" },
  { id: "gravity", icon: <Weight className="w-4 h-4" />, label: "Gravity" },
  { id: "pressure", icon: <CircleDot className="w-4 h-4" />, label: "Pressure" },
  { id: "pinch-points", icon: <MoveHorizontal className="w-4 h-4" />, label: "Pinch Points" },
  { id: "manual-handling", icon: <Hand className="w-4 h-4" />, label: "Manual Handling" },
  { id: "mobile-equipment", icon: <Car className="w-4 h-4" />, label: "Mobile Equipment" },
];

export const PMBaseMasterTemplate = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards(prev => 
      prev.includes(hazardId) 
        ? prev.filter(id => id !== hazardId)
        : [...prev, hazardId]
    );
  };

  return (
    <div className="p-6 bg-background min-h-full overflow-auto">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">MASTER</Badge>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">Template</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Base PM Template</h1>
          <p className="text-muted-foreground">
            This is the master template structure. All PMs will inherit from this template.
          </p>
        </div>

        {/* Document Container */}
        <div className="border-2 border-border bg-card">
          {/* Title Banner */}
          <div className="bg-primary text-primary-foreground px-6 py-4 text-center">
            <h1 className="text-xl font-bold tracking-wide">[Project/Site Name] - [Equipment Area]</h1>
            <p className="text-sm mt-1 opacity-90">[Discipline] [PM Mode] PMs - [Frequency] [PM Type]</p>
          </div>

          {/* Header Information Grid */}
          <div className="grid grid-cols-2 border-b border-border text-xs">
            {/* Left Column */}
            <div className="border-r border-border">
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-primary" />
                  Project / Site:
                </div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[To be defined]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[XX]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area Desc.:</div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Area Description]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr]">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                  <User className="w-3 h-3 text-primary" />
                  Resource/s:
                </div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Xx Trade (X hrs)]</div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="grid grid-cols-[80px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Mech/Elec/Ops]</div>
              </div>
              <div className="grid grid-cols-[80px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Inspection/Service]</div>
              </div>
              <div className="grid grid-cols-[80px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-primary" />
                  Frequency:
                </div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Daily/1W/2W/6W/12W]</div>
              </div>
              <div className="grid grid-cols-[80px_1fr]">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
                <div className="px-2 py-1.5"></div>
              </div>
            </div>
          </div>

          {/* PREPARATION AND INFORMATION Section */}
          <div className="border-b border-border">
            <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              PREPARATION AND INFORMATION
            </div>
            
            {/* Scope */}
            <div className="border-b border-border">
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                SCOPE
              </div>
              <div className="px-4 py-3 text-sm leading-relaxed">
                <p className="font-medium mb-2 text-muted-foreground italic">[Frequency] [PM Mode] Area Inspection – [Equipment Area]</p>
                <p className="text-muted-foreground italic">
                  To safely carry out [discipline] [pm type] for signs of damage or potential failures that may require maintenance attention.
                </p>
              </div>
            </div>

            {/* Safety Section */}
            <div className="border-b border-border">
              <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <Shield className="w-5 h-5 text-destructive" />
                <span className="text-destructive font-bold">SAFETY</span>
              </div>
              <div className="px-4 py-4 bg-destructive/5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    Before commencing this work complete a <span className="font-bold text-destructive">TAKE 5</span> every time to check that no abnormal conditions exist.
                  </p>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <HardHat className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Always wear the correct PPE. Cyanide monitor to be carried in plant areas where signed.
                  </p>
                </div>
                <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-destructive">
                    NOTE: Always assume the equipment is LIVE until positively isolated, locked and tagged.
                  </p>
                </div>
              </div>
            </div>

            {/* Hazard Identification */}
            <div className="border-b border-border">
              <div className="bg-amber-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span className="text-amber-700 font-bold">HAZARD IDENTIFICATION</span>
                <span className="text-xs text-muted-foreground ml-2">(Select all that apply)</span>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {hazardsList.map((hazard) => (
                    <Toggle
                      key={hazard.id}
                      pressed={selectedHazards.includes(hazard.id)}
                      onPressedChange={() => toggleHazard(hazard.id)}
                      className="data-[state=on]:bg-amber-500 data-[state=on]:text-white border border-border px-3 py-2 gap-2"
                      aria-label={`Toggle ${hazard.label} hazard`}
                    >
                      {hazard.icon}
                      <span className="text-sm font-medium">{hazard.label}</span>
                    </Toggle>
                  ))}
                </div>
              </div>
            </div>

            {/* Isolation Requirements */}
            <div className="border-b border-border">
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                ISOLATION / LOTO REQUIREMENTS
              </div>
              <div className="p-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-3 py-2 text-left font-medium w-[30%]">Isolation Type</th>
                      <th className="border border-border px-3 py-2 text-center font-medium w-[15%]">Required</th>
                      <th className="border border-border px-3 py-2 text-left font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium">Electrical Isolation</td>
                      <td className="border border-border px-3 py-2 text-center">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-300">If Required</Badge>
                      </td>
                      <td className="border border-border px-3 py-2 text-muted-foreground italic">[Define when isolation is needed]</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium">Mechanical Isolation</td>
                      <td className="border border-border px-3 py-2 text-center">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-300">If Required</Badge>
                      </td>
                      <td className="border border-border px-3 py-2 text-muted-foreground italic">[Define when isolation is needed]</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium">Pneumatic Isolation</td>
                      <td className="border border-border px-3 py-2 text-center">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-300">If Required</Badge>
                      </td>
                      <td className="border border-border px-3 py-2 text-muted-foreground italic">[Define when isolation is needed]</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium">Lock-Out / Tag-Out</td>
                      <td className="border border-border px-3 py-2 text-center">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-300">If Required</Badge>
                      </td>
                      <td className="border border-border px-3 py-2 text-muted-foreground italic">[Apply personal lock when isolation is in place]</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tools and PPE Section - Side by Side */}
          <div className="border-b border-border grid md:grid-cols-2">
            {/* Required Tools */}
            <div className="border-r border-border">
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" />
                REQUIRED TOOLS & EQUIPMENT
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Checkbox id="tool-1" />
                    <label htmlFor="tool-1" className="text-sm">Standard Tool Kit</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="tool-2" />
                    <label htmlFor="tool-2" className="text-sm">Torch/Flashlight</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="tool-3" />
                    <label htmlFor="tool-3" className="text-sm text-muted-foreground italic">[PM-specific tools...]</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Required PPE */}
            <div>
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <HardHat className="w-4 h-4 text-primary" />
                REQUIRED PPE
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Checkbox id="ppe-1" />
                    <label htmlFor="ppe-1" className="text-sm">Hard Hat</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="ppe-2" />
                    <label htmlFor="ppe-2" className="text-sm">Safety Glasses</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="ppe-3" />
                    <label htmlFor="ppe-3" className="text-sm">Safety Boots</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="ppe-4" />
                    <label htmlFor="ppe-4" className="text-sm">Hi-Vis Clothing</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="ppe-5" />
                    <label htmlFor="ppe-5" className="text-sm">Gloves</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="ppe-6" />
                    <label htmlFor="ppe-6" className="text-sm">Cyanide Monitor</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="ppe-7" />
                    <label htmlFor="ppe-7" className="text-sm text-muted-foreground italic">[PM-specific PPE...]</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Start Checks */}
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              PRE-START CHECKS
            </div>
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Checkbox id="pre-1" />
                    <label htmlFor="pre-1" className="text-sm">TAKE 5 completed</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="pre-2" />
                    <label htmlFor="pre-2" className="text-sm">Competent to perform this task</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="pre-3" />
                    <label htmlFor="pre-3" className="text-sm">Correct PPE available and worn</label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Checkbox id="pre-4" />
                    <label htmlFor="pre-4" className="text-sm">Tools and equipment available</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="pre-5" />
                    <label htmlFor="pre-5" className="text-sm">Area safe to proceed</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="pre-6" />
                    <label htmlFor="pre-6" className="text-sm">Permits/isolations in place (if required)</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Procedure */}
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              PROCEDURE
            </div>
            <div className="p-4 text-sm space-y-2">
              <div className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>Conduct pre-start checks and ensure all PPE is worn correctly.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>Walk the equipment area and complete the inspection checklist.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>Record any defects in the comments column and mark as "Defective".</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>If urgent attention is required, mark appropriately and notify Supervisor immediately.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">5.</span>
                <span>Raise corrective work orders for any defects identified.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">6.</span>
                <span>Complete sign-off section upon completion.</span>
              </div>
            </div>
          </div>

          {/* Inspection Tasks Placeholder */}
          <div className="border-b border-border">
            <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              INSPECTION CHECKLIST
            </div>
            <div className="p-8 text-center">
              <div className="border-2 border-dashed border-border rounded-lg p-8">
                <Eye className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium mb-2">Inspection Tasks</p>
                <p className="text-sm text-muted-foreground">
                  Equipment-specific inspection tasks will be defined here.<br />
                  Tasks are grouped by equipment ID with serviceable/defective status columns.
                </p>
              </div>
            </div>
          </div>

          {/* Comments Placeholder */}
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              COMMENTS
            </div>
            <div className="p-4">
              <div className="bg-muted/30 rounded border border-border p-4 min-h-[80px]">
                <p className="text-sm text-muted-foreground italic">Space for technician notes and observations...</p>
              </div>
            </div>
          </div>

          {/* Sign-off & Approval Placeholder */}
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              SIGN-OFF & APPROVAL
            </div>
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm font-medium mb-3">Completed By</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Name</p>
                      <div className="border-b border-border h-6"></div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Signature</p>
                      <div className="border-b border-border h-6"></div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <div className="border-b border-border h-6"></div>
                    </div>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm font-medium mb-3">Supervisor Approval</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Name</p>
                      <div className="border-b border-border h-6"></div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Signature</p>
                      <div className="border-b border-border h-6"></div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <div className="border-b border-border h-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revision History */}
          <div>
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
              REVISION HISTORY
            </div>
            <div className="p-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border px-3 py-2 text-left font-medium w-16">Rev</th>
                    <th className="border border-border px-3 py-2 text-left font-medium w-28">Date</th>
                    <th className="border border-border px-3 py-2 text-left font-medium">Description of Change</th>
                    <th className="border border-border px-3 py-2 text-left font-medium w-32">Author</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-3 py-2">0</td>
                    <td className="border border-border px-3 py-2 text-muted-foreground italic">[Date]</td>
                    <td className="border border-border px-3 py-2">Initial Release</td>
                    <td className="border border-border px-3 py-2 text-muted-foreground italic">[Author]</td>
                  </tr>
                </tbody>
              </table>
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
