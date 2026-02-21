import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  Shield, 
  HardHat,
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Eye,
  Zap,
  CheckCircle2,
  Info
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

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "08-CM-001",
    equipmentName: "Acid Wash Column",
    tasks: [
      { task: "Check Column for any damage" },
      { task: "Check walkway, stairs, handrails for rust or damage" },
      { task: "Visual inspection of Pressure Safety valve (V147 - orange valve). If column under pressure, confirm valve is not leaking" },
    ]
  },
  {
    equipmentId: "08-PU-004",
    equipmentName: "HCL Acid Sump Pump",
    tasks: [
      { task: "Check valves and pipework for air leaks" },
      { task: "Check operation of pump" },
      { task: "Check condition of bund and operation of sump pump" },
    ]
  },
  {
    equipmentId: "08-PU-003",
    equipmentName: "HCL Acid Dosing Pump",
    tasks: [
      { task: "Check valves and pipework for air leaks" },
      { task: "Check operation of pump" },
    ]
  },
  {
    equipmentId: "08-CM-002",
    equipmentName: "Elution Column",
    tasks: [
      { task: "Check Column for any damage" },
      { task: "Check walkway, stairs, handrails for rust or damage" },
      { task: "Visual inspection of Pressure Safety valve (V116 - stainless steel valve). If column under pressure, confirm valve is not leaking" },
      { task: "Check condition of bund sump" },
    ]
  },
  {
    equipmentId: "08-PU-005",
    equipmentName: "Elution Column Sump Pump",
    tasks: [
      { task: "Check operation of sump pump" },
      { task: "Check pump for heat, noise and vibration" },
      { task: "Check condition of bund sump" },
    ]
  },
  {
    equipmentId: "08-BU-001",
    equipmentName: "Elution Burner",
    tasks: [
      { task: "Check overall burner external condition and clean any build up material or dust with a rag" },
    ]
  },
  {
    equipmentId: "08-HE-001",
    equipmentName: "Elution Heater",
    tasks: [
      { task: "Check pipework condition and look for leaks" },
      { task: "Visual inspection of Pressure Safety Valve (V177 - stainless steel valve) on inlet. Look for any rust penetrations, leaks on junctions or damages" },
      { task: "Visual inspection of Pressure Safety valve (V176 - stainless steel valve) on outlet. Look for any rust penetrations, leaks on junctions or damages" },
    ]
  },
  {
    equipmentId: "08-HX-001",
    equipmentName: "Elution Recovery Heat Exchanger",
    tasks: [
      { task: "Check inlet and outlet connection, look for leaks" },
      { task: "Look for any leaks on plate assembly" },
    ]
  },
  {
    equipmentId: "08-PU-001",
    equipmentName: "Eluate Pump",
    tasks: [
      { task: "Check pump condition" },
      { task: "Check pump for heat, noise and vibration" },
      { task: "Check inlet and outlet connection, look for leaks" },
    ]
  },
  {
    equipmentId: "08-TK-001",
    equipmentName: "Eluate Tank",
    tasks: [
      { task: "Check Tank for any damage or rust" },
      { task: "Check that the level gauge is indicating the fluid level in the tank" },
    ]
  },
  {
    equipmentId: "08-TK-002",
    equipmentName: "Diesel Day Tank",
    tasks: [
      { task: "Check overall tank condition. Look for any damage or rust" },
      { task: "Check Diesel Level", hasInput: true, inputLabel: "Diesel Level: _____%" },
      { task: "Check filter condition" },
    ]
  },
  {
    equipmentId: "08-PU-006",
    equipmentName: "Diesel Pump",
    tasks: [
      { task: "Check valves and pipework for air leaks" },
      { task: "Check operation of pump" },
    ]
  },
  {
    equipmentId: "08",
    equipmentName: "Pipework",
    tasks: [
      { task: "Check overall condition of pipe work, connections. Look for leaks" },
      { task: "Check overall condition of pressure and temperature gauges" },
      { task: "Check the condition of diesel lines. Look for leaks near the burner and at every pipe junction or valves" },
    ]
  },
];

export const AcidElutionPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek Elution Area - Acid Wash & Elution</h1>
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
              <div className="px-2 py-1.5">Elution</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Fitter (2 hrs)</div>
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
              <p className="font-medium mb-2">Weekly Running Area Inspection – Acid Wash & Elution Area</p>
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
                  Minimum PPE: Steel cap boots, hard hat, safety glasses. Gloves and hearing protection as per task or as required.
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
                <tr key={`section-${sectionIndex}`} className="bg-muted/50">
                  <td colSpan={4} className="border border-border px-3 py-2 font-bold text-primary">
                    {section.equipmentId} - {section.equipmentName}
                  </td>
                </tr>
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

        {/* Sign Off Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            Sign Off:
          </div>
          <div className="p-4 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Follow up work required:</span>
                <div className="flex gap-2">
                  <Checkbox id="followup-yes" />
                  <label htmlFor="followup-yes">Yes</label>
                  <Checkbox id="followup-no" />
                  <label htmlFor="followup-no">No</label>
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
                  <Checkbox id="update-yes" />
                  <label htmlFor="update-yes">Yes</label>
                  <Checkbox id="update-no" />
                  <label htmlFor="update-no">No</label>
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

        {/* Supervisor Approval */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            Supervisor Approval:
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground w-24">Name:</td>
                  <td className="py-2 border-b border-border"></td>
                  <td className="py-2 px-4 text-muted-foreground w-16">Sign:</td>
                  <td className="py-2 border-b border-border"></td>
                  <td className="py-2 px-4 text-muted-foreground w-16">Date:</td>
                  <td className="py-2 border-b border-border w-24"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Revision History */}
        <div>
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            Revision History:
          </div>
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
                <td className="border border-border px-2 py-2">Initial Release</td>
                <td className="border border-border px-2 py-2"></td>
                <td className="border border-border px-2 py-2"></td>
                <td className="border border-border px-2 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
