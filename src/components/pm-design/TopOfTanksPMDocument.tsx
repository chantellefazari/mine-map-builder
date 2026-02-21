import { useState } from "react";
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
    equipmentId: "5-TK-1",
    equipmentName: "Leach Tank 1 - Gearbox, Agitator 5-AG-1",
    tasks: [
      { task: "Check for leaks, vibration, noise" },
      { task: "Check agitator operation" },
      { task: "Check condition of launders" },
      { task: "Grease Gearbox" },
      { task: "Check condition of walkway mesh & handrails" },
      { task: "Visually check hold down bolts are tight" },
      { task: "HS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    ]
  },
  {
    equipmentId: "5-SC-01",
    equipmentName: "Trash Screen",
    tasks: [
      { task: "Check Screen Operation" },
      { task: "Visually check Screen Springs condition" },
      { task: "Check Discharge Pipe for Build up / Blockage" },
      { task: "Check all pipework and valves for leaks" },
      { task: "Check screen overflow is not blocked" },
      { task: "Check working condition of Spray bar" },
      { task: "Visually check Screen Vibrators operation, noise and fasteners" },
      { task: "Check Screens are not Pegged/blocked" },
    ]
  },
  {
    equipmentId: "5-TK-2",
    equipmentName: "Leach Tank 2 - Gearbox, Agitator 5-AG-2",
    tasks: [
      { task: "Check for leaks, vibration, noise" },
      { task: "Visually check hold down bolts are tight" },
      { task: "Check agitator operation" },
      { task: "Check condition of launders" },
      { task: "Grease Gearbox" },
      { task: "Check condition of walkway mesh & handrails" },
      { task: "HS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
      { task: "LS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
      { task: "Air Sparge Condition" },
    ]
  },
  {
    equipmentId: "50-AG-003-GB",
    equipmentName: "Gearbox, Agitator; CIP Tank #3",
    tasks: [
      { task: "Check for leaks, vibration, noise" },
      { task: "Check agitator operation" },
      { task: "Check condition of launders" },
      { task: "Grease Gearbox" },
      { task: "Check operation of airleg and pipework for leaks" },
      { task: "Check condition of walkway mesh & handrails" },
      { task: "Visually check hold down bolts are tight" },
      { task: "HS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
      { task: "LS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    ]
  },
  {
    equipmentId: "5-SC-10",
    equipmentName: "Loaded Carbon Screen",
    tasks: [
      { task: "Check Screen Operation" },
      { task: "Visually check Screen Springs condition" },
      { task: "Check Discharge Pipe for Build up / Blockage" },
      { task: "Check all pipework and valves for leaks" },
      { task: "Check screen overflow is not blocked" },
      { task: "Check working condition of Spray bar" },
      { task: "Visually check Screen Vibrators operation, noise and fasteners" },
      { task: "Check Screens are not Pegged/blocked" },
    ]
  },
  {
    equipmentId: "50-AG-004 to 008",
    equipmentName: "CIP Tanks #4-8 Gearboxes & Agitators",
    tasks: [
      { task: "Check for leaks, vibration, noise (all tanks)" },
      { task: "Check agitator operation (all tanks)" },
      { task: "Check condition of launders (all tanks)" },
      { task: "Grease all Gearboxes" },
      { task: "Check condition of walkway mesh & handrails (all tanks)" },
      { task: "Visually check hold down bolts are tight (all tanks)" },
      { task: "HS/LS gearbox bearing temperatures (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Record temps" },
      { task: "Air Sparge Condition (Tank 5)" },
    ]
  },
  {
    equipmentId: "8-SC2",
    equipmentName: "Carbon Sizing Screen",
    tasks: [
      { task: "Check Screen Operation" },
      { task: "Visually check Screen Springs condition" },
      { task: "Check Discharge Pipe for Build up / Blockage" },
      { task: "Check all pipework and valves for leaks" },
      { task: "Check screen overflow is not blocked" },
      { task: "Check working condition of Spray bar" },
      { task: "Visually check Screen Vibrators operation, noise and fasteners" },
      { task: "Check Screens are not Pegged/blocked" },
    ]
  },
  {
    equipmentId: "5-HT-1",
    equipmentName: "Gantry Crane 2.5t",
    tasks: [
      { task: "Check operation of crane" },
      { task: "Check Crane prestart book for any faults" },
      { task: "Inspect Crane hook for any damage" },
      { task: "Check lifting equipment is in test date" },
      { task: "Visually Check buzz bar / brackets" },
    ]
  },
  {
    equipmentId: "General",
    equipmentName: "General Inspections",
    tasks: [
      { task: "Inspect all walkway mesh and hold down clips" },
      { task: "Check all handrails" },
      { task: "Check Airleg air manifold for leaks or damage" },
    ]
  },
];

export const TopOfTanksPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek Leaching Area - CIL Circuit / Tailings</h1>
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
              <div className="px-2 py-1.5">CIP Circuit / Tailings</div>
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
          
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              SCOPE
            </div>
            <div className="px-4 py-3 text-sm leading-relaxed">
              <p className="font-medium mb-2">Weekly Running Area Inspection – Top of Tanks (CIL Circuit / Tailings)</p>
              <p className="text-muted-foreground">
                To safely carry out mechanical inspection for signs of damage or potential failures that may require maintenance attention.
              </p>
            </div>
          </div>

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
                  NOTE: Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.
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

        {/* Inspections */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          INSPECTIONS
        </div>

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
            <ClipboardCheck className="w-4 h-4 text-primary" />
            POST-TASK ACTIVITIES
          </div>
          <div className="px-4 py-3 text-sm space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox className="h-4 w-4 mt-0.5" />
              <span>Area left clean and tidy</span>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox className="h-4 w-4 mt-0.5" />
              <span>All tools accounted for</span>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox className="h-4 w-4 mt-0.5" />
              <span>Defects reported to supervisor</span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS:</div>
          <div className="p-3">
            <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        {/* Sign Off */}
        <div className="border-t border-border">
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">Sign-Off</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-2 text-left font-semibold">Checked By</th>
                  <th className="px-4 py-2 text-left font-semibold">Signature</th>
                  <th className="px-4 py-2 text-left font-semibold w-32">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2"><Input className="h-7 text-xs" /></td>
                  <td className="px-4 py-2"><div className="h-8 border border-border rounded bg-muted/30"></div></td>
                  <td className="px-4 py-2"><Input className="h-7 text-xs" type="date" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center">
          Tennant Creek Mining Operations – Processing Plant Inspection Form
        </div>
      </div>
    </div>
  );
};
