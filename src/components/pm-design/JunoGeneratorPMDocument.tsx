import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Eye,
  CheckCircle2,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

interface InspectionTask { task: string; hasInput?: boolean; inputLabel?: string; }
interface EquipmentSection { equipmentId: string; equipmentName: string; tasks: InspectionTask[]; }

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

export const JunoGeneratorPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek - Juno Generator</h1>
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
              <div className="px-2 py-1.5">Juno Generator</div>
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

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

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
