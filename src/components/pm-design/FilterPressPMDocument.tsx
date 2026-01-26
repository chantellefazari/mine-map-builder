import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  Shield, 
  HardHat,
  FileText,
  ClipboardCheck,
  User,
  Calendar
} from "lucide-react";

interface InspectionTask {
  task: string;
}

interface EquipmentSection {
  equipmentId: string;
  equipmentName: string;
  tasks: InspectionTask[];
}

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "13-FP-101",
    equipmentName: "Filter Press 1",
    tasks: [
      { task: "Check all Plate connection bolts and chains" },
      { task: "Check all Air actuated Rams, fittings and hoses for leaks and damage" },
      { task: "Check Plate slide for build up or damage" },
      { task: "Check all Guarding" },
    ]
  },
  {
    equipmentId: "13-FP-102",
    equipmentName: "Filter Press 2",
    tasks: [
      { task: "Check all Plate connection bolts and chains" },
      { task: "Check all Air actuated Rams, fittings and hoses for leaks and damage" },
      { task: "Check Plate slide for build up or damage" },
      { task: "Check all Guarding" },
    ]
  },
  {
    equipmentId: "13-CV-101",
    equipmentName: "Filter Press 1 Conveyor",
    tasks: [
      { task: "Check Head End Tail Drum Bearings for Noise or heat" },
      { task: "Check Tail end Bearings for heat or Noise" },
      { task: "Check Guarding" },
      { task: "Check all Rollers. Trough, Return and Guide" },
      { task: "Check Drive belts" },
      { task: "Check gearbox for unusual noise or Leaks" },
      { task: "Check Skirts Condition" },
      { task: "Inspect Condition of Conveyor Belt" },
    ]
  },
  {
    equipmentId: "13-CV-102",
    equipmentName: "Filter Press 2 Conveyor",
    tasks: [
      { task: "Check Head End Tail Drum Bearings for Noise or heat" },
      { task: "Check Tail end Bearings for heat or Noise" },
      { task: "Check Guarding" },
      { task: "Check all Rollers. Trough, Return and Guide" },
      { task: "Check Drive belts" },
      { task: "Check gearbox for unusual noise or Leaks" },
      { task: "Check Skirts Condition" },
      { task: "Inspect Condition of Conveyor Belt" },
    ]
  },
  {
    equipmentId: "13-CV-103",
    equipmentName: "Transfer Conveyor",
    tasks: [
      { task: "Check Head End Tail Drum Bearings for Noise or heat" },
      { task: "Check Tail end Bearings for heat or Noise" },
      { task: "Check Guarding" },
      { task: "Check all Rollers. Trough, Return and Guide" },
      { task: "Check Drive belts" },
      { task: "Check gearbox for unusual noise or Leaks" },
      { task: "Check Skirts Condition" },
      { task: "Inspect Condition of Conveyor Belt" },
    ]
  },
  {
    equipmentId: "13-CV-104",
    equipmentName: "Radial Conveyor",
    tasks: [
      { task: "Check Head End Tail Drum Bearings for Noise or heat" },
      { task: "Check Tail end Bearings for heat or Noise" },
      { task: "Check Guarding" },
      { task: "Check all Rollers. Trough, Return and Guide" },
      { task: "Check Drive belts" },
      { task: "Check gearbox for unusual noise or Leaks" },
      { task: "Check Skirts Condition" },
      { task: "Check Drive wheels" },
      { task: "Inspect Condition of Conveyor Belt" },
      { task: "Check Conveyor Turn Table" },
    ]
  },
  {
    equipmentId: "13-PU-101",
    equipmentName: "Filter Press Feed Pump 1",
    tasks: [
      { task: "Check Guarding/Mounts" },
      { task: "Check Pipework and Valves for leaks or Damage" },
      { task: "Check Drive Belts for any wear marks" },
      { task: "Check Oil Level" },
      { task: "Check gland leakage and adjust if required" },
    ]
  },
  {
    equipmentId: "13-PU-102",
    equipmentName: "Filter Press Feed Pump 2",
    tasks: [
      { task: "Check Guarding/Mounts" },
      { task: "Check Pipework and Valves for leaks or Damage" },
      { task: "Check Drive Belts for any wear marks" },
      { task: "Check Oil Level" },
      { task: "Check gland leakage and adjust if required" },
    ]
  },
  {
    equipmentId: "13-CP-100, 13-AR-101, 13-AR-102, 13-AR-103, 13-AR-104",
    equipmentName: "Filter Press Air Compressor and Air Receivers",
    tasks: [
      { task: "Clean Air Filter" },
      { task: "Clean Top Radiators" },
      { task: "Check oil level" },
      { task: "Check Auto Drains are operational" },
      { task: "Check Receivers for Leaks or Damage" },
      { task: "Check all Pipework and Valves for leaks or damage" },
    ]
  },
];

