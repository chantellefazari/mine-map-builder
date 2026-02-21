import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { 
  AlertTriangle, 
  HardHat,
  FileText,
  User,
  Calendar,
  Wrench,
  Eye,
  Lock,
  AlertCircle,
  Info,
  Cog,
  Volume2,
  CircleDot,
  MoveHorizontal,
  Droplets
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface InspectionTask {
  task: string;
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
  { id: "mechanical", icon: <Cog className="w-4 h-4" />, label: "Mechanical" },
  { id: "noise", icon: <Volume2 className="w-4 h-4" />, label: "Noise" },
  { id: "pressure", icon: <CircleDot className="w-4 h-4" />, label: "Pressure" },
  { id: "pinch-points", icon: <MoveHorizontal className="w-4 h-4" />, label: "Pinch Points" },
  { id: "slurry", icon: <Droplets className="w-4 h-4" />, label: "Slurry/Wet" },
];

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "Tails Screen",
    equipmentName: "Tails Screen",
    tasks: [
      { task: "Check Screen operation" },
      { task: "Inspect Screen Springs" },
      { task: "Check Screen Discharge is not Blocked" },
      { task: "Check all pipework and valves for leaks" },
      { task: "Check Screen overflow is not blocked" },
      { task: "Check condition of sprays & piping" },
      { task: "Check Screens are not Pegged" },
    ]
  },
  {
    equipmentId: "Tails Pump A",
    equipmentName: "Tails Pump A",
    tasks: [
      { task: "Check pump for heat, noise and vibration" },
      { task: "Check Gland. Adjust if required" },
      { task: "Check Drive belts" },
      { task: "Grease pump XTB 2" },
      { task: "Check pipework" },
      { task: "Check guarding / Mounts" },
    ]
  },
  {
    equipmentId: "Tails Pump B",
    equipmentName: "Tails Pump B",
    tasks: [
      { task: "Check pump for heat, noise and vibration" },
      { task: "Check Gland. Adjust if required" },
      { task: "Check Drive belts" },
      { task: "Grease pump XTB 2" },
      { task: "Check pipework" },
      { task: "Check guarding / Mounts" },
    ]
  },
  {
    equipmentId: "CIP Sump Pump",
    equipmentName: "CIP Sump Pump",
    tasks: [
      { task: "Check pump for heat, noise and vibration" },
      { task: "Check Drive belts" },
      { task: "Grease pump XTB 2" },
      { task: "Check pipework" },
      { task: "Check guarding / Mounts" },
    ]
  },
  {
    equipmentId: "CIL Sump Pump",
    equipmentName: "CIL Sump Pump",
    tasks: [
      { task: "Check pump for heat, noise and vibration" },
      { task: "Check Drive belts" },
      { task: "Grease pump XTB 2" },
      { task: "Check pipework" },
      { task: "Check guarding / Mounts" },
    ]
  },
  {
    equipmentId: "General",
    equipmentName: "General",
    tasks: [
      { task: "Check all Hatches on Tanks for Leaks" },
      { task: "Check all Pipework and Valves for Leaks" },
      { task: "Look for hazards in the area" },
    ]
  },
];

