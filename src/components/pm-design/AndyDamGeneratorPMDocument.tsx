import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
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
  Thermometer,
  Flame,
  Battery
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
  { id: "mechanical", icon: <Cog className="w-4 h-4" />, label: "Mechanical" },
  { id: "thermal", icon: <Thermometer className="w-4 h-4" />, label: "Thermal" },
  { id: "fuel", icon: <Flame className="w-4 h-4" />, label: "Fire / Fuel" },
  { id: "electrical", icon: <Zap className="w-4 h-4" />, label: "Electrical" },
  { id: "pressure", icon: <CircleDot className="w-4 h-4" />, label: "Pressure" },
  { id: "battery", icon: <Battery className="w-4 h-4" />, label: "Battery Acid" },
];

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "",
    equipmentName: "Visual Running Checks",
    tasks: [
      { task: "Check all gauges" },
      { task: "Check Engine Protection Relay, record fault history, Engine Hours etc.", hasInput: true, inputLabel: "Engine Hours:" },
      { task: "Walk around Unit - Visually Inspect/Listen for Damage/Defects" },
      { task: "Open all doors - Visually Inspect/Listen for Damage/Defects i.e Excessive vibration, loose/rattling components or panels, leaking exhaust/Turbo etc." },
      { task: "Check Engine Guards are in place and compliant" },
      { task: "Push Emergency Stop Button to Shut Unit Down" },
      { task: "Check Exhaust Flap closes" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "Fire Extinguisher",
    tasks: [
      { task: "Check fire extinguisher charged and mounted securely" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "Electrical Offline",
    tasks: [
      { task: "Check battery Isolator is Operational & Lockable" },
      { task: "Check battery & battery Cabling" },
      { task: "Check battery terminals are tight and corrosion free" },
      { task: "Check condition of all battery, starter and alternator cables" },
      { task: "Check wiring harnesses are securely mounted and undamaged" },
      { task: "Check battery electrolyte level and that batteries are mounted securely" },
      { task: "Check Engine and Generator Mounts" },
      { task: "Check Generator Cabling - look for signs of damage, chaffing, secured etc." },
      { task: "Check Generator covers and guards are all in place" },
      { task: "Check Main Switch/ Circuit Breaker is Operational and Lockable" },
      { task: "Check Main Switch/ Circuit Breaker is Labelled" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "General",
    tasks: [
      { task: "Check all engine hoses, pipes and clamps for damage" },
      { task: "Check engine alternator and fan v-belt adjustment" },
      { task: "Check Engine alternator mounted securely" },
      { task: "Check for engine oil leaks" },
      { task: "Check fuel hoses mounted securely, replace any chafed or worn hoses" },
      { task: "Check/drain Fuel Filters" },
      { task: "Check all radiator hoses, clamps and coolant lines for deterioration or damage" },
      { task: "Check radiator for damage, blockage and leaks" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "Service Items",
    tasks: [
      { task: "Check outer air filter and clean if necessary" },
      { task: "Check/Top up Coolant level" },
      { task: "Check/Top up Engine Oil level" },
      { task: "Prestart Check, Close all doors & Restart" },
      { task: "Clean Pre-filter" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "Restart Unit - Electrical (Online)",
    tasks: [
      { task: "Check all gauges" },
      { task: "Check Engine Protection Relay" },
      { task: "Check operation of all emergency stop switches (if equipped)" },
    ]
  },
];

export const AndyDamGeneratorPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek - Andy Dam Generator</h1>
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
              <div className="px-2 py-1.5">Andy Dam Generator</div>
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
              <p className="font-medium mb-2">Weekly Running Inspection – Andy Dam Generator</p>
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
                  <span>Cleaning rag</span>
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
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Hearing Protection</span>
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
              <p>When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p>If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <p>Complete the inspection table below. Record each check with a tick in the appropriate box.</p>
            </div>
          </div>
        </div>

        {/* Inspection Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>
          
          {inspectionData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border-b border-border last:border-b-0">
              {/* Section Header */}
              <div className="bg-muted/50 px-4 py-2 border-b border-border">
                <div className="flex items-center gap-2">
                  {section.equipmentId && (
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {section.equipmentId}
                    </span>
                  )}
                  <span className="font-semibold text-sm">{section.equipmentName}</span>
                </div>
              </div>
              
              {/* Tasks Table */}
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-3 py-2 font-semibold border-r border-border w-[50%]">Task</th>
                    <th className="px-2 py-2 font-semibold border-r border-border w-[8%] text-center">Serviceable</th>
                    <th className="px-2 py-2 font-semibold border-r border-border w-[8%] text-center">Defective</th>
                    <th className="px-2 py-2 font-semibold border-r border-border w-[8%] text-center">Urgent</th>
                    <th className="text-left px-3 py-2 font-semibold border-r border-border w-[18%]">Comments</th>
                    <th className="text-left px-3 py-2 font-semibold w-[8%]">W/O</th>
                  </tr>
                </thead>
                <tbody>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={taskIndex} className="border-t border-border hover:bg-muted/20">
                      <td className="px-3 py-2 border-r border-border">
                        <div className="flex flex-col gap-1">
                          <span>{task.task}</span>
                          {task.hasInput && (
                            <Input 
                              className="h-6 text-xs mt-1 w-40" 
                              placeholder={task.inputLabel}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2 border-r border-border text-center">
                        <Checkbox className="h-4 w-4" />
                      </td>
                      <td className="px-2 py-2 border-r border-border text-center">
                        <Checkbox className="h-4 w-4" />
                      </td>
                      <td className="px-2 py-2 border-r border-border text-center">
                        <Checkbox className="h-4 w-4" />
                      </td>
                      <td className="px-3 py-2 border-r border-border">
                        <Input className="h-6 text-xs" />
                      </td>
                      <td className="px-3 py-2">
                        <Input className="h-6 text-xs" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Post-Task Activities */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            POST-TASK ACTIVITIES
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-3 text-sm">
                <Checkbox className="h-4 w-4" />
                <span>Work area cleaned and secured</span>
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Checkbox className="h-4 w-4" />
                <span>All guards replaced</span>
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Checkbox className="h-4 w-4" />
                <span>Tools accounted for</span>
              </label>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            COMMENTS
          </div>
          <div className="p-4">
            <Textarea 
              className="min-h-[80px] text-sm" 
              placeholder="Enter any additional comments, observations, or follow-up actions required..."
            />
          </div>
        </div>

        {/* Sign Off Section */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border">
            SIGN OFF
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-40">Follow up work required:</span>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox className="h-4 w-4" />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox className="h-4 w-4" />
                  <span>No</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-40">Document update required:</span>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox className="h-4 w-4" />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox className="h-4 w-4" />
                  <span>No</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name:</label>
                <Input className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Signature:</label>
                <Input className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Date:</label>
                <Input className="h-8 text-sm" type="date" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">PM Duration:</span>
              <Input className="h-8 text-sm w-32" placeholder="hrs" />
            </div>
          </div>
        </div>

        {/* Supervisor Approval */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            SUPERVISOR APPROVAL
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name:</label>
                <Input className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Signature:</label>
                <Input className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Date:</label>
                <Input className="h-8 text-sm" type="date" />
              </div>
            </div>
          </div>
        </div>

        {/* Revision History */}
        <div>
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            REVISION HISTORY
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-3 py-2 font-semibold border-r border-border">Rev No.</th>
                <th className="text-left px-3 py-2 font-semibold border-r border-border">Description</th>
                <th className="text-left px-3 py-2 font-semibold border-r border-border">Created</th>
                <th className="text-left px-3 py-2 font-semibold border-r border-border">Reviewed</th>
                <th className="text-left px-3 py-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-3 py-2 border-r border-border">0</td>
                <td className="px-3 py-2 border-r border-border">Initial Release</td>
                <td className="px-3 py-2 border-r border-border"></td>
                <td className="px-3 py-2 border-r border-border"></td>
                <td className="px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