export const FilterPressPMDocument = () => {
  return (
    <div className="bg-white min-h-full">
      {/* Document Header */}
      <div className="border-2 border-foreground">
        {/* Title Banner */}
        <div className="bg-primary text-primary-foreground px-6 py-4 text-center">
          <h1 className="text-xl font-bold tracking-wide">Tenant Creek Filtration Area - Filter Press</h1>
          <p className="text-sm mt-1 opacity-90">Mechanical Running PMs - Daily Inspection (Fitter)</p>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-3 border-b border-foreground">
          {/* Left Column */}
          <div className="border-r border-foreground">
            <div className="grid grid-cols-[140px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Project / Site:
              </div>
              <div className="px-3 py-2 text-sm">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[140px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground">Plant Area Code:</div>
              <div className="px-3 py-2 text-sm">13</div>
            </div>
            <div className="grid grid-cols-[140px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground">Plant Area Desc.:</div>
              <div className="px-3 py-2 text-sm">Filter Press</div>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Resource/s:
              </div>
              <div className="px-3 py-2 text-sm">1x Fitter (1 hrs)</div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="border-r border-foreground">
            <div className="grid grid-cols-[100px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground">PM Mode:</div>
              <div className="px-3 py-2 text-sm">Running</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground">PM Group:</div>
              <div className="px-3 py-2 text-sm">Mechanical</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground">PM Type:</div>
              <div className="px-3 py-2 text-sm">Inspection (Fitter)</div>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Frequency:
              </div>
              <div className="px-3 py-2 text-sm font-medium">Daily</div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="grid grid-cols-[100px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground">Document No.:</div>
              <div className="px-3 py-2 text-sm"></div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground">Revision:</div>
              <div className="px-3 py-2 text-sm">0</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground">Day:</div>
              <div className="px-3 py-2 text-sm"></div>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <div className="bg-muted px-3 py-2 font-semibold text-sm border-r border-foreground">Date:</div>
              <div className="px-3 py-2 text-sm"></div>
            </div>
          </div>
        </div>

        {/* Procedure Section */}
        <div className="border-b border-foreground">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-foreground flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            Procedure:
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed">
            When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.
            <br />
            If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.
          </div>
        </div>

        {/* Safety Notes Section */}
        <div className="border-b border-foreground">
          <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">Safety Notes:</span>
          </div>
          <div className="px-4 py-3 bg-destructive/5">
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-destructive font-bold text-xs">1</span>
                </div>
                <p>Follow safety procedures at all times.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-destructive font-bold text-xs">2</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <p>Isolate equipment where required & ensure use of correct PPE.</p>
                  <HardHat className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-destructive font-bold text-xs">3</span>
                </div>
                <p>Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inspections Header */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-foreground flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          Inspections:
        </div>

        {/* Inspection Table */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-foreground px-3 py-2 text-left font-semibold w-[45%]">Task</th>
              <th className="border border-foreground px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
              <th className="border border-foreground px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
              <th className="border border-foreground px-2 py-2 text-center font-semibold w-[10%]">Urgent Attention</th>
              <th className="border border-foreground px-3 py-2 text-left font-semibold w-[20%]">Comments</th>
              <th className="border border-foreground px-2 py-2 text-center font-semibold w-[5%]">Corrective W/O</th>
            </tr>
          </thead>
          <tbody>
            {inspectionData.map((section, sectionIndex) => (
              <>
                {/* Equipment Header Row */}
                <tr key={`section-${sectionIndex}`} className="bg-muted/50">
                  <td colSpan={6} className="border border-foreground px-3 py-2 font-bold text-primary">
                    {section.equipmentId} - {section.equipmentName}
                  </td>
                </tr>
                {/* Task Rows */}
                {section.tasks.map((task, taskIndex) => (
                  <tr key={`task-${sectionIndex}-${taskIndex}`} className="hover:bg-muted/30">
                    <td className="border border-foreground px-3 py-2">{task.task}</td>
                    <td className="border border-foreground px-2 py-2 text-center">
                      <div className="flex justify-center">
                        <Checkbox className="h-5 w-5" />
                      </div>
                    </td>
                    <td className="border border-foreground px-2 py-2 text-center">
                      <div className="flex justify-center">
                        <Checkbox className="h-5 w-5" />
                      </div>
                    </td>
                    <td className="border border-foreground px-2 py-2 text-center">
                      <div className="flex justify-center">
                        <Checkbox className="h-5 w-5" />
                      </div>
                    </td>
                    <td className="border border-foreground px-2 py-2">
                      <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                    </td>
                    <td className="border border-foreground px-2 py-2 text-center">
                      <Input className="h-7 w-16 text-xs mx-auto" placeholder="" />
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>

        {/* Comments Section */}
        <div className="border-t border-foreground">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-foreground">Comment:</div>
          <div className="p-3">
            <Textarea className="min-h-[100px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        <Separator />

        {/* Sign Off Section */}
        <div className="border-t border-foreground">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-foreground">Sign Off:</div>
          <div className="grid grid-cols-2 gap-0">
            <div className="border-r border-b border-foreground p-3">
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
            <div className="border-b border-foreground p-3">
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
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-foreground">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-foreground">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-foreground">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-foreground">Signature:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-foreground">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-foreground">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-foreground">PM Duration:</div>
              <div className="px-3 py-2"><Input className="h-7" placeholder="hrs" /></div>
            </div>
          </div>
        </div>

        {/* Approval Section */}
        <div className="border-t border-foreground">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-foreground">Approval:</div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr>
                <td className="border border-foreground bg-muted px-3 py-2 font-medium w-[20%]">Supervisor:</td>
                <td className="border border-foreground px-3 py-2 w-[30%]">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Name:</span>
                    <Input className="h-7 flex-1" />
                  </div>
                </td>
                <td className="border border-foreground px-3 py-2 w-[25%]">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Sign:</span>
                    <Input className="h-7 flex-1" />
                  </div>
                </td>
                <td className="border border-foreground px-3 py-2 w-[25%]">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Date:</span>
                    <Input className="h-7 flex-1" type="date" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-foreground bg-muted px-3 py-2 font-medium">Superintendent/Manager:</td>
                <td className="border border-foreground px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Name:</span>
                    <Input className="h-7 flex-1" />
                  </div>
                </td>
                <td className="border border-foreground px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Sign:</span>
                    <Input className="h-7 flex-1" />
                  </div>
                </td>
                <td className="border border-foreground px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">Date:</span>
                    <Input className="h-7 flex-1" type="date" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Revision History */}
        <div className="border-t border-foreground">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-foreground">Revision History:</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-foreground px-3 py-2 text-left font-medium w-[15%]">Revision No.</th>
                <th className="border border-foreground px-3 py-2 text-left font-medium w-[35%]">Description</th>
                <th className="border border-foreground px-3 py-2 text-left font-medium w-[15%]">Created</th>
                <th className="border border-foreground px-3 py-2 text-left font-medium w-[15%]">Reviewed</th>
                <th className="border border-foreground px-3 py-2 text-left font-medium w-[20%]">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-foreground px-3 py-2">0</td>
                <td className="border border-foreground px-3 py-2">Initial Release</td>
                <td className="border border-foreground px-3 py-2"></td>
                <td className="border border-foreground px-3 py-2"></td>
                <td className="border border-foreground px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