export const BottomOfTanksPMDocument = () => {
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
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek CIL Tanks - Bottom of Tanks</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Running PMs - Weekly Inspection (Fitter)</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
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
              <div className="px-2 py-1.5">Bottom of Tanks</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Fitter (1 hr)</div>
            </div>
          </div>

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
              <p className="font-medium mb-2">Weekly Running Inspection – CIL Tanks Bottom of Tanks Area</p>
              <p className="text-muted-foreground">
                To safely carry out mechanical inspection of tails screen, pumps, and tank areas for signs of damage or potential failures that may require maintenance attention.
              </p>
            </div>
          </div>

          {/* Safety */}
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              SAFETY
            </div>
            <div className="px-4 py-3">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Before commencing this work complete a <strong>TAKE 5</strong> every time to check that no abnormal conditions exist.
                </p>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <HardHat className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Isolate equipment where required & ensure use of correct PPE.
                </p>
              </div>
              <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                <Lock className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-destructive">
                  Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.
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

        {/* Tools and PPE Section */}
        <div className="border-b border-border grid md:grid-cols-2">
          <div className="border-r border-border">
            <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              SPECIAL TOOLING REQUIRED
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Grease gun (XTB2)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Basic hand tools</span>
                </li>
              </ul>
            </div>
          </div>

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
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Hearing Protection</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Gloves (when required)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Procedure Section */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            PROCEDURE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed space-y-2">
            <p>1. Conduct area inspection as per tables below. Record each check with a tick in the appropriate box.</p>
            <p>2. When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.</p>
            <p>3. If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.</p>
          </div>
        </div>

        {/* Inspections Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            INSPECTIONS
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-2 py-2 text-left font-semibold w-[50%]">Task</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✓</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✗</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold w-[34%]">Comments</th>
                </tr>
              </thead>
              <tbody>
                {inspectionData.map((section, sectionIdx) => (
                  <>
                    <tr key={`section-${sectionIdx}`} className="bg-primary/10">
                      <td 
                        colSpan={4} 
                        className="border border-border px-2 py-2 font-semibold text-primary"
                      >
                        {section.equipmentName}
                      </td>
                    </tr>
                    {section.tasks.map((task, taskIdx) => (
                      <tr key={`task-${sectionIdx}-${taskIdx}`} className="hover:bg-muted/50">
                        <td className="border border-border px-2 py-2">{task.task}</td>
                        <td className="border border-border px-2 py-2 text-center">
                          <Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                        </td>
                        <td className="border border-border px-2 py-2 text-center">
                          <Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                        </td>
                        <td className="border border-border px-2 py-2">
                          <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            Comment:
          </div>
          <div className="p-4">
            <Textarea 
              placeholder="Enter comments here..."
              className="min-h-[80px] text-sm"
            />
          </div>
        </div>

        {/* Sign Off Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            Sign Off:
          </div>
          <div className="p-4 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Follow up work required:</span>
                <div className="flex gap-2">
                  <Checkbox id="followup-yes-bot" />
                  <label htmlFor="followup-yes-bot">Yes</label>
                  <Checkbox id="followup-no-bot" />
                  <label htmlFor="followup-no-bot">No</label>
                </div>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                <span className="text-muted-foreground">Name:</span>
                <div className="border-b border-border h-6"></div>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                <span className="text-muted-foreground">Date:</span>
                <div className="border-b border-border h-6"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Document update required:</span>
                <div className="flex gap-2">
                  <Checkbox id="update-yes-bot" />
                  <label htmlFor="update-yes-bot">Yes</label>
                  <Checkbox id="update-no-bot" />
                  <label htmlFor="update-no-bot">No</label>
                </div>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                <span className="text-muted-foreground">Signature:</span>
                <div className="border-b border-border h-6"></div>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                <span className="text-muted-foreground">PM Duration:</span>
                <div className="border-b border-border h-6"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            Approval:
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="grid grid-cols-[120px_1fr_80px_1fr_60px_1fr] gap-2 items-center">
              <span className="text-muted-foreground">Supervisor:</span>
              <div className="border-b border-border h-6"></div>
              <span className="text-muted-foreground text-right">Sign:</span>
              <div className="border-b border-border h-6"></div>
              <span className="text-muted-foreground text-right">Date:</span>
              <div className="border-b border-border h-6"></div>
            </div>
          </div>
        </div>

        {/* Revision History */}
        <div>
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            Revision History:
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border px-2 py-2 text-left font-semibold">Revision No.</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold">Description</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold">Created</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold">Reviewed</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-2 py-2">0</td>
                  <td className="border border-border px-2 py-2"></td>
                  <td className="border border-border px-2 py-2"></td>
                  <td className="border border-border px-2 py-2"></td>
                  <td className="border border-border px-2 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
