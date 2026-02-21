import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Shield, 
  HardHat,
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Wrench,
  Eye,
  Zap,
  AlertCircle,
  CheckCircle2,
  Info,
  Cog,
  CircleDot,
  Droplets
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface InspectionTask {
  task: string;
  hasInput?: boolean;
  inputLabel?: string;
}

interface EquipmentSection {
  equipmentId: string;
  equipmentName: string;
  tasks: InspectionTask[];
}

interface Hazard {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const hazardsList: Hazard[] = [
  { id: "chemical", icon: <Droplets className="w-4 h-4" />, label: "Chemical" },
  { id: "pressure", icon: <CircleDot className="w-4 h-4" />, label: "Pressure" },
  { id: "mechanical", icon: <Cog className="w-4 h-4" />, label: "Mechanical" },
];

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "UTL-PW",
    equipmentName: "Potable Water System",
    tasks: [
      { task: "Inspect Potable Water Filter Housings" },
      { task: "Inspect Cartridge Filter" },
      { task: "Record Date of Cartridge Filter Install", hasInput: true, inputLabel: "Install Date: _______" },
      { task: "Inspect UV Light (Functioning or Not)" },
      { task: "Inspect and Record Potable Water Level in Potable Water Tank", hasInput: true, inputLabel: "Level: _______%" },
      { task: "Inspect Pipework/Valving for Damage or Leaks" },
      { task: "Inspect Potable Pump" },
    ]
  },
];

export const PotableWaterPMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards(prev => 
      prev.includes(hazardId) 
        ? prev.filter(id => id !== hazardId)
        : [...prev, hazardId]
    );
  };

  return (
    <div className="bg-background min-h-full">
      {/* Document Header */}
      <div className="border-2 border-border">
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          {/* Logo on left side of black section */}
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          {/* Title on the black section - centered */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek - Admin Potable Water</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Running PMs - Weekly Inspection (Fitter)</p>
            </div>
          </div>
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
              <div className="px-2 py-1.5">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area Desc.:</div>
              <div className="px-2 py-1.5">Admin Potable Water System</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Fitter (2 hrs)</div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Mechanical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Inspection (Fitter)</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">Weekly</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
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
              <p className="font-medium mb-2">Weekly Running Area Inspection – Admin Potable Water System</p>
              <p className="text-muted-foreground">
                To safely carry out mechanical inspection for signs of damage or potential failures that may require maintenance attention.
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
                  Always wear the correct PPE. Isolate equipment where required.
                </p>
              </div>
              <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                <Zap className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-destructive">
                  NOTE: Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.
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

        </div>

        {/* Tools and PPE Section - Side by Side */}
        <div className="border-b border-border grid md:grid-cols-2">
          {/* Required Tools */}
          <div className="border-r border-border">
            <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              SPECIAL TOOLING REQUIRED
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Standard Tool Kit</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Torch / Flashlight</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Required PPE */}
          <div>
            <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <HardHat className="w-4 h-4 text-primary" />
              REQUIRED PPE
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Steel Cap Boots</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Hard Hat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Safety Glasses</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pre-Start Checks */}
        <div className="border-b border-border">
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">RISK ASSESSMENT</span>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3">Complete one of the following before starting work:</p>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>Take 5</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>JHA</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>SWMS</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>Other</span>
              </label>
            </div>
          </div>
        </div>

        {/* Procedure Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            PROCEDURE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed space-y-3">
            <div className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <p>Conduct area inspection as per tables below. Record each check with a tick in the appropriate box.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p>When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <p>If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-300 rounded p-3 mt-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 font-medium text-xs">
                NOTE: This is a visual inspection only, the equipment may be live. Exercise caution.
              </p>
            </div>
          </div>
        </div>

        {/* Inspections Header */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          INSPECTIONS
        </div>

        {/* Inspection Table */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-left font-semibold w-[50%]">Task</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✓</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✗</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th>
            </tr>
          </thead>
          <tbody>
            {inspectionData.map((section, sectionIndex) => (
              <>
                {/* Equipment Header Row */}
                <tr key={`section-${sectionIndex}`} className="bg-muted/50">
                  <td colSpan={4} className="border border-border px-3 py-2 font-bold text-primary">
                    {section.equipmentId} - {section.equipmentName}
                  </td>
                </tr>
                {/* Task Rows */}
                {section.tasks.map((task, taskIndex) => (
                  <tr key={`task-${sectionIndex}-${taskIndex}`} className="hover:bg-muted/30">
                    <td className="border border-border px-3 py-2">{task.task}</td>
                    <td className="border border-border px-2 py-2 text-center">
                      <div className="flex justify-center">
                        <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                      </div>
                    </td>
                    <td className="border border-border px-2 py-2 text-center">
                      <div className="flex justify-center">
                        <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                      </div>
                    </td>
                    <td className="border border-border px-2 py-2">
                      {task.hasInput ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{task.inputLabel}</span>
                        </div>
                      ) : (
                        <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                      )}
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>

        {/* Post-Task Activities */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            POST-TASK ACTIVITIES
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-2">
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer">
                <Checkbox className="h-4 w-4" />
                <span>Tools removed from area</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer">
                <Checkbox className="h-4 w-4" />
                <span>Guards refitted</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer">
                <Checkbox className="h-4 w-4" />
                <span>Equipment returned to service</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer">
                <Checkbox className="h-4 w-4" />
                <span>Area cleaned / Housekeeping complete</span>
              </label>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Comment:</div>
          <div className="p-3">
            <Textarea className="min-h-[100px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        <Separator />

        {/* Sign Off Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Sign Off:</div>
          <div className="grid grid-cols-2 gap-0">
            <div className="border-r border-b border-border p-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Follow up work required:</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox /> Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox /> No
                  </label>
                </div>
              </div>
            </div>
            <div className="border-b border-border p-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Document update required:</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox /> Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox /> No
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Signature:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">PM Duration:</div>
              <div className="px-3 py-2"><Input className="h-7" placeholder="hrs" /></div>
            </div>
          </div>
        </div>

        {/* Approval Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Supervisor Approval:</div>
          <div className="grid grid-cols-3 gap-0">
            <div className="grid grid-cols-[60px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[50px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Sign:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[50px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
          </div>
        </div>

        {/* Revision History */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Revision History:</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-3 py-2 text-left font-medium w-[15%]">Revision No.</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[35%]">Description</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[15%]">Created</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[15%]">Reviewed</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[20%]">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">0</td>
                <td className="border border-border px-3 py-2">Initial Release</td>
                <td className="border border-border px-3 py-2"></td>
                <td className="border border-border px-3 py-2"></td>
                <td className="border border-border px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
